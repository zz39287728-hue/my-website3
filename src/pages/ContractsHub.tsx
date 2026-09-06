import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { ContractItem } from '../types';
import { PdfContractViewer } from '../components/PdfContractViewer';
import { 
  FileText, CheckCircle2, Clock, Stamp, Printer, RotateCcw, 
  ChevronRight, ChevronLeft, ShieldCheck, ArrowRight, 
  ArrowLeft, Search, Check, Building2, Calendar, 
  BadgeCheck, Award, Eye, PenTool, Maximize2, X, AlertCircle,
  Copy, CheckCheck, Send, Lock
} from 'lucide-react';

const DEFAULT_DRAWN_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="90" viewBox="0 0 300 90"><path d="M 25 55 Q 55 10, 85 45 T 145 35 T 195 55 T 255 25 M 75 50 Q 115 75, 175 60" fill="none" stroke="%23111827" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export const ContractsHub: React.FC = () => {
  const { t, lang, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const isAr = lang === 'ar';

  // Ensure contracts list exists with fallback
  const contracts: ContractItem[] = activeClient?.contracts && activeClient.contracts.length > 0 
    ? activeClient.contracts 
    : [
        {
          id: `con-def-1-${activeClient.profile.id}`,
          referenceNumber: 'ZA-CON-2024-001',
          title: 'Master Architectural & Interior Execution Agreement',
          titleAr: 'اتفاقية التصميم المعماري والديكور الداخلي الشامل',
          type: 'Architectural Design',
          typeAr: 'تصميم معماري وديكور داخلي',
          description: 'Comprehensive architectural spatial planning, 3D photorealistic visualization, and executive FF&E material specifications for the luxury residence.',
          descriptionAr: 'اتفاقية تقديم خدمات التصميم المعماري الداخلي، المخططات التنفيذية 2D، والمحاكاة ثلاثية الأبعاد 4K مع جداول توصيف المواد الفاخرة.',
          clauses: [
            '1. SCOPE OF WORK: The Studio agrees to provide comprehensive architectural and interior design services for the project as specified in the project charter.',
            '2. TIMELINE & DELIVERABLES: Studio commits to delivering phased milestones with scheduled revisions, estimated over the agreed duration.',
            '3. CONFIDENTIALITY & INTELLECTUAL PROPERTY: All customized spatial concepts and renderings remain proprietary until final handover.',
            '4. SETTLEMENT & TAX: Staged payments shall follow approved milestones subject to Kingdom of Bahrain 10% statutory VAT.'
          ],
          clausesAr: [
            '١. نطاق العمل: يلتزم استوديو زين بتقديم التصاميم المعمارية الداخلية والمخططات التنفيذية 2D/3D وفق معايير الجودة المعتمدة.',
            '٢. الجدول الزمني والمراحل: يلتزم الاستوديو بتسليم مخرجات كل مرحلة وفق الجدول الزمني المتفق عليه مع جولات المراجعة المحددة.',
            '٣. الملكية الفكرية والسرية: تعتبر كافة المخططات والتصورات ملكية فكرية محمية حتى اكتمال الاعتماد والوفاء بالالتزامات.',
            '٤. الدفعات والضرائب: تُسدد الدفعات حسب جدول المستخلصات المعتمد مع إضافة ضريبة القيمة المضافة ١٠٪ المعمول بها في مملكة البحرين.'
          ],
          totalValue: 8500,
          dateCreated: 'Oct 12, 2024',
          status: activeClient.contract.isSignedByClient ? 'Signed' : 'Pending',
          isSignedByClient: activeClient.contract.isSignedByClient,
          isSealedByArchitect: activeClient.contract.isSealedByArchitect,
          signedAt: activeClient.contract.isSignedByClient ? 'Oct 14, 2024 • 02:30 PM' : undefined,
          sealedAt: activeClient.contract.isSealedByArchitect ? 'Oct 15, 2024 • 11:00 AM' : undefined,
          signeeName: activeClient.profile.name,
          signatureDataUrl: activeClient.contract.isSignedByClient ? DEFAULT_DRAWN_SIGNATURE : undefined
        }
      ];

  const [activeTab, setActiveTab] = useState<'pending' | 'signed'>('pending');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'CONTRACTS') {
        setActiveTab('pending');
        setSelectedContractId(null);
        setSearchTerm('');
        setIsSigningPageOpen(false);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);
  // Initial state: NO contract is selected or open when the user first enters!
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [copiedRef, setCopiedRef] = useState(false);
  
  // Acknowledgment agreement checkbox state on contract page
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [agreeError, setAgreeError] = useState(false);

  // Dedicated Signature Page state
  const [isSigningPageOpen, setIsSigningPageOpen] = useState(false);
  const signCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const penWidth = 3.2;

  // Final Confirmation Modal state (هل أنت متأكد من أنك تريد إرسال هذا التوقيع؟)
  const [isConfirmSubmitModalOpen, setIsConfirmSubmitModalOpen] = useState(false);
  const [showSignedSuccess, setShowSignedSuccess] = useState(false);

  const pendingContracts = contracts.filter(c => !c.isSignedByClient);
  const signedContracts = contracts.filter(c => c.isSignedByClient);

  // Selected contract - only if explicit contract ID is selected!
  const selectedContract = selectedContractId 
    ? contracts.find(c => c.id === selectedContractId) || null 
    : null;

  // Reset agreement & signing states when switching selected contract
  useEffect(() => {
    setHasAgreedToTerms(false);
    setAgreeError(false);
    setIsSigningPageOpen(false);
    setIsConfirmSubmitModalOpen(false);
  }, [selectedContractId]);

  // Canvas resize and DPI scale setup for dedicated signature page
  const initSignCanvas = useCallback(() => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = penWidth;
      ctx.strokeStyle = '#000000';
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }, [penWidth]);

  // When dedicated signing page opens, initialize canvas after transition
  useEffect(() => {
    if (isSigningPageOpen) {
      setHasSignature(false);
      const timer = setTimeout(() => {
        initSignCanvas();
      }, 150);

      const handleResize = () => {
        initSignCanvas();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isSigningPageOpen, initSignCanvas]);

  // Drawing handlers with 1:1 coordinates
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = signCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!selectedContract || selectedContract.isSignedByClient) return;
    const canvas = signCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !signCanvasRef.current || !selectedContract || selectedContract.isSignedByClient) return;
    const canvas = signCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = signCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.closePath();
    }
  };

  const clearSignature = () => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSignature(false);
  };

  // Proceed to dedicated signing page after agreeing to contract terms
  const handleProceedToSigningPage = () => {
    if (globalState.isImpersonating) return; // Prevent signing when impersonating
    if (!hasAgreedToTerms) {
      setAgreeError(true);
      return;
    }
    setAgreeError(false);
    setIsSigningPageOpen(true);
  };

  // Submit button clicked inside signing page -> opens confirmation dialog
  const handleSubmitSignatureClick = () => {
    if (!hasSignature) return;
    setIsConfirmSubmitModalOpen(true);
  };

  // Final confirmed submit: saves signature and updates contract in globalState
  const handleFinalConfirmSubmit = () => {
    if (!selectedContract) return;
    const canvas = signCanvasRef.current;
    if (!canvas) return;

    const finalSignature = canvas.toDataURL('image/png');
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString(isAr ? 'ar-BH' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      const currentContracts = client.contracts && client.contracts.length > 0 ? client.contracts : contracts;
      const updatedContracts = currentContracts.map(c => {
        if (c.id === selectedContract.id) {
          return {
            ...c,
            status: 'Signed' as const,
            isSignedByClient: true,
            signedAt: formattedDate,
            signatureDataUrl: finalSignature,
            signeeName: client.profile.name
          };
        }
        return c;
      });

      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            contracts: updatedContracts,
            contract: {
              ...client.contract,
              isSignedByClient: true
            }
          }
        }
      };
    });

    setIsConfirmSubmitModalOpen(false);
    setIsSigningPageOpen(false);
    setShowSignedSuccess(true);
    setTimeout(() => {
      setShowSignedSuccess(false);
    }, 4500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectContract = (contractId: string) => {
    setSelectedContractId(contractId);
    setHasAgreedToTerms(false);
    setAgreeError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedContractId(null);
    setHasAgreedToTerms(false);
    setAgreeError(false);
  };

  const handleCopyRef = () => {
    if (!selectedContract) return;
    navigator.clipboard.writeText(selectedContract.referenceNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  // Filtered contracts list
  const activeList = activeTab === 'pending' ? pendingContracts : signedContracts;
  const filteredList = activeList.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(searchLower) ||
      (c.titleAr && c.titleAr.includes(searchTerm)) ||
      c.referenceNumber.toLowerCase().includes(searchLower) ||
      c.type.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-6xl mx-auto pb-24 space-y-8 relative">
      {/* Success Notification Banner */}
      <AnimatePresence>
        {showSignedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 shadow-lg"
          >
            <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-sm">
              <Check size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">{t('contracts.signSuccess')}</p>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                {isAr ? 'تم حفظ التوقيع الرقمي بنجاح وتوثيق العقد رسمياً في ملف مشروعك.' : 'Your digital signature was recorded and the contract is now officially executed.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          VIEW 1: NO CONTRACT SELECTED (USER SEES CONTRACTS CATALOG / DIRECTORY ONLY)
          ========================================================================= */}
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'pending' 
                  ? 'bg-white dark:bg-luxury-800 text-luxury-900 dark:text-luxury-50 shadow-sm' 
                  : 'text-luxury-500 hover:text-luxury-700 dark:hover:text-luxury-300'
              }`}
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'signed' 
                  ? 'bg-white dark:bg-luxury-800 text-luxury-900 dark:text-luxury-50 shadow-sm' 
                  : 'text-luxury-500 hover:text-luxury-700 dark:hover:text-luxury-300'
              }`}
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
                    <div className={`hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl shrink-0 transition-colors ${
                      c.isSignedByClient 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-gold-500/10 text-gold-600 dark:text-gold-400 group-hover:bg-gold-500/20'
                    }`}>
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
                        {c.totalValue ? `${c.totalValue.toLocaleString()} BHD` : 'N/A'}
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                        c.isSignedByClient
                          ? 'bg-luxury-100 hover:bg-luxury-200 dark:bg-luxury-800 dark:hover:bg-luxury-700 text-luxury-900 dark:text-luxury-100'
                          : 'bg-luxury-900 hover:bg-luxury-800 dark:bg-white dark:hover:bg-luxury-100 text-white dark:text-luxury-900 shadow-md hover:shadow-lg hover:scale-105'
                      }`}
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
            VIEW 2: FULL-SCREEN IMMERSIVE CONTRACT VIEW
            تأخذ الشاشة بالكامل، القوائم الجانبية وصورة البروفايل تختفي تماماً
            فقط يوجد زر واحد للرجوع إلى قائمة العقود
            ========================================================================= */
        <div className="fixed inset-0 z-50 bg-luxury-100 dark:bg-luxury-950 overflow-y-auto w-screen h-screen flex flex-col text-luxury-900 dark:text-luxury-100">
          {/* Top Navigation & Action Bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 bg-white/95 dark:bg-luxury-900/95 backdrop-blur-md px-6 py-3.5 border-b border-luxury-200 dark:border-luxury-800 shadow-xs sticky top-0 z-40">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-luxury-100 hover:bg-luxury-200 dark:bg-luxury-800 dark:hover:bg-luxury-700 text-luxury-800 dark:text-luxury-200 transition-colors group cursor-pointer"
            >
              {isAr ? <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />}
              <span>{isAr ? 'رجوع إلى قائمة العقود' : 'Back to Contracts'}</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Copy Reference Button */}
              <button
                type="button"
                onClick={handleCopyRef}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-luxury-100 hover:bg-luxury-200 dark:bg-luxury-800 dark:hover:bg-luxury-700 text-luxury-700 dark:text-luxury-300 border border-luxury-200 dark:border-luxury-700 transition-colors cursor-pointer"
                title={isAr ? 'نسخ الرقم المرجعي للعقد' : 'Copy Contract Reference'}
              >
                {copiedRef ? <CheckCheck size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
                <span>{selectedContract.referenceNumber}</span>
                {copiedRef && <span className="text-[10px] text-emerald-600 font-sans font-bold">{isAr ? 'تم النسخ' : 'Copied'}</span>}
              </button>

              {selectedContract.isSignedByClient ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={14} />
                  {selectedContract.isSealedByArchitect ? (isAr ? 'مختوم ومعتمد' : 'Executed & Sealed') : (isAr ? 'تم توقيعك' : 'Signed')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  <Clock size={14} />
                  {isAr ? 'بانتظار توقيعك' : 'Pending Signature'}
                </span>
              )}

              <Button variant="outline" onClick={handlePrint} className="py-1.5 px-3 text-xs flex items-center gap-1.5">
                <Printer size={14} />
                <span>{t('contracts.pdf')}</span>
              </Button>
            </div>
          </div>

          {/* Full Contract Document Paper Container - Exploiting Immersive Canvas */}
          <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-8 lg:p-12 mb-16 space-y-8 lg:space-y-10 print:p-0">
            {/* Official PDF Document Viewer replacing raw text paper */}
            <PdfContractViewer
              contract={selectedContract}
              clientName={activeClient.profile.name}
              clientLocation={activeClient.profile.location || (isAr ? 'المنامة، مملكة البحرين' : 'Manama, Bahrain')}
              clientProject={activeClient.profile.project}
              isAr={isAr}
              onDownloadPdf={handlePrint}
              onPrint={handlePrint}
            />

            {/* Bottom Actions Card Container - ONLY shown when pending signature */}
            {!selectedContract.isSignedByClient && (
              <div className="relative w-full bg-white dark:bg-luxury-900 rounded-2xl sm:rounded-3xl border border-luxury-200 dark:border-luxury-800 shadow-xl p-6 sm:p-10 space-y-8">
                <div className="relative z-10 space-y-8">
                  <div className="space-y-6">
                    {/* Terms Agreement Checkbox */}
                    <div 
                      onClick={() => {
                        setHasAgreedToTerms(!hasAgreedToTerms);
                        setAgreeError(false);
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 select-none ${
                        hasAgreedToTerms 
                          ? 'bg-gold-50/50 dark:bg-gold-900/10 border-gold-500 text-luxury-900 dark:text-luxury-100 shadow-sm' 
                          : agreeError
                            ? 'bg-red-50 dark:bg-red-900/10 border-red-500'
                            : 'bg-luxury-50 dark:bg-luxury-900/50 border-luxury-200 dark:border-luxury-800 hover:border-gold-500/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                        hasAgreedToTerms 
                          ? 'bg-gold-600 text-white' 
                          : 'border border-luxury-300 dark:border-luxury-600 bg-white dark:bg-luxury-950'
                      }`}>
                        {hasAgreedToTerms && <Check size={14} className="stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-luxury-900 dark:text-luxury-100">
                          {isAr 
                            ? 'أقر باطلاعي وموافقتي على جميع بنود وشروط هذا العقد.' 
                            : 'I have read and agree to all terms and conditions of this contract.'}
                        </p>
                      </div>
                    </div>

                    {agreeError && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5 px-1 animate-pulse">
                        <AlertCircle size={14} />
                        <span>{isAr ? 'يرجى الموافقة على الشروط أولاً' : 'Please accept the terms first'}</span>
                      </p>
                    )}

                    {/* ONLY ONE BUTTON: المواصلة للتوقيع */}
                    <div className="pt-2 flex justify-end">
                      {globalState.isImpersonating ? (
                        <div className="text-center w-full sm:w-auto px-6 py-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 font-bold text-sm">
                          {isAr ? 'عذراً، لا يمكن توقيع العقود نيابة عن العميل.' : 'Signing contracts on behalf of the client is disabled.'}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleProceedToSigningPage}
                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-md bg-luxury-900 hover:bg-luxury-800 dark:bg-white dark:hover:bg-luxury-100 dark:text-luxury-900 text-white cursor-pointer transition-all"
                        >
                          <span>{isAr ? 'توقيع العقد' : 'Sign Contract'}</span>
                          {isAr ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          DEDICATED FULL-SCREEN SIGNING PAGE (صفحة أخرى مخصصة فيها التوقيع فقط)
          ========================================================================= */}
      <AnimatePresence>
        {isSigningPageOpen && selectedContract && (
          <div className="fixed inset-0 z-[60] bg-luxury-100 dark:bg-luxury-950 overflow-y-auto flex flex-col w-screen h-screen">
            {/* Top Bar with Single Back to Review Button */}
            <div className="sticky top-0 z-30 bg-white/95 dark:bg-luxury-900/95 backdrop-blur-md border-b border-luxury-200 dark:border-luxury-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
              <button
                type="button"
                onClick={() => setIsSigningPageOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-luxury-100 hover:bg-luxury-200 dark:bg-luxury-800 dark:hover:bg-luxury-700 text-luxury-900 dark:text-luxury-100 border border-luxury-300 dark:border-luxury-700 transition-all cursor-pointer shadow-xs group"
              >
                {isAr ? <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />}
                <span>{isAr ? 'العودة إلى مراجعة بنود العقد' : 'Back to Contract Review'}</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-luxury-500 hidden sm:inline">
                  #{selectedContract.referenceNumber}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 border border-gold-500/20">
                  <PenTool size={13} />
                  <span>{isAr ? 'صفحة التوقيع المعتمد' : 'Official Signing'}</span>
                </span>
              </div>
            </div>

            {/* Dedicated Signing Page Content */}
            <div className="flex-1 w-full max-w-xl mx-auto p-4 sm:p-8 flex flex-col justify-center space-y-6 my-auto">
              {/* Contract Summary Card */}
              <div className="px-5 py-4 rounded-2xl bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-luxury-900 dark:text-luxury-100">
                    {isAr && selectedContract.titleAr ? selectedContract.titleAr : selectedContract.title}
                  </h3>
                </div>
                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-luxury-100 dark:border-luxury-800">
                  <span className="font-bold text-xs text-gold-700 dark:text-gold-400">
                    {selectedContract.signeeName || activeClient.profile.name}
                  </span>
                </div>
              </div>

              {/* Square Signature Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 shadow-xl space-y-6 text-center">
                <div>
                  <h2 className="font-bold text-lg text-luxury-900 dark:text-luxury-100">
                    {isAr ? 'التوقيع الرقمي' : 'Digital Signature'}
                  </h2>
                  <p className="text-xs text-luxury-500 mt-1">
                    {isAr ? 'ارسم توقيعك في المربع أدناه' : 'Draw your signature below'}
                  </p>
                </div>

                {/* Square Signature Canvas */}
                <div className="relative w-full max-w-[320px] aspect-square mx-auto rounded-2xl border-2 border-dashed border-luxury-300 dark:border-luxury-500 bg-white overflow-hidden">
                  <canvas
                    ref={signCanvasRef}
                    className="w-full h-full cursor-crosshair touch-none select-none bg-transparent"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />

                  {!hasSignature && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-luxury-400 select-none space-y-2 p-4 text-center">
                      <PenTool size={24} className="opacity-40" />
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center pointer-events-none border-t border-luxury-200/60 pt-1.5 text-[10px] text-luxury-400 font-mono">
                    <span>X __________</span>
                  </div>
                </div>

                {/* Canvas Actions: Clear Button */}
                <div className="flex items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={clearSignature}
                    disabled={!hasSignature}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-luxury-100 hover:bg-red-50 dark:bg-luxury-800 dark:hover:bg-red-950/40 text-luxury-700 dark:text-luxury-300 hover:text-red-600 dark:hover:text-red-400 transition-colors text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>{isAr ? 'مسح وإعادة الرسم' : 'Clear & Redraw'}</span>
                  </button>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSubmitSignatureClick}
                    disabled={!hasSignature}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      hasSignature
                        ? 'bg-luxury-900 hover:bg-luxury-800 dark:bg-white dark:hover:bg-luxury-100 dark:text-luxury-900 text-white shadow-md cursor-pointer'
                        : 'bg-luxury-100 dark:bg-luxury-800 text-luxury-400 dark:text-luxury-600 cursor-not-allowed'
                    }`}
                  >
                    <Check size={16} />
                    <span>{isAr ? 'اعتماد التوقيع' : 'Confirm Signature'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          FINAL CONFIRMATION MODAL: هل أنت متأكد من أنك تريد إرسال هذا التوقيع؟
          ========================================================================= */}
      <AnimatePresence>
        {isConfirmSubmitModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmSubmitModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative z-10 w-full max-w-sm bg-white dark:bg-luxury-900 rounded-3xl border border-luxury-200 dark:border-luxury-800 shadow-2xl p-6 text-center space-y-6"
            >
              <div className="w-12 h-12 rounded-full bg-luxury-100 dark:bg-luxury-800 text-luxury-900 dark:text-luxury-100 mx-auto flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg text-luxury-900 dark:text-luxury-100">
                  {isAr ? 'تأكيد الاعتماد' : 'Confirm Approval'}
                </h3>
                <p className="text-sm text-luxury-600 dark:text-luxury-400">
                  {isAr 
                    ? 'هل أنت متأكد من رغبتك في توقيع هذا العقد؟ بمجرد التأكيد، يعتبر العقد معتمداً ولا يمكن التراجع عن هذه الخطوة.' 
                    : 'Are you sure you want to sign this contract? Once confirmed, this action cannot be undone.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmSubmitModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-luxury-100 hover:bg-luxury-200 dark:bg-luxury-800 dark:hover:bg-luxury-700 text-luxury-700 dark:text-luxury-300 transition-colors cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={handleFinalConfirmSubmit}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-luxury-900 hover:bg-luxury-800 dark:bg-white dark:hover:bg-luxury-100 dark:text-luxury-900 text-white transition-colors cursor-pointer"
                >
                  {isAr ? 'تأكيد الاعتماد' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
