import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add guestPaymentMethod state if not exists
if (!content.includes('guestPaymentMethod')) {
  content = content.replace(
    `const [guestPhoneError, setGuestPhoneError] = useState('');`,
    `const [guestPhoneError, setGuestPhoneError] = useState('');
  const [guestPaymentMethod, setGuestPaymentMethod] = useState<'after' | 'now'>('after');`
  );
}

// 2. Add Radio buttons to Modal
const modalTarget = `                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                          {isAr ? 'رقم الهاتف' : 'Phone Number'}
                        </label>`;
const modalReplacement = `                    <div className="space-y-4">
                      {calculateCost() > 0 && (
                        <div className="bg-luxury-50 dark:bg-luxury-950 p-4 rounded-xl border border-luxury-200 dark:border-luxury-800 space-y-3 mb-6">
                          <label className="block text-sm font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                            {isAr ? 'طريقة الدفع' : 'Payment Method'}
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-luxury-200 dark:border-luxury-800 cursor-pointer hover:bg-white dark:hover:bg-luxury-900 transition-colors">
                              <input 
                                type="radio" 
                                name="payment_method" 
                                value="after"
                                checked={guestPaymentMethod === 'after'}
                                onChange={() => setGuestPaymentMethod('after')}
                                className="w-4 h-4 text-gold-600 focus:ring-gold-500 accent-gold-600" 
                              />
                              <span className="text-sm font-medium text-luxury-700 dark:text-luxury-300">
                                {isAr ? 'الدفع بعد الاستشارة' : 'Pay After Consultation'}
                              </span>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-lg border border-luxury-200 dark:border-luxury-800 cursor-pointer hover:bg-white dark:hover:bg-luxury-900 transition-colors">
                              <input 
                                type="radio" 
                                name="payment_method" 
                                value="now"
                                checked={guestPaymentMethod === 'now'}
                                onChange={() => setGuestPaymentMethod('now')}
                                className="w-4 h-4 text-gold-600 focus:ring-gold-500 accent-gold-600" 
                              />
                              <span className="text-sm font-medium text-luxury-700 dark:text-luxury-300">
                                {isAr ? 'الدفع الآن' : 'Pay Now'}
                              </span>
                            </label>
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                          {isAr ? 'رقم الهاتف' : 'Phone Number'}
                        </label>`;

if (!content.includes('payment_method')) {
  content = content.replace(modalTarget, modalReplacement);
}


fs.writeFileSync(path, content);
