import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { StageStatus, ViewModule, ProjectStage, ContractItem } from '../types';
import { ChevronDown,  Save, CheckCircle2, Edit3, FileCheck, DollarSign, PenTool, Send, Paperclip, Calendar, Ticket, Globe, Moon, Edit2, Check, Search, Briefcase, MessageSquare, AlertCircle, Settings, Plus, Trash2, Archive, RefreshCw, LogOut, Clock, Ban, Lock, Unlock, MapPin, Video, Building, FileText, Stamp, Award, ShieldCheck, X, Eye, Printer, Zap, Wrench  } from 'lucide-react';


const COUNTRIES = [
  { code: '+973', name: 'البحرين', en: 'Bahrain' },
  { code: '+966', name: 'السعودية', en: 'Saudi Arabia' },
  { code: '+971', name: 'الإمارات', en: 'UAE' },
  { code: '+965', name: 'الكويت', en: 'Kuwait' },
  { code: '+968', name: 'عمان', en: 'Oman' },
  { code: '+974', name: 'قطر', en: 'Qatar' },
  { code: '+20', name: 'مصر', en: 'Egypt' },
  { code: '+962', name: 'الأردن', en: 'Jordan' },
  { code: '+961', name: 'لبنان', en: 'Lebanon' },
  { code: '+964', name: 'العراق', en: 'Iraq' },
  { code: '+1', name: 'أمريكا', en: 'USA' },
  { code: '+44', name: 'بريطانيا', en: 'UK' },
  { code: '+90', name: 'تركيا', en: 'Turkey' }
];

const PhoneInput = ({ value, onChange, isAr }: { value: string, onChange: (v: string) => void, isAr: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  // Extract initial code and number
  const initialCode = COUNTRIES.find(c => value.startsWith(c.code))?.code || '+973';
  const initialNum = value.replace(initialCode, '').trim();
  
  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [number, setNumber] = useState(initialNum);
  
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = COUNTRIES.filter(c => 
    c.code.includes(search) || 
    c.name.includes(search) || 
    c.en.toLowerCase().includes(search.toLowerCase())
  );

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNum = e.target.value;
    setNumber(newNum);
    onChange(newNum ? `${selectedCode} ${newNum}` : '');
  };

  const selectCode = (code: string) => {
    setSelectedCode(code);
    setIsOpen(false);
    setSearch('');
    onChange(number ? `${code} ${number}` : '');
  };

  return (
    <div className="flex gap-2 relative" ref={containerRef}>
      <div className="relative w-1/3">
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-full flex items-center justify-between bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-3 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700"
          dir="ltr"
        >
          <span>{selectedCode}</span>
          <ChevronDown size={14} className="opacity-50" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-luxury-100 dark:border-luxury-800">
              <input 
                type="text" 
                placeholder={isAr ? "بحث بالدولة أو الرمز..." : "Search country or code..."}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-gold-700"
              />
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar">
              {filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => selectCode(c.code)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-luxury-50 dark:hover:bg-luxury-800 flex justify-between items-center transition-colors"
                >
                  <span className="text-luxury-600 dark:text-luxury-400">{isAr ? c.name : c.en}</span>
                  <span className="font-medium" dir="ltr">{c.code}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-sm text-luxury-500 text-center">
                  {isAr ? "لا توجد نتائج" : "No results"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <input
        type="tel"
        value={number}
        onChange={handleNumberChange}
        className="w-2/3 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 focus:ring-1 focus:ring-gold-700 text-left"
        placeholder="3XXX XXXX"
        dir="ltr"
      />
    </div>
  );
};

export const AdminDirectory: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, globalState, setGlobalState, role, lang } = useAppContext();
  const { clients } = globalState;
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'ADMIN_DIRECTORY' || e.detail === 'SUPPORT_CLIENTS') {
        setSearchTerm('');
        setFilter('All');
        setIsCreateModalOpen(false);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);
  const [filter, setFilter] = useState('All');

  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClientForm, setNewClientForm] = useState({ name: '', email: '', phone: '' });
  const [createError, setCreateError] = useState('');

  const handleCreateClient = () => {
    if (!newClientForm.name.trim()) {
      setCreateError(t('admin.directory.errorNameRequired') || (role === 'SUPPORT' && lang === 'ar' ? 'الاسم مطلوب' : 'Name is required'));
      return;
    }
    if (!newClientForm.email.trim() && !newClientForm.phone.trim()) {
      setCreateError(t('admin.directory.errorContactRequired') || (role === 'SUPPORT' && lang === 'ar' ? 'يجب إدخال البريد الإلكتروني أو رقم الهاتف' : 'Either Email or Phone is required'));
      return;
    }
    
    
    const newId = 'client_' + Math.random().toString(36).substr(2, 9);
    
    // Define the full structure expected by the app based on createMockClient structure from constants
    // We create a fresh baseline client object using the exact properties expected
        const newClientObj: any = {
      profile: {
        id: newId,
        name: newClientForm.name,
        email: newClientForm.email || 'N/A',
        phone: newClientForm.phone || 'N/A',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200',
        tier: 'Standard',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        project: 'New Project',
        area: '-',
        location: '-',
        style: '-',
        completion: 0,
        freeConsultations: 0
      },
      hasPendingApprovals: false,
      hasUnreadMessages: false,
      hasNewTickets: false,
      milestones: [
        { id: 'm1', stage: 'Stage 1: Discovery & Concept', status: 'In Progress', date: 'Pending', pendingAction: true }
      ],
      materials: [],
      invoice: {
        id: 'INV-NEW',
        title: 'Initial Invoice',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Unpaid',
        items: []
      },
      paidInvoices: [],
      cart: [],
      chatHistory: [],
      contract: {
        id: 'CON-NEW',
        title: 'Design Agreement',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        content: 'Please upload the contract document.'
      },
      contracts: [],
      bookings: [],
      tasks: [],
      tickets: [],
      project: {
        title: 'New Project',
        subtitle: '',
        description: '',
        progress: 0,
        totalStages: 5,
        currentStage: 1,
        nextMilestone: '',
        deliveryDate: '',
        images: [],
        updates: []
      }
    };
    
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [newId]: newClientObj
      }
    }));
    
    setNewClientForm({ name: '', email: '', phone: '' });

    setCreateError('');
    setIsCreateModalOpen(false);
  };

  const activeClients = Object.values(clients).filter(c => c.profile.status === 'Active');

  const clientList = activeClients.filter(client => {
    const matchesSearch = client.profile.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || (filter === 'VIP' && client.profile.tier.includes('VIP')) || (filter === 'Pending' && (client.hasPendingApprovals || client.hasUnreadMessages || client.hasNewTickets));
    return matchesSearch && matchesFilter;
  });

  const handleOpenWorkspace = (clientId: string) => {
    setGlobalState(prev => ({ ...prev, activeClientId: clientId }));
    if (role === 'SUPPORT') {
      setView(ViewModule.SUPPORT_CLIENT_DASHBOARD);
    } else {
      setView(ViewModule.ADMIN_DASHBOARD);
    }
  };

  const totalProjects = activeClients.length;
  const totalPendingApprovals = activeClients.filter(c => c.hasPendingApprovals).length;
  const totalUnreadMessages = activeClients.filter(c => c.hasUnreadMessages).length;
  const totalNewTickets = activeClients.filter(c => c.hasNewTickets).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.directory.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.directory.desc')}</p>
        </div>
      
        {role === 'SUPPORT' && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} />
            {lang === 'ar' ? 'فتح حساب جديد' : 'Open New Account'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('admin.directory.totalProjects'), value: totalProjects.toString(), icon: Briefcase, color: 'text-gold-700 dark:text-gold-400' },
          { label: 'Pending Approvals', value: totalPendingApprovals.toString(), icon: FileCheck, color: 'text-red-500 dark:text-red-400' },
          { label: 'Unread Messages', value: totalUnreadMessages.toString(), icon: MessageSquare, color: 'text-blue-500 dark:text-blue-400' },
          { label: 'New Tickets', value: totalNewTickets.toString(), icon: Ticket, color: 'text-green-500 dark:text-green-400' }
        ].map((metric, idx) => (
          <Card key={idx} delay={0.1 * idx} className="flex items-center justify-between">
            <div>
              <p className="text-luxury-600 dark:text-luxury-400 font-bold text-sm mb-1">{metric.label}</p>
              <p className={`text-2xl font-serif font-bold ${metric.color}`}>{metric.value}</p>
            </div>
            <motion.div whileHover={{ rotate: 15, scale: 1.1 }}>
              <metric.icon size={32} className="text-luxury-300 dark:text-luxury-700" />
            </motion.div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-400" size={18} />
            <input 
              type="text" 
              placeholder={t('admin.directory.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg pl-10 pr-4 py-2 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500 shadow-inner transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            {['All', 'VIP', 'Pending'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${filter === f ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950 shadow-md' : 'bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:border-gold-700 dark:hover:border-gold-500'}`}
              >
                {f === 'All' ? t('admin.directory.filterAll') : f === 'VIP' ? t('admin.directory.filterVIP') : t('admin.directory.filterPending')}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {clientList.map((client) => (
            <motion.div 
              key={client.profile.id}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)', borderColor: 'rgba(197,156,106,0.5)' }}
              onClick={() => handleOpenWorkspace(client.profile.id)}
              className="bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl p-6 shadow-lg transition-colors duration-500 flex flex-col items-center justify-center relative cursor-pointer group"
            >
              {/* Notification Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {client.hasUnreadMessages && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" title="New Message" />}
                {client.hasPendingApprovals && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" title="Pending Approval" />}
                {client.hasNewTickets && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" title="New Ticket" />}
              </div>

              <motion.img 
                whileHover={{ scale: 1.1, rotate: 5 }}
                src={client.profile.avatar} 
                alt={client.profile.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-gold-700 dark:border-gold-500 shadow-md mb-4" 
              />
              <h4 className="font-bold text-lg text-luxury-900 dark:text-luxury-50 text-center leading-tight group-hover:text-gold-700 dark:group-hover:text-gold-400 transition-colors">{client.profile.name}</h4>
            </motion.div>
          ))}
        </motion.div>
      </Card>

      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-luxury-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md border border-luxury-200 dark:border-luxury-800"
            >
              <div className="p-6 border-b border-luxury-100 dark:border-luxury-800 flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50">
                  {lang === 'ar' ? 'فتح حساب عميل جديد' : 'Create New Client Account'}
                </h3>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-luxury-500 hover:text-luxury-900 dark:hover:text-luxury-50 hover:bg-luxury-100 dark:hover:bg-luxury-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {createError && (
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2 font-bold">
                    <AlertCircle size={16} />
                    {createError}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-2">
                    {lang === 'ar' ? 'الاسم (مطلوب)' : 'Name (Required)'}
                  </label>
                  <input
                    type="text"
                    value={newClientForm.name}
                    onChange={(e) => setNewClientForm({...newClientForm, name: e.target.value})}
                    className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 focus:ring-1 focus:ring-gold-700"
                    placeholder={lang === 'ar' ? 'اسم العميل' : 'Client Name'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-2">
                    {lang === 'ar' ? 'البريد الإلكتروني (اختياري إذا تم إدخال الرقم)' : 'Email (Optional if Phone is provided)'}
                  </label>
                  <input
                    type="email"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({...newClientForm, email: e.target.value})}
                    className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 focus:ring-1 focus:ring-gold-700"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-luxury-700 dark:text-luxury-300 mb-2">
                    {lang === 'ar' ? 'رقم الهاتف (اختياري إذا تم إدخال الإيميل)' : 'Phone Number (Optional if Email is provided)'}
                  </label>
                  <PhoneInput 
                    value={newClientForm.phone} 
                    onChange={(val) => setNewClientForm({...newClientForm, phone: val})} 
                    isAr={lang === 'ar'} 
                  />
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleCreateClient} className="w-full">
                    {lang === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export const AdminArchive: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, globalState, setGlobalState } = useAppContext();
  const { clients } = globalState;
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'ADMIN_ARCHIVE') {
        setSearchTerm('');
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);

  const archivedClients = Object.values(clients).filter(c => c.profile.status === 'Archived');

  const clientList = archivedClients.filter(client => {
    return client.profile.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleReactivate = (clientId: string) => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [clientId]: {
          ...prev.clients[clientId],
          profile: { ...prev.clients[clientId].profile, status: 'Active' }
        }
      }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.archive.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.archive.desc')}</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-400" size={18} />
            <input 
              type="text" 
              placeholder={t('admin.directory.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg pl-10 pr-4 py-2 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500 shadow-inner transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clientList.length === 0 ? (
            <div className="col-span-full text-center py-12 text-luxury-500 font-medium">No archived projects found.</div>
          ) : (
            clientList.map((client, idx) => (
              <motion.div 
                key={client.profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center relative opacity-80 hover:opacity-100 transition-opacity"
              >
                <img src={client.profile.avatar} alt={client.profile.name} className="w-20 h-20 rounded-full object-cover border-2 border-luxury-300 dark:border-luxury-700 grayscale mb-4" />
                <h4 className="font-bold text-lg text-luxury-900 dark:text-luxury-50 text-center leading-tight mb-4">{client.profile.name}</h4>
                <Button variant="outline" onClick={() => handleReactivate(client.profile.id)} className="w-full py-2 text-xs"><RefreshCw size={16}/> {t('admin.directory.reactivateBtn')}</Button>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export const AdminCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  
  const { t, globalState, setGlobalState } = useAppContext();
  const { clients, blockedSlots } = globalState;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockTime, setBlockTime] = useState('ALL_DAY');
  const isAr = document.documentElement.dir === 'rtl';

  // Gather all bookings from all clients
  const allBookings = Object.values(clients).flatMap(c => 
    c.bookings.map(b => ({ ...b, clientName: c.profile.name, clientId: c.profile.id }))
  );

  const handleBlockSlot = () => {
    if (!selectedDate || !blockReason.trim()) return;
    
    const newBlock = {
      id: `blk${Date.now()}`,
      date: selectedDate, // ISO string YYYY-MM-DD
      time: blockTime,
      durationHours: blockTime === 'ALL_DAY' ? 24 : 2,
      reason: blockReason
    };

    setGlobalState(prev => ({
      ...prev,
      blockedSlots: [...prev.blockedSlots, newBlock]
    }));
    
    setBlockReason('');
    setBlockTime('ALL_DAY');
  };

  const handleRemoveBlock = (id: string) => {
    setGlobalState(prev => ({
      ...prev,
      blockedSlots: prev.blockedSlots.filter(b => b.id !== id)
    }));
  };

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDayOfWeek = currentMonth.getDay();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.calendar.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.calendar.desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-luxury-900 dark:text-luxury-200 capitalize">
                {currentMonth.toLocaleDateString(isAr ? 'ar-BH' : 'en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-1 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">&lt;</button>
                <button onClick={nextMonth} className="p-1 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">&gt;</button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-xs font-bold text-luxury-500">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const yyyy = cellDate.getFullYear();
                const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
                const dd = String(cellDate.getDate()).padStart(2, '0');
                const dateString = `${yyyy}-${mm}-${dd}`;
                
                const isSelected = selectedDate === dateString;
                const blocks = [
                  ...blockedSlots.filter(b => b.date === dateString),
                  ...allBookings.filter(b => b.date === dateString && b.status === 'Confirmed').map(b => ({
                    id: b.id,
                    date: b.date,
                    time: b.time,
                    durationHours: b.durationHours,
                    reason: `Consultation: ${b.type}`
                  }))
                ];
                const isFullyBlocked = blocks.some(b => b.time === 'ALL_DAY');
                const dayBookings = allBookings.filter(b => b.date === dateString);
                
                return (
                  <button 
                    key={day}
                    onClick={() => setSelectedDate(dateString)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${
                      isSelected ? 'bg-gradient-to-br from-gold-600 to-gold-400 dark:from-gold-400 dark:to-gold-600 text-white dark:text-luxury-950 font-bold shadow-[0_0_10px_rgba(166,136,104,0.5)] border-none' : 
                      isFullyBlocked ? 'bg-red-500/10 border border-red-500/20 text-red-500 opacity-70' :
                      'bg-luxury-50/50 dark:bg-luxury-950/50 border border-luxury-200 dark:border-luxury-800 font-medium text-luxury-700 dark:text-luxury-300 hover:bg-luxury-100 dark:hover:bg-luxury-800 hover:border-luxury-300 dark:hover:border-luxury-600'
                    }`}
                  >
                    {day}
                    <div className="flex gap-1 mt-1">
                      {dayBookings.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />}
                      {blocks.length > 0 && !isFullyBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {selectedDate && (
            <Card>
              <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-4">
                Block Time on {new Date(selectedDate).toLocaleDateString(isAr ? 'ar-BH' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <select 
                    value={blockTime}
                    onChange={(e) => setBlockTime(e.target.value)}
                    className="bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-3 py-2 text-sm font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
                  >
                    <option value="ALL_DAY">{t('admin.bookings.allDay')}</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                  <input 
                    type="text" 
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder={t('admin.bookings.reason')} 
                    className="flex-1 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 text-sm font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
                  />
                </div>
                <Button onClick={handleBlockSlot} variant="secondary" className="w-full"><Ban size={16}/> {t('admin.bookings.block')}</Button>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50">
            Schedule for {selectedDate ? new Date(selectedDate).toLocaleDateString(isAr ? 'ar-BH' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
          </h3>
          
          {selectedDate && (
            <div className="space-y-4">
              {/* Show Bookings for selected date */}
              {allBookings.filter(b => b.date === selectedDate).map(booking => (
                <div key={booking.id} className="p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-luxury-900 dark:text-luxury-200">{booking.clientName}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 
                      booking.status === 'Awaiting Payment' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 
                      'bg-gold-500/10 text-gold-600 dark:text-gold-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-luxury-600 dark:text-luxury-400">{booking.time} • {booking.type} ({booking.durationHours}h)</p>
                </div>
              ))}

              {/* Show Blocked Slots for selected date */}
              {blockedSlots.filter(b => b.date === selectedDate).map(slot => (
                <div key={slot.id} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-red-600 dark:text-red-400">{slot.time === 'ALL_DAY' ? 'All Day Blocked' : `Blocked: ${slot.time}`}</h4>
                    <p className="text-sm font-medium text-luxury-600 dark:text-luxury-400">{slot.reason}</p>
                  </div>
                  <button onClick={() => handleRemoveBlock(slot.id)} className="text-red-500 hover:text-red-700 transition-colors p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {allBookings.filter(b => b.date === selectedDate).length === 0 && blockedSlots.filter(b => b.date === selectedDate).length === 0 && (
                <p className="text-sm text-luxury-500 text-center py-4">No events scheduled for this day.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const [localCompletion, setLocalCompletion] = useState(activeClient.profile.completion);
  const [localMilestones, setLocalMilestones] = useState(activeClient.milestones);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [attachData, setAttachData] = useState<Record<string, { url: string, name: string }>>({});

  useEffect(() => {
    setLocalCompletion(activeClient.profile.completion);
    setLocalMilestones(activeClient.milestones);
  }, [globalState.activeClientId]);

  // Auto-calculate completion based on milestone weights
  useEffect(() => {
    if (!manualOverride) {
      const calculatedCompletion = Math.round(localMilestones.reduce((acc, m) => {
        if (m.status === StageStatus.COMPLETED) return acc + m.weight;
        if (m.status === StageStatus.IN_PROGRESS) return acc + (m.weight * 0.5);
        return acc;
      }, 0));
      setLocalCompletion(calculatedCompletion);
    }
  }, [localMilestones, manualOverride]);

  const handleStatusChange = (id: string, newStatus: StageStatus) => {
    setLocalMilestones(prev => 
      prev.map(m => m.id === id ? { ...m, status: newStatus } : m)
    );
  };

  const handleAttachAndComplete = (milestoneId: string) => {
    const data = attachData[milestoneId];
    if (!data || !data.url || !data.name) return;

    // 1. Update Milestone Status & Attachment
    setLocalMilestones(prev => 
      prev.map(m => m.id === milestoneId ? { ...m, status: StageStatus.COMPLETED, attachment: data } : m)
    );

    // 2. Send Message to Client
    const newMessage = {
      id: `msg${Date.now()}`,
      sender: 'ARCHITECT' as const,
      text: `I have uploaded the deliverables for ${t(`stage.${milestoneId}`)}. Please review.`,
      attachment: { name: data.name, size: 'Link', url: data.url },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          chatHistory: [...prev.clients[prev.activeClientId].chatHistory, newMessage]
        }
      }
    }));

    // Clear input
    setAttachData(prev => ({ ...prev, [milestoneId]: { url: '', name: '' } }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setGlobalState(prev => ({
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...prev.clients[prev.activeClientId],
            profile: { ...prev.clients[prev.activeClientId].profile, completion: localCompletion },
            milestones: localMilestones
          }
        }
      }));
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleArchiveProject = () => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          profile: { ...prev.clients[prev.activeClientId].profile, status: 'Archived' }
        }
      }
    }));
    setView(ViewModule.ADMIN_DIRECTORY);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.dashboard.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.dashboard.desc')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="secondary" onClick={handleArchiveProject} className="flex-1 md:flex-none text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20">
            <Archive size={18}/> <span className="hidden sm:inline">{t('admin.dashboard.archive')}</span>
          </Button>
          <Button onClick={handleSave} disabled={isSaving || saved} className="flex-1 md:flex-none">
            {isSaving ? 'Saving...' : saved ? <><CheckCircle2 size={18}/> {t('admin.project.saved')}</> : <><Save size={18}/> {t('admin.project.save')}</>}
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 flex items-center gap-2"><Edit3 size={20} className="text-gold-700 dark:text-gold-500"/> {t('admin.project.updateProgress')}</h3>
          <button 
            onClick={() => setManualOverride(!manualOverride)}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${manualOverride ? 'bg-gold-500/20 text-gold-700 dark:text-gold-400' : 'bg-luxury-100 dark:bg-luxury-800 text-luxury-500'}`}
          >
            {manualOverride ? <Unlock size={14}/> : <Lock size={14}/>}
            {manualOverride ? 'Manual Edit Enabled' : t('admin.project.unlockManual')}
          </button>
        </div>
        <div className="flex items-center gap-6">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={localCompletion} 
            onChange={(e) => setLocalCompletion(Number(e.target.value))}
            disabled={!manualOverride}
            className={`flex-1 h-2 rounded-lg appearance-none accent-gold-700 dark:accent-gold-500 ${manualOverride ? 'bg-luxury-200 dark:bg-luxury-800 cursor-pointer' : 'bg-luxury-100 dark:bg-luxury-900 cursor-not-allowed opacity-50'}`}
          />
          <div className="w-20 text-center p-3 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg shadow-inner">
            <span className="font-bold text-xl text-gold-700 dark:text-gold-400">{localCompletion}%</span>
          </div>
        </div>
        {!manualOverride && <p className="text-xs text-luxury-500 mt-2">{t('admin.project.autoCalc')}</p>}
      </Card>

      <Card>
        <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-6">{t('admin.project.stages')}</h3>
        <div className="space-y-4">
          {localMilestones.map((milestone) => {
            const isDeliverableStage = milestone.stage === ProjectStage.RENDERS || milestone.stage === ProjectStage.LAYOUTS || milestone.stage === ProjectStage.CONSTRUCTION;
            
            return (
              <div key={milestone.id} className="flex flex-col p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg shadow-sm gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-luxury-900 dark:text-luxury-200">{t(`stage.${milestone.id}`)}</h4>
                    <p className="text-xs font-medium text-luxury-500">Weight: {milestone.weight}%</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusChange(milestone.id, StageStatus.COMPLETED)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${milestone.status === StageStatus.COMPLETED ? 'bg-green-500 text-white' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400 hover:bg-luxury-300 dark:hover:bg-luxury-700'}`}
                    >
                      Completed
                    </button>
                    <button 
                      onClick={() => handleStatusChange(milestone.id, StageStatus.IN_PROGRESS)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${milestone.status === StageStatus.IN_PROGRESS ? 'bg-gold-700 dark:bg-gold-500 text-white' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400 hover:bg-luxury-300 dark:hover:bg-luxury-700'}`}
                    >
                      In Progress
                    </button>
                    <button 
                      onClick={() => handleStatusChange(milestone.id, StageStatus.UPCOMING)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${milestone.status === StageStatus.UPCOMING ? 'bg-luxury-500 text-white' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400 hover:bg-luxury-300 dark:hover:bg-luxury-700'}`}
                    >
                      Upcoming
                    </button>
                  </div>
                </div>

                {/* Attachment Section for Deliverable Stages */}
                {isDeliverableStage && milestone.status !== StageStatus.COMPLETED && (
                  <div className="mt-2 pt-4 border-t border-luxury-200 dark:border-luxury-800 flex flex-col md:flex-row gap-2">
                    <input 
                      type="text" 
                      placeholder={t('admin.project.fileName')}
                      value={attachData[milestone.id]?.name || ''}
                      onChange={(e) => setAttachData(prev => ({ ...prev, [milestone.id]: { ...prev[milestone.id], name: e.target.value } }))}
                      className="flex-1 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-gold-500"
                    />
                    <input 
                      type="text" 
                      placeholder={t('admin.project.fileUrl')}
                      value={attachData[milestone.id]?.url || ''}
                      onChange={(e) => setAttachData(prev => ({ ...prev, [milestone.id]: { ...prev[milestone.id], url: e.target.value } }))}
                      className="flex-1 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-gold-500"
                    />
                    <Button 
                      onClick={() => handleAttachAndComplete(milestone.id)}
                      disabled={!attachData[milestone.id]?.name || !attachData[milestone.id]?.url}
                      className="py-2 px-4 text-sm whitespace-nowrap"
                    >
                      <Send size={14}/> {t('admin.project.attachFile')}
                    </Button>
                  </div>
                )}
                {milestone.attachment && (
                  <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-sm font-bold text-green-700 dark:text-green-400">
                    <CheckCircle2 size={16} /> Attached: {milestone.attachment.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export const AdminFinance: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];

  const toggleInvoiceStatus = () => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          invoice: { ...prev.clients[prev.activeClientId].invoice, status: prev.clients[prev.activeClientId].invoice.status === 'Paid' ? 'Pending' : 'Paid' }
        }
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.finance.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.finance.desc')}</p>
        </div>
        <Button><DollarSign size={18}/> {t('admin.finance.generate')}</Button>
      </div>

      <Card className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-xl text-luxury-900 dark:text-luxury-200">{activeClient.invoice.id}</h4>
          <p className="text-sm font-medium text-luxury-500">{activeClient.invoice.date} • {activeClient.profile.name}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-bold text-luxury-400">{t('admin.finance.status')}</p>
            <p className={`font-bold text-lg ${activeClient.invoice.status === 'Paid' ? 'text-green-500' : 'text-gold-700 dark:text-gold-500'}`}>{activeClient.invoice.status}</p>
          </div>
          <Button variant={activeClient.invoice.status === 'Paid' ? 'outline' : 'primary'} onClick={toggleInvoiceStatus}>
            {activeClient.invoice.status === 'Paid' ? 'Mark as Pending' : t('admin.finance.markPaid')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const AdminContracts: React.FC = () => {
  const { t, lang, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const isAr = lang === 'ar';

  // Ensure contracts array fallback
  const clientContracts: ContractItem[] = activeClient?.contracts && activeClient.contracts.length > 0
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
            '1. SCOPE OF WORK: The Studio agrees to provide comprehensive architectural and interior design services.',
            '2. TIMELINE: Studio commits to delivering phased milestones with scheduled revisions.',
            '3. CONFIDENTIALITY: All customized spatial concepts and renderings remain proprietary.',
            '4. SETTLEMENT & TAX: Staged payments follow approved milestones with 10% VAT.'
          ],
          clausesAr: [
            '١. نطاق العمل: يلتزم استوديو زين بتقديم التصاميم المعمارية الداخلية والمخططات التنفيذية 2D/3D وفق معايير الجودة.',
            '٢. الجدول الزمني: يلتزم الاستوديو بتسليم مخرجات كل مرحلة وفق الجدول الزمني المتفق عليه.',
            '٣. السرية والملكية الفكرية: تعتبر كافة المخططات والتصورات ملكية فكرية محمية حتى اكتمال الاعتماد.',
            '٤. الدفعات والضرائب: تُسدد الدفعات حسب جدول المستخلصات المعتمد مع إضافة ضريبة القيمة المضافة ١٠٪.'
          ],
          totalValue: 8500,
          dateCreated: 'Oct 12, 2024',
          status: activeClient.contract.isSignedByClient ? (activeClient.contract.isSealedByArchitect ? 'Sealed' : 'Signed') : 'Pending',
          isSignedByClient: activeClient.contract.isSignedByClient,
          isSealedByArchitect: activeClient.contract.isSealedByArchitect,
          signedAt: activeClient.contract.isSignedByClient ? 'Oct 14, 2024 • 02:30 PM' : undefined,
          sealedAt: activeClient.contract.isSealedByArchitect ? 'Oct 15, 2024 • 11:00 AM' : undefined,
          signeeName: activeClient.profile.name
        }
      ];

  const [filter, setFilter] = useState<'all' | 'pending' | 'ready' | 'sealed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewContract, setPreviewContract] = useState<ContractItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Dispatching New Contract
  const [targetClientId, setTargetClientId] = useState(globalState.activeClientId);
  const [contractType, setContractType] = useState('Architectural & Interior Design');
  const [contractTitle, setContractTitle] = useState('');
  const [contractTitleAr, setContractTitleAr] = useState('');
  const [contractDesc, setContractDesc] = useState('');
  const [contractClauses, setContractClauses] = useState('');
  const [contractValue, setContractValue] = useState<number | ''>(4500);

  // Contract presets for quick selection by the architect
  const presets = [
    {
      type: 'Architectural & Interior Design',
      typeAr: 'تصميم معماري وديكور داخلي',
      title: 'Master Architectural & Interior Design Agreement',
      titleAr: 'اتفاقية التصميم المعماري والديكور الداخلي الشامل',
      desc: 'Complete spatial planning, 2D executive blueprints, 3D 4K visualization, and bespoke material schedules.',
      descAr: 'المخططات المعمارية التنفيذية 2D، نمذجة ثلاثية الأبعاد بجودة 4K، وتوصيف المواد الفاخرة للأجنحة والمجالس.',
      clauses: '1. Phase deliverables must pass client sign-off within 7 calendar days.\n2. Includes up to two comprehensive design revisions.\n3. Turnkey construction supervision option reserved with 10% studio preferential rate.\n4. Payments linked to Milestone Schedule + 10% Bahrain statutory VAT.',
      value: 6500
    },
    {
      type: 'Site Supervision',
      typeAr: 'إشراف هندسي ميداني',
      title: 'Site Supervision & Quality Assurance Mandate',
      titleAr: 'عقد الإشراف الهندسي الميداني ومطابقة الجودة والتنفيذ',
      desc: 'Bi-weekly on-site engineering inspections, contractor guidance, structural integrity audits, and portal inspection logs.',
      descAr: 'زيارات ميدانية هندسية أسبوعية لتدقيق جودة البناء، التنسيق مع المقاولين ومطابقة المخططات الإنشائية والتشطيبية.',
      clauses: '1. Lead engineer conducts scheduled site audits with photographic portal logging.\n2. Immediate stop-work order authority granted for unauthorized structural deviations.\n3. Coordination meetings held monthly with primary MEP and civil contractors.',
      value: 2800
    },
    {
      type: 'Material Sourcing',
      typeAr: 'توريد المواد والأثاث',
      title: 'Italian Marble & Custom FF&E Procurement Addendum',
      titleAr: 'ملحق توريد واختيار الرخام الإيطالي الفاخر والأثاث المخصص',
      desc: 'Direct quarry selection, stone diagnostic inspection, custom European furniture fabrication, and white-glove delivery.',
      descAr: 'معاينة واعتماد ألواح الرخام الطبيعي المستورد، تصنيع الأثاث الحصري، والشحن البحري المؤمن لموقع المشروع.',
      clauses: '1. Certified origin authentication from Carrara and Tuscan quarries.\n2. Marine cargo insurance and climate-controlled container transit included.\n3. Dry-lay review inspection required before permanent adhesive application.',
      value: 5200
    },
    {
      type: 'Turnkey Construction',
      typeAr: 'تنفيذ مقاولات وتسليم مفتاح',
      title: 'Turnkey Execution & Fit-Out Contracting Covenant',
      titleAr: 'عقد المقاولة والتنفيذ الإنشائي والتشطيب تسليم مفتاح',
      desc: 'Complete turnkey architectural execution, premium fit-outs, MEP installation, and final handover.',
      descAr: 'التنفيذ الميداني الكامل، التشطيبات الفندقية الفاخرة، الأعمال الكهروميكانيكية، والتسليم المفتاح النهائي.',
      clauses: '1. Work executed strictly in accordance with approved MEP and structural drawing sets.\n2. Handover milestone timeline bound with penalty clauses for unexcused delays.\n3. 10-year structural warranty and 1-year comprehensive defect liability period.',
      value: 18500
    }
  ];

  // Set default preset on load or change
  const applyPreset = (idx: number) => {
    const p = presets[idx];
    setContractType(p.type);
    setContractTitle(p.title);
    setContractTitleAr(p.titleAr);
    setContractDesc(isAr ? p.descAr : p.desc);
    setContractClauses(p.clauses);
    setContractValue(p.value);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dispatch New Contract directly to the client's contracts section
  const handleDispatchContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractTitle.trim()) return;

    const clausesArray = contractClauses
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const targetClientObj = globalState.clients[targetClientId];
    const existingCount = (targetClientObj?.contracts?.length || 0) + 1;
    const refNum = `ZA-CON-2024-${String(existingCount).padStart(3, '0')}`;

    const newContract: ContractItem = {
      id: `con-${Date.now()}`,
      referenceNumber: refNum,
      title: contractTitle,
      titleAr: contractTitleAr || contractTitle,
      type: contractType,
      typeAr: presets.find(p => p.type === contractType)?.typeAr || contractType,
      description: contractDesc,
      descriptionAr: contractDesc,
      clauses: clausesArray.length > 0 ? clausesArray : [
        '1. Scope and deliverables defined per project charter.',
        '2. Milestones and payment obligations follow statutory regulations.',
        '3. Digital signature validates immediate contractual binding.'
      ],
      clausesAr: clausesArray.length > 0 ? clausesArray : [
        '١. نطاق العمل والمخرجات محددة وفق المخطط العام للمشروع.',
        '٢. الدفعات والالتزامات تخضع للأنظمة والقوانين المعمول بها.',
        '٣. التوقيع الرقمي يعتبر ملزماً ونافذاً بمجرد إتمامه.'
      ],
      totalValue: Number(contractValue) || 0,
      dateCreated: dateStr,
      status: 'Pending',
      isSignedByClient: false,
      isSealedByArchitect: false
    };

    setGlobalState(prev => {
      const currentClient = prev.clients[targetClientId];
      const prevContracts = currentClient.contracts && currentClient.contracts.length > 0 
        ? currentClient.contracts 
        : clientContracts;

      return {
        ...prev,
        clients: {
          ...prev.clients,
          [targetClientId]: {
            ...currentClient,
            contracts: [newContract, ...prevContracts],
            hasPendingApprovals: true
          }
        }
      };
    });

    setIsModalOpen(false);
    showToast(t('admin.contracts.sendSuccess'));
    // Reset form
    setContractTitle('');
    setContractTitleAr('');
    setContractDesc('');
    setContractClauses('');
  };

  // Seal Contract with Official Architect Stamp
  const handleSealContract = (contractId: string) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString(isAr ? 'ar-BH' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setGlobalState(prev => {
      const currentClient = prev.clients[prev.activeClientId];
      const prevContracts = currentClient.contracts && currentClient.contracts.length > 0 
        ? currentClient.contracts 
        : clientContracts;

      const updated = prevContracts.map(c => {
        if (c.id === contractId) {
          return {
            ...c,
            status: 'Sealed' as const,
            isSealedByArchitect: true,
            sealedAt: formattedDate
          };
        }
        return c;
      });

      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...currentClient,
            contracts: updated,
            contract: {
              ...currentClient.contract,
              isSealedByArchitect: true
            }
          }
        }
      };
    });

    showToast(t('admin.contracts.sealSuccess'));
  };

  // Metrics
  const totalCount = clientContracts.length;
  const pendingCount = clientContracts.filter(c => !c.isSignedByClient).length;
  const readySealCount = clientContracts.filter(c => c.isSignedByClient && !c.isSealedByArchitect).length;
  const sealedCount = clientContracts.filter(c => c.isSealedByArchitect).length;

  const filteredContracts = clientContracts.filter(c => {
    if (filter === 'pending') return !c.isSignedByClient;
    if (filter === 'ready') return c.isSignedByClient && !c.isSealedByArchitect;
    if (filter === 'sealed') return c.isSealedByArchitect;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-gold-600 text-white dark:text-luxury-950 font-bold shadow-2xl flex items-center gap-3 border border-gold-400"
          >
            <CheckCircle2 size={20} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Dispatch Contract Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-luxury-200 dark:border-luxury-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-gold-500/10 text-gold-700 dark:text-gold-400">
              <Stamp size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400">
              {activeClient.profile.name} • {activeClient.profile.project}
            </span>
          </div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 via-gold-800 to-luxury-600 dark:from-luxury-50 dark:via-gold-400 dark:to-luxury-300 text-transparent bg-clip-text">
            {t('admin.contracts.title')}
          </h2>
          <p className="text-luxury-600 dark:text-luxury-400 text-sm font-medium mt-1">
            {t('admin.contracts.desc')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            onClick={() => {
              applyPreset(0);
              setIsModalOpen(true);
            }}
            className="w-full md:w-auto px-5 py-2.5 flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-gold-700 to-gold-600 hover:from-gold-800 hover:to-gold-700 text-white dark:text-luxury-950"
          >
            <Plus size={18} />
            <span>{t('admin.contracts.createNew')}</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isAr ? 'إجمالي العقود' : 'Total Contracts', value: totalCount, icon: FileText, color: 'text-luxury-800 dark:text-luxury-100', active: filter === 'all', key: 'all' as const },
          { label: isAr ? 'بانتظار توقيع العميل' : 'Awaiting Client', value: pendingCount, icon: Clock, color: 'text-amber-600 dark:text-amber-400', active: filter === 'pending', key: 'pending' as const },
          { label: isAr ? 'جاهزة للختم المعماري' : 'Ready for Seal', value: readySealCount, icon: Stamp, color: 'text-gold-600 dark:text-gold-400', active: filter === 'ready', key: 'ready' as const },
          { label: isAr ? 'مختومة ومعتمدة' : 'Sealed & Archived', value: sealedCount, icon: Award, color: 'text-emerald-600 dark:text-emerald-400', active: filter === 'sealed', key: 'sealed' as const },
        ].map((m, idx) => (
          <div
            key={idx}
            className="cursor-pointer"
            onClick={() => setFilter(m.key)}
          >
            <Card
              className={`transition-all ${m.active ? 'ring-2 ring-gold-600 dark:ring-gold-400 shadow-md' : 'hover:border-gold-500/40'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-luxury-500 font-bold mb-1">{m.label}</p>
                  <p className={`text-2xl font-serif font-bold ${m.color}`}>{m.value}</p>
                </div>
                <div className="p-2 rounded-xl bg-luxury-100 dark:bg-luxury-800 text-luxury-500">
                  <m.icon size={20} />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-luxury-200 dark:border-luxury-800 pb-2 text-xs font-bold">
        {[
          { key: 'all' as const, label: t('admin.contracts.tabAll'), count: totalCount },
          { key: 'pending' as const, label: t('admin.contracts.tabPending'), count: pendingCount },
          { key: 'ready' as const, label: t('admin.contracts.tabReadySeal'), count: readySealCount },
          { key: 'sealed' as const, label: t('admin.contracts.tabSealed'), count: sealedCount },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
              filter === tab.key
                ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950 shadow-md'
                : 'bg-luxury-100 dark:bg-luxury-900 text-luxury-600 dark:text-luxury-400 hover:bg-luxury-200 dark:hover:bg-luxury-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === tab.key ? 'bg-white/20 text-white dark:text-luxury-950' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map((c) => (
          <Card key={c.id} className="p-5 hover:border-gold-500/50 transition-all">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-luxury-100 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300">
                    {c.referenceNumber}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-gold-500/10 text-gold-700 dark:text-gold-400 border border-gold-500/20">
                    {isAr && c.typeAr ? c.typeAr : c.type}
                  </span>
                  <span className="text-xs text-luxury-400">• {c.dateCreated}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-luxury-900 dark:text-luxury-50">
                  {isAr && c.titleAr ? c.titleAr : c.title}
                </h3>

                <p className="text-xs text-luxury-600 dark:text-luxury-400 line-clamp-2">
                  {isAr && c.descriptionAr ? c.descriptionAr : c.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-luxury-500">
                  {c.totalValue && (
                    <span className="font-bold text-gold-700 dark:text-gold-400">
                      {isAr ? 'القيمة التعاقدية:' : 'Value:'} {c.totalValue.toLocaleString()} BHD
                    </span>
                  )}
                  {c.signedAt && (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 size={13} />
                      {isAr ? 'وقّع العميل في:' : 'Signed by Client:'} {c.signedAt}
                    </span>
                  )}
                  {c.sealedAt && (
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                      <Stamp size={13} />
                      {isAr ? 'خُتم رسمياً في:' : 'Sealed:'} {c.sealedAt}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons for Architect */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-luxury-100 dark:border-luxury-800">
                <Button
                  variant="outline"
                  onClick={() => setPreviewContract(c)}
                  className="py-2 px-3 text-xs flex items-center gap-1.5"
                >
                  <Eye size={14} />
                  <span>{t('admin.contracts.preview')}</span>
                </Button>

                {/* Seal Action if signed by client but not yet sealed */}
                {c.isSignedByClient && !c.isSealedByArchitect && (
                  <Button
                    onClick={() => handleSealContract(c.id)}
                    className="py-2 px-4 text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md animate-pulse"
                  >
                    <Stamp size={15} />
                    <span>{t('admin.contracts.sealBtn')}</span>
                  </Button>
                )}

                {/* Status Badges */}
                {!c.isSignedByClient && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Clock size={14} />
                    <span>{isAr ? 'بانتظار توقيع العميل' : 'Awaiting Client'}</span>
                  </span>
                )}

                {c.isSealedByArchitect && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={14} />
                    <span>{t('admin.contracts.sealed')}</span>
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filteredContracts.length === 0 && (
          <Card className="text-center py-12">
            <FileText size={40} className="mx-auto text-luxury-400 mb-3 opacity-60" />
            <p className="font-bold text-sm text-luxury-700 dark:text-luxury-300">
              {t('admin.contracts.empty')}
            </p>
            <p className="text-xs text-luxury-500 mt-1">
              {isAr ? 'يمكنك إرسال عقد رسمي جديد لهذا العميل عبر زر "إرسال عقد جديد للعميل".' : 'You can dispatch a new legal contract using the button above.'}
            </p>
          </Card>
        )}
      </div>

      {/* DISPATCH NEW CONTRACT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-white dark:bg-luxury-900 rounded-2xl shadow-2xl border border-luxury-200 dark:border-luxury-800 overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-luxury-200 dark:border-luxury-800 flex justify-between items-center bg-luxury-50/50 dark:bg-luxury-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gold-500/10 text-gold-700 dark:text-gold-400">
                    <Send size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-luxury-900 dark:text-luxury-50">
                      {t('admin.contracts.newModalTitle')}
                    </h3>
                    <p className="text-xs text-luxury-500">
                      {t('admin.contracts.newModalDesc')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-luxury-400 hover:text-luxury-600 dark:hover:text-luxury-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleDispatchContract} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
                {/* Client Selection */}
                <div>
                  <label className="block text-xs font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                    {t('admin.contracts.targetClient')}
                  </label>
                  <select
                    value={targetClientId}
                    onChange={(e) => setTargetClientId(e.target.value)}
                    className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-3 py-2 text-sm text-luxury-900 dark:text-luxury-100 font-medium focus:outline-none focus:border-gold-600"
                  >
                    {Object.values(globalState.clients).map(c => (
                      <option key={c.profile.id} value={c.profile.id}>
                        {c.profile.name} — {c.profile.project} ({c.profile.tier})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preset Selector */}
                <div>
                  <label className="block text-xs font-bold text-luxury-700 dark:text-luxury-300 mb-1.5">
                    {isAr ? 'قوالب ونماذج العقود الجاهزة للاستوديو:' : 'Studio Contract Presets:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPreset(idx)}
                        className={`text-left p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          contractType === p.type
                            ? 'bg-gold-500/10 border-gold-600 dark:border-gold-400 text-gold-700 dark:text-gold-300 ring-1 ring-gold-500/30'
                            : 'bg-luxury-50 dark:bg-luxury-950 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:border-luxury-300'
                        }`}
                      >
                        <p className="line-clamp-1">{isAr ? p.typeAr : p.type}</p>
                        <p className="text-[10px] font-normal text-luxury-500 mt-0.5">{p.value} BHD</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contract Title */}
                <div>
                  <label className="block text-xs font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                    {t('admin.contracts.fieldTitle')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contractTitle}
                    onChange={(e) => setContractTitle(e.target.value)}
                    placeholder={t('admin.contracts.fieldTitlePlaceholder')}
                    className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-3 py-2 text-sm text-luxury-900 dark:text-luxury-100 focus:outline-none focus:border-gold-600"
                  />
                </div>

                {/* Value & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                      {t('admin.contracts.fieldType')}
                    </label>
                    <input
                      type="text"
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value)}
                      className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-3 py-2 text-sm text-luxury-900 dark:text-luxury-100 focus:outline-none focus:border-gold-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                      {t('admin.contracts.fieldValue')}
                    </label>
                    <input
                      type="number"
                      value={contractValue}
                      onChange={(e) => setContractValue(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 5000"
                      className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl px-3 py-2 text-sm text-luxury-900 dark:text-luxury-100 focus:outline-none focus:border-gold-600"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                    {t('admin.contracts.fieldDesc')}
                  </label>
                  <textarea
                    rows={2}
                    value={contractDesc}
                    onChange={(e) => setContractDesc(e.target.value)}
                    placeholder={t('admin.contracts.fieldDescPlaceholder')}
                    className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl p-3 text-xs text-luxury-900 dark:text-luxury-100 focus:outline-none focus:border-gold-600 leading-relaxed"
                  />
                </div>

                {/* Clauses */}
                <div>
                  <label className="block text-xs font-bold text-luxury-700 dark:text-luxury-300 mb-1">
                    {t('admin.contracts.fieldClauses')}
                  </label>
                  <textarea
                    rows={4}
                    value={contractClauses}
                    onChange={(e) => setContractClauses(e.target.value)}
                    placeholder={t('admin.contracts.fieldClausesPlaceholder')}
                    className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl p-3 text-xs text-luxury-900 dark:text-luxury-100 focus:outline-none focus:border-gold-600 leading-relaxed font-mono"
                  />
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-luxury-200 dark:border-luxury-800 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-gold-700 to-gold-600 text-white shadow-md rounded-xl hover:from-gold-800 hover:to-gold-700 transition-all cursor-pointer"
                  >
                    <Send size={14} />
                    <span>{t('admin.contracts.sendBtn')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTRACT PREVIEW MODAL */}
      <AnimatePresence>
        {previewContract && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-luxury-900 rounded-2xl shadow-2xl border border-luxury-200 dark:border-luxury-800 overflow-hidden"
            >
              <div className="p-6 border-b border-luxury-200 dark:border-luxury-800 flex justify-between items-center bg-luxury-50/50 dark:bg-luxury-950/50">
                <div>
                  <span className="text-[11px] font-mono text-gold-700 dark:text-gold-400 font-bold">
                    {previewContract.referenceNumber}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-luxury-900 dark:text-luxury-50">
                    {isAr && previewContract.titleAr ? previewContract.titleAr : previewContract.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewContract(null)}
                  className="p-1.5 rounded-lg text-luxury-400 hover:text-luxury-600 dark:hover:text-luxury-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar font-serif text-xs leading-relaxed text-luxury-700 dark:text-luxury-300">
                <p className="font-sans text-xs text-luxury-500">
                  {isAr && previewContract.descriptionAr ? previewContract.descriptionAr : previewContract.description}
                </p>

                <div className="space-y-2 border-t border-luxury-100 dark:border-luxury-800 pt-3">
                  <h4 className="font-sans font-bold text-luxury-900 dark:text-luxury-100 uppercase tracking-wider text-[11px]">
                    {isAr ? 'بنود الاتفاقية:' : 'Agreement Clauses:'}
                  </h4>
                  {(isAr && previewContract.clausesAr ? previewContract.clausesAr : previewContract.clauses || []).map((clause, idx) => (
                    <p key={idx} className="p-2.5 bg-luxury-50 dark:bg-luxury-950 rounded border border-luxury-200/50 dark:border-luxury-800/50">
                      {clause}
                    </p>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-luxury-200 dark:border-luxury-800 pt-4 font-sans">
                  <div className="p-3 bg-luxury-50 dark:bg-luxury-950 rounded-lg">
                    <span className="text-[10px] text-luxury-500 block mb-1">{t('contracts.certifiedBy')}</span>
                    {previewContract.isSignedByClient ? (
                      <div className="space-y-1.5">
                        <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 size={14} /> {previewContract.signeeName || activeClient.profile.name}
                        </span>
                        {previewContract.signatureDataUrl && (
                          <div className="h-12 w-32 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded p-1 flex items-center justify-center">
                            <img src={previewContract.signatureDataUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-amber-500 text-xs font-bold">{isAr ? 'لم يوقع بعد' : 'Not Signed Yet'}</span>
                    )}
                  </div>
                  <div className="p-3 bg-luxury-50 dark:bg-luxury-950 rounded-lg">
                    <span className="text-[10px] text-luxury-500 block mb-1">{t('contracts.sealedBy')}</span>
                    {previewContract.isSealedByArchitect ? (
                      <span className="text-red-600 font-bold text-xs flex items-center gap-1">
                        <Stamp size={14} /> {t('contracts.seal')}
                      </span>
                    ) : (
                      <span className="text-luxury-400 text-xs font-bold">{isAr ? 'غير مختوم' : 'Unsealed'}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-luxury-200 dark:border-luxury-800 bg-luxury-50/50 dark:bg-luxury-950/50 flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="py-1.5 px-3 text-xs flex items-center gap-1.5"
                >
                  <Printer size={14} /> {isAr ? 'طباعة' : 'Print'}
                </Button>
                <Button
                  onClick={() => setPreviewContract(null)}
                  className="py-1.5 px-4 text-xs"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AdminChat: React.FC = () => {
  const { t, globalState, setGlobalState, role } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<{name: string; size: string; url?: string; type?: string}[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAr = true; // Use global locale if available, defaulting to true for safety
  const quickReplies = [
    'مرحباً بك، كيف يمكنني مساعدتك اليوم؟',
    'تم استلام طلبك وجاري العمل عليه.',
    'يرجى مراجعة الملف المرفق.',
    'هل يمكنك توضيح المشكلة بشكل أكبر؟',
    'تم تحديث حالة تذكرتك بنجاح.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Mark messages as read when opening chat
    if (activeClient.hasUnreadMessages) {
      setGlobalState(prev => ({
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...prev.clients[prev.activeClientId],
            hasUnreadMessages: false
          }
        }
      }));
    }
  }, [(activeClient.chatHistory || [])]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newAttachments = Array.from(files).map(file => {
      let sizeStr = '';
      if (file.size < 1024) sizeStr = file.size + ' B';
      else if (file.size < 1024 * 1024) sizeStr = (file.size / 1024).toFixed(1) + ' KB';
      else sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      
      const isImage = file.type.startsWith('image/');
      let url = undefined;
      
      if (isImage) {
        url = URL.createObjectURL(file);
      }

      return {
        name: file.name,
        size: sizeStr,
        type: file.type,
        url: url
      };
    });

    setPendingAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = (overrideText?: string) => {
    const textToSend = overrideText !== undefined ? overrideText : input;
    if (!textToSend.trim() && pendingAttachments.length === 0) return;
    
    const sender = role === 'SUPPORT' ? 'SUPPORT' : 'ARCHITECT';

    const newMessage = {
      id: `msg${Date.now()}`,
      sender: sender as any,
      text: textToSend,
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          chatHistory: [...prev.clients[prev.activeClientId].chatHistory, newMessage]
        }
      }
    }));
    setInput('');
    setPendingAttachments([]);
    setShowQuickReplies(false);
  };

  const sendAction = (type: 'PAYMENT' | 'APPROVAL' | 'MEETING', title: string, amount?: number) => {
    const sender = role === 'SUPPORT' ? 'SUPPORT' : 'ARCHITECT';
    const newMessage = {
      id: `msg${Date.now()}`,
      sender: sender as any,
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionItem: { type, title, amount, completed: false }
    };

    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          chatHistory: [...prev.clients[prev.activeClientId].chatHistory, newMessage]
        }
      }
    }));
    setShowTools(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col pb-4 relative">
      <Card className="flex-1 flex flex-col p-0 overflow-hidden relative">
        <div className="p-4 border-b border-luxury-200 dark:border-luxury-800 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md flex items-center gap-4 transition-colors duration-500 z-10">
          <img src={activeClient.profile.avatar} alt="Client" className="w-12 h-12 rounded-full object-cover border border-gold-700 dark:border-gold-500 shadow-[0_0_10px_rgba(166,136,104,0.3)]" />
          <div>
            <h3 className="font-serif text-lg font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">{activeClient.profile.name}</h3>
            <p className="text-xs font-bold text-green-600 dark:text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span> VIP Client</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-luxury-50/50 dark:bg-luxury-950/30 transition-colors duration-500 relative" onClick={() => { setShowQuickReplies(false); setShowTools(false); }}>
          {(activeClient.chatHistory || []).map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'ARCHITECT' || msg.sender === 'SUPPORT' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-4 rounded-2xl shadow-md ${
                msg.sender === 'ARCHITECT' || msg.sender === 'SUPPORT'
                  ? 'bg-gradient-to-br from-gold-700 to-gold-600 dark:from-gold-500 dark:to-gold-600 text-white dark:text-luxury-950 rounded-tr-none font-medium' 
                  : 'bg-gradient-to-br from-white to-luxury-50 dark:from-luxury-800 dark:to-luxury-900 border border-luxury-200 dark:border-luxury-700 text-luxury-900 dark:text-luxury-200 rounded-tl-none font-medium'
              }`}>
                {msg.sender === 'SUPPORT' && (
                  <p className="text-[10px] uppercase opacity-70 mb-1 font-bold tracking-wider">Support Team</p>
                )}
                {msg.text && <p>{msg.text}</p>}

                {/* Interactive Action Item */}
                {msg.actionItem && (
                  <div className={`mt-2 p-4 rounded-xl border ${msg.sender === 'CLIENT' ? 'bg-luxury-100 dark:bg-luxury-900 border-luxury-200 dark:border-luxury-700 text-luxury-900 dark:text-luxury-100' : 'bg-white/20 border-white/30 text-white dark:text-luxury-950'} text-center shadow-inner`}>
                    <div className="flex justify-center mb-2">
                      {msg.actionItem.type === 'PAYMENT' && <DollarSign size={24} />}
                      {msg.actionItem.type === 'APPROVAL' && <CheckCircle2 size={24} />}
                      {msg.actionItem.type === 'MEETING' && <Calendar size={24} />}
                    </div>
                    <p className="font-bold text-sm mb-1">{msg.actionItem.title}</p>
                    {msg.actionItem.type === 'PAYMENT' && <p className="text-xl font-bold mb-3">{msg.actionItem.amount} BHD</p>}
                    
                    <div className={`w-full py-2 px-4 rounded-lg font-bold text-xs mt-3 ${msg.actionItem.completed ? 'bg-green-500 text-white' : 'bg-white/30'}`}>
                      {msg.actionItem.completed ? 'تم الإنجاز (Completed)' : 'بانتظار إجراء العميل (Pending)'}
                    </div>
                  </div>
                )}

                {/* Legacy single attachment support */}
                {msg.attachment && !msg.attachments && (
                  <div className="mt-3 bg-luxury-100/50 dark:bg-luxury-950/50 p-3 rounded-lg flex items-center gap-3 border border-luxury-200 dark:border-luxury-800 cursor-pointer hover:border-gold-700/50 dark:hover:border-gold-500/50 transition-colors shadow-inner">
                    <div className="w-10 h-10 bg-white dark:bg-luxury-800 rounded flex items-center justify-center text-gold-700 dark:text-gold-400"><Paperclip size={16} /></div>
                    <div className="text-sm">
                      <p className="font-bold text-luxury-900 dark:text-luxury-100">{msg.attachment.name}</p>
                      <p className="text-xs font-medium text-luxury-500">{msg.attachment.size}</p>
                    </div>
                  </div>
                )}

                {/* Modern multiple attachments support */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.attachments.map((att, i) => (
                      <div key={i}>
                        {att.url ? (
                          <div className="relative group rounded-lg overflow-hidden border border-luxury-200 dark:border-luxury-700 shadow-sm">
                            <img src={att.url} alt={att.name} className="w-full max-h-48 object-cover" />
                          </div>
                        ) : (
                          <div className="bg-luxury-100/50 dark:bg-luxury-950/50 p-3 rounded-lg flex items-center gap-3 border border-luxury-200 dark:border-luxury-800 cursor-pointer hover:border-gold-700/50 dark:hover:border-gold-500/50 transition-colors shadow-inner">
                            <div className="w-10 h-10 bg-white dark:bg-luxury-800 rounded flex items-center justify-center text-gold-700 dark:text-gold-400"><Paperclip size={16} /></div>
                            <div className="text-sm">
                              <p className="font-bold text-luxury-900 dark:text-luxury-100">{att.name}</p>
                              <p className="text-xs font-medium text-luxury-500">{att.size}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p className={`text-[10px] mt-2 text-right ${msg.sender === 'ARCHITECT' || msg.sender === 'SUPPORT' ? 'text-gold-100 dark:text-luxury-800' : 'text-luxury-400'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies Popup */}
        <AnimatePresence>
          {showQuickReplies && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 right-4 w-72 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-xl shadow-xl z-20 overflow-hidden"
            >
              <div className="p-3 border-b border-luxury-100 dark:border-luxury-800 bg-luxury-50 dark:bg-luxury-950 font-bold text-sm text-luxury-900 dark:text-luxury-100 flex items-center justify-between">
                <span>ردود سريعة (Quick Replies)</span>
                <Zap size={14} className="text-gold-600" />
              </div>
              <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                {quickReplies.map((reply, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(reply)}
                    className="w-full text-right text-sm p-2 hover:bg-gold-50 dark:hover:bg-luxury-800 rounded-lg text-luxury-700 dark:text-luxury-300 transition-colors line-clamp-2"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tools Popup */}
        <AnimatePresence>
          {showTools && role === 'SUPPORT' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 left-4 w-72 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-xl shadow-xl z-20 overflow-hidden"
            >
              <div className="p-3 border-b border-luxury-100 dark:border-luxury-800 bg-luxury-50 dark:bg-luxury-950 font-bold text-sm text-luxury-900 dark:text-luxury-100 flex items-center justify-between">
                <span>أدوات التفاعل (Tools)</span>
                <Wrench size={14} className="text-gold-600" />
              </div>
              <div className="p-2 space-y-2">
                <button 
                  onClick={() => sendAction('PAYMENT', 'طلب دفع رسوم (Payment Request)', 500)}
                  className="w-full flex items-center gap-3 p-3 bg-luxury-50 hover:bg-luxury-100 dark:bg-luxury-800 dark:hover:bg-luxury-700 rounded-lg text-luxury-900 dark:text-luxury-100 text-sm font-bold transition-colors"
                >
                  <div className="p-1.5 bg-green-500/20 text-green-600 dark:text-green-400 rounded-md"><DollarSign size={16}/></div>
                  إرسال طلب دفع
                </button>
                <button 
                  onClick={() => sendAction('APPROVAL', 'طلب اعتماد تصميم (Design Approval)')}
                  className="w-full flex items-center gap-3 p-3 bg-luxury-50 hover:bg-luxury-100 dark:bg-luxury-800 dark:hover:bg-luxury-700 rounded-lg text-luxury-900 dark:text-luxury-100 text-sm font-bold transition-colors"
                >
                  <div className="p-1.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-md"><CheckCircle2 size={16}/></div>
                  إرسال طلب اعتماد
                </button>
                <button 
                  onClick={() => sendAction('MEETING', 'جدولة اجتماع (Book Meeting)')}
                  className="w-full flex items-center gap-3 p-3 bg-luxury-50 hover:bg-luxury-100 dark:bg-luxury-800 dark:hover:bg-luxury-700 rounded-lg text-luxury-900 dark:text-luxury-100 text-sm font-bold transition-colors"
                >
                  <div className="p-1.5 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-md"><Calendar size={16}/></div>
                  طلب تحديد موعد
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md border-t border-luxury-200 dark:border-luxury-800 transition-colors duration-500">
          {pendingAttachments.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {pendingAttachments.map((att, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-luxury-100 dark:bg-luxury-800 px-3 py-1.5 rounded-full border border-luxury-200 dark:border-luxury-700 text-xs font-bold text-luxury-700 dark:text-luxury-300">
                  <Paperclip size={12} />
                  <span className="max-w-[120px] truncate">{att.name}</span>
                  <button onClick={() => removePendingAttachment(idx)} className="text-red-500 hover:text-red-700 bg-white dark:bg-luxury-900 rounded-full p-0.5 ml-1"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 bg-luxury-50 dark:bg-luxury-900 rounded-xl p-2 border border-luxury-200 dark:border-luxury-700 focus-within:border-gold-700 dark:focus-within:border-gold-500 transition-colors shadow-inner">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              onChange={handleFileChange}
            />
            {role === 'SUPPORT' && (
              <button 
                onClick={() => { setShowTools(!showTools); setShowQuickReplies(false); }} 
                className={`p-2 rounded-lg transition-colors ${showTools ? 'bg-gold-100 text-gold-700 dark:bg-luxury-800 dark:text-gold-400' : 'text-luxury-500 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 hover:bg-luxury-200 dark:hover:bg-luxury-800'}`}
              >
                <Wrench size={20} />
              </button>
            )}
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-luxury-500 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 transition-colors hover:bg-luxury-200 dark:hover:bg-luxury-800 rounded-lg">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat.placeholder')} 
              className="flex-1 bg-transparent border-none focus:outline-none font-medium text-luxury-900 dark:text-luxury-50 text-sm px-2" 
            />
            <button 
              onClick={() => { setShowQuickReplies(!showQuickReplies); setShowTools(false); }} 
              className={`p-2 transition-colors rounded-lg ${showQuickReplies ? 'bg-gold-100 text-gold-700 dark:bg-luxury-800 dark:text-gold-400' : 'text-luxury-500 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 hover:bg-luxury-200 dark:hover:bg-luxury-800'}`}
            >
              <Zap size={20} />
            </button>
            <button onClick={() => handleSend()} className="p-2 bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950 rounded-lg hover:from-gold-800 hover:to-gold-700 dark:hover:from-gold-500 dark:hover:to-gold-300 transition-all shadow-md"><Send size={18} /></button>
          </div>
        </div>
      </Card>
    </div>
  );
};


export const AdminTasks: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const [newTask, setNewTask] = useState('');

  const handleToggleTask = (id: string) => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          tasks: prev.clients[prev.activeClientId].tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }
      }
    }));
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: `tsk${Date.now()}`,
      title: newTask,
      dueDate: 'Pending',
      completed: false,
      priority: 'Medium' as const
    };
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          tasks: [task, ...prev.clients[prev.activeClientId].tasks]
        }
      }
    }));
    setNewTask('');
  };

  const handleDeleteTask = (id: string) => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          tasks: prev.clients[prev.activeClientId].tasks.filter(t => t.id !== id)
        }
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.tasks.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.tasks.desc')}</p>
        </div>
      </div>

      <Card>
        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder={t('admin.tasks.placeholder')} 
            className="flex-1 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500 shadow-inner transition-colors" 
          />
          <Button onClick={handleAddTask}><Plus size={18}/> {t('admin.tasks.add')}</Button>
        </div>

        <div className="space-y-3">
          {activeClient.tasks.map(task => (
            <div key={task.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${task.completed ? 'bg-luxury-50/50 dark:bg-luxury-950/50 border-luxury-200 dark:border-luxury-800 opacity-60' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-700 shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <button onClick={() => handleToggleTask(task.id)} className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${task.completed ? 'bg-gold-700 dark:bg-gold-500 border-gold-700 dark:border-gold-500 text-white' : 'border-luxury-300 dark:border-luxury-600 hover:border-gold-700 dark:hover:border-gold-500'}`}>
                  {task.completed && <Check size={14} />}
                </button>
                <div>
                  <p className={`font-bold ${task.completed ? 'line-through text-luxury-500' : 'text-luxury-900 dark:text-luxury-200'}`}>{task.title}</p>
                  <p className="text-xs font-medium text-luxury-500">Due: {task.dueDate} • Priority: <span className={task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-gold-700 dark:text-gold-500' : 'text-green-500'}>{task.priority}</span></p>
                </div>
              </div>
              <button onClick={() => handleDeleteTask(task.id)} className="text-luxury-400 hover:text-red-500 transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const AdminProfile: React.FC = () => {
  const { theme, setTheme, lang, setLang, t, globalState, setGlobalState, role } = useAppContext();
  const isRTL = lang === 'ar';
  const isDark = theme === 'dark';
  const { architectProfile } = globalState;
  const isSupport = role === 'SUPPORT';
  const profileName = isSupport ? (lang === 'ar' ? 'فريق الدعم الفني' : 'Support Team') : architectProfile.name;
  const profileAvatar = isSupport ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200' : architectProfile.avatar;
  const profileTitle = isSupport ? (lang === 'ar' ? 'قسم الدعم' : 'Technical Support') : architectProfile.title;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(architectProfile.name);
  const [editAvatar, setEditAvatar] = useState(architectProfile.avatar);

  const handleSaveProfile = () => {
    setGlobalState(prev => ({
      ...prev,
      architectProfile: {
        ...prev.architectProfile,
        name: editName,
        avatar: editAvatar
      }
    }));
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <Card className="flex flex-col md:flex-row items-center gap-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative group cursor-pointer" 
          onClick={() => !isSupport && setIsEditing(true)}
        >
          <img src={profileAvatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-luxury-200 dark:border-luxury-800 group-hover:border-gold-700 dark:group-hover:border-gold-500 transition-colors shadow-xl" />
          {!isSupport && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm text-white font-bold flex items-center gap-1"><Edit2 size={14}/> {t('profile.changePhoto')}</span>
            </div>
          )}
        </motion.div>
        <div className="flex-1 text-center md:text-left w-full">
          {isEditing && !isSupport ? (
            <div className="space-y-4">
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
              />
              <input 
                type="text" 
                value={editAvatar} 
                onChange={(e) => setEditAvatar(e.target.value)}
                placeholder="Avatar URL"
                className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 font-medium text-sm text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
              />
              <div className="flex gap-2 justify-center md:justify-start">
                <Button onClick={handleSaveProfile} className="py-2 px-4 text-sm"><Check size={16}/> Save</Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)} className="py-2 px-4 text-sm">Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h2 className="font-serif text-3xl font-bold text-luxury-900 dark:text-luxury-50">{architectProfile.name}</h2>
                <button onClick={() => setIsEditing(true)} className="text-luxury-400 hover:text-gold-700 dark:hover:text-gold-500 transition-colors"><Edit2 size={16}/></button>
              </div>
              <p className="bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-300 dark:to-gold-600 text-transparent bg-clip-text font-bold text-lg mb-4">{architectProfile.title}</p>
            </>
          )}
        </div>
      </Card>

      <Card delay={0.1}>
        <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-6 flex items-center gap-2"><Settings size={24} className="text-gold-700 dark:text-gold-500"/> {t('profile.preferences')}</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500">
            <div className="flex items-center gap-4">
              <Globe className="text-luxury-600 dark:text-luxury-400" />
              <div>
                <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{t('profile.language')}</p>
                <p className="text-sm font-bold text-luxury-500">{t('profile.languageDesc')}</p>
              </div>
            </div>
            <button 
              onClick={() => setLang(isRTL ? 'en' : 'ar')}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isRTL ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400' : 'bg-luxury-300 dark:bg-luxury-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-luxury-50 transition-transform ${isRTL ? (isRTL ? '-translate-x-6' : 'translate-x-6') : (isRTL ? '-translate-x-1' : 'translate-x-1')}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500">
            <div className="flex items-center gap-4">
              <Moon className="text-luxury-600 dark:text-luxury-400" />
              <div>
                <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{t('profile.theme')}</p>
                <p className="text-sm font-bold text-luxury-500">{t('profile.themeDesc')}</p>
              </div>
            </div>
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isDark ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400' : 'bg-luxury-300 dark:bg-luxury-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-luxury-50 transition-transform ${isDark ? (isRTL ? '-translate-x-6' : 'translate-x-6') : (isRTL ? '-translate-x-1' : 'translate-x-1')}`} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
