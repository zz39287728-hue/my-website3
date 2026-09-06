import fs from 'fs';

const path = 'src/constants.ts';
let content = fs.readFileSync(path, 'utf8');

const storeDataInitialPackages = `
  packages: [
    { 
      id: 'p1', 
      name: 'Essential Concept', 
      nameAr: 'الباقة الاقتصادية الأساسية',
      price: '2,500 BHD', 
      priceNumber: 2500,
      tier: 'essential',
      features: ['Space Planning', 'Moodboards', '2D Layouts', 'Building area up to 250 m²'] 
    },
    { 
      id: 'p2', 
      name: 'Executive Residence', 
      nameAr: 'الباقة الاحترافية المتكاملة',
      price: '6,800 BHD', 
      priceNumber: 6800,
      tier: 'executive',
      features: ['3D Renders for 5 Zones', 'Material Selection', 'MEP Drawings', 'Project Management', 'Building area up to 450 m²'] 
    },
    { 
      id: 'p3', 
      name: 'VIP Signature Atelier', 
      nameAr: 'باقة التميز النخبوية',
      price: 'Custom', 
      priceNumber: 15000,
      tier: 'signature',
      features: ['Turnkey Solution', 'Bespoke Furniture', 'Smart Home Integration', 'Unlimited Consultations'] 
    }
  ],
`;

content = content.replace(/packages: \[\n    {\n      id: 'pkg1'[\s\S]*?consultations:/g, storeDataInitialPackages + 'consultations:');

fs.writeFileSync(path, content);
