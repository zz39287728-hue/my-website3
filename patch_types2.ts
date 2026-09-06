import fs from 'fs';

const typesPath = 'src/types.ts';
let content = fs.readFileSync(typesPath, 'utf8');

content = content.replace(
  'export interface StorePackageItem {',
  'export interface StorePackageItem {\n  nameAr?: string;\n  priceNumber?: number;'
);

content = content.replace(
  'price: number;',
  'price: number | string;'
);

fs.writeFileSync(typesPath, content);
