import fs from 'fs';

const path = 'src/pages/SupportStore.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `const [activeTab, setActiveTab] = useState<'collections' | 'packages' | 'consultations'>('collections');`;
const rep = `const [activeTab, setActiveTab] = useState<'collections' | 'packages' | 'consultations'>('collections');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'SUPPORT_STORE') {
        setActiveTab('collections');
        setEditingId(null);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
