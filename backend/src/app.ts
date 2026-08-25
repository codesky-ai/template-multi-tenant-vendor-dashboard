import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes';
import { testConnection } from './config/database';

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء تطبيق Express
const app = express();

// إعداد الأمان - Security Configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // تعطيل CSP لتجنب مشاكل تطوير التطبيق
}));

// إعداد CORS لدعم الواجهة الأمامية
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: (process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,OPTIONS').split(','),
  credentials: process.env.CORS_CREDENTIALS === 'true',
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Current-Page', 'X-Total-Pages']
}));

// إعداد ضغط البيانات
app.use(compression());

// إعداد تسجيل الطلبات
const logFormat = process.env.LOG_FORMAT || 'combined';
app.use(morgan(logFormat));

// إعداد تحديد معدل الطلبات
const rateLimitConfig = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 دقيقة
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // حد أقصى 100 طلب لكل IP
  message: {
    success: false,
    error: 'تم تجاوز الحد الأقصى لعدد الطلبات. يرجى المحاولة لاحقاً',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // استثناء مسارات معينة من تحديد المعدل
  skip: (req) => {
    return req.path === '/api/health' || req.path === '/api/info';
  }
});

app.use(rateLimitConfig);

// إعداد تحليل JSON مع دعم UTF-8
app.use(express.json({
  limit: '10mb',
  type: 'application/json'
}));

// إعداد تحليل البيانات المرسلة من النماذج
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// إضافة headers للدعم العربي
app.use((req: Request, res: Response, next: NextFunction) => {
  // إضافة دعم UTF-8 والاتجاه من اليمين لليسار
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Language', 'ar');
  res.setHeader('X-Text-Direction', 'rtl');

  // إضافة timestamps لجميع الاستجابات
  req.requestTime = new Date().toISOString();

  next();
});

// middleware للتحقق من صحة JSON
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'بيانات JSON غير صحيحة',
      details: 'تحقق من تنسيق البيانات المرسلة'
    });
  }
  next();
});

// الصفحة الرئيسية للAPI
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      message: 'مرحباً بك في API لوحة تحكم الموردين',
      welcomeMessage: 'Welcome to Suppliers Dashboard API',
      version: '1.0.0',
      language: 'العربية (Arabic)',
      charset: 'UTF-8',
      direction: 'RTL',
      endpoints: {
        api: '/api',
        health: '/api/health',
        info: '/api/info',
        suppliers: '/api/suppliers',
        dashboard: '/api/dashboard'
      },
      documentation: {
        swagger: '/api/docs',
        postman: '/api/postman.json'
      },
      support: {
        email: 'support@suppliers-dashboard.com',
        docs: 'https://docs.suppliers-dashboard.com'
      },
      timestamp: req.requestTime
    }
  });
});

// تسجيل مسارات API
app.use('/api', routes);

// معالج الأخطاء العامة
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ خطأ غير متوقع:', error);

  // تحديد نوع الخطأ ورسالة مناسبة
  let statusCode = 500;
  let errorMessage = 'خطأ داخلي في الخادم';

  if (error.code === 'ECONNREFUSED') {
    statusCode = 503;
    errorMessage = 'لا يمكن الاتصال بقاعدة البيانات';
  } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    statusCode = 503;
    errorMessage = 'خطأ في صلاحية قاعدة البيانات';
  } else if (error.code === 'ER_NO_SUCH_TABLE') {
    statusCode = 503;
    errorMessage = 'جدول قاعدة البيانات غير موجود';
  } else if (error.message) {
    errorMessage = error.message;
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    timestamp: req.requestTime,
    requestId: req.headers['x-request-id'] || 'unknown',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// معالج المسارات غير الموجودة
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'المسار غير موجود',
    requestedUrl: req.originalUrl,
    method: req.method,
    timestamp: req.requestTime,
    suggestions: [
      'تحقق من صحة الرابط',
      'راجع وثائق API في /api/info',
      'تأكد من استخدام الطريقة الصحيحة (GET, POST, PUT, DELETE)'
    ]
  });
});

// اختبار الاتصال بقاعدة البيانات عند بدء التطبيق
const initializeDatabase = async () => {
  try {
    await testConnection();
    console.log('✅ تم إعداد قاعدة البيانات بنجاح');
  } catch (error) {
    console.error('❌ فشل في إعداد قاعدة البيانات:', error);
    // لا نوقف التطبيق، سنعتمد على البيانات التجريبية في الواجهة الأمامية
  }
};

// تشغيل إعداد قاعدة البيانات
initializeDatabase();

// إضافة دعم graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 إيقاف التطبيق...');
  // يمكن إضافة تنظيف الموارد هنا
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 إيقاف التطبيق (Ctrl+C)...');
  process.exit(0);
});

// تصدير التطبيق
export default app;