const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

const unreadCountCalculation = `  const isAr = lang === 'ar';

  const unreadChatCount = activeClient?.chatHistory?.filter(msg => 
    (msg.sender === 'ARCHITECT' || msg.sender === 'SUPPORT') && msg.status !== 'READ'
  ).length || 0;

  let navItems = clientNavItems;`;

code = code.replace("  const isAr = lang === 'ar';\n\n  let navItems = clientNavItems;", unreadCountCalculation);

const oldNotificationBadge = `{activeClient?.hasUnreadMessages && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-luxury-50 dark:border-luxury-950 shadow-md" />
                )}`;

const newNotificationBadge = `{unreadChatCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-neutral-900 border-2 border-luxury-50 dark:border-luxury-950 shadow-md text-[9px] font-bold flex items-center justify-center">
                    {unreadChatCount}
                  </span>
                )}`;

if (code.includes(oldNotificationBadge)) {
  code = code.replace(oldNotificationBadge, newNotificationBadge);
  fs.writeFileSync('src/components/Layout.tsx', code);
  console.log("Layout.tsx patched successfully!");
} else {
  console.log("Could not find the target code in Layout.tsx");
}
