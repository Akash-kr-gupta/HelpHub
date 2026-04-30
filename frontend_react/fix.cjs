const fs = require('fs');

let m = fs.readFileSync('d:/PROJECTS/HelpHub/frontend_react/src/main.jsx', 'utf8');
if (!m.includes('axios.defaults.baseURL')) {
  m = "import axios from 'axios';\n" + m;
  m = m.replace(/import '\.\/styles\.css';/g, "import './styles.css';\naxios.defaults.baseURL = import.meta.env.VITE_API_URL || '';\n");
  fs.writeFileSync('d:/PROJECTS/HelpHub/frontend_react/src/main.jsx', m);
}

const p = 'd:/PROJECTS/HelpHub/frontend_react/src/pages/';
fs.readdirSync(p).forEach(f => {
  if (f.endsWith('.jsx')) {
    let content = fs.readFileSync(p+f, 'utf8');
    content = content.replace(/io\([^)]*\)/g, "io(import.meta.env.VITE_API_URL || '')");
    fs.writeFileSync(p+f, content);
  }
});
console.log('Fixed stuff');
