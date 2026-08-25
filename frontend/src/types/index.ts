// أنواع البيانات الأساسية - Basic Data Types

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  category: string;
  status: 'نشط' | 'معلق' | 'محظور';
  rating: number;
  image: string;
  registrationDate: string;
  totalOrders: number;
  totalValue: number;
  description?: string;
  website?: string;
  contactPerson?: string;
  paymentTerms?: string;
  deliveryTime?: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  industry: string;
  employeesCount: number;
  establishedYear: number;
}

export interface Order {
  id: string;
  supplierId: string;
  companyId: string;
  orderNumber: string;
  date: string;
  status: 'قيد الانتظار' | 'مؤكد' | 'مشحون' | 'مكتمل' | 'ملغي';
  totalAmount: number;
  items: OrderItem[];
  deliveryDate?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// أنواع النماذج - Form Types
export interface SupplierFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  category: string;
  description?: string;
  website?: string;
  contactPerson?: string;
  paymentTerms?: string;
  deliveryTime?: number;
}

export interface CompanyFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  industry: string;
  employeesCount: number;
  establishedYear: number;
}

// أنواع التنقل والواجهة - Navigation and UI Types
export interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType;
  path: string;
  children?: MenuItem[];
}

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface DashboardStats {
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