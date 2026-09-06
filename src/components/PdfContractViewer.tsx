import React, { useState, useRef } from 'react';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Printer, 
  Maximize2, 
  Minimize2, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  Layers, 
  Compass, 
  Upload, 
  ExternalLink,
  Eye,
  RotateCw
} from 'lucide-react';
import { ContractItem } from '../types';

interface PdfContractViewerProps {
  contract: ContractItem;
  clientName: string;
  clientLocation: string;
  clientProject: string;
  isAr: boolean;
  onDownloadPdf?: () => void;
  onPrint?: () => void;
}

export const PdfContractViewer: React.FC<PdfContractViewerProps> = ({
  contract,
  clientName,
  clientLocation,
  clientProject,
  isAr,
  onDownloadPdf,
  onPrint
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 3;
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [rotation, setRotation] = useState<number>(0);
  const [customPdfFile, setCustomPdfFile] = useState<string | null>(null);
  const [useRawPdfEmbed, setUseRawPdfEmbed] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 15, 160));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 15, 70));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Custom file upload handler (for engineer/user testing actual uploaded PDF)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setCustomPdfFile(url);
      setUseRawPdfEmbed(true);
    }
  };

  // Generate downloadable sample PDF blob or fallback print
  const handleTriggerDownload = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
      return;
    }
    // Fallback: trigger print dialog for saving as PDF
    window.print();
  };

  const handleTriggerPrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    window.print();
  };

  const filename = `${contract.referenceNumber || 'CONTRACT'}_OFFICIAL_ZAINTERIOR.pdf`;

  return (
    <div className="w-full flex flex-col rounded-2xl sm:rounded-3xl border-2 border-zinc-700/60 dark:border-zinc-800 shadow-2xl overflow-hidden bg-zinc-900 text-zinc-100">
      {/* =========================================================================
          PDF READER HEADER & CONTROLS TOOLBAR
          ========================================================================= */}
      <div className="bg-[#24272b] dark:bg-[#1a1c1e] border-b border-zinc-700/80 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Left / Document metadata */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center flex-shrink-0 font-bold text-xs">
            PDF
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs sm:text-sm text-zinc-100 truncate max-w-[220px] sm:max-w-[340px]">
                {filename}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={10} />
                {isAr ? 'نسخة رسمية معتمدة' : 'Official Document'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate">
              {isAr 
                ? '3 صفحات • 2.8 ميجابايت • مُرفق بواسطة المهندسة زين العوضي' 
                : '3 Pages • 2.8 MB • Uploaded by Principal Architect Zain Al-Alawi'}
            </p>
          </div>
        </div>

        {/* Center / Navigation & Page controls */}
        {!useRawPdfEmbed && (
          <div className="flex items-center gap-1 sm:gap-2 bg-[#1b1d20] px-2 py-1 rounded-xl border border-zinc-700/60 text-xs">
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || viewMode === 'all'}
              className="p-1.5 rounded-lg hover:bg-zinc-700/50 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title={isAr ? 'الصفحة السابقة' : 'Previous Page'}
            >
              <ChevronRight size={16} className={isAr ? '' : 'rotate-180'} />
            </button>

            <span className="font-mono text-zinc-200 px-2 font-medium">
              {viewMode === 'all' 
                ? (isAr ? 'جميع الصفحات (1 - 3)' : 'All Pages (1-3)')
                : `${isAr ? 'صفحة' : 'Page'} ${currentPage} / ${totalPages}`}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || viewMode === 'all'}
              className="p-1.5 rounded-lg hover:bg-zinc-700/50 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title={isAr ? 'الصفحة التالية' : 'Next Page'}
            >
              <ChevronLeft size={16} className={isAr ? '' : 'rotate-180'} />
            </button>

            <span className="w-px h-4 bg-zinc-700 mx-1 hidden sm:block"></span>

            {/* Toggle Single vs All pages */}
            <button
              type="button"
              onClick={() => setViewMode(prev => prev === 'single' ? 'all' : 'single')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                viewMode === 'all' 
                  ? 'bg-gold-500/30 text-gold-300 border border-gold-500/50' 
                  : 'hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers size={13} />
              <span>{viewMode === 'all' ? (isAr ? 'عرض صفحة مفردة' : 'Single Page') : (isAr ? 'عرض متتالي' : 'Continuous')}</span>
            </button>
          </div>
        )}

        {/* Right / Zoom & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls */}
          {!useRawPdfEmbed && (
            <div className="hidden lg:flex items-center gap-1 bg-[#1b1d20] px-2 py-1 rounded-xl border border-zinc-700/60 text-xs">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 70}
                className="p-1.5 rounded-lg hover:bg-zinc-700/50 disabled:opacity-30 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title={isAr ? 'تصغير' : 'Zoom Out'}
              >
                <ZoomOut size={15} />
              </button>
              
              <button
                type="button"
                onClick={handleResetZoom}
                className="font-mono text-zinc-200 text-xs px-2 hover:text-gold-400 transition-colors cursor-pointer"
                title={isAr ? 'إعادة ضبط 100%' : 'Reset 100%'}
              >
                {zoomLevel}%
              </button>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 160}
                className="p-1.5 rounded-lg hover:bg-zinc-700/50 disabled:opacity-30 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title={isAr ? 'تكبير' : 'Zoom In'}
              >
                <ZoomIn size={15} />
              </button>

              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 rounded-lg hover:bg-zinc-700/50 text-zinc-300 hover:text-white transition-colors cursor-pointer ml-1"
                title={isAr ? 'تدوير الصفحة' : 'Rotate'}
              >
                <RotateCw size={14} />
              </button>
            </div>
          )}

          {/* Upload alternate PDF test button */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="application/pdf" 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title={isAr ? 'استعراض ملف PDF آخر' : 'Upload & View PDF'}
          >
            <Upload size={15} />
          </button>

          {/* Print button */}
          <button
            type="button"
            onClick={handleTriggerPrint}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title={isAr ? 'طباعة العقد' : 'Print PDF'}
          >
            <Printer size={15} />
          </button>

          {/* Download PDF button */}
          <button
            type="button"
            onClick={handleTriggerDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            title={isAr ? 'تحميل ملف الـ PDF' : 'Download PDF File'}
          >
            <Download size={14} />
            <span className="hidden sm:inline">{isAr ? 'تحميل PDF' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PDF VIEWER CANVAS VIEWPORT (مستعرض الصفحات)
          ========================================================================= */}
      <div 
        className="w-full bg-[#383b40] dark:bg-[#151719] p-4 sm:p-8 lg:p-12 overflow-x-auto min-h-[680px] max-h-[900px] overflow-y-auto flex flex-col items-center gap-8 relative select-text"
        style={{ perspective: '1000px' }}
      >
        {/* If user uploaded an external PDF file, display iframe fallback */}
        {useRawPdfEmbed && customPdfFile ? (
          <div className="w-full h-[750px] bg-white rounded-xl shadow-2xl overflow-hidden relative">
            <div className="p-3 bg-zinc-800 text-xs flex justify-between items-center text-zinc-200">
              <span>{isAr ? 'ملف PDF مخصص مرفق' : 'Custom Attached PDF Document'}</span>
              <button 
                onClick={() => setUseRawPdfEmbed(false)}
                className="text-gold-400 hover:underline cursor-pointer"
              >
                {isAr ? 'العودة لمستعرض الأتيليه' : 'Return to Atelier Viewer'}
              </button>
            </div>
            <iframe 
              src={customPdfFile} 
              title="Custom Contract PDF" 
              className="w-full h-[700px] border-none"
            />
          </div>
        ) : (
          /* Render High-Fidelity Vector Architectural PDF Pages */
          <div 
            className="flex flex-col items-center gap-10 transition-transform duration-200 ease-out origin-top"
            style={{ 
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center'
            }}
          >
            {/* -------------------------------------------------------------
                PAGE 1: Official Agreement & Contracting Parties Matrix
                ------------------------------------------------------------- */}
            {(viewMode === 'all' || currentPage === 1) && (
              <div 
                id="pdf-page-1"
                className="w-full max-w-[950px] min-h-[1200px] bg-[#fcfcfb] text-[#1a1a1a] shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-neutral-300 relative flex flex-col justify-between p-10 sm:p-14 lg:p-16 select-text transition-all duration-300"
                style={{ fontFamily: "'Outfit', 'Tajawal', sans-serif" }}
              >
                {/* PDF Paper Running Header */}
                <div className="border-b-2 border-neutral-800 pb-5 mb-8 flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[#8b6938] font-serif font-bold text-sm tracking-wider uppercase">
                      <Building2 size={20} />
                      <span>ZAINTERIOR ARCHITECTURAL ATELIER W.L.L.</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      KINGDOM OF BAHRAIN • COMMERCIAL REGISTRATION #94821-01 • CRPEP LICENSED ARCHITECTURAL FIRM
                    </p>
                  </div>

                  {/* Official Stamp & Reference Code */}
                  <div className="text-right">
                    <div className="inline-block border border-neutral-400 rounded px-2.5 py-1 bg-neutral-100 text-neutral-800 font-mono text-xs font-bold">
                      REF: {contract.referenceNumber}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-1">
                      ISSUE DATE: {contract.dateCreated}
                    </div>
                  </div>
                </div>

                {/* Document Title Header with Atelier Gold Seal */}
                <div className="relative z-10 mb-8">
                  <div className="flex justify-between items-start gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#8b6938]/10 border border-[#8b6938]/30 text-[#8b6938] text-xs font-bold uppercase tracking-widest">
                        <Sparkles size={12} />
                        <span>{isAr && contract.typeAr ? contract.typeAr : contract.type}</span>
                      </div>
                      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 leading-tight">
                        {isAr && contract.titleAr ? contract.titleAr : contract.title}
                      </h1>
                      <p className="text-xs sm:text-sm text-neutral-600 font-mono">
                        STANDARDIZED ARCHITECTURAL & INTERIOR DESIGN CONTRACT (BAHRAIN FIDIC ADAPTATION)
                      </p>
                    </div>

                    {/* Official Embossed Gold/Red Seal */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-dashed border-[#8b6938] bg-[#f8f5ee] flex flex-col items-center justify-center p-2 text-center text-[#8b6938] shadow-inner flex-shrink-0 select-none rotate-[-6deg]">
                      <Compass size={24} className="mb-0.5" />
                      <span className="text-[8px] font-bold tracking-widest uppercase">KINGDOM OF BAHRAIN</span>
                      <span className="text-[7px] font-extrabold">OFFICIAL SEAL</span>
                      <span className="text-[6px] text-neutral-500 font-mono">CRPEP #94821</span>
                    </div>
                  </div>
                </div>

                {/* Watermark across paper */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035] select-none uppercase font-serif text-8xl sm:text-9xl font-black rotate-[-30deg] tracking-widest text-neutral-900">
                  ZAINTERIOR
                </div>

                {/* Parties Matrix (الطرف الأول والطرف الثاني) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 relative z-10">
                  {/* First Party */}
                  <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-300 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                      {isAr ? 'الطرف الأول (استوديو التصميم المعماري):' : 'FIRST PARTY (ARCHITECTURAL ATELIER):'}
                    </span>
                    <h4 className="font-serif font-bold text-base text-neutral-900">
                      ZAINTERIOR ATELIER W.L.L.
                    </h4>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      {isAr 
                        ? 'ممثلة بالمهندسة المعمارية الرئيسية: زين العوضي • سجل تجاري 94821-01 • المنامة، مملكة البحرين.' 
                        : 'Represented by Principal Architect Zain Al-Alawi • CR 94821-01 • Manama, Kingdom of Bahrain.'}
                    </p>
                  </div>

                  {/* Second Party */}
                  <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-300 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                      {isAr ? 'الطرف الثاني (العميل صاحب المشروع):' : 'SECOND PARTY (THE CLIENT):'}
                    </span>
                    <h4 className="font-serif font-bold text-base text-neutral-900">
                      {clientName}
                    </h4>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      {clientProject} • {clientLocation || (isAr ? 'مملكة البحرين' : 'Kingdom of Bahrain')}
                    </p>
                  </div>
                </div>

                {/* Scope & Preamble Section */}
                <div className="space-y-3 mb-8 relative z-10">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-neutral-900 flex items-center gap-2 border-b border-neutral-300 pb-2">
                    <span className="w-2 h-2 rounded-full bg-[#8b6938]"></span>
                    <span>{isAr ? 'تمهيد ونطاق الأعمال الهندسية والاستشارية:' : 'PREAMBLE & SCOPE OF ARCHITECTURAL WORKS:'}</span>
                  </h3>
                  <div className="p-5 rounded-xl bg-neutral-50/80 border border-neutral-300 text-xs sm:text-sm text-neutral-800 leading-relaxed font-serif">
                    {isAr && contract.descriptionAr ? contract.descriptionAr : contract.description}
                  </div>
                </div>

                {/* Primary Legal Articles Summary */}
                <div className="space-y-3 mb-8 relative z-10">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-neutral-900 flex items-center gap-2 border-b border-neutral-300 pb-2">
                    <span className="w-2 h-2 rounded-full bg-[#8b6938]"></span>
                    <span>{isAr ? 'أهم البنود والالتزامات التنفيذية (الصفحة 1):' : 'KEY EXECUTIVE PROVISIONS (PAGE 1):'}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="font-bold text-[#8b6938] block mb-1">§1 {isAr ? 'التزامات الإشراف الميداني' : 'Field Supervision Mandate'}</span>
                      <p className="text-neutral-700 leading-normal">
                        {isAr 
                          ? 'يقوم الفريق الهندسي بزيارات تفقدية دورية مجدولة وفجائية لمطابقة التنفيذ الفعلي مع المخططات.' 
                          : 'Engineering team conducts scheduled and surprise site audits to assure adherence to specifications.'}
                      </p>
                    </div>
                    <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200">
                      <span className="font-bold text-[#8b6938] block mb-1">§2 {isAr ? 'المطابقة الهندسية ومخاطبة المقاول' : 'Contractor Compliance Directives'}</span>
                      <p className="text-neutral-700 leading-normal">
                        {isAr 
                          ? 'التعليمات الهندسية الصادرة من الاستوديو للمقاول ملزمة تماماً لضمان السلامة الإنشائية وجودة التشطيب.' 
                          : 'Directives issued to site builders are mandatory to prevent any structural or aesthetic deviations.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Page 1 Running Footer */}
                <div className="pt-6 border-t-2 border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 font-mono relative z-10 mt-auto">
                  <div className="flex items-center gap-3">
                    <QrCode size={20} className="text-neutral-800" />
                    <span>VERIFY: HTTPS://PORTAL.ZAINTERIOR.COM/VERIFY/{contract.referenceNumber}</span>
                  </div>
                  <div>PAGE 1 OF {totalPages} • OFFICIAL LEGAL CONTRACT</div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                PAGE 2: CAD Architectural Blueprints & Payment Milestone Matrix
                ------------------------------------------------------------- */}
            {(viewMode === 'all' || currentPage === 2) && (
              <div 
                id="pdf-page-2"
                className="w-full max-w-[950px] min-h-[1200px] bg-[#fcfcfb] text-[#1a1a1a] shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-neutral-300 relative flex flex-col justify-between p-10 sm:p-14 lg:p-16 select-text transition-all duration-300"
                style={{ fontFamily: "'Outfit', 'Tajawal', sans-serif" }}
              >
                {/* Running Header */}
                <div className="border-b border-neutral-400 pb-3 mb-6 flex justify-between items-center text-[10px] font-mono text-neutral-600">
                  <span>ZAINTERIOR ARCHITECTURAL ATELIER • ANNEX A: TECHNICAL SCHEDULE</span>
                  <span>REF: {contract.referenceNumber}</span>
                </div>

                {/* Title & Section */}
                <div className="mb-6">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
                    {isAr ? 'الملحق الفني: المواصفات المعمارية وجدول الدفعات' : 'ANNEX A: TECHNICAL DELIVERABLES & PAYMENT SCHEDULE'}
                  </h2>
                  <p className="text-xs text-neutral-600 font-mono">
                    ENGINEERING SPECIFICATIONS, CAD DELIVERABLES AND STATUTORY BAHRAIN VAT BREAKDOWN
                  </p>
                </div>

                {/* Architectural Blueprint / CAD Drawing Plate Simulation */}
                <div className="mb-8 p-5 bg-[#0f1d2a] rounded-xl border-2 border-sky-900/60 text-sky-100 relative overflow-hidden shadow-inner select-none">
                  <div className="flex justify-between items-center border-b border-sky-800/80 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></div>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-300">
                        {isAr ? 'المخطط الهندسي المعتمد (CAD DRAWING SHEET)' : 'APPROVED ARCHITECTURAL CAD PLATE #A-102'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-400">SCALE: 1:100 • 3D BIM LEVEL 3</span>
                  </div>

                  {/* Architectural Blueprint Vector Grid Drawing */}
                  <div className="relative h-44 sm:h-52 w-full border border-sky-800/50 rounded-lg flex items-center justify-center bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:16px_16px]">
                    {/* SVG Vector Floorplan & Elevation Lines */}
                    <svg className="w-full h-full p-4 stroke-sky-400/80 fill-none" viewBox="0 0 600 200">
                      {/* Grid Axis lines */}
                      <line x1="20" y1="20" x2="580" y2="20" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="20" y1="180" x2="580" y2="180" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="50" y1="10" x2="50" y2="190" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="300" y1="10" x2="300" y2="190" strokeWidth="0.5" strokeDasharray="4 4" />
                      <line x1="550" y1="10" x2="550" y2="190" strokeWidth="0.5" strokeDasharray="4 4" />

                      {/* Main Villa Structure Outline */}
                      <rect x="70" y="40" width="460" height="120" strokeWidth="2" stroke="white" />
                      <rect x="90" y="60" width="180" height="80" strokeWidth="1.2" stroke="#38bdf8" />
                      <rect x="290" y="60" width="220" height="80" strokeWidth="1.2" stroke="#38bdf8" />
                      
                      {/* Architectural Room Labels */}
                      <text x="140" y="105" fill="#bae6fd" fontSize="10" fontFamily="monospace" textAnchor="middle">GRAND FOYER / MAJLIS</text>
                      <text x="400" y="105" fill="#bae6fd" fontSize="10" fontFamily="monospace" textAnchor="middle">MASTER LIVING SUITE & PATIO</text>

                      {/* Dimension lines with tick marks */}
                      <line x1="70" y1="30" x2="530" y2="30" strokeWidth="1" stroke="#facc15" />
                      <line x1="70" y1="25" x2="70" y2="35" strokeWidth="1" stroke="#facc15" />
                      <line x1="530" y1="25" x2="530" y2="35" strokeWidth="1" stroke="#facc15" />
                      <text x="300" y="27" fill="#facc15" fontSize="9" fontFamily="monospace" textAnchor="middle">DIMENSION: 24.50 M</text>
                    </svg>

                    {/* Cad Stamp corner box */}
                    <div className="absolute bottom-2 right-2 bg-sky-950/90 border border-sky-600 px-3 py-1.5 rounded text-left font-mono text-[9px] text-sky-200">
                      <div>CLIENT: {clientName}</div>
                      <div>PROJECT: {clientProject}</div>
                      <div>APPROVED BY: PRINCIPAL ARCHITECT ZAIN</div>
                    </div>
                  </div>
                </div>

                {/* Milestone Payment Schedule Table */}
                <div className="space-y-3 mb-8">
                  <h3 className="font-serif font-bold text-base text-neutral-900 flex items-center justify-between border-b border-neutral-300 pb-2">
                    <span>{isAr ? 'جدول الدفعات والمستخلصات المرحلية:' : 'CONTRACT VALUE & MILESTONE SCHEDULE:'}</span>
                    <span className="font-mono text-xs text-[#8b6938] font-bold">
                      {contract.totalValue ? `${contract.totalValue.toLocaleString()} BHD` : 'N/A'}
                    </span>
                  </h3>

                  <div className="overflow-hidden rounded-xl border border-neutral-300">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-neutral-100 border-b border-neutral-300 font-mono text-neutral-700">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">{isAr ? 'المرحلة الهندسية' : 'Milestone Stage'}</th>
                          <th className="p-3 text-center">{isAr ? 'النسبة' : '% Due'}</th>
                          <th className="p-3 text-right">{isAr ? 'القيمة (د.ب)' : 'Amount (BHD)'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 bg-white font-serif text-neutral-800">
                        <tr>
                          <td className="p-3 font-mono font-bold">01</td>
                          <td className="p-3">{isAr ? 'الدفعة المقدمة واعتماد الدراسات الأولية' : 'Initial Mobilization & Schematic Approval'}</td>
                          <td className="p-3 text-center font-mono">25%</td>
                          <td className="p-3 text-right font-mono font-bold">{contract.totalValue ? (contract.totalValue * 0.25).toLocaleString() : '700'} BHD</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold">02</td>
                          <td className="p-3">{isAr ? 'اعتماد المخططات التنفيذية والـ 3D التفصيلي' : 'Executive Drawings & 3D Realistic Renders'}</td>
                          <td className="p-3 text-center font-mono">35%</td>
                          <td className="p-3 text-right font-mono font-bold">{contract.totalValue ? (contract.totalValue * 0.35).toLocaleString() : '980'} BHD</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold">03</td>
                          <td className="p-3">{isAr ? 'الإشراف على التنفيذ الإنشائي والمطابقة' : 'On-Site Execution Supervision & Milestones'}</td>
                          <td className="p-3 text-center font-mono">25%</td>
                          <td className="p-3 text-right font-mono font-bold">{contract.totalValue ? (contract.totalValue * 0.25).toLocaleString() : '700'} BHD</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold">04</td>
                          <td className="p-3">{isAr ? 'التسليم النهائي وإقرار الجودة الهندسية' : 'Final Commissioning & Handover Protocol'}</td>
                          <td className="p-3 text-center font-mono">15%</td>
                          <td className="p-3 text-right font-mono font-bold">{contract.totalValue ? (contract.totalValue * 0.15).toLocaleString() : '420'} BHD</td>
                        </tr>
                        <tr className="bg-neutral-50 font-bold border-t-2 border-neutral-300">
                          <td colSpan={3} className="p-3 text-right font-sans">
                            {isAr ? 'الإجمالي قبل الضريبة (خاضع لـ 10% ضريبة القيمة المضافة):' : 'Total Valuation (Subject to statutory 10% VAT):'}
                          </td>
                          <td className="p-3 text-right font-mono text-[#8b6938] text-sm">
                            {contract.totalValue ? `${contract.totalValue.toLocaleString()} BHD` : '2,800 BHD'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Page 2 Running Footer */}
                <div className="pt-6 border-t-2 border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 font-mono relative z-10 mt-auto">
                  <div>ANNEX A • TECHNICAL CAD SPECIFICATIONS</div>
                  <div>PAGE 2 OF {totalPages} • OFFICIAL LEGAL CONTRACT</div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                PAGE 3: Legal Clauses, Bahrain Arbitration & Formal Signatures
                ------------------------------------------------------------- */}
            {(viewMode === 'all' || currentPage === 3) && (
              <div 
                id="pdf-page-3"
                className="w-full max-w-[950px] min-h-[1200px] bg-[#fcfcfb] text-[#1a1a1a] shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-neutral-300 relative flex flex-col justify-between p-10 sm:p-14 lg:p-16 select-text transition-all duration-300"
                style={{ fontFamily: "'Outfit', 'Tajawal', sans-serif" }}
              >
                {/* Running Header */}
                <div className="border-b border-neutral-400 pb-3 mb-6 flex justify-between items-center text-[10px] font-mono text-neutral-600">
                  <span>ZAINTERIOR ARCHITECTURAL ATELIER • GENERAL CONDITIONS & JURISDICTION</span>
                  <span>REF: {contract.referenceNumber}</span>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
                    {isAr ? 'البنود والشروط والالتزامات القانونية' : 'GENERAL LEGAL ARTICLES & ARBITRATION PROTOCOL'}
                  </h2>
                  <p className="text-xs text-neutral-600 font-mono">
                    GOVERNING LAWS OF THE KINGDOM OF BAHRAIN • ELECTRONIC TRANSACTIONS LAW #54/2018
                  </p>
                </div>

                {/* Full Clauses List */}
                <div className="space-y-4 mb-8">
                  {(contract.clauses && contract.clauses.length > 0 ? contract.clauses : [
                    "يلتزم استوديو التصميم بتقديم كامل المخططات التنفيذية والرسومات المعمارية والتفاصيل الإنشائية وفق أعلى معايير الجودة ومواصفات كود البناء البحريني.",
                    "يلتزم العميل بسداد المستحقات المالية حسب المراحل المحددة في جدول الدفعات خلال 7 أيام عمل من تاريخ إصدار الفاتورة والمستخلص المعتمد.",
                    "أي تعديلات جوهرية على التصاميم المعتمدة نهائياً تخضع لاتفاق ملحق خطي وتكلفة إضافية يتم التوافق عليها مسبقاً قبل الشروع في التنفيذ.",
                    "تخضع النزاعات الناشئة عن هذا العقد في حال تعذر الحل الودي للاختصاص القضائي لمحاكم مملكة البحرين التجارية.",
                    "تعتبر التوقيعات والاعتمادات الإلكترونية الصادرة عبر منصة ZAINTERIOR ملزمة قانونياً ونافذة المفعول فور اعتمادها."
                  ]).map((clauseText, idx) => (
                    <div key={idx} className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs sm:text-sm font-serif text-neutral-800 flex items-start gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#8b6938]/10 text-[#8b6938] border border-[#8b6938]/20 flex-shrink-0 mt-0.5">
                        §{idx + 1}
                      </span>
                      <p className="leading-relaxed">{clauseText}</p>
                    </div>
                  ))}
                </div>

                {/* Official Signatory & Atelier Seal Box in the PDF */}
                <div className="p-6 rounded-2xl bg-neutral-50 border-2 border-neutral-300 mb-8 space-y-6">
                  <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                    <span className="font-serif font-bold text-sm text-neutral-900">
                      {isAr ? 'إقرار وتوثيق توقيع الطرفين في المستند:' : 'FORMAL DOCUMENT EXECUTION & ATTESTATION:'}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">DIGITAL CERTIFICATE #CRPEP-94821-E</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    {/* First Party Official Seal (Pre-stamped by Atelier) */}
                    <div className="p-4 rounded-xl bg-white border border-neutral-200 text-center space-y-2">
                      <div className="text-[11px] font-bold text-neutral-600 uppercase">
                        {isAr ? 'الطرف الأول: زين أتيليه W.L.L.' : 'First Party: ZAINTERIOR Atelier'}
                      </div>
                      <div className="py-2 flex items-center justify-center gap-2 text-[#8b6938]">
                        <Building2 size={24} />
                        <span className="font-serif font-bold text-base">Zain Al-Alawi</span>
                      </div>
                      <div className="inline-block px-3 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
                        OFFICIALLY CERTIFIED & STAMPED
                      </div>
                    </div>

                    {/* Second Party Client Signature Field representation inside PDF */}
                    <div className="p-4 rounded-xl bg-white border-2 border-dashed border-neutral-300 text-center space-y-2">
                      <div className="text-[11px] font-bold text-neutral-600 uppercase">
                        {isAr ? 'الطرف الثاني: توقيع العميل المعتمد' : 'Second Party: Client Signature'}
                      </div>
                      {contract.isSignedByClient && contract.signatureDataUrl ? (
                        <div className="py-1 flex flex-col items-center justify-center">
                          <img 
                            src={contract.signatureDataUrl} 
                            alt="Client Signature" 
                            className="h-12 max-w-[180px] object-contain"
                          />
                          <span className="text-[9px] font-mono text-emerald-700 font-bold mt-1">
                            SIGNED ON: {contract.signedAt || contract.dateCreated}
                          </span>
                        </div>
                      ) : (
                        <div className="py-3 text-xs text-neutral-400 font-mono italic">
                          {isAr 
                            ? '[التوقيع الرقمي يتم إلحاقه إلكترونياً عبر الخطوة التالية بالأسفل]' 
                            : '[Digital signature appended electronically via the section below]'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Page 3 Running Footer */}
                <div className="pt-6 border-t-2 border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500 font-mono relative z-10 mt-auto">
                  <div>KINGDOM OF BAHRAIN • ELECTRONIC TRANSACTIONS COMPLIANT</div>
                  <div>PAGE 3 OF {totalPages} • FINAL LEGAL EXECUTION</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          PDF VIEWER FOOTER STATUS BAR
          ========================================================================= */}
      <div className="bg-[#24272b] dark:bg-[#1a1c1e] border-t border-zinc-700/80 px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 select-none">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>
            {isAr 
              ? 'مستند PDF مشفر ومعتمد ومحمي ومطابق لكافة الأنظمة الهندسية بمملكة البحرين' 
              : 'Encrypted, certified PDF compliant with Bahrain Engineering & Urban Planning regulations'}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>REF: {contract.referenceNumber}</span>
          <span>•</span>
          <button 
            type="button" 
            onClick={handleTriggerDownload}
            className="hover:text-gold-400 transition-colors cursor-pointer underline flex items-center gap-1"
          >
            <Download size={12} />
            <span>{isAr ? 'تنزيل نسخة أصلية' : 'Download Original'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
