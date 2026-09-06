import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes(") : guestModalStep === 'phone' ? ("));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.includes(') : ('));

if (startIndex !== -1 && endIndex !== -1) {
    const newBlock = `              ) : guestModalStep === 'phone' ? (
                <>
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                      {isAr ? 'المتابعة كضيف' : 'Continue as a Guest'}
                    </h3>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm leading-relaxed">
                      {isAr 
                        ? 'يرجى إدخال رقم هاتفك للتواصل وتأكيد الحجز.' 
                        : 'Please enter your phone number to proceed with the booking.'}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1.5">
                        {isAr ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3.5 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder={isAr ? '+973 XXXX XXXX' : '+973 XXXX XXXX'}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1.5">
                        {isAr ? 'تأكيد رقم الهاتف' : 'Confirm Phone Number'}
                      </label>
                      <input
                        type="tel"
                        value={guestPhoneConfirm}
                        onChange={(e) => setGuestPhoneConfirm(e.target.value)}
                        className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3.5 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder={isAr ? '+973 XXXX XXXX' : '+973 XXXX XXXX'}
                        dir="ltr"
                      />
                    </div>

                    {guestPhoneError && (
                      <p className="text-red-500 text-sm font-bold">{guestPhoneError}</p>
                    )}

                    <div className="pt-2">
                      <Button onClick={confirmGuestBooking} variant="primary" className="w-full py-4 text-base shadow-md">
                        {isAr ? 'التالي' : 'Next'}
                      </Button>
                    </div>

                    <div className="pt-4 text-center mt-2">
                      <p className="text-sm text-luxury-500 dark:text-luxury-400">
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
                      </p>
                    </div>
                  </div>
                </>`;
    
    lines.splice(startIndex, endIndex - startIndex, ...newBlock.split('\n'));
    fs.writeFileSync(path, lines.join('\n'));
    console.log('Successfully redesigned guest modal');
} else {
    console.log('Failed to find bounds:', startIndex, endIndex);
}
