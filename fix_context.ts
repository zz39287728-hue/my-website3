import fs from 'fs';

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `  setShowOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
}`,
  `  setShowOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  showGuestLockModal: boolean;
  setShowGuestLockModal: React.Dispatch<React.SetStateAction<boolean>>;
}`
);

content = content.replace(
  `  setShowOnboarding: () => {},`,
  `  setShowOnboarding: () => {},
  showGuestLockModal: false,
  setShowGuestLockModal: () => {},`
);

content = content.replace(
  `  const [showOnboarding, setShowOnboarding] = useState(false);`,
  `  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuestLockModal, setShowGuestLockModal] = useState(false);`
);

content = content.replace(
  `<AppContext.Provider value={{ theme, setTheme, lang, setLang, t, role, setRole, globalState, setGlobalState, setShowOnboarding }}>`,
  `<AppContext.Provider value={{ theme, setTheme, lang, setLang, t, role, setRole, globalState, setGlobalState, setShowOnboarding, showGuestLockModal, setShowGuestLockModal }}>`
);

fs.writeFileSync(path, content);
console.log('App.tsx updated');
