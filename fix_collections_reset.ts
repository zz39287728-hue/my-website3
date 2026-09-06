import fs from 'fs';

const path = 'src/pages/Collections.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `const [activeCategory, setActiveCategory] = useState<string>('All');`;
const rep = `const [activeCategory, setActiveCategory] = useState<string>('All');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'COLLECTIONS') {
        setActiveCategory('All');
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
