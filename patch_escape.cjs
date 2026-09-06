const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

const escapeEffect = `  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  useEffect(() => {
    scrollToBottom();`;

if (code.includes('useEffect(() => {') && !code.includes('e.key === \'Escape\'')) {
    code = code.replace("  useEffect(() => {\n    scrollToBottom();", escapeEffect);
    fs.writeFileSync('src/pages/Communication.tsx', code);
    console.log("Escape effect added successfully.");
} else {
    console.log("Could not add escape effect.");
}
