import fs from 'fs';
const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetHtml = `              {!guestBookingSuccess ? (
                <>
                  <div className="text-center mb-8">
                    <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-3">
                      {isAr ? 'خيارات الحجز للضيف' : 'Guest Booking Options'}
                    </h3>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm leading-relaxed">
                      {isAr 
                        ? 'يمكنك تسجيل الدخول للاستفادة من جميع الميزات، أو المتابعة كضيف من خلال إدخال رقم هاتفك للتواصل.' 
                        : 'You can log in to access all features, or continue as a guest by entering your phone number for contact.'}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <button 
                      onClick={() => {
                        setShowGuestBookingModal(false);
                        setShowGuestLockModal(true);
                      }}
                      className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-white rounded-xl font-bold shadow-md hover:scale-[1.02] transition-all"
                    >
                      {isAr ? 'الذهاب إلى تسجيل الدخول' : 'Go to Login'}
                    </button>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-luxury-200 dark:border-luxury-800"></div>
                      <span className="flex-shrink-0 mx-4 text-luxury-400 text-sm font-medium">{isAr ? 'أو' : 'OR'}</span>
                      <div className="flex-grow border-t border-luxury-200 dark:border-luxury-800"></div>
                    </div>

                    <div className="space-y-4">
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
                        </label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                          placeholder={isAr ? '+973 XXXX XXXX' : '+973 XXXX XXXX'}
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                          {isAr ? 'تأكيد رقم الهاتف' : 'Confirm Phone Number'}
                        </label>
                        <input
                          type="tel"
                          value={guestPhoneConfirm}
                          onChange={(e) => setGuestPhoneConfirm(e.target.value)}
                          className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                          placeholder={isAr ? '+973 XXXX XXXX' : '+973 XXXX XXXX'}
                          dir="ltr"
                        />
                      </div>

                      {guestPhoneError && (
                        <p className="text-red-500 text-sm font-bold">{guestPhoneError}</p>
                      )}

                      <div className="pt-2">
                        <Button onClick={confirmGuestBooking} className="w-full py-4" variant="outline">
                          {isAr ? 'إرسال إلى المصممة للتأكيد' : 'Send to Designer for Confirmation'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (`;
              
const replaceHtml = `              {guestBookingSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                    {isAr ? 'تم إرسال الطلب بنجاح' : 'Request Sent Successfully'}
                  </h3>
                  <p className="text-luxury-600 dark:text-luxury-400">
                    {isAr 
                      ? 'سيتم التواصل معك قريباً لتأكيد الحجز.' 
                      : 'You will be contacted soon to confirm the booking.'}
                  </p>
                </div>
              ) : guestModalStep === 'phone' ? (
                <>
                  <div className="text-center mb-8">
                    <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-3">
                      {isAr ? 'خيارات الحجز للضيف' : 'Guest Booking Options'}
                    </h3>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm leading-relaxed">
                      {isAr 
                        ? 'يمكنك تسجيل الدخول للاستفادة من جميع الميزات، أو المتابعة كضيف من خلال إدخال رقم هاتفك للتواصل.' 
                        : 'You can log in to access all features, or continue as a guest by entering your phone number for contact.'}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <button 
                      onClick={() => {
                        setShowGuestBookingModal(false);
                        setShowGuestLockModal(true);
                      }}
                      className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-white rounded-xl font-bold shadow-md hover:scale-[1.02] transition-all"
                    >
                      {isAr ? 'الذهاب إلى تسجيل الدخول' : 'Go to Login'}
                    </button>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-luxury-200 dark:border-luxury-800"></div>
                      <span className="flex-shrink-0 mx-4 text-luxury-400 text-sm font-medium">{isAr ? 'أو' : 'OR'}</span>
                      <div className="flex-grow border-t border-luxury-200 dark:border-luxury-800"></div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                          {isAr ? 'رقم الهاتف' : 'Phone Number'}
                        </label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                          placeholder={isAr ? '+973 XXXX XXXX' : '+973 XXXX XXXX'}
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                          {isAr ? 'تأكيد رقم الهاتف' : 'Confirm Phone Number'}
                        </label>
                        <input
                          type="tel"
                          value={guestPhoneConfirm}
                          onChange={(e) => setGuestPhoneConfirm(e.target.value)}
                          className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                          placeholder={isAr ? '+973 XXXX XXXX' : '+973 XXXX XXXX'}
                          dir="ltr"
                        />
                      </div>

                      {guestPhoneError && (
                        <p className="text-red-500 text-sm font-bold">{guestPhoneError}</p>
                      )}

                      <div className="pt-2">
                        <Button onClick={confirmGuestBooking} className="w-full py-4" variant="outline">
                          {isAr ? 'التالي' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-3">
                      {isAr ? 'طريقة الدفع' : 'Payment Method'}
                    </h3>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm leading-relaxed">
                      {isAr 
                        ? 'الرجاء تحديد طريقة الدفع للاستشارة.' 
                        : 'Please select how you would like to pay for the consultation.'}
                    </p>
                  </div>
                  
                  <div className="bg-luxury-50 dark:bg-luxury-950 p-4 rounded-xl border border-luxury-200 dark:border-luxury-800 space-y-3 mb-8">
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
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={() => setGuestModalStep('phone')} variant="outline" className="flex-1 py-4">
                      {isAr ? 'رجوع' : 'Back'}
                    </Button>
                    <Button onClick={confirmGuestBooking} variant="primary" className="flex-1 py-4">
                      {isAr ? 'تأكيد' : 'Confirm'}
                    </Button>
                  </div>
                </>
              )}
              {false && (`; // To swallow the previous success render block. But wait, I'll just remove the old success block in full.

// Let's accurately slice it
// I will find the exact indexes.
