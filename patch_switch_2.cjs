const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

// For Support
code = code.replace(
  '<p className="text-[11px] text-luxury-400">{isAr ? \'التبديل إلى لوحة الدعم\' : \'Switch to Support\'}</p>\n            </div>\n          </button>',
  '<p className="text-[11px] text-luxury-400">{isAr ? \'التبديل إلى لوحة الدعم\' : \'Switch to Support\'}</p>\n            </div>\n            {chatHistory.filter(m => m.sender === \'SUPPORT\' && m.status !== \'READ\').length > 0 && (\n              <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-500 text-neutral-900 text-[10px] font-bold shadow-sm">\n                {chatHistory.filter(m => m.sender === \'SUPPORT\' && m.status !== \'READ\').length}\n              </span>\n            )}\n          </button>'
);

// For Architect
code = code.replace(
  '<p className="text-[11px] text-luxury-400">{isAr ? \'التبديل إلى لوحة المهندس\' : \'Switch to Architect\'}</p>\n            </div>\n          </button>',
  '<p className="text-[11px] text-luxury-400">{isAr ? \'التبديل إلى لوحة المهندس\' : \'Switch to Architect\'}</p>\n            </div>\n            {chatHistory.filter(m => m.sender === \'ARCHITECT\' && m.status !== \'READ\').length > 0 && (\n              <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-500 text-neutral-900 text-[10px] font-bold shadow-sm">\n                {chatHistory.filter(m => m.sender === \'ARCHITECT\' && m.status !== \'READ\').length}\n              </span>\n            )}\n          </button>'
);

fs.writeFileSync('src/pages/Communication.tsx', code);
console.log("Switch badges added");
