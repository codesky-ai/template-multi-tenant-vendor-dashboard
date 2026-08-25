import { Request, Response } from 'express';
import { executeQuery } from '../config/database';
import { RowDataPacket } from 'mysql2';

// واجهة الاستجابة المعيارية
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// إرسال استجابة نجاح
const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  res.status(statusCode).json(response);
};

// إرسال استجابة خطأ
const sendError = (res: Response, error: string, statusCode = 500): void => {
  const response: ApiResponse = {
    success: false,
    error
  };
  res.status(statusCode).json(response);
};

// واجهة إحصائيات لوحة التحكم
interface DashboardStats {
  totalSuppliers: number;
  activeSuppliers: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: number;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

// واجهة إحصائيات شهرية
interface MonthlyStats {
  month: string;
  suppliers: number;
  orders: number;
  revenue: number;
}

// جلب إحصائيات لوحة التحكم الرئيسية
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📊 جلب إحصائيات لوحة التحكم الرئيسية');

    // جلب إجمالي الموردين
    const [totalSuppliersResult] = await executeQuery<RowDataPacket>(`
      SELECT COUNT(*) as total FROM suppliers
    `);
    const totalSuppliers = totalSuppliersResult[0]?.total || 0;

    // جلب الموردين النشطين
    const [activeSuppliersResult] = await executeQuery<RowDataPacket>(`
      SELECT COUNT(*) as active FROM suppliers WHERE status = 'نشط'
    `);
    const activeSuppliers = activeSuppliersResult[0]?.active || 0;

    // جلب إجمالي الطلبات (محاكاة - يمكن إضافة جدول الطلبات لاحقاً)
    const totalOrders = Math.floor(totalSuppliers * 2.5); // متوسط طلبات لكل مورد

    // حساب إجمالي القيمة
    const [revenueResult] = await executeQuery<RowDataPacket>(`
      SELECT SUM(total_value) as totalRevenue FROM suppliers
    `);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // حساب النمو الشهري (محاكاة)
    const [currentMonthSuppliersResult] = await executeQuery<RowDataPacket>(`
      SELECT COUNT(*) as currentMonth FROM suppliers
      WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())
    `);
    const currentMonthSuppliers = currentMonthSuppliersResult[0]?.currentMonth || 0;

    const [lastMonthSuppliersResult] = await executeQuery<RowDataPacket>(`
      SELECT COUNT(*) as lastMonth FROM suppliers
      WHERE MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND YEAR(created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
    `);
    const lastMonthSuppliers = lastMonthSuppliersResult[0]?.lastMonth || 1; // تجنب القسمة على صفر

    const monthlyGrowth = ((currentMonthSuppliers - lastMonthSuppliers) / lastMonthSuppliers) * 100;

    // جلب أهم الفئات
    const [categoriesResult] = await executeQuery<RowDataPacket>(`
      SELECT
        category,
        COUNT(*) as count,
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM suppliers)) as percentage
      FROM suppliers
      GROUP BY category
      ORDER BY count DESC
      LIMIT 5
    `);

    const topCategories = categoriesResult.map(row => ({
      category: row.category,
      count: row.count,
      percentage: parseFloat(row.percentage?.toFixed(1) || '0')
    }));

    const stats: DashboardStats = {
      totalSuppliers,
      activeSuppliers,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      monthlyGrowth: parseFloat(monthlyGrowth.toFixed(1)),
      topCategories
    };

    sendSuccess(res, stats, 'تم جلب إحصائيات لوحة التحكم بنجاح');

  } catch (error: any) {
    console.error('❌ خطأ في جلب إحصائيات لوحة التحكم:', error.message);
    sendError(res, 'فشل في جلب إحصائيات لوحة التحكم');
  }
};

// جلب الإحصائيات الشهرية
export const getMonthlyStats = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📈 جلب الإحصائيات الشهرية');

    // جلب الإحصائيات لآخر 12 شهر
    const [monthlyResult] = await executeQuery<RowDataPacket>(`
      WITH RECURSIVE months AS (
        SELECT
          DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 11 MONTH), '%Y-%m') as month_key,
          DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 11 MONTH), '%M %Y') as month_name,
          11 as month_offset
        UNION ALL
        SELECT
          DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL month_offset - 1 MONTH), '%Y-%m'),
          DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL month_offset - 1 MONTH), '%M %Y'),
          month_offset - 1
        FROM months
        WHERE month_offset > 0
      )
      SELECT
        m.month_name as month,
        COALESCE(COUNT(s.id), 0) as suppliers,
        COALESCE(COUNT(s.id) * 2, 0) as orders,
        COALESCE(SUM(s.total_value), 0) as revenue
      FROM months m
      LEFT JOIN suppliers s ON DATE_FORMAT(s.created_at, '%Y-%m') = m.month_key
      GROUP BY m.month_key, m.month_name
      ORDER BY m.month_key
    `);

    const monthlyStats: MonthlyStats[] = monthlyResult.map(row => ({
      month: row.month,
      suppliers: row.suppliers || 0,
      orders: row.orders || 0,
      revenue: parseFloat((row.revenue || 0).toFixed(2))
    }));

    sendSuccess(res, monthlyStats, 'تم جلب الإحصائيات الشهرية بنجاح');

  } catch (error: any) {
    console.error('❌ خطأ في جلب الإحصائيات الشهرية:', error.message);
    sendError(res, 'فشل في جلب الإحصائيات الشهرية');
  }
};

// جلب إحصائيات الأداء
export const getPerformanceStats = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📊 جلب إحصائيات الأداء');

    // أفضل الموردين من ناحية التقييم
    const [topRatedResult] = await executeQuery<RowDataPacket>(`
      SELECT
        id, name, rating, total_orders, total_value
      FROM suppliers
      WHERE status = 'نشط' AND rating > 0
      ORDER BY rating DESC, total_value DESC
      LIMIT 5
    `);

    // أفضل الموردين من ناحية الطلبات
    const [topOrdersResult] = await executeQuery<RowDataPacket>(`
      SELECT
        id, name, rating, total_orders, total_value
      FROM suppliers
      WHERE status = 'نشط'
      ORDER BY total_orders DESC, total_value DESC
      LIMIT 5
    `);

    // أفضل الموردين من ناحية القيمة
    const [topValueResult] = await executeQuery<RowDataPacket>(`
      SELECT
        id, name, rating, total_orders, total_value
      FROM suppliers
      WHERE status = 'نشط'
      ORDER BY total_value DESC, total_orders DESC
      LIMIT 5
    `);

    // إحصائيات الحالات
    const [statusStatsResult] = await executeQuery<RowDataPacket>(`
      SELECT
        status,
        COUNT(*) as count,
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM suppliers)) as percentage
      FROM suppliers
      GROUP BY status
      ORDER BY count DESC
    `);

    const performanceStats = {
      topRatedSuppliers: topRatedResult.map(row => ({
        id: row.id.toString(),
        name: row.name,
        rating: parseFloat(row.rating.toFixed(1)),
        totalOrders: row.total_orders,
        totalValue: parseFloat(row.total_value.toFixed(2))
      })),
      topOrdersSuppliers: topOrdersResult.map(row => ({
        id: row.id.toString(),
        name: row.name,
        rating: parseFloat(row.rating.toFixed(1)),
        totalOrders: row.total_orders,
        totalValue: parseFloat(row.total_value.toFixed(2))
      })),
      topValueSuppliers: topValueResult.map(row => ({
        id: row.id.toString(),
        name: row.name,
        rating: parseFloat(row.rating.toFixed(1)),
        totalOrders: row.total_orders,
        totalValue: parseFloat(row.total_value.toFixed(2))
      })),
      statusDistribution: statusStatsResult.map(row => ({
        status: row.status,
        count: row.count,
        percentage: parseFloat(row.percentage?.toFixed(1) || '0')
      }))
    };

    sendSuccess(res, performanceStats, 'تم جلب إحصائيات الأداء بنجاح');

  } catch (error: any) {
    console.error('❌ خطأ في جلب إحصائيات الأداء:', error.message);
    sendError(res, 'فشل في جلب إحصائيات الأداء');
  }
};

// جلب ملخص سريع
export const getQuickSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('⚡ جلب الملخص السريع');

    // إحصائيات اليوم
    const [todayStatsResult] = await executeQuery<RowDataPacket>(`
      SELECT
        COUNT(*) as newSuppliersToday,
        COALESCE(SUM(total_value), 0) as totalValueToday
      FROM suppliers
      WHERE DATE(created_at) = CURDATE()
    `);

    // إحصائيات الأسبوع
    const [weekStatsResult] = await executeQuery<RowDataPacket>(`
      SELECT
        COUNT(*) as newSuppliersWeek,
        COALESCE(SUM(total_value), 0) as totalValueWeek
      FROM suppliers
      WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)
    `);

    // متوسط التقييم
    const [avgRatingResult] = await executeQuery<RowDataPacket>(`
      SELECT AVG(rating) as avgRating FROM suppliers WHERE rating > 0
    `);

    // الموردين الذين يحتاجون متابعة (تقييم منخفض أو لا يوجد طلبات)
    const [needsAttentionResult] = await executeQuery<RowDataPacket>(`
      SELECT COUNT(*) as needsAttention FROM suppliers
      WHERE (rating < 3 AND rating > 0) OR total_orders = 0 OR status = 'معلق'
    `);

    const quickSummary = {
      today: {
        newSuppliers: todayStatsResult[0]?.newSuppliersToday || 0,
        totalValue: parseFloat((todayStatsResult[0]?.totalValueToday || 0).toFixed(2))
      },
      week: {
        newSuppliers: weekStatsResult[0]?.newSuppliersWeek || 0,
        totalValue: parseFloat((weekStatsResult[0]?.totalValueWeek || 0).toFixed(2))
      },
      averageRating: parseFloat((avgRatingResult[0]?.avgRating || 0).toFixed(1)),
      suppliersNeedingAttention: needsAttentionResult[0]?.needsAttention || 0
    };

    sendSuccess(res, quickSummary, 'تم جلب الملخص السريع بنجاح');

  } catch (error: any) {
    console.error('❌ خطأ في جلب الملخص السريع:', error.message);
    sendError(res, 'فشل في جلب الملخص السريع');
  }
};

// جلب البيانات للرسوم البيانية
export const getChartsData = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📈 جلب بيانات الرسوم البيانية');

    // بيانات توزيع الفئات
    const [categoriesData] = await executeQuery<RowDataPacket>(`
      SELECT
        category,
        COUNT(*) as count,
        AVG(rating) as avgRating,
        SUM(total_value) as totalValue
      FROM suppliers
      GROUP BY category
      ORDER BY count DESC
    `);

    // بيانات توزيع التقييمات
    const [ratingsData] = await executeQuery<RowDataPacket>(`
      SELECT
        CASE
          WHEN rating >= 4.5 THEN 'ممتاز (4.5+)'
          WHEN rating >= 4.0 THEN 'جيد جداً (4.0-4.4)'
          WHEN rating >= 3.0 THEN 'جيد (3.0-3.9)'
          WHEN rating >= 2.0 THEN 'مقبول (2.0-2.9)'
          WHEN rating > 0 THEN 'ضعيف (< 2.0)'
          ELSE 'غير مُقيم'
        END as ratingRange,
        COUNT(*) as count
      FROM suppliers
      GROUP BY ratingRange
      ORDER BY MIN(rating) DESC
    `);

    // بيانات الموردين الجدد (آخر 7 أيام)
    const [newSuppliersData] = await executeQuery<RowDataPacket>(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM suppliers
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const chartsData = {
      categories: categoriesData.map(row => ({
        category: row.category,
        count: row.count,
        avgRating: parseFloat((row.avgRating || 0).toFixed(1)),
        totalValue: parseFloat((row.totalValue || 0).toFixed(2))
      })),
      ratings: ratingsData.map(row => ({
        range: row.ratingRange,
        count: row.count
      })),
      newSuppliers: newSuppliersData.map(row => ({
        date: row.date,
        count: row.count
      }))
    };

    sendSuccess(res, chartsData, 'تم جلب بيانات الرسوم البيانية بنجاح');

  } catch (error: any) {
    console.error('❌ خطأ في جلب بيانات الرسوم البيانية:', error.message);
    sendError(res, 'فشل في جلب بيانات الرسوم البيانية');
  }
};