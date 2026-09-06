import fs from 'fs';

const path = 'src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `const [searchTerm, setSearchTerm] = useState('');`;
const rep = `const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'ADMIN_ARCHIVE') {
        setSearchTerm('');
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

// Since there are multiple "const [searchTerm, setSearchTerm] = useState('');", I need to be careful.
// Let's replace the one in AdminArchive specifically.
content = content.replace(
  `export const AdminArchive: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, globalState, setGlobalState } = useAppContext();
  const { clients } = globalState;
  const [searchTerm, setSearchTerm] = useState('');`,
  
  `export const AdminArchive: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, globalState, setGlobalState } = useAppContext();
  const { clients } = globalState;
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'ADMIN_ARCHIVE') {
        setSearchTerm('');
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`
);

fs.writeFileSync(path, content);
