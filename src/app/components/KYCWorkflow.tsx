import React, { useState } from 'react';
import { ShieldCheck, Smartphone, Camera, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function KYCWorkflow() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const nextStep = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(s => s + 1);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-full bg-white p-6 space-y-8">
      {/* Progress Header */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary-600' : 'bg-surface-100'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight m-0">Identity Check</h1>
              <p className="text-sm text-slate-500 font-medium">Verify your PAN details to unlock ₹1,00,000 monthly limit.</p>
            </div>
            
            <div className="bg-surface-50 border border-surface-100 p-6 rounded-3xl space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-primary-600 uppercase tracking-widest px-1">PAN Number</label>
                  <input 
                    type="text" 
                    placeholder="ABCDE1234F" 
                    className="w-full bg-white border border-surface-200 rounded-2xl px-4 py-4 text-sm font-bold tracking-[0.2em] focus:ring-2 focus:ring-primary-600 focus:outline-none placeholder:text-surface-300 placeholder:tracking-normal" 
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-primary-600 uppercase tracking-widest px-1">Date of Birth</label>
                  <input 
                    type="date" 
                    className="w-full bg-white border border-surface-200 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-600 focus:outline-none" 
                  />
               </div>
            </div>

            <button 
              onClick={nextStep}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify Identity <ArrowRight className="w-4 h-4" /></>}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2 text-center py-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                <Camera className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight m-0">Video KYC</h1>
              <p className="text-sm text-slate-500 font-medium px-4">Our agent will verify your details live. Keep your physical PAN ready.</p>
            </div>

            <div className="bg-slate-900 rounded-3xl aspect-[3/4] relative overflow-hidden flex items-center justify-center group shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
               <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest z-20 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Live Preview
               </div>
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full px-6 space-y-4">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white text-[10px] font-medium leading-relaxed">
                    💡 Tip: Ensure good lighting and a quiet background.
                  </div>
                  <button 
                    onClick={nextStep}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
                  >
                    Start Video Call
                  </button>
               </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex flex-col items-center justify-center space-y-8 pt-12 text-center"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-success-50 text-success-600 rounded-full flex items-center justify-center border-4 border-success-100 shadow-xl shadow-success-100/50">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ delay: 0.3 }}
                className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-surface-50"
              >
                <ShieldCheck className="w-6 h-6 text-primary-600" />
              </motion.div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-surface-800 tracking-tight m-0 uppercase">KYC SUCCESSFUL</h1>
              <p className="text-sm text-surface-500 font-bold px-8 leading-relaxed">
                Congratulations! Your account is now fully verified. You can now enjoy full banking benefits.
              </p>
            </div>

            <div className="w-full bg-surface-50 border border-surface-100 p-6 rounded-3xl grid grid-cols-2 gap-4">
               <div className="text-left space-y-0.5">
                  <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Monthly Limit</p>
                  <p className="text-lg font-black text-surface-800">₹1,00,000</p>
               </div>
               <div className="text-left space-y-0.5 border-l border-surface-200 pl-4">
                  <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">KYC Status</p>
                  <p className="text-lg font-black text-success-600">FULL</p>
               </div>
            </div>

            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-primary-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
