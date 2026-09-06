import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add states
const stateTarget = `  const [blockedError, setBlockedError] = useState<string | null>(null);`;
const stateReplacement = `  const [blockedError, setBlockedError] = useState<string | null>(null);

  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestPhone, setGuestPhone] = useState('');
  const [guestPhoneConfirm, setGuestPhoneConfirm] = useState('');
  const [guestPaymentMethod, setGuestPaymentMethod] = useState<'after' | 'now'>('after');
  const [guestPhoneError, setGuestPhoneError] = useState('');`;

content = content.replace(stateTarget, stateReplacement);

// 2. Rewrite handleBooking and add executeBooking
const handleBookingTarget = `  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    const cost = calculateCost();
    const newBooking = {`;

const handleBookingReplacement = `  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    
    if (activeClient.profile.isGuest) {
      setShowGuestModal(true);
      return;
    }
    
    executeBooking();
  };

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
    setShowGuestModal(false);
    executeBooking();
  };

  const executeBooking = () => {
    const cost = calculateCost();
    const newBooking = {`;

content = content.replace(handleBookingTarget, handleBookingReplacement);

// Need to fix the closing brace of handleBooking (which is now executeBooking)
// It originally ended at around line 560:
/*
      return {
        ...prev,
        blockedSlots: newBlockedSlots,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            invoice: updatedInvoice,
            bookings: updatedBookings,
            profile: {
              ...client.profile,
              freeConsultations: updatedFreeConsultations
            }
          }
        }
      };
    });
    
    setShowBookingForm(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setToastMessage(isAr ? 'تم طلب الحجز بنجاح' : 'Booking requested successfully');
    setTimeout(() => setToastMessage(null), 3000);
  };
*/
// Let's replace the last '};' of that block. Since executeBooking replaces handleBooking, its end is the same.
// We don't need to change the end brackets, because `executeBooking` just takes over the body. Wait, `handleBooking` was replaced, so `executeBooking` needs the closing brace. The replacement is syntactically sound because we just injected a new function in front of the body of the old one.

// 3. Render Guest Modal
const renderTarget = `      {showBookingForm && (
        <div className="fixed inset-0 bg-luxury-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">`;

const guestModalUI = `      <AnimatePresence>
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
              
              <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-6">
                {isAr ? 'تأكيد معلومات الحجز' : 'Confirm Booking Details'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-2">
                    {isAr ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input 
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500"
                    placeholder={isAr ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-2">
                    {isAr ? 'تأكيد رقم الهاتف' : 'Confirm Phone Number'}
                  </label>
                  <input 
                    type="tel"
                    value={guestPhoneConfirm}
                    onChange={(e) => setGuestPhoneConfirm(e.target.value)}
                    className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500"
                    placeholder={isAr ? 'أعد إدخال رقم هاتفك' : 'Re-enter your phone number'}
                  />
                </div>
                
                {guestPhoneError && (
                  <p className="text-red-500 text-sm font-bold">{guestPhoneError}</p>
                )}
                
                <div className="pt-4">
                  <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-3">
                    {isAr ? 'طريقة الدفع' : 'Payment Method'}
                  </label>
                  <div className="space-y-3">
                    <label className={\`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all \${guestPaymentMethod === 'after' ? 'border-gold-500 bg-gold-500/5' : 'border-luxury-200 dark:border-luxury-800'}\`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={guestPaymentMethod === 'after'} 
                        onChange={() => setGuestPaymentMethod('after')} 
                        className="text-gold-500 focus:ring-gold-500"
                      />
                      <span className="font-bold text-luxury-900 dark:text-luxury-50">
                        {isAr ? 'الدفع بعد الاستشارة' : 'Pay after consultation'}
                      </span>
                    </label>
                    <label className={\`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all \${guestPaymentMethod === 'now' ? 'border-gold-500 bg-gold-500/5' : 'border-luxury-200 dark:border-luxury-800'}\`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={guestPaymentMethod === 'now'} 
                        onChange={() => setGuestPaymentMethod('now')} 
                        className="text-gold-500 focus:ring-gold-500"
                      />
                      <span className="font-bold text-luxury-900 dark:text-luxury-50">
                        {isAr ? 'الدفع الآن' : 'Pay now'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={confirmGuestBooking}
                className="w-full mt-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-white rounded-xl font-bold shadow-md hover:scale-[1.02] transition-all"
              >
                {isAr ? 'تأكيد الحجز' : 'Confirm Booking'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showBookingForm && (
        <div className="fixed inset-0 bg-luxury-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">`;

content = content.replace(renderTarget, guestModalUI);

fs.writeFileSync(path, content);
console.log('Fixed booking guest flow');
