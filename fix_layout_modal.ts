import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add states for login
const stateTarget = `  const [showGuestLockModal, setShowGuestLockModal] = useState(false);`;
const stateReplacement = `  const [showGuestLockModal, setShowGuestLockModal] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  const handleLoginSubmit = () => {
    if (!loginInput.trim()) return;
    setLoginMethod(loginInput.includes('@') ? 'email' : 'phone');
    setShowOTP(true);
  };

  const completeLogin = () => {
    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      if (!client) return prev;
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            profile: {
              ...client.profile,
              isGuest: false
            }
          }
        }
      };
    });
    setShowGuestLockModal(false);
    setShowOTP(false);
    setLoginInput('');
    setOtpCode('');
  };
`;
content = content.replace(stateTarget, stateReplacement);

// 2. Add GoogleIcon and AppleIcon if missing (since we need them for the UI)
const iconsTarget = `import { useAppContext } from '../App';`;
const iconsReplacement = `import { useAppContext } from '../App';

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
);`;
if (!content.includes('const GoogleIcon = () => (')) {
  content = content.replace(iconsTarget, iconsReplacement);
}

// 3. Replace the modal content
const modalTarget = `              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mb-4">
                  <Lock size={32} className="text-gold-600 dark:text-gold-400" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                  {isAr ? 'ميزة مقفلة للضيوف' : 'Feature Locked for Guests'}
                </h3>
                <p className="text-luxury-600 dark:text-luxury-400">
                  {isAr 
                    ? 'هذه الميزة متاحة فقط للعملاء المسجلين. يرجى تسجيل الدخول أو إنشاء حساب لفتح جميع ميزات لوحة التحكم.' 
                    : 'This feature is only available for registered clients. Please sign in or create an account to unlock all dashboard features.'}
                </p>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setShowGuestLockModal(false);
                    setRole('GUEST'); // This takes them to Landing (Login Screen)
                  }}
                  className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-white rounded-xl font-bold shadow-md hover:scale-[1.02] transition-all"
                >
                  {isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Log In / Sign Up'}
                </button>
                <button 
                  onClick={() => setShowGuestLockModal(false)}
                  className="w-full py-4 bg-luxury-100 dark:bg-luxury-800 text-luxury-900 dark:text-luxury-50 rounded-xl font-bold hover:scale-[1.02] transition-all"
                >
                  {isAr ? 'العودة لاحقاً' : 'Cancel'}
                </button>
              </div>`;

const modalReplacement = `              {!showOTP ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">
                      {isAr ? 'تسجيل الدخول' : 'Sign In'}
                    </h2>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm">
                      {isAr ? 'لفتح جميع ميزات لوحة التحكم' : 'To unlock all dashboard features'}
                    </p>
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
                      onClick={completeLogin} 
                      className="w-16 h-16 rounded-full flex items-center justify-center border border-luxury-200 dark:border-luxury-800 bg-white dark:bg-luxury-900 hover:border-gold-300 dark:hover:border-gold-700 transition-all shadow-sm hover:scale-105"
                      title={isAr ? 'جوجل' : 'Google'}
                    >
                      <GoogleIcon />
                    </button>
                    <button 
                      onClick={completeLogin} 
                      className="w-16 h-16 rounded-full flex items-center justify-center border border-luxury-200 dark:border-luxury-800 bg-white dark:bg-luxury-900 hover:border-gold-300 dark:hover:border-gold-700 transition-all shadow-sm hover:scale-105"
                      title={isAr ? 'أبل' : 'Apple'}
                    >
                      <AppleIcon />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
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
                      onClick={completeLogin}
                      disabled={otpCode.length < 4}
                      className={\`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg \${
                        otpCode.length < 4
                          ? 'bg-luxury-200 dark:bg-luxury-800 text-luxury-400 cursor-not-allowed'
                          : 'bg-gold-600 text-white hover:scale-110 hover:shadow-gold-500/20'
                      }\`}
                    >
                      <Check size={24} />
                    </button>
                  </div>
                </>
              )}`;

content = content.replace(modalTarget, modalReplacement);

fs.writeFileSync(path, content);
console.log('Successfully updated modal with Login UI in Layout.tsx');
