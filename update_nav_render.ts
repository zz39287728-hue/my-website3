import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacement = `        {navItems.map((item: any) => {
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
              whileHover={item.locked ? {} : { x: isRTL ? -5 : 5, backgroundColor: isActive ? '' : (isClientWorkspace ? 'rgba(197,156,106,0.1)' : 'rgba(197,156,106,0.05)') }}
              whileTap={item.locked ? {} : { scale: 0.98 }}
              onClick={() => {
                if (item.locked) return;
                setCurrentView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={\`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 \${
                item.locked
                  ? 'opacity-50 cursor-not-allowed text-luxury-400 dark:text-luxury-600 border-l-4 border-transparent'
                  : isActive 
                    ? (isClientWorkspace 
                        ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-md' 
                        : 'bg-gradient-to-r from-gold-700/10 dark:from-gold-500/10 to-transparent border-l-4 border-gold-700 dark:border-gold-500 text-gold-700 dark:text-gold-400 shadow-sm')
                    : (isClientWorkspace
                        ? 'text-luxury-700 dark:text-luxury-300 hover:text-gold-700 dark:hover:text-gold-400 border-l-4 border-transparent'
                        : 'text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-100 border-l-4 border-transparent')
              }\`}
            >
              <div className={\`flex items-center gap-4 w-full \${isRTL ? 'flex-row-reverse' : ''}\`}>
                <div className={\`\${isActive ? (isClientWorkspace ? 'text-white' : 'text-gold-700 dark:text-gold-400') : (item.locked ? 'text-luxury-400 dark:text-luxury-600' : 'text-luxury-400 dark:text-luxury-500')} transition-colors\`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={\`font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300 \${!isSidebarHovered && !isMobileMenuOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'}\`}>
                  {item.label}
                </span>
                
                {/* Badges or Lock */}
                {(isSidebarHovered || isMobileMenuOpen) && (
                  <div className={\`flex items-center gap-2 \${isRTL ? 'mr-auto' : 'ml-auto'}\`}>
                    {item.locked && <Lock size={14} className="text-luxury-400 dark:text-luxury-600" />}
                    
                    {item.badge && item.badge > 0 && !item.locked && (
                      <span className="bg-gold-500 text-luxury-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}`;

content = content.replace(/\{navItems\.map\(\(item\) => \{[\s\S]*?\)\s*\}\)}/, replacement);

fs.writeFileSync(path, content);
console.log('Done rendering locked navItems');
