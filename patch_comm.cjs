const fs = require('fs');
let content = fs.readFileSync('src/pages/Communication.tsx', 'utf8');

const newConfirmGuestBooking = `  const confirmGuestBooking = () => {
    if (guestModalStep === 'phone') {
      if (!guestPhone || !guestCountryCode) {
        setGuestPhoneError(isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
        return;
      }
      setGuestPhoneError('');
      setGuestModalStep('otp');
    } else if (guestModalStep === 'otp') {
      if (!guestOtp || guestOtp.length < 4) {
        setGuestOtpError(isAr ? 'يرجى إدخال رمز التحقق المكون من 4 أرقام' : 'Please enter the 4-digit verification code');
        return;
      }
      setGuestOtpError('');
      
      if (!isQuickBooking && calculateCost() > 0) {
        setGuestModalStep('payment');
      } else {
        setGuestBookingSuccess(true);
        setTimeout(() => {
            setShowGuestBookingModal(false);
            setGuestBookingSuccess(false);
            setGuestPhone('');
            setGuestOtp('');
            setGuestModalStep('phone');
            executeBooking('now');
            if (isQuickBooking && onClose) onClose();
        }, 2000);
      }
    } else if (guestModalStep === 'payment') {
      setGuestBookingSuccess(true);
      setTimeout(() => {
          setShowGuestBookingModal(false);
          setGuestBookingSuccess(false);
          setGuestPhone('');
          setGuestOtp('');
          setGuestModalStep('phone');
          executeBooking(guestPaymentMethod);
          if (isQuickBooking && onClose) onClose();
      }, 2000);
    }
  };`;

content = content.replace(
  /  const confirmGuestBooking = \(\) => \{[\s\S]*?  \};\n/g,
  newConfirmGuestBooking + '\n'
);

content = content.replace(
  /المتابعة كضيف/g,
  'حجز الاستشارة السريع'
);

fs.writeFileSync('src/pages/Communication.tsx', content);
console.log('Communication.tsx updated!');
