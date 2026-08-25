// أدوات مساعدة للدعم الثنائي الاتجاه (RTL)
// RTL (Right-to-Left) Utility Functions

/**
 * تحديد اتجاه النص بناءً على اللغة
 * Determines text direction based on language
 */
export const getTextDirection = (text: string): 'rtl' | 'ltr' => {
  // تحقق من وجود أحرف عربية
  const arabicRegex = /[؀-ۿݐ-ݿ]/;
  return arabicRegex.test(text) ? 'rtl' : 'ltr';
};

/**
 * تطبيق الاتجاه المناسب على عنصر
 * Apply appropriate direction to an element
 */
export const applyDirection = (element: HTMLElement, text: string): void => {
  const direction = getTextDirection(text);
  element.setAttribute('dir', direction);
  element.style.textAlign = direction === 'rtl' ? 'right' : 'left';
};

/**
 * فئات CSS للاتجاه الصحيح
 * CSS classes for proper direction
 */
export const getDirectionClasses = (isRTL: boolean = true) => {
  return {
    container: isRTL ? 'dir-rtl text-right' : 'dir-ltr text-left',
    flexReverse: isRTL ? 'flex-row-reverse' : 'flex-row',
    marginStart: isRTL ? 'mr-4' : 'ml-4',
    marginEnd: isRTL ? 'ml-4' : 'mr-4',
    paddingStart: isRTL ? 'pr-4' : 'pl-4',
    paddingEnd: isRTL ? 'pl-4' : 'pr-4',
    roundedStart: isRTL ? 'rounded-r-lg' : 'rounded-l-lg',
    roundedEnd: isRTL ? 'rounded-l-lg' : 'rounded-r-lg',
    textAlign: isRTL ? 'text-right' : 'text-left',
    borderStart: isRTL ? 'border-r' : 'border-l',
    borderEnd: isRTL ? 'border-l' : 'border-r'
  };
};

/**
 * تحويل الأرقام الإنجليزية إلى عربية
 * Convert English numerals to Arabic numerals
 */
export const toArabicNumerals = (str: string): string => {
  const englishToArabic = {
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩'
  };

  return str.replace(/[0-9]/g, (match) => englishToArabic[match as keyof typeof englishToArabic] || match);
};

/**
 * تحويل الأرقام العربية إلى إنجليزية
 * Convert Arabic numerals to English numerals
 */
export const toEnglishNumerals = (str: string): string => {
  const arabicToEnglish = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9'
  };

  return str.replace(/[٠-٩]/g, (match) => arabicToEnglish[match as keyof typeof arabicToEnglish] || match);
};

/**
 * تنسيق الأرقام مع الفواصل باللغة العربية
 * Format numbers with Arabic locale
 */
export const formatNumberArabic = (
  num: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  const formatter = new Intl.NumberFormat('ar-SA', {
    maximumFractionDigits: 2,
    ...options
  });
  return formatter.format(num);
};

/**
 * تنسيق العملة باللغة العربية
 * Format currency in Arabic locale
 */
export const formatCurrencyArabic = (
  amount: number,
  currency: string = 'SAR'
): string => {
  const formatter = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  return formatter.format(amount);
};

/**
 * تنسيق التاريخ باللغة العربية
 * Format date in Arabic locale
 */
export const formatDateArabic = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formatter = new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  });
  return formatter.format(dateObj);
};

/**
 * تنسيق الوقت باللغة العربية
 * Format time in Arabic locale
 */
export const formatTimeArabic = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formatter = new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  });
  return formatter.format(dateObj);
};

/**
 * الحصول على كلاسات Tailwind للاتجاه
 * Get Tailwind direction classes
 */
export const rtlClasses = {
  // هوامش - Margins
  mr: 'ml', // margin-right becomes margin-left
  ml: 'mr', // margin-left becomes margin-right

  // حشو - Padding
  pr: 'pl', // padding-right becomes padding-left
  pl: 'pr', // padding-left becomes padding-right

  // حدود - Borders
  'border-r': 'border-l',
  'border-l': 'border-r',
  'rounded-r': 'rounded-l',
  'rounded-l': 'rounded-r',

  // موقع - Position
  right: 'left',
  left: 'right',

  // فلكس - Flex
  'justify-start': 'justify-end',
  'justify-end': 'justify-start',
  'items-start': 'items-end',
  'items-end': 'items-start',

  // نص - Text
  'text-left': 'text-right',
  'text-right': 'text-left'
};

/**
 * تحويل كلاس Tailwind للاتجاه المعاكس
 * Convert Tailwind class for opposite direction
 */
export const convertRTLClass = (className: string): string => {
  return rtlClasses[className as keyof typeof rtlClasses] || className;
};

/**
 * تطبيق الاتجاه على مصفوفة من الكلاسات
 * Apply direction to array of classes
 */
export const applyRTLClasses = (classes: string[]): string[] => {
  return classes.map(cls => convertRTLClass(cls));
};

/**
 * فئة مساعدة لإدارة الاتجاه في المكونات
 * Helper class for managing direction in components
 */
export class RTLManager {
  private isRTL: boolean;

  constructor(isRTL: boolean = true) {
    this.isRTL = isRTL;
  }

  getClass(baseClass: string): string {
    if (!this.isRTL) return baseClass;
    return convertRTLClass(baseClass);
  }

  getClasses(classes: string[]): string {
    const processedClasses = this.isRTL ? applyRTLClasses(classes) : classes;
    return processedClasses.join(' ');
  }

  getDirection(): 'rtl' | 'ltr' {
    return this.isRTL ? 'rtl' : 'ltr';
  }

  getTextAlign(): 'right' | 'left' {
    return this.isRTL ? 'right' : 'left';
  }
}

// إنشاء مثيل افتراضي
export const rtlManager = new RTLManager(true);

// تصدير الوظائف الرئيسية
export default {
  getTextDirection,
  applyDirection,
  getDirectionClasses,
  toArabicNumerals,
  toEnglishNumerals,
  formatNumberArabic,
  formatCurrencyArabic,
  formatDateArabic,
  formatTimeArabic,
  convertRTLClass,
  applyRTLClasses,
  RTLManager,
  rtlManager
};