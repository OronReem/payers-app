import React, { useState, useRef, useEffect } from 'react';
import { Home, Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeMenu = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const isLoggedIn = !!currentUser;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHomeClick = () => {
    if (isLoggedIn) {
      setIsOpen(!isOpen);
    } else {
      navigate('/');
    }
  };

  const handleNewReceipt = () => {
    setIsOpen(false);
    navigate('/scan');
  };

  const handleLogOut = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={handleHomeClick} 
        className="p-2 text-black bg-[#cce3de] border border-[#a4c3b2] rounded-full hover:bg-[#a4c3b2] transition"
      >
        <Home className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-[#f0f7f4] border-2 border-black shadow-xl rounded-2xl p-2 w-48 z-50 flex flex-col gap-1">
          {currentUser?.displayName && (
            <div className="px-3 pb-2 pt-1 text-xs font-bold text-black opacity-60 border-b border-black/10 mb-1">
              👋 {currentUser.displayName}
            </div>
          )}
          <button 
            onClick={handleNewReceipt}
            className="flex items-center gap-3 w-full p-3 text-left text-black font-bold hover:bg-[#cce3de] rounded-xl transition"
          >
            <Plus className="w-5 h-5 text-black" />
            New Receipt
          </button>
          
          <div className="border-t border-black/10 my-1"></div>
          
          <button 
            onClick={handleLogOut}
            className="flex items-center gap-3 w-full p-3 text-left text-black font-bold hover:bg-[#a4c3b2] rounded-xl transition"
          >
            <LogOut className="w-5 h-5 text-black" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeMenu;
