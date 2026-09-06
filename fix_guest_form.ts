import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove guestPhoneConfirm state and add showCountryDropdown
content = content.replace(
  `  const [guestPhoneConfirm, setGuestPhoneConfirm] = useState('');\n  const [guestCountryCode, setGuestCountryCode] = useState('+973');`,
  `  const [guestCountryCode, setGuestCountryCode] = useState('+973');\n  const [showCountryDropdown, setShowCountryDropdown] = useState(false);`
);

// 2. Modify confirmGuestBooking
const confirmTarget = `  const confirmGuestBooking = () => {
    if (guestModalStep === 'phone') {
      if (!guestPhone || !guestPhoneConfirm) {
        setGuestPhoneError(isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
        return;
      }
      if (guestPhone !== guestPhoneConfirm) {
        setGuestPhoneError(isAr ? 'أرقام الهواتف غير متطابقة' : 'Phone numbers do not match');
        return;
      }
      setGuestPhoneError('');`;

const confirmReplacement = `  const confirmGuestBooking = () => {
    if (guestModalStep === 'phone') {
      if (!guestPhone || !guestCountryCode) {
        setGuestPhoneError(isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
        return;
      }
      setGuestPhoneError('');`;

content = content.replace(confirmTarget, confirmReplacement);

// 3. Update UI
const uiTarget = `                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1.5">
                        {isAr ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      <div className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl flex items-center transition-colors focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500" dir="ltr">
                        <select
                          value={guestCountryCode}
                          onChange={(e) => setGuestCountryCode(e.target.value)}
                          className="bg-transparent pl-3 pr-2 py-3.5 outline-none text-luxury-900 dark:text-luxury-50 font-medium cursor-pointer w-[120px] shrink-0"
                        >
                          <option value="+973">+973 (BH)</option>
                          <option value="+966">+966 (SA)</option>
                          <option value="+971">+971 (AE)</option>
                          <option value="+965">+965 (KW)</option>
                          <option value="+974">+974 (QA)</option>
                          <option value="+968">+968 (OM)</option>
                          <option disabled>──────</option>
                          {countryCodes.map(c => (
                            <option key={c.code} value={c.dialCode}>{c.dialCode} ({c.code})</option>
                          ))}
                        </select>
                        <div className="h-6 w-px bg-luxury-200 dark:bg-luxury-800"></div>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="flex-1 bg-transparent px-4 py-3.5 outline-none text-luxury-900 dark:text-luxury-50 font-medium w-full"
                          placeholder="XXXX XXXX"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1.5">
                        {isAr ? 'تأكيد رقم الهاتف' : 'Confirm Phone Number'}
                      </label>
                      <div className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl flex items-center transition-colors focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500" dir="ltr">
                        <div className="pl-3 pr-2 py-3.5 font-medium text-luxury-500 dark:text-luxury-400 w-[120px] text-center shrink-0">
                          {guestCountryCode}
                        </div>
                        <div className="h-6 w-px bg-luxury-200 dark:bg-luxury-800"></div>
                        <input
                          type="tel"
                          value={guestPhoneConfirm}
                          onChange={(e) => setGuestPhoneConfirm(e.target.value)}
                          className="flex-1 bg-transparent px-4 py-3.5 outline-none text-luxury-900 dark:text-luxury-50 font-medium w-full"
                          placeholder="XXXX XXXX"
                        />
                      </div>
                    </div>`;

const uiReplacement = `                  <div className="space-y-5">
                    <div className="relative">
                      <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1.5">
                        {isAr ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      <div className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl flex items-center transition-colors focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500" dir="ltr">
                        <input
                          type="text"
                          value={guestCountryCode}
                          onChange={(e) => {
                            setGuestCountryCode(e.target.value);
                            setShowCountryDropdown(true);
                          }}
                          onFocus={() => setShowCountryDropdown(true)}
                          onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                          className="bg-transparent pl-4 pr-2 py-3.5 outline-none text-luxury-900 dark:text-luxury-50 font-medium w-[100px] shrink-0 text-center"
                          placeholder="+973"
                        />
                        <div className="h-6 w-px bg-luxury-200 dark:bg-luxury-800"></div>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="flex-1 bg-transparent px-4 py-3.5 outline-none text-luxury-900 dark:text-luxury-50 font-medium w-full"
                          placeholder="XXXX XXXX"
                        />
                      </div>
                      
                      {/* Country Code Dropdown */}
                      <AnimatePresence>
                        {showCountryDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute z-50 mt-2 w-[180px] left-0 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl shadow-xl max-h-[250px] overflow-y-auto"
                            dir="ltr"
                          >
                            <div className="p-1">
                              {countryCodes
                                .filter(c => c.dialCode.includes(guestCountryCode.replace('+', '')) || c.dialCode === guestCountryCode)
                                .map(c => (
                                <button
                                  key={c.code}
                                  onMouseDown={() => {
                                    setGuestCountryCode(c.dialCode);
                                    setShowCountryDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-luxury-700 dark:text-luxury-300 hover:bg-luxury-50 dark:hover:bg-luxury-800 rounded-lg transition-colors flex justify-between"
                                >
                                  <span className="font-medium text-luxury-900 dark:text-luxury-50">{c.dialCode}</span>
                                  <span className="text-luxury-500">{c.code}</span>
                                </button>
                              ))}
                              {countryCodes.filter(c => c.dialCode.includes(guestCountryCode.replace('+', '')) || c.dialCode === guestCountryCode).length === 0 && (
                                <div className="px-4 py-2 text-sm text-luxury-500 text-center">
                                  No results found
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>`;

content = content.replace(uiTarget, uiReplacement);
fs.writeFileSync(path, content);
