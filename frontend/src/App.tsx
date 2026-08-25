import React, { useState, useEffect } from 'react';
import {
  Users, Building2, ShoppingCart, BarChart3, Search, Plus, Filter,
  Bell, Settings, ChevronDown, Menu, X, Eye, Edit2, Trash2, Star,
  Phone, Mail, MapPin, Calendar, TrendingUp, Package, DollarSign
} from 'lucide-react';
import apiService from './services/apiService';
import { Supplier, DashboardStats } from './types';
import { formatCurrencyArabic, formatDateArabic, formatNumberArabic } from './utils/rtl';

// مكون بطاقة الإحصائيات - Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  color: string;
}> = ({ title, value, icon, change, color }) => (
  <div className="card p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div className="text-right">
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-sm text-green-500">%{formatNumberArabic(change)}</span>
            <span className="text-sm text-gray-500 mr-1">عن الشهر الماضي</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
        {icon}
      </div>
    </div>
  </div>
);

// مكون جدول الموردين - Suppliers Table Component
const SuppliersTable: React.FC<{
  suppliers: Supplier[];
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}> = ({ suppliers, onView, onEdit, onDelete }) => (
  <div className="card overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">الموردون الحاليون</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المورد
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الشركة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الفئة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الحالة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              التقييم
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              إجمالي القيمة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              العمليات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full object-cover ml-4"
                    src={supplier.image}
                    alt={supplier.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
                    }}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 ml-1" />
                      {supplier.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 ml-1" />
                      {supplier.phone}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{supplier.company}</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 ml-1" />
                  {supplier.address.split('،')[0]}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {supplier.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  supplier.status === 'نشط'
                    ? 'bg-green-100 text-green-800'
                    : supplier.status === 'معلق'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {supplier.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                  <span className="text-sm text-gray-900">{formatNumberArabic(supplier.rating)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatCurrencyArabic(supplier.totalValue)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => onView(supplier)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="عرض"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(supplier)}
                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                    title="تعديل"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(supplier.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// مكون التفاصيل السريعة للمورد - Quick Supplier Details Component
const SupplierQuickView: React.FC<{
  supplier: Supplier | null;
  onClose: () => void;
}> = ({ supplier, onClose }) => {
  if (!supplier) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">تفاصيل المورد</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <img
              className="h-20 w-20 rounded-full object-cover ml-6"
              src={supplier.image}
              alt={supplier.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
              }}
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{supplier.name}</h3>
              <p className="text-gray-600">{supplier.company}</p>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current ml-1" />
                <span className="text-lg font-semibold">{formatNumberArabic(supplier.rating)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">معلومات الاتصال</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 ml-3" />
                  <span className="text-gray-700">{supplier.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 ml-3" />
                  <span className="text-gray-700">{supplier.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 ml-3" />
                  <span className="text-gray-700">{supplier.address}</span>
                </div>
                {supplier.website && (
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 ml-3" />
                    <a href={supplier.website} target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-800">
                      {supplier.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">إحصائيات الأعمال</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">إجمالي الطلبات:</span>
                  <span className="font-semibold">{formatNumberArabic(supplier.totalOrders)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">إجمالي القيمة:</span>
                  <span className="font-semibold">{formatCurrencyArabic(supplier.totalValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ التسجيل:</span>
                  <span className="font-semibold">{formatDateArabic(supplier.registrationDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">شروط الدفع:</span>
                  <span className="font-semibold">{supplier.paymentTerms || 'غير محدد'}</span>
                </div>
                {supplier.deliveryTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">مدة التسليم:</span>
                    <span className="font-semibold">{formatNumberArabic(supplier.deliveryTime)} يوم</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {supplier.description && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{supplier.description}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// المكون الرئيسي - Main App Component
function App() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [suppliersData, statsData] = await Promise.all([
          apiService.suppliers.getAll(),
          apiService.dashboard.getStats()
        ]);
        setSuppliers(suppliersData);
        setStats(statsData);
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // تصفية الموردين
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || supplier.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // معالج عرض المورد
  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  // معالج تعديل المورد
  const handleEditSupplier = (supplier: Supplier) => {
    console.log('تعديل المورد:', supplier.id);
    // يمكن إضافة نافذة التعديل هنا
  };

  // معالج حذف المورد
  const handleDeleteSupplier = (supplierId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المورد؟')) {
      setSuppliers(prev => prev.filter(s => s.id !== supplierId));
      console.log('حذف المورد:', supplierId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading w-16 h-16 border-4 border-blue-200 border-top-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-arabic">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-arabic" dir="rtl">
      {/* شريط جانبي للموبايل */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="mb-4 p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <nav className="space-y-2">
              <a href="#" className="flex items-center p-3 text-blue-600 bg-blue-50 rounded-lg">
                <BarChart3 className="h-5 w-5 ml-3" />
                لوحة التحكم
              </a>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Users className="h-5 w-5 ml-3" />
                الموردون
              </a>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Building2 className="h-5 w-5 ml-3" />
                الشركات
              </a>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 ml-3" />
                الطلبات
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* الشريط العلوي */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 mr-4">لوحة تحكم الموردين</h1>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <input
                  type="text"
                  placeholder="البحث في الموردين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-right"
              >
                <option value="">جميع الحالات</option>
                <option value="نشط">نشط</option>
                <option value="معلق">معلق</option>
                <option value="محظور">محظور</option>
              </select>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <Plus className="h-5 w-5 ml-2" />
                إضافة مورد
              </button>

              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Settings className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* بطاقات الإحصائيات */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="إجمالي الموردين"
              value={formatNumberArabic(stats.totalSuppliers)}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              color="text-blue-600"
            />
            <StatsCard
              title="الموردون النشطون"
              value={formatNumberArabic(stats.activeSuppliers)}
              icon={<Package className="h-6 w-6 text-green-600" />}
              color="text-green-600"
            />
            <StatsCard
              title="إجمالي الطلبات"
              value={formatNumberArabic(stats.totalOrders)}
              icon={<ShoppingCart className="h-6 w-6 text-purple-600" />}
              color="text-purple-600"
            />
            <StatsCard
              title="إجمالي الإيرادات"
              value={formatCurrencyArabic(stats.totalRevenue)}
              icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
              change={stats.monthlyGrowth}
              color="text-yellow-600"
            />
          </div>
        )}

        {/* جدول الموردين */}
        <SuppliersTable
          suppliers={filteredSuppliers}
          onView={handleViewSupplier}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
        />

        {/* عرض سريع للمورد */}
        <SupplierQuickView
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      </main>
    </div>
  );
}

export default App;