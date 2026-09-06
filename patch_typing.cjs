const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

const oldTypingIndicator = `{/* Typing Indicator */}
          {isTyping && (
            <div className="flex flex-col relative items-start w-full">
              <div className="relative max-w-[85%] px-4 py-3 shadow-sm backdrop-blur-md bg-neutral-800/80 border border-neutral-700/50 text-neutral-400 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1.5 h-1.5 rounded-full bg-neutral-400"></motion.div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-neutral-400"></motion.div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-neutral-400"></motion.div>
              </div>
            </div>
          )}`;

const newTypingIndicator = `{/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                className="flex flex-col relative items-start w-full origin-bottom-left"
              >
                <div className="flex items-end gap-2">
                  {/* Subtle Profile Icon to match Telegram */}
                  <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700/50 flex items-center justify-center shadow-sm shrink-0">
                    {activeThread === 'SUPPORT' ? <Headphones size={12} className="text-luxury-400" /> : <Paintbrush size={12} className="text-luxury-400" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className="relative px-3 py-2.5 shadow-sm backdrop-blur-md bg-neutral-800/80 border border-neutral-700/50 text-neutral-400 rounded-2xl rounded-bl-sm flex items-center gap-1">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }} className="w-1.5 h-1.5 rounded-full bg-amber-500/80"></motion.div>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2, ease: "easeInOut" }} className="w-1.5 h-1.5 rounded-full bg-amber-500/80"></motion.div>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4, ease: "easeInOut" }} className="w-1.5 h-1.5 rounded-full bg-amber-500/80"></motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>`;

if (code.includes(oldTypingIndicator)) {
  code = code.replace(oldTypingIndicator, newTypingIndicator);
  fs.writeFileSync('src/pages/Communication.tsx', code);
  console.log("Typing indicator replaced successfully!");
} else {
  console.log("Could not find typing indicator code.");
}
