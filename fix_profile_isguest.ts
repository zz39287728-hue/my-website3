import fs from 'fs';

const path = 'src/pages/Overview.tsx';
let content = fs.readFileSync(path, 'utf8');

// I accidentally added isGuest at line 11 (inside Dashboard) instead of inside Profile.
// Let's remove it from Dashboard and add it to Profile.

content = content.replace(
  `  const activeClient = globalState.clients[globalState.activeClientId];\n  const isGuest = activeClient?.profile?.isGuest;`,
  `  const activeClient = globalState.clients[globalState.activeClientId];`
);

const profileStart = `export const Profile: React.FC = () => {
  const { theme, setTheme, lang, setLang, t, globalState, setGlobalState, setRole, setShowOnboarding } = useAppContext();
  const isRTL = lang === 'ar';
  const isDark = theme === 'dark';
  const activeClient = globalState.clients[globalState.activeClientId];`;

const profileStartWithGuest = `export const Profile: React.FC = () => {
  const { theme, setTheme, lang, setLang, t, globalState, setGlobalState, setRole, setShowOnboarding } = useAppContext();
  const isRTL = lang === 'ar';
  const isDark = theme === 'dark';
  const activeClient = globalState.clients[globalState.activeClientId];
  const isGuest = activeClient?.profile?.isGuest;`;

content = content.replace(profileStart, profileStartWithGuest);

fs.writeFileSync(path, content);
console.log('Fixed isGuest scope');
