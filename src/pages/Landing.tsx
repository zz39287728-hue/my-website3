import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '../components/UI';
import { useAppContext } from '../App';
import { Role } from '../types';
import { User, ShieldCheck, Globe, Moon, Sun, ChevronDown, Check, Star, Clock, PenTool, Layers, Headphones, TrendingUp, Image as ImageIcon, FileText, Users, Maximize2, Calendar, X } from 'lucide-react';
import { Booking } from './Communication';

export const LandingPage: React.FC<{ onSelectRole: (role: Role) => void }> = ({ onSelectRole }) => {
  const { t, lang, setLang, theme, setTheme } = useAppContext();
  const isRTL = lang === 'ar';
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [showQuickBooking, setShowQuickBooking] = useState(false);
  const [quickPhone, setQuickPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['hero', 'about', 'why', 'deliverables', 'packages', 'portfolio'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'about', label: t('landing.nav.about') },
    { id: 'why', label: t('landing.nav.why') },
    { id: 'deliverables', label: t('landing.nav.deliverables') },
    { id: 'packages', label: t('landing.nav.packages') },
    { id: 'portfolio', label: t('landing.nav.portfolio') },
  ];

  const whyUsFeatures = [
    { icon: Star, title: t('landing.why.1.title'), desc: t('landing.why.1.desc') },
    { icon: PenTool, title: t('landing.why.2.title'), desc: t('landing.why.2.desc') },
    { icon: Layers, title: t('landing.why.3.title'), desc: t('landing.why.3.desc') },
    { icon: Clock, title: t('landing.why.4.title'), desc: t('landing.why.4.desc') },
    { icon: Check, title: t('landing.why.5.title'), desc: t('landing.why.5.desc') },
    { icon: Headphones, title: t('landing.why.6.title'), desc: t('landing.why.6.desc') },
    { icon: TrendingUp, title: t('landing.why.7.title'), desc: t('landing.why.7.desc') },
  ];

  const deliverables = [
    { icon: ImageIcon, title: t('landing.deliv.1.title'), desc: t('landing.deliv.1.desc') },
    { icon: FileText, title: t('landing.deliv.2.title'), desc: t('landing.deliv.2.desc') },
    { icon: PenTool, title: t('landing.deliv.3.title'), desc: t('landing.deliv.3.desc') },
    { icon: Users, title: t('landing.deliv.4.title'), desc: t('landing.deliv.4.desc') },
  ];

  const packages = [
    {
      id: 'eco',
      name: t('landing.pkg.eco.name'),
      target: t('landing.pkg.eco.target'),
      area: t('landing.pkg.eco.area'),
      scope: t('landing.pkg.eco.scope'),
      oldPrice: '1,200 BHD',
      price: '690 BHD',
      recommended: false
    },
    {
      id: 'pro',
      name: t('landing.pkg.pro.name'),
      target: t('landing.pkg.pro.target'),
      area: t('landing.pkg.pro.area'),
      scope: t('landing.pkg.pro.scope'),
      oldPrice: '2,000 BHD',
      price: '1,450 BHD',
      recommended: true
    },
    {
      id: 'prem',
      name: t('landing.pkg.prem.name'),
      target: t('landing.pkg.prem.target'),
      area: t('landing.pkg.prem.area'),
      scope: t('landing.pkg.prem.scope'),
      bonus: t('landing.pkg.prem.bonus'),
      oldPrice: '2,900 BHD',
      price: '2,200 BHD',
      recommended: false
    }
  ];

  const portfolio = [
    { id: 1048, title: 'Diyar Al Muharraq Estate' },
    { id: 1031, title: 'Riffa Views Residence' },
    { id: 1015, title: 'Saar Private Compound' },
    { id: 1016, title: 'Amwaj Luxury Villa' },
  ];

  return (
    <div className="w-full bg-luxury-50 dark:bg-luxury-950 text-luxury-900 dark:text-luxury-50 transition-colors duration-500 font-sans">
      
      {/* Navigation Bar */}
      <nav dir="ltr" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-luxury-950/90 backdrop-blur-md border-b border-luxury-200 dark:border-luxury-800 py-4 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col cursor-pointer" onClick={() => scrollTo('hero')}>
            <h1 className="font-serif text-2xl font-bold tracking-widest bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-300 dark:to-gold-500 text-transparent bg-clip-text mb-1">{t('app.title')}</h1>
            <p className="text-[10px] font-bold tracking-widest text-luxury-600 dark:text-luxury-400 uppercase">{t('app.subtitle')}</p>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <button 
                key={link.id} 
                onClick={() => scrollTo(link.id)}
                className={`text-sm font-bold transition-colors ${activeSection === link.id ? 'text-gold-700 dark:text-gold-400' : 'text-luxury-600 dark:text-luxury-300 hover:text-luxury-900 dark:hover:text-luxury-50'}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-full bg-luxury-100 dark:bg-luxury-900 text-luxury-600 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={() => setLang(isRTL ? 'en' : 'ar')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-luxury-100 dark:bg-luxury-900 text-luxury-600 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 transition-colors font-bold text-sm"
            >
              <Globe size={16} />
              <span>{isRTL ? 'EN' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://picsum.photos/id/1031/1920/1080" alt="Luxury Interior" className="w-full h-full object-cover opacity-40 dark:opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-50/80 via-luxury-50/50 to-luxury-50 dark:from-luxury-950/80 dark:via-luxury-950/50 dark:to-luxury-950 transition-colors duration-500" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="font-serif text-5xl md:text-7xl font-bold text-luxury-900 dark:text-white mb-6 leading-tight">
              {t('landing.hero.title')}
            </h2>
            <p className="text-lg md:text-xl text-luxury-700 dark:text-luxury-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              {t('landing.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center flex-wrap">
              <Button 
                onClick={() => onSelectRole('CLIENT')}
                className="w-full sm:w-64 py-4 text-lg shadow-[0_0_30px_rgba(166,136,104,0.4)] dark:shadow-[0_0_30px_rgba(197,156,106,0.4)]"
              >
                <User size={24} />
                {t('landing.hero.clientBtn')}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => onSelectRole('ARCHITECT')}
                className="w-full sm:w-64 py-4 text-lg"
              >
                <ShieldCheck size={24} />
                {t('landing.hero.adminBtn')}
              </Button>

              <Button 
                variant="secondary"
                onClick={() => { setShowQuickBooking(true); setBookingSuccess(false); setQuickPhone(''); }}
                className="w-full sm:w-64 py-4 text-lg"
              >
                <Calendar size={24} />
                {isRTL ? 'حجز استشارة سريع' : 'Quick Consultation'}
              </Button>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-luxury-400 cursor-pointer"
          onClick={() => scrollTo('about')}
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-luxury-900 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl font-bold bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-400 dark:to-gold-600 text-transparent bg-clip-text mb-8">{t('landing.about.title')}</h2>
          <p className="text-lg text-luxury-700 dark:text-luxury-300 leading-relaxed font-medium">
            {t('landing.about.desc')}
          </p>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why" className="py-24 bg-luxury-50 dark:bg-luxury-950 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl font-bold text-center text-luxury-900 dark:text-luxury-50 mb-16">{t('landing.why.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUsFeatures.map((feat, idx) => (
              <Card key={idx} delay={idx * 0.1} className="text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gold-700/20 dark:from-gold-500/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-gold-700/30 dark:border-gold-500/30">
                  <feat.icon size={32} className="text-gold-700 dark:text-gold-400" />
                </div>
                <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-3">{feat.title}</h3>
                <p className="text-sm text-luxury-600 dark:text-luxury-400 font-medium">{feat.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section id="deliverables" className="py-24 bg-white dark:bg-luxury-900 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl font-bold text-center text-luxury-900 dark:text-luxury-50 mb-16">{t('landing.deliv.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deliverables.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex gap-6 p-6 bg-luxury-50 dark:bg-luxury-950 rounded-2xl border border-luxury-200 dark:border-luxury-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="shrink-0 w-14 h-14 bg-gradient-to-br from-gold-700 to-gold-600 dark:from-gold-500 dark:to-gold-400 rounded-xl flex items-center justify-center text-white dark:text-luxury-950 shadow-lg">
                  <item.icon size={28} />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">{item.title}</h3>
                  <p className="text-sm text-luxury-600 dark:text-luxury-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 bg-luxury-50 dark:bg-luxury-950 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl font-bold text-center text-luxury-900 dark:text-luxury-50 mb-16">{t('landing.pkg.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`relative bg-white dark:bg-luxury-900 border rounded-2xl p-8 flex flex-col transition-colors duration-500 ${pkg.recommended ? 'border-gold-700 dark:border-gold-500 shadow-[0_0_30px_rgba(166,136,104,0.15)] dark:shadow-[0_0_30px_rgba(197,156,106,0.15)] transform md:-translate-y-4' : 'border-luxury-200 dark:border-luxury-800 shadow-lg'}`}
              >
                {pkg.recommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-500 dark:to-gold-400 text-white dark:text-luxury-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">{pkg.name}</h3>
                <p className="text-sm text-luxury-600 dark:text-luxury-400 font-medium mb-6 h-10">{pkg.target}</p>
                
                <div className="mb-6">
                  <p className="text-sm font-bold text-luxury-500 line-through mb-1">{pkg.oldPrice}</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-400 dark:to-gold-600 text-transparent bg-clip-text">{pkg.price}</p>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-start gap-3 text-luxury-700 dark:text-luxury-300 text-sm font-bold">
                    <Maximize2 size={16} className="text-gold-700 dark:text-gold-500 mt-0.5 shrink-0" />
                    <span>{pkg.area}</span>
                  </div>
                  <div className="flex items-start gap-3 text-luxury-700 dark:text-luxury-300 text-sm font-medium">
                    <Check size={16} className="text-gold-700 dark:text-gold-500 mt-0.5 shrink-0" />
                    <span>{pkg.scope}</span>
                  </div>
                  {pkg.bonus && (
                    <div className="flex items-start gap-3 text-gold-700 dark:text-gold-400 text-sm font-bold mt-4 p-3 bg-gold-700/10 dark:bg-gold-500/10 rounded-lg border border-gold-700/20 dark:border-gold-500/20">
                      <Star size={16} className="mt-0.5 shrink-0" />
                      <span>{pkg.bonus}</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant={pkg.recommended ? 'primary' : 'outline'} 
                  onClick={() => onSelectRole('CLIENT')}
                  className="w-full"
                >
                  {t('landing.pkg.select')}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-white dark:bg-luxury-900 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl font-bold text-center text-luxury-900 dark:text-luxury-50 mb-16">{t('landing.port.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
              >
                <img src={`https://picsum.photos/id/${item.id}/800/600`} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-950/90 via-luxury-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <span className="text-sm font-bold uppercase tracking-wider">View Project</span>
                    <ChevronDown size={16} className="-rotate-90" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-luxury-950 text-center border-t border-luxury-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl font-bold tracking-widest bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-transparent bg-clip-text mb-6">{t('app.title')}</h2>
          <p className="text-lg text-luxury-400 font-serif italic mb-8">
            {t('landing.footer.quote')}
          </p>
          <p className="text-sm text-luxury-600 font-medium">
            {t('landing.footer.rights')}
          </p>
        </div>
      </footer>

      {/* Quick Booking Modal */}
      <AnimatePresence>
        {showQuickBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={isRTL ? 'rtl' : 'ltr'}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-luxury-950 rounded-2xl p-6 md:p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-luxury-200 dark:border-luxury-800"
            >
              <Booking isQuickBooking={true} onClose={() => setShowQuickBooking(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
