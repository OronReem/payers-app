import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import Login from './pages/Login';
import Scanner from './pages/Scanner';
import Editor from './pages/Editor';
import Splitter from './pages/Splitter';
import Results from './pages/Results';
import PastReceipts from './pages/PastReceipts';

function App() {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#f4f6f8] shadow-xl overflow-hidden relative font-sans text-[#161616]">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/edit" element={<Editor />} />
          <Route path="/split" element={<Splitter />} />
          <Route path="/results" element={<Results />} />
          <Route path="/history" element={<PastReceipts />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
