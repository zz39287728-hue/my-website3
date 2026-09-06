import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const pTarget = `                    <p className="text-luxury-600 dark:text-luxury-400 text-sm leading-relaxed">
                      {isAr 
                        ? 'يرجى إدخال رقم هاتفك للتواصل وتأكيد الحجز.' 
                        : 'Please enter your phone number to proceed with the booking.'}
                    </p>`;
const pReplacement = `                    <p className="text-luxury-600 dark:text-luxury-400 text-sm leading-relaxed">
                      {isAr 
                        ? 'يرجى إدخال رقم هاتفك كمرجع للتواصل بخصوص الاستشارة. (هذا الإجراء لن يقوم بإنشاء حساب)' 
                        : 'Please enter your phone number as a contact reference. (This will not create an account)'}
                    </p>`;
                    
content = content.replace(pTarget, pReplacement);

const accountTarget = `                      <p className="text-sm text-luxury-500 dark:text-luxury-400">
                        {isAr ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                        <button 
                          onClick={() => {
                            setShowGuestBookingModal(false);
                            setShowGuestLockModal(true);
                          }}
                          className="text-gold-600 dark:text-gold-500 font-bold hover:underline transition-all"
                        >
                          {isAr ? 'تسجيل الدخول' : 'Log in'}
                        </button>
                      </p>`;

const accountReplacement = `                      <p className="text-sm text-luxury-500 dark:text-luxury-400">
                        {isAr ? 'هل ترغب بالاستفادة من جميع الميزات؟ ' : 'Want to unlock all features? '}
                        <button 
                          onClick={() => {
                            setShowGuestBookingModal(false);
                            setShowGuestLockModal(true);
                          }}
                          className="text-gold-600 dark:text-gold-500 font-bold hover:underline transition-all"
                        >
                          {isAr ? 'إنشاء حساب' : 'Create an account'}
                        </button>
                      </p>`;

content = content.replace(accountTarget, accountReplacement);

fs.writeFileSync(path, content);
