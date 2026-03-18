import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ReceiptText, User, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-start pt-24 min-h-screen p-6 text-center bg-[#b8d6ce]"
    >
      <h1 className="text-6xl font-extrabold text-black mb-4 tracking-tight">PAYERS</h1>
      <p className="text-black mb-10 max-w-xs text-lg opacity-80">No stress. Just split.</p>

      <div className="w-full flex flex-col items-center space-y-3">
        {/* Primary Action - Log In */}
        <button 
          onClick={() => navigate('/login')}
          className="w-64 flex items-center justify-center gap-2 bg-[#bae6fd] border border-black text-black py-3 px-4 rounded-xl font-bold text-base shadow hover:bg-[#7dd3fc] transition-colors"
        >
          <User className="w-4 h-4" />
          Log In / Sign Up
        </button>

        {/* Secondary Action - Guest Mode */}
        <button 
          onClick={() => {
            localStorage.removeItem('isLoggedIn');
            navigate('/scan');
          }}
          className="w-64 flex items-center justify-center gap-2 text-black bg-transparent border border-black/30 py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-black/5 transition"
        >
          Continue as Guest
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>
    </motion.div>
  );
};

export default Home;
