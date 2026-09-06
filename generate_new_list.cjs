const fs = require('fs');

const code = fs.readFileSync('src/pages/ContractsHub.tsx', 'utf-8');

const startMarker = '{/* =========================================================================\n          VIEW 1: NO CONTRACT SELECTED (USER SEES CONTRACTS CATALOG / DIRECTORY ONLY)\n          ========================================================================= */}';

const endMarker = '/* =========================================================================\n            VIEW 2: FULL-SCREEN IMMERSIVE CONTRACT VIEW';

const view1Regex = new RegExp(
  startMarker.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + 
  '[\\s\\S]*?' + 
  endMarker.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
);

const newView1 = `${startMarker}
      {!selectedContract ? (
        <div className="space-y-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-luxury-200 dark:border-luxury-800 pb-8">
            <div className="space-y-3">
              <h2 className="font-serif text-4xl sm:text-5xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-400 text-transparent bg-clip-text">
                {isAr ? 'الوثائق والعقود' : 'Legal Documents'}
              </h2>
              <p className="text-sm text-luxury-500 max-w-xl leading-relaxed">
                {isAr 
                  ? 'مساحتك الآمنة لمراجعة واعتماد جميع العقود والمستندات القانونية الخاصة بمشروعك بخطوات بسيطة وموثوقة.'
                  : 'Your secure vault for reviewing and executing all legal agreements and project documents with a seamless digital signature.'}
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-4 rtl:pr-4 flex items-center pointer-events-none">
                <Search size={16} className="text-luxury-400" />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isAr ? "البحث برقم المرجع أو الاسم..." : "Search documents..."}
                className="w-full bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-full py-3 ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 text-sm font-medium focus:outline-none focus:border-gold-500 transition-colors placeholder:text-luxury-400 text-luxury-900 dark:text-luxury-100"
              />
            </div>
          </div>

          {/* Segmented Control Tabs */}
          <div className="flex items-center gap-2 p-1 bg-luxury-100/50 dark:bg-luxury-900/50 rounded-2xl w-max">
            <button
              onClick={() => setActiveTab('pending')}
              className={\`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all \${
                activeTab === 'pending' 
                  ? 'bg-white dark:bg-luxury-800 text-luxury-900 dark:text-luxury-50 shadow-sm' 
                  : 'text-luxury-500 hover:text-luxury-700 dark:hover:text-luxury-300'
              }\`}
            >
              <Clock size={16} />
              <span>{isAr ? 'بانتظار الإجراء' : 'Action Required'}</span>
              {pendingContracts.length > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-500 text-white text-[10px] ml-1">
                  {pendingContracts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('signed')}
              className={\`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all \${
                activeTab === 'signed' 
                  ? 'bg-white dark:bg-luxury-800 text-luxury-900 dark:text-luxury-50 shadow-sm' 
                  : 'text-luxury-500 hover:text-luxury-700 dark:hover:text-luxury-300'
              }\`}
            >
              <ShieldCheck size={16} />
              <span>{isAr ? 'المعتمدة' : 'Executed'}</span>
            </button>
          </div>

          {/* List Layout */}
          {filteredList.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredList.map((c, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={c.id}
                  onClick={() => handleSelectContract(c.id)}
                  className="group relative cursor-pointer bg-white dark:bg-luxury-900/40 border border-luxury-200 dark:border-luxury-800 hover:border-gold-500/50 rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/5 overflow-hidden"
                >
                  {/* Decorative line for pending */}
                  {!c.isSignedByClient && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 to-gold-600 dark:from-gold-500 dark:to-gold-700"></div>
                  )}

                  <div className="flex items-start sm:items-center gap-6 flex-1">
                    <div className={\`hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl shrink-0 transition-colors \${
                      c.isSignedByClient 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-gold-500/10 text-gold-600 dark:text-gold-400 group-hover:bg-gold-500/20'
                    }\`}>
                      {c.isSignedByClient ? <CheckCircle2 size={28} strokeWidth={1.5} /> : <FileText size={28} strokeWidth={1.5} />}
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-luxury-100 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400">
                          {c.referenceNumber}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-luxury-400 flex items-center gap-1">
                          <Calendar size={12} /> {c.dateCreated}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-luxury-900 dark:text-luxury-50 group-hover:text-gold-700 dark:group-hover:text-gold-400 transition-colors">
                        {isAr && c.titleAr ? c.titleAr : c.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-luxury-500 dark:text-luxury-400 font-medium max-w-2xl leading-relaxed line-clamp-1 sm:line-clamp-2">
                        {isAr && c.descriptionAr ? c.descriptionAr : c.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0 sm:pl-8 sm:border-l border-luxury-100 dark:border-luxury-800">
                    <div className="text-left sm:text-right">
                      <span className="block text-[10px] text-luxury-400 mb-0.5 uppercase tracking-wider">{t('contracts.value')}</span>
                      <span className="font-bold text-sm sm:text-base text-luxury-900 dark:text-luxury-50">
                        {c.totalValue ? \`\${c.totalValue.toLocaleString()} BHD\` : 'N/A'}
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      className={\`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all \${
                        c.isSignedByClient
                          ? 'bg-luxury-100 hover:bg-luxury-200 dark:bg-luxury-800 dark:hover:bg-luxury-700 text-luxury-900 dark:text-luxury-100'
                          : 'bg-luxury-900 hover:bg-luxury-800 dark:bg-white dark:hover:bg-luxury-100 text-white dark:text-luxury-900 shadow-md hover:shadow-lg hover:scale-105'
                      }\`}
                    >
                      {c.isSignedByClient ? <Eye size={16} /> : <PenTool size={16} />}
                      <span>{c.isSignedByClient ? (isAr ? 'عرض العقد' : 'View Document') : (isAr ? 'مراجعة وتوقيع' : 'Review & Sign')}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-luxury-200 dark:border-luxury-800 rounded-3xl bg-luxury-50/50 dark:bg-luxury-900/20">
              <div className="w-20 h-20 bg-luxury-100 dark:bg-luxury-800 rounded-full flex items-center justify-center mb-6">
                <FileText size={32} className="text-luxury-400" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
                {activeTab === 'pending' 
                  ? (isAr ? 'لا توجد مستندات معلقة' : 'No Pending Documents') 
                  : (isAr ? 'لا توجد مستندات معتمدة' : 'No Executed Documents')}
              </h3>
              <p className="text-luxury-500 max-w-sm text-sm">
                {activeTab === 'pending'
                  ? (isAr ? 'لم يتم إرسال أي عقود جديدة بانتظار اعتمادك وتوقيعك في الوقت الحالي.' : 'There are no new contracts pending your signature at this time.')
                  : (isAr ? 'بمجرد توقيعك على أي عقد سيتم حفظه وأرشفته هنا للرجوع إليه في أي وقت.' : 'Once you sign a contract, it will be securely archived here for your records.')}
              </p>
              {activeTab === 'pending' && signedContracts.length > 0 && (
                <button 
                  onClick={() => setActiveTab('signed')}
                  className="mt-8 px-6 py-2.5 rounded-full border border-luxury-300 dark:border-luxury-700 text-sm font-bold text-luxury-700 dark:text-luxury-300 hover:bg-luxury-100 dark:hover:bg-luxury-800 transition-colors"
                >
                  {isAr ? 'عرض العقود المعتمدة' : 'View Executed Contracts'}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
            VIEW 2: FULL-SCREEN IMMERSIVE CONTRACT VIEW`;

if (!code.match(view1Regex)) {
  console.log("Could not find the section to replace");
} else {
  const newCode = code.replace(view1Regex, newView1);
  fs.writeFileSync('src/pages/ContractsHub.tsx', newCode);
  console.log("Successfully replaced View 1");
}
