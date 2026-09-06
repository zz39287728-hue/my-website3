import fs from 'fs';

const typesPath = 'src/types.ts';
let content = fs.readFileSync(typesPath, 'utf8');

content = content.replace(
  'price: number | string;',
  'price: number;'
);
// wait, in CartItem it is 'price: number | string;'

content = content.replace(
  'export interface CartItem {\n  id: string;\n  title: string;\n  subtitle?: string;\n  price: number | string;',
  'export interface CartItem {\n  id: string;\n  title: string;\n  subtitle?: string;\n  price: number;'
);

content = content.replace(
  'export interface StorePackageItem {\n  nameAr?: string;\n  priceNumber?: number;\n  id: string;\n  name: string;\n  price: number | string;',
  'export interface StorePackageItem {\n  nameAr?: string;\n  priceNumber: number;\n  id: string;\n  name: string;\n  price: string;'
);

fs.writeFileSync(typesPath, content);
