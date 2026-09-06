import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { ADDON_SERVICES, PORTFOLIO_ITEMS } from '../constants';
import { StorePackageItem } from '../types';
import { useAppContext } from '../App';
import { ViewModule, CartItem } from '../types';
import { Check, Maximize2, Sun, Moon, Send, CheckCircle2, ShoppingBag, ArrowRight, Sparkles, Layers, ShieldCheck, X } from 'lucide-react';

interface PackagesProps {
  setView?: (view: ViewModule) => void;
}

export const Packages: React.FC<PackagesProps> = ({ setView }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<StorePackageItem | null>(null);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'PACKAGES') {
        setSelectedPackage(null);
        setSelectedAddon(null);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);
  const [selectedAddon, setSelectedAddon] = useState<typeof ADDON_SERVICES[0] | null>(null);
  const { t, lang, globalState, setGlobalState } = useAppContext();
  const isRTL = lang === 'ar';

  const activeClient = globalState.clients[globalState.activeClientId];
  const currentTier = activeClient?.profile?.tier;
  const cartItems = activeClient?.cart || [];

  const isInCart = (id: string) => cartItems.some(item => item.id === id || item.packageId === id);

  const handleAddToCart = (pkg: StorePackageItem) => {
    const cartItem: CartItem = {
      id: `cart_${pkg.id}`,
      title: isRTL && pkg.nameAr ? pkg.nameAr : pkg.name,
      subtitle: pkg.name,
      price: pkg.priceNumber,
      type: 'package',
      packageId: pkg.id,
      features: pkg.features
    };

    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      const existingCart = client.cart || [];
      if (existingCart.some(item => item.id === cartItem.id || item.packageId === pkg.id)) {
        return prev;
      }
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            cart: [...existingCart, cartItem]
          }
        }
      };
    });

    setToastMessage(t('cart.toast.added'));
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddAddon = (addon: typeof ADDON_SERVICES[0]) => {
    const cartItem: CartItem = {
      id: addon.id,
      title: isRTL && addon.nameAr ? addon.nameAr : addon.name,
      subtitle: addon.name,
      price: addon.priceNumber,
      type: 'service',
      features: [isRTL && addon.descAr ? addon.descAr : addon.desc]
    };

    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      const existingCart = client.cart || [];
      if (existingCart.some(item => item.id === cartItem.id)) {
        return prev;
      }
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            cart: [...existingCart, cartItem]
          }
        }
      };
    });

    setToastMessage(t('cart.toast.addonAdded'));
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-luxury-900 dark:bg-luxury-950 border border-gold-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-gold-600/30 flex items-center justify-center text-gold-400">
              <ShoppingBag size={18} />
            </div>
            <span className="font-bold text-sm text-luxury-50">{toastMessage}</span>
            {setView && (
              <button
                onClick={() => setView(ViewModule.CART)}
                className="ml-2 px-3 py-1 rounded-lg bg-gold-600 hover:bg-gold-500 text-luxury-950 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>{t('cart.toast.viewCart')}</span>
                <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for Package Details */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-luxury-950 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-full"
            >
              <div className="p-6 md:p-8 overflow-y-auto flex-1 no-scrollbar">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                      {isRTL && selectedPackage.nameAr ? selectedPackage.nameAr : selectedPackage.name}
                    </h3>
                    <p className="text-2xl font-bold text-gold-600 dark:text-gold-500">{selectedPackage.price}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedPackage(null)}
                    className="p-2 bg-luxury-100 dark:bg-luxury-900 text-luxury-600 dark:text-luxury-400 rounded-full hover:bg-luxury-200 dark:hover:bg-luxury-800 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-luxury-900 dark:text-luxury-200 mb-4 border-b border-luxury-100 dark:border-luxury-800 pb-2">
                      {isRTL ? 'المميزات والتفاصيل' : 'Features & Details'}
                    </h4>
                    <ul className="space-y-4">
                      {selectedPackage.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 text-luxury-700 dark:text-luxury-300">
                          <Check size={20} className="text-gold-600 dark:text-gold-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-luxury-50 dark:bg-luxury-900/50 rounded-2xl p-6 border border-luxury-100 dark:border-luxury-800">
                    <h4 className="font-bold text-luxury-900 dark:text-luxury-200 mb-2">
                      {isRTL ? 'معلومات إضافية' : 'Additional Information'}
                    </h4>
                    <p className="text-sm text-luxury-600 dark:text-luxury-400 leading-relaxed">
                      {isRTL 
                        ? 'جميع الباقات تخضع للشروط والأحكام. يتم تسليم التصاميم وفقاً للجدول الزمني المتفق عليه مسبقاً. يمكن طلب تعديلات إضافية بتكلفة إضافية تحدد لاحقاً. الأسعار قابلة للتغيير بناءً على متطلبات المشروع الخاصة والمساحات الإضافية.' 
                        : 'All packages are subject to terms and conditions. Designs are delivered according to the pre-agreed timeline. Additional revisions can be requested at an extra cost determined later. Prices are subject to change based on specific project requirements and additional areas.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-luxury-50 dark:bg-luxury-900/30 border-t border-luxury-100 dark:border-luxury-800 flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPackage(null)} 
                  className="flex-1"
                >
                  {isRTL ? 'إغلاق' : 'Close'}
                </Button>
                
                {isInCart(selectedPackage.id) ? (
                  <div className="flex-[2] py-2.5 px-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 text-center font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{t('packages.inCart')}</span>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      handleAddToCart(selectedPackage);
                      setSelectedPackage(null);
                    }} 
                    className="flex-[2]"
                  >
                    <ShoppingBag size={18} />
                    <span>{t('packages.addToCart')}</span>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal for Addon Details */}
      <AnimatePresence>
        {selectedAddon && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-luxury-950 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-full"
            >
              <div className="p-6 md:p-8 overflow-y-auto flex-1 no-scrollbar">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                      {isRTL && selectedAddon.nameAr ? selectedAddon.nameAr : selectedAddon.name}
                    </h3>
                    <p className="text-2xl font-bold text-gold-600 dark:text-gold-500">{selectedAddon.price}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedAddon(null)}
                    className="p-2 bg-luxury-100 dark:bg-luxury-900 text-luxury-600 dark:text-luxury-400 rounded-full hover:bg-luxury-200 dark:hover:bg-luxury-800 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-luxury-900 dark:text-luxury-200 mb-4 border-b border-luxury-100 dark:border-luxury-800 pb-2">
                      {isRTL ? 'تفاصيل الخدمة' : 'Service Details'}
                    </h4>
                    <p className="text-lg text-luxury-700 dark:text-luxury-300 leading-relaxed">
                      {isRTL ? selectedAddon.descAr : selectedAddon.desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-luxury-50 dark:bg-luxury-900/30 border-t border-luxury-100 dark:border-luxury-800 flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedAddon(null)} 
                  className="flex-1"
                >
                  {isRTL ? 'إغلاق' : 'Close'}
                </Button>
                
                {isInCart(selectedAddon.id) ? (
                  <div className="flex-[2] py-2.5 px-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 text-center font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{t('packages.inCart')}</span>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      handleAddAddon(selectedAddon);
                      setSelectedAddon(null);
                    }} 
                    className="flex-[2]"
                  >
                    <ShoppingBag size={18} />
                    <span>{t('packages.addToCart')}</span>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-4">
          {t('packages.title')}
        </h2>
        <p className="text-luxury-600 dark:text-luxury-400 font-medium max-w-2xl mx-auto">
          {t('packages.desc')}
        </p>
      </div>

      {/* Main Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {globalState.storeData?.packages.map((pkg, idx) => {
          const isCurrentPlan = currentTier?.toLowerCase().includes(pkg.name.toLowerCase().split(' ')[0]) || 
            (pkg.id === 'p3' && currentTier?.includes('VIP'));
          const inCart = isInCart(pkg.id);

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className={`relative bg-gradient-to-br from-white to-luxury-50 dark:from-luxury-900 dark:to-luxury-950 border rounded-2xl p-8 flex flex-col transition-all duration-500 ${
                pkg.tier === "signature" 
                  ? 'border-gold-600 dark:border-gold-500 shadow-[0_0_30px_rgba(166,136,104,0.18)] transform md:-translate-y-3' 
                  : 'border-luxury-200 dark:border-luxury-800 shadow-lg hover:border-gold-600/40'
              }`}
            >
              {isCurrentPlan && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-500 dark:to-gold-400 text-white dark:text-luxury-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>{t('packages.current')}</span>
                </div>
              )}

              <div className="mb-4">
                <button onClick={() => setSelectedPackage(pkg)} className="text-left rtl:text-right hover:opacity-80 transition-opacity">
                  <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-1">
                    {isRTL && pkg.nameAr ? pkg.nameAr : pkg.name}
                  </h3>
                </button>
                {isRTL && (
                  <p className="text-xs text-luxury-500 font-sans">{pkg.name}</p>
                )}
              </div>

              <p className="text-3xl font-bold bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-400 dark:to-gold-600 text-transparent bg-clip-text mb-8">
                {pkg.price}
              </p>

              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-luxury-700 dark:text-luxury-300 text-sm font-medium">
                    <Check size={16} className="text-gold-700 dark:text-gold-500 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <div className="w-full py-3 px-4 rounded-xl bg-gold-600/10 border border-gold-600/30 text-gold-700 dark:text-gold-400 text-center font-bold text-sm">
                  {t('packages.active')}
                </div>
              ) : inCart ? (
                <div className="space-y-2">
                  <div className="w-full py-2.5 px-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 text-center font-bold text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>{t('packages.inCart')}</span>
                  </div>
                  {setView && (
                    <Button 
                      variant="primary" 
                      onClick={() => setView(ViewModule.CART)}
                      className="w-full text-xs py-2"
                    >
                      <ShoppingBag size={14} />
                      <span>{t('cart.toast.viewCart')}</span>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-auto">
                  <Button 
                    variant={pkg.tier === "signature" ? 'primary' : 'outline'} 
                    onClick={() => handleAddToCart(pkg)}
                    className="w-full"
                  >
                    <ShoppingBag size={16} />
                    <span>{t('packages.addToCart')}</span>
                  </Button>
                  <button 
                    onClick={() => setSelectedPackage(pkg)}
                    className="text-sm text-gold-600 dark:text-gold-500 font-bold hover:underline py-1 mt-1 transition-all"
                  >
                    {isRTL ? 'عرض تفاصيل الباقة' : 'View Package Details'}
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* VIP Add-ons Section */}
      <div className="mt-12 bg-white dark:bg-luxury-900/60 border border-luxury-200 dark:border-luxury-800 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-luxury-100 dark:border-luxury-800">
          <div>
            <div className="flex items-center gap-2 text-gold-700 dark:text-gold-400 font-bold text-xs uppercase tracking-widest mb-1">
              <Sparkles size={16} />
              <span>VIP Atelier Concierge</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50">
              {t('packages.addons.title')}
            </h3>
            <p className="text-luxury-600 dark:text-luxury-400 text-sm mt-1">
              {t('packages.addons.desc')}
            </p>
          </div>

          {cartItems.length > 0 && setView && (
            <Button
              variant="outline"
              onClick={() => setView(ViewModule.CART)}
              className="self-start md:self-auto shrink-0"
            >
              <ShoppingBag size={16} />
              <span>{t('cart.tabs.cart')} ({cartItems.length})</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ADDON_SERVICES.map(addon => {
            const inCart = isInCart(addon.id);

            return (
              <div
                key={addon.id}
                className="bg-luxury-50 dark:bg-luxury-950/70 border border-luxury-200 dark:border-luxury-800 rounded-2xl p-6 flex flex-col justify-between hover:border-gold-600/40 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <button onClick={() => setSelectedAddon(addon)} className="text-left rtl:text-right hover:opacity-80 transition-opacity">
                      <h4 className="font-bold text-base text-luxury-900 dark:text-luxury-50 hover:underline">
                        {isRTL ? addon.nameAr : addon.name}
                      </h4>
                    </button>
                  </div>
                  <p className="text-xs text-luxury-600 dark:text-luxury-400 font-medium mb-4 leading-relaxed">
                    {isRTL ? addon.descAr : addon.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-luxury-200 dark:border-luxury-800/60 flex items-center justify-between gap-4">
                  <span className="font-bold text-lg text-gold-700 dark:text-gold-400">
                    {addon.price}
                  </span>

                  {inCart ? (
                    <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 size={14} />
                      <span>{t('packages.inCart')}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddAddon(addon)}
                      className="px-3.5 py-1.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-white dark:text-luxury-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <ShoppingBag size={14} />
                      <span>{t('packages.addons.add')}</span>
                    </button>
                  )}
                </div>
                
                <div className="mt-4 pt-3 border-t border-luxury-200 dark:border-luxury-800/60">
                  <button 
                    onClick={() => setSelectedAddon(addon)}
                    className="text-xs text-gold-600 dark:text-gold-500 font-bold hover:underline w-full text-center"
                  >
                    {isRTL ? 'عرض تفاصيل الخدمة' : 'View Service Details'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const VisionBuilder: React.FC = () => {
  const styles = ['Modern Minimalist', 'Classic Neoclassical', 'Desert Contemporary', 'Opulent Art Deco'];
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'VISION_BUILDER') {
        setSelectedStyle(styles[0]);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const { t } = useAppContext();

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <Card>
        <h2 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-6">{t('vision.title')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {styles.map(style => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all border font-bold ${selectedStyle === style ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950 border-transparent shadow-lg' : 'bg-luxury-50 dark:bg-luxury-950 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 hover:border-luxury-400 dark:hover:border-luxury-600'}`}
            >
              {style}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[1015, 1016, 1018, 1019, 1021, 1022, 1023, 1024].map((id, idx) => (
            <motion.div 
              key={id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-luxury-200 dark:border-luxury-800 hover:border-gold-700/50 dark:hover:border-gold-500/50 transition-colors"
            >
              <img src={`https://picsum.photos/id/${id}/400/400`} alt="Moodboard" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-luxury-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="outline" className="scale-75 backdrop-blur-sm bg-white/50 dark:bg-luxury-950/50">{t('vision.select')}</Button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button onClick={handleExport} disabled={isExporting || exported} className="w-full md:w-auto min-w-[200px]">
            {isExporting ? (
              <span className="flex items-center gap-2"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Sun size={18} /></motion.div> {t('vision.compiling')}</span>
            ) : exported ? (
              <span className="flex items-center gap-2 text-green-700 dark:text-green-900"><CheckCircle2 size={18} /> {t('vision.sent')}</span>
            ) : (
              <span className="flex items-center gap-2"><Send size={18} /> {t('vision.export')}</span>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const PortfolioVR: React.FC = () => {
  const [isNight, setIsNight] = useState(false);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'PORTFOLIO_VR') {
        setIsNight(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useAppContext();

  return (
    <div className={`max-w-7xl mx-auto space-y-8 pb-20 ${isFullscreen ? 'fixed inset-0 z-50 bg-luxury-50 dark:bg-luxury-950 p-0 m-0 max-w-none' : ''}`}>
      {!isFullscreen && (
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-serif text-3xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">{t('vr.title')}</h2>
            <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('vr.desc')}</p>
          </div>
        </div>
      )}

      <div className={`relative bg-white dark:bg-luxury-900 rounded-2xl overflow-hidden border border-luxury-200 dark:border-luxury-800 shadow-2xl transition-colors duration-500 ${isFullscreen ? 'h-full rounded-none border-none' : 'h-[600px]'}`}>
        <motion.div 
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          className="absolute top-0 left-0 h-full w-[2000px] cursor-grab active:cursor-grabbing"
        >
          <img 
            src="https://picsum.photos/id/1048/2000/800" 
            alt="VR Room" 
            className="w-full h-full object-cover pointer-events-none"
            style={{ filter: isNight ? 'brightness(0.4) sepia(0.3) hue-rotate(180deg)' : 'brightness(1.1) contrast(1.1)' }}
          />
          
          <div className="absolute top-1/2 left-[400px] w-8 h-8 bg-gradient-to-br from-gold-700 to-gold-600 dark:from-gold-400 dark:to-gold-600 rounded-full animate-pulse flex items-center justify-center cursor-pointer group shadow-[0_0_15px_rgba(166,136,104,0.8)] dark:shadow-[0_0_15px_rgba(197,156,106,0.8)]">
            <div className="w-3 h-3 bg-white dark:bg-luxury-50 rounded-full" />
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-white dark:bg-luxury-950 text-luxury-900 dark:text-luxury-50 text-xs p-3 rounded border border-luxury-200 dark:border-luxury-800 shadow-xl">
              <strong className="text-gold-700 dark:text-gold-400 block mb-1 font-bold">Calacatta Marble Island</strong>
              Imported from Italy. High durability, honed finish.
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md px-6 py-3 rounded-full border border-luxury-200 dark:border-luxury-800 shadow-lg">
          <button onClick={() => setIsNight(false)} className={`p-2 rounded-full transition-colors ${!isNight ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950' : 'text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50'}`}>
            <Sun size={20} />
          </button>
          <div className="w-px h-6 bg-luxury-300 dark:bg-luxury-700" />
          <button onClick={() => setIsNight(true)} className={`p-2 rounded-full transition-colors ${isNight ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950' : 'text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50'}`}>
            <Moon size={20} />
          </button>
          <div className="w-px h-6 bg-luxury-300 dark:bg-luxury-700" />
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">
            <Maximize2 size={20} />
          </button>
        </div>
        
        <div className="absolute top-6 left-6 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md px-4 py-2 rounded-lg border border-luxury-200 dark:border-luxury-800 text-sm font-bold text-luxury-700 dark:text-luxury-300 shadow-lg">
          {t('vr.drag')}
        </div>
      </div>
    </div>
  );
};
