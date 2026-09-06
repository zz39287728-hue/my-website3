import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewModule, Role, GlobalState } from './types';
import { INITIAL_STATE } from './constants';
import { Layout } from './components/Layout';
import { ZainAI } from './components/ZainAI';
import { OnboardingWizard } from './components/Onboarding';
import { dict } from './i18n';

// Import Pages
import { Collections } from "./pages/Collections";
import { LandingPage } from './pages/Landing';
import { Dashboard, Profile } from './pages/Overview';
import { Packages, VisionBuilder, PortfolioVR } from './pages/Design';
import { Contracts, Invoice } from './pages/Execution';
import { FilesHub } from './pages/FilesHub';
import { Chat, Booking, Support } from './pages/Communication';
import { AdminDirectory, AdminArchive, AdminDashboard, AdminFinance, AdminContracts, AdminChat, AdminProfile, AdminTasks, AdminCalendar } from './pages/Admin';
import { SupportStore } from "./pages/SupportStore";
import { SupportDashboard, SupportTickets, SupportFinance, SupportKnowledgeBase, SupportLogs, SupportClientDashboard } from './pages/Support';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  role: Role;
  setRole: (r: Role) => void;
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
  setShowOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  showGuestLockModal: boolean;
  setShowGuestLockModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType>({
  theme: 'dark', setTheme: () => {},
  lang: 'en', setLang: () => {},
  t: (k) => k,
  role: 'GUEST', setRole: () => {},
  globalState: INITIAL_STATE, setGlobalState: () => {},
  setShowOnboarding: () => {},
  showGuestLockModal: false,
  setShowGuestLockModal: () => {}
});

export const useAppContext = () => useContext(AppContext);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewModule>(ViewModule.DASHBOARD);
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<Role>('GUEST');
  const [globalState, setGlobalState] = useState<GlobalState>(INITIAL_STATE);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuestLockModal, setShowGuestLockModal] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => dict[lang]?.[key] || key;

  const handleRoleSelect = (selectedRole: Role) => {
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
  };

  const renderView = () => {
    if (role === 'ARCHITECT') {
      switch (currentView) {
        case ViewModule.ADMIN_DIRECTORY: return <AdminDirectory setView={setCurrentView} />;
        case ViewModule.ADMIN_ARCHIVE: return <AdminArchive setView={setCurrentView} />;
        case ViewModule.ADMIN_CALENDAR: return <AdminCalendar />;
        case ViewModule.SUPPORT_STORE: return <SupportStore />;
        case ViewModule.ADMIN_DASHBOARD: return <AdminDashboard setView={setCurrentView} />;
        case ViewModule.ADMIN_FINANCE: return <AdminFinance />;
        case ViewModule.ADMIN_CONTRACTS: return <AdminContracts />;
        case ViewModule.ADMIN_CHAT: return <AdminChat />;
        case ViewModule.ADMIN_BOOKINGS: return <Booking setView={setCurrentView} />;
        case ViewModule.ADMIN_PROFILE: return <AdminProfile />;
        case ViewModule.ADMIN_TASKS: return <AdminTasks />;
        default: return <AdminDirectory setView={setCurrentView} />;
      }
    }

    if (role === 'SUPPORT') {
      switch (currentView) {
        case ViewModule.SUPPORT_DASHBOARD: return <SupportDashboard />;
        case ViewModule.SUPPORT_TICKETS: return <SupportTickets />;
        case ViewModule.SUPPORT_FINANCE: return <SupportFinance />;
        case ViewModule.SUPPORT_CLIENTS: return <AdminDirectory setView={setCurrentView} />;
        case ViewModule.SUPPORT_KNOWLEDGE_BASE: return <SupportKnowledgeBase />;
        case ViewModule.SUPPORT_LOGS: return <SupportLogs />;
        case ViewModule.SUPPORT_STORE: return <SupportStore />;
        // Client-specific Support Views
        case ViewModule.SUPPORT_CLIENT_DASHBOARD: return <SupportClientDashboard setView={setCurrentView} />;
        case ViewModule.SUPPORT_CLIENT_CHAT: return <AdminChat />; // Reuse AdminChat for client chat
        case ViewModule.SUPPORT_CLIENT_TICKETS: return <SupportTickets isClientSpecific={true} />;
        case ViewModule.SUPPORT_CLIENT_FINANCE: return <SupportFinance isClientSpecific={true} />;
        
        case ViewModule.ADMIN_CHAT: return <AdminChat />; // Reuse AdminChat for support
        case ViewModule.ADMIN_PROFILE: return <AdminProfile />;
        default: return <SupportDashboard />;
      }
    }

    switch (currentView) {
      case ViewModule.DASHBOARD: return <Dashboard setView={setCurrentView} />;
      case ViewModule.PACKAGES: return <Packages setView={setCurrentView} />;
      case ViewModule.VISION_BUILDER: return <VisionBuilder />;
      case ViewModule.PORTFOLIO_VR: return <PortfolioVR />;
      case ViewModule.COLLECTIONS: return <Collections setView={setCurrentView} />;
      case ViewModule.BOOKING: return <Booking setView={setCurrentView} />;
      case ViewModule.CHAT: return <Chat />;
      case ViewModule.FILES: return <FilesHub />;
      case ViewModule.CONTRACTS: return <Contracts />;
      case ViewModule.INVOICE: return <Invoice setView={setCurrentView} defaultTab="invoices" />;
      case ViewModule.CART: return <Invoice setView={setCurrentView} defaultTab="cart" />;
      case ViewModule.SUPPORT: return <Support />;
      case ViewModule.PROFILE: return <Profile />;
      default: return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, lang, setLang, t, role, setRole, globalState, setGlobalState, setShowOnboarding, showGuestLockModal, setShowGuestLockModal }}>
      {role === 'GUEST' ? (
        <LandingPage onSelectRole={handleRoleSelect} />
      ) : (
        <div className="h-screen w-full overflow-hidden">
          <AnimatePresence>
            {showOnboarding && <OnboardingWizard onComplete={(isGuest) => { setShowOnboarding(false); if(isGuest) setCurrentView(ViewModule.PACKAGES); }} />}
          </AnimatePresence>

          {!showOnboarding && (
            <Layout currentView={currentView} setCurrentView={setCurrentView}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full"
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
              {role === 'CLIENT' && <ZainAI />}
            </Layout>
          )}
        </div>
      )}
    </AppContext.Provider>
  );
};

export default App;
