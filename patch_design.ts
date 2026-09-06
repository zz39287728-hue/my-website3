import fs from 'fs';

const path = 'src/pages/Design.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'import { PACKAGES, ADDON_SERVICES, PORTFOLIO_ITEMS } from \'../constants\';',
  'import { ADDON_SERVICES, PORTFOLIO_ITEMS } from \'../constants\';\nimport { StorePackageItem } from \'../types\';'
);

content = content.replace(
  'useState<typeof PACKAGES[0] | null>(null);',
  'useState<StorePackageItem | null>(null);'
);

content = content.replace(
  'handleAddToCart = (pkg: typeof PACKAGES[0]) =>',
  'handleAddToCart = (pkg: StorePackageItem) =>'
);

content = content.replace(
  'PACKAGES.map',
  'globalState.storeData?.packages.map'
);

content = content.replace(
  'pkg.recommended',
  'pkg.tier === "signature"'
);

fs.writeFileSync(path, content);
