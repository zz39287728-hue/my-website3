import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update guestModalStep type and add OTP states
content = content.replace(
  `const [guestModalStep, setGuestModalStep] = useState<"phone" | "payment">("phone");`,
  `const [guestModalStep, setGuestModalStep] = useState<"phone" | "payment" | "otp">("phone");\n  const [guestOtp, setGuestOtp] = useState('');\n  const [guestOtpError, setGuestOtpError] = useState('');`
);

// 2. Update confirmGuestBooking
const confirmTarget = `  const confirmGuestBooking = () => {
    if (guestModalStep === 'phone') {
      if (!guestPhone || !guestCountryCode) {
        setGuestPhoneError(isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
        return;
      }
      setGuestPhoneError('');
      
      if (calculateCost() > 0) {
        setGuestModalStep('payment');
      } else {
        setGuestBookingSuccess(true);
        setTimeout(() => {
            setShowGuestBookingModal(false);
            setGuestBookingSuccess(false);
            setGuestPhone('');
            
            setGuestModalStep('phone');
            executeBooking('now');
        }, 2000);
      }
    } else if (guestModalStep === 'payment') {
      setGuestBookingSuccess(true);
      setTimeout(() => {
          setShowGuestBookingModal(false);
          setGuestBookingSuccess(false);
          setGuestPhone('');
          
          setGuestModalStep('phone');
          executeBooking(guestPaymentMethod);
      }, 2000);
    }
  };`;

const confirmReplacement = `  const confirmGuestBooking = () => {
    if (guestModalStep === 'phone') {
      if (!guestPhone || !guestCountryCode) {
        setGuestPhoneError(isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
        return;
      }
      setGuestPhoneError('');
      
      if (calculateCost() > 0) {
        setGuestModalStep('payment');
      } else {
        setGuestModalStep('otp');
      }
    } else if (guestModalStep === 'payment') {
      setGuestModalStep('otp');
    } else if (guestModalStep === 'otp') {
      if (!guestOtp || guestOtp.length < 4) {
        setGuestOtpError(isAr ? 'يرجى إدخال رمز التحقق المكون من 4 أرقام' : 'Please enter the 4-digit verification code');
        return;
      }
      setGuestOtpError('');
      setGuestBookingSuccess(true);
      setTimeout(() => {
          setShowGuestBookingModal(false);
          setGuestBookingSuccess(false);
          setGuestPhone('');
          setGuestOtp('');
          setGuestModalStep('phone');
          executeBooking(calculateCost() > 0 ? guestPaymentMethod : 'now');
      }, 2000);
    }
  };`;

content = content.replace(confirmTarget, confirmReplacement);

fs.writeFileSync(path, content);
