import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                  <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                    {isAr ? 'تم إرسال الطلب بنجاح' : 'Request Sent Successfully'}
                  </h3>`;

const newStr = `                  <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    {guestPaymentMethod === 'now' ? (
                      <ShoppingCart size={40} className="text-green-500" />
                    ) : (
                      <CheckCircle2 size={40} className="text-green-500" />
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                    {guestPaymentMethod === 'now' 
                      ? (isAr ? 'تمت الإضافة للسلة' : 'Added to Cart')
                      : (isAr ? 'تم إرسال الطلب بنجاح' : 'Request Sent Successfully')}
                  </h3>`;

content = content.replace(targetStr, newStr);

// Ensure ShoppingCart is imported
if (!content.includes('ShoppingCart')) {
  content = content.replace('import { ', 'import { ShoppingCart, ');
}

fs.writeFileSync(path, content);
