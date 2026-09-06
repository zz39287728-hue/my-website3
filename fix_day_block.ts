import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `              // Check if ANY existing booking is exactly on this day with ALL_DAY flag
              const hasAllDayBlock = blocks.some(b => b.time === 'ALL_DAY');
              
              const isFullyBlocked = isPastOrTooSoon || isWeekend || hasAllDayBlock;`;

const replacement = `              // Check if ANY existing booking is exactly on this day with ALL_DAY flag
              const allClientBookingsForDay = Object.values(globalState.clients)
                .flatMap(c => c.bookings || [])
                .filter(b => b.date === dateString && b.status !== 'Cancelled' && b.status !== 'Rejected');
              
              const allBlocksForDay = [
                ...blocks, // These are blockedSlots.filter(b => b.date === dateString)
                ...allClientBookingsForDay.map(b => ({
                  date: b.date,
                  time: b.time,
                  durationHours: b.durationHours
                }))
              ];

              const hasAllDayBlock = allBlocksForDay.some(b => b.time === 'ALL_DAY');

              let allSlotsBlocked = false;
              if (!hasAllDayBlock && !isPastOrTooSoon && !isWeekend) {
                allSlotsBlocked = timeSlots.every(time => {
                  const slotStart = parseTime(time);
                  const slotEnd = slotStart + 60; // Minimum duration to check is 1 hour
                  return allBlocksForDay.some(b => {
                    if (b.time === 'ALL_DAY') return true;
                    const bStart = parseTime(b.time);
                    const bDurationMins = (b.durationHours || 1) * 60;
                    const bEnd = bStart + bDurationMins;
                    // Check overlap including 1 hour (60 mins) buffer
                    return (slotStart < bEnd + 60) && (bStart < slotEnd + 60);
                  });
                });
              }
              
              const isFullyBlocked = isPastOrTooSoon || isWeekend || hasAllDayBlock || allSlotsBlocked;`;

content = content.replace(target, replacement);

fs.writeFileSync(path, content);
console.log('Fixed calendar day blocked logic.');
