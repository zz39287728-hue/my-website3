import fs from 'fs';

const path = 'src/pages/FinanceHub.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `  const [activeTab, setActiveTab] = useState<'cart' | 'invoices'>('cart');`;
const rep = `  const [activeTab, setActiveTab] = useState<'cart' | 'invoices'>('cart');
  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'INVOICE') {
        setActiveTab('cart');
        setShowCheckoutModal(false);
        setCheckoutStep('select');
        setSelectedInvoiceForModal(null);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
