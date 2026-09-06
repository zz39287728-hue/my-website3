import fs from 'fs';

const path = 'src/components/Onboarding.tsx';
let content = fs.readFileSync(path, 'utf8');

const target1 = `<div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setLang('en')}`;

const replacement1 = `<div className="grid grid-cols-2 gap-3" dir="ltr">
                    <button 
                      onClick={() => setLang('en')}`;

const target2 = `<div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setTheme('light')}`;

const replacement2 = `<div className="grid grid-cols-2 gap-3" dir="ltr">
                    <button 
                      onClick={() => setTheme('light')}`;

if (content.includes(target1) && content.includes(target2)) {
  content = content.replace(target1, replacement1);
  content = content.replace(target2, replacement2);
  fs.writeFileSync(path, content);
  console.log("Fixed direction");
} else {
  console.log("Targets not found");
}
