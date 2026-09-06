const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');
const framerMotionImport = `import { motion, AnimatePresence } from 'framer-motion';`;
if (!code.includes(framerMotionImport)) {
  code = code.replace(/import React, { useState, useEffect, useRef } from 'react';/, `import React, { useState, useEffect, useRef } from 'react';\nimport { motion, AnimatePresence } from 'framer-motion';\nimport { ViewModule } from '../types';`);
}
fs.writeFileSync('src/components/Layout.tsx', code);
