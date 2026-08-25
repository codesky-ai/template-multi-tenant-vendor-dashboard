-- ═══════════════════════════════════════════════════════════════
-- سكيما قاعدة بيانات لوحة تحكم الموردين
-- Suppliers Dashboard Database Schema
-- ═══════════════════════════════════════════════════════════════
-- التشغيل: mysql -u root -p < schema.sql
-- Running: mysql -u root -p < schema.sql

-- إنشاء قاعدة البيانات مع دعم الترميز العربي
CREATE DATABASE IF NOT EXISTS suppliers_dashboard_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE suppliers_dashboard_db;

-- إعداد الجلسة للعمل مع الترميز العربي
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

-- حذف الجداول الموجودة (في حالة إعادة التشغيل)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS company_suppliers;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

-- ═══════════════════════════════════════════════════════════════
-- جدول الشركات - Companies Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT 'اسم الشركة',
  logo VARCHAR(500) COMMENT 'شعار الشركة',
  address TEXT COMMENT 'عنوان الشركة',
  phone VARCHAR(50) COMMENT 'هاتف الشركة',
  email VARCHAR(255) COMMENT 'بريد الشركة الإلكتروني',
  website VARCHAR(255) COMMENT 'موقع الشركة الإلكتروني',
  industry VARCHAR(100) COMMENT 'نوع الصناعة',
  employees_count INT DEFAULT 0 COMMENT 'عدد الموظفين',
  established_year YEAR COMMENT 'سنة التأسيس',
  status ENUM('نشط', 'معلق', 'محظور') DEFAULT 'نشط' COMMENT 'حالة الشركة',
  registration_number VARCHAR(50) COMMENT 'رقم التسجيل التجاري',
  tax_number VARCHAR(50) COMMENT 'الرقم الضريبي',
  description TEXT COMMENT 'وصف الشركة',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ آخر تحديث'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول الشركات';

-- فهارس جدول الشركات
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_status ON companies(status);

-- ═══════════════════════════════════════════════════════════════
-- جدول الموردين - Suppliers Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT 'اسم المورد',
  email VARCHAR(255) UNIQUE NOT NULL COMMENT 'البريد الإلكتروني',
  phone VARCHAR(50) UNIQUE NOT NULL COMMENT 'رقم الهاتف',
  address TEXT COMMENT 'العنوان',
  company VARCHAR(255) NOT NULL COMMENT 'اسم الشركة',
  category VARCHAR(100) NOT NULL COMMENT 'فئة المورد',
  status ENUM('نشط', 'معلق', 'محظور') DEFAULT 'نشط' COMMENT 'حالة المورد',
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5) COMMENT 'تقييم المورد من 0 إلى 5',
  image VARCHAR(500) COMMENT 'صورة المورد',
  registration_date DATE DEFAULT (CURDATE()) COMMENT 'تاريخ التسجيل',
  total_orders INT DEFAULT 0 COMMENT 'إجمالي عدد الطلبات',
  total_value DECIMAL(15,2) DEFAULT 0.00 COMMENT 'إجمالي قيمة الطلبات',
  description TEXT COMMENT 'وصف المورد وخدماته',
  website VARCHAR(255) COMMENT 'موقع المورد الإلكتروني',
  contact_person VARCHAR(255) COMMENT 'الشخص المسؤول للتواصل',
  payment_terms VARCHAR(100) COMMENT 'شروط الدفع',
  delivery_time INT COMMENT 'مدة التسليم بالأيام',
  tax_number VARCHAR(50) COMMENT 'الرقم الضريبي',
  license_number VARCHAR(50) COMMENT 'رقم الرخصة التجارية',
  bank_account VARCHAR(100) COMMENT 'رقم الحساب البنكي',
  notes TEXT COMMENT 'ملاحظات إضافية',
  is_verified BOOLEAN DEFAULT FALSE COMMENT 'هل المورد موثق؟',
  verification_date DATE COMMENT 'تاريخ التوثيق',
  last_activity_date TIMESTAMP COMMENT 'تاريخ آخر نشاط',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ آخر تحديث'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول الموردين';

-- فهارس جدول الموردين
CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_suppliers_email ON suppliers(email);
CREATE INDEX idx_suppliers_phone ON suppliers(phone);
CREATE INDEX idx_suppliers_category ON suppliers(category);
CREATE INDEX idx_suppliers_status ON suppliers(status);
CREATE INDEX idx_suppliers_rating ON suppliers(rating);
CREATE INDEX idx_suppliers_company ON suppliers(company);
CREATE INDEX idx_suppliers_registration_date ON suppliers(registration_date);

-- ═══════════════════════════════════════════════════════════════
-- جدول ربط الشركات بالموردين - Company-Supplier Relationships
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE company_suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL COMMENT 'معرف الشركة',
  supplier_id INT NOT NULL COMMENT 'معرف المورد',
  relationship_type ENUM('معتمد', 'تجريبي', 'محظور') DEFAULT 'تجريبي' COMMENT 'نوع العلاقة',
  start_date DATE DEFAULT (CURDATE()) COMMENT 'تاريخ بداية التعامل',
  end_date DATE COMMENT 'تاريخ انتهاء التعامل',
  contract_number VARCHAR(100) COMMENT 'رقم العقد',
  notes TEXT COMMENT 'ملاحظات على العلاقة',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ آخر تحديث',

  UNIQUE KEY unique_company_supplier (company_id, supplier_id),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول ربط الشركات بالموردين';

-- فهارس جدول العلاقات
CREATE INDEX idx_company_suppliers_company ON company_suppliers(company_id);
CREATE INDEX idx_company_suppliers_supplier ON company_suppliers(supplier_id);
CREATE INDEX idx_company_suppliers_relationship ON company_suppliers(relationship_type);

-- ═══════════════════════════════════════════════════════════════
-- جدول الطلبات - Orders Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL COMMENT 'رقم الطلب',
  supplier_id INT NOT NULL COMMENT 'معرف المورد',
  company_id INT NOT NULL COMMENT 'معرف الشركة',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الطلب',
  delivery_date DATE COMMENT 'تاريخ التسليم المتوقع',
  actual_delivery_date DATE COMMENT 'تاريخ التسليم الفعلي',
  status ENUM('قيد الانتظار', 'مؤكد', 'قيد التحضير', 'مشحون', 'مسلم', 'مكتمل', 'ملغي', 'مرجع')
    DEFAULT 'قيد الانتظار' COMMENT 'حالة الطلب',
  priority ENUM('منخفض', 'عادي', 'عالي', 'عاجل') DEFAULT 'عادي' COMMENT 'أولوية الطلب',
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'المبلغ الإجمالي',
  discount_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT 'مبلغ الخصم',
  tax_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT 'مبلغ الضريبة',
  final_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'المبلغ النهائي',
  payment_status ENUM('لم يتم', 'جزئي', 'مكتمل', 'مسترد') DEFAULT 'لم يتم' COMMENT 'حالة الدفع',
  payment_method ENUM('نقدي', 'بنكي', 'شيك', 'آجل') COMMENT 'طريقة الدفع',
  delivery_address TEXT COMMENT 'عنوان التسليم',
  special_instructions TEXT COMMENT 'تعليمات خاصة',
  notes TEXT COMMENT 'ملاحظات إضافية',
  created_by INT COMMENT 'منشئ الطلب',
  approved_by INT COMMENT 'معتمد الطلب',
  approved_at TIMESTAMP COMMENT 'تاريخ الاعتماد',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ آخر تحديث',

  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول الطلبات';

-- فهارس جدول الطلبات
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_supplier ON orders(supplier_id);
CREATE INDEX idx_orders_company ON orders(company_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- ═══════════════════════════════════════════════════════════════
-- جدول تفاصيل الطلبات - Order Items Table
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL COMMENT 'معرف الطلب',
  item_name VARCHAR(255) NOT NULL COMMENT 'اسم الصنف',
  item_description TEXT COMMENT 'وصف الصنف',
  item_code VARCHAR(100) COMMENT 'كود الصنف',
  category VARCHAR(100) COMMENT 'فئة الصنف',
  unit_of_measure VARCHAR(50) COMMENT 'وحدة القياس',
  quantity DECIMAL(10,3) NOT NULL COMMENT 'الكمية',
  unit_price DECIMAL(15,2) NOT NULL COMMENT 'سعر الوحدة',
  total_price DECIMAL(15,2) NOT NULL COMMENT 'إجمالي السعر',
  discount_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT 'نسبة الخصم',
  discount_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT 'مبلغ الخصم',
  tax_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT 'نسبة الضريبة',
  tax_amount DECIMAL(15,2) DEFAULT 0.00 COMMENT 'مبلغ الضريبة',
  final_price DECIMAL(15,2) NOT NULL COMMENT 'السعر النهائي',
  notes TEXT COMMENT 'ملاحظات على الصنف',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ آخر تحديث',

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول تفاصيل الطلبات';

-- فهارس جدول تفاصيل الطلبات
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_name ON order_items(item_name);
CREATE INDEX idx_order_items_code ON order_items(item_code);
CREATE INDEX idx_order_items_category ON order_items(category);

-- ═══════════════════════════════════════════════════════════════
-- جدول المستخدمين - Users Table (للمستقبل)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL COMMENT 'اسم المستخدم',
  email VARCHAR(255) UNIQUE NOT NULL COMMENT 'البريد الإلكتروني',
  password_hash VARCHAR(255) NOT NULL COMMENT 'كلمة المرور المشفرة',
  first_name VARCHAR(100) COMMENT 'الاسم الأول',
  last_name VARCHAR(100) COMMENT 'الاسم الأخير',
  phone VARCHAR(50) COMMENT 'رقم الهاتف',
  role ENUM('مدير', 'مشرف', 'مستخدم') DEFAULT 'مستخدم' COMMENT 'دور المستخدم',
  status ENUM('نشط', 'معلق', 'محظور') DEFAULT 'نشط' COMMENT 'حالة المستخدم',
  company_id INT COMMENT 'الشركة التابع لها',
  last_login TIMESTAMP COMMENT 'آخر تسجيل دخول',
  profile_image VARCHAR(500) COMMENT 'صورة الملف الشخصي',
  preferences JSON COMMENT 'تفضيلات المستخدم',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'تاريخ آخر تحديث',

  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول المستخدمين';

-- فهارس جدول المستخدمين
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- ═══════════════════════════════════════════════════════════════
-- مشاهدات مفيدة - Useful Views
-- ═══════════════════════════════════════════════════════════════

-- مشاهدة إحصائيات الموردين
CREATE VIEW v_supplier_stats AS
SELECT
  s.id,
  s.name,
  s.category,
  s.status,
  s.rating,
  s.total_orders,
  s.total_value,
  COALESCE(active_orders.count, 0) as active_orders_count,
  COALESCE(active_orders.value, 0) as active_orders_value,
  DATEDIFF(CURDATE(), s.registration_date) as days_registered
FROM suppliers s
LEFT JOIN (
  SELECT
    supplier_id,
    COUNT(*) as count,
    SUM(final_amount) as value
  FROM orders
  WHERE status IN ('قيد الانتظار', 'مؤكد', 'قيد التحضير', 'مشحون')
  GROUP BY supplier_id
) active_orders ON s.id = active_orders.supplier_id;

-- مشاهدة إحصائيات الطلبات الشهرية
CREATE VIEW v_monthly_orders AS
SELECT
  YEAR(order_date) as order_year,
  MONTH(order_date) as order_month,
  DATE_FORMAT(order_date, '%Y-%m') as year_month,
  COUNT(*) as orders_count,
  SUM(final_amount) as total_value,
  AVG(final_amount) as avg_order_value,
  COUNT(DISTINCT supplier_id) as unique_suppliers
FROM orders
GROUP BY YEAR(order_date), MONTH(order_date)
ORDER BY order_year DESC, order_month DESC;

-- ═══════════════════════════════════════════════════════════════
-- مؤشرات الأداء - Triggers (اختياري)
-- ═══════════════════════════════════════════════════════════════

DELIMITER //

-- تحديث إحصائيات المورد عند إضافة طلب جديد
CREATE TRIGGER tr_update_supplier_stats_on_order_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  UPDATE suppliers
  SET
    total_orders = total_orders + 1,
    total_value = total_value + NEW.final_amount,
    last_activity_date = CURRENT_TIMESTAMP
  WHERE id = NEW.supplier_id;
END//

-- تحديث إحصائيات المورد عند تعديل قيمة الطلب
CREATE TRIGGER tr_update_supplier_stats_on_order_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  IF OLD.final_amount != NEW.final_amount THEN
    UPDATE suppliers
    SET
      total_value = total_value - OLD.final_amount + NEW.final_amount,
      last_activity_date = CURRENT_TIMESTAMP
    WHERE id = NEW.supplier_id;
  END IF;
END//

-- تحديث إحصائيات المورد عند حذف طلب
CREATE TRIGGER tr_update_supplier_stats_on_order_delete
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
  UPDATE suppliers
  SET
    total_orders = total_orders - 1,
    total_value = total_value - OLD.final_amount
  WHERE id = OLD.supplier_id;
END//

-- حساب المبلغ النهائي تلقائياً في الطلبات
CREATE TRIGGER tr_calculate_order_final_amount
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  SET NEW.final_amount = NEW.total_amount - NEW.discount_amount + NEW.tax_amount;
END//

CREATE TRIGGER tr_calculate_order_final_amount_update
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
  SET NEW.final_amount = NEW.total_amount - NEW.discount_amount + NEW.tax_amount;
END//

-- حساب السعر النهائي تلقائياً في تفاصيل الطلبات
CREATE TRIGGER tr_calculate_item_final_price
BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
  SET NEW.final_price = NEW.total_price - NEW.discount_amount + NEW.tax_amount;
END//

CREATE TRIGGER tr_calculate_item_final_price_update
BEFORE UPDATE ON order_items
FOR EACH ROW
BEGIN
  SET NEW.final_price = NEW.total_price - NEW.discount_amount + NEW.tax_amount;
END//

DELIMITER ;

-- ═══════════════════════════════════════════════════════════════
-- إجراءات مخزنة مفيدة - Useful Stored Procedures
-- ═══════════════════════════════════════════════════════════════

DELIMITER //

-- إجراء لحساب أفضل الموردين
CREATE PROCEDURE sp_get_top_suppliers(IN limit_count INT DEFAULT 10)
BEGIN
  SELECT
    s.*,
    COALESCE(avg_rating.rating, 0) as calculated_rating
  FROM suppliers s
  LEFT JOIN (
    SELECT
      supplier_id,
      AVG(rating) as rating
    FROM supplier_ratings
    GROUP BY supplier_id
  ) avg_rating ON s.id = avg_rating.supplier_id
  WHERE s.status = 'نشط'
  ORDER BY s.rating DESC, s.total_value DESC, s.total_orders DESC
  LIMIT limit_count;
END//

-- إجراء لحساب إحصائيات الأداء الشهري
CREATE PROCEDURE sp_get_monthly_performance(IN target_year INT, IN target_month INT)
BEGIN
  SELECT
    COUNT(DISTINCT s.id) as total_suppliers,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.final_amount), 0) as total_revenue,
    COALESCE(AVG(o.final_amount), 0) as avg_order_value,
    COUNT(DISTINCT CASE WHEN o.status = 'مكتمل' THEN o.id END) as completed_orders,
    COUNT(DISTINCT CASE WHEN s.status = 'نشط' THEN s.id END) as active_suppliers
  FROM suppliers s
  LEFT JOIN orders o ON s.id = o.supplier_id
    AND YEAR(o.order_date) = target_year
    AND MONTH(o.order_date) = target_month;
END//

DELIMITER ;

-- ═══════════════════════════════════════════════════════════════
-- تأكيد إنشاء قاعدة البيانات
-- ═══════════════════════════════════════════════════════════════

-- عرض الجداول المنشأة
SELECT 'تم إنشاء قاعدة البيانات بنجاح!' as message;
SHOW TABLES;

-- عرض معلومات الترميز
SELECT
  '✅ تم إعداد قاعدة البيانات مع دعم اللغة العربية' as status,
  @@character_set_database as charset,
  @@collation_database as collation;

-- إحصائيات سريعة
SELECT
  (SELECT COUNT(*) FROM information_schema.tables
   WHERE table_schema = 'suppliers_dashboard_db') as total_tables,
  (SELECT COUNT(*) FROM information_schema.views
   WHERE table_schema = 'suppliers_dashboard_db') as total_views,
  (SELECT COUNT(*) FROM information_schema.triggers
   WHERE trigger_schema = 'suppliers_dashboard_db') as total_triggers,
  (SELECT COUNT(*) FROM information_schema.routines
   WHERE routine_schema = 'suppliers_dashboard_db') as total_procedures;

-- رسالة النهاية
SELECT
  'قاعدة البيانات جاهزة للاستخدام!' as final_message,
  'يمكنك الآن تشغيل seed.sql لإدراج البيانات التجريبية' as next_step;