import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add state
const stateTarget = `  const [guestModalStep, setGuestModalStep] = useState<"phone" | "payment">("phone");`;
const stateReplacement = `  const [guestModalStep, setGuestModalStep] = useState<"phone" | "payment">("phone");\n  const [showVirtualPaymentError, setShowVirtualPaymentError] = useState(false);`;
content = content.replace(stateTarget, stateReplacement);

// 2. Replace the Pay After block
const payAfterTarget = `                    <label className={\`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all \${
                      bookingType === 'Virtual'
                        ? 'border-luxury-200 dark:border-luxury-800 bg-luxury-100 dark:bg-luxury-900/50 opacity-60 cursor-not-allowed'
                        : guestPaymentMethod === 'after' 
                          ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10 cursor-pointer' 
                          : 'border-luxury-200 dark:border-luxury-800 hover:border-luxury-300 dark:hover:border-luxury-700 bg-transparent cursor-pointer'
                    }\`}>
                      <input 
                        type="radio" 
                        name="payment_method" 
                        value="after"
                        checked={guestPaymentMethod === 'after'}
                        onChange={() => {
                          if (bookingType !== 'Virtual') {
                            setGuestPaymentMethod('after');
                          }
                        }}
                        disabled={bookingType === 'Virtual'}
                        className="mt-1 w-5 h-5 text-gold-600 focus:ring-gold-500 accent-gold-600 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed" 
                      />
                      <div>
                        <span className="block text-lg font-bold text-luxury-900 dark:text-luxury-50 mb-1">
                          {isAr ? 'الدفع بعد الاستشارة' : 'Pay After Consultation'}
                        </span>
                        <span className="block text-sm font-medium text-luxury-600 dark:text-luxury-400 leading-relaxed">
                          {isAr ? 'سيتم تأكيد الموعد مبدئياً وتدفع لاحقاً.' : 'Appointment will be provisionally confirmed and paid later.'}
                        </span>
                        {bookingType === 'Virtual' && (
                          <span className="block text-sm font-bold text-red-500 mt-2">
                            {isAr ? 'الدفع بعد الاستشارة غير متوفر في الاستشارات عبر الزوم.' : 'Pay After Consultation is not available for virtual consultations.'}
                          </span>
                        )}
                      </div>
                    </label>`;

const payAfterReplacement = `                    <div 
                      className={\`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all \${
                        bookingType === 'Virtual'
                          ? 'border-luxury-200 dark:border-luxury-800 bg-luxury-100 dark:bg-luxury-900/50 opacity-60 cursor-pointer'
                          : guestPaymentMethod === 'after' 
                            ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10 cursor-pointer' 
                            : 'border-luxury-200 dark:border-luxury-800 hover:border-luxury-300 dark:hover:border-luxury-700 bg-transparent cursor-pointer'
                      }\`}
                      onClick={(e) => {
                        if (bookingType === 'Virtual') {
                          e.preventDefault();
                          setShowVirtualPaymentError(true);
                          setTimeout(() => setShowVirtualPaymentError(false), 2000);
                        } else {
                          setGuestPaymentMethod('after');
                        }
                      }}
                    >
                      <input 
                        type="radio" 
                        name="payment_method" 
                        value="after"
                        checked={guestPaymentMethod === 'after'}
                        readOnly
                        className="mt-1 w-5 h-5 text-gold-600 focus:ring-gold-500 accent-gold-600 shrink-0 pointer-events-none" 
                      />
                      <div>
                        <span className="block text-lg font-bold text-luxury-900 dark:text-luxury-50 mb-1">
                          {isAr ? 'الدفع بعد الاستشارة' : 'Pay After Consultation'}
                        </span>
                        <span className="block text-sm font-medium text-luxury-600 dark:text-luxury-400 leading-relaxed">
                          {isAr ? 'سيتم تأكيد الموعد مبدئياً وتدفع لاحقاً.' : 'Appointment will be provisionally confirmed and paid later.'}
                        </span>
                        <AnimatePresence>
                          {bookingType === 'Virtual' && showVirtualPaymentError && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              className="overflow-hidden"
                            >
                              <span className="block text-sm font-bold text-red-500">
                                {isAr ? 'الدفع بعد الاستشارة غير متوفر في الاستشارات عبر الزوم.' : 'Pay After Consultation is not available for virtual consultations.'}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>`;

content = content.replace(payAfterTarget, payAfterReplacement);
fs.writeFileSync(path, content);
