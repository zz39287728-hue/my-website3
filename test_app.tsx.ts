import fs from 'fs';
const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const target2 = `                if (currentView !== targetView) {
                  setCurrentView(targetView);
                }`;
const rep2 = `                if (currentView !== targetView) {
                  setCurrentView(targetView);
                } else {
                  window.dispatchEvent(new CustomEvent('reset-view', { detail: targetView }));
                }`;

content = content.replace(target2, rep2);

const target3 = `            if (currentView !== settingsView) setCurrentView(settingsView);`;
const rep3 = `            if (currentView !== settingsView) { setCurrentView(settingsView); } else { window.dispatchEvent(new CustomEvent('reset-view', { detail: settingsView })); }`;
content = content.replace(target3, rep3);

fs.writeFileSync(path, content);
