import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBill } from '../context/BillContext';
import { useNavigate } from 'react-router-dom';
import HomeMenu from '../components/HomeMenu';
import { Plus, Trash2, ArrowRight, ReceiptText, Home } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Editor = () => {
  const { items, updateItem, setItems, addItem, imagePreview } = useBill();
  const navigate = useNavigate();

  // Auto-delete removed to allow empty inputs during typing and creating new zero-price items

  const handlePriceChange = (id, val) => {
    const num = parseFloat(val);
    updateItem(id, { price: isNaN(num) ? 0 : num });
  };

  const handleQtyChange = (id, val) => {
    const num = parseInt(val, 10);
    updateItem(id, { qty: isNaN(num) ? 1 : num });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col min-h-screen bg-[#e0f0ea] pb-40"
    >
      <div className="bg-[#f0f7f4] p-6 pb-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ReceiptText className="w-8 h-8 text-black" />
          <div>
            <h2 className="text-xl font-bold text-black">Verify Receipt</h2>
            <p className="text-sm text-black font-medium">Tap any item to edit.</p>
          </div>
        </div>
        <HomeMenu />
      </div>
      
      {imagePreview && (
        <div className="px-4 pt-4">
          <img src={imagePreview} alt="Receipt thumbnail" className="w-full h-auto max-h-[60vh] object-contain rounded-2xl shadow-sm opacity-90 bg-[#f0f7f4]/50" />
        </div>
      )}

      <div className="flex-1 p-4 space-y-3">
        {items.length > 0 && (
          <div className="flex px-4 pb-0 text-[10px] font-extrabold text-black uppercase tracking-widest opacity-60">
            <div className="flex-1">Item Title</div>
            <div className="w-20 text-center">Price</div>
            <div className="w-12 text-center ml-2">Qty</div>
            <div className="w-8 ml-2"></div>
          </div>
        )}
        <AnimatePresence>
          {items.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#f0f7f4] py-2 px-3 rounded-lg shadow-sm border border-gray-100 flex flex-nowrap items-center gap-2"
            >
              <input 
                type="text" 
                value={item.name} 
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
                className="font-bold text-black bg-white border border-[#a4c3b2] rounded px-2 py-1 outline-none flex-1 min-w-0 shadow-sm transition focus:border-gray-500"
              />
              <input 
                type="number" 
                step="0.01"
                value={item.price}
                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                className="w-20 font-bold outline-none bg-white border border-[#a4c3b2] rounded px-1 py-1 text-black text-center shadow-sm transition focus:border-gray-500"
              />
              <input 
                type="number" 
                min="1"
                value={item.qty}
                onChange={(e) => handleQtyChange(item.id, e.target.value)}
                className="w-12 font-bold outline-none bg-white border border-[#a4c3b2] rounded px-1 py-1 text-black text-center shadow-sm transition focus:border-gray-500"
              />
              <button 
                onClick={() => removeItem(item.id)}
                className="p-2 text-black hover:bg-[#a4c3b2] rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <button 
          onClick={() => addItem({ name: 'New Item', price: 0, qty: 1 })}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 text-black py-4 mt-4 rounded-2xl hover:border-pay-blue hover:text-black transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Missing Item
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#f0f7f4] p-4 border-t border-gray-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="text-black font-bold">Subtotal</span>
          <span className="text-2xl font-bold text-black">{subtotal.toFixed(2)}</span>
        </div>
        <button 
          onClick={() => navigate('/split')}
          className="w-full flex items-center justify-center gap-2 bg-[#a4c3b2] border border-black text-black py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-blue-700 transition"
        >
          Continue to Split
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default Editor;
