import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, CheckCircle, Clock, AlertCircle, Eye, EyeOff,
  Send, Smartphone, Zap, CreditCard, Receipt, ShoppingBag, 
  Wifi, TrendingUp, FileText, DollarSign, Lock, Loader
} from 'lucide-react';
import { toast } from 'sonner';
import { ServicesSection } from './ServicesSection';
import { deductBalance, addTransaction, addNotification, progressQuest } from './walletUtils';

interface ServicePayment {
  serviceId: string;
  serviceName: string;
  provider?: string;
  amount?: string;
  billNo?: string;
  timestamp?: string;
}

export function ServicePayments() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [stage, setStage] = useState<'services' | 'form' | 'confirm' | 'otp' | 'success'>('services');
  const [formData, setFormData] = useState<ServicePayment>({ serviceId: '', serviceName: '' });
  const [amount, setAmount] = useState('');
  const [billNo, setBillNo] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const serviceDetails: Record<string, any> = {
    mobile: {
      name: 'Mobile Recharge',
      placeholder: 'Enter mobile number',
      billPlaceholder: 'Enter 10-digit number',
      minAmount: 10,
      maxAmount: 1500,
      providers: ['Airtel', 'Vi', 'Jio', 'BSNL']
    },
    electricity: {
      name: 'Electricity Bill',
      placeholder: 'Enter bill reference',
      billPlaceholder: 'Enter consumer ID',
      minAmount: 100,
      maxAmount: 50000,
      providers: ['MSEB', 'BESCOM', 'TSSPDCL']
    },
    creditcard: {
      name: 'Credit Card Payment',
      placeholder: 'Enter card last 4 digits',
      billPlaceholder: 'Enter 16-digit number',
      minAmount: 100,
      maxAmount: 500000,
      providers: ['HDFC', 'ICIC', 'SBI', 'Axis']
    },
    dth: {
      name: 'DTH Recharge',
      placeholder: 'Enter subscriber ID',
      billPlaceholder: 'Enter 10-12 digit ID',
      minAmount: 100,
      maxAmount: 5000,
      providers: ['Dish TV', 'Tata Sky', 'Sun Direct']
    },
    fastag: {
      name: 'FASTag Recharge',
      placeholder: 'Enter FASTag ID',
      billPlaceholder: 'Enter 16-digit tag number',
      minAmount: 100,
      maxAmount: 10000,
      providers: ['ICIC', 'HDFC', 'SBI', 'Axis']
    },
    gas: {
      name: 'Cooking Gas',
      placeholder: 'Enter consumer ID',
      billPlaceholder: 'Enter customer code',
      minAmount: 500,
      maxAmount: 50000,
      providers: ['Indraprastha', 'Bhatnagar', 'HP Gas']
    },
    broadband: {
      name: 'Broadband Bill',
      placeholder: 'Enter account number',
      billPlaceholder: 'Enter subscriber ID',
      minAmount: 200,
      maxAmount: 5000,
      providers: ['Airtel Fiber', 'Jio Fiber', 'ACT']
    },
    loans: {
      name: 'Loan Payment',
      placeholder: 'Enter loan account',
      billPlaceholder: 'Enter loan ID',
      minAmount: 500,
      maxAmount: 500000,
      providers: ['HDFC Bank', 'ICIC Bank', 'Axis Bank']
    }
  };

  const handleServiceSelect = (serviceId: string, serviceName: string) => {
    setSelectedService(serviceId);
    setFormData({ serviceId, serviceName });
    setStage('form');
  };

  const handleSubmitForm = () => {
    if (!billNo.trim()) {
      toast.error('Please enter bill/reference number');
      return;
    }
    if (!amount || parseFloat(amount) < (serviceDetails[selectedService!]?.minAmount || 0)) {
      toast.error(`Minimum amount: ₹${serviceDetails[selectedService!]?.minAmount}`);
      return;
    }
    setStage('confirm');
  };

  const handleConfirm = () => {
    setStage('otp');
  };

  const handleSubmitOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const deductionAmount = parseFloat(amount);
      const result = deductBalance(deductionAmount);
      
      if (result.success) {
        const ref = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        addTransaction({
          type: 'bill',
          serviceName: formData.serviceName,
          to: formData.serviceName,
          amount: deductionAmount,
          amountDisplay: `₹${deductionAmount.toLocaleString('en-IN')}`,
          category: formData.serviceId,
          referenceNumber: ref,
          status: 'success',
        });

        addNotification({
          title: `${formData.serviceName} — ₹${deductionAmount.toLocaleString('en-IN')}`,
          message: `Payment successful. Ref: ${ref}`,
          type: 'payment',
        });

        progressQuest(formData.serviceId);

        setStage('success');
        toast.success('Payment Successful!');
      } else {
        toast.error('Insufficient balance!');
      }
    }, 2000);
  };

  const handleReset = () => {
    setSelectedService(null);
    setStage('services');
    setFormData({ serviceId: '', serviceName: '' });
    setAmount('');
    setBillNo('');
    setOtp('');
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-surface-50 to-primary-50 p-4">
      <AnimatePresence mode="wait">
        {/* Services Selection Screen */}
        {stage === 'services' && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto space-y-6"
          >
            <div>
              <h1 className="text-2xl font-black text-surface-900 mb-2">Service Payments</h1>
              <p className="text-surface-600 font-bold">Select a service to pay</p>
            </div>
            <ServicesSection />
          </motion.div>
        )}

        {/* Payment Form Screen */}
        {stage === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md mx-auto space-y-6"
          >
            <button
              onClick={() => setStage('services')}
              className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="bg-white p-6 rounded-3xl shadow-lg border border-surface-100">
              <h2 className="text-2xl font-black text-surface-900 mb-6">{formData.serviceName}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-surface-700 mb-2">Reference/Bill Number</label>
                  <input
                    type="text"
                    placeholder={serviceDetails[selectedService!]?.billPlaceholder}
                    value={billNo}
                    onChange={(e) => setBillNo(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-surface-200 rounded-xl focus:border-primary-600 focus:outline-none font-bold text-surface-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-surface-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder={`Min: ₹${serviceDetails[selectedService!]?.minAmount}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={serviceDetails[selectedService!]?.minAmount}
                    max={serviceDetails[selectedService!]?.maxAmount}
                    className="w-full px-4 py-3 border-2 border-surface-200 rounded-xl focus:border-primary-600 focus:outline-none font-black text-surface-900 text-lg"
                  />
                  <p className="text-xs text-surface-500 mt-1 font-bold">
                    Max: ₹{serviceDetails[selectedService!]?.maxAmount}
                  </p>
                </div>

                {serviceDetails[selectedService!]?.providers && (
                  <div>
                    <label className="block text-sm font-bold text-surface-700 mb-2">Provider</label>
                    <select className="w-full px-4 py-3 border-2 border-surface-200 rounded-xl focus:border-primary-600 focus:outline-none font-bold text-surface-900 bg-white">
                      {serviceDetails[selectedService!].providers.map((p: string) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitForm}
                className="w-full mt-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl hover:shadow-lg transition-all active:scale-95 uppercase tracking-wide"
              >
                Continue to Review
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Confirmation Screen */}
        {stage === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md mx-auto space-y-6"
          >
            <button
              onClick={() => setStage('form')}
              className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div className="bg-white p-6 rounded-3xl shadow-lg border border-surface-100 space-y-6">
              <h2 className="text-2xl font-black text-surface-900">Confirm Payment</h2>

              <div className="space-y-3 bg-surface-50 p-4 rounded-2xl">
                <div className="flex justify-between">
                  <span className="text-surface-600 font-bold">Service</span>
                  <span className="text-surface-900 font-black">{formData.serviceName}</span>
                </div>
                <div className="border-t border-surface-200 pt-3 flex justify-between">
                  <span className="text-surface-600 font-bold">Reference</span>
                  <span className="text-surface-900 font-mono font-black">{billNo}</span>
                </div>
                <div className="border-t border-surface-200 pt-3 flex justify-between">
                  <span className="text-surface-600 font-bold">Amount</span>
                  <span className="text-2xl font-black text-primary-600">₹{amount}</span>
                </div>
              </div>

              <div className="bg-primary-50 border-2 border-primary-200 p-4 rounded-xl flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <p className="text-sm text-primary-700 font-bold">Your payment is encrypted and secure</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl hover:shadow-lg transition-all active:scale-95 uppercase tracking-wide"
              >
                Proceed to OTP
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* OTP Verification Screen */}
        {stage === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto space-y-6"
          >
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-surface-100 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-surface-900 mb-2">Verify Payment</h2>
                <p className="text-surface-600 font-bold">Enter the 6-digit OTP sent to your phone</p>
              </div>

              <div className="relative">
                <input
                  type={showOtp ? 'text' : 'password'}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="w-full px-4 py-4 border-2 border-surface-200 rounded-xl focus:border-primary-600 focus:outline-none font-black text-3xl text-center tracking-widest text-surface-900"
                />
                <button
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-700 transition-colors"
                >
                  {showOtp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl hover:shadow-lg transition-all active:scale-95 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Verify & Pay
                  </>
                )}
              </motion.button>

              <p className="text-xs text-surface-500 text-center font-bold">
                Didn't receive OTP? <button className="text-primary-600 hover:underline font-black">Resend</button>
              </p>
            </div>
          </motion.div>
        )}

        {/* Success Screen */}
        {stage === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto space-y-6"
          >
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-surface-100 space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto shadow-lg"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-black text-surface-900 mb-1">Payment Successful!</h2>
                <p className="text-surface-600 font-bold">Your payment has been processed</p>
              </div>

              <div className="bg-surface-50 p-4 rounded-2xl space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-surface-600 font-bold">Service</span>
                  <span className="text-surface-900 font-black">{formData.serviceName}</span>
                </div>
                <div className="border-t border-surface-200 pt-3 flex justify-between">
                  <span className="text-surface-600 font-bold">Amount Paid</span>
                  <span className="text-2xl font-black text-success-600">₹{amount}</span>
                </div>
                <div className="border-t border-surface-200 pt-3 flex justify-between">
                  <span className="text-surface-600 font-bold">Transaction ID</span>
                  <span className="text-surface-900 font-mono text-sm font-black uppercase">TXN20260416{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <div className="border-t border-surface-200 pt-3 flex justify-between">
                  <span className="text-surface-600 font-bold">Status</span>
                  <div className="flex items-center gap-1 text-success-600 font-black">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl hover:shadow-lg transition-all active:scale-95 uppercase tracking-wide"
                >
                  Make Another Payment
                </motion.button>
                <button className="w-full border-2 border-surface-200 text-surface-700 font-black py-3 rounded-xl hover:bg-surface-50 transition-colors active:scale-95 uppercase text-xs tracking-wide">
                  Download Receipt
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
