import React, { useState } from 'react';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { Store, Package, Calendar, Edit2, Check, X, Plus, Trash2 } from 'lucide-react';
import { StoreCollectionItem, StorePackageItem, StoreConsultationItem } from '../types';

export const SupportStore: React.FC = () => {
  const { globalState, setGlobalState, lang } = useAppContext();
  const isAr = lang === 'ar';
  
  const [activeTab, setActiveTab] = useState<'collections' | 'packages' | 'consultations'>('collections');

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'SUPPORT_STORE') {
        setActiveTab('collections');
        setEditingId(null);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Temporary edit state
  const [editForm, setEditForm] = useState<any>(null);

  const startEditing = (item: any, type: string) => {
    setEditingId(item.id);
    setEditForm({ ...item, type });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  
  const addNewItem = () => {
    if (activeTab === 'collections') {
      const newItem = {
        id: 'c_' + Date.now(),
        title: 'New Collection',
        category: 'أثاث مفرد',
        price: 0,
        image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000',
        description: 'Description here...',
        isNew: true
      };
      setGlobalState(prev => ({
        ...prev,
        storeData: {
          ...prev.storeData,
          collections: [...prev.storeData.collections, newItem]
        }
      }));
      startEditing(newItem, 'collection');
    } else if (activeTab === 'packages') {
      const newItem = {
        id: 'p_' + Date.now(),
        name: 'New Package',
        nameAr: 'باقة جديدة',
        price: '0 BHD',
        priceNumber: 0,
        tier: 'essential' as const,
        features: ['Feature 1']
      };
      setGlobalState(prev => ({
        ...prev,
        storeData: {
          ...prev.storeData,
          packages: [...prev.storeData.packages, newItem]
        }
      }));
      startEditing(newItem, 'package');
    } else if (activeTab === 'consultations') {
      const newItem = {
        id: 'cons_' + Date.now(),
        title: 'New Consultation',
        price: 0,
        duration: '1 Hour',
        type: 'Virtual' as const
      };
      setGlobalState(prev => ({
        ...prev,
        storeData: {
          ...prev.storeData,
          consultations: [...prev.storeData.consultations, newItem]
        }
      }));
      startEditing(newItem, 'consultation');
    }
  };

  const deleteItem = (id: string, type: 'collections' | 'packages' | 'consultations') => {
    setGlobalState(prev => {
      const newData = { ...prev.storeData };
      if (type === 'collections') {
        newData.collections = newData.collections.filter(c => c.id !== id);
      } else if (type === 'packages') {
        newData.packages = newData.packages.filter(p => p.id !== id);
      } else if (type === 'consultations') {
        newData.consultations = newData.consultations.filter(c => c.id !== id);
      }
      return { ...prev, storeData: newData };
    });
  };

  const saveEditing = () => {
    if (!editForm) return;

    setGlobalState(prev => {
      const type = editForm.type;
      const cleanForm = { ...editForm };
      delete cleanForm.type;

      // Handle conversions
      if (cleanForm.price) cleanForm.price = parseFloat(cleanForm.price) || cleanForm.price;
      if (cleanForm.priceNumber) cleanForm.priceNumber = parseFloat(cleanForm.priceNumber);
      if (cleanForm.originalPrice) cleanForm.originalPrice = parseFloat(cleanForm.originalPrice);

      const newData = { ...prev.storeData };
      if (type === 'collection') {
        newData.collections = newData.collections.map(c => c.id === cleanForm.id ? cleanForm as StoreCollectionItem : c);
      } else if (type === 'package') {
        newData.packages = newData.packages.map(p => p.id === cleanForm.id ? cleanForm as StorePackageItem : p);
      } else if (type === 'consultation') {
        newData.consultations = newData.consultations.map(c => c.id === cleanForm.id ? cleanForm as StoreConsultationItem : c);
      }

      return {
        ...prev,
        storeData: newData
      };
    });

    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-luxury-900 dark:text-luxury-50 mb-2 flex items-center gap-3">
          <Store className="text-gold-600" size={32} />
          {isAr ? 'إدارة المتجر الشامل' : 'Global Store Management'}
        </h1>
        <p className="text-luxury-600 dark:text-luxury-400">
          {isAr ? 'تعديل الكولكشنات الحصرية، الباقات، والاستشارات لجميع العملاء في الموقع.' : 'Manage exclusive collections, packages, and consultations globally across the platform.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('collections')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'collections' ? 'bg-gold-600 text-white shadow-lg' : 'bg-white dark:bg-luxury-900 text-luxury-600 dark:text-luxury-400 border border-luxury-200 dark:border-luxury-800'}`}
        >
          <Store size={18} />
          {isAr ? 'الكولكشنات' : 'Collections'}
        </button>
        <button 
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'packages' ? 'bg-gold-600 text-white shadow-lg' : 'bg-white dark:bg-luxury-900 text-luxury-600 dark:text-luxury-400 border border-luxury-200 dark:border-luxury-800'}`}
        >
          <Package size={18} />
          {isAr ? 'الباقات' : 'Packages'}
        </button>
        <button 
          onClick={() => setActiveTab('consultations')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'consultations' ? 'bg-gold-600 text-white shadow-lg' : 'bg-white dark:bg-luxury-900 text-luxury-600 dark:text-luxury-400 border border-luxury-200 dark:border-luxury-800'}`}
        >
          <Calendar size={18} />
          {isAr ? 'الاستشارات' : 'Consultations'}
        </button>
      </div>

      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-luxury-900 dark:text-luxury-50">
          {activeTab === 'collections' ? (isAr ? 'الكولكشنات' : 'Collections') : 
           activeTab === 'packages' ? (isAr ? 'الباقات' : 'Packages') : 
           (isAr ? 'الاستشارات' : 'Consultations')}
        </h2>
        <Button onClick={addNewItem} className="flex items-center gap-2">
          <Plus size={18} />
          {isAr ? 'إضافة جديد' : 'Add New'}
        </Button>
      </div>

      {activeTab === 'collections' && (
        <div className="space-y-4">
          {globalState.storeData?.collections.map(item => (
            <Card key={item.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-lg transition-all border-luxury-200 dark:border-luxury-800/60">
              <img src={item.image} alt={item.title} className="w-24 h-24 rounded-xl object-cover border border-luxury-200 dark:border-luxury-800 shadow-sm" />
              
              {editingId === item.id ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "العنوان" : "Title"}</label>
                    <input 
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر" : "Price"}</label>
                    <input 
                      type="number"
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر الأصلي (قبل الخصم)" : "Original Price (Before Discount)"}</label>
                    <input 
                      type="number"
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.originalPrice || ''} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "التصنيف" : "Category"}</label>
                    <input 
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 w-full">
                  <h3 className="font-bold text-lg text-luxury-900 dark:text-luxury-50">{item.title}</h3>
                  <p className="text-sm text-luxury-500 mb-2">{item.category}</p>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gold-600">{item.price} BHD</span>
                    {item.originalPrice && <span className="line-through text-luxury-400 text-sm">{item.originalPrice} BHD</span>}
                    {item.originalPrice && item.price && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">
                        {Math.round(((item.originalPrice - (typeof item.price === "number" ? item.price : parseFloat(item.price as string))) / item.originalPrice) * 100)}% OFF
                      </span>
                    )}
                    {item.originalPrice && <span className="line-through text-luxury-400 text-sm">{item.originalPrice} BHD</span>}
                  </div>
                </div>
              )}

              <div className="flex gap-2 shrink-0">
                {editingId === item.id ? (
                  <>
                    <button onClick={saveEditing} className="p-2 bg-green-500 text-white rounded hover:bg-green-600"><Check size={18} /></button>
                    <button onClick={cancelEditing} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><X size={18} /></button>
                  </>
                ) : (<>
                  <button onClick={() => startEditing(item, 'collection')} className="p-2 bg-luxury-100 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300 rounded hover:bg-gold-500 hover:text-white transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteItem(item.id, 'collections')} className="p-2 bg-luxury-100 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300 rounded hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={18} />
                  </button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="space-y-4">
          {globalState.storeData?.packages.map(item => (
            <Card key={item.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-lg transition-all border-luxury-200 dark:border-luxury-800/60">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-xl flex items-center justify-center text-gold-600 border border-gold-500/20 shadow-inner"><Package size={32} /></div>
              
              {editingId === item.id ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "الاسم" : "Name"}</label>
                    <input 
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "الاسم (بالعربي)" : "Name (Ar)"}</label>
                    <input 
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.nameAr} onChange={e => setEditForm({...editForm, nameAr: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر (نص)" : "Price (Text)"}</label>
                    <input 
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر (رقم)" : "Price (Number)"}</label>
                    <input 
                      type="number"
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.priceNumber} onChange={e => setEditForm({...editForm, priceNumber: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر الأصلي (رقم)" : "Original Price (Number)"}</label>
                    <input 
                      type="number"
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.originalPrice || ""} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 w-full">
                  <h3 className="font-bold text-lg text-luxury-900 dark:text-luxury-50">{isAr ? item.nameAr : item.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gold-600">{item.price}</span>
                    {item.originalPrice && <span className="line-through text-luxury-400 text-sm">{item.originalPrice} BHD</span>}
                  </div>
                </div>
              )}

              <div className="flex gap-2 shrink-0">
                {editingId === item.id ? (
                  <>
                    <button onClick={saveEditing} className="p-2 bg-green-500 text-white rounded hover:bg-green-600"><Check size={18} /></button>
                    <button onClick={cancelEditing} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><X size={18} /></button>
                  </>
                ) : (<>
                  <button onClick={() => startEditing(item, 'package')} className="p-2 bg-luxury-100 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300 rounded hover:bg-gold-500 hover:text-white transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteItem(item.id, 'packages')} className="p-2 bg-luxury-100 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300 rounded hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={18} />
                  </button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'consultations' && (
        <div className="space-y-4">
          {globalState.storeData?.consultations.map(item => (
            <Card key={item.id} className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-lg transition-all border-luxury-200 dark:border-luxury-800/60">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-xl flex items-center justify-center text-gold-600 border border-gold-500/20 shadow-inner"><Calendar size={32} /></div>
              
              {editingId === item.id ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "العنوان" : "Title"}</label>
                    <input 
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر" : "Price"}</label>
                    <input 
                      type="number"
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "المدة" : "Duration"}</label>
                    <input 
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.duration} onChange={e => setEditForm({...editForm, duration: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-luxury-600 dark:text-luxury-400 mb-1 block">{isAr ? "السعر الأصلي" : "Original Price"}</label>
                    <input 
                      type="number"
                      className="w-full p-2.5 border border-luxury-300 dark:border-luxury-700 rounded-lg bg-white dark:bg-luxury-900 focus:ring-2 focus:ring-gold-500 outline-none transition-all" 
                      value={editForm.originalPrice || ""} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 w-full">
                  <h3 className="font-bold text-lg text-luxury-900 dark:text-luxury-50">{item.title}</h3>
                  <p className="text-sm text-luxury-500 mb-2">{item.duration} - {item.type}</p>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gold-600">{item.price} BHD</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 shrink-0">
                {editingId === item.id ? (
                  <>
                    <button onClick={saveEditing} className="p-2 bg-green-500 text-white rounded hover:bg-green-600"><Check size={18} /></button>
                    <button onClick={cancelEditing} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><X size={18} /></button>
                  </>
                ) : (<>
                  <button onClick={() => startEditing(item, 'consultation')} className="p-2 bg-luxury-100 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300 rounded hover:bg-gold-500 hover:text-white transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteItem(item.id, 'consultations')} className="p-2 bg-luxury-100 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300 rounded hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={18} />
                  </button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};
