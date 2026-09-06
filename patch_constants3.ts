import fs from 'fs';

const constPath = 'src/constants.ts';
let content = fs.readFileSync(constPath, 'utf8');

content = content.replace(/tier: 'essential'/g, 'tier: "essential" as "essential" | "executive" | "signature"');
content = content.replace(/tier: 'executive'/g, 'tier: "executive" as "essential" | "executive" | "signature"');
content = content.replace(/tier: 'signature'/g, 'tier: "signature" as "essential" | "executive" | "signature"');

fs.writeFileSync(constPath, content);
