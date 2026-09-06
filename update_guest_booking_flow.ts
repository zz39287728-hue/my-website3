import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let lines = fs.readFileSync(path, 'utf8').split('\n');

// 1. Add state
const stateIdx = lines.findIndex(l => l.includes('const [guestBookingSuccess, setGuestBookingSuccess] = useState(false);'));
if (stateIdx !== -1) {
    lines.splice(stateIdx + 1, 0, '  const [guestModalStep, setGuestModalStep] = useState<"phone" | "payment">("phone");');
}

// 2. Replace confirmGuestBooking
const confirmStartIdx = lines.findIndex(l => l.includes('const confirmGuestBooking = () => {'));
if (confirmStartIdx !== -1) {
    const confirmEndIdx = lines.findIndex((l, i) => i > confirmStartIdx && l.trim() === '};' && lines[i-1].includes('2000);'));
    
    const newConfirm = `  const confirmGuestBooking = () => {
    if (guestModalStep === 'phone') {
      if (!guestPhone || !guestPhoneConfirm) {
        setGuestPhoneError(isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
        return;
      }
      if (guestPhone !== guestPhoneConfirm) {
        setGuestPhoneError(isAr ? 'أرقام الهواتف غير متطابقة' : 'Phone numbers do not match');
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
            setGuestPhoneConfirm('');
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
          setGuestPhoneConfirm('');
          setGuestModalStep('phone');
          executeBooking(guestPaymentMethod);
      }, 2000);
    }
  };`;
    lines.splice(confirmStartIdx, confirmEndIdx - confirmStartIdx + 1, ...newConfirm.split('\n'));
}

fs.writeFileSync(path, lines.join('\n'));
