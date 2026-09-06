import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ExternalLink, Trash2, Send, Link as LinkIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './UI';
import { useAppContext } from '../App';
import { PinterestReference } from '../types';

interface PinterestReferencesProps {
  onClose: () => void;
}

export const PinterestReferences: React.FC<PinterestReferencesProps> = ({ onClose }) => {
  const { t, lang, globalState, setGlobalState, role } = useAppContext();
  const isAr = lang === 'ar';
  const activeClient = globalState.clients[globalState.activeClientId];
  const references = activeClient.pinterestReferences || [];

  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Clipboard Detection State
  const [detectedUrl, setDetectedUrl] = useState<string | null>(null);
  const [ignoredUrls, setIgnoredUrls] = useState<Set<string>>(new Set());
  const [wizardStep, setWizardStep] = useState<number>(0);

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        if (!navigator.clipboard || !navigator.clipboard.readText) return;
        const text = await navigator.clipboard.readText();
        const lowerText = text.toLowerCase();
        if (lowerText && (lowerText.includes('pinterest.com') || lowerText.includes('pin.it')) && lowerText.startsWith('http')) {
          if (!ignoredUrls.has(text) && !references.some(r => r.url === text)) {
            setDetectedUrl(text);
            setWizardStep(1);
            setNewUrl(text);
            setNewCategory('');
            setNewNote('');
          }
        }
      } catch (err) {
        // Silently ignore clipboard errors
      }
    };

    checkClipboard();
    window.addEventListener('focus', checkClipboard);
    return () => window.removeEventListener('focus', checkClipboard);
  }, [ignoredUrls, references]);

  const categories = [
    isAr ? 'الصالة' : 'Living Room',
    isAr ? 'المطبخ' : 'Kitchen',
    isAr ? 'غرفة النوم' : 'Bedroom',
    isAr ? 'غرفة الطعام' : 'Dining Room',
    isAr ? 'الحمام' : 'Bathroom',
    isAr ? 'المدخل' : 'Entrance',
    isAr ? 'أخرى' : 'Other'
  ];

  const getCategoryKeyword = (cat: string) => {
    if (!cat) return '';
    if (cat.includes('صالة') || cat.includes('Living')) return 'Living Room';
    if (cat.includes('مطبخ') || cat.includes('Kitchen')) return 'Kitchen';
    if (cat.includes('نوم') || cat.includes('Bedroom')) return 'Bedroom';
    if (cat.includes('طعام') || cat.includes('Dining')) return 'Dining Room';
    if (cat.includes('حمام') || cat.includes('Bathroom')) return 'Bathroom';
    if (cat.includes('مدخل') || cat.includes('Entrance')) return 'Entrance';
    return '';
  };

  const getClientStyleKeyword = () => {
    const prefStyle = activeClient.profile.designPreferences?.style;
    if (prefStyle) {
      if (prefStyle === 'modern') return 'Modern Minimalist';
      if (prefStyle === 'classic') return 'Classic Luxury';
      if (prefStyle === 'neoclassic') return 'Neo-Classic';
      if (prefStyle === 'bohemian') return 'Bohemian';
    }
    
    // Fallback to the string in profile.style
    const rawStyle = activeClient.profile.style || '';
    if (rawStyle.toLowerCase().includes('modern')) return 'Modern';
    if (rawStyle.toLowerCase().includes('classic')) return 'Classic';
    if (rawStyle.toLowerCase().includes('minimal')) return 'Minimalist';
    
    return 'Luxury Interior'; // Ultimate fallback
  };

  const getPinterestSearchUrl = () => {
    const styleKeyword = getClientStyleKeyword();
    const categoryKeyword = getCategoryKeyword(newCategory);
    
    let searchQuery = styleKeyword;
    if (categoryKeyword) {
      searchQuery = `${styleKeyword} ${categoryKeyword}`;
    }
    
    return `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery)}&rs=typed`;
  };

  const handleSave = () => {
    setError('');
    setSuccessMsg('');

    if (!newCategory) {
      setError(isAr ? 'الرجاء اختيار التصنيف أولاً.' : 'Please select a category first.');
      return;
    }

    if (!newUrl.trim()) {
      setError(isAr ? 'الرجاء إدخال رابط.' : 'Please enter a URL.');
      return;
    }

    const lowerUrl = newUrl.toLowerCase();
    if (!lowerUrl.includes('pinterest.com') && !lowerUrl.includes('pin.it')) {
      setError(isAr ? 'الرجاء إدخال رابط صحيح من موقع Pinterest.' : 'Please enter a valid Pinterest URL.');
      return;
    }

    if (references.some(ref => ref.url === newUrl.trim())) {
      setError(isAr ? 'تمت إضافة هذا الرابط مسبقاً.' : 'This link has already been added.');
      return;
    }

    const newRef: PinterestReference = {
      id: `pin_${Date.now()}`,
      url: newUrl.trim(),
      category: newCategory,
      note: newNote.trim(),
      dateAdded: new Date().toISOString()
    };

    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          pinterestReferences: [...references, newRef]
        }
      }
    }));

    setNewUrl('');
    setNewCategory('');
    setNewNote('');
    setSuccessMsg(isAr ? 'تم حفظ الرابط بنجاح.' : 'Link saved successfully.');
    
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  const handleRemove = (id: string) => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          pinterestReferences: references.filter(ref => ref.id !== id)
        }
      }
    }));
  };

  const handleSendToDesigner = () => {
    if (references.length === 0) return;

    let messageText = isAr ? 'مرحباً، قمت بجمع بعض الأفكار من Pinterest:\n\n' : 'Hello, I have collected some ideas from Pinterest:\n\n';
    
    references.forEach((ref, index) => {
      messageText += `${index + 1}. ${ref.category ? `[${ref.category}] ` : ''}${ref.url}\n`;
      if (ref.note) {
        messageText += `   ${isAr ? 'ملاحظة:' : 'Note:'} ${ref.note}\n`;
      }
      messageText += '\n';
    });

    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: 'CLIENT' as const,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          chatHistory: [...prev.clients[prev.activeClientId].chatHistory, newMessage],
          hasUnreadMessages: true // since client sends to admin, admin will see it, but here we can just append
        }
      }
    }));

    setSuccessMsg(isAr ? 'تم إرسال المراجع للمصممة بنجاح.' : 'References sent to designer successfully.');
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  const handleSaveDetected = () => {
    const newRef: PinterestReference = {
      id: `pin_${Date.now()}`,
      url: detectedUrl || newUrl,
      category: newCategory || undefined,
      note: newNote || undefined,
      dateAdded: new Date().toISOString(),
    };
    
    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            pinterestReferences: [...(client.pinterestReferences || []), newRef]
          }
        }
      };
    });
    
    setIgnoredUrls(prev => new Set(prev).add(detectedUrl || newUrl));
    setDetectedUrl(null);
    setWizardStep(0);
    setNewUrl('');
    setNewCategory('');
    setNewNote('');
    setSuccessMsg(isAr ? 'تم حفظ الرابط بنجاح!' : 'Link saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-luxury-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4" onClick={(e) => { e.stopPropagation(); onClose(); }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-luxury-900 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-luxury-200 dark:border-luxury-800 relative"
          dir={isAr ? 'rtl' : 'ltr'}
          onClick={(e) => e.stopPropagation()}
        >
        
        {detectedUrl && wizardStep > 0 && (
          <div className="absolute inset-0 z-50 bg-white/95 dark:bg-luxury-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-3xl">
            <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/50 rounded-full flex items-center justify-center text-gold-600 dark:text-gold-400 mb-6">
              <LinkIcon size={32} />
            </div>
            
            {wizardStep === 1 && (
              <div className="max-w-md animate-fade-in">
                <h3 className="text-2xl font-serif font-bold text-luxury-900 dark:text-luxury-50 mb-4">
                  {isAr ? 'لقد تم اكتشاف رابط' : 'Link Detected'}
                </h3>
                <p className="text-luxury-600 dark:text-luxury-400 mb-8 leading-relaxed">
                  {isAr ? 'هل تود إضافة هذا الرابط إلى المصادر التي سوف ترسل إلى المصممة؟' : 'Would you like to add this link to the resources that will be sent to the designer?'}
                  <span className="block mt-4 p-3 text-sm font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl truncate border border-blue-100 dark:border-blue-800">{detectedUrl}</span>
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => {
                    setIgnoredUrls(prev => new Set(prev).add(detectedUrl));
                    setDetectedUrl(null);
                    setWizardStep(0);
                  }} className="flex-1 py-3">
                    {isAr ? 'لا، شكراً' : 'No, thanks'}
                  </Button>
                  <Button variant="primary" onClick={() => setWizardStep(2)} className="flex-1 py-3 shadow-lg shadow-gold-500/20">
                    {isAr ? 'نعم، أضف الرابط' : 'Yes, add link'}
                  </Button>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="max-w-md w-full animate-fade-in text-left" dir={isAr ? 'rtl' : 'ltr'}>
                <h3 className="text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-6 text-center">
                  {isAr ? 'هذا الرابط ما هو نوعه؟' : 'What is the type of this link?'}
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {categories.map((cat, i) => (
                    <button 
                      key={i} 
                      onClick={() => { setNewCategory(cat); setWizardStep(3); }}
                      className="p-3.5 rounded-xl border border-luxury-200 dark:border-luxury-800 hover:border-gold-500 hover:bg-gold-50 dark:hover:bg-gold-900/20 text-sm font-bold transition-all text-luxury-900 dark:text-luxury-100"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="max-w-md w-full animate-fade-in text-left" dir={isAr ? 'rtl' : 'ltr'}>
                <h3 className="text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-6 text-center">
                  {isAr ? 'ما الذي أعجبك في هذا التصميم؟' : 'What did you like about this design?'}
                </h3>
                <textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={isAr ? 'أعجبني لون الخشب والإضاءة...' : 'I liked the wood color...'}
                  className="w-full p-4 rounded-xl border border-luxury-300 dark:border-luxury-700 bg-white dark:bg-luxury-900 focus:border-gold-500 focus:outline-none h-32 resize-none mb-6 text-luxury-900 dark:text-luxury-50 shadow-inner"
                  autoFocus
                />
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => {
                    handleSaveDetected();
                  }} className="flex-1 py-3">
                    {isAr ? 'تخطي وحفظ' : 'Skip & Save'}
                  </Button>
                  <Button variant="primary" onClick={() => {
                    handleSaveDetected();
                  }} className="flex-1 py-3 shadow-lg shadow-gold-500/20" disabled={!newNote.trim()}>
                    {isAr ? 'حفظ الملاحظة' : 'Save Note'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b border-luxury-100 dark:border-luxury-800">
          <div>
            <h2 className="text-2xl font-serif font-bold text-luxury-900 dark:text-luxury-50">
              {isAr ? 'مراجع Pinterest الخاصة بك' : 'Your Pinterest References'}
            </h2>
            <p className="text-luxury-600 dark:text-luxury-400 mt-1">
              {isAr ? 'احفظ روابط الصور واللوحات التي تلهمك لتشاركها مع المصممة.' : 'Save image links and boards that inspire you to share with the designer.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 bg-luxury-50 dark:bg-luxury-950 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <button 
              onClick={(e) => {
                if (!newCategory) {
                  e.preventDefault();
                  setError(isAr ? 'الرجاء اختيار التصنيف أولاً للبحث في Pinterest.' : 'Please select a category first to search on Pinterest.');
                  setTimeout(() => setError(''), 3000);
                  return;
                }
                window.open(getPinterestSearchUrl(), '_blank', 'noopener,noreferrer');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#E60023] text-white rounded-xl font-bold hover:bg-[#ad081b] transition-colors"
            >
              <ExternalLink size={18} />
              {isAr ? 'فتح Pinterest للبحث' : 'Open Pinterest Search'}
            </button>

            <div className="bg-luxury-50 dark:bg-luxury-950 p-5 rounded-2xl border border-luxury-200 dark:border-luxury-800 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-luxury-900 dark:text-luxury-100 mb-1.5">
                  {isAr ? 'التصنيف' : 'Category'}
                </label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-luxury-300 dark:border-luxury-700 bg-white dark:bg-luxury-900 text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500"
                >
                  <option value="" disabled>{isAr ? 'اختر تصنيفاً' : 'Select a category'}</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-luxury-900 dark:text-luxury-100 mb-1.5">
                  {isAr ? 'رابط Pinterest' : 'Pinterest URL'}
                </label>
                <input 
                  type="text" 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.pinterest.com/pin/..." 
                  className="w-full px-4 py-3 rounded-xl border border-luxury-300 dark:border-luxury-700 bg-white dark:bg-luxury-900 text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-luxury-900 dark:text-luxury-100 mb-1.5">
                  {isAr ? 'ما الذي أعجبك في هذا التصميم؟ (اختياري)' : 'What did you like about this design? (Optional)'}
                </label>
                <textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={isAr ? 'أعجبني لون الخشب والإضاءة المخفية...' : 'I liked the wood color and hidden lighting...'}
                  className="w-full px-4 py-3 rounded-xl border border-luxury-300 dark:border-luxury-700 bg-white dark:bg-luxury-900 text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 resize-none h-24"
                />
              </div>

              <Button variant="primary" onClick={handleSave} className="w-full py-3 mt-2">
                <Plus size={18} className={isAr ? "ml-2 inline" : "mr-2 inline"} />
                {isAr ? 'حفظ الرابط' : 'Save Link'}
              </Button>

              {error && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium mt-1">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-500 text-sm font-medium mt-1">
                  <CheckCircle size={16} />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-2/3 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-luxury-900 dark:text-luxury-100">
                {isAr ? `${references.length} روابط محفوظة` : `${references.length} Saved Links`}
              </h3>
              {references.length > 0 && (
                <Button variant="outline" onClick={handleSendToDesigner} className="py-2 text-sm">
                  <Send size={16} className={isAr ? "ml-2 inline" : "mr-2 inline"} />
                  {isAr ? 'إرسال للمصممة' : 'Send to Designer'}
                </Button>
              )}
            </div>

            {references.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-luxury-200 dark:border-luxury-800 rounded-2xl">
                <div className="w-16 h-16 bg-luxury-100 dark:bg-luxury-950 rounded-full flex items-center justify-center text-luxury-400 mb-4">
                  <LinkIcon size={24} />
                </div>
                <p className="text-luxury-500 dark:text-luxury-400 font-medium max-w-sm">
                  {isAr ? 'لم تقم بحفظ أي روابط حتى الآن. تصفح Pinterest والصق الروابط هنا لتجميع أفكارك.' : 'You haven\'t saved any links yet. Browse Pinterest and paste links here to gather your ideas.'}
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                {references.map((ref) => (
                  <div key={ref.id} className="bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {ref.category && (
                            <span className="text-xs font-bold px-2 py-1 bg-gold-100 dark:bg-gold-900/40 text-gold-800 dark:text-gold-300 rounded-md whitespace-nowrap">
                              {ref.category}
                            </span>
                          )}
                          <a 
                            href={ref.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate block"
                          >
                            {ref.url}
                          </a>
                        </div>
                        {ref.note && (
                          <p className="text-sm text-luxury-700 dark:text-luxury-300 mt-2 bg-luxury-50 dark:bg-luxury-950 p-3 rounded-lg border border-luxury-100 dark:border-luxury-800">
                            <span className="font-bold block mb-1">{isAr ? 'ملاحظة:' : 'Note:'}</span>
                            {ref.note}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <a 
                          href={ref.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-luxury-500 hover:text-blue-600 dark:hover:text-blue-400 bg-luxury-50 dark:bg-luxury-950 rounded-lg transition-colors"
                          title={isAr ? 'فتح الرابط' : 'Open Link'}
                        >
                          <ExternalLink size={18} />
                        </a>
                        <button 
                          onClick={() => handleRemove(ref.id)}
                          className="p-2 text-luxury-500 hover:text-red-600 dark:hover:text-red-400 bg-luxury-50 dark:bg-luxury-950 rounded-lg transition-colors"
                          title={isAr ? 'إزالة' : 'Remove'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
    </AnimatePresence>
  );
};
