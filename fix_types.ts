import fs from 'fs';

const path = 'src/types.ts';
let content = fs.readFileSync(path, 'utf8');

const target = `export interface UserProfile {
  id: string;
  name: string;
  tier: string;
  project: string;
  area: string;
  avatar: string;
  completion: number;
  style: string;
  location: string;
  status: 'Active' | 'Archived';
  freeConsultations: number; // Number of free consultations remaining
}`;

const replacement = `export interface UserProfile {
  id: string;
  name: string;
  tier: string;
  project: string;
  area: string;
  avatar: string;
  completion: number;
  style: string;
  location: string;
  status: 'Active' | 'Archived';
  freeConsultations: number; // Number of free consultations remaining
  onboardingCompleted?: boolean;
  designPreferences?: Record<string, string>;
}`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
console.log('Fixed types');
