const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');
if(!code.includes("import { useAppContext } from '../App';")) {
  code = code.replace("import { ViewModule } from '../types';", "import { ViewModule } from '../types';\nimport { useAppContext } from '../App';");
}
fs.writeFileSync('src/components/Layout.tsx', code);
