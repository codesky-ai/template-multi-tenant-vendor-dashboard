import apiClient from '../api/client';
import { mockData } from '../api/mockData';
import { Supplier, Company, Order, DashboardStats, ApiResponse, PaginatedResponse, SupplierFormData } from '../types';

// إعداد استخدام البيانات التجريبية
const USE_MOCK_DATA = false; // تغيير إلى true لاستخدام البيانات التجريبية

// خدمة المعالجة التلقائية للأخطاء مع البديل التجريبي
const handleApiCall = async <T>(
  apiCall: () => Promise<T>,
  fallbackData: T,
  operationName: string
): Promise<T> => {
  if (USE_MOCK_DATA) {
    console.log(`📊 استخدام البيانات التجريبية لـ: ${operationName}`);
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    return fallbackData;
  }

  try {
    console.log(`🔄 جاري تحميل ${operationName}...`);
    return await apiCall();
  } catch (error: any) {
    console.warn(`⚠️ فشل ${operationName}، التحويل للبيانات التجريبية:`, error.message);

    // في حالة فشل الاتصال، استخدم البيانات التجريبية
    await new Promise(resolve => setTimeout(resolve, 300));
    return fallbackData;
  }
};

// خدمة الموردين - Suppliers Service
export const suppliersService = {
  // جلب جميع الموردين
  async getAll(): Promise<Supplier[]> {
    return handleApiCall(
      async () => {
        const response = await apiClient.get<ApiResponse<Supplier[]>>('/suppliers');
        return response.data.data;
      },
      mockData.suppliers,
      'جلب الموردين'
    );
  },

  // جلب مورد واحد
  async getById(id: string): Promise<Supplier | null> {
    return handleApiCall(
      async () => {
        const response = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
        return response.data.data;
      },
      mockData.suppliers.find(s => s.id === id) || null,
      `جلب المورد ${id}`
    );
  },

  // إنشاء مورد جديد
  async create(supplierData: SupplierFormData): Promise<Supplier> {
    return handleApiCall(
      async () => {
        const response = await apiClient.post<ApiResponse<Supplier>>('/suppliers', supplierData);
        return response.data.data;
      },
      {
        id: Date.now().toString(),
        ...supplierData,
        status: 'نشط' as const,
        rating: 0,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        registrationDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalValue: 0
      },
      'إنشاء مورد جديد'
    );
  },

  // تحديث مورد
  async update(id: string, supplierData: Partial<SupplierFormData>): Promise<Supplier> {
    return handleApiCall(
      async () => {
        const response = await apiClient.put<ApiResponse<Supplier>>(`/suppliers/${id}`, supplierData);
        return response.data.data;
      },
      {
        ...mockData.suppliers.find(s => s.id === id)!,
        ...supplierData
      },
      `تحديث المورد ${id}`
    );
  },

  // حذف مورد
  async delete(id: string): Promise<boolean> {
    return handleApiCall(
      async () => {
        await apiClient.delete(`/suppliers/${id}`);
        return true;
      },
      true,
      `حذف المورد ${id}`
    );
  },

  // البحث والفلترة
  async search(query: string, filters?: any): Promise<Supplier[]> {
    return handleApiCall(
      async () => {
        const params = new URLSearchParams();
        if (query) params.append('search', query);
        if (filters) {
          Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
          });
        }

        const response = await apiClient.get<ApiResponse<Supplier[]>>(`/suppliers/search?${params}`);
        return response.data.data;
      },
      mockData.suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(query.toLowerCase()) ||
        supplier.email.toLowerCase().includes(query.toLowerCase()) ||
        supplier.company.toLowerCase().includes(query.toLowerCase())
      ),
      'البحث في الموردين'
    );
  }
};

// خدمة الشركات - Companies Service
export const companiesService = {
  async getAll(): Promise<Company[]> {
    return handleApiCall(
      async () => {
        const response = await apiClient.get<ApiResponse<Company[]>>('/companies');
        return response.data.data;
      },
      mockData.companies,
      'جلب الشركات'
    );
  },

  async getById(id: string): Promise<Company | null> {
    return handleApiCall(
      async () => {
        const response = await apiClient.get<ApiResponse<Company>>(`/companies/${id}`);
        return response.data.data;
      },
      mockData.companies.find(c => c.id === id) || null,
      `جلب الشركة ${id}`
    );
  }
};

// خدمة الطلبات - Orders Service
export const ordersService = {
  async getAll(): Promise<Order[]> {
    return handleApiCall(
      async () => {
        const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
        return response.data.data;
      },
      mockData.orders,
      'جلب الطلبات'
    );
  },

  async getBySupplier(supplierId: string): Promise<Order[]> {
    return handleApiCall(
      async () => {
        const response = await apiClient.get<ApiResponse<Order[]>>(`/orders/supplier/${supplierId}`);
        return response.data.data;
      },
      mockData.orders.filter(order => order.supplierId === supplierId),
      `جلب طلبات المورد ${supplierId}`
    );
  }
};

// خدمة إحصائيات لوحة التحكم
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    return handleApiCall(
      async () => {
        const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
        return response.data.data;
      },
      mockData.dashboardStats,
      'جلب إحصائيات لوحة التحكم'
    );
  }
};

// تصدير جميع الخدمات
export const apiService = {
  suppliers: suppliersService,
  companies: companiesService,
  orders: ordersService,
  dashboard: dashboardService
};

export default apiService;