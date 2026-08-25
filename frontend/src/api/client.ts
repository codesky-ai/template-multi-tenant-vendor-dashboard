import axios from 'axios';

// إعداد عميل API - API Client Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'ar',
  },
});

// إضافة محاول الطلبات - Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // يمكن إضافة التوكن هنا إذا كان مطلوباً
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log('🔄 إرسال طلب API:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ خطأ في إعداد الطلب:', error);
    return Promise.reject(error);
  }
);

// إضافة محاول الاستجابات - Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ استجابة API ناجحة:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ خطأ في استجابة API:', error.config?.url, error.response?.status);

    // معالجة أخطاء شائعة
    if (error.response?.status === 401) {
      console.warn('🔐 غير مُصرح - قد تحتاج لتسجيل الدخول');
      // يمكن إعادة توجيه إلى صفحة تسجيل الدخول
    } else if (error.response?.status === 403) {
      console.warn('🚫 محظور - ليس لديك صلاحية للوصول');
    } else if (error.response?.status === 404) {
      console.warn('🔍 غير موجود - المورد المطلوب غير متاح');
    } else if (error.response?.status >= 500) {
      console.error('🔥 خطأ في الخادم - مشكلة في النظام');
    } else if (error.code === 'ECONNABORTED') {
      console.error('⏰ انتهت مهلة الطلب - الخادم لا يستجيب');
    } else if (!error.response) {
      console.error('🌐 مشكلة في الشبكة - لا يمكن الوصول للخادم');
    }

    return Promise.reject(error);
  }
);

export default apiClient;