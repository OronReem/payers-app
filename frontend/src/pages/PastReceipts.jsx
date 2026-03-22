import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ReceiptText, Clock, Home, Trash2, Pencil, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomeMenu from '../components/HomeMenu';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';

const PastReceipts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const saveEventName = async (id) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'receipts', id), {
        eventName: editName
      });
      setReceipts(receipts.map(r => r.id === id ? { ...r, eventName: editName } : r));
    } catch (err) {
      console.error('Failed to update name', err);
    }
    setEditingId(null);
  };

  useEffect(() => {
    const load = async () => {
      if (currentUser) {
        // Logged-in user: fetch from Firestore
        try {
          const q = query(
            collection(db, 'users', currentUser.uid, 'receipts'),
            orderBy('createdAt', 'desc')
          );
          const snap = await getDocs(q);
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setReceipts(data);
        } catch (err) {
          console.error('Failed to load receipts from Firestore:', err);
        }
      } else {
        setReceipts([]);
      }
      setLoading(false);
    };
    load();
  }, [currentUser]);

  const handleDelete = async (id) => {
    const updated = receipts.filter(r => r.id !== id);
    setReceipts(updated);
    if (currentUser) {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'receipts', id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col min-h-screen bg-[#e0f0ea]"
    >
      <div className="flex items-center justify-between p-6 pb-4 bg-[#f0f7f4] shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-black rounded-full hover:bg-[#a4c3b2] transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold ml-2 text-black">Past Receipts</h2>
        </div>
        <HomeMenu />
      </div>

      <div className="flex-1 p-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 space-y-3">
            <Clock className="w-8 h-8 animate-spin text-black" />
            <p className="text-black font-medium">Fetching History...</p>
          </div>
        ) : receipts.length === 0 ? (
          <div className="text-center text-black mt-20 font-medium">
            <div className="bg-[#cce3de] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ReceiptText className="w-8 h-8 text-black" />
            </div>
            No past receipts found.
          </div>
        ) : (
          receipts.map(r => (
            <div key={r.id} className="bg-[#f0f7f4] p-5 rounded-3xl shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-[#a4c3b2] border border-black/10 p-2 rounded-xl">
                    <ReceiptText className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1">
                    {editingId === r.id ? (
                      <div className="flex items-center gap-1 mb-0.5 mt-0.5">
                        <input 
                          type="text" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="text-sm font-bold text-black border-2 border-pay-gray-dark outline-none bg-white rounded px-2 w-full max-w-[150px]"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === 'Enter') saveEventName(r.id); }}
                        />
                        <button onClick={() => saveEventName(r.id)} className="p-1.5 hover:bg-[#a4c3b2] rounded bg-[#cce3de] transition shadow-sm ml-1">
                          <Check className="w-4 h-4 text-black" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <div className="text-sm font-bold text-black">{r.eventName || 'Table Split'}</div>
                        <button 
                          onClick={() => { setEditingId(r.id); setEditName(r.eventName || 'Table Split'); }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#a4c3b2] rounded transition flex items-center justify-center shrink-0"
                        >
                          <Pencil className="w-3.5 h-3.5 text-black" />
                        </button>
                      </div>
                    )}
                    <div className="text-xs font-bold text-black opacity-80">
                      {(() => {
                        const d = r.date ? new Date(r.date) : (r.createdAt?.toDate ? r.createdAt.toDate() : new Date());
                        return `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
                      })()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-xl text-black">{r.overallGrandTotal?.toFixed(2)}</span>
                  <button onClick={() => handleDelete(r.id)} className="p-2 text-black hover:bg-black/10 rounded-lg transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-dashed border-gray-100">
                <p className="text-[10px] font-bold text-black uppercase tracking-wider mb-2">Participant Shares</p>
                <div className="flex flex-wrap gap-2">
                  {r.participants?.map(p => (
                    <div key={p.id} className="flex items-center gap-1.5 bg-[#e0f0ea] px-2.5 py-1 rounded-lg border border-gray-100">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: p.color}}></div>
                      <span className="text-xs font-bold text-black">{p.name} <span className="opacity-80 ml-1 font-bold">{p.grandTotal?.toFixed(2)}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default PastReceipts;
