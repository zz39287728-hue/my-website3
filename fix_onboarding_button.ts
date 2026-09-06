import fs from 'fs';

const path = 'src/components/Onboarding.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Check to imports
content = content.replace(
  `import { Sparkles, Palette, Home, Moon, Sun, Globe, ArrowRight, ArrowLeft } from 'lucide-react';`,
  `import { Sparkles, Palette, Home, Moon, Sun, Globe, ArrowRight, ArrowLeft, Check } from 'lucide-react';`
);

// 2. Replace Step 0 button
const step0Button = `              <div className="flex justify-end mt-8" dir={isAr ? 'rtl' : 'ltr'}>
                <Button onClick={handleNext} className="px-8 py-3 rounded-full flex items-center gap-2">
                  <span>{isAr ? 'التالي' : 'Continue'}</span>
                  {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </Button>
              </div>`;

const newStep0Button = `              <div className="flex justify-center mt-8">
                <button
                  onClick={handleNext}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-luxury-900 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                >
                  {isAr ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                </button>
              </div>`;

content = content.replace(step0Button, newStep0Button);

// 3. Replace Step > 0 button
const stepNButton = `              <div className="flex justify-end mt-12" dir={isAr ? 'rtl' : 'ltr'}>
                <Button 
                  onClick={handleNext} 
                  disabled={!preferences[questions[step - 1].id]}
                  className="px-8 py-3 rounded-full flex items-center gap-2" 
                >
                  <span>{step === questions.length ? (isAr ? 'إنهاء' : 'Finish') : (isAr ? 'التالي' : 'Next')}</span>
                  {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </Button>
              </div>`;

const newStepNButton = `              <div className="flex justify-center mt-12">
                <button 
                  onClick={handleNext} 
                  disabled={!preferences[questions[step - 1].id]}
                  className={\`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg \${
                    !preferences[questions[step - 1].id] 
                      ? 'bg-luxury-200 dark:bg-luxury-800 text-luxury-400 dark:text-luxury-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-gold-500 to-gold-400 text-luxury-900 hover:scale-105'
                  }\`}
                >
                  {step === questions.length ? <Check size={24} /> : (isAr ? <ArrowLeft size={24} /> : <ArrowRight size={24} />)}
                </button>
              </div>`;

content = content.replace(stepNButton, newStepNButton);

fs.writeFileSync(path, content);
console.log('Fixed button style');
