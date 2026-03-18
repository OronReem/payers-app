import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ChevronLeft, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        // Username login: we stored email alongside username in displayName,
        // but for simplicity we ask for username+password and use email field.
        // In a production app you'd look up the email by username in Firestore.
        // For now, login mode asks username (used as email) and password.
        await login(email, password);
      } else {
        await signup(username, email, password);
      }
      navigate('/scan');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex flex-col min-h-screen bg-[#e0f0ea]"
    >
      <div className="flex items-center p-6 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-black rounded-full hover:bg-[#a4c3b2] transition">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-6 flex flex-col justify-center">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-black mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-black text-sm">
            {isLogin 
              ? 'Log in to securely save your receipt splits and history.' 
              : 'Sign up to keep track of your payments and past splits forever.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-800 text-sm p-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username — always shown */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-black" />
            </div>
            <input 
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-[#f0f7f4] border border-gray-200 rounded-2xl outline-none focus:border-[#a4c3b2] transition text-black"
            />
          </div>

          {/* Password — always shown */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-black" />
            </div>
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-[#f0f7f4] border border-gray-200 rounded-2xl outline-none focus:border-[#a4c3b2] transition text-black"
            />
          </div>

          {/* Email — only for Sign Up */}
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-black" />
              </div>
              <input 
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-[#f0f7f4] border border-gray-200 rounded-2xl outline-none focus:border-[#a4c3b2] transition text-black"
              />
            </div>
          )}

          {/* For login mode, use username as the email field 
              (user types their email in the username box — we map it through) */}
          {isLogin && (
            <input type="hidden" value={username} onChange={() => setEmail(username)} />
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#a4c3b2] border border-black text-black py-4 mt-2 rounded-2xl font-bold text-lg shadow-md hover:bg-[#cce3de] transition disabled:opacity-60"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
            <LogIn className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-black text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-2 font-bold text-black underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
