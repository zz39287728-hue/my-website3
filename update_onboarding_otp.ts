import fs from 'fs';

const path = 'src/components/Onboarding.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add states
const stateTarget = `  // Start with default or empty preferences
  const [preferences, setPreferences] = useState<Record<string, string>>({});`;

const stateReplacement = `  // Start with default or empty preferences
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  const [loginInput, setLoginInput] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');`;

content = content.replace(stateTarget, stateReplacement);

// 2. Adjust handleBack
const handleBackTarget = `  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };`;

const handleBackReplacement = `  const handleBack = () => {
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
  };`;

content = content.replace(handleBackTarget, handleBackReplacement);

// 3. Replace step === 1 block
const step1Regex = /\{\s*step === 1 && \(\s*<motion\.div[\s\S]*?key="step-1"[\s\S]*?<\/motion\.div>\s*\)\}/;

const step1Replacement = `{step === 1 && (
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
                      placeholder={isAr ? 'تسجيل الدخول عبر الهاتف أو البريد الإلكتروني' : 'Log in via Phone or Email'}
                      className="w-full bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-4 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
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
                    onClick={() => setStep(2)}
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
                        ? \`تم إرسال رمز التحقق إلى \${loginInput} عبر \${loginMethod === 'phone' ? 'رسالة نصية / واتساب' : 'البريد الإلكتروني'}\`
                        : \`Verification code sent to \${loginInput} via \${loginMethod === 'phone' ? 'SMS / WhatsApp' : 'Email'}\`}
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
                      className={\`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg \${
                        otpCode.length < 4
                          ? 'bg-luxury-200 dark:bg-luxury-800 text-luxury-400 dark:text-luxury-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-gold-500 to-gold-400 text-luxury-900 hover:scale-105'
                      }\`}
                    >
                      {isAr ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}`;

content = content.replace(step1Regex, step1Replacement);

fs.writeFileSync(path, content);
console.log('OTP screen added successfully');
