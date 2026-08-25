# قاعدة بيانات لوحة تحكم الموردين

## نظرة عامة

قاعدة بيانات MySQL شاملة مصممة خصيصاً لإدارة الموردين والشركات مع دعم كامل للغة العربية. تتضمن هياكل بيانات متطورة وعلاقات محسنة لتوفير تجربة إدارة فعالة ومرنة.

## الميزات الرئيسية

### 🎯 دعم اللغة العربية الكامل
- ✅ ترميز UTF-8 (utf8mb4) لجميع الجداول
- ✅ Collation مناسب للنصوص العربية (utf8mb4_unicode_ci)
- ✅ بيانات تجريبية شاملة باللغة العربية
- ✅ تسميات وتعليقات الحقول بالعربية

### 📊 هيكل قاعدة بيانات متقدم
- ✅ 6 جداول رئيسية مترابطة
- ✅ فهارس محسنة للأداء العالي
- ✅ قيود المرجعية (Foreign Keys) للحفاظ على سلامة البيانات
- ✅ مؤشرات تلقائية (Triggers) للحسابات الآلية

### 🔒 سلامة وحماية البيانات
- ✅ قيود التحقق (Check Constraints)
- ✅ مفاتيح فريدة لمنع التكرار
- ✅ علاقات محمية من الحذف غير المقصود
- ✅ تحديثات تلقائية للطوابع الزمنية

## متطلبات النظام

### قاعدة البيانات
- **MySQL**: الإصدار 8.0 أو أحدث
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci

### صلاحيات قاعدة البيانات
```sql
GRANT ALL PRIVILEGES ON suppliers_dashboard_db.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

## التثبيت والإعداد

### 1. إنشاء قاعدة البيانات
```bash
# تسجيل الدخول إلى MySQL
mysql -u root -p

# تشغيل سكريبت إنشاء الهيكل
mysql -u root -p < schema.sql
```

### 2. إدراج البيانات التجريبية
```bash
# تشغيل سكريبت البيانات التجريبية
mysql -u root -p suppliers_dashboard_db < seed.sql
```

### 3. التحقق من التثبيت
```sql
-- الاتصال بقاعدة البيانات
USE suppliers_dashboard_db;

-- عرض الجداول
SHOW TABLES;

-- التحقق من الترميز
SELECT @@character_set_database, @@collation_database;

-- عد البيانات
SELECT
  (SELECT COUNT(*) FROM suppliers) as suppliers,
  (SELECT COUNT(*) FROM companies) as companies,
  (SELECT COUNT(*) FROM orders) as orders;
```

## هيكل قاعدة البيانات

### 🏢 جدول الشركات (companies)
```sql
CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(500),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  industry VARCHAR(100),
  employees_count INT DEFAULT 0,
  established_year YEAR,
  status ENUM('نشط', 'معلق', 'محظور') DEFAULT 'نشط',
  -- ... المزيد من الحقول
);
```

**الغرض**: تخزين معلومات الشركات التي تتعامل مع الموردين.

**الحقول الرئيسية**:
- `name`: اسم الشركة
- `industry`: نوع الصناعة
- `employees_count`: عدد الموظفين
- `status`: حالة الشركة

### 👥 جدول الموردين (suppliers)
```sql
CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  company VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status ENUM('نشط', 'معلق', 'محظور') DEFAULT 'نشط',
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_orders INT DEFAULT 0,
  total_value DECIMAL(15,2) DEFAULT 0.00,
  -- ... المزيد من الحقول
);
```

**الغرض**: تخزين معلومات الموردين وإحصائياتهم.

**الحقول المهمة**:
- `rating`: تقييم المورد (0-5)
- `total_orders`: إجمالي عدد الطلبات
- `total_value`: إجمالي قيمة التعاملات
- `category`: فئة المورد

### 🔗 جدول العلاقات (company_suppliers)
```sql
CREATE TABLE company_suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  supplier_id INT NOT NULL,
  relationship_type ENUM('معتمد', 'تجريبي', 'محظور'),
  start_date DATE DEFAULT (CURDATE()),
  contract_number VARCHAR(100),
  -- ... المزيد من الحقول
);
```

**الغرض**: ربط الشركات بالموردين مع تفاصيل العلاقة.

### 📋 جدول الطلبات (orders)
```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id INT NOT NULL,
  company_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('قيد الانتظار', 'مؤكد', 'مشحون', 'مكتمل', 'ملغي'),
  total_amount DECIMAL(15,2) NOT NULL,
  final_amount DECIMAL(15,2) NOT NULL,
  -- ... المزيد من الحقول
);
```

**الغرض**: تتبع طلبات الشراء وحالاتها.

### 📦 جدول تفاصيل الطلبات (order_items)
```sql
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  -- ... المزيد من الحقول
);
```

**الغرض**: تخزين تفاصيل الأصناف في كل طلب.

### 👤 جدول المستخدمين (users)
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('مدير', 'مشرف', 'مستخدم'),
  status ENUM('نشط', 'معلق', 'محظور'),
  -- ... المزيد من الحقول
);
```

**الغرض**: إدارة المستخدمين وصلاحياتهم.

## المشاهدات (Views)

### 📊 v_supplier_stats
```sql
CREATE VIEW v_supplier_stats AS
SELECT
  s.id, s.name, s.category, s.status, s.rating,
  s.total_orders, s.total_value,
  COALESCE(active_orders.count, 0) as active_orders_count,
  DATEDIFF(CURDATE(), s.registration_date) as days_registered
FROM suppliers s
LEFT JOIN (/* الطلبات النشطة */) active_orders ON s.id = active_orders.supplier_id;
```

**الغرض**: عرض إحصائيات شاملة لكل مورد.

### 📈 v_monthly_orders
```sql
CREATE VIEW v_monthly_orders AS
SELECT
  YEAR(order_date) as order_year,
  MONTH(order_date) as order_month,
  COUNT(*) as orders_count,
  SUM(final_amount) as total_value,
  AVG(final_amount) as avg_order_value
FROM orders
GROUP BY YEAR(order_date), MONTH(order_date);
```

**الغرض**: تحليل الطلبات بشكل شهري.

## المؤشرات التلقائية (Triggers)

### 🔄 تحديث إحصائيات المورد
```sql
-- عند إضافة طلب جديد
CREATE TRIGGER tr_update_supplier_stats_on_order_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  UPDATE suppliers SET
    total_orders = total_orders + 1,
    total_value = total_value + NEW.final_amount
  WHERE id = NEW.supplier_id;
END;
```

### 💰 حساب المبالغ تلقائياً
```sql
-- حساب المبلغ النهائي للطلب
CREATE TRIGGER tr_calculate_order_final_amount
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  SET NEW.final_amount = NEW.total_amount - NEW.discount_amount + NEW.tax_amount;
END;
```

## الإجراءات المخزنة

### 🏆 أفضل الموردين
```sql
CALL sp_get_top_suppliers(10);
```

### 📊 الأداء الشهري
```sql
CALL sp_get_monthly_performance(2024, 3);
```

## الفهارس المحسنة

### فهارس الموردين
```sql
CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_suppliers_category ON suppliers(category);
CREATE INDEX idx_suppliers_status ON suppliers(status);
CREATE INDEX idx_suppliers_rating ON suppliers(rating);
```

### فهارس الطلبات
```sql
CREATE INDEX idx_orders_supplier ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);
```

## البيانات التجريبية

### 🏢 الشركات المُدرجة
- **شركة التقنيات المتقدمة** (التكنولوجيا)
- **مجموعة الخليج التجارية** (التجارة العامة)
- **الشركة الوطنية للصناعات** (الصناعة)
- **شركة الإنشاءات الحديثة** (الإنشاءات)
- **مؤسسة التجارة الذكية** (التجارة الإلكترونية)

### 👥 الموردين المُدرجين (10 موردين)
- **الإلكترونيات**: شركة النجمة للتجارة
- **المواد الغذائية**: المؤسسة الذهبية
- **مواد البناء**: شركة البناء المتقدم
- **الملابس والأزياء**: مكتب الأزياء العصرية
- **الأثاث والديكور**: مؤسسة الأثاث الفاخر
- **المعدات الصناعية**: شركة المعدات الصناعية
- **النقل واللوجستيات**: مؤسسة النقل السريع
- **الكيماويات**: شركة الكيماويات المتخصصة
- **المستلزمات الطبية**: مكتب المستلزمات الطبية

### 📋 الطلبات المُدرجة (10 طلبات)
- طلبات بحالات مختلفة (مكتمل، قيد التحضير، مشحون)
- قيم متنوعة من 5,400 ريال إلى 125,000 ريال
- أكثر من 30 صنف مختلف

## استعلامات مفيدة

### إحصائيات سريعة
```sql
-- عدد الموردين النشطين
SELECT COUNT(*) as active_suppliers
FROM suppliers
WHERE status = 'نشط';

-- إجمالي قيمة الطلبات هذا الشهر
SELECT SUM(final_amount) as monthly_total
FROM orders
WHERE MONTH(order_date) = MONTH(CURDATE())
AND YEAR(order_date) = YEAR(CURDATE());

-- أفضل 5 فئات من حيث عدد الموردين
SELECT category, COUNT(*) as count
FROM suppliers
GROUP BY category
ORDER BY count DESC
LIMIT 5;
```

### تحليلات متقدمة
```sql
-- متوسط قيمة الطلب لكل مورد
SELECT
  s.name,
  COUNT(o.id) as total_orders,
  AVG(o.final_amount) as avg_order_value
FROM suppliers s
JOIN orders o ON s.id = o.supplier_id
GROUP BY s.id, s.name
ORDER BY avg_order_value DESC;

-- الموردين الأكثر نشاطاً (آخر 30 يوم)
SELECT
  s.name,
  COUNT(o.id) as recent_orders
FROM suppliers s
JOIN orders o ON s.id = o.supplier_id
WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY s.id, s.name
ORDER BY recent_orders DESC;
```

## صيانة قاعدة البيانات

### النسخ الاحتياطي
```bash
# نسخة احتياطية كاملة
mysqldump -u username -p suppliers_dashboard_db > backup_$(date +%Y%m%d).sql

# نسخة احتياطية للبيانات فقط
mysqldump -u username -p --no-create-info suppliers_dashboard_db > data_backup_$(date +%Y%m%d).sql

# نسخة احتياطية للهيكل فقط
mysqldump -u username -p --no-data suppliers_dashboard_db > structure_backup_$(date +%Y%m%d).sql
```

### استعادة البيانات
```bash
# استعادة من نسخة احتياطية
mysql -u username -p suppliers_dashboard_db < backup_file.sql
```

### تحسين الأداء
```sql
-- تحليل الجداول
ANALYZE TABLE suppliers, orders, order_items;

-- تحسين الجداول
OPTIMIZE TABLE suppliers, orders, order_items;

-- فحص سلامة الجداول
CHECK TABLE suppliers, orders, order_items;
```

## مراقبة الأداء

### استعلامات بطيئة
```sql
-- تفعيل مراقبة الاستعلامات البطيئة
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- عرض العمليات الحالية
SHOW PROCESSLIST;

-- إحصائيات الفهارس
SHOW INDEX FROM suppliers;
```

### إحصائيات قاعدة البيانات
```sql
-- حجم قاعدة البيانات
SELECT
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS table_size_mb
FROM information_schema.tables
WHERE table_schema = 'suppliers_dashboard_db'
ORDER BY table_size_mb DESC;

-- عدد السجلات في كل جدول
SELECT
  table_name,
  table_rows
FROM information_schema.tables
WHERE table_schema = 'suppliers_dashboard_db';
```

## استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### مشكلة الترميز
```sql
-- التحقق من ترميز قاعدة البيانات
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'suppliers_dashboard_db';

-- تغيير ترميز قاعدة البيانات
ALTER DATABASE suppliers_dashboard_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### مشاكل المفاتيح الخارجية
```sql
-- عرض قيود المفاتيح الخارجية
SELECT
  CONSTRAINT_NAME,
  TABLE_NAME,
  COLUMN_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_SCHEMA = 'suppliers_dashboard_db';

-- تعطيل فحص المفاتيح الخارجية مؤقتاً
SET FOREIGN_KEY_CHECKS = 0;
-- تنفيذ العمليات
SET FOREIGN_KEY_CHECKS = 1;
```

## الأمان

### أفضل الممارسات
- 🔒 استخدام مستخدم قاعدة بيانات منفصل للتطبيق
- 🔑 كلمات مرور قوية ومعقدة
- 🛡️ تقييد الصلاحيات حسب الحاجة
- 📊 مراقبة الوصول والعمليات
- 💾 نسخ احتياطية منتظمة

### إعداد مستخدم التطبيق
```sql
-- إنشاء مستخدم للتطبيق
CREATE USER 'suppliers_app'@'localhost' IDENTIFIED BY 'secure_password_here';

-- منح الصلاحيات المطلوبة فقط
GRANT SELECT, INSERT, UPDATE, DELETE ON suppliers_dashboard_db.* TO 'suppliers_app'@'localhost';

-- منع العمليات الخطيرة
REVOKE DROP, ALTER, CREATE, INDEX ON suppliers_dashboard_db.* FROM 'suppliers_app'@'localhost';

FLUSH PRIVILEGES;
```

## التطوير المستقبلي

### ميزات مخططة
- 📱 دعم التطبيقات المحمولة
- 🔔 نظام إشعارات متقدم
- 📈 تقارير مالية مفصلة
- 🔍 بحث متقدم بالذكاء الاصطناعي
- 📊 تحليل البيانات وآلة التعلم

### توسعات ممكنة
- جداول إضافية للفواتير والمدفوعات
- نظام إدارة المخزون
- تتبع الشحنات GPS
- تقييمات وتعليقات العملاء
- تكامل مع أنظمة ERP

---

**ملاحظة**: جميع البيانات في هذه القاعدة هي بيانات تجريبية لأغراض التطوير والاختبار فقط.