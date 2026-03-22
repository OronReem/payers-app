import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, ChevronLeft, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Firebase requires an email, so we derive one silently from the username.
// Users never see or type an email — only their username and password.
const toEmail = (username) => `${username.toLowerCase().replace(/\s+/g, '_')}@payers.local`;

const Login = () => {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('Please enter a username.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const syntheticEmail = toEmail(username);
      if (isLogin) {
        await login(syntheticEmail, password);
      } else {
        await signup(username, syntheticEmail, password);
      }
      navigate('/scan');
    } catch (err) {
      // Give friendly messages for the most common Firebase auth errors
      const code = err.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Incorrect username or password.');
      } else if (code === 'auth/email-already-in-use') {
        setError('That username is already taken. Try a different one or log in.');
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Check your connection and try again.');
      } else {
        setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim() || 'Something went wrong.');
      }
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
          {/* Username */}
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
              autoComplete="username"
              className="w-full pl-12 pr-4 py-4 bg-[#f0f7f4] border border-gray-200 rounded-2xl outline-none focus:border-[#a4c3b2] transition text-black"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-black" />
            </div>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="w-full pl-12 pr-12 py-4 bg-[#f0f7f4] border border-gray-200 rounded-2xl outline-none focus:border-[#a4c3b2] transition text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-black hover:text-[#a4c3b2] transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

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
              onClick={() => { setIsLogin(!isLogin); setError(''); setShowPassword(false); }}
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
