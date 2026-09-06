const fs = require('fs');
const content = fs.readFileSync('src/pages/FinanceHub.tsx', 'utf8');

const modalCode = `
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
                      className={\`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all \${
                        paymentMethod === 'benefit'
                          ? 'border-gold-600 bg-gold-600/5'
                          : 'border-luxury-200 dark:border-luxury-800 hover:border-gold-600/50'
                      }\`}
                    >
                      <div className={\`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 \${paymentMethod === 'benefit' ? 'bg-gold-600 text-white' : 'bg-luxury-100 dark:bg-luxury-800 text-luxury-500'}\`}>
                        <Smartphone size={24} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-bold text-luxury-900 dark:text-luxury-50">{t('cart.checkout.methods.benefit.title')}</p>
                        <p className="text-xs text-luxury-500">{t('cart.checkout.methods.benefit.desc')}</p>
                      </div>
                      <div className={\`w-5 h-5 rounded-full border-2 flex items-center justify-center \${paymentMethod === 'benefit' ? 'border-gold-600' : 'border-luxury-300'}\`}>
                        {paymentMethod === 'benefit' && <div className="w-2.5 h-2.5 rounded-full bg-gold-600" />}
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={\`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all \${
                        paymentMethod === 'card'
                          ? 'border-gold-600 bg-gold-600/5'
                          : 'border-luxury-200 dark:border-luxury-800 hover:border-gold-600/50'
                      }\`}
                    >
                      <div className={\`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 \${paymentMethod === 'card' ? 'bg-gold-600 text-white' : 'bg-luxury-100 dark:bg-luxury-800 text-luxury-500'}\`}>
                        <CreditCard size={24} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-bold text-luxury-900 dark:text-luxury-50">{t('cart.checkout.methods.card.title')}</p>
                        <p className="text-xs text-luxury-500">{t('cart.checkout.methods.card.desc')}</p>
                      </div>
                      <div className={\`w-5 h-5 rounded-full border-2 flex items-center justify-center \${paymentMethod === 'card' ? 'border-gold-600' : 'border-luxury-300'}\`}>
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
`;

const updatedContent = content.replace(
  /      \{\/\* Checkout Modal & Tax Invoice omitted for brevity, but I will add the modals below \*\/\}\n    <\/div>\n  \);\n\};\n/g, 
  modalCode
);

fs.writeFileSync('src/pages/FinanceHub.tsx', updatedContent);
console.log('FinanceHub updated!');
