const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

code = code.replace(
  "const [input, setInput] = useState('');",
  "const [input, setInput] = useState('');\n  const [translatedMessages, setTranslatedMessages] = useState<Record<string, boolean>>({});\n  const [translatedText, setTranslatedText] = useState<Record<string, string>>({});"
);

fs.writeFileSync('src/pages/Communication.tsx', code);
