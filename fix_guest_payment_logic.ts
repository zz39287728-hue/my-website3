import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update the success message based on guestPaymentMethod
const successTarget = `                  <p className="text-luxury-600 dark:text-luxury-400">
                    {isAr 
                      ? 'سيتم التواصل معك قريباً لتأكيد الحجز.' 
                      : 'You will be contacted soon to confirm the booking.'}
                  </p>`;

const successReplacement = `                  <p className="text-luxury-600 dark:text-luxury-400 mt-2">
                    {guestPaymentMethod === 'now' 
                      ? (isAr ? 'طلبك موجود الآن في العربة لإتمام الدفع.' : 'Your request is in the cart to complete payment.')
                      : (isAr ? 'سيتم التواصل معك قريباً لتأكيد الحجز.' : 'You will be contacted soon to confirm the booking.')}
                  </p>`;

content = content.replace(successTarget, successReplacement);

// 2. Disable "Pay After" if bookingType === 'Virtual', and add note
const paymentTarget = `                    <label className={\`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all \${
                      guestPaymentMethod === 'after' 
                        ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' 
                        : 'border-luxury-200 dark:border-luxury-800 hover:border-luxury-300 dark:hover:border-luxury-700 bg-transparent'
                    }\`}>
                      <input 
                        type="radio" 
                        name="payment_method" 
                        value="after"
                        checked={guestPaymentMethod === 'after'}
                        onChange={() => setGuestPaymentMethod('after')}
                        className="mt-1 w-5 h-5 text-gold-600 focus:ring-gold-500 accent-gold-600 shrink-0" 
                      />
                      <div>
                        <span className="block text-lg font-bold text-luxury-900 dark:text-luxury-50 mb-1">
                          {isAr ? 'الدفع بعد الاستشارة' : 'Pay After Consultation'}
                        </span>
                        <span className="block text-sm font-medium text-luxury-600 dark:text-luxury-400 leading-relaxed">
                          {isAr ? 'سيتم تأكيد الموعد مبدئياً وتدفع لاحقاً.' : 'Appointment will be provisionally confirmed and paid later.'}
                        </span>
                      </div>
                    </label>`;

const paymentReplacement = `                    <label className={\`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all \${
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

content = content.replace(paymentTarget, paymentReplacement);
fs.writeFileSync(path, content);
