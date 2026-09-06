import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const target1 = `              onClick={() => {
                if (item.locked) {
                  setShowGuestLockModal(true);
                  setIsMobileMenuOpen(false);
                  return;
                }
                setCurrentView(item.id);
                setIsMobileMenuOpen(false);
              }}`;

const replacement1 = `              onClick={() => {
                if (item.locked) {
                  setShowGuestLockModal(true);
                  setIsMobileMenuOpen(false);
                  return;
                }
                if (currentView !== item.id) {
                  setCurrentView(item.id);
                }
                setIsMobileMenuOpen(false);
              }}`;

content = content.replace(target1, replacement1);


const target2 = `            onClick={() => {
              if (role === 'SUPPORT') {
                setCurrentView(ViewModule.SUPPORT_CLIENTS);
              } else {
                setCurrentView(ViewModule.ADMIN_DIRECTORY);
              }
              setIsMobileMenuOpen(false);
            }}`;

const replacement2 = `            onClick={() => {
              const targetView = role === 'SUPPORT' ? ViewModule.SUPPORT_CLIENTS : ViewModule.ADMIN_DIRECTORY;
              if (currentView !== targetView) {
                setCurrentView(targetView);
              }
              setIsMobileMenuOpen(false);
            }}`;
            
content = content.replace(target2, replacement2);


const target3 = `                onClick={() => setCurrentView(ViewModule.INVOICE)}`;
const replacement3 = `                onClick={() => {
                  if (currentView !== ViewModule.INVOICE) {
                    setCurrentView(ViewModule.INVOICE);
                  }
                }}`;
                
content = content.replace(target3, replacement3);

const target4 = `            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView(ViewModule.PROFILE)}`;
              
const replacement4 = `            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (currentView !== ViewModule.PROFILE) {
                  setCurrentView(ViewModule.PROFILE);
                }
              }}`;
              
content = content.replace(target4, replacement4);

fs.writeFileSync(path, content);
