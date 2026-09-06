import fs from 'fs';

const path = 'src/pages/ContractsHub.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `const [activeTab, setActiveTab] = useState<'pending' | 'signed'>('pending');`;
const rep = `const [activeTab, setActiveTab] = useState<'pending' | 'signed'>('pending');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'CONTRACTS') {
        setActiveTab('pending');
        setSelectedContractId(null);
        setSearchTerm('');
        setIsSigningPageOpen(false);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
