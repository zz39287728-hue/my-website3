const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

const oldLightbox = `{selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <img src={selectedImage} alt="Preview" className="max-h-[80vh] w-auto max-w-full rounded-xl shadow-2xl object-contain" />
            <a 
              href={selectedImage} 
              download="attachment"
              className="mt-6 flex items-center gap-2 bg-white/10 text-white px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors shadow-lg backdrop-blur-md"
            >
              <Download size={18} />
              <span className="font-bold text-sm">{isAr ? 'تحميل الصورة' : 'Download Image'}</span>
            </a>
          </div>
        </div>
      )}`;

const newLightbox = `<AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full flex flex-col items-center cursor-default"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                <X size={24} />
              </button>
              <img src={selectedImage} alt="Preview" className="max-h-[80vh] w-auto max-w-full rounded-xl shadow-2xl object-contain" />
              <a 
                href={selectedImage} 
                download="attachment"
                onClick={(e) => e.stopPropagation()}
                className="mt-6 flex items-center gap-2 bg-white/10 text-white px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors shadow-lg backdrop-blur-md"
              >
                <Download size={18} />
                <span className="font-bold text-sm">{isAr ? 'تحميل الصورة' : 'Download Image'}</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>`;

if (!code.includes(oldLightbox)) {
  console.log("Could not find the old lightbox block.");
} else {
  code = code.replace(oldLightbox, newLightbox);
  fs.writeFileSync('src/pages/Communication.tsx', code);
  console.log("Lightbox replaced successfully!");
}
