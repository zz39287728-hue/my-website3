import fs from 'fs';

const path = 'src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `const [searchTerm, setSearchTerm] = useState('');`;
const rep = `const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'ADMIN_DIRECTORY' || e.detail === 'SUPPORT_CLIENTS') {
        setSearchTerm('');
        setFilter('All');
        setIsCreateModalOpen(false);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
