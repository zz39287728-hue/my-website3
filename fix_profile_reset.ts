import fs from 'fs';

const path = 'src/pages/Overview.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `  const [isEditing, setIsEditing] = useState(false);`;
const rep = `  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'PROFILE') {
        setIsEditing(false);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
