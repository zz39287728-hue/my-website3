import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { askZain } from '../services/aiService';

export const ZainAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Welcome to ZAINTERIOR. I am Zain, your architectural advisor. How may I assist you with your project today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    
    const response = await askZain(userMsg);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full shadow-[0_0_20px_rgba(197,156,106,0.5)] flex items-center justify-center z-50 text-white dark:text-luxury-950 border border-gold-300/50"
      >
        <Sparkles size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-80 md:w-96 h-[500px] bg-gradient-to-b from-white to-luxury-50 dark:from-luxury-900 dark:to-luxury-950 border border-luxury-200 dark:border-luxury-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="p-4 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md border-b border-luxury-200 dark:border-luxury-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="text-gold-500" size={20} />
                <h3 className="font-serif bg-gradient-to-r from-gold-600 to-gold-400 dark:from-gold-400 dark:to-gold-600 text-transparent bg-clip-text font-bold">Zain AI Advisor</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm shadow-md font-medium ${msg.role === 'user' ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-white dark:text-luxury-950 rounded-br-none' : 'bg-luxury-100 dark:bg-luxury-800 border border-luxury-200 dark:border-luxury-700 text-luxury-900 dark:text-luxury-200 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-luxury-100 dark:bg-luxury-800 border border-luxury-200 dark:border-luxury-700 text-luxury-600 dark:text-luxury-400 p-3 rounded-xl rounded-bl-none text-sm flex gap-1 shadow-md">
                    <span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay: '0.2s'}}>.</span><span className="animate-bounce" style={{animationDelay: '0.4s'}}>.</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-luxury-200 dark:border-luxury-800 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about materials, lighting..."
                  className="flex-1 bg-luxury-50 dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-gold-500 text-luxury-900 dark:text-luxury-50 transition-colors shadow-inner"
                />
                <button onClick={handleSend} className="bg-gradient-to-r from-gold-500 to-gold-400 text-white dark:text-luxury-950 p-2 rounded-lg hover:from-gold-400 hover:to-gold-300 transition-all shadow-md">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
