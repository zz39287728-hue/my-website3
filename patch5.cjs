const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');
const iconAdditions = `
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.56.04 2.88.74 3.65 1.9-3.3 1.95-2.76 6.3 1.05 7.74-.78 2.08-1.99 4.14-3.37 5.29zM12.03 7.25c-.15-3.47 2.76-6.08 6.12-6.25.26 3.4-2.88 6.27-6.12 6.25z"/>
  </svg>
);
`;
if (!code.includes("function GoogleIcon")) {
  code = code.replace("export const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {", iconAdditions + "\nexport const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {");
}
fs.writeFileSync('src/components/Layout.tsx', code);
