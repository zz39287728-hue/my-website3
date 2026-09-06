import fs from 'fs';

const typesPath = 'src/types.ts';
let content = fs.readFileSync(typesPath, 'utf8');

// Use regex to replace price in StorePackageItem specifically
content = content.replace(
  /export interface StorePackageItem \{[\s\S]*?price: number;/,
  function(match) {
    return match.replace('price: number;', 'price: number | string;');
  }
);

fs.writeFileSync(typesPath, content);
