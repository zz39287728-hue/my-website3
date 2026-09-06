const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

const oldDropdown = `<div className="p-4 border-b border-luxury-200 dark:border-luxury-800 bg-luxury-50 dark:bg-luxury-900/50">
                      <div className="flex items-center gap-4">
                        <div 
                          className="relative group cursor-pointer flex-shrink-0" 
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          <img 
                            src={role === 'ARCHITECT' ? globalState.architectProfile.avatar : role === 'SUPPORT' ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200' : activeClient.profile.avatar} 
                            alt="Profile" 
                            className="w-14 h-14 rounded-full object-cover border-2 border-gold-500/30"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                            <Upload size={16} className="text-white" />
                          </div>
                          <input 
                            type="file" 
                            ref={avatarInputRef} 
                            onChange={handleAvatarChange} 
                            className="hidden" 
                            accept="image/*"
                          />
                        </div>
                        <div className="flex-1">
                          {role === 'SUPPORT' ? (
                            <p className="font-bold text-luxury-900 dark:text-luxury-50 text-base">
                              {lang === 'ar' ? 'فريق الدعم الفني' : 'Support Team'}
                            </p>
                          ) : (
                            <div className="relative flex items-center">
                              <input 
                                value={role === 'ARCHITECT' ? globalState.architectProfile.name : activeClient.profile.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full bg-transparent border-b border-transparent focus:border-gold-500 hover:border-luxury-300 dark:hover:border-luxury-700 outline-none font-bold text-luxury-900 dark:text-luxury-50 text-base pb-1 transition-colors pr-6"
                                placeholder={isRTL ? "الاسم" : "Name"}
                              />
                              <Edit2 size={12} className="absolute right-0 text-luxury-400 pointer-events-none" />
                            </div>
                          )}
                          <p className="text-sm font-bold text-luxury-500 dark:text-luxury-400 mt-1">
                            {role === 'ARCHITECT' ? globalState.architectProfile.title : role === 'SUPPORT' ? 'Support' : activeClient.profile.tier}
                          </p>
                        </div>
                      </div>
                    </div>`;

const newDropdown = `<div className="p-4 bg-white dark:bg-luxury-950">
                      <div className="flex items-center gap-4">
                        <div 
                          className="relative group cursor-pointer flex-shrink-0" 
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          <img 
                            src={role === 'ARCHITECT' ? globalState.architectProfile.avatar : role === 'SUPPORT' ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200' : activeClient.profile.avatar} 
                            alt="Profile" 
                            className="w-14 h-14 rounded-full object-cover border-2 border-gold-500/30"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                            <Upload size={16} className="text-white" />
                          </div>
                          <input 
                            type="file" 
                            ref={avatarInputRef} 
                            onChange={handleAvatarChange} 
                            className="hidden" 
                            accept="image/*"
                          />
                        </div>
                        <div className="flex-1 flex flex-col items-start justify-center">
                          {role === 'SUPPORT' ? (
                            <p className="font-bold text-luxury-900 dark:text-luxury-50 text-base">
                              {lang === 'ar' ? 'فريق الدعم الفني' : 'Support Team'}
                            </p>
                          ) : (
                            <div className="relative flex items-center w-full">
                              <input 
                                value={role === 'ARCHITECT' ? globalState.architectProfile.name : activeClient.profile.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full bg-transparent border-b border-transparent focus:border-gold-500 hover:border-luxury-300 dark:hover:border-luxury-700 outline-none font-bold text-luxury-900 dark:text-luxury-50 text-base pb-1 transition-colors pr-6"
                                placeholder={isRTL ? "الاسم" : "Name"}
                              />
                              <Edit2 size={12} className="absolute right-0 text-luxury-400 pointer-events-none" />
                            </div>
                          )}
                          <p className="text-sm font-bold text-luxury-500 dark:text-luxury-400 mt-1 text-left rtl:text-right w-full">
                            {role === 'ARCHITECT' ? globalState.architectProfile.title : role === 'SUPPORT' ? 'Support' : activeClient.profile.tier}
                          </p>
                        </div>
                      </div>
                    </div>`;

// Replace the old dropdown with the new one
code = code.replace(oldDropdown, newDropdown);

// Remove the rest of the dropdown options (language, theme, logout)
const dropdownOptionsRegex = /<div className="p-2 flex flex-col gap-1">[\s\S]*?<div className="p-2 border-t border-luxury-200 dark:border-luxury-800">[\s\S]*?<\/div>/;
code = code.replace(dropdownOptionsRegex, "");

fs.writeFileSync('src/components/Layout.tsx', code);
