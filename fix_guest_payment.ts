import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add guestPaymentMethod state
content = content.replace(
  `  const [guestPhoneError, setGuestPhoneError] = useState('');`,
  `  const [guestPhoneError, setGuestPhoneError] = useState('');
  const [guestPaymentMethod, setGuestPaymentMethod] = useState<'after' | 'now'>('after');`
);

// Update confirmGuestBooking
const confirmTarget = `  const confirmGuestBooking = () => {
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
  };`;

const confirmReplacement = `  const confirmGuestBooking = () => {
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
        executeBooking(guestPaymentMethod);
    }, 2000);
  };`;

content = content.replace(confirmTarget, confirmReplacement);

// Update executeBooking
const executeTarget = `  const executeBooking = () => {
    const cost = calculateCost();
    const newBooking = {
      id: \`bk\${Date.now()}\`,
      date: selectedDate, // Now a string "YYYY-MM-DD"
      time: selectedTime,
      durationHours: duration,
      type: bookingType,
      status: (cost > 0 ? 'Awaiting Payment' : (isAdmin ? 'Confirmed' : 'Awaiting Confirmation')) as 'Awaiting Payment' | 'Awaiting Confirmation' | 'Confirmed',
      initiatedBy: (isAdmin ? 'ARCHITECT' : 'CLIENT') as 'ARCHITECT' | 'CLIENT',
      cost
    };

    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      let updatedInvoice = client.invoice;
      let updatedFreeConsultations = client.profile.freeConsultations;

      if (cost > 0) {
        updatedInvoice = {
          ...client.invoice,
          status: 'Pending',
          items: [
            ...client.invoice.items,
            { id: \`inv_\${newBooking.id}\`, desc: \`\${bookingType} Consultation (\${duration}h)\`, amount: cost }
          ]
        };
      } else {
        updatedFreeConsultations = Math.max(0, updatedFreeConsultations - 1);
      }`;

const executeReplacement = `  const executeBooking = (paymentChoice: 'now' | 'after' = 'now') => {
    const cost = calculateCost();
    const requiresImmediatePayment = cost > 0 && paymentChoice === 'now';
    
    const newBooking = {
      id: \`bk\${Date.now()}\`,
      date: selectedDate, // Now a string "YYYY-MM-DD"
      time: selectedTime,
      durationHours: duration,
      type: bookingType,
      status: (requiresImmediatePayment ? 'Awaiting Payment' : (isAdmin ? 'Confirmed' : 'Awaiting Confirmation')) as 'Awaiting Payment' | 'Awaiting Confirmation' | 'Confirmed',
      initiatedBy: (isAdmin ? 'ARCHITECT' : 'CLIENT') as 'ARCHITECT' | 'CLIENT',
      cost
    };

    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      let updatedInvoice = client.invoice;
      let updatedFreeConsultations = client.profile.freeConsultations;

      if (requiresImmediatePayment) {
        updatedInvoice = {
          ...client.invoice,
          status: 'Pending',
          items: [
            ...client.invoice.items,
            { id: \`inv_\${newBooking.id}\`, desc: \`\${bookingType} Consultation (\${duration}h)\`, amount: cost }
          ]
        };
      } else if (cost === 0) {
        updatedFreeConsultations = Math.max(0, updatedFreeConsultations - 1);
      }`;

content = content.replace(executeTarget, executeReplacement);

const executeEndTarget = `      return {
        ...prev,
        blockedSlots: newBlockedSlots,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            bookings: updatedBookings
          }
        }
      };
    });
  };`;

const executeEndReplacement = `      return {
        ...prev,
        blockedSlots: newBlockedSlots,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            profile: {
              ...client.profile,
              freeConsultations: updatedFreeConsultations
            },
            invoice: updatedInvoice,
            bookings: updatedBookings
          }
        }
      };
    });

    if (requiresImmediatePayment && setView) {
      setView(ViewModule.INVOICE);
    }
  };`;

// Let's verify the exact executeEndTarget
