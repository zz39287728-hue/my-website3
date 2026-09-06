import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const target1 = `                                  setCurrentView(ViewModule.ADMIN_DASHBOARD);`;
const rep1 = `                                  if (currentView !== ViewModule.ADMIN_DASHBOARD) setCurrentView(ViewModule.ADMIN_DASHBOARD);`;
content = content.replace(target1, rep1);

const target2 = `                    setCurrentView(ViewModule.SUPPORT_DASHBOARD);`;
const rep2 = `                    if (currentView !== ViewModule.SUPPORT_DASHBOARD) setCurrentView(ViewModule.SUPPORT_DASHBOARD);`;
content = content.replace(target2, rep2);

const target3 = `                    setCurrentView(ViewModule.ADMIN_DIRECTORY);`;
const rep3 = `                    if (currentView !== ViewModule.ADMIN_DIRECTORY) setCurrentView(ViewModule.ADMIN_DIRECTORY);`;
content = content.replace(target3, rep3);

const target4 = `              onClick={() => setCurrentView(settingsView)}`;
const rep4 = `              onClick={() => { if (currentView !== settingsView) setCurrentView(settingsView); }}`;
content = content.replace(target4, rep4);

const target5 = `            setCurrentView(settingsView);`;
const rep5 = `            if (currentView !== settingsView) setCurrentView(settingsView);`;
content = content.replace(target5, rep5);


fs.writeFileSync(path, content);
