import fs from 'fs';

const path = 'src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `const [isEditing, setIsEditing] = useState(false);`;
const rep = `const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'ADMIN_PROFILE' || e.detail === 'PROFILE') {
        setIsEditing(false);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`;

// Actually wait, 'PROFILE' component might be different. Let's do it for AdminProfile first.
// Replace the LAST occurrence to be safe or target specifically.
content = content.replace(
  `  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(architectProfile);`,
  `  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(architectProfile);

  React.useEffect(() => {
    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'ADMIN_PROFILE') {
        setIsEditing(false);
      }
    };
    window.addEventListener('reset-view' as any, handleReset);
    return () => window.removeEventListener('reset-view' as any, handleReset);
  }, []);`
);

fs.writeFileSync(path, content);
