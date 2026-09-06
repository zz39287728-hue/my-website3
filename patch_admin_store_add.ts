import fs from 'fs';

const path = 'src/pages/AdminStore.tsx';
let content = fs.readFileSync(path, 'utf8');

const addFunctions = `
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
`;

content = content.replace('const saveEditing = () => {', addFunctions + '\n  const saveEditing = () => {');

const addButtonUI = `
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
`;

content = content.replace('{activeTab === \'collections\' && (', addButtonUI + '\n      {activeTab === \'collections\' && (');

// Add delete button
content = content.replace(
  /<button onClick=\{\(\) => startEditing\(item, 'collection'\)\}[\s\S]*?<\/button>/,
  `$&
                  <button onClick={() => deleteItem(item.id, 'collections')} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={18} />
                  </button>`
);

content = content.replace(
  /<button onClick=\{\(\) => startEditing\(item, 'package'\)\}[\s\S]*?<\/button>/,
  `$&
                  <button onClick={() => deleteItem(item.id, 'packages')} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={18} />
                  </button>`
);

content = content.replace(
  /<button onClick=\{\(\) => startEditing\(item, 'consultation'\)\}[\s\S]*?<\/button>/,
  `$&
                  <button onClick={() => deleteItem(item.id, 'consultations')} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={18} />
                  </button>`
);

fs.writeFileSync(path, content);
