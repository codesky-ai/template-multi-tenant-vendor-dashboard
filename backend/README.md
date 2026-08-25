# خادم API لوحة تحكم الموردين

## نظرة عامة

هذا هو الخادم الخلفي لتطبيق لوحة تحكم الموردين، مبني باستخدام Node.js و Express مع قاعدة بيانات MySQL. يوفر API RESTful شامل لإدارة الموردين والشركات مع دعم كامل للغة العربية.

## الميزات الرئيسية

### 🎯 إدارة الموردين
- ✅ إنشاء، تعديل، وحذف الموردين
- ✅ البحث والفلترة المتقدمة
- ✅ نظام التقييمات
- ✅ تتبع الإحصائيات والأداء
- ✅ إدارة حالات الموردين (نشط، معلق، محظور)

### 📊 لوحة التحكم
- ✅ إحصائيات شاملة ومفصلة
- ✅ تقارير شهرية ومقارنات
- ✅ رسوم بيانية وتصورات
- ✅ ملخص سريع ومؤشرات الأداء

### 🌐 دعم اللغة العربية
- ✅ UTF-8 كامل للنصوص العربية
- ✅ اتجاه RTL في جميع الاستجابات
- ✅ رسائل خطأ ونجاح باللغة العربية
- ✅ تنسيق التواريخ والأرقام العربية

### 🛡️ الأمان والحماية
- ✅ Helmet للحماية من الثغرات الشائعة
- ✅ CORS مُكوّن للواجهة الأمامية
- ✅ Rate limiting لمنع سوء الاستخدام
- ✅ تشفير البيانات الحساسة
- ✅ تسجيل وتتبع الطلبات

## متطلبات النظام

### البرامج المطلوبة
- **Node.js**: الإصدار 18.x أو أحدث
- **MySQL**: الإصدار 8.0 أو أحدث
- **npm**: الإصدار 9.x أو أحدث

### قاعدة البيانات
```bash
# تثبيت MySQL على Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# تثبيت MySQL على macOS (باستخدام Homebrew)
brew install mysql

# تثبيت MySQL على Windows
# تحميل من: https://dev.mysql.com/downloads/mysql/
```

## التثبيت والإعداد

### 1. تثبيت التبعيات
```bash
cd backend
npm install
```

### 2. إعداد قاعدة البيانات
```bash
# تسجيل الدخول إلى MySQL
mysql -u root -p

# إنشاء قاعدة البيانات
CREATE DATABASE suppliers_dashboard_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# إنشاء مستخدم (اختياري)
CREATE USER 'suppliers_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON suppliers_dashboard_db.* TO 'suppliers_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. إعداد متغيرات البيئة
```bash
# نسخ ملف الإعدادات النموذجي
cp .env.example .env

# تحرير الإعدادات
nano .env
```

### 4. تشغيل سكريبت قاعدة البيانات
```bash
# تنفيذ سكريبت إنشاء الجداول
mysql -u root -p suppliers_dashboard_db < ../database/schema.sql

# تنفيذ سكريبت البيانات التجريبية
mysql -u root -p suppliers_dashboard_db < ../database/seed.sql
```

## التشغيل

### وضع التطوير
```bash
npm run dev
```
- 🔄 إعادة التحميل التلقائي
- 📝 تسجيل مفصل للطلبات
- 🐛 رسائل خطأ تفصيلية

### وضع الإنتاج
```bash
# بناء التطبيق
npm run build

# تشغيل النسخة المبنية
npm start
```

### التحقق من التشغيل
```bash
# التحقق من حالة الخادم
curl http://localhost:3001/api/health

# الحصول على معلومات API
curl http://localhost:3001/api/info
```

## مسارات API الرئيسية

### الموردين (Suppliers)
```
GET    /api/suppliers              # جلب جميع الموردين
GET    /api/suppliers/search       # البحث في الموردين
GET    /api/suppliers/top          # أفضل الموردين
GET    /api/suppliers/:id          # جلب مورد واحد
POST   /api/suppliers              # إنشاء مورد جديد
PUT    /api/suppliers/:id          # تحديث مورد
PATCH  /api/suppliers/:id/rating   # تحديث تقييم
DELETE /api/suppliers/:id          # حذف مورد
```

### لوحة التحكم (Dashboard)
```
GET /api/dashboard/stats        # الإحصائيات الرئيسية
GET /api/dashboard/monthly      # الإحصائيات الشهرية
GET /api/dashboard/performance  # إحصائيات الأداء
GET /api/dashboard/summary      # الملخص السريع
GET /api/dashboard/charts       # بيانات الرسوم البيانية
```

### معلومات النظام
```
GET /api/health    # حالة النظام
GET /api/info      # معلومات API
GET /            # الصفحة الرئيسية
```

## أمثلة الاستخدام

### إنشاء مورد جديد
```bash
curl -X POST http://localhost:3001/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "شركة التقنية المتطورة",
    "email": "info@advanced-tech.sa",
    "phone": "+966501234567",
    "address": "الرياض، المملكة العربية السعودية",
    "company": "التقنية المتطورة المحدودة",
    "category": "التكنولوجيا",
    "description": "شركة متخصصة في الحلول التقنية"
  }'
```

### البحث في الموردين
```bash
curl "http://localhost:3001/api/suppliers/search?search=تقنية&status=نشط&limit=10"
```

### جلب الإحصائيات
```bash
curl http://localhost:3001/api/dashboard/stats
```

## هيكل قاعدة البيانات

### جدول الموردين (suppliers)
```sql
CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  company VARCHAR(255),
  category VARCHAR(100),
  status ENUM('نشط', 'معلق', 'محظور') DEFAULT 'نشط',
  rating DECIMAL(2,1) DEFAULT 0,
  image VARCHAR(500),
  registration_date DATE DEFAULT (CURDATE()),
  total_orders INT DEFAULT 0,
  total_value DECIMAL(15,2) DEFAULT 0,
  description TEXT,
  website VARCHAR(255),
  contact_person VARCHAR(255),
  payment_terms VARCHAR(100),
  delivery_time INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## المراقبة والسجلات

### السجلات
- 📝 جميع الطلبات مُسجّلة باستخدام Morgan
- 🕒 timestamps مضافة لكل عملية
- 📊 إحصائيات الأداء
- ❌ تسجيل تفصيلي للأخطاء

### المراقبة
```bash
# مراقبة السجلات المباشرة
tail -f logs/access.log

# التحقق من استهلاك الذاكرة
curl http://localhost:3001/api/health
```

## استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### مشكلة الاتصال بقاعدة البيانات
```bash
# التحقق من تشغيل MySQL
sudo systemctl status mysql

# التحقق من الإعدادات
cat .env | grep DB_
```

#### مشكلة الترميز العربي
```sql
-- التحقق من إعدادات قاعدة البيانات
SHOW VARIABLES LIKE 'character_set_%';
SHOW VARIABLES LIKE 'collation_%';
```

#### مشكلة CORS
- تأكد من تطابق CORS_ORIGIN مع عنوان الواجهة الأمامية
- تحقق من السماح للطرق المطلوبة

## الأداء والتحسين

### نصائح لتحسين الأداء
- 🔍 استخدام فهارس قاعدة البيانات
- 📦 ضغط الاستجابات
- 🚀 connection pooling لقاعدة البيانات
- ⚡ caching للبيانات المتكررة

### مراقبة الأداء
```bash
# مراقبة استهلاك CPU والذاكرة
top -p $(pgrep -f "node.*server")

# مراقبة اتصالات MySQL
mysql -e "SHOW PROCESSLIST;"
```

## النشر والإنتاج

### متطلبات الإنتاج
- 🔧 متغيرات بيئة محمية
- 🛡️ شهادة SSL/TLS
- 🔄 Process manager (PM2)
- 📊 مراقبة ويلزت
- 💾 نسخ احتياطية منتظمة

### نشر باستخدام PM2
```bash
# تثبيت PM2
npm install -g pm2

# تشغيل التطبيق
pm2 start dist/server.js --name "suppliers-api"

# مراقبة التطبيق
pm2 logs suppliers-api
pm2 monit
```

## المساهمة

### إرشادات المساهمة
1. 🍴 Fork المشروع
2. 🌿 إنشاء branch للميزة الجديدة
3. 💻 كتابة كود نظيف ومختبر
4. 📝 توثيق التغييرات
5. 🔄 إرسال Pull Request

### معايير الكود
- ✅ TypeScript strict mode
- ✅ ESLint للفحص
- ✅ تعليقات باللغة العربية
- ✅ رسائل commit واضحة

## الدعم والمساعدة

### الحصول على المساعدة
- 📧 البريد الإلكتروني: support@suppliers-dashboard.com
- 📚 الوثائق: [https://docs.suppliers-dashboard.com](https://docs.suppliers-dashboard.com)
- 🐛 الإبلاغ عن الأخطاء: GitHub Issues

### معلومات الاتصال
- **المطور**: فريق تطوير لوحة التحكم
- **الترخيص**: ISC
- **الإصدار**: 1.0.0

---

**ملاحظة**: هذا المشروع مصمم خصيصاً لدعم اللغة العربية وسير العمل من اليمين إلى اليسار (RTL).