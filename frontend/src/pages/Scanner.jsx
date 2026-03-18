import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Loader2, ChevronLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomeMenu from '../components/HomeMenu';
import axios from 'axios';
import { useBill } from '../context/BillContext';

const Scanner = () => {
  const navigate = useNavigate();
  const { loadParsedItems, setImagePreview } = useBill();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    // Convert to DataURL for preview and compression
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = async () => {
        // Compress the image using a canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImagePreview(compressedDataUrl);

        try {
          // Extract base64 payload from data URL
          const base64Data = compressedDataUrl.split(',')[1];

          // Connect to the backend
          const res = await axios.post('/api/extract', {
            data: base64Data,
            mimeType: 'image/jpeg'
          }, {
            headers: { 'Content-Type': 'application/json' }
          });
          
          loadParsedItems(res.data);
          navigate('/edit');
        } catch (err) {
          console.error('Upload Error:', err.response?.data || err.message);
          setError(err.response?.data?.error || 'Failed to process image. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col min-h-screen bg-[#e0f0ea]"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-black rounded-full hover:bg-[#a4c3b2] transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold ml-2 text-black">Scan Receipt</h2>
        </div>
        <HomeMenu />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4 animate-pulse">
            <div className="w-20 h-20 bg-[#a4c3b2] border border-black/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-black animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-black">Reading Magic...</h3>
            <p className="text-sm text-black">Extracting items and prices via Gemini AI</p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2 mb-8">
              <div className="bg-[#f0f7f4] p-4 rounded-3xl shadow-sm inline-block mb-4">
                <Camera className="w-16 h-16 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black">Capture Bill</h3>
              <p className="text-black">Snap a clear photo of your receipt.</p>
            </div>

            {error && (
              <div className="bg-pay-red/10 text-black p-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="w-full space-y-4">
              <label className="w-full flex items-center justify-center gap-3 bg-[#a4c3b2] border border-black text-black py-4 px-6 rounded-2xl font-bold text-lg shadow-md cursor-pointer hover:bg-blue-700 transition">
                <Camera className="w-5 h-5" />
                Take Photo
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  capture="environment"
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>

              <label className="w-full flex items-center justify-center gap-3 bg-[#f0f7f4] text-black border-2 border-pay-blue/20 py-4 px-6 rounded-2xl font-bold text-lg shadow-sm cursor-pointer hover:bg-[#e0f0ea] transition">
                <Upload className="w-5 h-5" />
                Upload from Gallery
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-200 w-full flex justify-center">
              <button 
                onClick={() => navigate('/history')}
                className="text-black font-bold text-sm flex items-center gap-1 hover:underline px-4 py-2 rounded-xl transition"
              >
                View Past Receipts
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Scanner;
