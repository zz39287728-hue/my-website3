import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix the clientNavItems to unlock INVOICE and reorder
const regex = /const clientNavItems = \[([\s\S]*?)\];/;
const replacement = `const clientNavItems = [
    { id: ViewModule.PACKAGES, label: t('nav.packages'), icon: Package },
    { id: ViewModule.COLLECTIONS, label: t("nav.collections") || (lang === "ar" ? "البوتيك" : "Boutique"), icon: Store },
    { id: ViewModule.BOOKING, label: t('nav.booking'), icon: Calendar },
    { id: ViewModule.INVOICE, label: t('nav.invoice'), icon: ShoppingBag, badge: clientCartCount },
    { id: ViewModule.DASHBOARD, label: t('nav.dashboard'), icon: LayoutDashboard, locked: isGuest },
    { id: ViewModule.VISION_BUILDER, label: t('nav.vision'), icon: ImageIcon, locked: isGuest },
    { id: ViewModule.PORTFOLIO_VR, label: t('nav.portfolio'), icon: Briefcase, locked: isGuest },
    { id: ViewModule.CHAT, label: t('nav.chat'), icon: MessageSquare, locked: isGuest },
    { id: ViewModule.APPROVALS, label: t('nav.approvals'), icon: FileCheck, locked: isGuest },
    { id: ViewModule.CONTRACTS, label: t('nav.contracts'), icon: PenTool, locked: isGuest },
    { id: ViewModule.SUPPORT, label: t('nav.support'), icon: HelpCircle, locked: isGuest },
  ];`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content);
console.log('Fixed nav items order and unlocked INVOICE');
