import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `  const [guestPhone, setGuestPhone] = useState('');`;

const newStr = `  // Listen for reset events
  useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'booking') {
        setShowBookingForm(false);
        setSelectedDate(null);
        setSelectedTime(null);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);

  const [guestPhone, setGuestPhone] = useState('');`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(path, content);
