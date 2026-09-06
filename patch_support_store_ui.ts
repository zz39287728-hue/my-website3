import fs from 'fs';

const path = 'src/pages/SupportStore.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '        <h1 className="text-3xl font-serif font-bold text-luxury-900 dark:text-luxury-50 mb-2">\n          {isAr ? \'إدارة المتجر والأسعار\' : \'Store & Pricing Management\'}\n        </h1>',
  '        <h1 className="text-3xl font-serif font-bold text-luxury-900 dark:text-luxury-50 mb-2 flex items-center gap-3">\n          <Store className="text-gold-600" size={32} />\n          {isAr ? \'إدارة المتجر الشامل\' : \'Global Store Management\'}\n        </h1>'
);

content = content.replace(
  '          {isAr ? \'تعديل الكولكشنات الحصرية، الباقات، والاستشارات المعروضة للعملاء.\' : \'Manage exclusive collections, packages, and consultations available to clients.\'}',
  '          {isAr ? \'تعديل الكولكشنات الحصرية، الباقات، والاستشارات لجميع العملاء في الموقع.\' : \'Manage exclusive collections, packages, and consultations globally across the platform.\'}'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Title<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "العنوان" : "Title"}</label>'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Price<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر" : "Price"}</label>'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Original Price \(Before Discount\)<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر الأصلي (قبل الخصم)" : "Original Price (Before Discount)"}</label>'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Category<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "التصنيف" : "Category"}</label>'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Name<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "الاسم" : "Name"}</label>'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Name \(Ar\)<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "الاسم (بالعربي)" : "Name (Ar)"}</label>'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Price \(Text\)<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر (نص)" : "Price (Text)"}</label>'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Price \(Number\)<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر (رقم)" : "Price (Number)"}</label>'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Original Price \(Number\)<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر الأصلي (رقم)" : "Original Price (Number)"}</label>'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Duration<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "المدة" : "Duration"}</label>'
);

content = content.replace(
  /<label className="text-xs text-luxury-500 mb-1 block">Original Price<\/label>/g,
  '<label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر الأصلي" : "Original Price"}</label>'
);

// Better styling for inputs
content = content.replace(
  /className="w-full p-2 border border-luxury-200 dark:border-luxury-800 rounded bg-transparent"/g,
  'className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all"'
);


// Replace Store badge logic with an actual discount percentage if originalPrice exists
content = content.replace(
  '{item.originalPrice && <span className="line-through text-luxury-400 text-sm">{item.originalPrice} BHD</span>}',
  '{item.originalPrice && <span className="line-through text-luxury-400 text-sm">{item.originalPrice} BHD</span>}\n                    {item.originalPrice && item.price && (\n                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">\n                        {Math.round(((item.originalPrice - (typeof item.price === "number" ? item.price : parseFloat(item.price as string))) / item.originalPrice) * 100)}% OFF\n                      </span>\n                    )}'
);

fs.writeFileSync(path, content);
