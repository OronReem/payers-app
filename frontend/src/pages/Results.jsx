import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBill } from '../context/BillContext';
import { Copy, PartyPopper, Camera, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomeMenu from '../components/HomeMenu';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Results = () => {
  const { items, participants, globalTipPercent } = useBill();
  const navigate = useNavigate();
  const hasSaved = useRef(false);
  const { currentUser } = useAuth();

  // Calculation Engine
  const calculateResults = () => {
    let totals = {};
    participants.forEach(p => {
      totals[p.id] = { ...p, subtotal: 0, items: [] };
    });

    let overallSubtotal = 0;

    items.forEach(item => {
      const itemTotal = item.price * item.qty;
      overallSubtotal += itemTotal;

      if (item.assignedTo.length > 0) {
        // Split cost evenly among assigned
        const splitCost = itemTotal / item.assignedTo.length;
        const isShared = item.assignedTo.length > 1;
        item.assignedTo.forEach(pid => {
          if (totals[pid]) {
            totals[pid].subtotal += splitCost;
            totals[pid].items.push({ name: item.name, cost: splitCost, isShared });
          }
        });
      }
    });

    const tipMultiplier = globalTipPercent / 100;
    let grandTotal = 0;

    Object.values(totals).forEach(p => {
      p.tipShare = p.subtotal * tipMultiplier;
      p.grandTotal = Math.ceil(p.subtotal + p.tipShare);
      grandTotal += p.grandTotal;
    });

    return { 
      breakdowns: Object.values(totals), 
      overallSubtotal, 
      overallTip: overallSubtotal * tipMultiplier,
      overallGrandTotal: overallSubtotal * (1 + tipMultiplier)
    };
  };

  const { breakdowns, overallSubtotal, overallTip, overallGrandTotal } = calculateResults();

  useEffect(() => {
    if (!hasSaved.current && breakdowns.length > 0) {
      hasSaved.current = true;
      const record = {
        date: new Date().toISOString(),
        overallGrandTotal,
        participants: breakdowns,
        items
      };
      if (currentUser) {
        // Logged-in user: save to Firestore under their UID
        addDoc(collection(db, 'users', currentUser.uid, 'receipts'), {
          ...record,
          createdAt: serverTimestamp()
        }).catch(err => console.error('Firestore save failed:', err));
      } else {
        // Guest: save to localStorage
        const existing = JSON.parse(localStorage.getItem('payers_receipts') || '[]');
        existing.unshift({ ...record, id: Date.now().toString() });
        localStorage.setItem('payers_receipts', JSON.stringify(existing));
      }
    }
  }, [breakdowns, items, overallGrandTotal, currentUser]);

  const handleCopySummary = () => {
    let text = "🍽️ PAYERS Breakdown\n\n";
    breakdowns.forEach(p => {
      text += `🔹 ${p.name}: ${p.grandTotal.toFixed(2)}\n`;
    });
    text += `\nSubtotal: ${overallSubtotal.toFixed(2)}`;
    text += `\nTip (${globalTipPercent}%): ${overallTip.toFixed(2)}`;
    text += `\nTotal Table: ${overallGrandTotal.toFixed(2)}`;
    
    navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-[#e0f0ea] min-h-screen pb-40"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <PartyPopper className="w-8 h-8 text-black" />
          <h2 className="text-2xl font-extrabold text-black">Final Results</h2>
        </div>
        <HomeMenu />
      </div>

      <div className="space-y-3 mb-8">
        {breakdowns.map(person => (
          <div key={person.id} className="bg-[#f0f7f4] rounded-xl p-3 shadow-sm border border-gray-100 overflow-hidden relative">
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-${person.color}`}></div>
            <div className="flex justify-between items-center mb-2 pl-2 border-b border-gray-100 pb-2">
              <h3 className="font-bold text-lg text-black">{person.name}</h3>
              <span className="text-lg font-black text-black">${person.grandTotal.toFixed(0)}</span>
            </div>
            
            <div className="space-y-1 pl-2">
              {person.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-black font-medium">
                  <span>{item.name} {item.isShared && <span className="font-bold ml-1">(Shared)</span>}</span>
                  <span className="font-bold text-black">{item.cost.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs text-black font-bold pt-1">
                <span>Tip Contribution</span>
                <span className="text-black">{person.tipShare.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#f0f7f4] border-2 border-black text-black rounded-3xl p-6 mb-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 space-y-2">
          <div className="flex justify-between text-black font-medium">
            <span>Subtotal</span>
            <span>{overallSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black font-medium">
            <span>Total Tip</span>
            <span>{overallTip.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between font-bold text-xl">
            <span>Table Total</span>
            <span className="text-black">{overallGrandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#f0f7f4] p-4 border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] space-y-3">
        <button 
          onClick={handleCopySummary}
          className="w-full flex items-center justify-center gap-2 bg-[#a4c3b2] border border-black text-black py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-blue-700 transition"
        >
          <Copy className="w-5 h-5" />
          Copy Summary to WhatsApp
        </button>

        <button 
          onClick={() => navigate('/scan')}
          className="w-full flex items-center justify-center gap-2 bg-[#cce3de] text-black py-4 rounded-2xl font-bold text-lg shadow-sm hover:bg-[#a4c3b2] transition"
        >
          <Camera className="w-5 h-5" />
          Scan New Receipt
        </button>
      </div>
    </motion.div>
  );
};

export default Results;
