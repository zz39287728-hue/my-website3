import fs from 'fs';

const typesPath = 'src/types.ts';
let content = fs.readFileSync(typesPath, 'utf8');

const interfacesToAdd = `
export interface StoreCollectionItem {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  isNew: boolean;
}

export interface StorePackageItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  description?: string;
  tier: 'essential' | 'executive' | 'signature';
}

export interface StoreConsultationItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  duration: string;
  type: 'In-Studio' | 'Virtual' | 'Site Visit';
}

export interface StoreData {
  collections: StoreCollectionItem[];
  packages: StorePackageItem[];
  consultations: StoreConsultationItem[];
}
`;

content = content.replace('export interface GlobalState {', interfacesToAdd + '\nexport interface GlobalState {\n  storeData: StoreData;');

fs.writeFileSync(typesPath, content);
