import fs from 'fs';

const path = 'src/pages/Overview.tsx';
let content = fs.readFileSync(path, 'utf8');

const target1 = `const { theme, setTheme, lang, setLang, t, globalState, setGlobalState, setRole } = useAppContext();`;
const replacement1 = `const { theme, setTheme, lang, setLang, t, globalState, setGlobalState, setRole, setShowOnboarding } = useAppContext();`;

content = content.replace(target1, replacement1);

const target2 = `          <div className="pt-6 border-t border-luxury-200 dark:border-luxury-800">
            <Button 
              onClick={() => setRole('GUEST')} 
              className="w-full bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-none shadow-none"
            >
              <LogOut size={18} /> {t('app.logout')}
            </Button>
          </div>`;

const replacement2 = `
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

          <div className="pt-6 border-t border-luxury-200 dark:border-luxury-800">
            <Button 
              onClick={() => setRole('GUEST')} 
              className="w-full bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-none shadow-none"
            >
              <LogOut size={18} /> {t('app.logout')}
            </Button>
          </div>`;

content = content.replace(target2, replacement2);

fs.writeFileSync(path, content);
console.log('Fixed profile settings');
