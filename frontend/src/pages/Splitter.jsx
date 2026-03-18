import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBill } from '../context/BillContext';
import { useNavigate } from 'react-router-dom';
import HomeMenu from '../components/HomeMenu';
import { Users, Settings2, ArrowRight, Home } from 'lucide-react';

const Splitter = () => {
  const { 
    items, 
    participants, 
    generateParticipants,
    toggleItemAssignment, 
    globalTipPercent, 
    setGlobalTipPercent 
  } = useBill();
  
  const navigate = useNavigate();
  const [peopleCount, setPeopleCount] = useState('');
  const [activeParticipant, setActiveParticipant] = useState(null);
  const [customTip, setCustomTip] = useState('');

  const handleGenerate = () => {
    const count = parseInt(peopleCount, 10);
    if (!isNaN(count) && count > 0) {
      generateParticipants(count);
      setActiveParticipant(null); // Reset active selection
    }
  };

  const handleCustomTipChange = (e) => {
    const val = e.target.value;
    setCustomTip(val);
    const num = parseFloat(val);
    if (!isNaN(num)) setGlobalTipPercent(num);
  };

  // Generates a linear gradient across the entire row corresponding to selected participants
  const generateLineBackground = (assignedIds) => {
    if (assignedIds.length === 0) return '';
    if (assignedIds.length === 1) {
      const p = participants.find(x => x.id === assignedIds[0]);
      return p ? p.color : ''; // Return solid hex color
    }
    
    // For multiple assignments, create a striped linear gradient proportionally
    const step = 100 / assignedIds.length;
    let gradientStr = '';
    assignedIds.forEach((id, index) => {
      const p = participants.find(x => x.id === id);
      if (p) {
        const start = index * step;
        const end = (index + 1) * step;
        gradientStr += `${p.color} ${start}%, ${p.color} ${end}%${index < assignedIds.length - 1 ? ', ' : ''}`;
      }
    });
    return `linear-gradient(to right, ${gradientStr})`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col min-h-screen bg-[#e0f0ea] pb-28"
    >
      <div className="bg-[#f0f7f4] p-6 shadow-sm sticky top-0 z-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-black" />
            <h2 className="text-xl font-bold text-black">Setup Table</h2>
          </div>
          <HomeMenu />
        </div>
        
        {/* Number of People Setup */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-[#cce3de] rounded-xl px-3 py-2">
            <Users className="w-5 h-5 text-black mr-2" />
            <input 
              type="number" 
              min="1"
              placeholder="How many people?" 
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              className="bg-transparent outline-none w-full text-sm font-semibold"
            />
          </div>
          <button 
            onClick={handleGenerate}
            className="bg-[#f0f7f4] border-2 border-black text-black px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-black transition"
          >
            Set
          </button>
        </div>

        {/* Tip Config */}
        <div>
          <label className="text-xs font-bold text-black uppercase tracking-wider mb-2 block">Global Tip</label>
          <div className="flex gap-2">
            {[10, 12, 15].map((tip) => (
              <button 
                key={tip}
                onClick={() => {
                  setGlobalTipPercent(tip);
                  setCustomTip('');
                }}
                className={`py-2 px-3 rounded-xl text-sm font-bold transition flex-1 ${
                  globalTipPercent === tip && customTip === ''
                    ? 'bg-[#a4c3b2] border border-black text-black shadow-md' 
                    : 'bg-[#cce3de] text-black hover:bg-[#a4c3b2]'
                }`}
              >
                {tip}%
              </button>
            ))}
            <div className="flex-1 relative">
              <input 
                type="number"
                placeholder="Custom %"
                value={customTip}
                onChange={handleCustomTipChange}
                className={`w-full py-2 px-2 text-center rounded-xl text-sm font-bold border-2 outline-none transition ${
                  customTip !== '' 
                    ? 'border-pay-blue text-black bg-blue-50' 
                    : 'border-transparent bg-[#cce3de] text-black focus:border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-200"></div>

        {/* Generated Colors / People Selection */}
        {participants.length > 0 && (
          <div>
            <p className="text-sm font-bold text-black mb-3 block">1. Tap a color to select a person:</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {participants.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveParticipant(p.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                    activeParticipant === p.id 
                      ? 'border-pay-gray-dark bg-[#cce3de] scale-105 shadow-md' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm mb-1"
                    style={{ backgroundColor: p.color }}
                  ></div>
                  <span className="text-[10px] font-extrabold text-black uppercase tracking-wide">P{i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Item List Assignment */}
      <div className="flex-1 p-4 space-y-3">
        {participants.length > 0 && (
          <p className="text-sm font-bold text-black mb-2 px-1">2. Tap items they ate to split:</p>
        )}
        
        {participants.length === 0 ? (
          <div className="text-center text-black mt-10 font-medium px-8 leading-relaxed">
            Set the number of people above to generate color assignments.
          </div>
        ) : (
          items.map((item) => {
            const isFullyUnassigned = item.assignedTo.length === 0;
            return (
              <button 
                key={item.id} 
                onClick={() => {
                  if (activeParticipant) {
                    toggleItemAssignment(item.id, activeParticipant)
                  }
                }}
                className={`w-full flex items-center p-4 rounded-2xl shadow-sm border transition-all ${
                  isFullyUnassigned ? 'bg-[#f0f7f4] border-gray-200 hover:border-pay-gray-dark' : 'border-transparent shadow-md transform scale-[1.01]'
                }`}
                style={{ background: isFullyUnassigned ? '' : generateLineBackground(item.assignedTo) }}
              >
                {/* Product Info */}
                <div className="flex-1 text-left">
                  <div className={`font-bold text-lg leading-tight ${isFullyUnassigned ? 'text-black' : 'text-black'}`}>{item.name}</div>
                  <div className={`text-sm font-semibold mt-1 ${isFullyUnassigned ? 'text-black' : 'text-black'}`}>
                    {(item.price * item.qty).toFixed(2)} <span className="opacity-75">(x{item.qty})</span>
                  </div>
                </div>
                
                {/* Assignment Indicator */}
                {!isFullyUnassigned && (
                  <div className="w-8 h-8 rounded-full bg-[#f0f7f4]/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center flex-shrink-0 ml-3">
                    <span className="text-black font-black text-sm">✓</span>
                  </div>
                )}
              </button>
            )
          })
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#f0f7f4] p-4 border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => navigate('/results')}
          disabled={participants.length === 0 || !items.some(i => i.assignedTo.length > 0)}
          className="w-full flex items-center justify-center gap-2 bg-[#a4c3b2] border-2 border-black text-black py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-[#cce3de] transition disabled:opacity-50"
        >
          Calculate Results
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default Splitter;
