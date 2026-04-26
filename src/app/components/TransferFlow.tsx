import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, CheckCircle, Lock, Phone, Building2, User, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { getBalance, deductBalance, addTransaction, addNotification } from './walletUtils';

type RecipientMode = 'phone' | 'account';
type Step = 'recipient' | 'amount' | 'review' | 'pin' | 'processing' | 'success';

interface TransferFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export function TransferFlow({ isOpen, onClose, onSuccess }: TransferFlowProps) {
  const [step, setStep] = useState<Step>('recipient');
  const [mode, setMode] = useState<RecipientMode>('phone');

  // Recipient fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');

  // Amount
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // PIN
  const [pin, setPin] = useState('');
  const [refNumber, setRefNumber] = useState('');

  const reset = () => {
    setStep('recipient');
    setMode('phone');
    setPhoneNumber('');
    setAccountNumber('');
    setIfscCode('');
    setBeneficiaryName('');
    setAmount('');
    setNote('');
    setPin('');
    setRefNumber('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  /* ── Step handlers ─────────────────────────────────────────────────── */

  const goToAmount = () => {
    if (mode === 'phone') {
      const digits = phoneNumber.replace(/\D/g, '');
      if (digits.length !== 10) {
        toast.error('Enter a valid 10-digit phone number');
        return;
      }
    } else {
      if (!accountNumber.trim()) {
        toast.error('Enter the account number');
        return;
      }
      if (!ifscCode.trim()) {
        toast.error('Enter the IFSC code');
        return;
      }
      if (!beneficiaryName.trim()) {
        toast.error('Enter the beneficiary name');
        return;
      }
    }
    setStep('amount');
  };

  const goToReview = () => {
    const val = Number(amount);
    if (!amount || isNaN(val) || val < 1) {
      toast.error('Enter a valid amount (min ₹1)');
      return;
    }
    if (val > getBalance()) {
      toast.error(`Insufficient balance! Available: ₹${getBalance().toLocaleString('en-IN')}`);
      return;
    }
    setStep('review');
  };

  const goToPin = () => {
    setStep('pin');
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) {
      toast.error('Enter your 4-digit UPI PIN');
      return;
    }

    const val = Number(amount);
    const result = deductBalance(val);
    if (!result.success) {
      toast.error(`Insufficient balance! Available: ₹${getBalance().toLocaleString('en-IN')}`);
      setStep('amount');
      return;
    }

    setStep('processing');

    setTimeout(() => {
      const ref = `TRF${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setRefNumber(ref);

      const recipientLabel = mode === 'phone'
        ? `+91 ${phoneNumber}`
        : `${beneficiaryName} (${maskAccount(accountNumber)})`;

      addTransaction({
        type: 'transfer',
        serviceName: 'Money Transfer',
        to: recipientLabel,
        amount: val,
        amountDisplay: `₹${val.toLocaleString('en-IN')}`,
        category: 'transfer',
        referenceNumber: ref,
        status: 'success',
      });

      addNotification({
        title: `₹${val.toLocaleString('en-IN')} Transferred`,
        message: `Sent to ${recipientLabel}. Ref: ${ref}`,
        type: 'payment',
      });

      setStep('success');
      onSuccess(val);
    }, 2000);
  };

  const recipientLabel = mode === 'phone'
    ? `+91 ${phoneNumber}`
    : `${beneficiaryName}`;

  const stepNumber = step === 'recipient' ? 1 : step === 'amount' ? 2 : step === 'review' ? 3 : step === 'pin' ? 4 : 4;

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
            <h2 className="text-xl font-black text-surface-900 uppercase tracking-tight">Transfer Money</h2>
            <button onClick={handleClose} className="p-2 hover:bg-surface-100 rounded-full transition-colors text-surface-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {(step === 'recipient' || step === 'amount' || step === 'review' || step === 'pin') && (
          <div className="flex gap-2 px-5 pt-4 pb-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${stepNumber >= i ? 'bg-primary-600' : 'bg-surface-100'}`} />
            ))}
          </div>
        )}

        <div className="p-5 pt-3">
          <AnimatePresence mode="wait">
            {/* ─── Step 1: Recipient ──────────────────────────────────── */}
            {step === 'recipient' && (
              <motion.div key="recipient" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Step 1 of 4</p>
                  <h3 className="text-lg font-black text-surface-900">Recipient Details</h3>
                  <p className="text-sm text-surface-500 font-medium">Who are you sending money to?</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-surface-100 rounded-xl p-1">
                  <button
                    onClick={() => setMode('phone')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      mode === 'phone' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-500'
                    }`}
                  >
                    <Phone className="w-4 h-4" /> Phone Number
                  </button>
                  <button
                    onClick={() => setMode('account')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                      mode === 'account' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-500'
                    }`}
                  >
                    <Building2 className="w-4 h-4" /> Bank Account
                  </button>
                </div>

                {mode === 'phone' ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-surface-900 ml-1">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-surface-400">+91</span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        autoFocus
                        className="w-full pl-14 pr-4 py-4 border-2 border-surface-200 rounded-2xl focus:border-primary-600 focus:outline-none font-bold text-surface-900 bg-surface-50 tracking-wider"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-black text-surface-900 ml-1">
                        <User className="w-3.5 h-3.5 inline mr-1.5 text-primary-600" />Beneficiary Name
                      </label>
                      <input
                        type="text"
                        value={beneficiaryName}
                        onChange={e => setBeneficiaryName(e.target.value)}
                        placeholder="e.g., Amit Sharma"
                        autoFocus
                        className="w-full px-4 py-4 border-2 border-surface-200 rounded-2xl focus:border-primary-600 focus:outline-none font-bold text-surface-900 bg-surface-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-black text-surface-900 ml-1">
                        <Hash className="w-3.5 h-3.5 inline mr-1.5 text-primary-600" />Account Number
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g., 123456789012345"
                        className="w-full px-4 py-4 border-2 border-surface-200 rounded-2xl focus:border-primary-600 focus:outline-none font-bold text-surface-900 bg-surface-50 tracking-wider"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-black text-surface-900 ml-1">
                        <Building2 className="w-3.5 h-3.5 inline mr-1.5 text-primary-600" />IFSC Code
                      </label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={e => setIfscCode(e.target.value.toUpperCase().slice(0, 11))}
                        placeholder="e.g., HDFC0001234"
                        className="w-full px-4 py-4 border-2 border-surface-200 rounded-2xl focus:border-primary-600 focus:outline-none font-bold text-surface-900 bg-surface-50 uppercase tracking-wider"
                      />
                    </div>
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={goToAmount}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  Enter Amount <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* ─── Step 2: Amount ─────────────────────────────────────── */}
            {step === 'amount' && (
              <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Step 2 of 4</p>
                  <h3 className="text-lg font-black text-surface-900">Enter Amount</h3>
                  <p className="text-sm text-surface-500 font-medium">Sending to <span className="text-surface-900 font-black">{recipientLabel}</span></p>
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

                <p className="text-xs text-surface-400 font-bold text-center">
                  Available balance: <span className="text-surface-700">₹{getBalance().toLocaleString('en-IN')}</span>
                </p>

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

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-surface-500 ml-1">Add a note (optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="e.g., Dinner split"
                    className="w-full px-4 py-3 border-2 border-surface-200 rounded-2xl focus:border-primary-600 focus:outline-none font-medium text-sm text-surface-900 bg-surface-50"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('recipient')} className="flex-1 border-2 border-surface-300 text-surface-700 font-bold py-4 rounded-xl uppercase text-xs">
                    Back
                  </button>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={goToReview} className="flex-[2] bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide flex items-center justify-center gap-2">
                    Review <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ─── Step 3: Review ─────────────────────────────────────── */}
            {step === 'review' && (
              <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Step 3 of 4</p>
                  <h3 className="text-lg font-black text-surface-900">Review Transfer</h3>
                  <p className="text-sm text-surface-500 font-medium">Please confirm the details below</p>
                </div>

                <div className="bg-surface-50 border-2 border-surface-200 rounded-2xl p-5 space-y-4">
                  {/* Amount highlight */}
                  <div className="text-center py-3">
                    <p className="text-[10px] text-surface-400 font-black uppercase tracking-widest mb-1">Sending</p>
                    <p className="text-4xl font-black text-surface-900">₹{Number(amount).toLocaleString('en-IN')}</p>
                  </div>

                  <div className="border-t border-surface-200 pt-4 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-surface-500 font-bold">To</span>
                      <span className="font-black text-surface-900">{recipientLabel}</span>
                    </div>
                    {mode === 'account' && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-surface-500 font-bold">Account</span>
                          <span className="font-black text-surface-900">{maskAccount(accountNumber)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-surface-500 font-bold">IFSC</span>
                          <span className="font-black text-surface-900">{ifscCode}</span>
                        </div>
                      </>
                    )}
                    {note && (
                      <div className="flex justify-between text-xs">
                        <span className="text-surface-500 font-bold">Note</span>
                        <span className="font-bold text-surface-700 italic">"{note}"</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-surface-500 font-bold">Debit From</span>
                      <span className="font-black text-primary-600">PaySphere Wallet</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('amount')} className="flex-1 border-2 border-surface-300 text-surface-700 font-bold py-4 rounded-xl uppercase text-xs">
                    Back
                  </button>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={goToPin} className="flex-[2] bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide">
                    Confirm & Pay
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ─── Step 4: UPI PIN ────────────────────────────────────── */}
            {step === 'pin' && (
              <motion.div key="pin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Step 4 of 4</p>
                  <h3 className="text-lg font-black text-surface-900">Enter UPI PIN</h3>
                  <p className="text-sm text-surface-500 font-medium">Authorize ₹{Number(amount).toLocaleString('en-IN')} to {recipientLabel}</p>
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
                  <button onClick={() => { setPin(''); setStep('review'); }} className="flex-1 border-2 border-surface-300 text-surface-700 font-bold py-4 rounded-xl uppercase text-xs">
                    Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePinSubmit}
                    disabled={pin.length !== 4}
                    className="flex-[2] bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Send ₹{Number(amount).toLocaleString('en-IN')}
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
                  <p className="text-sm text-surface-500 font-medium">Sending ₹{Number(amount).toLocaleString('en-IN')} to {recipientLabel}</p>
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
                  <h3 className="text-2xl font-black text-surface-900">₹{Number(amount).toLocaleString('en-IN')} Sent!</h3>
                  <p className="text-sm text-surface-500 font-bold">Successfully transferred to {recipientLabel}</p>
                </div>

                <div className="w-full bg-surface-50 border border-surface-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-surface-500 font-bold">Reference</span><span className="font-black text-primary-600">{refNumber}</span></div>
                  <div className="flex justify-between"><span className="text-surface-500 font-bold">To</span><span className="font-black text-surface-900">{recipientLabel}</span></div>
                  {mode === 'account' && (
                    <div className="flex justify-between"><span className="text-surface-500 font-bold">Account</span><span className="font-black text-surface-900">{maskAccount(accountNumber)}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-surface-500 font-bold">Amount</span><span className="font-black text-surface-900">₹{Number(amount).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-surface-500 font-bold">Balance</span><span className="font-black text-success-600">₹{getBalance().toLocaleString('en-IN')}</span></div>
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

/** Masks an account number, showing only last 4 digits */
function maskAccount(acc: string): string {
  if (acc.length <= 4) return acc;
  return '●●●● ●●●● ' + acc.slice(-4);
}
