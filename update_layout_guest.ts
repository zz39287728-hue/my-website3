import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

const navItemsReplacement = `
  const isGuest = activeClient?.profile?.isGuest;

  const clientNavItems = [
    { id: ViewModule.DASHBOARD, label: t('nav.dashboard'), icon: LayoutDashboard, locked: isGuest },
    { id: ViewModule.PACKAGES, label: t('nav.packages'), icon: Package },
    { id: ViewModule.VISION_BUILDER, label: t('nav.vision'), icon: ImageIcon, locked: isGuest },
    { id: ViewModule.PORTFOLIO_VR, label: t('nav.portfolio'), icon: Briefcase, locked: isGuest },
    { id: ViewModule.COLLECTIONS, label: t("nav.collections") || (lang === "ar" ? "البوتيك" : "Boutique"), icon: Store },
    { id: ViewModule.BOOKING, label: t('nav.booking'), icon: Calendar },
    { id: ViewModule.CHAT, label: t('nav.chat'), icon: MessageSquare, locked: isGuest },
    { id: ViewModule.APPROVALS, label: t('nav.approvals'), icon: FileCheck, locked: isGuest },
    { id: ViewModule.CONTRACTS, label: t('nav.contracts'), icon: PenTool, locked: isGuest },
    { id: ViewModule.INVOICE, label: t('nav.invoice'), icon: ShoppingBag,  badge: clientCartCount, locked: isGuest },
    { id: ViewModule.SUPPORT, label: t('nav.support'), icon: HelpCircle, locked: isGuest },
  ];
`;

content = content.replace(
  `  const clientNavItems = [
    { id: ViewModule.DASHBOARD, label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: ViewModule.PACKAGES, label: t('nav.packages'), icon: Package },
    { id: ViewModule.VISION_BUILDER, label: t('nav.vision'), icon: ImageIcon },
    { id: ViewModule.PORTFOLIO_VR, label: t('nav.portfolio'), icon: Briefcase },
    { id: ViewModule.COLLECTIONS, label: t("nav.collections") || (lang === "ar" ? "البوتيك" : "Boutique"), icon: Store },
    { id: ViewModule.BOOKING, label: t('nav.booking'), icon: Calendar },
    { id: ViewModule.CHAT, label: t('nav.chat'), icon: MessageSquare },
    { id: ViewModule.APPROVALS, label: t('nav.approvals'), icon: FileCheck },
    { id: ViewModule.CONTRACTS, label: t('nav.contracts'), icon: PenTool },
    { id: ViewModule.INVOICE, label: t('nav.invoice'), icon: ShoppingBag,  badge: clientCartCount },
    { id: ViewModule.SUPPORT, label: t('nav.support'), icon: HelpCircle },
  ];`,
  navItemsReplacement
);

// Add Lock icon import
content = content.replace(
  `BookOpen, Activity`,
  `BookOpen, Activity, Lock`
);

// We need to render the lock on the UI.
// Let's check how nav items are rendered.
fs.writeFileSync(path, content);
console.log('Added locked flag');
