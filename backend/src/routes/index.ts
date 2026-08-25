import { Router } from 'express';
import {
  getAllSuppliers,
  getSupplierById,
  searchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getTopSuppliers,
  updateSupplierRating,
  getSuppliersStats
} from '../controllers/supplierController';

import {
  getDashboardStats,
  getMonthlyStats,
  getPerformanceStats,
  getQuickSummary,
  getChartsData
} from '../controllers/dashboardController';

// إنشاء راوتر رئيسي
const router = Router();

// مسارات الموردين - Suppliers Routes
const suppliersRouter = Router();

// GET /api/suppliers - جلب جميع الموردين
suppliersRouter.get('/', getAllSuppliers);

// GET /api/suppliers/search - البحث في الموردين
suppliersRouter.get('/search', searchSuppliers);

// GET /api/suppliers/top - جلب أفضل الموردين
suppliersRouter.get('/top', getTopSuppliers);

// GET /api/suppliers/stats - إحصائيات الموردين
suppliersRouter.get('/stats', getSuppliersStats);

// GET /api/suppliers/:id - جلب مورد واحد
suppliersRouter.get('/:id', getSupplierById);

// POST /api/suppliers - إنشاء مورد جديد
suppliersRouter.post('/', createSupplier);

// PUT /api/suppliers/:id - تحديث مورد
suppliersRouter.put('/:id', updateSupplier);

// PATCH /api/suppliers/:id/rating - تحديث تقييم المورد
suppliersRouter.patch('/:id/rating', updateSupplierRating);

// DELETE /api/suppliers/:id - حذف مورد
suppliersRouter.delete('/:id', deleteSupplier);

// مسارات لوحة التحكم - Dashboard Routes
const dashboardRouter = Router();

// GET /api/dashboard/stats - إحصائيات لوحة التحكم الرئيسية
dashboardRouter.get('/stats', getDashboardStats);

// GET /api/dashboard/monthly - الإحصائيات الشهرية
dashboardRouter.get('/monthly', getMonthlyStats);

// GET /api/dashboard/performance - إحصائيات الأداء
dashboardRouter.get('/performance', getPerformanceStats);

// GET /api/dashboard/summary - الملخص السريع
dashboardRouter.get('/summary', getQuickSummary);

// GET /api/dashboard/charts - بيانات الرسوم البيانية
dashboardRouter.get('/charts', getChartsData);

// مسارات الشركات - Companies Routes (للمستقبل)
const companiesRouter = Router();

// GET /api/companies - جلب جميع الشركات
companiesRouter.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'مسار الشركات قيد التطوير'
  });
});

// GET /api/companies/:id - جلب شركة واحدة
companiesRouter.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'مسار تفاصيل الشركة قيد التطوير'
  });
});

// مسارات الطلبات - Orders Routes (للمستقبل)
const ordersRouter = Router();

// GET /api/orders - جلب جميع الطلبات
ordersRouter.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'مسار الطلبات قيد التطوير'
  });
});

// GET /api/orders/supplier/:supplierId - جلب طلبات مورد معين
ordersRouter.get('/supplier/:supplierId', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'مسار طلبات المورد قيد التطوير'
  });
});

// مسار الحالة الصحية للAPI - Health Check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    },
    message: 'API يعمل بشكل طبيعي'
  });
});

// مسار معلومات الAPI - API Info
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Suppliers Dashboard API',
      nameArabic: 'واجهة برمجة تطبيقات لوحة تحكم الموردين',
      version: '1.0.0',
      description: 'API لإدارة الموردين والشركات مع دعم اللغة العربية',
      endpoints: {
        suppliers: '/api/suppliers',
        dashboard: '/api/dashboard',
        companies: '/api/companies',
        orders: '/api/orders'
      },
      documentation: 'https://localhost:3001/api/docs',
      language: 'Arabic (العربية)',
      charset: 'UTF-8',
      direction: 'RTL'
    },
    message: 'معلومات API'
  });
});

// تسجيل المسارات
router.use('/suppliers', suppliersRouter);
router.use('/dashboard', dashboardRouter);
router.use('/companies', companiesRouter);
router.use('/orders', ordersRouter);

// مسار غير موجود - 404 Handler
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'المسار غير موجود',
    requestedPath: req.originalUrl,
    availablePaths: [
      '/api/health',
      '/api/info',
      '/api/suppliers',
      '/api/dashboard',
      '/api/companies',
      '/api/orders'
    ]
  });
});

export default router;