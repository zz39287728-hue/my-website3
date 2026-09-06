import { countryCodes } from "../lib/countryCodes";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { ViewModule } from '../types';
import { Send, Paperclip, Calendar as CalendarIcon, Clock, ChevronDown, ChevronRight, MapPin, Video, Building, X, Download, Check, ShoppingBag, ArrowRight, DollarSign, CheckCircle2, ShoppingCart, Phone, Sparkles, Paintbrush, Pencil } from 'lucide-react';
import { PinterestReferences } from '../components/PinterestReferences';

const compressImage = async (file: File, maxSizeMB: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize if too large
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        let quality = 0.8;
        const tryCompress = () => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob failed'));
              return;
            }
            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.2) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              quality -= 0.15;
              tryCompress();
            }
          }, 'image/jpeg', quality);
        };
        tryCompress();
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const Chat: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const chatHistory = activeClient.chatHistory;
  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<Array<{name: string, size: string, url: string, type: string}>>([]);
  const [attachmentError, setAttachmentError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAr = document.documentElement.dir === 'rtl';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, pendingAttachments, attachmentError]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentError('');
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    const newAttachments: Array<{name: string, size: string, url: string, type: string}> = [];
    let errorMsg = '';

    for (const file of files) {
      const isImage = file.type.startsWith('image/');
      
      if (!isImage && file.size > MAX_SIZE) {
        errorMsg += isAr ? `تم تخطي المستند ${file.name} (أكبر من 2MB). ` : `Skipped document ${file.name} (exceeds 2MB). `;
        continue;
      }

      let finalFile = file;

      if (isImage && file.size > MAX_SIZE) {
        try {
          finalFile = await compressImage(file, 2);
        } catch (err) {
          console.error('Compression failed', err);
          errorMsg += isAr ? `فشل ضغط الصورة ${file.name}. ` : `Compression failed for ${file.name}. `;
          continue;
        }
      }

      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve(evt.target?.result as string);
        reader.readAsDataURL(finalFile);
      });

      const sizeStr = (finalFile.size / 1024 / 1024).toFixed(2) + ' MB';
      newAttachments.push({
        name: finalFile.name,
        size: sizeStr,
        url,
        type: isImage ? 'image' : 'document'
      });
    }

    if (errorMsg) {
      setAttachmentError(errorMsg);
    }

    setPendingAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = () => {
    if (!input.trim() && pendingAttachments.length === 0) return;
    
    const newMessage = {
      id: `msg${Date.now()}`,
      sender: 'CLIENT' as const,
      text: input,
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          chatHistory: [...prev.clients[prev.activeClientId].chatHistory, newMessage]
        }
      }
    }));
    setInput('');
    setPendingAttachments([]);
  };

  const removePendingAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleActionClick = (msgId: string) => {
    setGlobalState(prev => {
      const activeClient = prev.clients[prev.activeClientId];
      const updatedHistory = activeClient.chatHistory.map(msg => {
        if (msg.id === msgId && msg.actionItem) {
          return {
            ...msg,
            actionItem: { ...msg.actionItem, completed: true }
          };
        }
        return msg;
      });
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...prev.clients[prev.activeClientId],
            chatHistory: updatedHistory
          }
        }
      };
    });
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col pb-4">
      {/* Lightbox / Modal for Image Preview */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <img src={selectedImage} alt="Preview" className="max-h-[80vh] w-auto max-w-full rounded-xl shadow-2xl object-contain" />
            <a 
              href={selectedImage} 
              download="attachment"
              className="mt-6 flex items-center gap-2 bg-white/10 text-white px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors shadow-lg backdrop-blur-md"
            >
              <Download size={18} />
              <span className="font-bold text-sm">{isAr ? 'تحميل الصورة' : 'Download Image'}</span>
            </a>
          </div>
        </div>
      )}

      <Card className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="p-4 border-b border-luxury-200 dark:border-luxury-800 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md flex items-center gap-4 transition-colors duration-500">
          <img src="https://picsum.photos/id/1027/100/100" alt="Designer" className="w-12 h-12 rounded-full object-cover border border-gold-500 shadow-[0_0_10px_rgba(166,136,104,0.3)]" />
          <div>
            <h3 className="font-serif text-lg font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">Arch. Zainab Al-Zaki</h3>
            <p className="text-xs font-bold text-green-600 dark:text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span> {t('chat.online')}</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar bg-luxury-50/50 dark:bg-luxury-950/30 transition-colors duration-500">
          {chatHistory.map((msg) => {
            const attachmentsToRender = msg.attachments || (msg.attachment ? [msg.attachment] : []);
            const isClient = msg.sender === 'CLIENT';
            
            const bubbleClass = isClient
              ? 'bg-gradient-to-br from-gold-600 to-gold-400 dark:from-gold-500 dark:to-gold-600 text-white dark:text-luxury-950 rounded-2xl rounded-tr-sm shadow-sm font-medium'
              : 'bg-white dark:bg-luxury-800 border border-luxury-200 dark:border-luxury-700 text-luxury-900 dark:text-luxury-100 rounded-2xl rounded-tl-sm shadow-sm font-medium';

            return (
              <div key={msg.id} className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
                {msg.sender === 'SUPPORT' && (
                  <span className="text-[10px] text-luxury-500 font-bold mb-1 ml-1">{t('role.support') || 'Support Team'}</span>
                )}
                {/* Text Bubble */}
                {msg.text && (
                  <div className={`relative max-w-[85%] sm:max-w-[70%] px-3 pt-2 pb-1.5 ${attachmentsToRender.length > 0 || msg.actionItem ? 'mb-1' : ''} ${bubbleClass}`}>
                    <p className="text-[15px] font-medium leading-snug whitespace-pre-wrap">{msg.text}</p>
                    {attachmentsToRender.length === 0 && !msg.actionItem && (
                      <span className={`float-right text-[10px] ml-4 mt-1 opacity-70`}>{msg.timestamp}</span>
                    )}
                    <div className="clear-both"></div>
                  </div>
                )}
                
                {/* Action Item Bubble */}
                {msg.actionItem && (
                  <div className={`relative max-w-[85%] sm:max-w-[70%] p-4 mb-1 border shadow-sm rounded-2xl ${isClient ? 'rounded-tr-sm bg-luxury-100 dark:bg-luxury-900 border-luxury-200 dark:border-luxury-700 text-luxury-900 dark:text-luxury-100' : 'rounded-tl-sm bg-white dark:bg-luxury-800 border-luxury-200 dark:border-luxury-700 text-luxury-900 dark:text-luxury-100'}`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="p-2 bg-gold-500/10 text-gold-600 rounded-full mb-2">
                        {msg.actionItem.type === 'PAYMENT' && <DollarSign size={24} />}
                        {msg.actionItem.type === 'APPROVAL' && <CheckCircle2 size={24} />}
                        {msg.actionItem.type === 'MEETING' && <CalendarIcon size={24} />}
                      </div>
                      <h4 className="font-bold text-lg mb-1">{msg.actionItem.title}</h4>
                      {msg.actionItem.type === 'PAYMENT' && (
                        <p className="text-xl font-bold font-serif text-gold-600 mb-3">{msg.actionItem.amount} BHD</p>
                      )}
                      
                      {msg.actionItem.completed ? (
                        <div className="w-full mt-3 py-2 px-4 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                          <CheckCircle2 size={16} />
                          {t('status.completed') || 'تم الإنجاز'}
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleActionClick(msg.id)}
                          className="w-full mt-3 py-2 px-4 bg-gradient-to-r from-gold-700 to-gold-600 text-white rounded-lg text-sm font-bold shadow-md hover:from-gold-600 hover:to-gold-500 transition-all hover:scale-105 active:scale-95"
                        >
                          {msg.actionItem.type === 'PAYMENT' ? 'دفع الآن (Pay Now)' : 
                           msg.actionItem.type === 'APPROVAL' ? 'اعتماد (Approve)' : 
                           'حجز الموعد (Book)'}
                        </button>
                      )}
                    </div>
                    {attachmentsToRender.length === 0 && (
                      <span className={`block text-right text-[10px] mt-2 opacity-70`}>{msg.timestamp}</span>
                    )}
                  </div>
                )}
                
                {/* Attachments */}
                {attachmentsToRender.length > 0 && (
                  <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[70%] w-full ${isClient ? 'items-end' : 'items-start'}`}>
                    {attachmentsToRender.map((att, idx) => {
                      const isLast = idx === attachmentsToRender.length - 1;
                      
                      if (att.type === 'image' && att.url) {
                        return (
                          <div key={idx} className={`relative group ${isClient ? 'items-end' : 'items-start'}`}>
                            <button 
                              type="button"
                              onClick={() => setSelectedImage(att.url!)}
                              className="text-left focus:outline-none"
                            >
                              <img 
                                src={att.url} 
                                alt={att.name} 
                                className={`w-48 sm:w-60 h-auto max-h-64 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-zoom-in ${isClient ? 'rounded-tr-sm' : 'rounded-tl-sm'} border border-black/10 dark:border-white/10`} 
                              />
                            </button>
                            {isLast && (
                              <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-[10px] text-white">
                                {msg.timestamp}
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx} className={`relative px-3 pt-2 pb-1.5 w-64 ${bubbleClass}`}>
                            <a href={att.url || '#'} download={att.name} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isClient ? 'bg-white/20 text-white' : 'bg-luxury-100 dark:bg-luxury-900 text-gold-600 dark:text-gold-400'}`}>
                                <Paperclip size={18} />
                              </div>
                              <div className="text-sm overflow-hidden flex-1">
                                <p className="font-bold truncate text-inherit leading-tight mb-0.5">{att.name}</p>
                                <p className="text-[11px] font-medium opacity-80 uppercase tracking-wider">{att.size}</p>
                              </div>
                            </a>
                            {isLast && (
                              <span className="float-right text-[10px] ml-4 mt-1 opacity-70">{msg.timestamp}</span>
                            )}
                            <div className="clear-both"></div>
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {attachmentError && (
          <div className="px-4 py-2 text-xs text-red-500 font-bold text-center bg-red-50 dark:bg-red-950/20 border-t border-red-100 dark:border-red-900/30">
            {attachmentError}
          </div>
        )}
        
        {pendingAttachments.length > 0 && (
          <div className="px-4 py-3 bg-luxury-50 dark:bg-luxury-900 border-t border-luxury-200 dark:border-luxury-800 flex flex-wrap gap-3 max-h-32 overflow-y-auto">
            {pendingAttachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-700 rounded-lg pr-2 overflow-hidden shadow-sm">
                <div className="w-10 h-10 bg-luxury-100 dark:bg-luxury-800 flex items-center justify-center text-gold-600 dark:text-gold-400 shrink-0">
                  {att.type === 'image' ? (
                     <img src={att.url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                     <Paperclip size={16} />
                  )}
                </div>
                <div className="text-xs overflow-hidden max-w-[120px]">
                  <p className="font-bold text-luxury-900 dark:text-luxury-100 truncate">{att.name}</p>
                  <p className="font-medium text-luxury-500">{att.size}</p>
                </div>
                <button onClick={() => removePendingAttachment(idx)} className="text-luxury-400 hover:text-red-500 transition-colors p-1 ml-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="p-3 sm:p-4 bg-luxury-50/80 dark:bg-luxury-950/80 backdrop-blur-md border-t border-luxury-200 dark:border-luxury-800 transition-colors duration-500 flex items-center gap-2 sm:gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-luxury-900 rounded-full px-4 py-2 border border-luxury-200 dark:border-luxury-700 focus-within:border-gold-500 transition-colors shadow-sm">
            <input 
              type="file" 
              multiple
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx"
            />
            <button onClick={() => fileInputRef.current?.click()} className="text-luxury-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors shrink-0">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat.placeholder')} 
              className="flex-1 bg-transparent border-none focus:outline-none font-medium text-luxury-900 dark:text-luxury-50 text-[15px] min-w-0" 
            />
          </div>
          <button 
            onClick={handleSend} 
            disabled={!input.trim() && pendingAttachments.length === 0}
            className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-gold-600 text-white rounded-full flex items-center justify-center hover:bg-gold-500 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} className={isAr ? 'mr-1' : 'ml-1'} />
          </button>
        </div>
      </Card>

    </div>
  );
};


export const Booking: React.FC<{ setView?: (v: ViewModule) => void, isQuickBooking?: boolean, onClose?: () => void }> = ({ setView, isQuickBooking, onClose }) => {
  const isAr = document.documentElement.dir === 'rtl';
  const [showBookingForm, setShowBookingForm] = useState(isQuickBooking || false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // ISO YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<'In-Studio' | 'Virtual' | 'Site Visit'>('In-Studio');
  const [duration, setDuration] = useState<number>(2);
  const [blockedError, setBlockedError] = useState<string | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  const [showGuestBookingModal, setShowGuestBookingModal] = useState(false);
  const [showPinterestModal, setShowPinterestModal] = useState(false);
  // Listen for reset events
  useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      console.log('Reset event received for:', e.detail);
      if (e.detail === 'BOOKING' || e.detail === 'ADMIN_BOOKINGS') {
        setShowBookingForm(false);
        setSelectedDate(null);
        setSelectedTime(null);
        setEditingBookingId(null);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);

  const [guestPhone, setGuestPhone] = useState('');
  const [guestCountryCode, setGuestCountryCode] = useState('+973');
  const [lastValidCountryCode, setLastValidCountryCode] = useState('+973');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [guestPhoneError, setGuestPhoneError] = useState('');
  const [guestPaymentMethod, setGuestPaymentMethod] = useState<'after' | 'now'>('after');
  const [guestBookingSuccess, setGuestBookingSuccess] = useState(false);
  const [guestModalStep, setGuestModalStep] = useState<"phone" | "payment" | "otp">("phone");
  const [guestOtp, setGuestOtp] = useState('');
  const [guestOtpError, setGuestOtpError] = useState('');
  const [showVirtualPaymentError, setShowVirtualPaymentError] = useState(false);
  const [showFreeConsultationModal, setShowFreeConsultationModal] = useState(false);
  const [isBookingFreeConsultation, setIsBookingFreeConsultation] = useState(false);

  const { globalState, setGlobalState, role, t, setShowGuestLockModal } = useAppContext();
  const isAdmin = role === 'ARCHITECT' || role === 'SUPPORT';
  const activeClient = globalState.clients[globalState.activeClientId];
  const bookings = activeClient.bookings;
  const blockedSlots = globalState.blockedSlots;
  const freeConsultations = activeClient.profile.freeConsultations;

  // Generate time slots every 30 mins from 08:00 AM to 03:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8;
    let min = 0;
    while (hour < 15 || (hour === 15 && min === 0)) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      const timeStr = `${displayHour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${ampm}`;
      slots.push(timeStr);
      min += 30;
      if (min >= 60) {
        min = 0;
        hour++;
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const parseTime = (timeStr: string) => {
    if (!timeStr || timeStr === 'ALL_DAY') return 0;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const calculateCost = () => {
    // If editing a free booking, it remains free regardless of current freeConsultations balance
    if (isBookingFreeConsultation && (freeConsultations > 0 || editingBookingId)) return 0;
    let baseRate = 50; // Virtual
    if (bookingType === 'In-Studio') baseRate = 80;
    if (bookingType === 'Site Visit') baseRate = 120;
    return baseRate * duration;
  };

  const handleStatusChange = (id: string, status: 'Confirmed' | 'Rejected') => {
    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      const updatedBookings = client.bookings.map(b => b.id === id ? { ...b, status } : b);
      
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            bookings: updatedBookings
          }
        }
      };
    });
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    
    if (activeClient.profile.isGuest || isQuickBooking) {
      if (bookingType === 'Virtual' && !isQuickBooking) {
        setGuestPaymentMethod('now');
      } else if (isQuickBooking) {
        setGuestPaymentMethod('after');
      }
      setShowGuestBookingModal(true);
      return;
    }
    
    executeBooking();
  };



  const confirmGuestBooking = () => {
    if (guestModalStep === 'phone') {
      if (!guestPhone || !guestCountryCode) {
        setGuestPhoneError(isAr ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
        return;
      }
      setGuestPhoneError('');
      setGuestModalStep('otp');
    } else if (guestModalStep === 'otp') {
      if (!guestOtp || guestOtp.length < 4) {
        setGuestOtpError(isAr ? 'يرجى إدخال رمز التحقق المكون من 4 أرقام' : 'Please enter the 4-digit verification code');
        return;
      }
      setGuestOtpError('');
      
      if (!isQuickBooking && calculateCost() > 0) {
        setGuestModalStep('payment');
      } else {
        setGuestBookingSuccess(true);
        setTimeout(() => {
            setShowGuestBookingModal(false);
            setGuestBookingSuccess(false);
            setGuestPhone('');
            setGuestOtp('');
            setGuestModalStep('phone');
            executeBooking('now');
            if (isQuickBooking && onClose) onClose();
        }, 2000);
      }
    } else if (guestModalStep === 'payment') {
      setGuestBookingSuccess(true);
      setTimeout(() => {
          setShowGuestBookingModal(false);
          setGuestBookingSuccess(false);
          setGuestPhone('');
          setGuestOtp('');
          setGuestModalStep('phone');
          executeBooking(guestPaymentMethod);
          if (isQuickBooking && onClose) onClose();
      }, 2000);
    }
  };

  const executeBooking = (paymentChoice: "now" | "after" = "now") => {
    const cost = calculateCost();
    const requiresImmediatePayment = cost > 0 && paymentChoice === "now";
    const newBooking = {
      id: editingBookingId || `bk${Date.now()}`,
      date: selectedDate, // Now a string "YYYY-MM-DD"
      time: selectedTime,
      durationHours: duration,
      type: bookingType,
      status: (requiresImmediatePayment ? 'Awaiting Payment' : (isAdmin ? 'Confirmed' : 'Awaiting Confirmation')) as 'Awaiting Payment' | 'Awaiting Confirmation' | 'Confirmed',
      initiatedBy: (isAdmin ? 'ARCHITECT' : 'CLIENT') as 'ARCHITECT' | 'CLIENT',
      cost,
      isGuestBooking: activeClient.profile.isGuest,
      guestPhone: guestPhone ? `${guestCountryCode} ${guestPhone}` : undefined
    };

    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      let updatedCart = client.cart || [];
      let updatedFreeConsultations = client.profile.freeConsultations;
      let existingBooking = editingBookingId ? client.bookings.find(b => b.id === editingBookingId) : null;

      // Only deduct free consultations or add to cart if it's a NEW booking
      // or if it was changed from free to paid (simplified: assume we only charge once)
      if (!editingBookingId) {
        if (requiresImmediatePayment) {
          updatedCart = [
            ...updatedCart,
            { id: `bk_${newBooking.id}`, title: `${bookingType} Consultation (${duration}h)`, price: cost, type: 'service' }
          ];
        } else if (cost === 0) {
          updatedFreeConsultations = Math.max(0, updatedFreeConsultations - 1);
        }
      }

      let newBlockedSlots = prev.blockedSlots;
      if (newBooking.status === 'Confirmed' && !existingBooking) {
        newBlockedSlots = [
          ...newBlockedSlots,
          {
            id: `blk${Date.now()}`,
            date: newBooking.date,
            time: newBooking.time,
            durationHours: newBooking.durationHours,
            reason: `Meeting with ${client.profile.name}`
          }
        ];
      }

      const updatedBookings = editingBookingId 
        ? client.bookings.map(b => b.id === editingBookingId ? newBooking : b)
        : [...client.bookings, newBooking];

      return {
        ...prev,
        blockedSlots: newBlockedSlots,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            profile: { ...client.profile, freeConsultations: updatedFreeConsultations },
            bookings: updatedBookings,
            cart: updatedCart
          }
        }
      };
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setBlockedError(null);
    setShowBookingForm(false);
    setIsBookingFreeConsultation(false);
    setEditingBookingId(null);
    
    if (requiresImmediatePayment && !isAdmin) {
      if (setView) setView(ViewModule.CART);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDayOfWeek = currentMonth.getDay();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const minBookableDate = new Date(today);
  minBookableDate.setDate(today.getDate() + 2); // 2 days in advance

  if (!showBookingForm) {
    return (
      <div className="max-w-5xl mx-auto pb-20 relative">
        <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-8">{t('booking.title')}</h2>
        
        {bookings.length === 0 ? (
          <Card className="text-center py-16 flex flex-col items-center">
            <div className="w-16 h-16 bg-luxury-100 dark:bg-luxury-900 rounded-full flex items-center justify-center text-luxury-400 mb-4">
              <CalendarIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">{isAr ? 'لا توجد استشارات قادمة' : 'No upcoming consultations'}</h3>
            <p className="text-luxury-600 dark:text-luxury-400 mb-8 max-w-md mx-auto leading-relaxed">
              {isAr ? 'ليس لديك أي استشارات مجدولة حالياً. يمكنك حجز استشارة جديدة لمناقشة تفاصيل مشروعك معنا.' : 'You have no scheduled consultations at the moment. You can book a new consultation to discuss your project details with us.'}
            </p>
            <Button variant="primary" onClick={() => { setEditingBookingId(null); setShowBookingForm(true); }} className="px-8 py-3">
              <CalendarIcon size={18} className={isAr ? "ml-2 inline" : "mr-2 inline"} />
              {isAr ? 'حجز استشارة' : 'Book a Consultation'}
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold text-luxury-900 dark:text-luxury-200">
                {isAr ? 'استشاراتك القادمة' : 'Your Upcoming Consultations'}
              </h3>
              <Button variant="primary" onClick={() => { setEditingBookingId(null); setShowBookingForm(true); }}>
                <CalendarIcon size={16} className={isAr ? "ml-2 inline" : "mr-2 inline"} />
                {isAr ? 'حجز استشارة جديدة' : 'Book New Consultation'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map(b => {
                const bDate = new Date(b.date);
                return (
                  <Card key={b.id} className="flex flex-col gap-4 hover:border-gold-600/50 transition-colors relative">
                    <div className="flex items-start justify-between border-b border-luxury-100 dark:border-luxury-800 pb-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-luxury-50 dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-xl flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-luxury-500">{bDate.toLocaleDateString(isAr ? 'ar-BH' : 'en-US', { month: 'short' }).toUpperCase()}</span>
                          <span className="text-xl font-bold text-gold-700 dark:text-gold-400">{bDate.getDate()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{b.time}</p>
                          <p className="text-sm font-medium text-luxury-600 dark:text-luxury-400 flex items-center gap-1.5 mt-0.5">
                            {b.type === 'In-Studio' ? <Building size={14} /> : b.type === 'Virtual' ? <Video size={14} /> : <MapPin size={14} />}
                            {b.type} ({b.durationHours}h)
                          </p>
                        </div>
                      </div>
                      {!isAdmin && (b.status === 'Awaiting Confirmation' || b.status === 'Pending') && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowPinterestModal(true);
                            }}
                            className="p-2 text-luxury-500 hover:text-gold-600 bg-luxury-50 hover:bg-gold-50 dark:bg-luxury-900/50 dark:hover:bg-gold-900/20 rounded-full transition-colors relative z-20"
                            title={isAr ? 'مراجع Pinterest' : 'Pinterest References'}
                          >
                            <Paintbrush size={18} className="pointer-events-none" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setEditingBookingId(b.id);
                              setSelectedDate(b.date);
                              setSelectedTime(b.time);
                              setBookingType(b.type);
                              setDuration(b.durationHours);
                              setIsBookingFreeConsultation(b.cost === 0);
                              setShowBookingForm(true);
                            }}
                            className="p-2 text-luxury-500 hover:text-gold-600 bg-luxury-50 hover:bg-gold-50 dark:bg-luxury-900/50 dark:hover:bg-gold-900/20 rounded-full transition-colors relative z-20"
                            title={isAr ? 'تعديل الحجز' : 'Edit Booking'}
                          >
                            <Pencil size={18} className="pointer-events-none" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <p className={`text-sm font-bold flex items-center gap-1.5 ${
                        b.status === 'Confirmed' ? 'text-green-600 dark:text-green-500' : 
                        b.status === 'Rejected' ? 'text-red-600 dark:text-red-500' :
                        b.status === 'Awaiting Payment' ? 'text-rose-600 dark:text-rose-500' : 
                        'text-gold-600 dark:text-gold-500'
                      }`}>
                        {b.status === 'Confirmed' && <Check size={16} />}
                        {b.status === 'Rejected' && <X size={16} />}
                        {b.status === 'Confirmed' ? t('booking.confirmed') : b.status === 'Rejected' ? (isAr ? 'مرفوض' : 'Rejected') : b.status === 'Awaiting Payment' ? t('booking.awaiting_payment') : b.status === 'Awaiting Confirmation' ? t('booking.awaiting_confirmation') : t('booking.pending')}
                      </p>
                      <p className="text-xs text-luxury-500 font-medium">Ref: {b.id.toUpperCase()}</p>
                    </div>
                    {isAdmin && b.isGuestBooking && (
                      <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex flex-col gap-1">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{isAr ? 'حجز ضيف' : 'Guest Booking'}</span>
                        {b.guestPhone && <span className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2"><Phone size={14}/> {b.guestPhone}</span>}
                      </div>
                    )}
                    {isAdmin && (b.status === 'Awaiting Confirmation' || b.status === 'Pending') && (
                      <div className="mt-2 pt-4 border-t border-luxury-100 dark:border-luxury-800 flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1 py-2 text-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                          onClick={() => handleStatusChange(b.id, 'Rejected')}
                        >
                          <X size={16} className="mr-2 inline" />
                          {isAr ? 'رفض' : 'Reject'}
                        </Button>
                        <Button 
                          variant="primary" 
                          className="flex-1 py-2 text-sm"
                          onClick={() => handleStatusChange(b.id, 'Confirmed')}
                        >
                          <Check size={16} className="mr-2 inline" />
                          {isAr ? 'تأكيد' : 'Confirm'}
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {showPinterestModal && (
          <PinterestReferences onClose={() => setShowPinterestModal(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 relative">
      <AnimatePresence>
        {showFreeConsultationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFreeConsultationModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-luxury-900 p-8 rounded-2xl w-full max-w-lg shadow-2xl border border-luxury-200 dark:border-luxury-800"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                    {t('booking.free')}
                  </h3>
                  <p className="text-luxury-600 dark:text-luxury-400 font-medium">
                    {isAr ? 'اختر نوع الاستشارة المجانية التي ترغب بها.' : 'Choose the type of free consultation you prefer.'}
                  </p>
                </div>
                <button 
                  onClick={() => setShowFreeConsultationModal(false)}
                  className="p-2 bg-luxury-100 dark:bg-luxury-800 rounded-full text-luxury-500 hover:text-luxury-900 dark:hover:text-luxury-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Site Visit */}
                <button 
                  onClick={() => {
                    setBookingType('Site Visit');
                    setDuration(2);
                    setIsBookingFreeConsultation(true);
                    setShowFreeConsultationModal(false);
                  }}
                  className={`w-full ${isAr ? 'text-right' : 'text-left'} p-5 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 hover:border-gold-500 rounded-xl transition-all flex justify-between items-center group`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-luxury-900 dark:text-luxury-100 mb-1 flex items-center gap-2">
                      <MapPin size={18} className="text-gold-600 dark:text-gold-400" /> 
                      {isAr ? 'استشارة في الموقع (ساعتين)' : 'On-Site Consultation (2 Hours)'}
                    </span>
                    <span className="text-sm font-medium text-luxury-500">
                      {isAr ? 'زيارة ميدانية لموقع المشروع لمناقشة التفاصيل والأبعاد' : 'Field visit to the project site to discuss details and dimensions'}
                    </span>
                  </div>
                  <ChevronRight size={24} className="text-luxury-300 group-hover:text-gold-500 transition-colors" />
                </button>

                {/* In-Studio */}
                <button 
                  onClick={() => {
                    setBookingType('In-Studio');
                    setDuration(2);
                    setIsBookingFreeConsultation(true);
                    setShowFreeConsultationModal(false);
                  }}
                  className={`w-full ${isAr ? 'text-right' : 'text-left'} p-5 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 hover:border-gold-500 rounded-xl transition-all flex justify-between items-center group`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-luxury-900 dark:text-luxury-100 mb-1 flex items-center gap-2">
                      <Building size={18} className="text-gold-600 dark:text-gold-400" /> 
                      {isAr ? 'استشارة في المكتب (ساعتين)' : 'In-Studio Consultation (2 Hours)'}
                    </span>
                    <span className="text-sm font-medium text-luxury-500">
                      {isAr ? 'اجتماع في مكتبنا لمراجعة التصاميم والمخططات مع الفريق' : 'Meeting at our studio to review designs and plans with the team'}
                    </span>
                  </div>
                  <ChevronRight size={24} className="text-luxury-300 group-hover:text-gold-500 transition-colors" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => { 
            if (isQuickBooking && onClose) {
              onClose();
            } else {
              setShowBookingForm(false); setIsBookingFreeConsultation(false); setEditingBookingId(null); 
            }
          }}
          className="w-10 h-10 bg-luxury-100 dark:bg-luxury-900 rounded-full flex items-center justify-center text-luxury-600 dark:text-luxury-400 hover:bg-luxury-200 dark:hover:bg-luxury-800 transition-colors shrink-0"
        >
          <X size={20} />
        </button>
        <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">
          {editingBookingId 
            ? (isAr ? 'تعديل الحجز' : 'Edit Consultation')
            : (isAr ? 'حجز موعد جديد' : 'Book a New Consultation')}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-luxury-900 dark:text-luxury-200 capitalize">
              {currentMonth.toLocaleDateString(isAr ? 'ar-BH' : 'en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-1 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">&lt;</button>
              <button onClick={nextMonth} className="p-1 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">&gt;</button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-xs font-bold text-luxury-500">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              
              // Standardize local date string to YYYY-MM-DD safely without timezone shifts
              const yyyy = cellDate.getFullYear();
              const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
              const dd = String(cellDate.getDate()).padStart(2, '0');
              const dateString = `${yyyy}-${mm}-${dd}`;
              
              const isSelected = selectedDate === dateString;
              const blocks = blockedSlots.filter(b => b.date === dateString);
              
              const isPastOrTooSoon = cellDate < minBookableDate;
              const isWeekend = cellDate.getDay() === 5 || cellDate.getDay() === 6; // Friday, Saturday
              
              // Check if ANY existing booking is exactly on this day with ALL_DAY flag
              const allClientBookingsForDay = Object.values(globalState.clients)
                .flatMap(c => c.bookings || [])
                .filter(b => b.date === dateString && b.status === 'Confirmed' && b.id !== editingBookingId);
              
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
              
              const isFullyBlocked = isPastOrTooSoon || isWeekend || hasAllDayBlock || allSlotsBlocked;
              
              const hasBooking = bookings.find(b => b.date === dateString);
              
              return (
                <button 
                  key={day}
                  onClick={() => {
                    if (isFullyBlocked) {
                      setBlockedError(isAr ? 'هذا اليوم غير متوفر (إجازة أو محجوز مسبقاً).' : 'This day is unavailable (closed or fully booked).');
                    } else {
                      setSelectedDate(dateString);
                      setBlockedError(null);
                      setSelectedTime(null);
                    }
                  }}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${
                    isSelected ? 'bg-gradient-to-br from-gold-600 to-gold-400 dark:from-gold-400 dark:to-gold-600 text-white dark:text-luxury-950 font-bold shadow-[0_0_10px_rgba(166,136,104,0.5)] border-none' : 
                    isFullyBlocked ? 'bg-red-500/5 border border-red-500/10 text-red-400 opacity-60' :
                    'bg-luxury-50/50 dark:bg-luxury-950/50 border border-luxury-200 dark:border-luxury-800 font-medium text-luxury-700 dark:text-luxury-300 hover:bg-luxury-100 dark:hover:bg-luxury-800 hover:border-luxury-300 dark:hover:border-luxury-600'
                  }`}
                >
                  {day}
                  <div className="flex gap-1 mt-1">
                    {hasBooking && <span className={`w-1.5 h-1.5 rounded-full ${hasBooking.status === 'Confirmed' ? 'bg-green-500' : 'bg-gold-500'}`} />}
                    {blocks.length > 0 && !isFullyBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            {!isQuickBooking && freeConsultations > 0 ? (
              <button
                onClick={() => setShowFreeConsultationModal(true)}
                className={`w-full mb-8 bg-transparent border border-luxury-300 dark:border-luxury-700 rounded-xl hover:border-gold-500 dark:hover:border-gold-500 transition-all flex items-stretch group overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}
              >
                <div className="flex-1 p-4 md:p-5 flex flex-col justify-center">
                  <h4 className="text-base md:text-lg font-bold text-luxury-900 dark:text-luxury-50 mb-1 leading-tight">
                    {t('booking.free')}
                  </h4>
                  <span className="text-xs font-bold text-luxury-500 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    {isAr ? 'اختر استشارتك المجانية' : 'Choose your free consultation'}
                  </span>
                </div>
                <div className={`w-16 md:w-20 shrink-0 flex items-center justify-center bg-luxury-50 dark:bg-luxury-900/50 ${isAr ? 'border-r' : 'border-l'} border-luxury-300 dark:border-luxury-700 transition-colors`}>
                  <span className="text-2xl md:text-3xl font-serif font-bold text-gold-600 dark:text-gold-400">
                    {freeConsultations}
                  </span>
                </div>
              </button>
            ) : null}

            {!isBookingFreeConsultation ? (
              <>
                <h3 className="text-sm font-bold text-luxury-600 dark:text-luxury-400 mb-4">{t('booking.type')}</h3>
                <div className="space-y-2 mb-6">
                  <button 
                    onClick={() => { setBookingType('In-Studio'); setDuration(2); }}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-bold transition-all border flex items-center gap-3 ${
                      bookingType === 'In-Studio' ? 'bg-gradient-to-r from-gold-500/10 to-transparent border-gold-500 text-gold-600 dark:text-gold-400 shadow-inner' : 'bg-luxury-50/50 dark:bg-luxury-950/50 border-luxury-200 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:border-luxury-400 dark:hover:border-luxury-500'
                    }`}
                  >
                    <Building size={16} /> {t('booking.type.studio')}
                  </button>
                  <button 
                    onClick={() => { setBookingType('Virtual'); setDuration(2); }}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-bold transition-all border flex items-center gap-3 ${
                      bookingType === 'Virtual' ? 'bg-gradient-to-r from-gold-500/10 to-transparent border-gold-500 text-gold-600 dark:text-gold-400 shadow-inner' : 'bg-luxury-50/50 dark:bg-luxury-950/50 border-luxury-200 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:border-luxury-400 dark:hover:border-luxury-500'
                    }`}
                  >
                    <Video size={16} /> {t('booking.type.virtual')}
                  </button>
                  <button 
                    onClick={() => { setBookingType('Site Visit'); setDuration(2); }}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-bold transition-all border flex items-center gap-3 ${
                      bookingType === 'Site Visit' ? 'bg-gradient-to-r from-gold-500/10 to-transparent border-gold-500 text-gold-600 dark:text-gold-400 shadow-inner' : 'bg-luxury-50/50 dark:bg-luxury-950/50 border-luxury-200 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:border-luxury-400 dark:hover:border-luxury-500'
                    }`}
                  >
                    <MapPin size={16} /> {t('booking.type.site')}
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-6 p-4 bg-gold-50 dark:bg-gold-900/10 border border-gold-200 dark:border-gold-800 rounded-xl relative">
                <button 
                  onClick={() => setIsBookingFreeConsultation(false)}
                  className="absolute top-2 right-2 p-1 text-luxury-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
                <h3 className="text-sm font-bold text-gold-700 dark:text-gold-400 mb-2">
                  {isAr ? 'حجز استشارة مجانية قيد التنفيذ' : 'Free Consultation Booking in Progress'}
                </h3>
                <p className="text-sm font-medium text-luxury-700 dark:text-luxury-300 flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  {bookingType === 'Site Visit' ? (isAr ? 'استشارة في الموقع' : 'Site Visit Consultation') : (isAr ? 'استشارة في المكتب' : 'In-Studio Consultation')}
                </p>
                <p className="text-sm font-medium text-luxury-700 dark:text-luxury-300 flex items-center gap-2 mt-1">
                  <Check size={14} className="text-green-500" />
                  {duration} {isAr ? 'ساعات' : 'Hours'}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{t('booking.duration')}</h3>
              <div className="flex items-center gap-3 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-2 py-1">
                <button 
                  onClick={() => setDuration(Math.max(1, duration - 1))} 
                  className="text-luxury-500 hover:text-gold-500 font-bold px-2"
                  disabled={isBookingFreeConsultation}
                >-</button>
                <span className="font-bold text-luxury-900 dark:text-luxury-50 w-4 text-center">{duration}</span>
                <button 
                  onClick={() => setDuration(Math.min(4, duration + 1))} 
                  className="text-luxury-500 hover:text-gold-500 font-bold px-2"
                  disabled={isBookingFreeConsultation}
                >+</button>
              </div>
            </div>

            <h3 className="text-sm font-bold text-luxury-600 dark:text-luxury-400 mb-4 flex items-center gap-2"><Clock size={16}/> {t('booking.times')}</h3>
            
            {blockedError && (
              <div className="mb-3 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg animate-pulse">
                {blockedError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
              {timeSlots.map(time => {
                const slotStart = parseTime(time);
                const slotEnd = slotStart + duration * 60;

                
                // Aggregate all bookings across all clients
                const allClientBookings = Object.values(globalState.clients).flatMap(c => c.bookings || []);
                const allBlocks = [
                  ...blockedSlots,
                  ...allClientBookings
                    .filter(b => b.status === 'Confirmed' && b.id !== editingBookingId) // Only block for Confirmed bookings (ignore pending, cancelled, etc.)
                    .map(b => ({
                      date: b.date,
                      time: b.time,
                      durationHours: b.durationHours,
                      timeType: 'booking'
                    }))
                ];

                const isBlocked = allBlocks.some(b => {
                  if (b.date !== selectedDate) return false;
                  if (b.time === 'ALL_DAY') return true;
                  
                  const bStart = parseTime(b.time);
                  const bDurationMins = (b.durationHours || 1) * 60;
                  const bEnd = bStart + bDurationMins;
                  
                  // Check overlap including 1 hour (60 mins) buffer
                  return (slotStart < bEnd + 60) && (bStart < slotEnd + 60);
                });
                return (
                  <button 
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
                    }}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all border ${
                      isBlocked ? 'bg-red-500/5 border-red-500/20 text-red-500/50' :
                      selectedTime === time ? 'bg-gradient-to-r from-gold-500/10 to-transparent border-gold-500 text-gold-600 dark:text-gold-400 shadow-inner' : 'bg-luxury-50/50 dark:bg-luxury-950/50 border-luxury-200 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:border-luxury-400 dark:hover:border-luxury-500'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-luxury-200 dark:border-luxury-800 flex justify-between items-center">
              <span className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{t('booking.cost')}</span>
              <span className="text-xl font-bold text-gold-600 dark:text-gold-400">{calculateCost()} BHD</span>
            </div>
          </Card>
          
          <Button className="w-full" disabled={!selectedDate || !selectedTime} onClick={handleBooking}>
            {editingBookingId ? (isAr ? 'تحديث الحجز' : 'Update Booking') : t('booking.confirm')}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showGuestBookingModal && (
          <div className="fixed inset-0 bg-luxury-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-luxury-900 p-8 rounded-3xl max-w-md w-full border border-luxury-200 dark:border-luxury-800 shadow-2xl relative"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <button 
                onClick={() => setShowGuestBookingModal(false)}
                className="absolute top-6 right-6 p-2 text-luxury-500 hover:text-luxury-900 dark:hover:text-luxury-100 transition-colors"
                disabled={guestBookingSuccess}
              >
                <X size={20} />
              </button>
              
              {guestBookingSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    {guestPaymentMethod === 'now' ? (
                      <ShoppingCart size={40} className="text-green-500" />
                    ) : (
                      <CheckCircle2 size={40} className="text-green-500" />
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                    {guestPaymentMethod === 'now' 
                      ? (isAr ? 'تمت الإضافة للسلة' : 'Added to Cart')
                      : (isAr ? 'تم إرسال الطلب بنجاح' : 'Request Sent Successfully')}
                  </h3>
                  <p className="text-luxury-600 dark:text-luxury-400 mt-2">
                    {guestPaymentMethod === 'now' 
                      ? (isAr ? 'طلبك موجود الآن في العربة لإتمام الدفع.' : 'Your request is in the cart to complete payment.')
                      : (isAr ? 'سيتم التواصل معك قريباً لتأكيد الحجز.' : 'You will be contacted soon to confirm the booking.')}
                  </p>
                </div>
              ) : guestModalStep === 'phone' ? (
                <>
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                      {isQuickBooking 
                        ? (isAr ? 'حجز استشارة سريع' : 'Quick Consultation Booking')
                        : (isAr ? 'حجز الاستشارة السريع' : 'Continue as a Guest')}
                    </h3>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm leading-relaxed">
                      {isAr 
                        ? 'يرجى إدخال رقم هاتفك كمرجع للتواصل بخصوص الاستشارة. (هذا الإجراء لن يقوم بإنشاء حساب)' 
                        : 'Please enter your phone number as a contact reference. (This will not create an account)'}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="relative">
                      <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-1.5">
                        {isAr ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      <div className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl flex items-center transition-colors focus-within:border-gold-500 focus-within:ring-1 focus-within:ring-gold-500" dir="ltr">
                        <div className="relative flex items-center shrink-0 w-[100px]">
                          <input
                            type="text"
                            value={guestCountryCode}
                            onChange={(e) => {
                              setGuestCountryCode(e.target.value);
                              setShowCountryDropdown(true);
                            }}
                            onFocus={() => setShowCountryDropdown(true)}
                            onBlur={() => {
                              setTimeout(() => setShowCountryDropdown(false), 200);
                              const isValid = countryCodes.some(c => c.dialCode === guestCountryCode);
                              if (!guestCountryCode || guestCountryCode === '+' || !isValid) {
                                setGuestCountryCode(lastValidCountryCode);
                              } else {
                                setLastValidCountryCode(guestCountryCode);
                              }
                            }}
                            className="bg-transparent pl-2 pr-6 py-3.5 outline-none text-luxury-900 dark:text-luxury-50 font-medium w-full text-center"
                            placeholder="+973"
                          />
                          <ChevronDown size={14} className="absolute right-2.5 text-luxury-400 opacity-60 pointer-events-none" />
                        </div>
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
                                    setLastValidCountryCode(c.dialCode);
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
                    </div>

                    {guestPhoneError && (
                      <p className="text-red-500 text-sm font-bold">{guestPhoneError}</p>
                    )}

                    <div className="pt-2">
                      <Button onClick={confirmGuestBooking} variant="primary" className="w-full py-4 text-base shadow-md">
                        {isAr ? 'التالي' : 'Next'}
                      </Button>
                    </div>

                    <div className="pt-4 text-center mt-2">
                      <p className="text-sm text-luxury-500 dark:text-luxury-400">
                        {isAr ? 'هل ترغب بالاستفادة من جميع الميزات؟ ' : 'Want to unlock all features? '}
                        <button 
                          onClick={() => {
                            setShowGuestBookingModal(false);
                            setShowGuestLockModal(true);
                          }}
                          className="text-gold-600 dark:text-gold-500 font-bold hover:underline transition-all"
                        >
                          {isAr ? 'إنشاء حساب' : 'Create an account'}
                        </button>
                      </p>
                    </div>
                  </div>
                </>
              ) : guestModalStep === 'payment' ? (
                <>
                  <div className="text-center mb-8">
                    <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-3">
                      {isAr ? 'طريقة الدفع' : 'Payment Method'}
                    </h3>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm leading-relaxed">
                      {isAr 
                        ? 'الرجاء تحديد طريقة الدفع للاستشارة.' 
                        : 'Please select how you would like to pay for the consultation.'}
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {!isQuickBooking && (
                      <label className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        guestPaymentMethod === 'now' 
                          ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10' 
                          : 'border-luxury-200 dark:border-luxury-800 hover:border-luxury-300 dark:hover:border-luxury-700 bg-transparent'
                      }`}>
                        <input 
                          type="radio" 
                          name="payment_method" 
                          value="now"
                          checked={guestPaymentMethod === 'now'}
                          onChange={() => setGuestPaymentMethod('now')}
                          className="mt-1 w-5 h-5 text-gold-600 focus:ring-gold-500 accent-gold-600 shrink-0" 
                        />
                        <div>
                          <span className="block text-lg font-bold text-luxury-900 dark:text-luxury-50 mb-1">
                            {isAr ? 'الدفع الآن' : 'Pay Now'}
                          </span>
                          <span className="block text-sm font-medium text-luxury-600 dark:text-luxury-400 leading-relaxed">
                            {isAr ? 'سيتم تحويلك إلى صفحة الدفع لإتمام العملية.' : 'You will be redirected to checkout.'}
                          </span>
                        </div>
                      </label>
                    )}
                      
                    <div 
                      className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all ${
                        (bookingType === 'Virtual' && !isQuickBooking)
                          ? 'border-luxury-200 dark:border-luxury-800 bg-luxury-100 dark:bg-luxury-900/50 opacity-60 cursor-pointer'
                          : guestPaymentMethod === 'after' 
                            ? 'border-gold-500 bg-gold-50 dark:bg-gold-500/10 cursor-pointer' 
                            : 'border-luxury-200 dark:border-luxury-800 hover:border-luxury-300 dark:hover:border-luxury-700 bg-transparent cursor-pointer'
                      }`}
                      onClick={(e) => {
                        if (bookingType === 'Virtual' && !isQuickBooking) {
                          e.preventDefault();
                          setShowVirtualPaymentError(true);
                          setTimeout(() => setShowVirtualPaymentError(false), 2000);
                        } else {
                          setGuestPaymentMethod('after');
                        }
                      }}
                    >
                      <input 
                        type="radio" 
                        name="payment_method" 
                        value="after"
                        checked={guestPaymentMethod === 'after'}
                        readOnly
                        className="mt-1 w-5 h-5 text-gold-600 focus:ring-gold-500 accent-gold-600 shrink-0 pointer-events-none" 
                      />
                      <div>
                        <span className="block text-lg font-bold text-luxury-900 dark:text-luxury-50 mb-1">
                          {isAr ? 'الدفع بعد الاستشارة' : 'Pay After Consultation'}
                        </span>
                        <span className="block text-sm font-medium text-luxury-600 dark:text-luxury-400 leading-relaxed">
                          {isAr ? 'سيتم تأكيد الموعد مبدئياً وتدفع لاحقاً.' : 'Appointment will be provisionally confirmed and paid later.'}
                        </span>
                        <AnimatePresence>
                          {(bookingType === 'Virtual' && !isQuickBooking) && showVirtualPaymentError && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              className="overflow-hidden"
                            >
                              <span className="block text-sm font-bold text-red-500">
                                {isAr ? 'الدفع بعد الاستشارة غير متوفر في الاستشارات عبر الزوم.' : 'Pay After Consultation is not available for virtual consultations.'}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={() => setGuestModalStep('phone')} variant="outline" className="flex-1 py-4">
                      {isAr ? 'رجوع' : 'Back'}
                    </Button>
                    <Button onClick={confirmGuestBooking} variant="primary" className="flex-1 py-4">
                      {isAr ? 'تأكيد' : 'Confirm'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                      {isAr ? 'تأكيد رقم الهاتف' : 'Verify Phone Number'}
                    </h3>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm leading-relaxed">
                      {isAr 
                        ? 'الرجاء إدخال رمز التحقق (OTP) المكون من 4 أرقام الذي تم إرساله إلى رقم هاتفك.' 
                        : 'Please enter the 4-digit verification code (OTP) sent to your phone number.'}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-2">
                      {isAr ? 'رمز التحقق' : 'Verification Code'}
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={guestOtp}
                      onChange={(e) => setGuestOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className={`w-full bg-luxury-50 dark:bg-luxury-950 border ${
                        guestOtpError 
                          ? 'border-red-500 ring-1 ring-red-500' 
                          : 'border-luxury-200 dark:border-luxury-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500'
                      } rounded-xl px-4 py-4 outline-none text-luxury-900 dark:text-luxury-50 text-center text-2xl font-bold tracking-[1em] transition-colors`}
                      placeholder="••••"
                      dir="ltr"
                    />
                    {guestOtpError && (
                      <p className="text-red-500 text-sm mt-2">{guestOtpError}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setGuestModalStep((!isQuickBooking && calculateCost() > 0) ? 'payment' : 'phone')} 
                      variant="outline" 
                      className="flex-1 py-4"
                    >
                      {isAr ? 'رجوع' : 'Back'}
                    </Button>
                    <Button onClick={confirmGuestBooking} variant="primary" className="flex-1 py-4">
                      {isAr ? 'تأكيد' : 'Verify'}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showPinterestModal && (
        <PinterestReferences onClose={() => setShowPinterestModal(false)} />
      )}
    </div>
  );
};

export const Support: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const tickets = activeClient.tickets;
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');

  const faqs = [
    { q: "How do I request a revision on a 3D render?", a: "Navigate to the 'Files & Approvals' tab, locate the specific render, and click 'Revise'. You can add specific comments directly there." },
    { q: "What is the standard lead time for imported Italian marble?", a: "Typically 8-12 weeks from the date of order confirmation and payment of the material retainer." },
    { q: "Can I change my service tier mid-project?", a: "Yes, you can upgrade your tier at any time via the 'Packages' tab. Downgrades require a consultation with the lead architect." }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const handleSubmit = () => {
    if (!subject.trim() || !desc.trim()) return;
    const newTicket = {
      id: `tkt${Date.now()}`,
      subject,
      description: desc,
      status: 'Under Review' as const,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          tickets: [newTicket, ...prev.clients[prev.activeClientId].tickets]
        }
      }
    }));
    setSubject('');
    setDesc('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-4">{t('support.title')}</h2>
        <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('support.desc')}</p>
      </div>

      <Card>
        <h3 className="font-serif text-xl font-bold bg-gradient-to-r from-gold-600 to-gold-400 dark:from-gold-300 dark:to-gold-600 text-transparent bg-clip-text mb-6">{t('support.faq')}</h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-luxury-200 dark:border-luxury-800 rounded-lg overflow-hidden shadow-sm transition-colors duration-500">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 bg-white/80 dark:bg-luxury-950/80 text-left hover:bg-luxury-50 dark:hover:bg-luxury-900 transition-colors"
              >
                <span className="font-bold text-luxury-900 dark:text-luxury-200">{faq.q}</span>
                <ChevronDown size={18} className={`text-gold-500 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="p-4 bg-luxury-50/50 dark:bg-luxury-900/50 text-sm font-medium text-luxury-700 dark:text-luxury-400 border-t border-luxury-200 dark:border-luxury-800 shadow-inner">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-serif text-xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-6">{t('support.ticket')}</h3>
        <div className="space-y-4">
          <input 
            type="text" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t('support.subject')} 
            className="w-full bg-luxury-50/50 dark:bg-luxury-950/50 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 shadow-inner transition-colors" 
          />
          <textarea 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={t('support.inquiry')} 
            rows={4} 
            className="w-full bg-luxury-50/50 dark:bg-luxury-950/50 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 resize-none shadow-inner transition-colors"
          ></textarea>
          <Button onClick={handleSubmit} className="w-full md:w-auto">{t('support.submit')}</Button>
        </div>
      </Card>

      {tickets.length > 0 && (
        <Card>
          <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-6">Your Tickets</h3>
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-luxury-900 dark:text-luxury-200">{ticket.subject}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${ticket.status === 'Resolved' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : ticket.status === 'In Progress' ? 'bg-gold-500/20 text-gold-600 dark:text-gold-400' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400'}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-luxury-600 dark:text-luxury-400 mb-2">{ticket.description}</p>
                {ticket.architectNotes && (
                  <div className="mt-3 p-3 bg-white dark:bg-luxury-900 border-l-4 border-gold-700 dark:border-gold-500 rounded-r-lg shadow-sm">
                    <p className="text-xs font-bold text-gold-700 dark:text-gold-400 mb-1">{t('support.architectNote')}</p>
                    <p className="text-sm font-medium text-luxury-900 dark:text-luxury-200">{ticket.architectNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
