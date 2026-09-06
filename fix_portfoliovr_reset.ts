import fs from 'fs';

const path = 'src/pages/Design.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `  const [isNight, setIsNight] = useState(false);`;
const rep = `  const [isNight, setIsNight] = useState(false);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'PORTFOLIO_VR') {
        setIsNight(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
