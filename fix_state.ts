import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `  const [blockedError, setBlockedError] = useState<string | null>(null);

  
  const { globalState, setGlobalState, role, t, setShowGuestLockModal } = useAppContext();`;

const replacement = `  const [blockedError, setBlockedError] = useState<string | null>(null);

  const [showGuestBookingModal, setShowGuestBookingModal] = useState(false);
  const [guestPhone, setGuestPhone] = useState('');
  const [guestPhoneConfirm, setGuestPhoneConfirm] = useState('');
  const [guestPhoneError, setGuestPhoneError] = useState('');
  const [guestBookingSuccess, setGuestBookingSuccess] = useState(false);

  const { globalState, setGlobalState, role, t, setShowGuestLockModal } = useAppContext();`;

content = content.replace(target, replacement);

fs.writeFileSync(path, content);
console.log('Fixed states');
