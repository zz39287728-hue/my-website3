import fs from 'fs';

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    if (selectedRole === 'CLIENT') {
      setShowOnboarding(true);
      setCurrentView(ViewModule.DASHBOARD);
    } else if (selectedRole === 'ARCHITECT') {
      setCurrentView(ViewModule.ADMIN_DIRECTORY);
    } else if (selectedRole === 'SUPPORT') {
      setCurrentView(ViewModule.SUPPORT_DASHBOARD);
    }
  };`;

const replacement = `  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    if (selectedRole === 'CLIENT') {
      const activeClient = globalState.clients[globalState.activeClientId];
      if (!activeClient?.profile?.onboardingCompleted) {
        setShowOnboarding(true);
      }
      setCurrentView(ViewModule.DASHBOARD);
    } else if (selectedRole === 'ARCHITECT') {
      setCurrentView(ViewModule.ADMIN_DIRECTORY);
    } else if (selectedRole === 'SUPPORT') {
      setCurrentView(ViewModule.SUPPORT_DASHBOARD);
    }
  };`;

content = content.replace(target, replacement);

// We should also make sure to export showOnboarding from AppContext if settings wants to trigger it manually?
// No, the prompt says "يستطيع أن يقوم بتعديلها في مكان الإعدادات. سيكون هناك زر مكتوب عليه تعديل، يعني أنت قم بتسميته أيضاً."
// This means the user can click a button in settings to Re-take the quiz.
// The easiest way is to add a `setShowOnboarding` to the AppContext, or we can just render the quiz as a component inside the settings modal if they click it.
// Better yet, let's export `setShowOnboarding: (s: boolean) => void` in AppContextType.

const contextTypeTarget = `  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}`;
const contextTypeReplacement = `  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
  setShowOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
}`;

const contextInitTarget = `  t: (k) => k,
  role: 'GUEST', setRole: () => {},
  globalState: INITIAL_STATE, setGlobalState: () => {}
});`;
const contextInitReplacement = `  t: (k) => k,
  role: 'GUEST', setRole: () => {},
  globalState: INITIAL_STATE, setGlobalState: () => {},
  setShowOnboarding: () => {}
});`;

const providerTarget = `<AppContext.Provider value={{ theme, setTheme, lang, setLang, t, role, setRole, globalState, setGlobalState }}>`;
const providerReplacement = `<AppContext.Provider value={{ theme, setTheme, lang, setLang, t, role, setRole, globalState, setGlobalState, setShowOnboarding }}>`;

content = content.replace(contextTypeTarget, contextTypeReplacement);
content = content.replace(contextInitTarget, contextInitReplacement);
content = content.replace(providerTarget, providerReplacement);

fs.writeFileSync(path, content);
console.log('Fixed App.tsx');
