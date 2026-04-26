import React, { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, CheckCircle2, Search, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { getBalance, deductBalance, addTransaction, addNotification, progressQuest } from './walletUtils';

export function PaymentFlow() {
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState('input'); // input, confirm, pin, success
  const [walletBalance, setWalletBalance] = useState(0);
  const [txnId, setTxnId] = useState('');

  useEffect(() => {
    setWalletBalance(getBalance());
    const handleUpdate = () => setWalletBalance(getBalance());
    window.addEventListener('balanceUpdated', handleUpdate);
    return () => window.removeEventListener('balanceUpdated', handleUpdate);
  }, []);

  const handlePay = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    const payAmount = parseFloat(amount);
    if (payAmount > walletBalance) {
      toast.error(`Insufficient balance! Available: ₹${walletBalance.toLocaleString('en-IN')}`);
      return;
    }
    setStage('confirm');
  };

  const confirmPay = () => {
    setStage('pin');
  };

  const finalizePay = () => {
    const payAmount = parseFloat(amount);
    const result = deductBalance(payAmount);
    if (!result.success) {
      toast.error('Insufficient balance for this payment');
      return;
    }

    setWalletBalance(result.newBalance);

    const ref = `PS_${Date.now().toString().slice(-9)}`;
    setTxnId(ref);

    // Save transaction to history
    addTransaction({
      type: 'paid',
      serviceName: 'Scan & Pay',
      to: 'Krishna General Store',
      amount: payAmount,
      amountDisplay: `₹${payAmount.toLocaleString('en-IN')}`,
      category: 'scan',
      referenceNumber: ref,
      status: 'success',
    });

    // Add notification
    addNotification({
      title: 'Payment Successful',
      message: `₹${payAmount.toLocaleString('en-IN')} paid to Krishna General Store`,
      type: 'payment',
    });

    // Progress quests
    progressQuest('scan');

    setStage('success');
    toast.success('Payment Successful!');
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <AnimatePresence mode="wait">
        {stage === 'input' && (
          <motion.div 
            key="input" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="p-6 space-y-8"
          >
            <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-200 font-black text-xl">
                K
              </div>
              <div>
                <h2 className="font-black text-slate-800 tracking-tight leading-none mb-1">Krishna Store</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">krishna.gen@paysphere</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-12 space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Enter Amount</p>
               <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-slate-300">₹</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-48 bg-transparent border-none text-6xl font-black text-slate-900 focus:ring-0 text-center placeholder:text-slate-100"
                  />
               </div>
               <div className="bg-indigo-50 px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                 Paying from Wallet (₹{walletBalance.toLocaleString('en-IN')} available)
               </div>
               {amount && parseFloat(amount) > walletBalance && (
                 <motion.div 
                   initial={{ opacity: 0, y: -5 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex items-center gap-1.5 text-red-500 text-xs font-black"
                 >
                   <AlertTriangle className="w-3.5 h-3.5" />
                   Insufficient balance
                 </motion.div>
               )}
            </div>

            <div className="grid grid-cols-3 gap-3">
               {[1, 2, 5, 10, 20, 50].map(val => (
                 <button 
                  key={val} 
                  onClick={() => setAmount(String(val))}
                  className="bg-white border border-slate-200 py-3 rounded-2xl font-black text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                 >
                   +₹{val}
                 </button>
               ))}
            </div>

            <button 
              onClick={handlePay}
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance}
              className="w-full bg-indigo-600 text-white py-4 rounded-3xl font-black text-sm shadow-xl shadow-indigo-200 mt-auto active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              PROCEED TO PAY
            </button>
          </motion.div>
        )}

        {stage === 'confirm' && (
          <motion.div 
            key="confirm" 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="p-6 h-full flex flex-col"
          >
             <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl space-y-8 mt-auto">
                <div className="space-y-4 text-center">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Confirm Payment</p>
                   <h3 className="text-5xl font-black text-slate-900 tracking-tighter">₹{amount}</h3>
                </div>

                <div className="space-y-4 border-y border-slate-50 py-6">
                   <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">To</p>
                      <p className="text-sm font-black text-slate-800">Krishna General Store</p>
                   </div>
                   <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Method</p>
                      <p className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-indigo-600" /> Wallet
                      </p>
                   </div>
                   <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Balance After</p>
                      <p className="text-sm font-black text-emerald-600">₹{(walletBalance - parseFloat(amount)).toLocaleString('en-IN')}</p>
                   </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-3xl flex items-center gap-3 border border-blue-100">
                   <ShieldCheck className="w-6 h-6 text-blue-600" />
                   <p className="text-[10px] text-blue-900/70 font-bold leading-snug">
                     Your payment is protected by PaySphere Secure Shield.
                   </p>
                </div>

                <button 
                  onClick={confirmPay}
                  className="w-full bg-indigo-600 text-white py-4 rounded-3xl font-black text-sm shadow-xl active:scale-95 transition-all uppercase tracking-tight"
                >
                  Pay ₹{amount} Securely
                </button>
             </div>
          </motion.div>
        )}

        {stage === 'pin' && (
           <motion.div 
            key="pin" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="p-6 h-full flex flex-col items-center justify-center space-y-12"
          >
            <div className="text-center space-y-2">
              <ShieldCheck className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Security Check</h2>
              <p className="text-sm text-slate-500 font-medium">Use your device fingerprint to approve.</p>
            </div>

            <motion.button 
              onClick={finalizePay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-32 h-32 bg-indigo-50 border-4 border-indigo-200 rounded-full flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                 <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white rotate-45 shadow-lg">
                    <Smartphone className="w-6 h-6 -rotate-45" />
                 </div>
                 <motion.div 
                    animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full border-2 border-indigo-200"
                 />
              </div>
            </motion.button>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Biometric Approval...</p>
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div 
            key="success" 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="p-6 h-full flex flex-col items-center justify-center space-y-8 bg-green-600 text-white"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
               <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-black tracking-tight">PAYMENT SUCCESS</h2>
              <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">TXN ID: {txnId}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[40px] w-full space-y-4 border border-white/10">
               <div className="text-center">
                  <p className="text-xs font-bold text-white/60 uppercase mb-1">Paid to</p>
                  <h3 className="text-xl font-black">Krishna General Store</h3>
               </div>
               <div className="h-px bg-white/10 mx-4" />
               <div className="text-center">
                  <p className="text-xs font-bold text-white/60 uppercase mb-1">Amount</p>
                  <h3 className="text-4xl font-black tracking-tighter">₹{amount}</h3>
               </div>
               <div className="h-px bg-white/10 mx-4" />
               <div className="text-center">
                  <p className="text-xs font-bold text-white/60 uppercase mb-1">Remaining Balance</p>
                  <h3 className="text-lg font-black">₹{walletBalance.toLocaleString('en-IN')}</h3>
               </div>
            </div>

            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-white text-green-600 py-4 rounded-3xl font-black text-sm shadow-xl active:scale-95 transition-all"
            >
              Back to Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
