import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Wallet, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate dummy authentication delay
    setTimeout(() => {
      // Dummy user id
      localStorage.setItem('currentUser', '1');
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center items-center px-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-surface-200"
      >
        <div className="bg-primary-600 p-8 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Wallet className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to PaySphere</h1>
            <p className="text-primary-100 text-sm">Log in to manage your finances securely.</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter dummy email (e.g., test@example.com)"
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-surface-900 transition-shadow"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter dummy password"
                className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-surface-900 transition-shadow"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl shadow-md disabled:opacity-70 transition-all flex justify-center items-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Secure Login</span>
                </>
              )}
            </button>
            <p className="text-xs text-center text-surface-500 mt-4">
              This is a dummy login. Any credentials will work.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
