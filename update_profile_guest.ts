import fs from 'fs';

const path = 'src/pages/Overview.tsx';
let content = fs.readFileSync(path, 'utf8');

const isGuestStr = `  const isGuest = activeClient?.profile?.isGuest;`;
if (!content.includes(isGuestStr)) {
  content = content.replace(
    `  const activeClient = globalState.clients[globalState.activeClientId];`,
    `  const activeClient = globalState.clients[globalState.activeClientId];\n  const isGuest = activeClient?.profile?.isGuest;`
  );
}

// target for notifications
const notificationsTarget = `<motion.div whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500">
            <div>
              <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{t('profile.notifications')}</p>
              <p className="text-sm font-bold text-luxury-500">{t('profile.notificationsDesc')}</p>
            </div>
            <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400">
              <span className="inline-block h-5 w-5 transform rounded-full bg-white dark:bg-luxury-50 translate-x-6" />
            </button>
          </motion.div>`;

// target for design preferences
const designTarget = `<motion.div whileHover={{ scale: 1.01 }} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500 gap-4">
            <div>
              <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{isRTL ? 'تفضيلات التصميم' : 'Design Preferences'}</p>
              <p className="text-sm font-bold text-luxury-500">{isRTL ? 'إعادة ضبط الإعدادات والإجابات الخاصة بأسلوبك المفضل' : 'Reset preferences and your design style quiz answers'}</p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => setShowOnboarding(true)} 
              className="px-4 py-2 text-sm whitespace-nowrap"
            >
              <Edit2 size={16} /> {isRTL ? 'تعديل التفضيلات' : 'Edit Preferences'}
            </Button>
          </motion.div>`;

const replacementNotifications = `{!isGuest && (
            <motion.div whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500">
              <div>
                <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{t('profile.notifications')}</p>
                <p className="text-sm font-bold text-luxury-500">{t('profile.notificationsDesc')}</p>
              </div>
              <button className="relative inline-flex h-7 w-12 items-center rounded-full bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400">
                <span className="inline-block h-5 w-5 transform rounded-full bg-white dark:bg-luxury-50 translate-x-6" />
              </button>
            </motion.div>
          )}`;

const replacementDesign = `{!isGuest && (
            <motion.div whileHover={{ scale: 1.01 }} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500 gap-4">
              <div>
                <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{isRTL ? 'تفضيلات التصميم' : 'Design Preferences'}</p>
                <p className="text-sm font-bold text-luxury-500">{isRTL ? 'إعادة ضبط الإعدادات والإجابات الخاصة بأسلوبك المفضل' : 'Reset preferences and your design style quiz answers'}</p>
              </div>
              <Button 
                variant="secondary"
                onClick={() => setShowOnboarding(true)} 
                className="px-4 py-2 text-sm whitespace-nowrap"
              >
                <Edit2 size={16} /> {isRTL ? 'تعديل التفضيلات' : 'Edit Preferences'}
              </Button>
            </motion.div>
          )}`;

content = content.replace(notificationsTarget, replacementNotifications);
content = content.replace(designTarget, replacementDesign);

fs.writeFileSync(path, content);
console.log('Successfully updated profile for guests');
