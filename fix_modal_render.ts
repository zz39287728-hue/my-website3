import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const transitionTarget = `                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-3">`;

const transitionReplacement = `                    </div>
                  </div>
                </>
              ) : guestModalStep === 'payment' ? (
                <>
                  <div className="text-center mb-8">
                    <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-3">`;

content = content.replace(transitionTarget, transitionReplacement);

const endTarget = `                  <div className="flex gap-4">
                    <Button onClick={() => setGuestModalStep('phone')} variant="outline" className="flex-1 py-4">
                      {isAr ? 'رجوع' : 'Back'}
                    </Button>
                    <Button onClick={confirmGuestBooking} variant="primary" className="flex-1 py-4">
                      {isAr ? 'تأكيد' : 'Confirm'}
                    </Button>
                  </div>
                </>
              )}`;

const endReplacement = `                  <div className="flex gap-4">
                    <Button onClick={() => setGuestModalStep('phone')} variant="outline" className="flex-1 py-4">
                      {isAr ? 'رجوع' : 'Back'}
                    </Button>
                    <Button onClick={confirmGuestBooking} variant="primary" className="flex-1 py-4">
                      {isAr ? 'تأكيد' : 'Confirm'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                      {isAr ? 'تأكيد رقم الهاتف' : 'Verify Phone Number'}
                    </h3>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm leading-relaxed">
                      {isAr 
                        ? 'الرجاء إدخال رمز التحقق (OTP) المكون من 4 أرقام الذي تم إرساله إلى رقم هاتفك.' 
                        : 'Please enter the 4-digit verification code (OTP) sent to your phone number.'}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-2">
                      {isAr ? 'رمز التحقق' : 'Verification Code'}
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={guestOtp}
                      onChange={(e) => setGuestOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className={\`w-full bg-luxury-50 dark:bg-luxury-950 border \${
                        guestOtpError 
                          ? 'border-red-500 ring-1 ring-red-500' 
                          : 'border-luxury-200 dark:border-luxury-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500'
                      } rounded-xl px-4 py-4 outline-none text-luxury-900 dark:text-luxury-50 text-center text-2xl font-bold tracking-[1em] transition-colors\`}
                      placeholder="••••"
                      dir="ltr"
                    />
                    {guestOtpError && (
                      <p className="text-red-500 text-sm mt-2">{guestOtpError}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setGuestModalStep(calculateCost() > 0 ? 'payment' : 'phone')} 
                      variant="outline" 
                      className="flex-1 py-4"
                    >
                      {isAr ? 'رجوع' : 'Back'}
                    </Button>
                    <Button onClick={confirmGuestBooking} variant="primary" className="flex-1 py-4">
                      {isAr ? 'تأكيد' : 'Verify'}
                    </Button>
                  </div>
                </>
              )}`;

content = content.replace(endTarget, endReplacement);
fs.writeFileSync(path, content);
