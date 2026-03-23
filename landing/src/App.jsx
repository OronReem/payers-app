import React from 'react';
import { motion } from 'framer-motion';
import { 
  Scan, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone,
  Zap,
  CreditCard,
  Target,
  Trophy
} from 'lucide-react';

const YouTubeEmbed = ({ embedId }) => (
  <div className="flex flex-col items-center w-full my-6">
    <h3 className="text-xl md:text-2xl font-black mb-8 text-neutral-800 tracking-tight uppercase">Product Walkthrough</h3>
    <div className="relative w-full max-w-[280px] aspect-[9/19.5] max-h-[65vh] rounded-[3rem] shadow-2xl bg-black border-[10px] border-neutral-900 overflow-hidden ring-4 ring-neutral-100">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${embedId}?autoplay=1&mute=1&loop=1&playlist=${embedId}&modestbranding=1&rel=0&iv_load_policy=3`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="PAYERS Product Demo"
      />
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-white/70 backdrop-blur-md border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="PAYERS Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-xl tracking-tight text-neutral-900 uppercase">PAYERS</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">Features</a>
          <a href="#process" className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">Process</a>
          <a 
            href="https://payers-app.vercel.app" 
            className="bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all flex items-center gap-2"
          >
            Open App
            <ArrowRight size={14} />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div 
               initial={{ scale: 0.9 }}
               animate={{ scale: 1 }}
               className="w-20 h-20 mb-6 rounded-2xl shadow-xl border-2 border-white overflow-hidden"
            >
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-neutral-950 mb-4 uppercase">
              PAYERS
            </h1>
            <div className="h-1.5 w-16 bg-emerald-500 rounded-full mb-6"></div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-neutral-800 leading-tight">
            Make group expenses <br />
            <span className="text-emerald-600">easy to split.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-neutral-500 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
            Capture receipts with precision and handle group payments with a professional, balanced approach. 
          </p>

          <div className="flex gap-4 justify-center items-center">
            <a 
              href="https://payers-app.vercel.app"
              className="px-8 py-4 rounded-full text-lg font-bold bg-neutral-950 text-white shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              Start Now
              <ArrowRight size={20} />
            </a>
            <a 
              href="#demo"
              className="px-6 py-4 text-lg font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Watch Video
            </a>
          </div>
        </motion.div>

        {/* Video Demo Section */}
        <motion.div 
          id="demo"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-16 w-full max-w-4xl scroll-mt-32"
        >
          <YouTubeEmbed embedId="1maPRZ704ro" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 md:px-12 bg-[#fafafa] scroll-mt-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Scan className="text-emerald-600" />}
              title="Receipt Scanning"
              description="Identify all line items and totals directly from your document captures."
              color="emerald"
            />
            <FeatureCard 
              icon={<Target className="text-sky-600" />}
              title="Smart Allocation"
              description="Precisely assign shares with automated balance handling for taxes and fees."
              color="sky"
            />
            <FeatureCard 
              icon={<Share2 className="text-emerald-600" />}
              title="Clear Resolution"
              description="Detailed summaries ensure everyone understands their contribution clearly."
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* The Process */}
      <section id="process" className="py-20 px-6 md:px-12 bg-white scroll-mt-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-950 mb-4 uppercase tracking-tighter">The Process</h2>
            <p className="text-neutral-500 font-medium text-lg">A systematic way to handle shared bills.</p>
          </div>
          
          <div className="space-y-6">
             <ProcessStepBox 
               number="1"
               title="Initial Capture"
               description="Secure a photograph of your receipt for automated processing and data extraction."
               icon={<Scan size={20} />}
               color="emerald"
             />
             <ProcessStepBox 
               number="2"
               title="Item Assignment"
               description="Review the extracted data and assign items to participants. All calculations are handled instantly."
               icon={<Target size={20} />}
               color="sky"
             />
             <ProcessStepBox 
               number="3"
               title="Final Summary"
               description="Confirm the final shares and provide participants with a respectful, clear breakdown."
               icon={<Trophy size={20} />}
               color="emerald"
             />
          </div>
        </div>
      </section>

      {/* Final CTA - Lighter Theme */}
      <section className="py-24 px-6 md:px-12 bg-[#f8fafc] border-y border-neutral-100">
         <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
           <img src="/logo.png" alt="Branding" className="w-16 h-16 rounded-2xl mb-8 opacity-80" />
           <h2 className="text-4xl font-black mb-6 tracking-tight text-neutral-900 uppercase">Manage group expenses today.</h2>
           <p className="text-neutral-500 text-lg mb-10 leading-relaxed max-w-xl font-medium">
             Join a professional community focused on transparent and efficient financial coordination.
           </p>
           <div className="flex flex-col sm:flex-row gap-4">
             <a 
                href="https://payers-app.vercel.app" 
                className="bg-emerald-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center gap-2"
              >
                Access App
                <ArrowRight />
              </a>
           </div>
          </div>
      </section>

      {/* Tech Stack Bar */}
      <div className="py-12 bg-white px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
           <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Powered by:</span>
           <div className="flex flex-wrap justify-center gap-8 text-xs font-bold text-neutral-500">
             <span>Vite</span>
             <span>React</span>
             <span>Tailwind CSS</span>
             <span>Framer Motion</span>
             <span>Firebase</span>
             <span>Vercel</span>
           </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pb-12 pt-4 px-6 md:px-12 bg-white text-center">
        <div className="max-w-7xl mx-auto pt-8 border-t border-neutral-100">
          <p className="text-neutral-400 text-xs font-semibold tracking-wider">&copy; 2026 PAYERS. Professional Group Financial Coordination.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    sky: "bg-sky-50 border-sky-100",
    emerald: "bg-emerald-50 border-emerald-100"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-white border border-neutral-200/40 shadow-sm hover:shadow-xl transition-all"
    >
      <div className={`w-12 h-12 ${colorClasses[color]} border rounded-xl flex items-center justify-center mb-6`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-4 tracking-tight">{title}</h3>
      <p className="text-neutral-500 leading-relaxed font-semibold text-sm">{description}</p>
    </motion.div>
  );
};

const ProcessStepBox = ({ number, title, description, icon, color }) => {
  const colorClasses = {
    sky: "text-sky-600 bg-sky-50",
    emerald: "text-emerald-600 bg-emerald-50"
  };

  return (
    <motion.div 
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      viewport={{ once: true }}
      className="bg-neutral-50 p-6 md:p-8 rounded-3xl shadow-sm border border-neutral-200 flex flex-col md:flex-row items-center gap-8"
    >
      <div className={`w-14 h-14 shrink-0 rounded-2xl ${colorClasses[color]} flex items-center justify-center text-xl font-black shadow-inner`}>
        {number}
      </div>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-lg font-bold text-neutral-900 mb-1 uppercase tracking-wide">{title}</h3>
        <p className="text-neutral-500 font-medium leading-relaxed text-sm">{description}</p>
      </div>
      <div className="hidden md:block opacity-10">
        <ArrowRight size={24} />
      </div>
    </motion.div>
  );
};

export default LandingPage;
