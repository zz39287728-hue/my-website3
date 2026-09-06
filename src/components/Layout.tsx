import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewModule } from '../types';
import { useAppContext } from '../App';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.56.04 2.88.74 3.65 1.9-3.3 1.95-2.76 6.3 1.05 7.74-.78 2.08-1.99 4.14-3.37 5.29zM12.03 7.25c-.15-3.47 2.76-6.08 6.12-6.25.26 3.4-2.88 6.27-6.12 6.25z"/>
  </svg>
);
import { 
  LayoutDashboard, Package, Image as ImageIcon, Briefcase, 
  Calendar, MessageSquare, FileCheck, PenTool, CreditCard, 
  HelpCircle, User, Settings, Menu, X, Maximize, Minimize,
  DollarSign, Ticket, LogOut, ArrowLeft, ChevronDown, Users,
  CheckSquare, Archive, Headphones, Bell, ShoppingBag, Store,  BookOpen, Activity, Lock, Check, Folder, Receipt
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewModule;
  setCurrentView: (view: ViewModule) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  // showGuestLockModal is from context
  const [loginInput, setLoginInput] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  const handleLoginSubmit = () => {
    if (!loginInput.trim()) return;
    setLoginMethod(loginInput.includes('@') ? 'email' : 'phone');
    setShowOTP(true);
  };

  const completeLogin = () => {
    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      if (!client) return prev;
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            profile: {
              ...client.profile,
              isGuest: false
            }
          }
        }
      };
    });
    setShowGuestLockModal(false);
    setShowOTP(false);
    setLoginInput('');
    setOtpCode('');
  };

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { t, lang, role, setRole, globalState, setGlobalState, showGuestLockModal, setShowGuestLockModal } = useAppContext();
  const isRTL = lang === 'ar';

  const notificationsRef = useRef<HTMLDivElement>(null);
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setIsClientDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeClient = globalState.clients[globalState.activeClientId];
  const clientCartCount = activeClient?.cart?.length || 0;


  const isGuest = activeClient?.profile?.isGuest;

  const clientNavItems = [
    { id: ViewModule.DASHBOARD, label: t('nav.dashboard'), icon: LayoutDashboard, locked: isGuest },
    { id: ViewModule.PACKAGES, label: t('nav.packages'), icon: Package },
    { id: ViewModule.COLLECTIONS, label: t("nav.collections") || (lang === "ar" ? "البوتيك" : "Boutique"), icon: Store },
    { id: ViewModule.BOOKING, label: t('nav.booking'), icon: Calendar },
    { id: ViewModule.VISION_BUILDER, label: t('nav.vision'), icon: ImageIcon, locked: isGuest },
    { id: ViewModule.PORTFOLIO_VR, label: t('nav.portfolio'), icon: Briefcase, locked: isGuest },
    { id: ViewModule.FILES, label: t('nav.files') || (lang === 'ar' ? 'ملفاتي' : 'My Files'), icon: Folder, locked: isGuest },
    { id: ViewModule.CONTRACTS, label: t('nav.contracts'), icon: PenTool, locked: isGuest },
    { id: ViewModule.INVOICE, label: t('nav.invoice'), icon: Receipt },
    { id: ViewModule.SUPPORT, label: t('nav.support'), icon: HelpCircle, locked: isGuest },
  ];

  const adminNavItems = [
    { id: ViewModule.ADMIN_DIRECTORY, label: t('admin.nav.directory'), icon: Users },
    { id: ViewModule.ADMIN_ARCHIVE, label: t('admin.nav.archive'), icon: Archive },
    { id: ViewModule.ADMIN_CALENDAR, label: t('admin.nav.calendar'), icon: Calendar },
    { id: ViewModule.ADMIN_DASHBOARD, label: t('admin.nav.dashboard'), icon: LayoutDashboard },
    { id: ViewModule.ADMIN_TASKS, label: t('admin.nav.tasks'), icon: CheckSquare },
    { id: ViewModule.ADMIN_FINANCE, label: t('admin.nav.finance'), icon: DollarSign },
    { id: ViewModule.ADMIN_CONTRACTS, label: t('admin.nav.contracts'), icon: PenTool },
    { id: ViewModule.ADMIN_CHAT, label: t('admin.nav.chat'), icon: MessageSquare },
    { id: ViewModule.ADMIN_BOOKINGS, label: t('admin.nav.bookings'), icon: Calendar },
  ];

  const supportNavItems = [
    { id: ViewModule.SUPPORT_DASHBOARD, label: t('support.nav.dashboard'), icon: LayoutDashboard },
    { id: ViewModule.SUPPORT_TICKETS, label: t('support.nav.tickets'), icon: Ticket },
    { id: ViewModule.SUPPORT_CLIENTS, label: t('support.nav.clients'), icon: Users },
    { id: ViewModule.SUPPORT_FINANCE, label: t('support.nav.finance'), icon: DollarSign },
    { id: ViewModule.SUPPORT_KNOWLEDGE_BASE, label: t('support.nav.knowledge'), icon: BookOpen },
    { id: ViewModule.SUPPORT_LOGS, label: t('support.nav.logs'), icon: Activity },
    { id: ViewModule.SUPPORT_STORE, label: lang === "ar" ? "إدارة المتجر والأسعار" : "Store Management", icon: Store },
  ];

  const supportClientNavItems = [
    { id: ViewModule.SUPPORT_CLIENT_DASHBOARD, label: t('support.nav.clientDashboard'), icon: LayoutDashboard },
    { id: ViewModule.SUPPORT_CLIENT_CHAT, label: t('support.nav.clientChat'), icon: MessageSquare },
    { id: ViewModule.SUPPORT_CLIENT_TICKETS, label: t('support.nav.clientTickets'), icon: Ticket },
    { id: ViewModule.SUPPORT_CLIENT_FINANCE, label: t('support.nav.clientFinance'), icon: DollarSign },
  ];

  const isArchitectClientWorkspace = role === 'ARCHITECT' && currentView !== ViewModule.ADMIN_DIRECTORY && currentView !== ViewModule.ADMIN_ARCHIVE && currentView !== ViewModule.ADMIN_CALENDAR && currentView !== ViewModule.ADMIN_PROFILE;
  const isSupportClientWorkspace = role === 'SUPPORT' && [ViewModule.SUPPORT_CLIENT_DASHBOARD, ViewModule.SUPPORT_CLIENT_CHAT, ViewModule.SUPPORT_CLIENT_TICKETS, ViewModule.SUPPORT_CLIENT_FINANCE].includes(currentView);
  const isClientWorkspace = isArchitectClientWorkspace || isSupportClientWorkspace;
  const isAr = lang === 'ar';

  let navItems = clientNavItems;
  if (role === 'ARCHITECT') {
    navItems = adminNavItems;
  } else if (role === 'SUPPORT') {
    navItems = isSupportClientWorkspace ? supportClientNavItems : supportNavItems;
  }
  const settingsView = role === 'ARCHITECT' || role === 'SUPPORT' ? ViewModule.ADMIN_PROFILE : ViewModule.PROFILE;

  // Calculate total notifications for Architect
  const totalNotifications = Object.values(globalState.clients).reduce((acc, client) => {
    let count = 0;
    if (client.hasUnreadMessages) count++;
    if (client.hasPendingApprovals) count++;
    if (client.hasNewTickets) count++;
    return acc + count;
  }, 0);

  const handleLogoClick = () => {
    setRole('GUEST');
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = ({ isExpanded }: { isExpanded: boolean }) => (
    <>
      <div className={`p-6 flex flex-col items-center border-b relative h-28 justify-center shrink-0 transition-colors duration-500 ${isClientWorkspace ? 'border-gold-500/30 bg-gold-500/5' : 'border-luxury-200 dark:border-luxury-800'}`}>
        <button 
          onClick={handleLogoClick}
          className="flex flex-col items-center justify-center w-full h-full relative group cursor-pointer hover:opacity-80 transition-opacity"
        >
          <h1 className={`font-serif font-bold tracking-widest bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-200 dark:via-gold-400 dark:to-gold-600 text-transparent bg-clip-text transition-all duration-300 absolute ${isExpanded ? 'text-2xl opacity-100 top-4' : 'text-4xl opacity-100 top-6'}`}>
            {isExpanded ? t('app.title') : 'Z'}
          </h1>
          <p className={`text-xs font-bold tracking-widest uppercase transition-all duration-300 absolute bottom-4 ${isExpanded ? 'opacity-100' : 'opacity-0'} ${isClientWorkspace ? 'text-gold-600 dark:text-gold-400' : 'text-luxury-500'}`}>
            {role === 'ARCHITECT' ? (isClientWorkspace ? 'Workspace' : 'Admin') : role === 'SUPPORT' ? 'Support' : t('app.subtitle')}
          </p>
        </button>
        <button 
          className="md:hidden absolute top-6 right-6 text-luxury-500 hover:text-luxury-900 dark:text-luxury-400 dark:hover:text-luxury-50 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>
      </div>
      
      <nav className={`flex-1 overflow-y-auto py-6 px-3 space-y-2 no-scrollbar ${isClientWorkspace ? 'bg-gold-500/5' : ''}`}>
        {/* Back to Directory Button (Only in Client Workspace) */}
        {isClientWorkspace && (
          <motion.button
            whileHover={{ x: isRTL ? -5 : 5, backgroundColor: 'rgba(197,156,106,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const targetView = role === 'SUPPORT' ? ViewModule.SUPPORT_CLIENTS : ViewModule.ADMIN_DIRECTORY;
              if (currentView !== targetView) {
                setCurrentView(targetView);
              }
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 text-luxury-700 dark:text-luxury-300 hover:text-gold-700 dark:hover:text-gold-400 border-l-4 border-transparent mb-4`}
            title={!isExpanded ? t('admin.directory.backToClients') : undefined}
          >
            <ArrowLeft size={24} className={`shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
            <span className={`font-bold text-base whitespace-nowrap transition-opacity duration-300 ${isRTL ? 'mr-4' : 'ml-4'} ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              {t('admin.directory.backToClients')}
            </span>
          </motion.button>
        )}

        {navItems.map((item: any) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          // Hide workspace items if in directory view
          if (role === 'ARCHITECT' && !isClientWorkspace && item.id !== ViewModule.ADMIN_DIRECTORY && item.id !== ViewModule.ADMIN_ARCHIVE && item.id !== ViewModule.ADMIN_CALENDAR) {
            return null;
          }
          
          // Hide directory items if in workspace view
          if (role === 'ARCHITECT' && isClientWorkspace && (item.id === ViewModule.ADMIN_DIRECTORY || item.id === ViewModule.ADMIN_ARCHIVE || item.id === ViewModule.ADMIN_CALENDAR)) {
            return null;
          }

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: isRTL ? -5 : 5, backgroundColor: isActive ? '' : (isClientWorkspace ? 'rgba(197,156,106,0.1)' : 'rgba(197,156,106,0.05)') }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (item.locked) {
                  setShowGuestLockModal(true);
                  setIsMobileMenuOpen(false);
                  return;
                }
                if (currentView !== item.id) {
                  setCurrentView(item.id);
                } else {
                  window.dispatchEvent(new CustomEvent('reset-view', { detail: item.id }));
                }
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 ${
                item.locked
                  ? 'opacity-50 hover:opacity-100 cursor-pointer text-luxury-500 dark:text-luxury-400 border-l-4 border-transparent'
                  : isActive 
                    ? (isClientWorkspace 
                        ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-md' 
                        : 'bg-gradient-to-r from-gold-700/10 dark:from-gold-500/10 to-transparent border-l-4 border-gold-700 dark:border-gold-500 text-gold-700 dark:text-gold-400 shadow-sm')
                    : (isClientWorkspace
                        ? 'text-luxury-700 dark:text-luxury-300 hover:text-gold-700 dark:hover:text-gold-400 border-l-4 border-transparent'
                        : 'text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-100 border-l-4 border-transparent')
              }`}
              title={!isExpanded ? item.label : undefined}
            >
              <div className="relative">
                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon size={24} className={`shrink-0 ${isActive ? (isClientWorkspace ? 'text-white' : 'text-gold-700 dark:text-gold-400') : ''}`} />
                </motion.div>
                {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && !isExpanded && !item.locked && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-600 text-white dark:text-luxury-950 text-[10px] font-bold flex items-center justify-center shadow-md">
                    {item.badge}
                  </span>
                )}
              </div>
              
              <span className={`font-bold text-base whitespace-nowrap transition-opacity duration-300 ${isRTL ? 'mr-4' : 'ml-4'} ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
              
              {isExpanded && item.locked && (
                <div className={`${isRTL ? 'mr-auto' : 'ml-auto'}`}>
                  <Lock size={16} className="text-luxury-400 dark:text-luxury-600" />
                </div>
              )}
              
              {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && isExpanded && !item.locked && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-gold-600/20 border border-gold-600/40 text-gold-700 dark:text-gold-300 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className={`p-4 border-t shrink-0 space-y-2 transition-colors duration-500 ${isClientWorkspace ? 'border-gold-500/30 bg-gold-500/5' : 'border-luxury-200 dark:border-luxury-800'}`}>
        <motion.button 
          whileHover={{ x: isRTL ? -5 : 5, backgroundColor: 'rgba(197,156,106,0.05)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (currentView !== settingsView) { setCurrentView(settingsView); } else { window.dispatchEvent(new CustomEvent('reset-view', { detail: settingsView })); }
            setIsMobileMenuOpen(false);
          }} 
          className={`flex items-center px-4 gap-4 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors w-full py-3.5 rounded-xl ${currentView === settingsView ? 'bg-luxury-100 dark:bg-luxury-800 text-luxury-900 dark:text-luxury-50' : ''}`}
          title={!isExpanded ? t('nav.profile') : undefined}
        >
          <Settings size={24} className="shrink-0" />
          <span className={`font-bold text-base whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            {t('nav.profile')}
          </span>
        </motion.button>
      </div>
    </>
  );

  const handleExitImpersonation = () => {
    setRole(globalState.originalRole || 'SUPPORT');
    setGlobalState(prev => ({
      ...prev,
      isImpersonating: false,
      originalRole: undefined
    }));
  };

  return (
    <div className={`flex flex-col h-screen w-full bg-luxury-50 dark:bg-luxury-950 transition-colors duration-500`}>
      {globalState.isImpersonating && (
        <div className="w-full bg-gold-600 text-white font-bold text-sm py-2 px-4 flex justify-between items-center z-50 shadow-md">
          <span>
            {isAr ? `أنت تتصفح حالياً بصلاحية الدعم الفني كعميل: ${globalState.clients[globalState.activeClientId]?.profile.name}` : `You are currently viewing as client: ${globalState.clients[globalState.activeClientId]?.profile.name} (Support Mode)`}
          </span>
          <button 
            onClick={handleExitImpersonation}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
          >
            {isAr ? 'الخروج من لوحة العميل' : 'Exit Impersonation'}
          </button>
        </div>
      )}
      <AnimatePresence>
        {showGuestLockModal && (
          <div className="fixed inset-0 bg-luxury-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-luxury-900 p-8 rounded-3xl max-w-md w-full border border-luxury-200 dark:border-luxury-800 shadow-2xl relative"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <button 
                onClick={() => setShowGuestLockModal(false)}
                className="absolute top-6 right-6 p-2 text-luxury-500 hover:text-luxury-900 dark:hover:text-luxury-100 transition-colors"
              >
                <X size={20} />
              </button>
              
              {!showOTP ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">
                      {isAr ? 'تسجيل الدخول' : 'Sign In'}
                    </h2>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm">
                      {isAr ? 'لفتح جميع ميزات لوحة التحكم' : 'To unlock all dashboard features'}
                    </p>
                  </div>

                  <div className="space-y-4 mt-8" dir={isAr ? 'rtl' : 'ltr'}>
                    <input 
                      type="text" 
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder={isAr ? 'تسجيل الدخول عبر رقم الهاتف أو البريد الإلكتروني' : 'Log in via Phone Number or Email'}
                      className="w-full bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-4 font-medium text-luxury-900 dark:text-luxury-50 placeholder-luxury-400/50 dark:placeholder-luxury-500/50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    />
                    <button
                      onClick={handleLoginSubmit}
                      className="w-full py-4 px-4 rounded-xl font-bold transition-all bg-gradient-to-r from-gold-500 to-gold-400 text-luxury-900 hover:scale-[1.02] shadow-md"
                    >
                      {isAr ? 'المتابعة' : 'Continue'}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 my-8">
                    <div className="h-px bg-luxury-200 dark:bg-luxury-800 flex-1"></div>
                    <span className="text-luxury-400 dark:text-luxury-500 text-sm font-medium">{isAr ? 'أو' : 'OR'}</span>
                    <div className="h-px bg-luxury-200 dark:bg-luxury-800 flex-1"></div>
                  </div>

                  <div className="flex justify-center gap-6">
                    <button 
                      onClick={completeLogin} 
                      className="w-16 h-16 rounded-full flex items-center justify-center border border-luxury-200 dark:border-luxury-800 bg-white dark:bg-luxury-900 hover:border-gold-300 dark:hover:border-gold-700 transition-all shadow-sm hover:scale-105"
                      title={isAr ? 'جوجل' : 'Google'}
                    >
                      <GoogleIcon />
                    </button>
                    <button 
                      onClick={completeLogin} 
                      className="w-16 h-16 rounded-full flex items-center justify-center border border-luxury-200 dark:border-luxury-800 bg-white dark:bg-luxury-900 hover:border-gold-300 dark:hover:border-gold-700 transition-all shadow-sm hover:scale-105"
                      title={isAr ? 'أبل' : 'Apple'}
                    >
                      <AppleIcon />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">
                      {isAr ? 'رمز التحقق' : 'Verification Code'}
                    </h2>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm mt-4 leading-relaxed">
                      {isAr 
                        ? `تم إرسال رمز التحقق إلى ${loginInput} عبر ${loginMethod === 'phone' ? 'رسالة نصية / واتساب' : 'البريد الإلكتروني'}`
                        : `Verification code sent to ${loginInput} via ${loginMethod === 'phone' ? 'SMS / WhatsApp' : 'Email'}`}
                    </p>
                  </div>

                  <div className="space-y-4 mt-8">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder={isAr ? 'أدخل الرمز (مثال: 1234)' : 'Enter code (e.g. 1234)'}
                      className="w-full text-center tracking-widest text-2xl bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-4 font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    />
                  </div>

                  <div className="flex justify-center mt-12">
                    <button 
                      onClick={completeLogin}
                      disabled={otpCode.length < 4}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        otpCode.length < 4
                          ? 'bg-luxury-200 dark:bg-luxury-800 text-luxury-400 cursor-not-allowed'
                          : 'bg-gold-600 text-white hover:scale-110 hover:shadow-gold-500/20'
                      }`}
                    >
                      <Check size={24} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="flex flex-1 h-full w-full overflow-hidden">
        <AnimatePresence initial={false}>
          {!isPresentationMode && (
            <motion.aside 
              initial={{ width: 88 }}
              animate={{ width: isSidebarHovered ? 280 : 88 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              onMouseEnter={() => setIsSidebarHovered(true)}
              onMouseLeave={() => setIsSidebarHovered(false)}
              className={`hidden md:flex flex-col bg-white dark:bg-luxury-900 border-${isRTL ? 'l' : 'r'} z-20 overflow-hidden whitespace-nowrap transition-colors duration-500 shrink-0 shadow-2xl ${isClientWorkspace ? 'border-gold-500/30' : 'border-luxury-200 dark:border-luxury-800'}`}
            >
              {SidebarContent({ isExpanded: isSidebarHovered })}
            </motion.aside>
          )}
        </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} bottom-0 w-72 bg-white dark:bg-luxury-900 border-${isRTL ? 'l' : 'r'} z-50 flex flex-col md:hidden shadow-2xl ${isClientWorkspace ? 'border-gold-500/30' : 'border-luxury-200 dark:border-luxury-800'}`}
            >
              {SidebarContent({ isExpanded: true })}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className={`h-20 backdrop-blur-md border-b flex items-center justify-between px-4 md:px-8 z-10 transition-colors duration-500 ${isClientWorkspace ? 'bg-gold-500/5 border-gold-500/20' : 'bg-white/80 dark:bg-luxury-950/80 border-luxury-200 dark:border-luxury-800'}`}>
          <div className="flex items-center gap-4">
            <button className="md:hidden text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            
            {isClientWorkspace ? (
              <div className="flex items-center gap-4">
                <div className="relative" ref={clientDropdownRef}>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                    className="flex items-center gap-2 font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 hover:text-gold-700 dark:hover:text-gold-500 transition-colors"
                  >
                    {activeClient.profile.name}
                    <ChevronDown size={16} className={`transition-transform ${isClientDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {isClientDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-2 w-64 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          {Object.values(globalState.clients).filter(c => c.profile.status === 'Active').map(client => (
                            <motion.button
                              whileHover={{ backgroundColor: 'rgba(197,156,106,0.1)' }}
                              key={client.profile.id}
                              onClick={() => {
                                setGlobalState(prev => ({ ...prev, activeClientId: client.profile.id }));
                                setIsClientDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${client.profile.id === globalState.activeClientId ? 'bg-luxury-50 dark:bg-luxury-800' : ''}`}
                            >
                              <img src={client.profile.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="font-bold text-sm text-luxury-900 dark:text-luxury-50">{client.profile.name}</p>
                                <p className="text-xs font-medium text-luxury-500 truncate">{client.profile.project}</p>
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={currentView}
                className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 hidden md:block"
              >
                {navItems.find(i => i.id === currentView)?.label || t('nav.profile')}
              </motion.h2>
            )}
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            {/* Client Chat Button */}
            {(role === 'CLIENT' || role === 'GUEST') && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (currentView !== ViewModule.CHAT) {
                    setCurrentView(ViewModule.CHAT);
                  }
                }}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
                  currentView === ViewModule.CHAT
                    ? 'bg-gold-600 text-white border-gold-600 shadow-md'
                    : 'bg-luxury-100 dark:bg-luxury-900 border-luxury-300 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:text-gold-700 dark:hover:text-gold-400 hover:border-gold-600'
                }`}
                title={t('nav.chat')}
              >
                <MessageSquare size={18} />
                {activeClient?.hasUnreadMessages && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-luxury-50 dark:border-luxury-950 shadow-md" />
                )}
              </motion.button>
            )}

            {/* Client Cart Button */}
            {(role === 'CLIENT' || role === 'GUEST') && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (currentView !== ViewModule.CART) {
                    setCurrentView(ViewModule.CART);
                  }
                }}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
                  currentView === ViewModule.CART
                    ? 'bg-gold-600 text-white border-gold-600 shadow-md'
                    : 'bg-luxury-100 dark:bg-luxury-900 border-luxury-300 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:text-gold-700 dark:hover:text-gold-400 hover:border-gold-600'
                }`}
                title={t('cart.title')}
              >
                <ShoppingBag size={18} />
                {clientCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-600 border-2 border-luxury-50 dark:border-luxury-950 text-white font-bold text-[10px] flex items-center justify-center shadow-md">
                    {clientCartCount}
                  </span>
                )}
              </motion.button>
            )}

            {/* Notifications Button (Architect Only) */}
            {role === 'ARCHITECT' && (
              <div className="relative" ref={notificationsRef}>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-luxury-100 dark:bg-luxury-900 border border-luxury-300 dark:border-luxury-700 text-luxury-600 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 hover:border-gold-700 dark:hover:border-gold-500 transition-colors"
                >
                  <Bell size={18} />
                  {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-md">
                      {totalNotifications}
                    </span>
                  )}
                </motion.button>
                <AnimatePresence>
                  {isNotificationsOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-luxury-200 dark:border-luxury-800 bg-luxury-50 dark:bg-luxury-950/50">
                          <h3 className="font-bold text-luxury-900 dark:text-luxury-50">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto no-scrollbar">
                          {totalNotifications === 0 ? (
                            <div className="p-6 text-center text-luxury-500 font-medium text-sm">No new notifications.</div>
                          ) : (
                            Object.values(globalState.clients).map(client => {
                              if (!client.hasUnreadMessages && !client.hasPendingApprovals && !client.hasNewTickets) return null;
                              return (
                                <div key={client.profile.id} className="p-4 border-b border-luxury-100 dark:border-luxury-800/50 hover:bg-luxury-50 dark:hover:bg-luxury-800 transition-colors cursor-pointer" onClick={() => {
                                  setGlobalState(prev => ({ ...prev, activeClientId: client.profile.id }));
                                  if (currentView !== ViewModule.ADMIN_DASHBOARD) setCurrentView(ViewModule.ADMIN_DASHBOARD);
                                  setIsNotificationsOpen(false);
                                }}>
                                  <div className="flex items-center gap-3 mb-2">
                                    <img src={client.profile.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    <p className="font-bold text-sm text-luxury-900 dark:text-luxury-50">{client.profile.name}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2 pl-11">
                                    {client.hasUnreadMessages && <span className="text-[10px] font-bold px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">New Message</span>}
                                    {client.hasPendingApprovals && <span className="text-[10px] font-bold px-2 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-md">Pending Approval</span>}
                                    {client.hasNewTickets && <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md">New Ticket</span>}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Role Switcher (Architect <-> Support) */}
            {(role === 'ARCHITECT' || role === 'SUPPORT') && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (role === 'ARCHITECT') {
                    setRole('SUPPORT');
                    if (currentView !== ViewModule.SUPPORT_DASHBOARD) setCurrentView(ViewModule.SUPPORT_DASHBOARD);
                  } else {
                    setRole('ARCHITECT');
                    if (currentView !== ViewModule.ADMIN_DIRECTORY) setCurrentView(ViewModule.ADMIN_DIRECTORY);
                  }
                }}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-100 dark:bg-luxury-900 border border-luxury-300 dark:border-luxury-700 text-luxury-600 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 hover:border-gold-700 dark:hover:border-gold-500 transition-all font-bold text-sm"
              >
                {role === 'ARCHITECT' ? <><Headphones size={16} /> {t('support.switch.support')}</> : <><PenTool size={16} /> {t('support.switch.architect')}</>}
              </motion.button>
            )}

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => { if (currentView !== settingsView) setCurrentView(settingsView); }}
            >
              <div className="hidden md:flex flex-col items-end justify-center h-full">
                {role === 'SUPPORT' ? (
                  <span className="text-xl md:text-2xl font-serif font-bold text-luxury-900 dark:text-luxury-50 group-hover:text-gold-700 dark:group-hover:text-gold-400 transition-colors">
                    {lang === 'ar' ? 'فريق الدعم الفني' : 'Support Team'}
                  </span>
                ) : (
                  <>
                    <span className="text-sm font-bold text-luxury-900 dark:text-luxury-50 group-hover:text-gold-700 dark:group-hover:text-gold-400 transition-colors">
                      {role === 'ARCHITECT' ? globalState.architectProfile.name : activeClient.profile.name}
                    </span>
                    <span className="text-xs font-bold bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-300 dark:to-gold-500 text-transparent bg-clip-text">
                      {role === 'ARCHITECT' ? globalState.architectProfile.title : activeClient.profile.tier}
                    </span>
                  </>
                )}
              </div>
              <motion.img 
                whileHover={{ scale: 1.1, rotate: 5 }}
                src={role === 'ARCHITECT' ? globalState.architectProfile.avatar : role === 'SUPPORT' ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200' : activeClient.profile.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-gold-700 dark:border-gold-500 object-cover shadow-[0_0_10px_rgba(166,136,104,0.3)]" 
              />
            </motion.div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar relative p-4 md:p-8">
          {children}
        </div>
      </main>
      </div>
    </div>
  );
};
