import fs from 'fs';

const path = 'src/pages/Design.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `  const [selectedStyle, setSelectedStyle] = useState(styles[0]);`;
const rep = `  const [selectedStyle, setSelectedStyle] = useState(styles[0]);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'VISION_BUILDER') {
        setSelectedStyle(styles[0]);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
