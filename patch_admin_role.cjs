const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

// I replaced "sender: 'ARCHITECT' as const," with "sender: role as any," earlier. Let's see if we can find it.
// Oh wait, there are multiple "sender: 'ARCHITECT' as const," maybe? Yes, I did a global replace, or maybe only one.
// Let's use `sender: 'ARCHITECT' as any,` instead of `role`, since some chat instances might just be architect.
// Wait, `AdminChat` is one component, where did I replace it?

// Let's revert all `sender: role as any,` back to `sender: (typeof role !== 'undefined' ? role : 'ARCHITECT') as any,`
code = code.replace(/sender: role as any,/g, "sender: (typeof role !== 'undefined' ? role : 'ARCHITECT') as any,");
fs.writeFileSync('src/pages/Admin.tsx', code);
