import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Landmark, CheckCircle, Loader, Lock, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { setBalance as setWalletBalance, getBalance, addTransaction, addNotification } from './walletUtils';

/* ─── Mock Linked Bank Accounts ─────────────────────────────────────────── */
const LINKED_BANKS = [
  { id: 'sbi',   name: 'State Bank of India',   masked: '●●●● ●●●● 4521', ifsc: 'SBIN0001234', color: 'bg-blue-600',   initial: 'SBI' },
  { id: 'hdfc',  name: 'HDFC Bank',             masked: '●●●● ●●●● 7832', ifsc: 'HDFC0002345', color: 'bg-red-600',    initial: 'HDFC' },
  { id: 'icici', name: 'ICICI Bank',            masked: '●●●● ●●●● 9014', ifsc: 'ICIC0003456', color: 'bg-orange-600', initial: 'ICICI' },
  { id: 'kotak', name: 'Kotak Mahindra Bank',   masked: '●●●● ●●●● 3267', ifsc: 'KKBK0004567', color: 'bg-purple-600', initial: 'KMB' },
];

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

interface AddMoneyFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

type Step = 'amount' | 'bank' | 'pin' | 'processing' | 'success';

export function AddMoneyFlow({ isOpen, onClose, onSuccess }: AddMoneyFlowProps) {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [pin, setPin] = useState('');
  const [refNumber, setRefNumber] = useState('');

  const reset = () => {
    setStep('amount');
    setAmount('');
    setSelectedBank('');
    setPin('');
    setRefNumber('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  /* Step progression */
  const goToBank = () => {
    const val = Number(amount);
    if (!amount || isNaN(val) || val < 1) {
      toast.error('Enter a valid amount (min ₹1)');
      return;
    }
    if (val > 100000) {
      toast.error('Maximum ₹1,00,000 per transaction');
      return;
    }
    setStep('bank');
  };

  const goToPin = () => {
    if (!selectedBank) {
      toast.error('Please select a bank account');
      return;
    }
    setStep('pin');
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) {
      toast.error('Enter your 4-digit UPI PIN');
      return;
    }
    setStep('processing');

    setTimeout(() => {
      const val = Number(amount);
      const newBal = getBalance() + val;
      setWalletBalance(newBal);

      const ref = `ADD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setRefNumber(ref);

      const bank = LINKED_BANKS.find(b => b.id === selectedBank)!;
      addTransaction({
        type: 'received',
        serviceName: 'Add Money',
        from: bank.name,
        amount: val,
        amountDisplay: `₹${val.toLocaleString('en-IN')}`,
        category: 'add-money',
        referenceNumber: ref,
        status: 'success',
      });

      addNotification({
        title: `₹${val.toLocaleString('en-IN')} Added`,
        message: `Money added from ${bank.name} (${bank.masked}). Ref: ${ref}`,
        type: 'payment',
      });

      setStep('success');
      onSuccess(val);
    }, 2000);
  };

  const stepNumber = step === 'amount' ? 1 : step === 'bank' ? 2 : step === 'pin' ? 3 : 3;
  const bank = LINKED_BANKS.find(b => b.id === selectedBank);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={handleClose}
    >
      <motion.div
        initial={{ y: 500, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 500, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md sm:shadow-xl max-h-[92vh] overflow-y-auto border-t-4 sm:border-2 border-surface-200"
      >
        {/* Header */}
        {step !== 'processing' && step !== 'success' && (
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="text-xl font-black text-surface-900 uppercase tracking-tight">Add Money</h2>
            <button onClick={handleClose} className="p-2 hover:bg-surface-100 rounded-full transition-colors text-surface-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {(step === 'amount' || step === 'bank' || step === 'pin') && (
          <div className="flex gap-2 px-5 pt-4 pb-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${stepNumber >= i ? 'bg-primary-600' : 'bg-surface-100'}`} />
            ))}
          </div>
        )}

        <div className="p-5 pt-3">
          <AnimatePresence mode="wait">
            {/* ─── Step 1: Amount ──────────────────────────────────────── */}
            {step === 'amount' && (
              <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Step 1 of 3</p>
                  <h3 className="text-lg font-black text-surface-900">Enter Amount</h3>
                  <p className="text-sm text-surface-500 font-medium">How much would you like to add?</p>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-surface-400">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0"
                    autoFocus
                    className="w-full pl-12 pr-4 py-5 border-2 border-surface-200 rounded-2xl focus:border-primary-600 focus:outline-none font-black text-3xl text-surface-900 bg-surface-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className="flex gap-2">
                  {QUICK_AMOUNTS.map(q => (
                    <button
                      key={q}
                      onClick={() => setAmount(String(q))}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black border-2 transition-all active:scale-95 ${
                        amount === String(q)
                          ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                          : 'bg-white text-surface-700 border-surface-200 hover:border-primary-300'
                      }`}
                    >
                      ₹{q.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={goToBank}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  Select Bank <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* ─── Step 2: Select Bank ────────────────────────────────── */}
            {step === 'bank' && (
              <motion.div key="bank" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Step 2 of 3</p>
                  <h3 className="text-lg font-black text-surface-900">Select Bank Account</h3>
                  <p className="text-sm text-surface-500 font-medium">Choose the account to debit ₹{Number(amount).toLocaleString('en-IN')} from</p>
                </div>

                <div className="space-y-3">
                  {LINKED_BANKS.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBank(b.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left active:scale-[0.98] ${
                        selectedBank === b.id
                          ? 'border-primary-600 bg-primary-50 shadow-md'
                          : 'border-surface-200 bg-white hover:border-surface-300'
                      }`}
                    >
                      <div className={`w-12 h-12 ${b.color} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                        <span className="text-white text-[10px] font-black tracking-wider">{b.initial}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-surface-900 truncate">{b.name}</p>
                        <p className="text-xs text-surface-500 font-bold">{b.masked}</p>
                        <p className="text-[10px] text-surface-400 font-medium mt-0.5">{b.ifsc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedBank === b.id ? 'border-primary-600 bg-primary-600' : 'border-surface-300'
                      }`}>
                        {selectedBank === b.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('amount')} className="flex-1 border-2 border-surface-300 text-surface-700 font-bold py-4 rounded-xl uppercase text-xs">
                    Back
                  </button>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={goToPin} className="flex-[2] bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide">
                    Continue
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ─── Step 3: UPI PIN ────────────────────────────────────── */}
            {step === 'pin' && (
              <motion.div key="pin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Step 3 of 3</p>
                  <h3 className="text-lg font-black text-surface-900">Enter UPI PIN</h3>
                  <p className="text-sm text-surface-500 font-medium">Authorize ₹{Number(amount).toLocaleString('en-IN')} from {bank?.name}</p>
                </div>

                {/* Summary card */}
                <div className="bg-surface-50 border border-surface-200 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-500 font-bold">Amount</span>
                    <span className="font-black text-surface-900">₹{Number(amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-500 font-bold">From</span>
                    <span className="font-black text-surface-900">{bank?.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-500 font-bold">Account</span>
                    <span className="font-black text-surface-900">{bank?.masked}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-500 font-bold">To</span>
                    <span className="font-black text-primary-600">PaySphere Wallet</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-center py-2">
                  <Lock className="w-4 h-4 text-surface-400" />
                  <span className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Secured by UPI</span>
                </div>

                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  placeholder="● ● ● ●"
                  autoFocus
                  className="w-full px-4 py-5 border-2 border-surface-200 rounded-2xl focus:border-primary-600 focus:outline-none font-black text-4xl text-center tracking-[0.5em] text-surface-900 bg-surface-50"
                />

                <div className="flex gap-3">
                  <button onClick={() => { setPin(''); setStep('bank'); }} className="flex-1 border-2 border-surface-300 text-surface-700 font-bold py-4 rounded-xl uppercase text-xs">
                    Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePinSubmit}
                    disabled={pin.length !== 4}
                    className="flex-[2] bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Pay ₹{Number(amount).toLocaleString('en-IN')}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ─── Processing ─────────────────────────────────────────── */}
            {step === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-lg font-black text-surface-900">Processing…</p>
                  <p className="text-sm text-surface-500 font-medium">Adding ₹{Number(amount).toLocaleString('en-IN')} to your wallet</p>
                </div>
              </motion.div>
            )}

            {/* ─── Success ────────────────────────────────────────────── */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-10 space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center border-4 border-success-200 shadow-xl"
                >
                  <CheckCircle className="w-14 h-14 text-success-600" />
                </motion.div>

                <div className="text-center space-y-1">
                  <h3 className="text-2xl font-black text-surface-900">₹{Number(amount).toLocaleString('en-IN')} Added!</h3>
                  <p className="text-sm text-surface-500 font-bold">Money added to your PaySphere wallet</p>
                </div>

                <div className="w-full bg-surface-50 border border-surface-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-surface-500 font-bold">Reference</span><span className="font-black text-primary-600">{refNumber}</span></div>
                  <div className="flex justify-between"><span className="text-surface-500 font-bold">From</span><span className="font-black text-surface-900">{bank?.name}</span></div>
                  <div className="flex justify-between"><span className="text-surface-500 font-bold">Account</span><span className="font-black text-surface-900">{bank?.masked}</span></div>
                  <div className="flex justify-between"><span className="text-surface-500 font-bold">New Balance</span><span className="font-black text-success-600">₹{getBalance().toLocaleString('en-IN')}</span></div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full bg-primary-900 text-white font-black py-4 rounded-xl uppercase tracking-wide active:scale-95 transition-all shadow-lg"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
