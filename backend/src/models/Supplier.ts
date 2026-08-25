import { executeQuery } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// واجهة مورد قاعدة البيانات
export interface SupplierDB extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  category: string;
  status: 'نشط' | 'معلق' | 'محظور';
  rating: number;
  image: string;
  registration_date: Date;
  total_orders: number;
  total_value: number;
  description?: string;
  website?: string;
  contact_person?: string;
  payment_terms?: string;
  delivery_time?: number;
  created_at: Date;
  updated_at: Date;
}

// واجهة بيانات إنشاء المورد
export interface CreateSupplierData {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  category: string;
  description?: string;
  website?: string;
  contact_person?: string;
  payment_terms?: string;
  delivery_time?: number;
  image?: string;
}

// واجهة بيانات تحديث المورد
export interface UpdateSupplierData extends Partial<CreateSupplierData> {
  status?: 'نشط' | 'معلق' | 'محظور';
  rating?: number;
}

// نموذج المورد - Supplier Model
export class SupplierModel {
  // جلب جميع الموردين
  static async findAll(): Promise<SupplierDB[]> {
    const [rows] = await executeQuery<SupplierDB>(`
      SELECT
        id, name, email, phone, address, company, category, status, rating, image,
        registration_date, total_orders, total_value, description, website,
        contact_person, payment_terms, delivery_time, created_at, updated_at
      FROM suppliers
      ORDER BY created_at DESC
    `);
    return rows;
  }

  // جلب مورد واحد بالمعرف
  static async findById(id: number): Promise<SupplierDB | null> {
    const [rows] = await executeQuery<SupplierDB>(`
      SELECT
        id, name, email, phone, address, company, category, status, rating, image,
        registration_date, total_orders, total_value, description, website,
        contact_person, payment_terms, delivery_time, created_at, updated_at
      FROM suppliers
      WHERE id = ?
    `, [id]);

    return rows.length > 0 ? rows[0] : null;
  }

  // البحث في الموردين
  static async search(searchTerm: string, filters?: any): Promise<SupplierDB[]> {
    let query = `
      SELECT
        id, name, email, phone, address, company, category, status, rating, image,
        registration_date, total_orders, total_value, description, website,
        contact_person, payment_terms, delivery_time, created_at, updated_at
      FROM suppliers
      WHERE (name LIKE ? OR email LIKE ? OR company LIKE ? OR category LIKE ?)
    `;

    const params: any[] = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

    // إضافة الفلاتر
    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters?.minRating) {
      query += ' AND rating >= ?';
      params.push(parseFloat(filters.minRating));
    }

    query += ' ORDER BY created_at DESC';

    // إضافة حد العرض
    if (filters?.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const [rows] = await executeQuery<SupplierDB>(query, params);
    return rows;
  }

  // إنشاء مورد جديد
  static async create(supplierData: CreateSupplierData): Promise<number> {
    const {
      name, email, phone, address, company, category,
      description, website, contact_person, payment_terms, delivery_time, image
    } = supplierData;

    const [result] = await executeQuery<ResultSetHeader>(`
      INSERT INTO suppliers (
        name, email, phone, address, company, category, status, rating,
        image, registration_date, total_orders, total_value, description,
        website, contact_person, payment_terms, delivery_time
      ) VALUES (?, ?, ?, ?, ?, ?, 'نشط', 0, ?, NOW(), 0, 0, ?, ?, ?, ?, ?)
    `, [
      name, email, phone, address, company, category,
      image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      description, website, contact_person, payment_terms, delivery_time
    ]);

    return result.insertId;
  }

  // تحديث مورد
  static async update(id: number, supplierData: UpdateSupplierData): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    // بناء استعلام التحديث ديناميكياً
    Object.keys(supplierData).forEach(key => {
      if (supplierData[key as keyof UpdateSupplierData] !== undefined) {
        // تحويل أسماء الحقول من camelCase إلى snake_case
        const dbField = key === 'contactPerson' ? 'contact_person' :
                       key === 'paymentTerms' ? 'payment_terms' :
                       key === 'deliveryTime' ? 'delivery_time' : key;

        fields.push(`${dbField} = ?`);
        values.push(supplierData[key as keyof UpdateSupplierData]);
      }
    });

    if (fields.length === 0) {
      return false; // لا يوجد حقول للتحديث
    }

    // إضافة updated_at
    fields.push('updated_at = NOW()');
    values.push(id);

    const [result] = await executeQuery<ResultSetHeader>(`
      UPDATE suppliers SET ${fields.join(', ')} WHERE id = ?
    `, values);

    return result.affectedRows > 0;
  }

  // حذف مورد
  static async delete(id: number): Promise<boolean> {
    const [result] = await executeQuery<ResultSetHeader>(`
      DELETE FROM suppliers WHERE id = ?
    `, [id]);

    return result.affectedRows > 0;
  }

  // تحديث إحصائيات المورد (الطلبات والقيمة الإجمالية)
  static async updateStats(
    supplierId: number,
    ordersChange: number,
    valueChange: number
  ): Promise<boolean> {
    const [result] = await executeQuery<ResultSetHeader>(`
      UPDATE suppliers
      SET
        total_orders = total_orders + ?,
        total_value = total_value + ?,
        updated_at = NOW()
      WHERE id = ?
    `, [ordersChange, valueChange, supplierId]);

    return result.affectedRows > 0;
  }

  // تحديث تقييم المورد
  static async updateRating(supplierId: number, newRating: number): Promise<boolean> {
    if (newRating < 0 || newRating > 5) {
      throw new Error('التقييم يجب أن يكون بين 0 و 5');
    }

    const [result] = await executeQuery<ResultSetHeader>(`
      UPDATE suppliers
      SET rating = ?, updated_at = NOW()
      WHERE id = ?
    `, [newRating, supplierId]);

    return result.affectedRows > 0;
  }

  // الحصول على أفضل الموردين
  static async getTopSuppliers(limit: number = 10): Promise<SupplierDB[]> {
    const [rows] = await executeQuery<SupplierDB>(`
      SELECT
        id, name, email, phone, address, company, category, status, rating, image,
        registration_date, total_orders, total_value, description, website,
        contact_person, payment_terms, delivery_time, created_at, updated_at
      FROM suppliers
      WHERE status = 'نشط'
      ORDER BY rating DESC, total_value DESC
      LIMIT ?
    `, [limit]);

    return rows;
  }

  // إحصائيات الموردين
  static async getStats() {
    const [totalRows] = await executeQuery<RowDataPacket>('SELECT COUNT(*) as total FROM suppliers');
    const [activeRows] = await executeQuery<RowDataPacket>('SELECT COUNT(*) as active FROM suppliers WHERE status = "نشط"');
    const [categoryRows] = await executeQuery<RowDataPacket>(`
      SELECT
        category,
        COUNT(*) as count,
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM suppliers)) as percentage
      FROM suppliers
      GROUP BY category
      ORDER BY count DESC
    `);

    return {
      total: totalRows[0]?.total || 0,
      active: activeRows[0]?.active || 0,
      categories: categoryRows || []
    };
  }

  // التحقق من وجود بريد إلكتروني
  static async emailExists(email: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT id FROM suppliers WHERE email = ?';
    const params = [email];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const [rows] = await executeQuery<RowDataPacket>(query, params);
    return rows.length > 0;
  }

  // التحقق من وجود رقم هاتف
  static async phoneExists(phone: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT id FROM suppliers WHERE phone = ?';
    const params = [phone];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const [rows] = await executeQuery<RowDataPacket>(query, params);
    return rows.length > 0;
  }
}

export default SupplierModel;