import { Supplier, Company, Order, DashboardStats } from '../types';

// بيانات تجريبية للموردين مع صور حقيقية من Unsplash
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'شركة النجمة للتجارة',
    email: 'info@alnamja-trade.sa',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    company: 'مجموعة النجمة التجارية',
    category: 'الإلكترونيات',
    status: 'نشط',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    registrationDate: '2023-01-15',
    totalOrders: 45,
    totalValue: 125000,
    description: 'مورد موثوق للإلكترونيات والأجهزة التقنية',
    website: 'www.alnamja-trade.sa',
    contactPerson: 'أحمد محمد العلي',
    paymentTerms: '30 يوم',
    deliveryTime: 7
  },
  {
    id: '2',
    name: 'المؤسسة الذهبية للمواد الغذائية',
    email: 'sales@golden-food.com',
    phone: '+966507654321',
    address: 'جدة، المملكة العربية السعودية',
    company: 'المؤسسة الذهبية',
    category: 'المواد الغذائية',
    status: 'نشط',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    registrationDate: '2023-02-20',
    totalOrders: 78,
    totalValue: 89500,
    description: 'مورد متخصص في المواد الغذائية الطازجة والمعلبة',
    website: 'www.golden-food.com',
    contactPerson: 'فاطمة عبدالله',
    paymentTerms: '15 يوم',
    deliveryTime: 3
  },
  {
    id: '3',
    name: 'شركة البناء المتقدم',
    email: 'contracts@advanced-construction.sa',
    phone: '+966509876543',
    address: 'الدمام، المملكة العربية السعودية',
    company: 'البناء المتقدم المحدودة',
    category: 'مواد البناء',
    status: 'معلق',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150',
    registrationDate: '2023-03-10',
    totalOrders: 23,
    totalValue: 340000,
    description: 'متخصص في توريد مواد البناء والإنشاءات',
    website: 'www.advanced-construction.sa',
    contactPerson: 'محمد عبدالعزيز',
    paymentTerms: '45 يوم',
    deliveryTime: 14
  },
  {
    id: '4',
    name: 'مكتب الأزياء العصرية',
    email: 'orders@modern-fashion.com',
    phone: '+966502468135',
    address: 'الرياض، المملكة العربية السعودية',
    company: 'الأزياء العصرية للتجارة',
    category: 'الملابس والأزياء',
    status: 'نشط',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    registrationDate: '2023-04-05',
    totalOrders: 134,
    totalValue: 67800,
    description: 'مورد للملابس والأزياء العصرية للرجال والنساء',
    website: 'www.modern-fashion.com',
    contactPerson: 'سارة أحمد',
    paymentTerms: '21 يوم',
    deliveryTime: 5
  },
  {
    id: '5',
    name: 'شركة الحاسوب الذكي',
    email: 'support@smart-computer.sa',
    phone: '+966503691470',
    address: 'الخبر، المملكة العربية السعودية',
    company: 'الحاسوب الذكي للتقنية',
    category: 'الحاسوب والبرمجيات',
    status: 'محظور',
    rating: 3.1,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    registrationDate: '2023-05-12',
    totalOrders: 12,
    totalValue: 45600,
    description: 'مورد أجهزة الحاسوب والبرمجيات',
    website: 'www.smart-computer.sa',
    contactPerson: 'خالد محمود',
    paymentTerms: '60 يوم',
    deliveryTime: 10
  },
  {
    id: '6',
    name: 'مؤسسة الأثاث الفاخر',
    email: 'sales@luxury-furniture.com',
    phone: '+966504826159',
    address: 'مكة المكرمة، المملكة العربية السعودية',
    company: 'الأثاث الفاخر',
    category: 'الأثاث والديكور',
    status: 'نشط',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    registrationDate: '2023-06-18',
    totalOrders: 67,
    totalValue: 198500,
    description: 'متخصص في الأثاث الفاخر وقطع الديكور',
    website: 'www.luxury-furniture.com',
    contactPerson: 'نورا عبدالرحمن',
    paymentTerms: '30 يوم',
    deliveryTime: 12
  }
];

// بيانات تجريبية للشركات
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'شركة التقنيات المتقدمة',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
    address: 'الرياض، المملكة العربية السعودية',
    phone: '+966112345678',
    email: 'info@advanced-tech.sa',
    website: 'www.advanced-tech.sa',
    industry: 'التكنولوجيا',
    employeesCount: 250,
    establishedYear: 2015
  },
  {
    id: '2',
    name: 'مجموعة الخليج التجارية',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100',
    address: 'دبي، الإمارات العربية المتحدة',
    phone: '+97143216549',
    email: 'contact@gulf-trading.ae',
    website: 'www.gulf-trading.ae',
    industry: 'التجارة العامة',
    employeesCount: 180,
    establishedYear: 2010
  },
  {
    id: '3',
    name: 'الشركة الوطنية للصناعات',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100',
    address: 'الكويت، الكويت',
    phone: '+96522887766',
    email: 'info@national-industries.kw',
    website: 'www.national-industries.kw',
    industry: 'الصناعة',
    employeesCount: 420,
    establishedYear: 2008
  }
];

// بيانات تجريبية للطلبات
export const mockOrders: Order[] = [
  {
    id: '1',
    supplierId: '1',
    companyId: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'مكتمل',
    totalAmount: 12500.00,
    items: [
      {
        id: '1',
        name: 'أجهزة لابتوب ديل',
        quantity: 10,
        unitPrice: 1200.00,
        totalPrice: 12000.00,
        description: 'لابتوب ديل انسبايرون 15'
      },
      {
        id: '2',
        name: 'ماوس لاسلكي',
        quantity: 10,
        unitPrice: 50.00,
        totalPrice: 500.00,
        description: 'ماوس لوجيتك لاسلكي'
      }
    ],
    deliveryDate: '2024-01-22',
    notes: 'تم التسليم في الموعد المحدد'
  },
  {
    id: '2',
    supplierId: '2',
    companyId: '1',
    orderNumber: 'ORD-2024-002',
    date: '2024-02-01',
    status: 'قيد الانتظار',
    totalAmount: 8750.00,
    items: [
      {
        id: '3',
        name: 'مواد غذائية متنوعة',
        quantity: 1,
        unitPrice: 8750.00,
        totalPrice: 8750.00,
        description: 'طلبية شهرية من المواد الغذائية'
      }
    ],
    deliveryDate: '2024-02-08',
    notes: 'في انتظار تأكيد التسليم'
  }
];

// إحصائيات لوحة التحكم
export const mockDashboardStats: DashboardStats = {
  totalSuppliers: 6,
  activeSuppliers: 4,
  totalOrders: 2,
  totalRevenue: 21250.00,
  monthlyGrowth: 15.3,
  topCategories: [
    { category: 'الإلكترونيات', count: 2, percentage: 33.3 },
    { category: 'المواد الغذائية', count: 1, percentage: 16.7 },
    { category: 'مواد البناء', count: 1, percentage: 16.7 },
    { category: 'الملابس والأزياء', count: 1, percentage: 16.7 },
    { category: 'الأثاث والديكور', count: 1, percentage: 16.7 }
  ]
};

// تصدير البيانات التجريبية - Mock Data Export
export const mockData = {
  suppliers: mockSuppliers,
  companies: mockCompanies,
  orders: mockOrders,
  dashboardStats: mockDashboardStats
};

export default mockData;