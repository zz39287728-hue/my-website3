import fs from 'fs';

const path = 'src/pages/Design.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `  const [selectedPackage, setSelectedPackage] = useState<StorePackageItem | null>(null);`;
const rep = `  const [selectedPackage, setSelectedPackage] = useState<StorePackageItem | null>(null);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'PACKAGES') {
        setSelectedPackage(null);
        setSelectedAddon(null);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
