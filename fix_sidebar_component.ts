import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// The SidebarContent is defined INSIDE the Layout component:
// const SidebarContent = ({ isExpanded }: { isExpanded: boolean }) => ( ... )
// When you define a component inside another component and use it with JSX (<SidebarContent />),
// React thinks it's a completely NEW component type every time the parent re-renders.
// This causes React to completely unmount the old SidebarContent and mount the new one, losing all state and causing flashing/refreshing.
// Instead of defining it as a component, we can define it as a function that returns JSX, OR move it outside.
// Since it uses a LOT of local variables (role, currentView, setCurrentView, t, navItems, globalState, etc.),
// the easiest fix is to just change `<SidebarContent isExpanded={true} />` to `{SidebarContent({ isExpanded: true })}`.
// That way it's just a function call, not a new React component type.

content = content.replace(/<SidebarContent isExpanded={isSidebarHovered} \/>/g, '{SidebarContent({ isExpanded: isSidebarHovered })}');
content = content.replace(/<SidebarContent isExpanded={true} \/>/g, '{SidebarContent({ isExpanded: true })}');

fs.writeFileSync(path, content);
