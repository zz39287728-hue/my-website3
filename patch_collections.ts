import fs from 'fs';

const path = 'src/pages/Collections.tsx';
let content = fs.readFileSync(path, 'utf8');

// replace mock data with globalState data
content = content.replace(
  `  // Mock Data for Collections
  const collections = [
    {
      id: '1',
      title: isAr ? 'مجموعة كلاسيك الراقية' : 'Classic Elegance Set',
      category: isAr ? 'أطقم غرف' : 'Room Sets',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000',
      description: isAr ? 'طقم جلوس متكامل يجمع بين الفخامة الكلاسيكية والراحة العصرية. يشمل صوفا رئيسية، كرسيين، وطاولة وسط برخام طبيعي.' : 'A complete living set combining classic luxury with modern comfort. Includes main sofa, two armchairs, and a natural marble coffee table.',
      isNew: true
    },
    {
      id: '2',
      title: isAr ? 'كرسي لوكس المخملي' : 'Luxe Velvet Armchair',
      category: isAr ? 'أثاث مفرد' : 'Single Furniture',
      price: 350,
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000',
      description: isAr ? 'كرسي مفرد مريح بتصميم عصري منجد بمخمل عالي الجودة مع تفاصيل معدنية ذهبية.' : 'Comfortable single armchair with a modern design upholstered in premium velvet with gold metal accents.',
      isNew: false
    },
    {
      id: '3',
      title: isAr ? 'سجادة حريرية نيو-كلاسيك' : 'Neo-Classic Silk Rug',
      category: isAr ? 'سجاد وإكسسوارات' : 'Rugs & Decor',
      price: 450,
      image: 'https://images.unsplash.com/photo-1575414003593-0a30026e49c7?auto=format&fit=crop&q=80&w=1000',
      description: isAr ? 'سجادة يدوية الصنع بخيوط الحرير والقطن الطبيعي، تضيف لمسة دافئة للمساحة.' : 'Handmade rug with silk and natural cotton threads, adding a warm touch to any space.',
      isNew: false
    },
    {
      id: '4',
      title: isAr ? 'طاولة طعام أوريجين' : 'Origin Dining Table',
      category: isAr ? 'أثاث مفرد' : 'Single Furniture',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=1000',
      description: isAr ? 'طاولة طعام من خشب الجوز الطبيعي بتصميم بسيط وأنيق يتسع لـ 8 أشخاص.' : 'Natural walnut dining table with a simple and elegant design seating up to 8 people.',
      isNew: true
    },
    {
      id: '5',
      title: isAr ? 'إضاءة السقف النحاسية' : 'Brass Pendant Light',
      category: isAr ? 'إضاءة' : 'Lighting',
      price: 180,
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1000',
      description: isAr ? 'إضاءة معلقة بتصميم هندسي حديث مطلي بالنحاس اللامع.' : 'Pendant lighting with a modern geometric design in polished brass.',
      isNew: false
    },
    {
      id: '6',
      title: isAr ? 'مجموعة الاسترخاء الخارجية' : 'Outdoor Lounge Set',
      category: isAr ? 'أطقم غرف' : 'Room Sets',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=1000',
      description: isAr ? 'طقم للحديقة مقاوم للعوامل الجوية بتصميم مميز يجمع بين خشب التيك وأقمشة متينة.' : 'Weather-resistant garden set with a distinctive design combining teak wood and durable fabrics.',
      isNew: false
    }
  ];`,
  `  const { globalState } = useAppContext();\n  const collections = globalState.storeData?.collections || [];`
);

content = content.replace(
  '{item.price.toLocaleString()} {isAr ? \'د.ب\' : \'BHD\'}',
  '{item.originalPrice && (\n                    <span className="line-through text-xs text-white/70 mr-2">{item.originalPrice.toLocaleString()}</span>\n                  )}\n                  {item.price.toLocaleString()} {isAr ? \'د.ب\' : \'BHD\'}'
);

fs.writeFileSync(path, content);
