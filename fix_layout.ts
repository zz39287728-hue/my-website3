import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `  const [showGuestLockModal, setShowGuestLockModal] = useState(false);`,
  `  // showGuestLockModal is from context`
);

content = content.replace(
  `  const { t, lang, role, setRole, globalState, setGlobalState } = useAppContext();`,
  `  const { t, lang, role, setRole, globalState, setGlobalState, showGuestLockModal, setShowGuestLockModal } = useAppContext();`
);

fs.writeFileSync(path, content);
console.log('Layout.tsx updated');
