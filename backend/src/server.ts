import app from './app';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// تحديد المنفذ
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// إضافة أنواع لـ Express Request
declare global {
  namespace Express {
    interface Request {
      requestTime?: string;
    }
  }
}

// بدء الخادم
const server = app.listen(PORT, () => {
  console.log('
🚀 ═══════════════════════════════════════════════════════════');
  console.log('🏢 خادم API لوحة تحكم الموردين');
  console.log('🌐 Suppliers Dashboard API Server');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📍 الخادم يعمل على: http://localhost:${PORT}`);
  console.log(`🌍 البيئة: ${NODE_ENV}`);
  console.log(`📅 وقت البدء: ${new Date().toLocaleString('ar-SA')}`);
  console.log(`🔗 API Endpoints:`);
  console.log(`   • الصفحة الرئيسية: http://localhost:${PORT}/`);
  console.log(`   • حالة الخادم: http://localhost:${PORT}/api/health`);
  console.log(`   • معلومات API: http://localhost:${PORT}/api/info`);
  console.log(`   • الموردون: http://localhost:${PORT}/api/suppliers`);
  console.log(`   • لوحة التحكم: http://localhost:${PORT}/api/dashboard/stats`);
  console.log('═══════════════════════════════════════════════════════════
');

  // عرض معلومات إضافية في بيئة التطوير
  if (NODE_ENV === 'development') {
    console.log('🔧 وضع التطوير مُفعّل');
    console.log('🌐 CORS مُفعّل للواجهة الأمامية على: http://localhost:3000');
    console.log('📝 تسجيل الطلبات مُفعّل');
    console.log('⚡ إعادة التحميل التلقائي مُفعّلة');
    console.log('');
  }

  // نصائح للاستخدام
  console.log('💡 نصائح للاستخدام:');
  console.log('   • تأكد من تشغيل MySQL Server');
  console.log('   • راجع ملف .env للإعدادات');
  console.log('   • استخدم /api/health للتحقق من حالة النظام');
  console.log('   • البيانات التجريبية متوفرة في الواجهة الأمامية');
  console.log('');
});

// معالجة إشارات إيقاف النظام
const gracefulShutdown = (signal: string) => {
  console.log(`
📢 تم استقبال إشارة ${signal}. بدء الإغلاق الآمن...`);

  server.close((err) => {
    if (err) {
      console.error('❌ خطأ أثناء إغلاق الخادم:', err);
      process.exit(1);
    }

    console.log('✅ تم إغلاق الخادم بأمان');
    console.log('👋 مع السلامة!');
    process.exit(0);
  });

  // إجبار الإغلاق بعد 10 ثوانٍ
  setTimeout(() => {
    console.error('⏰ انتهت مهلة الإغلاق الآمن. إجبار الإغلاق...');
    process.exit(1);
  }, 10000);
};

// تسجيل معالجات الإشارات
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// معالجة الأخطاء غير المتوقعة
process.on('uncaughtException', (error) => {
  console.error('💥 خطأ غير متوقع:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 رفض غير معالج في:', promise, 'السبب:', reason);
  process.exit(1);
});

// معلومات النظام
console.log('ℹ️ معلومات النظام:');
console.log(`   • Node.js: ${process.version}`);
console.log(`   • Platform: ${process.platform}`);
console.log(`   • Architecture: ${process.arch}`);
console.log(`   • Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
console.log(`   • Process ID: ${process.pid}`);
console.log('');

export default server;