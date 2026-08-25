import { Request, Response } from 'express';
import SupplierModel, { CreateSupplierData, UpdateSupplierData } from '../models/Supplier';

// واجهة الاستجابة المعيارية
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// إرسال استجابة نجاح
const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode = 200): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  res.status(statusCode).json(response);
};

// إرسال استجابة خطأ
const sendError = (res: Response, error: string, statusCode = 500): void => {
  const response: ApiResponse = {
    success: false,
    error
  };
  res.status(statusCode).json(response);
};

// جلب جميع الموردين
export const getAllSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔍 طلب جلب جميع الموردين');
    const suppliers = await SupplierModel.findAll();

    // تحويل البيانات من قاعدة البيانات إلى تنسيق الواجهة الأمامية
    const transformedSuppliers = suppliers.map(supplier => ({
      id: supplier.id.toString(),
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      company: supplier.company,
      category: supplier.category,
      status: supplier.status,
      rating: supplier.rating,
      image: supplier.image,
      registrationDate: supplier.registration_date.toISOString().split('T')[0],
      totalOrders: supplier.total_orders,
      totalValue: supplier.total_value,
      description: supplier.description,
      website: supplier.website,
      contactPerson: supplier.contact_person,
      paymentTerms: supplier.payment_terms,
      deliveryTime: supplier.delivery_time
    }));

    sendSuccess(res, transformedSuppliers, `تم جلب ${transformedSuppliers.length} مورد بنجاح`);
  } catch (error: any) {
    console.error('❌ خطأ في جلب الموردين:', error.message);
    sendError(res, 'فشل في جلب بيانات الموردين');
  }
};

// جلب مورد واحد
export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);

    if (isNaN(supplierId)) {
      sendError(res, 'معرف المورد غير صحيح', 400);
      return;
    }

    console.log(`🔍 طلب جلب المورد رقم ${supplierId}`);
    const supplier = await SupplierModel.findById(supplierId);

    if (!supplier) {
      sendError(res, 'المورد غير موجود', 404);
      return;
    }

    // تحويل البيانات
    const transformedSupplier = {
      id: supplier.id.toString(),
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      company: supplier.company,
      category: supplier.category,
      status: supplier.status,
      rating: supplier.rating,
      image: supplier.image,
      registrationDate: supplier.registration_date.toISOString().split('T')[0],
      totalOrders: supplier.total_orders,
      totalValue: supplier.total_value,
      description: supplier.description,
      website: supplier.website,
      contactPerson: supplier.contact_person,
      paymentTerms: supplier.payment_terms,
      deliveryTime: supplier.delivery_time
    };

    sendSuccess(res, transformedSupplier, 'تم جلب بيانات المورد بنجاح');
  } catch (error: any) {
    console.error('❌ خطأ في جلب المورد:', error.message);
    sendError(res, 'فشل في جلب بيانات المورد');
  }
};

// البحث في الموردين
export const searchSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status, category, minRating, limit } = req.query;

    if (!search || typeof search !== 'string') {
      sendError(res, 'نص البحث مطلوب', 400);
      return;
    }

    console.log(`🔍 البحث في الموردين: "${search}"`);

    const filters = {
      status: status as string,
      category: category as string,
      minRating: minRating as string,
      limit: limit as string
    };

    const suppliers = await SupplierModel.search(search, filters);

    // تحويل البيانات
    const transformedSuppliers = suppliers.map(supplier => ({
      id: supplier.id.toString(),
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      company: supplier.company,
      category: supplier.category,
      status: supplier.status,
      rating: supplier.rating,
      image: supplier.image,
      registrationDate: supplier.registration_date.toISOString().split('T')[0],
      totalOrders: supplier.total_orders,
      totalValue: supplier.total_value,
      description: supplier.description,
      website: supplier.website,
      contactPerson: supplier.contact_person,
      paymentTerms: supplier.payment_terms,
      deliveryTime: supplier.delivery_time
    }));

    sendSuccess(res, transformedSuppliers, `تم العثور على ${transformedSuppliers.length} مورد`);
  } catch (error: any) {
    console.error('❌ خطأ في البحث:', error.message);
    sendError(res, 'فشل في البحث عن الموردين');
  }
};

// إنشاء مورد جديد
export const createSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplierData: CreateSupplierData = req.body;

    // التحقق من البيانات المطلوبة
    const requiredFields = ['name', 'email', 'phone', 'address', 'company', 'category'];
    const missingFields = requiredFields.filter(field => !supplierData[field as keyof CreateSupplierData]);

    if (missingFields.length > 0) {
      sendError(res, `الحقول التالية مطلوبة: ${missingFields.join(', ')}`, 400);
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplierData.email)) {
      sendError(res, 'البريد الإلكتروني غير صحيح', 400);
      return;
    }

    // التحقق من عدم وجود البريد الإلكتروني مسبقاً
    const emailExists = await SupplierModel.emailExists(supplierData.email);
    if (emailExists) {
      sendError(res, 'البريد الإلكتروني مستخدم من قبل مورد آخر', 400);
      return;
    }

    // التحقق من عدم وجود رقم الهاتف مسبقاً
    const phoneExists = await SupplierModel.phoneExists(supplierData.phone);
    if (phoneExists) {
      sendError(res, 'رقم الهاتف مستخدم من قبل مورد آخر', 400);
      return;
    }

    console.log('➕ إنشاء مورد جديد:', supplierData.name);
    const supplierId = await SupplierModel.create(supplierData);

    // جلب المورد المنشأ حديثاً
    const newSupplier = await SupplierModel.findById(supplierId);

    if (!newSupplier) {
      sendError(res, 'فشل في إنشاء المورد');
      return;
    }

    // تحويل البيانات
    const transformedSupplier = {
      id: newSupplier.id.toString(),
      name: newSupplier.name,
      email: newSupplier.email,
      phone: newSupplier.phone,
      address: newSupplier.address,
      company: newSupplier.company,
      category: newSupplier.category,
      status: newSupplier.status,
      rating: newSupplier.rating,
      image: newSupplier.image,
      registrationDate: newSupplier.registration_date.toISOString().split('T')[0],
      totalOrders: newSupplier.total_orders,
      totalValue: newSupplier.total_value,
      description: newSupplier.description,
      website: newSupplier.website,
      contactPerson: newSupplier.contact_person,
      paymentTerms: newSupplier.payment_terms,
      deliveryTime: newSupplier.delivery_time
    };

    sendSuccess(res, transformedSupplier, 'تم إنشاء المورد بنجاح', 201);
  } catch (error: any) {
    console.error('❌ خطأ في إنشاء المورد:', error.message);
    sendError(res, 'فشل في إنشاء المورد');
  }
};

// تحديث مورد
export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);

    if (isNaN(supplierId)) {
      sendError(res, 'معرف المورد غير صحيح', 400);
      return;
    }

    const updateData: UpdateSupplierData = req.body;

    // التحقق من وجود المورد
    const existingSupplier = await SupplierModel.findById(supplierId);
    if (!existingSupplier) {
      sendError(res, 'المورد غير موجود', 404);
      return;
    }

    // التحقق من البريد الإلكتروني إذا تم تغييره
    if (updateData.email && updateData.email !== existingSupplier.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        sendError(res, 'البريد الإلكتروني غير صحيح', 400);
        return;
      }

      const emailExists = await SupplierModel.emailExists(updateData.email, supplierId);
      if (emailExists) {
        sendError(res, 'البريد الإلكتروني مستخدم من قبل مورد آخر', 400);
        return;
      }
    }

    // التحقق من رقم الهاتف إذا تم تغييره
    if (updateData.phone && updateData.phone !== existingSupplier.phone) {
      const phoneExists = await SupplierModel.phoneExists(updateData.phone, supplierId);
      if (phoneExists) {
        sendError(res, 'رقم الهاتف مستخدم من قبل مورد آخر', 400);
        return;
      }
    }

    // التحقق من التقييم
    if (updateData.rating !== undefined && (updateData.rating < 0 || updateData.rating > 5)) {
      sendError(res, 'التقييم يجب أن يكون بين 0 و 5', 400);
      return;
    }

    console.log(`✏️ تحديث المورد رقم ${supplierId}`);
    const success = await SupplierModel.update(supplierId, updateData);

    if (!success) {
      sendError(res, 'فشل في تحديث المورد');
      return;
    }

    // جلب البيانات المحدثة
    const updatedSupplier = await SupplierModel.findById(supplierId);

    if (!updatedSupplier) {
      sendError(res, 'فشل في جلب البيانات المحدثة');
      return;
    }

    // تحويل البيانات
    const transformedSupplier = {
      id: updatedSupplier.id.toString(),
      name: updatedSupplier.name,
      email: updatedSupplier.email,
      phone: updatedSupplier.phone,
      address: updatedSupplier.address,
      company: updatedSupplier.company,
      category: updatedSupplier.category,
      status: updatedSupplier.status,
      rating: updatedSupplier.rating,
      image: updatedSupplier.image,
      registrationDate: updatedSupplier.registration_date.toISOString().split('T')[0],
      totalOrders: updatedSupplier.total_orders,
      totalValue: updatedSupplier.total_value,
      description: updatedSupplier.description,
      website: updatedSupplier.website,
      contactPerson: updatedSupplier.contact_person,
      paymentTerms: updatedSupplier.payment_terms,
      deliveryTime: updatedSupplier.delivery_time
    };

    sendSuccess(res, transformedSupplier, 'تم تحديث المورد بنجاح');
  } catch (error: any) {
    console.error('❌ خطأ في تحديث المورد:', error.message);
    sendError(res, 'فشل في تحديث المورد');
  }
};

// حذف مورد
export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supplierId = parseInt(id);

    if (isNaN(supplierId)) {
      sendError(res, 'معرف المورد غير صحيح', 400);
      return;
    }

    // التحقق من وجود المورد
    const existingSupplier = await SupplierModel.findById(supplierId);
    if (!existingSupplier) {
      sendError(res, 'المورد غير موجود', 404);
      return;
    }

    console.log(`🗑️ حذف المورد رقم ${supplierId}`);
    const success = await SupplierModel.delete(supplierId);

    if (!success) {
      sendError(res, 'فشل في حذف المورد');
      return;
    }

    sendSuccess(res, null, 'تم حذف المورد بنجاح');
  } catch (error: any) {
    console.error('❌ خطأ في حذف المورد:', error.message);
    sendError(res, 'فشل في حذف المورد');
  }
};

// الحصول على أفضل الموردين
export const getTopSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit } = req.query;
    const limitNumber = limit ? parseInt(limit as string) : 10;

    if (limitNumber < 1 || limitNumber > 100) {
      sendError(res, 'عدد النتائج يجب أن يكون بين 1 و 100', 400);
      return;
    }

    console.log(`🏆 جلب أفضل ${limitNumber} موردين`);
    const suppliers = await SupplierModel.getTopSuppliers(limitNumber);

    // تحويل البيانات
    const transformedSuppliers = suppliers.map(supplier => ({
      id: supplier.id.toString(),
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      company: supplier.company,
      category: supplier.category,
      status: supplier.status,
      rating: supplier.rating,
      image: supplier.image,
      registrationDate: supplier.registration_date.toISOString().split('T')[0],
      totalOrders: supplier.total_orders,
      totalValue: supplier.total_value,
      description: supplier.description,
      website: supplier.website,
      contactPerson: supplier.contact_person,
      paymentTerms: supplier.payment_terms,
      deliveryTime: supplier.delivery_time
    }));

    sendSuccess(res, transformedSuppliers, `تم جلب أفضل ${transformedSuppliers.length} مورد`);
  } catch (error: any) {
    console.error('❌ خطأ في جلب أفضل الموردين:', error.message);
    sendError(res, 'فشل في جلب أفضل الموردين');
  }
};

// تحديث تقييم المورد
export const updateSupplierRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const supplierId = parseInt(id);

    if (isNaN(supplierId)) {
      sendError(res, 'معرف المورد غير صحيح', 400);
      return;
    }

    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      sendError(res, 'التقييم يجب أن يكون رقم بين 0 و 5', 400);
      return;
    }

    console.log(`⭐ تحديث تقييم المورد ${supplierId} إلى ${rating}`);
    const success = await SupplierModel.updateRating(supplierId, rating);

    if (!success) {
      sendError(res, 'فشل في تحديث التقييم');
      return;
    }

    sendSuccess(res, { rating }, 'تم تحديث التقييم بنجاح');
  } catch (error: any) {
    console.error('❌ خطأ في تحديث التقييم:', error.message);
    sendError(res, 'فشل في تحديث التقييم');
  }
};

// إحصائيات الموردين
export const getSuppliersStats = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📊 جلب إحصائيات الموردين');
    const stats = await SupplierModel.getStats();

    sendSuccess(res, stats, 'تم جلب الإحصائيات بنجاح');
  } catch (error: any) {
    console.error('❌ خطأ في جلب الإحصائيات:', error.message);
    sendError(res, 'فشل في جلب الإحصائيات');
  }
};