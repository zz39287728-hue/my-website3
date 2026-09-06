import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `          <Button className="w-full" disabled={!selectedDate || !selectedTime} onClick={handleBooking}>
            {t('booking.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};`;

const replacement = `          <Button className="w-full" disabled={!selectedDate || !selectedTime} onClick={handleBooking}>
            {t('booking.confirm')}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showGuestModal && (
          <div className="fixed inset-0 bg-luxury-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-luxury-900 p-8 rounded-3xl max-w-md w-full border border-luxury-200 dark:border-luxury-800 shadow-2xl relative"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <button 
                onClick={() => setShowGuestModal(false)}
                className="absolute top-6 right-6 p-2 text-luxury-500 hover:text-luxury-900 dark:hover:text-luxury-100 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                  {isAr ? 'تأكيد الحجز للضيف' : 'Guest Booking Confirmation'}
                </h3>
                <p className="text-luxury-600 dark:text-luxury-400 text-sm">
                  {isAr 
                    ? 'يرجى إدخال رقم هاتفك لتأكيد الحجز. سيتواصل معك فريقنا.' 
                    : 'Please enter your phone number to confirm the booking. Our team will contact you.'}
                </p>
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

                <div className="pt-4">
                  <Button onClick={confirmGuestBooking} className="w-full py-4">
                    {isAr ? 'تأكيد الحجز' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};`;

content = content.replace(target, replacement);

fs.writeFileSync(path, content);
console.log('Added guest modal');
