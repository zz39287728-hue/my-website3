import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { ViewModule, CartItem, InvoiceData } from '../types';
import { ADDON_SERVICES } from '../constants';
import { 
  ShoppingBag, CreditCard, Smartphone, CheckCircle2, 
  Printer, Trash2, ArrowRight, X, Plus, Sparkles, Receipt,
  ShieldCheck
} from 'lucide-react';

interface FinanceHubProps {
  setView?: (view: ViewModule) => void;
  defaultTab?: 'cart' | 'invoices';
}

export const FinanceHub: React.FC<FinanceHubProps> = ({ setView, defaultTab = 'invoices' }) => {
  const { t, lang, globalState, setGlobalState } = useAppContext();
  const isRTL = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'cart' | 'invoices'>(defaultTab);

  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'INVOICE') {
        setActiveTab('cart');
        setShowCheckoutModal(false);
        setCheckoutStep('select');
        setSelectedInvoiceForModal(null);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'benefit' | 'card'>('benefit');
  const [checkoutStep, setCheckoutStep] = useState<'select' | 'processing' | 'success'>('select');
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<InvoiceData | null>(null);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4128 •••• •••• 9920');
  const [cardExpiry, setCardExpiry] = useState('11/27');
  const [cardCvv, setCardCvv] = useState('842');

  const activeClient = globalState.clients[globalState.activeClientId];
  const cartItems = activeClient?.cart || [];
  const pendingInvoice = activeClient?.invoice;
  const paidInvoices = activeClient?.paidInvoices || [];

  // Default to false so the user is not surprised by a huge amount when they only add a consultation
  const [includeMilestone, setIncludeMilestone] = useState(false);

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const pendingMilestoneSubtotal = pendingInvoice && pendingInvoice.status === 'Pending' 
    ? pendingInvoice.items.reduce((acc, item) => acc + (item.amount || 0), 0) 
    : 0;

  const effectiveMilestoneAmount = (pendingInvoice && pendingInvoice.status === 'Pending' && includeMilestone) 
    ? pendingMilestoneSubtotal 
    : 0;

  const totalSubtotal = cartSubtotal + effectiveMilestoneAmount;
  const vatAmount = totalSubtotal * 0.10;
  const totalDue = totalSubtotal + vatAmount;

  const totalCartCount = cartItems.length + (pendingInvoice?.status === 'Pending' && includeMilestone ? 1 : 0);

  const handleRemoveItem = (id: string) => {
    setGlobalState(prev => {
      const clientId = prev.activeClientId;
      if (!clientId || !prev.clients[clientId]) return prev;
      
      const client = prev.clients[clientId];
      let updatedBookings = client.bookings ? [...client.bookings] : [];
      
      if (id.startsWith('bk_')) {
        const bookingId = id.replace('bk_', '');
        updatedBookings = updatedBookings.filter(b => b.id !== bookingId);
      }
      
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [clientId]: {
            ...client,
            cart: (client.cart || []).filter(item => item.id !== id),
            bookings: updatedBookings
          }
        }
      };
    });
  };

  const handleQuickAdd = (item: { id: string; name: string; nameAr?: string; priceNumber: number; desc?: string; descAr?: string }) => {
    const newItem: CartItem = {
      id: item.id,
      title: isRTL && item.nameAr ? item.nameAr : item.name,
      subtitle: item.name,
      price: item.priceNumber,
      type: 'service',
      features: [isRTL && item.descAr ? item.descAr : (item.desc || 'Premium Atelier Service')]
    };

    setGlobalState(prev => {
      const clientId = prev.activeClientId;
      if (!clientId || !prev.clients[clientId]) return prev;
      
      const client = prev.clients[clientId];
      const existing = client.cart || [];
      if (existing.some(i => i.id === newItem.id)) return prev;
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [clientId]: {
            ...client,
            cart: [...existing, newItem]
          }
        }
      };
    });
  };

  const handleProcessCheckout = () => {
    setCheckoutStep('processing');

    setTimeout(() => {
      const settledItems: { id: string; desc: string; amount: number }[] = [];

      cartItems.forEach(item => {
        settledItems.push({
          id: `item_${item.id}`,
          desc: item.title,
          amount: item.price
        });
      });

      if (pendingInvoice && pendingInvoice.status === 'Pending' && includeMilestone) {
        pendingInvoice.items.forEach(pi => settledItems.push(pi));
      }

      const txId = paymentMethod === 'benefit' 
        ? `BENEFIT-${Math.floor(100000 + Math.random() * 900000)}-BH` 
        : `VISA-${Math.floor(100000 + Math.random() * 900000)}-AUTH`;

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const newPaidInvoice: InvoiceData = {
        id: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
        date: dateStr,
        status: 'Paid',
        paymentMethod: paymentMethod === 'benefit' ? 'BenefitPay' : 'Credit Card',
        paidAt: `${dateStr} • ${timeStr}`,
        transactionId: txId,
        items: settledItems.length > 0 ? settledItems : [{ id: 'itm_1', desc: 'Atelier Design Retainer', amount: 3500 }]
      };

      let upgradedTier: string | undefined = undefined;
      const packageCartItem = cartItems.find(i => i.type === 'package');
      if (packageCartItem && packageCartItem.packageId) {
        const pkgObj = globalState.storeData?.packages.find(p => p.id === packageCartItem.packageId);
        if (pkgObj) {
          upgradedTier = pkgObj.name;
        }
      }

      setGlobalState(prev => {
        const clientId = prev.activeClientId;
        if (!clientId || !prev.clients[clientId]) return prev;
        
        const client = prev.clients[clientId];
        const existingPaid = client.paidInvoices || [];
        
        let updatedBookings = client.bookings ? [...client.bookings] : [];
        
        const invoiceBookingIds = (includeMilestone && pendingInvoice && pendingInvoice.status === 'Pending') 
          ? pendingInvoice.items.filter(pi => pi.id.startsWith('inv_bk')).map(pi => pi.id.replace('inv_', ''))
          : [];
          
        const cartBookingIds = cartItems.filter(ci => ci.id.startsWith('bk_')).map(ci => ci.id.replace('bk_', ''));
        const allPaidBookingIds = [...invoiceBookingIds, ...cartBookingIds];
        
        if (allPaidBookingIds.length > 0) {
          updatedBookings = updatedBookings.map(b => 
            allPaidBookingIds.includes(b.id) ? { ...b, status: 'Awaiting Confirmation' } : b
          );
        }

        return {
          ...prev,
          clients: {
            ...prev.clients,
            [clientId]: {
              ...client,
              cart: [], 
              ...(upgradedTier ? { profile: { ...client.profile, tier: upgradedTier } } : {}),
              ...(includeMilestone ? { invoice: { ...client.invoice, status: 'Paid' } } : {}),
              paidInvoices: [newPaidInvoice, ...existingPaid],
              bookings: updatedBookings
            }
          }
        };
      });

      setCheckoutStep('success');
    }, 2000);
  };

  const handlePrintModal = () => {
    window.print();
  };

  if (!activeClient) return null;

  const showEmptyCart = cartItems.length === 0 && (!pendingInvoice || pendingInvoice.status !== 'Pending');

  return (
    <div className="max-w-6xl mx-auto pb-24 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-gold-700 dark:text-gold-400 font-bold text-xs uppercase tracking-widest mb-1.5">
            <Sparkles size={16} />
            <span>{isRTL ? 'المركز المالي للعميل' : 'Client Financial Suite'}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">
            {activeTab === 'cart' ? t('cart.tabs.cart') : t('nav.invoice')}
          </h1>
          <p className="text-luxury-600 dark:text-luxury-400 text-sm mt-1">
            {activeTab === 'cart' ? t('cart.desc') : t('cart.invoices.desc')}
          </p>
        </div>
        <div className="flex bg-luxury-100 dark:bg-luxury-900/50 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'cart'
                ? 'bg-white dark:bg-luxury-800 text-luxury-900 dark:text-luxury-50 shadow-sm'
                : 'text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-100'
            }`}
          >
            {t('cart.tabs.cart')}
            {totalCartCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] bg-gold-600 text-white rounded-full">
                {totalCartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'invoices'
                ? 'bg-white dark:bg-luxury-800 text-luxury-900 dark:text-luxury-50 shadow-sm'
                : 'text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-100'
            }`}
          >
            {t('cart.tabs.invoices')}
          </button>
        </div>
      </div>

      {activeTab === 'cart' && (
        <div className="space-y-8">
          {showEmptyCart ? (
            <Card className="p-12 text-center rounded-3xl border-dashed border-2 border-luxury-300 dark:border-luxury-800">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-600/10 border border-gold-600/30 flex items-center justify-center text-gold-600 dark:text-gold-400 shadow-inner">
                <ShoppingBag size={36} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                {t('cart.empty.title')}
              </h2>
              <p className="text-luxury-600 dark:text-luxury-400 font-medium max-w-md mx-auto mb-8 text-sm leading-relaxed">
                {t('cart.empty.desc')}
              </p>
              {setView && (
                <Button 
                  variant="primary" 
                  onClick={() => setView(ViewModule.PACKAGES)}
                  className="mx-auto text-sm px-6 py-3"
                >
                  <Sparkles size={16} />
                  <span>{t('cart.empty.action')}</span>
                  <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
                </Button>
              )}
              
              <div className="mt-12 pt-8 border-t border-luxury-200 dark:border-luxury-800/80 max-w-3xl mx-auto text-left">
                <p className="font-bold text-xs uppercase tracking-widest text-luxury-500 dark:text-luxury-400 mb-4 text-center">
                  {isRTL ? 'إضافات واستشارات معمارية مميزة يمكنك طلبها الآن' : 'Suggested Atelier Add-ons for your Project'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {ADDON_SERVICES.map(addon => (
                    <div 
                      key={addon.id} 
                      className="p-4 rounded-2xl bg-luxury-50 dark:bg-luxury-950/70 border border-luxury-200 dark:border-luxury-800 flex flex-col justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-luxury-900 dark:text-luxury-100 mb-1">
                          {isRTL ? addon.nameAr : addon.name}
                        </p>
                        <p className="text-xs text-gold-700 dark:text-gold-400 font-bold mb-3">
                          {addon.price} BHD
                        </p>
                      </div>
                      <button
                        onClick={() => handleQuickAdd(addon)}
                        className="w-full py-2 px-3 rounded-xl bg-gold-600/10 hover:bg-gold-600 text-gold-700 dark:text-gold-300 hover:text-white dark:hover:text-luxury-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus size={14} />
                        <span>{t('packages.addons.add')}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                {pendingInvoice && pendingInvoice.status === 'Pending' && (
                  <Card className="mb-6 overflow-hidden border-gold-500/30 shadow-lg relative">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3">
                          <input 
                            type="checkbox" 
                            id="milestone-checkbox" 
                            checked={includeMilestone}
                            onChange={(e) => setIncludeMilestone(e.target.checked)}
                            className="mt-1 w-5 h-5 text-gold-600 rounded border-luxury-300 focus:ring-gold-500 cursor-pointer accent-gold-600"
                          />
                          <div>
                            <label htmlFor="milestone-checkbox" className="font-bold text-base text-luxury-900 dark:text-luxury-50 cursor-pointer">
                              {t('cart.milestone.title')} ({pendingInvoice.id})
                            </label>
                            <p className="text-sm text-luxury-600 dark:text-luxury-400 mt-1">
                              {t('cart.milestone.desc')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50">
                            {pendingMilestoneSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} BHD
                          </p>
                          <p className="text-xs font-bold text-gold-600 dark:text-gold-400 bg-gold-600/10 px-2 py-0.5 rounded-full inline-block mt-1">
                            Pending Payment
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-luxury-200 dark:border-luxury-800 space-y-2">
                        {pendingInvoice.items.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-luxury-600 dark:text-luxury-400 line-clamp-1">{item.desc}</span>
                            <span className="font-medium text-luxury-900 dark:text-luxury-100 whitespace-nowrap ml-4">
                              {item.amount.toLocaleString()} BHD
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
                
                <div className="space-y-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-6 rounded-2xl bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-gold-500/40"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gold-600/10 flex items-center justify-center text-gold-700 dark:text-gold-400 shrink-0">
                            {item.type === 'package' ? <Sparkles size={24} /> : <ShoppingBag size={24} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-luxury-900 dark:text-luxury-50 text-lg">
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="text-sm text-gold-700 dark:text-gold-500 font-medium">{item.subtitle}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 shrink-0">
                          <p className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50">
                            {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} BHD
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 rounded-xl text-luxury-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              <div className="lg:col-span-5 sticky top-24">
                <Card className="p-7 rounded-3xl border border-luxury-200 dark:border-luxury-800 shadow-xl bg-white dark:bg-luxury-900">
                  <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-6 pb-4 border-b border-luxury-100 dark:border-luxury-800">
                    {t('cart.summary.title')}
                  </h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-luxury-600 dark:text-luxury-400">
                      <span>{t('cart.summary.services')} ({cartItems.length})</span>
                      <span className="font-medium text-luxury-900 dark:text-luxury-100">{cartSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} BHD</span>
                    </div>
                    {includeMilestone && pendingInvoice && pendingInvoice.status === 'Pending' && (
                      <div className="flex justify-between items-center text-luxury-600 dark:text-luxury-400">
                        <span>{t('cart.summary.milestones')} (1)</span>
                        <span className="font-medium text-luxury-900 dark:text-luxury-100">{pendingMilestoneSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} BHD</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-luxury-600 dark:text-luxury-400">
                      <span>{t('cart.summary.vat')}</span>
                      <span className="font-medium text-luxury-900 dark:text-luxury-100">{vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} BHD</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-6 border-t-2 border-luxury-900 dark:border-luxury-100 mb-8">
                    <div>
                      <p className="text-sm font-medium text-luxury-600 dark:text-luxury-400 mb-1">{t('cart.summary.total')}</p>
                      <p className="text-xs text-luxury-500 dark:text-luxury-500">Includes 10% VAT</p>
                    </div>
                    <span className="font-serif text-3xl md:text-4xl font-bold text-luxury-900 dark:text-luxury-50">
                      {totalDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      <span className="text-lg md:text-xl ml-1 text-gold-600">BHD</span>
                    </span>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-full py-4 text-base shadow-lg"
                    onClick={() => setShowCheckoutModal(true)}
                    disabled={totalCartCount === 0}
                  >
                    <CheckCircle2 size={20} />
                    <span>{t('cart.summary.checkout')}</span>
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {paidInvoices.length === 0 ? (
            <Card className="p-12 text-center rounded-3xl border-dashed border-2 border-luxury-300 dark:border-luxury-800">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxury-100 dark:bg-luxury-800 border border-luxury-200 dark:border-luxury-700 flex items-center justify-center text-luxury-400 dark:text-luxury-500">
                <Receipt size={36} />
              </div>
              <h2 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                {t('cart.invoices.emptyTitle')}
              </h2>
              <p className="text-luxury-600 dark:text-luxury-400 text-sm">
                {t('cart.invoices.emptyDesc')}
              </p>
            </Card>
          ) : (
            paidInvoices.map(invoice => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={invoice.id}
              >
                <Card className="p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-gold-500/40 cursor-pointer" onClick={() => setSelectedInvoiceForModal(invoice)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                      <Receipt size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-luxury-900 dark:text-luxury-50 flex items-center gap-2">
                        {invoice.id}
                        <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Paid</span>
                      </h4>
                      <p className="text-sm text-luxury-600 dark:text-luxury-400">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50">
                        {invoice.items.reduce((s, i) => s + i.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} BHD
                      </p>
                      <p className="text-xs text-luxury-500">{invoice.paymentMethod}</p>
                    </div>
                    <Button variant="outline" className="shrink-0 p-2 text-luxury-600 border-luxury-300">
                      <ArrowRight size={20} className={isRTL ? 'rotate-180' : ''} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}


      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-luxury-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-luxury-900 p-8 rounded-3xl max-w-md w-full border border-luxury-200 dark:border-luxury-800 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-6 right-6 p-2 text-luxury-500 hover:text-luxury-900 dark:hover:text-luxury-100 transition-colors"
                disabled={checkoutStep === 'processing'}
              >
                <X size={20} />
              </button>

              {checkoutStep === 'select' && (
                <>
                  <div className="text-center mb-8">
                    <h2 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                      {t('cart.checkout.title')}
                    </h2>
                    <p className="text-luxury-600 dark:text-luxury-400 text-sm">
                      {t('cart.checkout.desc')}
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <button
                      onClick={() => setPaymentMethod('benefit')}
                      className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                        paymentMethod === 'benefit'
                          ? 'border-gold-600 bg-gold-600/5'
                          : 'border-luxury-200 dark:border-luxury-800 hover:border-gold-600/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === 'benefit' ? 'bg-gold-600 text-white' : 'bg-luxury-100 dark:bg-luxury-800 text-luxury-500'}`}>
                        <Smartphone size={24} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-bold text-luxury-900 dark:text-luxury-50">{t('cart.checkout.methods.benefit.title')}</p>
                        <p className="text-xs text-luxury-500">{t('cart.checkout.methods.benefit.desc')}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'benefit' ? 'border-gold-600' : 'border-luxury-300'}`}>
                        {paymentMethod === 'benefit' && <div className="w-2.5 h-2.5 rounded-full bg-gold-600" />}
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-gold-600 bg-gold-600/5'
                          : 'border-luxury-200 dark:border-luxury-800 hover:border-gold-600/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${paymentMethod === 'card' ? 'bg-gold-600 text-white' : 'bg-luxury-100 dark:bg-luxury-800 text-luxury-500'}`}>
                        <CreditCard size={24} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-bold text-luxury-900 dark:text-luxury-50">{t('cart.checkout.methods.card.title')}</p>
                        <p className="text-xs text-luxury-500">{t('cart.checkout.methods.card.desc')}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-gold-600' : 'border-luxury-300'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-gold-600" />}
                      </div>
                    </button>
                  </div>

                  <Button 
                    variant="primary" 
                    className="w-full py-4 text-base"
                    onClick={handleProcessCheckout}
                  >
                    {t('cart.checkout.payNow')} {totalDue.toLocaleString('en-US', { minimumFractionDigits: 2 })} BHD
                  </Button>
                </>
              )}

              {checkoutStep === 'processing' && (
                <div className="text-center py-12">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-luxury-100 dark:border-luxury-800"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-gold-600 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-gold-600">
                      <ShieldCheck size={32} />
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                    {t('cart.checkout.processing')}
                  </h3>
                  <p className="text-luxury-500 text-sm">{t('cart.checkout.secure')}</p>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                    {t('cart.checkout.success.title')}
                  </h3>
                  <p className="text-luxury-600 dark:text-luxury-400 text-sm mb-8">
                    {t('cart.checkout.success.desc')}
                  </p>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        if (setView) {
                          setView(ViewModule.INVOICE);
                        } else {
                          setActiveTab('invoices');
                        }
                      }}
                      className="flex-1 py-3 text-sm"
                    >
                      <Receipt size={16} />
                      <span>{t('cart.invoices.title')}</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowCheckoutModal(false);
                        setCheckoutStep('select');
                      }}
                      className="flex-1 py-3 text-sm"
                    >
                      <span>{t('packages.close')}</span>
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedInvoiceForModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[150] overflow-y-auto p-4 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-black p-8 md:p-12 rounded-2xl max-w-3xl w-full shadow-2xl relative print:m-0 print:p-0"
              id="printable-tax-invoice"
            >
              <div className="flex justify-end items-center gap-3 mb-6 print:hidden">
                <button 
                  onClick={handlePrintModal}
                  className="px-4 py-2 rounded-xl bg-gold-600 hover:bg-gold-500 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Printer size={16} />
                  <span>{t('cart.invoices.downloadPdf')}</span>
                </button>
                <button 
                  onClick={() => setSelectedInvoiceForModal(null)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-green-600/25 text-green-700/25 font-serif text-5xl md:text-7xl font-bold px-10 py-4 rounded-2xl transform -rotate-12 pointer-events-none select-none z-0 text-center">
                PAID IN FULL
                <div className="text-xl md:text-2xl mt-1 tracking-widest font-sans">مدفوعة ومعتمدة بالكامل</div>
              </div>

              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start border-b-2 border-gray-200 pb-6">
                  <div>
                    <h1 className="font-serif text-3xl font-bold tracking-widest text-black">ZAINTERIOR</h1>
                    <p className="text-xs font-bold text-gold-700 tracking-wider">LUXURY ATELIER & ARCHITECTURAL EXECUTION</p>
                    <p className="text-xs text-gray-500 mt-1">CR: 123456-1 • VAT TIN: 300012345600003</p>
                    <p className="text-xs text-gray-500">Manama, Kingdom of Bahrain</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-md bg-gray-100 font-bold text-xs uppercase tracking-wider mb-2 text-gray-800">
                      {isRTL ? 'فاتورة ضريبية رسمية' : 'OFFICIAL TAX INVOICE'}
                    </span>
                    <p className="font-mono font-bold text-sm text-black">{selectedInvoiceForModal.id}</p>
                    <p className="text-xs text-gray-500">{t('invoice.date')}: {selectedInvoiceForModal.paidAt || selectedInvoiceForModal.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-bold text-gray-400 uppercase tracking-wider mb-1">{t('invoice.billedTo')}</p>
                    <p className="font-bold text-base text-black">{activeClient.profile.name}</p>
                    <p className="text-gray-600">{activeClient.profile.project}</p>
                    <p className="text-gray-600">{activeClient.profile.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-400 uppercase tracking-wider mb-1">{t('cart.invoices.method')}</p>
                    <p className="font-bold text-black">{selectedInvoiceForModal.paymentMethod || 'BenefitPay'}</p>
                    {selectedInvoiceForModal.transactionId && (
                      <p className="font-mono text-gray-600">{selectedInvoiceForModal.transactionId}</p>
                    )}
                    <span className="inline-block mt-1 font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      Settled & Verified
                    </span>
                  </div>
                </div>

                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b-2 border-gray-300 text-gray-500 font-bold uppercase">
                      <th className="py-3">{t('invoice.desc')}</th>
                      <th className="py-3 text-right">{t('invoice.amount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoiceForModal.items.map((it) => (
                      <tr key={it.id} className="border-b border-gray-200">
                        <td className="py-3.5 font-medium text-black">{it.desc}</td>
                        <td className="py-3.5 text-right font-medium text-black">
                          {it.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {(() => {
                  const sub = selectedInvoiceForModal.items.reduce((s, i) => s + i.amount, 0);
                  const vat = sub * 0.10;
                  const tot = sub + vat;
                  return (
                    <div className="flex justify-end pt-2">
                      <div className="w-64 space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600">
                          <span>{t('invoice.subtotal')}</span>
                          <span className="font-medium">{sub.toLocaleString('en-US', { minimumFractionDigits: 2 })} BHD</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>{t('invoice.vat')}</span>
                          <span className="font-medium">{vat.toLocaleString('en-US', { minimumFractionDigits: 2 })} BHD</span>
                        </div>
                        <div className="flex justify-between font-bold text-base border-t-2 border-black pt-2 text-black">
                          <span>{t('invoice.total')}</span>
                          <span>{tot.toLocaleString('en-US', { minimumFractionDigits: 2 })} BHD</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="pt-8 border-t border-gray-200 text-center text-[10px] text-gray-500">
                  <p>This is a computer-generated tax invoice verified under the laws of the Kingdom of Bahrain National Bureau for Revenue.</p>
                  <p className="mt-0.5">ZAINTERIOR Luxury Design & Architecture Atelier • Manama, Kingdom of Bahrain</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
