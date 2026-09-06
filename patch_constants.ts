import fs from 'fs';

const constPath = 'src/constants.ts';
let content = fs.readFileSync(constPath, 'utf8');

const storeDataInitial = `
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
      id: 'pkg1',
      name: 'Essential Vision',
      price: 1500,
      tier: 'essential' as const,
      description: 'Basic layout and moodboard',
      features: ['Space Planning', 'Concept Moodboard', '2 Revisions']
    },
    {
      id: 'pkg2',
      name: 'Executive Design',
      price: 3500,
      tier: 'executive' as const,
      description: 'Complete 3D design and specs',
      features: ['Everything in Essential', '3D Photorealistic Renders', 'Material Specifications', '4 Revisions']
    },
    {
      id: 'pkg3',
      name: 'Signature Turnkey',
      price: 8000,
      tier: 'signature' as const,
      description: 'Full design and construction management',
      features: ['Everything in Executive', 'Contractor Coordination', 'Site Supervision', 'Unlimited Revisions']
    }
  ],
  consultations: [
    {
      id: 'c1',
      title: 'In-Studio Consultation',
      price: 150,
      duration: '1 Hour',
      type: 'In-Studio'
    },
    {
      id: 'c2',
      title: 'Virtual Consultation',
      price: 100,
      duration: '1 Hour',
      type: 'Virtual'
    },
    {
      id: 'c3',
      title: 'Site Visit & Assessment',
      price: 300,
      duration: '2 Hours',
      type: 'Site Visit'
    }
  ]
};
`;

content = content.replace('export const INITIAL_STATE: GlobalState = {', storeDataInitial + '\nexport const INITIAL_STATE: GlobalState = {\n  storeData: INITIAL_STORE_DATA,');

fs.writeFileSync(constPath, content);
