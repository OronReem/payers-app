const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src', 'pages');

// Pages that need the component
const targetPages = ['Editor.jsx', 'PastReceipts.jsx', 'Results.jsx', 'Splitter.jsx', 'Scanner.jsx'];

for (const file of targetPages) {
  const fullPath = path.join(srcDir, file);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Inject import if not present
  if (!content.includes('import HomeMenu from')) {
    content = content.replace(
      /from 'react-router-dom';/,
      "from 'react-router-dom';\nimport HomeMenu from '../components/HomeMenu';"
    );
  }

  // Find the button with navigate('/') and <Home ... />
  // We will replace variations using regex.
  const regex = /<button[^>]*onClick={\(\)\s*=>\s*navigate\('\/'\)}[^>]*>[\s\S]*?<Home[^>]*\/>[\s\S]*?<\/button>/;
  content = content.replace(regex, '<HomeMenu />');
  
  fs.writeFileSync(fullPath, content);
}

// Fix Login.jsx (setLoggedIn)
const loginPath = path.join(srcDir, 'Login.jsx');
if (fs.existsSync(loginPath)) {
  let loginContent = fs.readFileSync(loginPath, 'utf8');
  loginContent = loginContent.replace(
    /e\.preventDefault\(\);(\s*\/\/.*)?\s*navigate\('\/scan'\);/g,
    "e.preventDefault();\n    localStorage.setItem('isLoggedIn', 'true');\n    navigate('/scan');"
  );
  fs.writeFileSync(loginPath, loginContent);
}

// Fix Home.jsx (guest clears log in)
const homePath = path.join(srcDir, 'Home.jsx');
if (fs.existsSync(homePath)) {
  let homeContent = fs.readFileSync(homePath, 'utf8');
  homeContent = homeContent.replace(
    /onClick={\(\)\s*=>\s*navigate\('\/scan'\)}/g,
    "onClick={() => {\n            localStorage.removeItem('isLoggedIn');\n            navigate('/scan');\n          }}"
  );
  fs.writeFileSync(homePath, homeContent);
}

console.log("HomeMenu injected and Auth Login rules applied.");
