import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add state
const stateTarget = `  const [guestCountryCode, setGuestCountryCode] = useState('+973');`;
const stateReplacement = `  const [guestCountryCode, setGuestCountryCode] = useState('+973');\n  const [lastValidCountryCode, setLastValidCountryCode] = useState('+973');`;
content = content.replace(stateTarget, stateReplacement);

// 2. Update onBlur
const blurTarget = `                            onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}`;
const blurReplacement = `                            onBlur={() => {
                              setTimeout(() => setShowCountryDropdown(false), 200);
                              const isValid = countryCodes.some(c => c.dialCode === guestCountryCode);
                              if (!guestCountryCode || guestCountryCode === '+' || !isValid) {
                                setGuestCountryCode(lastValidCountryCode);
                              } else {
                                setLastValidCountryCode(guestCountryCode);
                              }
                            }}`;
content = content.replace(blurTarget, blurReplacement);

// 3. Update onMouseDown
const clickTarget = `                                  onMouseDown={() => {
                                    setGuestCountryCode(c.dialCode);
                                    setShowCountryDropdown(false);
                                  }}`;
const clickReplacement = `                                  onMouseDown={() => {
                                    setGuestCountryCode(c.dialCode);
                                    setLastValidCountryCode(c.dialCode);
                                    setShowCountryDropdown(false);
                                  }}`;
content = content.replace(clickTarget, clickReplacement);

fs.writeFileSync(path, content);
