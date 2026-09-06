import fs from 'fs';

const path = 'src/pages/AdminStore.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add originalPrice to Packages
content = content.replace(
  '<div>\n                    <label className="text-xs text-luxury-500 mb-1 block">Price (Number)</label>\n                    <input \n                      type="number"\n                      className="w-full p-2 border border-luxury-200 dark:border-luxury-800 rounded bg-transparent" \n                      value={editForm.priceNumber} onChange={e => setEditForm({...editForm, priceNumber: e.target.value})} \n                    />\n                  </div>',
  '<div>\n                    <label className="text-xs text-luxury-500 mb-1 block">Price (Number)</label>\n                    <input \n                      type="number"\n                      className="w-full p-2 border border-luxury-200 dark:border-luxury-800 rounded bg-transparent" \n                      value={editForm.priceNumber} onChange={e => setEditForm({...editForm, priceNumber: e.target.value})} \n                    />\n                  </div>\n                  <div>\n                    <label className="text-xs text-luxury-500 mb-1 block">Original Price (Number)</label>\n                    <input \n                      type="number"\n                      className="w-full p-2 border border-luxury-200 dark:border-luxury-800 rounded bg-transparent" \n                      value={editForm.originalPrice || ""} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} \n                    />\n                  </div>'
);

// Add originalPrice to Consultations
content = content.replace(
  '<div>\n                    <label className="text-xs text-luxury-500 mb-1 block">Duration</label>\n                    <input \n                      className="w-full p-2 border border-luxury-200 dark:border-luxury-800 rounded bg-transparent" \n                      value={editForm.duration} onChange={e => setEditForm({...editForm, duration: e.target.value})} \n                    />\n                  </div>',
  '<div>\n                    <label className="text-xs text-luxury-500 mb-1 block">Duration</label>\n                    <input \n                      className="w-full p-2 border border-luxury-200 dark:border-luxury-800 rounded bg-transparent" \n                      value={editForm.duration} onChange={e => setEditForm({...editForm, duration: e.target.value})} \n                    />\n                  </div>\n                  <div>\n                    <label className="text-xs text-luxury-500 mb-1 block">Original Price</label>\n                    <input \n                      type="number"\n                      className="w-full p-2 border border-luxury-200 dark:border-luxury-800 rounded bg-transparent" \n                      value={editForm.originalPrice || ""} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} \n                    />\n                  </div>'
);

// Show originalPrice in non-edit mode for Packages
content = content.replace(
  '<span className="font-bold text-gold-600">{item.price}</span>',
  '<span className="font-bold text-gold-600">{item.price}</span>\n                    {item.originalPrice && <span className="line-through text-luxury-400 text-sm">{item.originalPrice} BHD</span>}'
);

// Show originalPrice in non-edit mode for Consultations
content = content.replace(
  '<span className="font-bold text-gold-600">{item.price} BHD</span>',
  '<span className="font-bold text-gold-600">{item.price} BHD</span>\n                    {item.originalPrice && <span className="line-through text-luxury-400 text-sm">{item.originalPrice} BHD</span>}'
);

fs.writeFileSync(path, content);
