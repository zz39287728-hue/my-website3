import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                  <div className="bg-luxury-50 dark:bg-luxury-950 p-4 rounded-xl border border-luxury-200 dark:border-luxury-800 space-y-3 mb-8">
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 rounded-lg border border-luxury-200 dark:border-luxury-800 cursor-pointer hover:bg-white dark:hover:bg-luxury-900 transition-colors">
                        <input 
                          type="radio" 
                          name="payment_method" 
                          value="now"
                          checked={guestPaymentMethod === 'now'}
                          onChange={() => setGuestPaymentMethod('now')}
                          className="w-5 h-5 text-gold-600 focus:ring-gold-500 accent-gold-600" 
                        />
                        <div>
                          <span className="block text-base font-bold text-luxury-900 dark:text-luxury-50">
                            {isAr ? 'الدفع الآن' : 'Pay Now'}
                          </span>
                          <span className="block text-sm font-medium text-luxury-600 dark:text-luxury-400">
                            {isAr ? 'سيتم تحويلك إلى صفحة الدفع لإتمام العملية.' : 'You will be redirected to checkout.'}
                          </span>
                        </div>
                      </label>
                      
                      <label className="flex items-center gap-3 p-4 rounded-lg border border-luxury-200 dark:border-luxury-800 cursor-pointer hover:bg-white dark:hover:bg-luxury-900 transition-colors">
                        <input 
                          type="radio" 
                          name="payment_method" 
                          value="after"
                          checked={guestPaymentMethod === 'after'}
                          onChange={() => setGuestPaymentMethod('after')}
                          className="w-5 h-5 text-gold-600 focus:ring-gold-500 accent-gold-600" 
                        />
                        <div>
                          <span className="block text-base font-bold text-luxury-900 dark:text-luxury-50">
                            {isAr ? 'الدفع بعد الاستشارة' : 'Pay After Consultation'}
                          </span>
                          <span className="block text-sm font-medium text-luxury-600 dark:text-luxury-400">
                            {isAr ? 'سيتم تأكيد الموعد مبدئياً وتدفع لاحقاً.' : 'Appointment will be provisionally confirmed and paid later.'}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>`;

const newStr = `                  <div className="space-y-4 mb-8">
                    <label className={\`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all \${
                      guestPaymentMethod === 'now' 
                        ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' 
                        : 'border-luxury-200 dark:border-luxury-800 hover:border-luxury-300 dark:hover:border-luxury-700 bg-transparent'
                    }\`}>
                      <input 
                        type="radio" 
                        name="payment_method" 
                        value="now"
                        checked={guestPaymentMethod === 'now'}
                        onChange={() => setGuestPaymentMethod('now')}
                        className="mt-1 w-5 h-5 text-gold-600 focus:ring-gold-500 accent-gold-600 shrink-0" 
                      />
                      <div>
                        <span className="block text-lg font-bold text-luxury-900 dark:text-luxury-50 mb-1">
                          {isAr ? 'الدفع الآن' : 'Pay Now'}
                        </span>
                        <span className="block text-sm font-medium text-luxury-600 dark:text-luxury-400 leading-relaxed">
                          {isAr ? 'سيتم تحويلك إلى صفحة الدفع لإتمام العملية.' : 'You will be redirected to checkout.'}
                        </span>
                      </div>
                    </label>
                    
                    <label className={\`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all \${
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
                    </label>
                  </div>`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(path, content);
