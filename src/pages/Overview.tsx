import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, ProgressGauge } from '../components/UI';
import { StageStatus, ViewModule } from '../types';
import { useAppContext } from '../App';
import { CheckCircle2, Clock, AlertCircle, ChevronRight, Settings, Globe, MessageSquare, Moon, Edit2, Check, LogOut } from 'lucide-react';

export const Dashboard: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, globalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-2xl border border-luxury-200 dark:border-luxury-800 transition-colors duration-500 group"
      >
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 10, ease: "linear" }}
          src="https://picsum.photos/id/1031/1200/400" 
          alt="Project Cover" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-50 via-luxury-50/60 dark:from-luxury-950 dark:via-luxury-950/60 to-transparent transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
          <div>
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="font-serif text-3xl md:text-5xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
              {t('dashboard.welcome')}, {activeClient.profile.name.split(' ')[0]}
            </motion.h1>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-300 dark:to-gold-500 text-transparent bg-clip-text text-lg font-bold">
              {activeClient.profile.project} • {activeClient.profile.area}
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.5, type: "spring" }} 
            className="hidden md:block bg-white/60 dark:bg-luxury-950/60 backdrop-blur-md p-4 rounded-2xl border border-luxury-200 dark:border-luxury-800 shadow-lg transition-colors duration-500"
          >
            <p className="text-xs font-bold text-luxury-600 dark:text-luxury-300 text-center mb-2 uppercase tracking-widest">{t('dashboard.progress')}</p>
            <ProgressGauge progress={activeClient.profile.completion} size={100} strokeWidth={6} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: t('dashboard.activeStage'), value: 'Specifications', icon: CheckCircle2, color: 'text-gold-700 dark:text-gold-400' },
          { label: t('dashboard.pending'), value: '2', icon: AlertCircle, color: 'text-red-500 dark:text-red-400' },
          { label: t('dashboard.upcoming'), value: '1', icon: Clock, color: 'text-blue-500 dark:text-blue-400' },
          { label: t('dashboard.unread'), value: '3', icon: MessageSquare, color: 'text-green-500 dark:text-green-400' }
        ].map((metric, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="flex items-center justify-between h-full">
              <div>
                <p className="text-luxury-600 dark:text-luxury-400 font-bold text-sm mb-1">{metric.label}</p>
                <p className={`text-2xl font-serif font-bold ${metric.color}`}>{metric.value}</p>
              </div>
              <motion.div whileHover={{ rotate: 15, scale: 1.1 }}>
                <metric.icon size={32} className="text-luxury-300 dark:text-luxury-700" />
              </motion.div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card delay={0.5}>
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">{t('dashboard.roadmap')}</h3>
        </div>
        <div className="relative">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-gold-700 dark:from-gold-500 via-luxury-200 to-luxury-100 dark:via-luxury-800 dark:to-luxury-900" 
          />
          <div className="space-y-8">
            {activeClient.milestones.map((milestone, idx) => (
              <motion.div 
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                className="relative pl-12 flex items-center justify-between group"
              >
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className={`absolute left-2.5 w-3.5 h-3.5 rounded-full border-2 ${
                    milestone.status === StageStatus.COMPLETED ? 'bg-gradient-to-br from-gold-600 to-gold-700 dark:from-gold-400 dark:to-gold-600 border-gold-700 dark:border-gold-500 shadow-[0_0_8px_rgba(166,136,104,0.6)] dark:shadow-[0_0_8px_rgba(197,156,106,0.6)]' :
                    milestone.status === StageStatus.IN_PROGRESS ? 'bg-white dark:bg-luxury-900 border-gold-700 dark:border-gold-500 animate-pulse-slow' :
                    'bg-white dark:bg-luxury-900 border-luxury-300 dark:border-luxury-700'
                  }`} 
                />
                <div className="group-hover:translate-x-2 transition-transform duration-300">
                  <h4 className={`font-bold text-lg ${milestone.status === StageStatus.UPCOMING ? 'text-luxury-400 dark:text-luxury-500' : 'text-luxury-900 dark:text-luxury-200'}`}>
                    {t(`stage.${milestone.id}`)}
                  </h4>
                  {milestone.date && <p className="text-sm font-bold text-luxury-500 dark:text-luxury-400 mt-1">{milestone.date}</p>}
                </div>
                {milestone.status === StageStatus.IN_PROGRESS && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-1.5 bg-gradient-to-r from-gold-700/10 dark:from-gold-500/10 to-transparent text-gold-700 dark:text-gold-400 font-bold text-sm rounded-full border border-gold-700/30 dark:border-gold-500/30"
                  >
                    {t('status.active')}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const Profile: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { theme, setTheme, lang, setLang, t, globalState, setGlobalState, setRole, setShowOnboarding } = useAppContext();
  const isRTL = lang === 'ar';
  const isDark = theme === 'dark';
  const activeClient = globalState.clients[globalState.activeClientId];
  const isGuest = activeClient?.profile?.isGuest;

  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'PROFILE') {
        setIsEditing(false);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);
  const [editName, setEditName] = useState(activeClient.profile.name);
  const [editAvatar, setEditAvatar] = useState(activeClient.profile.avatar);
  const [editPhone, setEditPhone] = useState(activeClient.profile.phone || '');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSaveProfile = () => {
    setGlobalState(prev => {
      // Find guest bookings with this phone number to sync
      const syncedBookings = [];
      const updatedClients = { ...prev.clients };
      
      if (editPhone && !isGuest) {
        const normalizePhone = (p: string) => p.replace(/[\s+]/g, '');
        const normalizedEditPhone = normalizePhone(editPhone);

        Object.entries(updatedClients).forEach(([id, client]) => {
          if (client.profile.isGuest) {
            const guestPhoneBookings = client.bookings.filter(b => b.guestPhone && normalizePhone(b.guestPhone) === normalizedEditPhone);
            if (guestPhoneBookings.length > 0) {
              syncedBookings.push(...guestPhoneBookings);
              // We optionally remove them from the guest client, but it's okay to just copy them.
              updatedClients[id] = {
                ...client,
                bookings: client.bookings.filter(b => !b.guestPhone || normalizePhone(b.guestPhone) !== normalizedEditPhone)
              };
            }
          }
        });
      }

      if (syncedBookings.length > 0) {
        setSyncMessage(isRTL ? `تمت مزامنة ${syncedBookings.length} حجوزات سابقة بنجاح!` : `Successfully synced ${syncedBookings.length} past bookings!`);
        setTimeout(() => setSyncMessage(null), 5000);
      } else if (editPhone && editPhone !== activeClient.profile.phone) {
        setSyncMessage(isRTL ? 'تم حفظ رقم الهاتف.' : 'Phone number saved.');
        setTimeout(() => setSyncMessage(null), 3000);
      }

      return {
        ...prev,
        clients: {
          ...updatedClients,
          [prev.activeClientId]: {
            ...updatedClients[prev.activeClientId],
            bookings: [
              ...updatedClients[prev.activeClientId].bookings,
              ...syncedBookings
            ],
            profile: {
              ...updatedClients[prev.activeClientId].profile,
              name: editName,
              avatar: editAvatar,
              phone: editPhone
            }
          }
        }
      };
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <Card className="flex flex-col md:flex-row items-center gap-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative group cursor-pointer" 
          onClick={() => setIsEditing(true)}
        >
          <img src={activeClient.profile.avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-luxury-200 dark:border-luxury-800 group-hover:border-gold-700 dark:group-hover:border-gold-500 transition-colors shadow-xl" />
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm text-white font-bold flex items-center gap-1"><Edit2 size={14}/> {t('profile.changePhoto')}</span>
          </div>
        </motion.div>
        <div className="flex-1 text-center md:text-left w-full">
          {isEditing ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500 transition-colors"
              />
              <input 
                type="text" 
                value={editAvatar} 
                onChange={(e) => setEditAvatar(e.target.value)}
                placeholder="Avatar URL"
                className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 font-medium text-sm text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500 transition-colors"
              />
              {!isGuest && (
                <div>
                  <input 
                    type="text" 
                    value={editPhone} 
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder={isRTL ? "رقم الهاتف (+973...)" : "Phone Number (+973...)"}
                    className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 font-medium text-sm text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500 transition-colors mb-2"
                  />
                  <p className="text-xs text-luxury-500 dark:text-luxury-400">
                    {isRTL 
                      ? "بإضافة رقم هاتفك، سيتم تلقائياً جلب ومزامنة أي حجوزات استشارة قمت بها سابقاً كضيف." 
                      : "By adding your phone number, any past guest consultations will be automatically synced to this account."}
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-center md:justify-start">
                <Button onClick={handleSaveProfile} className="py-2 px-4 text-sm"><Check size={16}/> Save</Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)} className="py-2 px-4 text-sm">Cancel</Button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h2 className="font-serif text-3xl font-bold text-luxury-900 dark:text-luxury-50">{activeClient.profile.name}</h2>
                <motion.button whileHover={{ rotate: 15, scale: 1.2 }} onClick={() => setIsEditing(true)} className="text-luxury-400 hover:text-gold-700 dark:hover:text-gold-500 transition-colors"><Edit2 size={16}/></motion.button>
              </div>
              <p className="bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-300 dark:to-gold-600 text-transparent bg-clip-text font-bold text-lg mb-2">{activeClient.profile.tier}</p>
              {!isGuest && activeClient.profile.phone && (
                <p className="text-luxury-600 dark:text-luxury-400 font-medium mb-4">{activeClient.profile.phone}</p>
              )}
              {syncMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-4 py-2 rounded-lg text-sm font-bold">
                  {syncMessage}
                </motion.div>
              )}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <motion.div whileHover={{ y: -2 }} className="bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 px-4 py-2 rounded-lg text-sm font-bold shadow-inner transition-colors duration-500"><span className="text-luxury-500 dark:text-luxury-400">{t('profile.project')}</span> {activeClient.profile.project}</motion.div>
                <motion.div whileHover={{ y: -2 }} className="bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 px-4 py-2 rounded-lg text-sm font-bold shadow-inner transition-colors duration-500"><span className="text-luxury-500 dark:text-luxury-400">{t('profile.area')}</span> {activeClient.profile.area}</motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      <Card delay={0.1}>
        <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-6 flex items-center gap-2"><Settings size={24} className="text-gold-700 dark:text-gold-500"/> {t('profile.preferences')}</h3>
        <div className="space-y-6">
          <motion.div whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500">
            <div className="flex items-center gap-4">
              <Globe className="text-luxury-600 dark:text-luxury-400" />
              <div>
                <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{t('profile.language')}</p>
                <p className="text-sm font-bold text-luxury-500">{t('profile.languageDesc')}</p>
              </div>
            </div>
            <button 
              onClick={() => setLang(isRTL ? 'en' : 'ar')}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isRTL ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400' : 'bg-luxury-300 dark:bg-luxury-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-luxury-50 transition-transform ${isRTL ? (isRTL ? '-translate-x-6' : 'translate-x-6') : (isRTL ? '-translate-x-1' : 'translate-x-1')}`} />
            </button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500">
            <div className="flex items-center gap-4">
              <Moon className="text-luxury-600 dark:text-luxury-400" />
              <div>
                <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{t('profile.theme')}</p>
                <p className="text-sm font-bold text-luxury-500">{t('profile.themeDesc')}</p>
              </div>
            </div>
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isDark ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400' : 'bg-luxury-300 dark:bg-luxury-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-luxury-50 transition-transform ${isDark ? (isRTL ? '-translate-x-6' : 'translate-x-6') : (isRTL ? '-translate-x-1' : 'translate-x-1')}`} />
            </button>
          </motion.div>
          
          {!isGuest && (
            <motion.div whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500">
              <div>
                <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{t('profile.notifications')}</p>
                <p className="text-sm font-bold text-luxury-500">{t('profile.notificationsDesc')}</p>
              </div>
              <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400">
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-luxury-50 ${isRTL ? '-translate-x-6' : 'translate-x-6'}`} />
              </button>
            </motion.div>
          )}


          {!isGuest && (
            <motion.div whileHover={{ scale: 1.01 }} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500 gap-4">
              <div>
                <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{isRTL ? 'تفضيلات التصميم' : 'Design Preferences'}</p>
                <p className="text-sm font-bold text-luxury-500">{isRTL ? 'إعادة ضبط الإعدادات والإجابات الخاصة بأسلوبك المفضل' : 'Reset preferences and your design style quiz answers'}</p>
              </div>
              <Button 
                variant="secondary"
                onClick={() => setView(ViewModule.DESIGN_PREFERENCES)} 
                className="px-4 py-2 text-sm whitespace-nowrap"
              >
                <Edit2 size={16} /> {isRTL ? 'عرض التفضيلات' : 'View Preferences'}
              </Button>
            </motion.div>
          )}

          <div className="pt-6 border-t border-luxury-200 dark:border-luxury-800">
            <Button 
              onClick={() => {
                setRole('GUEST');
                setGlobalState(prev => ({ ...prev, activeClientId: 'client1' }));
              }} 
              className="w-full text-white dark:text-white hover:opacity-90 border-none shadow-none"
            >
              <LogOut size={18} /> {t('app.logout')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
