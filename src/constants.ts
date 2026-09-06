import { ProjectStage, StageStatus, Milestone, ArchitectProfile, GlobalState, ClientProjectData, BlockedSlot } from './types';

export const INITIAL_ARCHITECT_PROFILE: ArchitectProfile = {
  name: 'Arch. Zainab Al-Zaki',
  title: 'Lead Architect',
  avatar: 'https://picsum.photos/id/1027/200/200'
};

const getMilestonesForTier = (tier: string, activeStageIdx: number): Milestone[] => {
  let stages: { id: string, stage: ProjectStage, weight: number }[] = [];
  
  if (tier.includes('Essential')) {
    stages = [
      { id: 'm1', stage: ProjectStage.CONCEPT, weight: 30 },
      { id: 'm2', stage: ProjectStage.LAYOUTS, weight: 70 }
    ];
  } else if (tier.includes('Executive')) {
    stages = [
      { id: 'm1', stage: ProjectStage.CONCEPT, weight: 15 },
      { id: 'm2', stage: ProjectStage.LAYOUTS, weight: 25 },
      { id: 'm3', stage: ProjectStage.RENDERS, weight: 30 },
      { id: 'm4', stage: ProjectStage.SPECIFICATIONS, weight: 30 }
    ];
  } else {
    // VIP Signature
    stages = [
      { id: 'm1', stage: ProjectStage.CONCEPT, weight: 10 },
      { id: 'm2', stage: ProjectStage.LAYOUTS, weight: 15 },
      { id: 'm3', stage: ProjectStage.RENDERS, weight: 20 },
      { id: 'm4', stage: ProjectStage.SPECIFICATIONS, weight: 20 },
      { id: 'm5', stage: ProjectStage.CONSTRUCTION, weight: 25 },
      { id: 'm6', stage: ProjectStage.HANDOVER, weight: 10 }
    ];
  }

  return stages.map((s, idx) => ({
    ...s,
    status: activeStageIdx > idx ? StageStatus.COMPLETED : (activeStageIdx === idx ? StageStatus.IN_PROGRESS : StageStatus.UPCOMING),
    progress: activeStageIdx > idx ? 100 : (activeStageIdx === idx ? 50 : 0),
    date: activeStageIdx >= idx ? 'Oct 2023' : undefined
  }));
};

const calculateCompletion = (milestones: Milestone[]): number => {
  return Math.round(milestones.reduce((acc, m) => acc + (m.status === StageStatus.COMPLETED ? m.weight : (m.status === StageStatus.IN_PROGRESS ? m.weight * 0.5 : 0)), 0));
};

const createMockClient = (
  id: string, name: string, tier: string, project: string, area: string, location: string, style: string, activeStageIdx: number, avatarId: number, hasUnread: boolean, hasPending: boolean, hasTickets: boolean, status: 'Active' | 'Archived' = 'Active', freeConsultations: number = 2
): ClientProjectData => {
  const milestones = getMilestonesForTier(tier, activeStageIdx);
  const completion = calculateCompletion(milestones);

  return {
    profile: { id, name, tier, project, area, location, style, completion, avatar: `https://picsum.photos/id/${avatarId}/200/200`, status, freeConsultations },
    milestones,
    materials: [
      { id: 'mat1', title: 'Master Bedroom Flooring', type: 'Material Swatch', status: hasPending ? 'Pending' : 'Approved', img: '1015' },
      { id: 'mat2', title: 'Ground Floor MEP Layout', type: 'Blueprint (DWG/PDF)', status: 'Approved', img: '1016' }
    ],
    invoice: {
      id: `INV-2024-${Math.floor(Math.random() * 1000)}`,
      date: 'Oct 24, 2024',
      status: 'Paid',
      items: [
        { id: 'inv1', desc: 'Stage 3: 3D High-Fidelity Modeling & Renders', amount: 4500 },
        { id: 'inv2', desc: 'Material Sourcing Retainer', amount: 2000 }
      ]
    },
    paidInvoices: [
      {
        id: 'INV-2024-028',
        date: 'Oct 05, 2024',
        status: 'Paid',
        paymentMethod: 'BenefitPay',
        paidAt: 'Oct 05, 2024 • 10:14 AM',
        transactionId: 'BENEFIT-849201-BH',
        items: [
          { id: 'pi1', desc: 'Stage 1: Site Analysis & Concept Inception Retainer', amount: 3500 },
          { id: 'pi2', desc: 'Topographical Spatial Laser Diagnostics', amount: 950 }
        ]
      }
    ],
    cart: [],
    chatHistory: [
      { id: 'msg1', sender: 'ARCHITECT', text: "Good morning. I've uploaded the revised plans. Let me know your thoughts.", timestamp: '09:00 AM' },
      ...(hasUnread ? [{ id: 'msg2', sender: 'CLIENT' as const, text: "I have a question regarding the lighting fixtures.", timestamp: '10:30 AM' }] : [])
    ],
    contract: { isSignedByClient: status === 'Archived', isSealedByArchitect: status === 'Archived' },
    folders: [
      {
        id: 'f1',
        name: tier,
        description: 'Files included in your purchased package',
        files: [
          { id: 'file1', name: 'Initial Design Concept.pdf', type: 'pdf', url: '#', date: '2024-10-10', size: '2.4 MB' },
          { id: 'file2', name: 'Moodboard V1.jpg', type: 'image', url: '#', date: '2024-10-12', size: '4.1 MB' }
        ]
      },
      {
        id: 'f2',
        name: '2D Spatial Layouts & Planning',
        description: 'Individual service deliverables',
        files: [
          { id: 'file3', name: 'Ground Floor Blueprint.dwg', type: 'cad', url: '#', date: '2024-10-15', size: '12 MB' },
          { id: 'file4', name: 'Furniture Layout Plan.pdf', type: 'pdf', url: '#', date: '2024-10-16', size: '1.8 MB' }
        ]
      }
    ],
    contracts: [
      {
        id: `con-1-${id}`,
        referenceNumber: 'ZA-CON-2024-001',
        title: 'Master Architectural & Interior Execution Agreement',
        titleAr: 'اتفاقية التصميم المعماري والديكور الداخلي الشامل',
        type: 'Architectural & Interior Design',
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
        status: status === 'Archived' ? 'Sealed' : 'Pending',
        isSignedByClient: status === 'Archived',
        isSealedByArchitect: status === 'Archived',
        signedAt: status === 'Archived' ? 'Oct 14, 2024 • 02:30 PM' : undefined,
        sealedAt: status === 'Archived' ? 'Oct 15, 2024 • 11:00 AM' : undefined,
        signeeName: status === 'Archived' ? name : undefined
      },
      {
        id: `con-2-${id}`,
        referenceNumber: 'ZA-SUP-2024-004',
        title: 'Engineering Site Supervision & Compliance Protocol',
        titleAr: 'عقد الإشراف الهندسي الميداني ومطابقة الجودة والتنفيذ',
        type: 'Site Supervision',
        typeAr: 'إشراف هندسي ميداني',
        description: 'Periodic on-site structural inspections, MEP compliance audits, and contractor coordination sessions to safeguard design fidelity.',
        descriptionAr: 'الإشراف الهندسي الميداني الدوري على مقاولي التنفيذ، مطابقة الأعمال مع المخططات التنفيذية، وضمان تطبيق أعلى معايير الحرفية.',
        clauses: [
          '1. SUPERVISION FREQUENCY: Lead engineers shall conduct scheduled and surprise bi-weekly site inspections.',
          '2. CONTRACTOR COMPLIANCE: Direct technical directives issued to builders must be adhered to without structural deviations.',
          '3. QUALITY LOGS: Detailed site inspection logs with high-resolution photographic evidence delivered via the client portal.'
        ],
        clausesAr: [
          '١. دورية الزيارات: يقوم المهندس المشرف بزيارات ميدانية دورية أسبوعية لتدقيق مطابقة الأعمال.',
          '٢. توجيه المقاولين: إلزام مقاولي البناء بالتقيد الصارم بالمخططات والمواصفات الفنية المعتمدة.',
          '٣. تقارير الجودة: رفع تقارير دورية موثقة بالصور والملاحظات الهندسية عبر منصة العميل الخاصة.'
        ],
        totalValue: 2800,
        dateCreated: 'Oct 18, 2024',
        status: status === 'Archived' ? 'Sealed' : 'Pending',
        isSignedByClient: status === 'Archived',
        isSealedByArchitect: status === 'Archived',
        signedAt: status === 'Archived' ? 'Oct 19, 2024 • 11:45 AM' : undefined,
        sealedAt: status === 'Archived' ? 'Oct 20, 2024 • 09:15 AM' : undefined,
        signeeName: status === 'Archived' ? name : undefined
      },
      {
        id: `con-3-${id}`,
        referenceNumber: 'ZA-MAT-2024-009',
        title: 'Italian Calacatta Marble & Custom FF&E Procurement Addendum',
        titleAr: 'ملحق توريد واختيار الرخام الإيطالي الفاخر والأثاث المخصص',
        type: 'Material Sourcing',
        typeAr: 'توريد المواد والأثاث',
        description: 'Dedicated procurement agreement for imported Italian marble slabs, sensory acoustic panels, and bespoke European furnishings.',
        descriptionAr: 'اتفاقية توريد ومعاينة ألواح رخام كالاكاتا الطبيعي النادر، توريد المواد الفاخرة، وتصنيع الأثاث الحصري للمشروع.',
        clauses: [
          '1. SOURCE AUTHENTICATION: Direct extraction verification from certified Carrara quarries with certified vein patterns.',
          '2. LOGISTICS & CRATING: Insured temperature-controlled international maritime transit to Kingdom of Bahrain.',
          '3. INSTALLATION SUPERVISION: Atelier master stonemasons supervise precise dry-lay and joint alignment.'
        ],
        clausesAr: [
          '١. شهادات المنشأ: ضمان استيراد الألواح من المحاجر الإيطالية الأصلية مع مطابقة العروق الطبيعية.',
          '٢. الشحن والتأمين: شحن بحري مكيّف ومؤمّن بالكامل حتى موقع المشروع في البحرين.',
          '٣. الإشراف على التركيب: إشراف حرفي مباشر لضمان دقة الفواصل والمحاذاة الميكانيكية.'
        ],
        totalValue: 4200,
        dateCreated: 'Sep 28, 2024',
        status: 'Sealed',
        isSignedByClient: true,
        isSealedByArchitect: true,
        signedAt: 'Sep 30, 2024 • 04:15 PM',
        sealedAt: 'Oct 01, 2024 • 09:30 AM',
        signeeName: name
      }
    ],
    tickets: hasTickets ? [{
      id: 'tkt1',
      subject: 'Site Access Request',
      description: 'I would like to visit the site next week to see the progress on the MEP layout.',
      status: 'Under Review',
      date: 'Oct 20, 2024'
    }] : [],
    bookings: [],
    tasks: [
      { id: 'tsk1', title: 'Finalize Lighting Specs', dueDate: 'Oct 28, 2024', completed: status === 'Archived', priority: 'High' },
      { id: 'tsk2', title: 'Review MEP Drawings', dueDate: 'Nov 02, 2024', completed: true, priority: 'Medium' }
    ],
    hasUnreadMessages: hasUnread,
    hasPendingApprovals: hasPending,
    hasNewTickets: hasTickets
  };
};

export const INITIAL_BLOCKED_SLOTS: BlockedSlot[] = [
  // Dynamically set to something relatively near today so they show up, 
  // but let's just initialize an empty array or set some fixed date and let the app handle generic logic
];


const INITIAL_STORE_DATA = {
  collections: [
    {
      id: '1',
      title: 'مجموعة كلاسيك الراقية',
      category: 'أطقم غرف',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000',
      description: 'طقم جلوس متكامل يجمع بين الفخامة الكلاسيكية والراحة العصرية. يشمل صوفا رئيسية، كرسيين، وطاولة وسط برخام طبيعي.',
      isNew: true
    },
    {
      id: '2',
      title: 'كرسي لوكس المخملي',
      category: 'أثاث مفرد',
      price: 350,
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000',
      description: 'كرسي مفرد مريح بتصميم عصري منجد بمخمل عالي الجودة مع تفاصيل معدنية ذهبية.',
      isNew: false
    },
    {
      id: '3',
      title: 'سجادة حريرية نيو-كلاسيك',
      category: 'سجاد وإكسسوارات',
      price: 450,
      image: 'https://images.unsplash.com/photo-1575414003593-0a30026e49c7?auto=format&fit=crop&q=80&w=1000',
      description: 'سجادة يدوية الصنع بخيوط الحرير والقطن الطبيعي، تضيف لمسة دافئة للمساحة.',
      isNew: false
    },
    {
      id: '4',
      title: 'طاولة طعام أوريجين',
      category: 'أثاث مفرد',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=1000',
      description: 'طاولة طعام من خشب الجوز الطبيعي بتصميم بسيط وأنيق يتسع لـ 8 أشخاص.',
      isNew: true
    },
    {
      id: '5',
      title: 'إضاءة السقف النحاسية',
      category: 'إضاءة',
      price: 180,
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1000',
      description: 'إضاءة معلقة بتصميم هندسي حديث مطلي بالنحاس اللامع.',
      isNew: false
    },
    {
      id: '6',
      title: 'مجموعة الاسترخاء الخارجية',
      category: 'أطقم غرف',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1000',
      description: 'طقم للحديقة مقاوم للعوامل الجوية بتصميم مميز يجمع بين خشب التيك وأقمشة متينة.',
      isNew: false
    }
  ],
  
  packages: [
    { 
      id: 'p1', 
      name: 'Essential Concept', 
      nameAr: 'الباقة الاقتصادية الأساسية',
      price: '2,500 BHD', 
      priceNumber: 2500,
      tier: "essential" as "essential" | "executive" | "signature",
      features: ['Space Planning', 'Moodboards', '2D Layouts', 'Building area up to 250 m²'] 
    },
    { 
      id: 'p2', 
      name: 'Executive Residence', 
      nameAr: 'الباقة الاحترافية المتكاملة',
      price: '6,800 BHD', 
      priceNumber: 6800,
      tier: "executive" as "essential" | "executive" | "signature",
      features: ['3D Renders for 5 Zones', 'Material Selection', 'MEP Drawings', 'Project Management', 'Building area up to 450 m²'] 
    },
    { 
      id: 'p3', 
      name: 'VIP Signature Atelier', 
      nameAr: 'باقة التميز النخبوية',
      price: 'Custom', 
      priceNumber: 15000,
      tier: "signature" as "essential" | "executive" | "signature",
      features: ['Turnkey Solution', 'Bespoke Furniture', 'Smart Home Integration', 'Unlimited Consultations'] 
    }
  ],
consultations: [
    {
      id: 'c1',
      title: 'In-Studio Consultation',
      price: 150,
      duration: '1 Hour',
      type: "In-Studio" as "In-Studio" | "Virtual" | "Site Visit"
    },
    {
      id: 'c2',
      title: 'Virtual Consultation',
      price: 100,
      duration: '1 Hour',
      type: "Virtual" as "In-Studio" | "Virtual" | "Site Visit"
    },
    {
      id: 'c3',
      title: 'Site Visit & Assessment',
      price: 300,
      duration: '2 Hours',
      type: "Site Visit" as "In-Studio" | "Virtual" | "Site Visit"
    }
  ]
};

export const INITIAL_STATE: GlobalState = {
  storeData: INITIAL_STORE_DATA,
  architectProfile: INITIAL_ARCHITECT_PROFILE,
  activeClientId: 'client1',
  blockedSlots: INITIAL_BLOCKED_SLOTS,
  companyFinances: {
    expenses: [
      { id: 'exp1', title: 'Office Rent', amount: 1500, date: '2026-09-01', category: 'Operations' },
      { id: 'exp2', title: 'Software Licenses', amount: 350, date: '2026-09-02', category: 'Software' },
      { id: 'exp3', title: 'Marketing Campaign', amount: 800, date: '2026-08-28', category: 'Marketing' }
    ]
  },
  clients: {
    'client1': createMockClient('client1', 'Ahmad Bin Jassim', 'VIP Signature Tier', 'Diyar Al Muharraq Villa', '840 m²', 'Muharraq, Bahrain', 'Warm Minimalism', 3, 1005, true, true, true, 'Active', 2),
    'client2': createMockClient('client2', 'Sheikha Mariam Al-Khalifa', 'Executive Residence', 'Riffa Golf Estate Villa', '1,250 m²', 'Riffa, Bahrain', 'Modern Classical / Biophilic', 2, 1025, false, true, false, 'Active', 0),
    'client3': createMockClient('client3', 'Faisal Al-Ghanim', 'VIP Signature Tier', 'Amwaj Oceanfront Villa', '680 m²', 'Amwaj Islands, Bahrain', 'Contemporary Coastal Luxury', 5, 1012, true, false, false, 'Active', 1),
    'client4': createMockClient('client4', 'Dr. Tariq Al-Mansoor', 'Essential Concept', 'Saar Equestrian Residence', '950 m²', 'Saar, Bahrain', 'Brutalist Warm Stone', 1, 1042, false, false, true, 'Active', 0),
    'client5': createMockClient('client5', 'Khalid Al-Fadhel', 'VIP Signature Tier', 'Seef Luxury Penthouse', '450 m²', 'Seef, Bahrain', 'Modern Minimalist', 6, 1050, false, false, false, 'Archived', 0),
  }
};

export const PACKAGES = [
  { 
    id: 'p1', 
    name: 'Essential Concept', 
    nameAr: 'الباقة الاقتصادية الأساسية',
    price: '2,500 BHD', 
    priceNumber: 2500,
    features: ['Space Planning', 'Moodboards', '2D Layouts', 'Building area up to 250 m²'] 
  },
  { 
    id: 'p2', 
    name: 'Executive Residence', 
    nameAr: 'الباقة الاحترافية المتكاملة',
    price: '6,800 BHD', 
    priceNumber: 6800,
    features: ['3D Renders for 5 Zones', 'Material Selection', 'MEP Drawings', 'Project Management', 'Building area up to 450 m²'] 
  },
  { 
    id: 'p3', 
    name: 'VIP Signature Atelier', 
    nameAr: 'باقة التميز النخبوية',
    price: '15,000 BHD', 
    priceNumber: 15000,
    features: ['Turnkey Solution', 'Bespoke Furniture', 'VR Walkthroughs', 'Priority Support', 'Post-Handover Care', '10% Turnkey Execution Discount'], 
    recommended: true 
  }
];

export const ADDON_SERVICES = [
  {
    id: 'addon_vr',
    name: 'VIP VR Walkthrough & Sensory Audit',
    nameAr: 'جلسة واقع افتراضي 360° وتدقيق حسي VIP',
    desc: 'Immersive VR walkthrough of all major pavilions & suites.',
    descAr: 'جلسة محاكاة واقع افتراضي غامرة لأجنحة ومجالس الفيلا.',
    price: '450 BHD',
    priceNumber: 450,
  },
  {
    id: 'addon_supervision',
    name: 'Supplementary Site Supervision Cycle',
    nameAr: 'دورة إشراف هندسي ميداني إضافية',
    desc: '4 on-site engineering visits with technical contractor guidance.',
    descAr: '4 زيارات هندسية موقعية مع توجيه وإشراف للمقاولين.',
    price: '950 BHD',
    priceNumber: 950,
  },
  {
    id: 'addon_geology',
    name: 'Natural Marble & Stone Sourcing Escort',
    nameAr: 'فحص وانتقاء الرخام الإيطالي والأحجار الطبيعية',
    desc: 'Bespoke slab selection, vein-matching and stone diagnostics.',
    descAr: 'معاينة متقدمة لألواح الرخام النادرة ومطابقة العروق.',
    price: '600 BHD',
    priceNumber: 600,
  }
];

export const PORTFOLIO_ITEMS = [
  { id: 'pf1', title: 'Diyar Al Muharraq Estate', location: 'Muharraq', image: 'https://picsum.photos/id/1048/800/600' },
  { id: 'pf2', title: 'Riffa Views Mansion', location: 'Riffa', image: 'https://picsum.photos/id/1031/800/600' },
  { id: 'pf3', title: 'Saar Modern Villa', location: 'Saar', image: 'https://picsum.photos/id/1015/800/600' },
  { id: 'pf4', title: 'Amwaj Penthouse', location: 'Amwaj Islands', image: 'https://picsum.photos/id/1016/800/600' }
];
