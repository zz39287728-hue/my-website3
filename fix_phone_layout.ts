import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// Ensure import is there
if (!content.includes('countryCodes')) {
  content = content.replace(
    "import { X, CheckCircle2 } from 'lucide-react';",
    "import { X, CheckCircle2 } from 'lucide-react';\nimport { countryCodes } from '../lib/countryCodes';"
  );
}

const targetInputs = `                    <div>
                      <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1.5">
                        {isAr ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      <div className="flex gap-2" dir="ltr">
                        <select
                          value={guestCountryCode}
                          onChange={(e) => setGuestCountryCode(e.target.value)}
                          className="w-28 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-2 py-3.5 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        >
                          <option value="+973">+973 (BH)</option>
                          <option value="+966">+966 (SA)</option>
                          <option value="+971">+971 (AE)</option>
                          <option value="+965">+965 (KW)</option>
                          <option value="+974">+974 (QA)</option>
                          <option value="+968">+968 (OM)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+1">+1 (US)</option>
                          <option value="+20">+20 (EG)</option>
                          <option value="+962">+962 (JO)</option>
                          <option value="+961">+961 (LB)</option>
                        </select>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="flex-1 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3.5 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                          placeholder="XXXX XXXX"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1.5">
                        {isAr ? 'تأكيد رقم الهاتف' : 'Confirm Phone Number'}
                      </label>
                      <div className="flex gap-2" dir="ltr">
                        <div className="w-28 bg-luxury-100 dark:bg-luxury-900/50 border border-luxury-200 dark:border-luxury-800 rounded-xl px-2 py-3.5 font-medium text-luxury-500 dark:text-luxury-400 flex items-center justify-center">
                          {guestCountryCode}
                        </div>
                        <input
                          type="tel"
                          value={guestPhoneConfirm}
                          onChange={(e) => setGuestPhoneConfirm(e.target.value)}
                          className="flex-1 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-4 py-3.5 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                          placeholder="XXXX XXXX"
                        />
                      </div>
                    </div>`;

const newInputs = `                    <div>
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

content = content.replace(targetInputs, newInputs);
fs.writeFileSync(path, content);
