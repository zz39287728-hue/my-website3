import fs from 'fs';
const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('Phone, ')) {
  content = content.replace(
    `import { Send, Paperclip, Calendar as CalendarIcon, Clock, ChevronDown, MapPin, Video, Building, X, Download, Check, ShoppingBag, ArrowRight, DollarSign, CheckCircle2 } from 'lucide-react';`,
    `import { Send, Paperclip, Calendar as CalendarIcon, Clock, ChevronDown, MapPin, Video, Building, X, Download, Check, ShoppingBag, ArrowRight, DollarSign, CheckCircle2, Phone } from 'lucide-react';`
  );
  fs.writeFileSync(path, content);
}
