import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// I'll replace everything from '{navItems.map((item) => {' up to the closing '})}'
const startMarker = '{navItems.map((item) => {';
const endMarker = '          );';

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) throw new Error("Could not find startMarker");

// Find the corresponding closing brackets for the map. 
// A safer way is to split the content by lines and replace the specific lines.
const lines = content.split('\n');
const startLine = lines.findIndex(l => l.includes('{navItems.map((item) => {'));
const endLine = lines.findIndex((l, i) => i > startLine && l.includes('        })}'));

if (startLine !== -1 && endLine !== -1) {
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
                  ? 'opacity-40 cursor-not-allowed text-luxury-400 dark:text-luxury-600 border-l-4 border-transparent'
                  : isActive 
                    ? (isClientWorkspace 
                        ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-md' 
                        : 'bg-gradient-to-r from-gold-700/10 dark:from-gold-500/10 to-transparent border-l-4 border-gold-700 dark:border-gold-500 text-gold-700 dark:text-gold-400 shadow-sm')
                    : (isClientWorkspace
                        ? 'text-luxury-700 dark:text-luxury-300 hover:text-gold-700 dark:hover:text-gold-400 border-l-4 border-transparent'
                        : 'text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-100 border-l-4 border-transparent')
              }\`}
              title={!isExpanded ? item.label : undefined}
            >
              <div className="relative">
                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon size={24} className={\`shrink-0 \${isActive ? (isClientWorkspace ? 'text-white' : 'text-gold-700 dark:text-gold-400') : ''}\`} />
                </motion.div>
                {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && !isExpanded && !item.locked && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-600 text-white dark:text-luxury-950 text-[10px] font-bold flex items-center justify-center shadow-md">
                    {item.badge}
                  </span>
                )}
              </div>
              
              <span className={\`font-bold text-base whitespace-nowrap transition-opacity duration-300 \${isRTL ? 'mr-4' : 'ml-4'} \${isExpanded ? 'opacity-100' : 'opacity-0'}\`}>
                {item.label}
              </span>
              
              {isExpanded && item.locked && (
                <div className={\`\${isRTL ? 'mr-auto' : 'ml-auto'}\`}>
                  <Lock size={16} className="text-luxury-400 dark:text-luxury-600" />
                </div>
              )}
              
              {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && isExpanded && !item.locked && (
                <span className={\`px-2 py-0.5 rounded-full text-xs font-bold bg-gold-600/20 border border-gold-600/40 text-gold-700 dark:text-gold-300 \${isRTL ? 'mr-auto' : 'ml-auto'}\`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}`;

  lines.splice(startLine, endLine - startLine + 1, replacement);
  fs.writeFileSync(path, lines.join('\n'));
  console.log('Successfully replaced lines ' + startLine + ' to ' + endLine);
} else {
  console.log('Could not find start or end line', startLine, endLine);
}

