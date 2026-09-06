import fs from 'fs';

const path = 'src/pages/FinanceHub.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'import { PACKAGES, ADDON_SERVICES } from \'../constants\';',
  'import { ADDON_SERVICES } from \'../constants\';'
);

content = content.replace(
  'const pkgObj = PACKAGES.find',
  'const pkgObj = globalState.storeData?.packages.find'
);

fs.writeFileSync(path, content);
