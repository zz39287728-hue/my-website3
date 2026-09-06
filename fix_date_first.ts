import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `                  <button 
                    key={time}
                    onClick={() => {
                      if (isBlocked) {
                        setBlockedError(isAr ? 'هذا الوقت غير متوفر لهذا اليوم.' : 'This time is not available for this day.');
                      } else {
                        setSelectedTime(time);
                        setBlockedError(null);
                      }
                    }}`;

const newStr = `                  <button 
                    key={time}
                    onClick={() => {
                      if (!selectedDate) {
                        setBlockedError(isAr ? 'يجب عليك أن تختار يومًا أولًا.' : 'You must select a date first.');
                        return;
                      }
                      if (isBlocked) {
                        setBlockedError(isAr ? 'هذا الوقت غير متوفر لهذا اليوم.' : 'This time is not available for this day.');
                      } else {
                        setSelectedTime(time);
                        setBlockedError(null);
                      }
                    }}`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(path, content);
