import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView(ViewModule.INVOICE)}
                className={\`relative flex items-center justify-center gap-2 px-3 py-2 rounded-full border transition-all \${
                  currentView === ViewModule.INVOICE
                    ? 'bg-gold-600 text-white border-gold-600 shadow-md'
                    : 'bg-luxury-100 dark:bg-luxury-900 border-luxury-300 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:text-gold-700 dark:hover:text-gold-400 hover:border-gold-600'
                }\`}
                title={t('cart.title')}
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline font-bold text-xs">{t('cart.tabs.cart')}</span>
                {clientCartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gold-600 text-white dark:text-luxury-950 font-bold text-[11px] flex items-center justify-center shadow-md">
                    {clientCartCount}
                  </span>
                )}
              </motion.button>`;

const newStr = `              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView(ViewModule.INVOICE)}
                className={\`relative flex items-center justify-center w-10 h-10 rounded-full border transition-all \${
                  currentView === ViewModule.INVOICE
                    ? 'bg-gold-600 text-white border-gold-600 shadow-md'
                    : 'bg-luxury-100 dark:bg-luxury-900 border-luxury-300 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:text-gold-700 dark:hover:text-gold-400 hover:border-gold-600'
                }\`}
                title={t('cart.title')}
              >
                <ShoppingBag size={18} />
                {clientCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-600 border-2 border-luxury-50 dark:border-luxury-950 text-white font-bold text-[10px] flex items-center justify-center shadow-md">
                    {clientCartCount}
                  </span>
                )}
              </motion.button>`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(path, content);
