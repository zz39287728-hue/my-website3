import fs from 'fs';

const constPath = 'src/constants.ts';
let content = fs.readFileSync(constPath, 'utf8');

content = content.replace(/type: 'In-Studio'/g, 'type: "In-Studio" as "In-Studio" | "Virtual" | "Site Visit"');
content = content.replace(/type: 'Virtual'/g, 'type: "Virtual" as "In-Studio" | "Virtual" | "Site Visit"');
content = content.replace(/type: 'Site Visit'/g, 'type: "Site Visit" as "In-Studio" | "Virtual" | "Site Visit"');

fs.writeFileSync(constPath, content);
