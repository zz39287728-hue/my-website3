import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const openTarget = `    if (activeClient.profile.isGuest) {
      setShowGuestBookingModal(true);
      return;
    }`;

const openReplacement = `    if (activeClient.profile.isGuest) {
      if (bookingType === 'Virtual') {
        setGuestPaymentMethod('now');
      }
      setShowGuestBookingModal(true);
      return;
    }`;

content = content.replace(openTarget, openReplacement);
fs.writeFileSync(path, content);
