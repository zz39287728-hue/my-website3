import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const stateTarget = `  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);`;
const stateReplacement = `  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [showGuestLockModal, setShowGuestLockModal] = useState(false);`;
content = content.replace(stateTarget, stateReplacement);

const clickTarget = `              onClick={() => {
                if (item.locked) return;
                setCurrentView(item.id);
                setIsMobileMenuOpen(false);
              }}`;
const clickReplacement = `              onClick={() => {
                if (item.locked) {
                  setShowGuestLockModal(true);
                  setIsMobileMenuOpen(false);
                  return;
                }
                setCurrentView(item.id);
                setIsMobileMenuOpen(false);
              }}`;
content = content.replace(clickTarget, clickReplacement);

const hoverTarget = `              whileHover={item.locked ? {} : { x: isRTL ? -5 : 5, backgroundColor: isActive ? '' : (isClientWorkspace ? 'rgba(197,156,106,0.1)' : 'rgba(197,156,106,0.05)') }}`;
const hoverReplacement = `              whileHover={{ x: isRTL ? -5 : 5, backgroundColor: isActive ? '' : (isClientWorkspace ? 'rgba(197,156,106,0.1)' : 'rgba(197,156,106,0.05)') }}`;
content = content.replace(hoverTarget, hoverReplacement);

const tapTarget = `              whileTap={item.locked ? {} : { scale: 0.98 }}`;
const tapReplacement = `              whileTap={{ scale: 0.98 }}`;
content = content.replace(tapTarget, tapReplacement);

const styleTarget = `              className={\`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 \${
                item.locked
                  ? 'opacity-40 cursor-not-allowed text-luxury-400 dark:text-luxury-600 border-l-4 border-transparent'`;
const styleReplacement = `              className={\`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 \${
                item.locked
                  ? 'opacity-50 hover:opacity-100 cursor-pointer text-luxury-500 dark:text-luxury-400 border-l-4 border-transparent'`;
content = content.replace(styleTarget, styleReplacement);

const modalRenderTarget = `      <div className="flex flex-1 h-full w-full overflow-hidden">`;
const modalRenderReplacement = `      <AnimatePresence>
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
              
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mb-4">
                  <Lock size={32} className="text-gold-600 dark:text-gold-400" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                  {isAr ? 'ميزة مقفلة للضيوف' : 'Feature Locked for Guests'}
                </h3>
                <p className="text-luxury-600 dark:text-luxury-400">
                  {isAr 
                    ? 'هذه الميزة متاحة فقط للعملاء المسجلين. يرجى تسجيل الدخول أو إنشاء حساب لفتح جميع ميزات لوحة التحكم.' 
                    : 'This feature is only available for registered clients. Please sign in or create an account to unlock all dashboard features.'}
                </p>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setShowGuestLockModal(false);
                    setRole('GUEST'); // This takes them to Landing (Login Screen)
                  }}
                  className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-white rounded-xl font-bold shadow-md hover:scale-[1.02] transition-all"
                >
                  {isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Log In / Sign Up'}
                </button>
                <button 
                  onClick={() => setShowGuestLockModal(false)}
                  className="w-full py-4 bg-luxury-100 dark:bg-luxury-800 text-luxury-900 dark:text-luxury-50 rounded-xl font-bold hover:scale-[1.02] transition-all"
                >
                  {isAr ? 'العودة لاحقاً' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="flex flex-1 h-full w-full overflow-hidden">`;
content = content.replace(modalRenderTarget, modalRenderReplacement);

fs.writeFileSync(path, content);
console.log('Fixed Guest Lock Modal in Layout');
