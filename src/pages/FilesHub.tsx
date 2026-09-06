import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { Download, Folder, File, ChevronDown, ChevronRight, X } from 'lucide-react';
import { ClientFolder, ClientFile } from '../types';

export const FilesHub: React.FC = () => {
  const { globalState, role, t } = useAppContext();
  const isAr = document.documentElement.dir === 'rtl';
  
  const activeClient = globalState.clients[globalState.activeClientId];
  const folders = activeClient?.folders || [];
  
  const [expandedFolders, setExpandedFolders] = useState<string[]>(folders.map(f => f.id));
  const [selectedFile, setSelectedFile] = useState<ClientFile | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleDownload = (e: React.MouseEvent, file: ClientFile) => {
    e.stopPropagation();
    // Simulate download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!folders || folders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">
            {isAr ? 'ملفاتي' : 'My Files'}
          </h2>
        </div>
        <Card className="text-center py-20 flex flex-col items-center">
          <div className="w-16 h-16 bg-luxury-100 dark:bg-luxury-900 rounded-full flex items-center justify-center text-luxury-400 mb-4">
            <Folder size={32} />
          </div>
          <h3 className="text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">
            {isAr ? 'لا توجد ملفات حالياً' : 'No files currently'}
          </h3>
          <p className="text-luxury-600 dark:text-luxury-400 max-w-md mx-auto">
            {isAr 
              ? 'سيتم إضافة ملفات مشروعك والمخططات هنا من قبل المهندسة.' 
              : 'Your project files and plans will be added here by the architect.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">
          {isAr ? 'ملفاتي' : 'My Files'}
        </h2>
      </div>

      <div className="space-y-6">
        {folders.map(folder => {
          const isExpanded = expandedFolders.includes(folder.id);
          return (
            <Card key={folder.id} className="overflow-hidden p-0">
              <button 
                onClick={() => toggleFolder(folder.id)}
                className="w-full flex items-center justify-between p-6 bg-luxury-50 dark:bg-luxury-900/50 hover:bg-luxury-100 dark:hover:bg-luxury-900 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-luxury-950 rounded-xl flex items-center justify-center shadow-sm text-gold-600 dark:text-gold-400">
                    <Folder size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-luxury-900 dark:text-luxury-100">{folder.name}</h3>
                    {folder.description && (
                      <p className="text-sm text-luxury-600 dark:text-luxury-400 mt-0.5">{folder.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-luxury-500">
                    {folder.files.length} {isAr ? 'ملفات' : 'files'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-luxury-950 flex items-center justify-center shadow-sm">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} className={isAr ? "rotate-180" : ""} />}
                  </div>
                </div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-luxury-100 dark:border-luxury-800"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {folder.files.map(file => (
                        <div 
                          key={file.id} 
                          onClick={() => setSelectedFile(file)}
                          className="group flex items-center justify-between p-4 bg-white dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl hover:border-gold-500 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 bg-luxury-50 dark:bg-luxury-900 rounded-lg flex items-center justify-center text-luxury-500 shrink-0">
                              <File size={20} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-luxury-900 dark:text-luxury-100 truncate">{file.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-luxury-500">{file.size}</span>
                                <span className="w-1 h-1 bg-luxury-300 dark:bg-luxury-700 rounded-full"></span>
                                <span className="text-xs text-luxury-500">{new Date(file.date).toLocaleDateString(isAr ? 'ar-BH' : 'en-US')}</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => handleDownload(e, file)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-luxury-400 hover:text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                            title={isAr ? 'تحميل' : 'Download'}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      ))}
                      
                      {folder.files.length === 0 && (
                        <div className="col-span-full py-8 text-center text-luxury-500 text-sm">
                          {isAr ? 'المجلد فارغ' : 'Folder is empty'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-luxury-950 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-luxury-100 dark:border-luxury-800 flex justify-between items-center bg-luxury-50 dark:bg-luxury-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-luxury-950 rounded-lg flex items-center justify-center shadow-sm text-luxury-500">
                    <File size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-900 dark:text-luxury-100">{selectedFile.name}</h3>
                    <p className="text-xs text-luxury-500">{selectedFile.size} • {new Date(selectedFile.date).toLocaleDateString(isAr ? 'ar-BH' : 'en-US')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="primary" onClick={(e) => handleDownload(e, selectedFile)} className="py-2 px-4 text-sm">
                    <Download size={16} className={isAr ? "ml-2" : "mr-2"} />
                    {isAr ? 'تحميل' : 'Download'}
                  </Button>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-luxury-500 hover:bg-luxury-200 dark:hover:bg-luxury-800 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6 bg-luxury-100/50 dark:bg-luxury-900/20 flex flex-col items-center justify-center min-h-[400px]">
                {selectedFile.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                  <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm border border-luxury-200 dark:border-luxury-800" />
                ) : (
                  <div className="text-center p-8 bg-white dark:bg-luxury-950 rounded-2xl shadow-sm border border-luxury-200 dark:border-luxury-800 max-w-md w-full">
                    <div className="w-24 h-24 bg-luxury-50 dark:bg-luxury-900 rounded-full flex items-center justify-center text-luxury-300 dark:text-luxury-700 mx-auto mb-6">
                      <File size={48} />
                    </div>
                    <h4 className="font-bold text-lg text-luxury-900 dark:text-luxury-100 mb-2">{isAr ? 'لا توجد معاينة متاحة' : 'No Preview Available'}</h4>
                    <p className="text-sm text-luxury-600 dark:text-luxury-400 mb-6">
                      {isAr ? 'هذا النوع من الملفات لا يدعم المعاينة المباشرة.' : 'This file type does not support direct preview.'}
                    </p>
                    <Button variant="outline" onClick={(e) => handleDownload(e, selectedFile)} className="w-full">
                      <Download size={18} className={isAr ? "ml-2" : "mr-2"} />
                      {isAr ? 'تحميل الملف' : 'Download File'}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
