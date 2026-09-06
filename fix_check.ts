import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('Check,')) {
  content = content.replace(
    `import { 
  LayoutDashboard, Package, Image as ImageIcon, Briefcase, 
  Calendar, MessageSquare, FileCheck, PenTool, CreditCard, 
  HelpCircle, User, Settings, Menu, X, Maximize, Minimize, 
  DollarSign, Ticket, LogOut, ArrowLeft, ChevronDown, Users, 
  CheckSquare, Archive, Headphones, Bell, ShoppingBag, Store, 
  BookOpen, Activity, Lock
} from 'lucide-react';`,
    `import { 
  LayoutDashboard, Package, Image as ImageIcon, Briefcase, 
  Calendar, MessageSquare, FileCheck, PenTool, CreditCard, 
  HelpCircle, User, Settings, Menu, X, Maximize, Minimize, 
  DollarSign, Ticket, LogOut, ArrowLeft, ChevronDown, Users, 
  CheckSquare, Archive, Headphones, Bell, ShoppingBag, Store, 
  BookOpen, Activity, Lock, Check
} from 'lucide-react';`
  );
  fs.writeFileSync(path, content);
  console.log('Added Check import');
} else {
  console.log('Check already imported');
}
