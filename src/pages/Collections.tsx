import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { ViewModule } from '../types';
import { ShoppingBag, Star, Filter, ArrowRight, Check } from 'lucide-react';

export const Collections: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, lang } = useAppContext();
  const isAr = lang === 'ar';
  
  const [activeCategory, setActiveCategory] = useState<string>('All');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'COLLECTIONS') {
        setActiveCategory('All');
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);
  
  const { globalState } = useAppContext();
  const collections = globalState.storeData?.collections || [];

  const categories = ['All', ...Array.from(new Set(collections.map(c => c.category)))];
  
  const filteredCollections = activeCategory === 'All' 
    ? collections 
    : collections.filter(c => c.category === activeCategory);

  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleAddToCart = (id: string) => {
    setAddedItems(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-12 shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-900/90 to-transparent dark:from-luxury-950/90 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80&w=2000" 
          alt="Boutique" 
          className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center p-8 md:p-16 z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-xl ${isAr ? 'mr-auto text-right' : 'ml-0 text-left'}`}
          >
            <span className="inline-block py-1 px-3 bg-gold-500/20 text-gold-400 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              {isAr ? 'إصدارات حصرية' : 'Exclusive Releases'}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {isAr ? 'مجموعة زين الحصرية' : 'Zain Signature Collections'}
            </h1>
            <p className="text-luxury-200 text-lg md:text-xl font-medium">
              {isAr ? 'اكتشف قطع الأثاث الفريدة والمجموعات المتكاملة المصممة بعناية فائقة لتناسب ذوقك الرفيع.' : 'Discover unique furniture pieces and curated sets designed with meticulous care to suit your refined taste.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="p-2 bg-luxury-100 dark:bg-luxury-900 rounded-full text-luxury-500 hidden sm:block">
          <Filter size={18} />
        </div>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-gold-600 text-white shadow-md' 
                : 'bg-white dark:bg-luxury-900 text-luxury-600 dark:text-luxury-400 hover:bg-luxury-100 dark:hover:bg-luxury-800'
            }`}
          >
            {cat === 'All' ? (isAr ? 'الكل' : 'All') : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full flex flex-col p-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 border-luxury-200 dark:border-luxury-800">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {item.isNew && (
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-luxury-950/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gold-700 dark:text-gold-400 flex items-center gap-1 shadow-lg">
                    <Star size={12} className="fill-gold-500" />
                    {isAr ? 'جديد' : 'New'}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-bold font-serif shadow-lg">
                  {item.originalPrice && (
                    <span className="line-through text-xs text-white/70 mr-2">{item.originalPrice.toLocaleString()}</span>
                  )}
                  {item.price.toLocaleString()} {isAr ? 'د.ب' : 'BHD'}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-xs font-bold text-gold-600 dark:text-gold-500 uppercase tracking-wider mb-2">
                  {item.category}
                </p>
                <h3 className="text-xl font-serif font-bold text-luxury-900 dark:text-luxury-50 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-luxury-600 dark:text-luxury-400 mb-6 flex-1 line-clamp-3">
                  {item.description}
                </p>
                
                <button 
                  onClick={() => handleAddToCart(item.id)}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                    addedItems[item.id] 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : 'bg-luxury-100 dark:bg-luxury-900 text-luxury-900 dark:text-luxury-100 hover:bg-gold-600 hover:text-white'
                  }`}
                >
                  {addedItems[item.id] ? (
                    <>
                      <Check size={18} />
                      {isAr ? 'تمت الإضافة للسلة' : 'Added to Cart'}
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      {isAr ? 'أضف إلى السلة' : 'Add to Cart'}
                    </>
                  )}
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-luxury-500 font-medium mb-4">
          {isAr ? 'لم تجد ما تبحث عنه؟' : 'Didn\'t find what you\'re looking for?'}
        </p>
        <Button variant="outline" onClick={() => setView(ViewModule.CHAT)} className="mx-auto flex items-center gap-2">
          {isAr ? 'تواصل مع المصمم المباشر' : 'Chat with the Designer'}
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};
