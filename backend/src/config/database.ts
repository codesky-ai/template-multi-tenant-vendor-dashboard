import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

// إعدادات قاعدة البيانات مع دعم الترميز العربي
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'suppliers_dashboard_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',
  timezone: '+00:00',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// إنشاء مجموعة اتصالات MySQL
let pool: mysql.Pool | null = null;

export const createPool = (): mysql.Pool => {
  if (!pool) {
    console.log('🔄 إنشاء مجموعة اتصالات قاعدة البيانات...');
    pool = mysql.createPool(dbConfig);

    // اختبار الاتصال
    testConnection();
  }
  return pool;
};

// اختبار الاتصال بقاعدة البيانات
export const testConnection = async (): Promise<void> => {
  try {
    if (!pool) {
      pool = createPool();
    }

    const connection = await pool.getConnection();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // اختبار الترميز العربي
    const [rows] = await connection.execute('SELECT @@character_set_database, @@collation_database');
    console.log('📝 إعدادات الترميز:', rows);

    connection.release();
  } catch (error: any) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error.message);
    console.error('🔧 تحقق من إعدادات قاعدة البيانات في ملف .env');

    // نصائح لحل المشاكل الشائعة
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 تحقق من اسم المستخدم وكلمة المرور');
    } else if (error.code === 'ENOTFOUND') {
      console.error('💡 تحقق من عنوان الخادم');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 تأكد من تشغيل خادم MySQL');
    }
  }
};

// الحصول على اتصال من المجموعة
export const getConnection = async (): Promise<mysql.PoolConnection> => {
  if (!pool) {
    pool = createPool();
  }
  return await pool.getConnection();
};

// تنفيذ استعلام مع معالجة الأخطاء
export const executeQuery = async <T = any>(
  query: string,
  params: any[] = []
): Promise<[T[], mysql.FieldPacket[]]> => {
  const connection = await getConnection();
  try {
    console.log('🔍 تنفيذ الاستعلام:', query.substring(0, 100) + (query.length > 100 ? '...' : ''));
    const result = await connection.execute(query, params) as [T[], mysql.FieldPacket[]];
    return result;
  } catch (error: any) {
    console.error('❌ خطأ في تنفيذ الاستعلام:', error.message);
    console.error('📝 الاستعلام:', query);
    console.error('📋 المعاملات:', params);
    throw error;
  } finally {
    connection.release();
  }
};

// تنفيذ عدة استعلامات في معاملة واحدة
export const executeTransaction = async <T = any>(
  queries: Array<{ query: string; params?: any[] }>
): Promise<T[]> => {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    console.log('🔄 بدء معاملة قاعدة البيانات...');

    const results: T[] = [];
    for (const { query, params = [] } of queries) {
      const [result] = await connection.execute(query, params) as [T[], mysql.FieldPacket[]];
      results.push(result as T);
    }

    await connection.commit();
    console.log('✅ تم تنفيذ المعاملة بنجاح');
    return results;
  } catch (error: any) {
    await connection.rollback();
    console.error('❌ خطأ في المعاملة، تم التراجع:', error.message);
    throw error;
  } finally {
    connection.release();
  }
};

// إغلاق مجموعة الاتصالات
export const closePool = async (): Promise<void> => {
  if (pool) {
    console.log('🔄 إغلاق مجموعة اتصالات قاعدة البيانات...');
    await pool.end();
    pool = null;
    console.log('✅ تم إغلاق الاتصالات بنجاح');
  }
};

// معلجات إشارات النظام لإغلاق الاتصالات
process.on('SIGTERM', closePool);
process.on('SIGINT', closePool);

export default {
  createPool,
  testConnection,
  getConnection,
  executeQuery,
  executeTransaction,
  closePool
};