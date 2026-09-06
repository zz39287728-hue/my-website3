import fs from 'fs';

const path = 'src/components/Onboarding.tsx';

const content = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './UI';
import { Sparkles, Palette, Home, Moon, Sun, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../App';

export const OnboardingWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { lang, setLang, theme, setTheme, setGlobalState, globalState } = useAppContext();
  const [step, setStep] = useState(0);
  
  // Start with default or empty preferences
  const [preferences, setPreferences] = useState<Record<string, string>>({});

  const isAr = lang === 'ar';

  const questions = [
    {
      id: 'style',
      icon: Sparkles,
      title: isAr ? 'ما هو الأسلوب المفضل لديك في التصميم الداخلي؟' : 'What is your preferred interior design style?',
      options: [
        { val: 'modern', label: isAr ? 'عصري وبسيط' : 'Modern & Minimalist' },
        { val: 'classic', label: isAr ? 'كلاسيكي فخم' : 'Classic Luxury' },
        { val: 'neoclassic', label: isAr ? 'نيو كلاسيك' : 'Neo-Classic' },
        { val: 'bohemian', label: isAr ? 'بوهيمي أو ريفي' : 'Bohemian/Rustic' }
      ]
    },
    {
      id: 'colors',
      icon: Palette,
      title: isAr ? 'ما هي الألوان التي تميل إليها في مساحتك الخاصة؟' : 'What colors do you lean towards in your personal space?',
      options: [
        { val: 'light', label: isAr ? 'ألوان فاتحة وهادئة' : 'Light & Calm' },
        { val: 'warm', label: isAr ? 'ألوان دافئة وترابية' : 'Warm & Earthy' },
        { val: 'dark', label: isAr ? 'ألوان داكنة وجريئة' : 'Dark & Bold' },
        { val: 'mixed', label: isAr ? 'مزيج من الألوان' : 'Mixed Colors' }
      ]
    },
    {
      id: 'space',
      icon: Home,
      title: isAr ? 'ما هي المساحة الأكثر أهمية بالنسبة لك في المنزل؟' : 'Which space is the most important to you in the house?',
      options: [
        { val: 'living', label: isAr ? 'غرفة المعيشة والضيوف' : 'Living & Guest Room' },
        { val: 'bedroom', label: isAr ? 'غرفة النوم الرئيسية' : 'Master Bedroom' },
        { val: 'kitchen', label: isAr ? 'المطبخ ومساحة الطعام' : 'Kitchen & Dining' },
        { val: 'outdoor', label: isAr ? 'المساحات الخارجية' : 'Outdoor Spaces' }
      ]
    }
  ];

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else {
      const q = questions[step - 1];
      if (!preferences[q.id]) {
        // Enforce selection
        return;
      }
      if (step < questions.length) {
        setStep(step + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Save preferences to the active client
    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      if (!client) return prev; // Just in case it's not client

      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            profile: {
              ...client.profile,
              onboardingCompleted: true,
              designPreferences: preferences
            }
          }
        }
      };
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-luxury-50/90 dark:bg-luxury-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-gold-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-luxury-300/40 dark:from-luxury-700/40 to-transparent rounded-full blur-3xl" />
      </div>
      
      <motion.div 
        key="wizard-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-br from-white to-luxury-50 dark:from-luxury-900 dark:to-luxury-950 border border-luxury-200 dark:border-luxury-800 p-8 md:p-12 rounded-3xl max-w-xl w-full text-center relative z-10 shadow-2xl"
      >
        {step > 0 && (
          <button
            onClick={handleBack}
            className="absolute top-6 right-6 p-2 bg-transparent text-luxury-500 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-white transition-colors opacity-60 hover:opacity-100 z-50 flex items-center gap-1 text-sm font-bold rounded-full"
            title={isAr ? "رجوع" : "Back"}
          >
            {isAr ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
          </button>
        )}

        <div className="flex justify-center mb-8">
          {Array.from({ length: questions.length + 1 }).map((_, i) => (
            <div key={i} className={\`w-2 h-2 rounded-full mx-1 transition-all duration-500 \${i === step ? 'bg-gradient-to-r from-gold-500 to-gold-400 w-6' : 'bg-luxury-300 dark:bg-luxury-700'}\`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">
                  {isAr ? 'أهلاً بك في البوابة' : 'Welcome to the Portal'}
                </h2>
                <p className="text-luxury-600 dark:text-luxury-400">
                  {isAr ? 'لنقم بضبط إعداداتك المفضلة للبدء' : 'Let\\'s configure your preferences to begin'}
                </p>
              </div>

              <div className="space-y-4 text-left" dir={isAr ? 'rtl' : 'ltr'}>
                <div>
                  <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-3 flex items-center gap-2">
                    <Globe size={18} /> {isAr ? 'اختر اللغة' : 'Select Language'}
                  </label>
                  <div className="grid grid-cols-2 gap-3" dir="ltr">
                    <button 
                      onClick={() => setLang('en')}
                      className={\`py-3 px-4 rounded-xl font-bold transition-all border \${lang === 'en' ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400'}\`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => setLang('ar')}
                      className={\`py-3 px-4 rounded-xl font-bold transition-all border \${lang === 'ar' ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400'}\`}
                    >
                      العربية
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-3 mt-6 flex items-center gap-2">
                    {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />} {isAr ? 'المظهر' : 'Appearance'}
                  </label>
                  <div className="grid grid-cols-2 gap-3" dir="ltr">
                    <button 
                      onClick={() => setTheme('light')}
                      className={\`py-3 px-4 rounded-xl font-bold transition-all border \${theme === 'light' ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400'}\`}
                    >
                      {isAr ? 'فاتح' : 'Light'}
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={\`py-3 px-4 rounded-xl font-bold transition-all border \${theme === 'dark' ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400'}\`}
                    >
                      {isAr ? 'داكن' : 'Dark'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8" dir={isAr ? 'rtl' : 'ltr'}>
                <Button onClick={handleNext} className="px-8 py-3 rounded-full flex items-center gap-2">
                  <span>{isAr ? 'التالي' : 'Continue'}</span>
                  {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </Button>
              </div>
            </motion.div>
          )}

          {step > 0 && (
            <motion.div
              key={\`step-\${step}\`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-luxury-100 to-white dark:from-luxury-800 dark:to-luxury-900 border border-luxury-200 dark:border-luxury-700 flex items-center justify-center shadow-inner">
                {React.createElement(questions[step - 1].icon, { size: 40, className: "text-gold-500" })}
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-8 leading-relaxed">
                {questions[step - 1].title}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left" dir={isAr ? 'rtl' : 'ltr'}>
                {questions[step - 1].options.map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setPreferences(prev => ({ ...prev, [questions[step - 1].id]: opt.val }));
                    }}
                    className={\`p-4 rounded-xl font-bold text-sm md:text-base transition-all border text-center \${preferences[questions[step - 1].id] === opt.val ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400 shadow-md transform scale-105' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:border-gold-300'}\`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-end mt-12" dir={isAr ? 'rtl' : 'ltr'}>
                <Button 
                  onClick={handleNext} 
                  disabled={!preferences[questions[step - 1].id]}
                  className="px-8 py-3 rounded-full flex items-center gap-2" 
                >
                  <span>{step === questions.length ? (isAr ? 'إنهاء' : 'Finish') : (isAr ? 'التالي' : 'Next')}</span>
                  {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
`;

fs.writeFileSync(path, content);
console.log('Fixed onboarding navigation');
