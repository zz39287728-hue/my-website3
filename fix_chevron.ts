import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                      <div className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl flex items-center transition-colors focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500" dir="ltr">
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
                        <div className="h-6 w-px bg-luxury-200 dark:bg-luxury-800"></div>`;

const newStr = `                      <div className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl flex items-center transition-colors focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500" dir="ltr">
                        <div className="relative flex items-center shrink-0 w-[100px]">
                          <input
                            type="text"
                            value={guestCountryCode}
                            onChange={(e) => {
                              setGuestCountryCode(e.target.value);
                              setShowCountryDropdown(true);
                            }}
                            onFocus={() => setShowCountryDropdown(true)}
                            onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                            className="bg-transparent pl-2 pr-6 py-3.5 outline-none text-luxury-900 dark:text-luxury-50 font-medium w-full text-center"
                            placeholder="+973"
                          />
                          <ChevronDown size={14} className="absolute right-2.5 text-luxury-400 opacity-60 pointer-events-none" />
                        </div>
                        <div className="h-6 w-px bg-luxury-200 dark:bg-luxury-800"></div>`;

content = content.replace(targetStr, newStr);
fs.writeFileSync(path, content);
