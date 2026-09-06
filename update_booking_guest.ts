import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const stateTarget = `  const [blockedError, setBlockedError] = useState<string | null>(null);

  const { globalState, setGlobalState, role, t, setShowGuestLockModal } = useAppContext();`;

const stateReplacement = `  const [blockedError, setBlockedError] = useState<string | null>(null);

  const [showGuestBookingModal, setShowGuestBookingModal] = useState(false);
  const [guestPhone, setGuestPhone] = useState('');
  const [guestPhoneConfirm, setGuestPhoneConfirm] = useState('');
  const [guestPhoneError, setGuestPhoneError] = useState('');
  const [guestBookingSuccess, setGuestBookingSuccess] = useState(false);

  const { globalState, setGlobalState, role, t, setShowGuestLockModal } = useAppContext();`;

if(content.includes('const [blockedError, setBlockedError] = useState<string | null>(null);')) {
  content = content.replace(stateTarget, stateReplacement);
}

const handleBookingTarget = `  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    
    if (activeClient.profile.isGuest) {
      setShowGuestLockModal(true);
      return;
    }`;

const handleBookingReplacement = `  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    
    if (activeClient.profile.isGuest) {
      setShowGuestBookingModal(true);
      return;
    }`;

content = content.replace(handleBookingTarget, handleBookingReplacement);

const confirmFunction = `
  const confirmGuestBooking = () => {
    if (!guestPhone || !guestPhoneConfirm) {
      setGuestPhoneError(isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
      return;
    }
    if (guestPhone !== guestPhoneConfirm) {
      setGuestPhoneError(isAr ? 'أرقام الهواتف غير متطابقة' : 'Phone numbers do not match');
      return;
    }
    
    setGuestPhoneError('');
    setGuestBookingSuccess(true);
    setTimeout(() => {
        setShowGuestBookingModal(false);
        setGuestBookingSuccess(false);
        setGuestPhone('');
        setGuestPhoneConfirm('');
        executeBooking();
    }, 2000);
  };
`;

content = content.replace(
  `  const executeBooking = () => {`,
  `${confirmFunction}\n  const executeBooking = () => {`
);


const modalHtml = `
      <AnimatePresence>
        {showGuestBookingModal && (
          <div className="fixed inset-0 bg-luxury-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-luxury-900 p-8 rounded-3xl max-w-md w-full border border-luxury-200 dark:border-luxury-800 shadow-2xl relative"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <button 
                onClick={() => setShowGuestBookingModal(false)}
                className="absolute top-6 right-6 p-2 text-luxury-500 hover:text-luxury-900 dark:hover:text-luxury-100 transition-colors"
                disabled={guestBookingSuccess}
              >
                <X size={20} />
              </button>
              
              {!guestBookingSuccess ? (
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
                          {isAr ? 'إرسال إلى المصممة للتأكيد' : 'Send to Designer for Confirmation'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
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
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
`;

content = content.replace(
  `    </div>
  );
};`,
  modalHtml
);

fs.writeFileSync(path, content);
console.log('Updated Booking with Guest Booking Modal');
