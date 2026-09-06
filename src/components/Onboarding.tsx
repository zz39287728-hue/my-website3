import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, Home, Moon, Sun, Globe, ArrowRight, ArrowLeft, Check, Mail, Smartphone, User, Users, UsersRound, UserRound, Users2, Baby, EyeOff } from 'lucide-react';
import { useAppContext } from '../App';

// Custom SVG Icons for Google and Apple
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.56.04 2.88.74 3.65 1.9-3.3 1.95-2.76 6.3 1.05 7.74-.78 2.08-1.99 4.14-3.37 5.29zM12.03 7.25c-.15-3.47 2.76-6.08 6.12-6.25.26 3.4-2.88 6.27-6.12 6.25z"/>
  </svg>
);


export const OnboardingWizard: React.FC<{ onComplete: (isGuest?: boolean) => void }> = ({ onComplete }) => {
  const { lang, setLang, theme, setTheme, setGlobalState, globalState } = useAppContext();
  const [step, setStep] = useState(0);
  
  // Start with default or empty preferences
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [loginInput, setLoginInput] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [openAgeDropdown, setOpenAgeDropdown] = useState<number | null>(null);

  const isAr = lang === 'ar';

  const getQuestions = () => {
    const q: any[] = [
      {
        id: 'style',
        icon: Sparkles,
        title: isAr ? 'ما هو الأسلوب المفضل لديك في التصميم الداخلي؟' : 'What is your preferred interior design style?',
        options: [
          { val: 'modern', label: isAr ? 'عصري وبسيط' : 'Modern & Minimalist', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400' },
          { val: 'classic', label: isAr ? 'كلاسيكي فخم' : 'Classic Luxury', img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=400' },
          { val: 'neoclassic', label: isAr ? 'نيو كلاسيك' : 'Neo-Classic', img: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&q=80&w=400' },
          { val: 'bohemian', label: isAr ? 'بوهيمي أو ريفي' : 'Bohemian/Rustic', img: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=400' }
        ]
      },
      {
        id: 'colors',
        icon: Palette,
        title: isAr ? 'ما هي الألوان التي تميل إليها في مساحتك الخاصة؟' : 'What colors do you lean towards in your personal space?',
        options: [
          { val: 'light', label: isAr ? 'ألوان فاتحة وهادئة' : 'Light & Calm', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=400', colors: ['#F5F5DC', '#FFF8DC', '#F0E68C'] },
          { val: 'warm', label: isAr ? 'ألوان دافئة وترابية' : 'Warm & Earthy', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400', colors: ['#D2B48C', '#8B4513', '#A0522D'] },
          { val: 'dark', label: isAr ? 'ألوان داكنة وجريئة' : 'Dark & Bold', img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400', colors: ['#2F4F4F', '#191970', '#800000'] },
          { val: 'mixed', label: isAr ? 'مزيج من الألوان' : 'Mixed Colors', img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=400', colors: ['#4682B4', '#D2B48C', '#2F4F4F'] }
        ]
      },
      {
        id: 'space',
        icon: Home,
        title: isAr ? 'ما هي المساحة الأكثر أهمية بالنسبة لك في المنزل؟' : 'Which space is the most important to you in the house?',
        options: [
          { val: 'living', label: isAr ? 'غرفة المعيشة والضيوف' : 'Living & Guest Room', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400' },
          { val: 'bedroom', label: isAr ? 'غرفة النوم الرئيسية' : 'Master Bedroom', img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=400' },
          { val: 'kitchen', label: isAr ? 'المطبخ ومساحة الطعام' : 'Kitchen & Dining', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400' },
          { val: 'outdoor', label: isAr ? 'المساحات الخارجية' : 'Outdoor Spaces', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400' }
        ]
      },
      {
        id: 'family_type',
        icon: Users,
        title: isAr ? 'لمن سيكون هذا التصميم بالدرجة الأولى؟' : 'Who is this design primarily for?',
        hasPreferNotToSay: true,
        options: [
          { val: 'single', label: isAr ? 'لشخص واحد' : 'Single Person', optionIcon: UserRound },
          { val: 'couple', label: isAr ? 'لزوجين' : 'A Couple', optionIcon: Users2 },
          { val: 'family', label: isAr ? 'لعائلة مع أطفال' : 'Family with Children', optionIcon: Baby },
          { val: 'extended', label: isAr ? 'لعائلة كبيرة' : 'Large/Extended Family', optionIcon: UsersRound }
        ]
      }
    ];

    if (preferences['family_type'] === 'family' || preferences['family_type'] === 'extended') {
      q.push({
        id: 'children_details',
        custom: true,
        icon: Users,
        title: isAr ? 'تفاصيل الأطفال' : 'Children Details',
      });
    }

    q.push({
      id: 'pets',
      custom: true,
      icon: Sparkles,
      title: isAr ? 'هل لديك حيوانات أليفة في المنزل؟' : 'Do you have pets?',
    });

    return q;
  };

  const questions = getQuestions();

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else {
      const q = questions[step - 2];
      
      if (q.custom && q.id === 'children_details') {
        const countStr = preferences['exact_children_count'];
        if (!countStr) return;
        const count = parseInt(countStr);
        for (let i = 0; i < count; i++) {
          if (!preferences[`child_${i}_gender`] || !preferences[`child_${i}_age`]) {
            return;
          }
        }
      } else if (q.custom && q.id === 'pets') {
        if (!preferences['has_pets']) return;
        if (preferences['has_pets'] === 'yes') {
          if (!preferences['pet_types'] || preferences['pet_types'].length === 0) return;
          if (preferences['pet_types'].includes('other') && !preferences['pet_type_other']) return;
        }
      } else if (!preferences[q.id]) {
        // Enforce selection
        return;
      }

      if (step < questions.length + 1) {
        setStep(step + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (step === 1 && showOTP) {
      setShowOTP(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleLoginSubmit = () => {
    if (!loginInput.trim()) return;
    if (loginInput.includes('@')) {
      setLoginMethod('email');
    } else {
      setLoginMethod('phone');
    }
    setShowOTP(true);
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
    onComplete(true);
  };


  const handleSkipConfirm = () => {
    setShowSkipConfirm(false);
    handleComplete();
  };

  const handleGuestLogin = () => {
    setGlobalState(prev => {
      // Create a new guest client
      const guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
      const guestClient = {
        profile: {
          id: guestId,
          name: isAr ? 'ضيف' : 'Guest',
          tier: 'Bronze',
          joinDate: new Date().toISOString().split('T')[0],
          status: 'Active' as 'Active',
          project: 'N/A',
          area: '-',
          location: '-',
          style: '-',
          completion: 0,
          freeConsultations: 0,
          onboardingCompleted: true, // Skip onboarding
          isGuest: true,
          avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200'
        },
        hasPendingApprovals: false,
        hasUnreadMessages: false,
        hasNewTickets: false,
        milestones: [],
        materials: [],
        invoice: {
          id: 'INV-NEW',
          date: new Date().toISOString().split('T')[0],
          status: 'Pending' as 'Pending' | 'Paid',
          items: []
        },
        paidInvoices: [],
        cart: [],
        chatHistory: [],
        contract: null,
        contracts: [],
        bookings: [],
        tasks: [],
        tickets: [],
        project: {
          title: 'Welcome',
          subtitle: '',
          description: '',
          progress: 0,
          totalStages: 5,
          currentStage: 1,
          nextMilestone: '',
          deliveryDate: '',
          images: [],
          updates: []
        },
        designSettings: {
          theme: theme,
          lang: lang
        }
      };

      return {
        ...prev,
        activeClientId: guestId,
        clients: {
          ...prev.clients,
          [guestId]: guestClient
        }
      };
    });
    onComplete(true);
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
          {Array.from({ length: questions.length + 2 }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full mx-1 transition-all duration-500 ${i === step ? 'bg-[#EFE3D1]' : 'bg-luxury-300 dark:bg-luxury-700'}`} />
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
                  {isAr ? 'لنقم بضبط إعداداتك المفضلة للبدء' : 'Let\'s configure your preferences to begin'}
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
                      className={`py-3 px-4 rounded-xl font-bold transition-all border ${lang === 'en' ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400'}`}
                    >
                      English
                    </button>
                    <button 
                      onClick={() => setLang('ar')}
                      className={`py-3 px-4 rounded-xl font-bold transition-all border ${lang === 'ar' ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400'}`}
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
                      className={`py-3 px-4 rounded-xl font-bold transition-all border ${theme === 'light' ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400'}`}
                    >
                      {isAr ? 'فاتح' : 'Light'}
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`py-3 px-4 rounded-xl font-bold transition-all border ${theme === 'dark' ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400'}`}
                    >
                      {isAr ? 'داكن' : 'Dark'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleNext}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-luxury-900 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                >
                  {isAr ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {!showOTP ? (
                <>
                  <div>
                    <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">
                      {isAr ? 'تسجيل الدخول' : 'Sign In'}
                    </h2>
                  </div>

                  <div className="space-y-4 mt-8" dir={isAr ? 'rtl' : 'ltr'}>
                    <input 
                      type="text" 
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder={isAr ? 'تسجيل الدخول عبر رقم الهاتف أو البريد الإلكتروني' : 'Log in via Phone Number or Email'}
                      className="w-full bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-4 font-medium text-luxury-900 dark:text-luxury-50 placeholder-luxury-400/50 dark:placeholder-luxury-500/50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    />
                    <button
                      onClick={handleLoginSubmit}
                      className="w-full py-4 px-4 rounded-xl font-bold transition-all bg-gradient-to-r from-gold-500 to-gold-400 text-luxury-900 hover:scale-[1.02] shadow-md"
                    >
                      {isAr ? 'المتابعة' : 'Continue'}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 my-8">
                    <div className="h-px bg-luxury-200 dark:bg-luxury-800 flex-1"></div>
                    <span className="text-luxury-400 dark:text-luxury-500 text-sm font-medium">{isAr ? 'أو' : 'OR'}</span>
                    <div className="h-px bg-luxury-200 dark:bg-luxury-800 flex-1"></div>
                  </div>

                  <div className="flex justify-center gap-6">
                    <button 
                      onClick={() => setStep(2)} 
                      className="w-16 h-16 rounded-full flex items-center justify-center border border-luxury-200 dark:border-luxury-800 bg-white dark:bg-luxury-900 hover:border-gold-300 dark:hover:border-gold-700 transition-all shadow-sm hover:scale-105"
                      title={isAr ? 'جوجل' : 'Google'}
                    >
                      <GoogleIcon />
                    </button>
                    <button 
                      onClick={() => setStep(2)} 
                      className="w-16 h-16 rounded-full flex items-center justify-center border border-luxury-200 dark:border-luxury-800 bg-white dark:bg-luxury-900 hover:border-gold-300 dark:hover:border-gold-700 transition-all shadow-sm hover:scale-105"
                      title={isAr ? 'أبل' : 'Apple'}
                    >
                      <AppleIcon />
                    </button>
                  </div>

                  <button 
                    onClick={handleGuestLogin}
                    className="w-full mt-8 text-luxury-500 dark:text-luxury-400 hover:text-gold-600 dark:hover:text-gold-400 font-bold text-sm transition-colors"
                  >
                    {isAr ? 'الدخول كضيف' : 'Continue as Guest'}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">
                      {isAr ? 'رمز التحقق' : 'Verification Code'}
                    </h2>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm mt-4 leading-relaxed">
                      {isAr 
                        ? `تم إرسال رمز التحقق إلى ${loginInput} عبر ${loginMethod === 'phone' ? 'رسالة نصية / واتساب' : 'البريد الإلكتروني'}`
                        : `Verification code sent to ${loginInput} via ${loginMethod === 'phone' ? 'SMS / WhatsApp' : 'Email'}`}
                    </p>
                  </div>

                  <div className="space-y-4 mt-8">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder={isAr ? 'أدخل الرمز (مثال: 1234)' : 'Enter code (e.g. 1234)'}
                      className="w-full text-center tracking-widest text-2xl bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-4 font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    />
                  </div>

                  <div className="flex justify-center mt-12">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={otpCode.length < 4}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        otpCode.length < 4
                          ? 'bg-luxury-200 dark:bg-luxury-800 text-luxury-400 dark:text-luxury-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-gold-500 to-gold-400 text-luxury-900 hover:scale-105'
                      }`}
                    >
                      {isAr ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step > 1 && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-luxury-100 to-white dark:from-luxury-800 dark:to-luxury-900 border border-luxury-200 dark:border-luxury-700 flex items-center justify-center shadow-inner">
                {React.createElement(questions[step - 2].icon, { size: 40, className: "text-gold-500" })}
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-8 leading-relaxed">
                {questions[step - 2].title}
              </h2>
              
              {questions[step - 2].custom && questions[step - 2].id === 'children_details' ? (
                <div className="space-y-6 text-left" dir={isAr ? 'rtl' : 'ltr'}>
                  {/* Children Count */}
                  <div>
                    <label className="block text-sm font-bold text-luxury-900 dark:text-luxury-100 mb-4 text-center">
                      {isAr ? 'كم عدد الأطفال؟' : 'How many children?'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
                      {[
                        { num: '1', ar: 'واحد', en: 'One' },
                        { num: '2', ar: 'اثنين', en: 'Two' },
                        { num: '3', ar: 'ثلاث', en: 'Three' },
                        { num: '4', ar: 'أربع', en: 'Four' },
                        { num: '5', ar: 'خمس', en: 'Five' },
                        { num: '6', ar: 'ست', en: 'Six' },
                        { num: '7', ar: 'سبع', en: 'Seven' },
                        { num: '8', ar: 'ثمان', en: 'Eight' },
                        { num: '9', ar: 'تسع', en: 'Nine' },
                        { num: '10', ar: 'عشر', en: 'Ten' }
                      ].map(item => (
                        <button
                          key={item.num}
                          onClick={() => setPreferences(prev => ({ ...prev, exact_children_count: item.num }))}
                          className={`py-3 rounded-xl font-bold transition-all border text-center text-sm ${preferences['exact_children_count'] === item.num ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400 shadow-md transform scale-105' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:border-gold-300'}`}
                        >
                          {isAr ? item.ar : item.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Individual Children Details */}
                  {parseInt(preferences['exact_children_count'] || '0') > 0 && (
                    <div className="mt-8 space-y-4">
                      <label className="block text-sm font-bold text-luxury-900 dark:text-luxury-100 mb-3">
                        {isAr ? 'تفاصيل كل طفل' : 'Details for each child'}
                      </label>
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pb-32 pr-2 custom-scrollbar">
                        {Array.from({ length: parseInt(preferences['exact_children_count']) }).map((_, i) => (
                          <div key={i} className="flex flex-col xl:flex-row gap-3 items-start xl:items-center bg-luxury-50 dark:bg-luxury-800/50 p-3 rounded-xl border border-luxury-100 dark:border-luxury-800">
                            <span className="font-bold text-sm whitespace-nowrap shrink-0 min-w-[60px] dark:text-luxury-200">{isAr ? `الطفل ${i + 1}` : `Child ${i + 1}`}</span>
                            <div className="flex gap-2 w-full xl:w-auto shrink-0">
                              <button
                                onClick={() => setPreferences(prev => ({ ...prev, [`child_${i}_gender`]: 'boy' }))}
                                className={`flex-1 xl:flex-none px-3 py-2 rounded-lg text-xs font-bold transition-all ${preferences[`child_${i}_gender`] === 'boy' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 shadow-sm' : 'bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 text-luxury-500'}`}
                              >
                                {isAr ? 'ولد' : 'Boy'}
                              </button>
                              <button
                                onClick={() => setPreferences(prev => ({ ...prev, [`child_${i}_gender`]: 'girl' }))}
                                className={`flex-1 xl:flex-none px-3 py-2 rounded-lg text-xs font-bold transition-all ${preferences[`child_${i}_gender`] === 'girl' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800 shadow-sm' : 'bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 text-luxury-500'}`}
                              >
                                {isAr ? 'بنت' : 'Girl'}
                              </button>
                            </div>
                            <div className="relative w-full min-w-[90px]">
                              <button
                                type="button"
                                onClick={() => setOpenAgeDropdown(openAgeDropdown === i ? null : i)}
                                className="w-full flex items-center justify-between bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-gold-500 dark:text-luxury-50 cursor-pointer"
                              >
                                <span>{preferences[`child_${i}_age`] || (isAr ? 'العمر' : 'Age')}</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${openAgeDropdown === i ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                              </button>

                              <AnimatePresence>
                                {openAgeDropdown === i && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-10" 
                                      onClick={() => setOpenAgeDropdown(null)}
                                    />
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar"
                                    >
                                      {Array.from({ length: 25 }).map((_, j) => (
                                        <button
                                          key={j + 1}
                                          type="button"
                                          onClick={() => {
                                            setPreferences(prev => ({ ...prev, [`child_${i}_age`]: (j + 1).toString() }));
                                            setOpenAgeDropdown(null);
                                          }}
                                          className={`w-full text-start px-3 py-2 text-sm transition-colors ${preferences[`child_${i}_age`] === (j + 1).toString() ? 'bg-gold-500/10 text-gold-700 dark:text-gold-400 font-bold' : 'hover:bg-luxury-50 dark:hover:bg-luxury-800 text-luxury-700 dark:text-luxury-200'}`}
                                        >
                                          {j + 1}
                                        </button>
                                      ))}
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : questions[step - 2].custom && questions[step - 2].id === 'pets' ? (
                <div className="space-y-6 text-left" dir={isAr ? 'rtl' : 'ltr'}>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, has_pets: 'yes' }))}
                      className={`p-4 rounded-xl font-bold transition-all border text-center text-lg ${preferences['has_pets'] === 'yes' ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400 shadow-md transform scale-105' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:border-gold-300'}`}
                    >
                      {isAr ? 'نعم' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, has_pets: 'no', pet_types: [], pet_type_other: '' }))}
                      className={`p-4 rounded-xl font-bold transition-all border text-center text-lg ${preferences['has_pets'] === 'no' ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400 shadow-md transform scale-105' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:border-gold-300'}`}
                    >
                      {isAr ? 'لا' : 'No'}
                    </button>
                  </div>
                  
                  {preferences['has_pets'] === 'yes' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <label className="block text-sm font-bold text-luxury-900 dark:text-luxury-100 mb-3">
                        {isAr ? 'ما هي الحيوانات الأليفة التي تمتلكها؟ (يمكنك اختيار أكثر من واحد)' : 'What kind of pets do you have? (You can select multiple)'}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                        {[
                          { val: 'cats', label: isAr ? 'قطط' : 'Cats' },
                          { val: 'dogs', label: isAr ? 'كلاب' : 'Dogs' },
                          { val: 'birds', label: isAr ? 'طيور' : 'Birds' },
                          { val: 'fish', label: isAr ? 'أسماك' : 'Fish' },
                          { val: 'hamster', label: isAr ? 'هامستر' : 'Hamster' },
                          { val: 'turtles', label: isAr ? 'سلاحف' : 'Turtles' },
                          { val: 'rabbits', label: isAr ? 'أرانب' : 'Rabbits' },
                          { val: 'reptiles', label: isAr ? 'زواحف' : 'Reptiles' },
                          { val: 'other', label: isAr ? 'أخرى' : 'Other' }
                        ].map(opt => {
                          const isSelected = (preferences['pet_types'] || []).includes(opt.val);
                          return (
                          <button
                            key={opt.val}
                            onClick={() => {
                              setPreferences(prev => {
                                const currentTypes = prev['pet_types'] || [];
                                const newTypes = currentTypes.includes(opt.val) 
                                  ? currentTypes.filter((t: string) => t !== opt.val)
                                  : [...currentTypes, opt.val];
                                return { ...prev, pet_types: newTypes };
                              });
                            }}
                            className={`p-3 rounded-xl font-bold transition-all border text-center text-sm ${isSelected ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400 shadow-md' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:border-gold-300'}`}
                          >
                            {opt.label}
                          </button>
                        )})}
                      </div>
                      
                      {(preferences['pet_types'] || []).includes('other') && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <input 
                            type="text"
                            value={preferences['pet_type_other'] || ''}
                            onChange={(e) => setPreferences(prev => ({ ...prev, pet_type_other: e.target.value }))}
                            placeholder={isAr ? 'اكتب نوع الحيوان هنا...' : 'Type animal kind here...'}
                            className="w-full bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left" dir={isAr ? 'rtl' : 'ltr'}>
                  {questions[step - 2].options?.map((opt: any) => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setPreferences(prev => ({ ...prev, [questions[step - 2].id]: opt.val }));
                      }}
                      className={`p-4 rounded-xl font-bold text-sm md:text-base transition-all border text-center flex flex-col items-center gap-3 overflow-hidden ${preferences[questions[step - 2].id] === opt.val ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400 shadow-md transform scale-105' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:border-gold-300'}`}
                    >
                      {opt.img && (
                        <div className="w-full h-32 rounded-lg overflow-hidden shrink-0 relative">
                          <img src={opt.img} alt={opt.label} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                          {opt.colors && (
                            <div className="absolute bottom-2 right-2 flex gap-1 bg-white/80 dark:bg-black/80 p-1.5 rounded-full backdrop-blur-sm">
                              {opt.colors.map((color: string, i: number) => (
                                <div key={i} className="w-4 h-4 rounded-full shadow-sm border border-black/10" style={{ backgroundColor: color }} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {opt.optionIcon && (
                        <div className="w-16 h-16 rounded-full bg-luxury-50 dark:bg-luxury-800 flex items-center justify-center shrink-0 mb-2">
                          {React.createElement(opt.optionIcon, { size: 32, className: "text-luxury-500 dark:text-luxury-400" })}
                        </div>
                      )}
                      <span className="mt-auto w-full">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {questions[step - 2].hasPreferNotToSay && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => {
                      setPreferences(prev => ({ ...prev, [questions[step - 2].id]: 'prefer_not_to_say' }));
                    }}
                    className={`py-2 px-6 rounded-full text-sm font-medium transition-colors border ${
                      preferences[questions[step - 2].id] === 'prefer_not_to_say'
                        ? 'bg-gold-500/10 border-gold-500 text-gold-700 dark:text-gold-400'
                        : 'bg-transparent border-luxury-200 dark:border-luxury-800 text-luxury-500 dark:text-luxury-400 hover:bg-luxury-50 dark:hover:bg-luxury-800'
                    }`}
                  >
                    {isAr ? 'أفضل عدم الإجابة' : 'Prefer not to say'}
                  </button>
                </div>
              )}

              <div className="flex justify-center mt-12">
                <button 
                  onClick={handleNext} 
                  disabled={
                    questions[step - 2].custom && questions[step - 2].id === 'children_details'
                      ? (!preferences['exact_children_count'] || Array.from({ length: parseInt(preferences['exact_children_count'] || '0') }).some((_, i) => !preferences[`child_${i}_gender`] || !preferences[`child_${i}_age`]))
                      : questions[step - 2].custom && questions[step - 2].id === 'pets'
                      ? (!preferences['has_pets'] || (preferences['has_pets'] === 'yes' && (!(preferences['pet_types']?.length > 0) || (preferences['pet_types'].includes('other') && !preferences['pet_type_other']))))
                      : !preferences[questions[step - 2].id]
                  }
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    (questions[step - 2].custom && questions[step - 2].id === 'children_details'
                      ? (!preferences['exact_children_count'] || Array.from({ length: parseInt(preferences['exact_children_count'] || '0') }).some((_, i) => !preferences[`child_${i}_gender`] || !preferences[`child_${i}_age`]))
                      : questions[step - 2].custom && questions[step - 2].id === 'pets'
                      ? (!preferences['has_pets'] || (preferences['has_pets'] === 'yes' && (!(preferences['pet_types']?.length > 0) || (preferences['pet_types'].includes('other') && !preferences['pet_type_other']))))
                      : !preferences[questions[step - 2].id])
                      ? 'bg-luxury-200 dark:bg-luxury-800 text-luxury-400 dark:text-luxury-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-gold-500 to-gold-400 text-luxury-900 hover:scale-105'
                  }`}
                >
                  {step === questions.length + 1 ? <Check size={24} /> : (isAr ? <ArrowLeft size={24} /> : <ArrowRight size={24} />)}
                </button>
              </div>

              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => setShowSkipConfirm(true)}
                  className="text-luxury-500 hover:text-luxury-800 dark:text-luxury-400 dark:hover:text-luxury-200 text-sm font-bold underline decoration-luxury-300 dark:decoration-luxury-700 underline-offset-4 transition-colors"
                >
                  {isAr ? 'تخطي الاستبيان والدخول مباشرة' : 'Skip quiz and enter directly'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Skip Confirmation Modal */}
      <AnimatePresence>
        {showSkipConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-luxury-950/60 backdrop-blur-sm"
              onClick={() => setShowSkipConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-luxury-900 p-8 rounded-3xl max-w-md w-full relative z-10 border border-luxury-200 dark:border-luxury-800 shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-6 text-gold-600 dark:text-gold-400">
                <Sparkles size={32} />
              </div>
              <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-4">
                {isAr ? 'هل أنت متأكد من تخطي الاستبيان؟' : 'Are you sure you want to skip?'}
              </h3>
              <p className="text-luxury-600 dark:text-luxury-400 mb-8 leading-relaxed text-sm">
                {isAr 
                  ? 'هذا الاستبيان القصير مصمم خصيصاً لمساعدة مصممينا على فهم ذوقك واحتياجاتك بدقة لتقديم أفضل تجربة تصميم تناسبك.' 
                  : 'This short quiz is specially designed to help our designers accurately understand your taste and needs to provide the best design experience.'}
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowSkipConfirm(false)}
                  className="w-full py-3.5 px-4 rounded-xl font-bold transition-all bg-gradient-to-r from-gold-500 to-gold-400 text-luxury-900 hover:scale-[1.02] shadow-md"
                >
                  {isAr ? 'العودة للاستبيان (موصى به)' : 'Return to Quiz (Recommended)'}
                </button>
                <button 
                  onClick={handleSkipConfirm}
                  className="w-full py-3.5 px-4 rounded-xl font-bold transition-all border border-luxury-200 dark:border-luxury-700 bg-white dark:bg-luxury-800 text-luxury-600 dark:text-luxury-300 hover:bg-luxury-50 dark:hover:bg-luxury-700"
                >
                  {isAr ? 'تخطي على أي حال' : 'Skip Anyway'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
