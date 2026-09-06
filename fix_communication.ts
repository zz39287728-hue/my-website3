import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace handleBooking to trigger setShowGuestLockModal(true)
content = content.replace(
  `  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    
    if (activeClient.profile.isGuest) {
      setShowGuestModal(true);
      return;
    }`,
  `  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    
    if (activeClient.profile.isGuest) {
      setShowGuestLockModal(true);
      return;
    }`
);

// Add setShowGuestLockModal to useAppContext inside Booking component
// Booking component is standard function? We need to find where useAppContext is called in Booking
content = content.replace(
  `  const { globalState, setGlobalState, role, t } = useAppContext();`,
  `  const { globalState, setGlobalState, role, t, setShowGuestLockModal } = useAppContext();`
);

// We might want to remove the old guest phone modal we added to Communication.tsx earlier
// if it's there. Oh wait, I didn't actually push the change that added the modal to Communication.tsx!
// I created a script `fix_guest_modal.ts` but it seems I did apply it! Wait. Let's look closely at `fix_guest_modal.ts`.
// I DID run `node fix_guest_modal.ts`. Let's remove the modal from Communication.tsx.

fs.writeFileSync(path, content);
console.log('Communication.tsx updated');
