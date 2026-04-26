import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, Clock, Phone, Zap, CreditCard, Wifi, TrendingUp, FileText, DollarSign, Eye, ShoppingBag, Send, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { getBalance, deductBalance, addTransaction, addNotification, progressQuest } from './walletUtils';
import { getElectricityBill, getCreditCards, getFastagInfo, getGasBill, getBroadbandBill, getLoans } from './serviceBillData';
import { ElectricityBillView, CreditCardView, FastagView, GasBillView, BroadbandView, LoanView } from './ServiceBillViews';
interface ServiceFlow {
  serviceId: string;
  serviceName: string;
  icon: React.ReactNode;
  steps: FlowStep[];
  successMessage: string;
}

interface FlowStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  action?: (data: any) => Promise<any>;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: (value: string) => boolean;
}

interface TransactionRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  amount: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
  referenceNumber: string;
  details: any;
}

const SERVICE_FLOWS: Record<string, ServiceFlow> = {
  mobile: {
    serviceId: 'mobile',
    serviceName: 'Mobile Recharge',
    icon: <Phone className="w-6 h-6" />,
    steps: [
      {
        id: 'phone_number',
        title: 'Enter Mobile Number',
        description: 'Enter the 10-digit mobile number to recharge',
        fields: [
          {
            name: 'mobile_number',
            label: 'Mobile Number',
            type: 'text',
            placeholder: '98765 43210',
            required: true,
            validation: (val) => val.replace(/\D/g, '').length === 10,
          },
        ],
      },
      {
        id: 'operator_selection',
        title: 'Select Operator',
        description: 'Choose your mobile service provider',
        fields: [
          {
            name: 'operator',
            label: 'Operator',
            type: 'select',
            required: true,
            options: [
              { label: 'Airtel', value: 'airtel' },
              { label: 'Jio', value: 'jio' },
              { label: 'Vi', value: 'vi' },
              { label: 'BSNL', value: 'bsnl' },
            ],
          },
        ],
      },
      {
        id: 'plan_selection',
        title: 'Select Recharge Plan',
        description: 'Choose your recharge amount',
        fields: [
          {
            name: 'plan',
            label: 'Plan',
            type: 'select',
            required: true,
            options: [
              { label: '₹99 - 4GB Data', value: '99' },
              { label: '₹199 - 10GB Data', value: '199' },
              { label: '₹299 - 20GB Data', value: '299' },
              { label: '₹499 - 50GB Data', value: '499' },
            ],
          },
        ],
      },
      {
        id: 'payment',
        title: 'Confirm Payment',
        description: 'Review and confirm your recharge',
        fields: [],
      },
    ],
    successMessage: 'Mobile recharge successful! Your balance will be updated shortly.',
  },

  electricity: {
    serviceId: 'electricity',
    serviceName: 'Electricity Bill',
    icon: <Zap className="w-6 h-6" />,
    steps: [
      {
        id: 'customer_id',
        title: 'Enter Consumer ID',
        description: 'Enter your electricity consumer ID',
        fields: [
          {
            name: 'consumer_id',
            label: 'Consumer ID',
            type: 'text',
            placeholder: 'e.g., 123456789',
            required: true,
          },
        ],
      },
      {
        id: 'bill_details',
        title: 'Bill Details',
        description: 'Your bill information',
        fields: [],
      },
      {
        id: 'payment',
        title: 'Confirm Payment',
        description: 'Confirm your bill payment',
        fields: [],
      },
    ],
    successMessage: 'Electricity bill paid successfully! Receipt has been sent to your registered email.',
  },

  creditcard: {
    serviceId: 'creditcard',
    serviceName: 'Credit Card Payment',
    icon: <CreditCard className="w-6 h-6" />,
    steps: [
      {
        id: 'card_number',
        title: 'Enter Card Number',
        description: 'Enter your credit card number',
        fields: [
          {
            name: 'card_number',
            label: 'Card Number (Last 4 Digits)',
            type: 'text',
            placeholder: 'XXXX XXXX XXXX',
            required: true,
            validation: (val) => val.replace(/\D/g, '').length === 4,
          },
        ],
      },
      {
        id: 'card_details',
        title: 'Card Details',
        description: 'Your outstanding balance',
        fields: [],
      },
      {
        id: 'payment_amount',
        title: 'Select Payment Amount',
        description: 'Choose payment option',
        fields: [
          {
            name: 'payment_type',
            label: 'Payment Type',
            type: 'select',
            required: true,
            options: [
              { label: 'Minimum Amount (₹2,500)', value: 'minimum' },
              { label: 'Full Amount (₹8,450)', value: 'full' },
              { label: 'Custom Amount', value: 'custom' },
            ],
          },
        ],
      },
      {
        id: 'payment',
        title: 'Confirm Payment',
        description: 'Complete your payment',
        fields: [],
      },
    ],
    successMessage: 'Credit card payment processed successfully!',
  },

  dth: {
    serviceId: 'dth',
    serviceName: 'DTH Recharge',
    icon: <Eye className="w-6 h-6" />,
    steps: [
      {
        id: 'subscriber_id',
        title: 'Enter Subscriber ID',
        description: 'Enter your DTH subscriber ID',
        fields: [
          {
            name: 'subscriber_id',
            label: 'Subscriber ID',
            type: 'text',
            placeholder: 'e.g., 8765432100',
            required: true,
          },
        ],
      },
      {
        id: 'provider',
        title: 'Select Provider',
        description: 'Choose your DTH provider',
        fields: [
          {
            name: 'provider',
            label: 'Provider',
            type: 'select',
            required: true,
            options: [
              { label: 'Dish TV', value: 'dish' },
              { label: 'Tata Sky', value: 'tata' },
              { label: 'sun Direct', value: 'sun' },
            ],
          },
        ],
      },
      {
        id: 'package',
        title: 'Select Package',
        description: 'Choose your subscription package',
        fields: [
          {
            name: 'package',
            label: 'Package',
            type: 'select',
            required: true,
            options: [
              { label: 'Basic - ₹249', value: '249' },
              { label: 'Popular - ₹449', value: '449' },
              { label: 'Premium - ₹799', value: '799' },
            ],
          },
        ],
      },
      {
        id: 'payment',
        title: 'Confirm Payment',
        description: 'Complete your DTH recharge',
        fields: [],
      },
    ],
    successMessage: 'DTH subscription renewed successfully for 1 month!',
  },

  fastag: {
    serviceId: 'fastag',
    serviceName: 'FASTag Recharge',
    icon: <ShoppingBag className="w-6 h-6" />,
    steps: [
      {
        id: 'vehicle_number',
        title: 'Enter Vehicle Number',
        description: 'Enter your vehicle registration number',
        fields: [
          {
            name: 'vehicle_number',
            label: 'Vehicle Number',
            type: 'text',
            placeholder: 'e.g., MH 05 AB 1234',
            required: true,
          },
        ],
      },
      {
        id: 'fastag_details',
        title: 'FASTag Details',
        description: 'Your FASTag balance information',
        fields: [],
      },
      {
        id: 'recharge_amount',
        title: 'Enter Recharge Amount',
        description: 'Add balance to your FASTag',
        fields: [
          {
            name: 'amount',
            label: 'Recharge Amount (₹)',
            type: 'number',
            placeholder: 'e.g., 500',
            required: true,
            validation: (val) => parseInt(val) >= 100 && parseInt(val) <= 10000,
          },
        ],
      },
      {
        id: 'payment',
        title: 'Confirm Payment',
        description: 'Complete FASTag recharge',
        fields: [],
      },
    ],
    successMessage: 'FASTag recharge completed! Balance updated successfully.',
  },

  gas: {
    serviceId: 'gas',
    serviceName: 'Gas Booking',
    icon: <Zap className="w-6 h-6" />,
    steps: [
      {
        id: 'consumer_id',
        title: 'Enter Consumer Number',
        description: 'Enter your LPG consumer registration number',
        fields: [
          {
            name: 'consumer_id',
            label: 'Consumer Number',
            type: 'text',
            placeholder: 'e.g., 12345678',
            required: true,
          },
        ],
      },
      {
        id: 'delivery_slot',
        title: 'Select Delivery Slot',
        description: 'Choose your preferred delivery date',
        fields: [
          {
            name: 'delivery_date',
            label: 'Delivery Date',
            type: 'date',
            required: true,
          },
          {
            name: 'delivery_slot',
            label: 'Delivery Slot',
            type: 'select',
            required: true,
            options: [
              { label: '8:00 AM - 12:00 PM', value: 'morning' },
              { label: '12:00 PM - 4:00 PM', value: 'afternoon' },
              { label: '4:00 PM - 8:00 PM', value: 'evening' },
            ],
          },
        ],
      },
      {
        id: 'payment',
        title: 'Confirm Booking',
        description: 'Complete your gas booking',
        fields: [],
      },
    ],
    successMessage: 'Gas cylinder booked successfully! Expected delivery: 2-4 hours.',
  },

  broadband: {
    serviceId: 'broadband',
    serviceName: 'Broadband Bill',
    icon: <Wifi className="w-6 h-6" />,
    steps: [
      {
        id: 'account_number',
        title: 'Enter Account Number',
        description: 'Enter your broadband account number',
        fields: [
          {
            name: 'account_number',
            label: 'Account/Customer ID',
            type: 'text',
            placeholder: 'e.g., BB1234567',
            required: true,
          },
        ],
      },
      {
        id: 'bill_details',
        title: 'Bill Details',
        description: 'Your broadband bill information',
        fields: [],
      },
      {
        id: 'payment',
        title: 'Confirm Payment',
        description: 'Complete your broadband bill payment',
        fields: [],
      },
    ],
    successMessage: 'Broadband bill paid successfully!',
  },

  loans: {
    serviceId: 'loans',
    serviceName: 'Loan Payment',
    icon: <TrendingUp className="w-6 h-6" />,
    steps: [
      {
        id: 'loan_account',
        title: 'Enter Loan Account ID',
        description: 'Enter your loan account number',
        fields: [
          {
            name: 'loan_id',
            label: 'Loan Account ID',
            type: 'text',
            placeholder: 'e.g., LOAN123456',
            required: true,
          },
        ],
      },
      {
        id: 'emi_details',
        title: 'EMI Details',
        description: 'Your EMI information',
        fields: [],
      },
      {
        id: 'payment',
        title: 'Confirm EMI Payment',
        description: 'Complete your EMI payment',
        fields: [],
      },
    ],
    successMessage: 'Loan EMI paid successfully!',
  },

  insurance: {
    serviceId: 'insurance',
    serviceName: 'Insurance Premium',
    icon: <FileText className="w-6 h-6" />,
    steps: [
      {
        id: 'policy_number',
        title: 'Enter Policy Number',
        description: 'Enter your insurance policy number',
        fields: [
          {
            name: 'policy_number',
            label: 'Policy Number',
            type: 'text',
            placeholder: 'e.g., POL123456789',
            required: true,
          },
        ],
      },
      {
        id: 'premium_details',
        title: 'Premium Details',
        description: 'Your insurance premium information',
        fields: [],
      },
      {
        id: 'payment',
        title: 'Confirm Premium Payment',
        description: 'Complete your premium payment',
        fields: [],
      },
    ],
    successMessage: 'Insurance premium paid successfully! Policy renewed.',
  },

  investments: {
    serviceId: 'investments',
    serviceName: 'Mutual Fund Investment',
    icon: <DollarSign className="w-6 h-6" />,
    steps: [
      {
        id: 'fund_selection',
        title: 'Select Mutual Fund',
        description: 'Choose your preferred mutual fund',
        fields: [
          {
            name: 'fund',
            label: 'Fund',
            type: 'select',
            required: true,
            options: [
              { label: 'Liquid Fund - 5.2% Returns', value: 'liquid' },
              { label: 'ELSS Fund - 12.5% Returns', value: 'elss' },
              { label: 'Balanced Fund - 10.8% Returns', value: 'balanced' },
            ],
          },
        ],
      },
      {
        id: 'investment_amount',
        title: 'Enter Investment Amount',
        description: 'Specify your investment amount',
        fields: [
          {
            name: 'amount',
            label: 'Investment Amount (₹)',
            type: 'number',
            placeholder: 'Minimum ₹500',
            required: true,
            validation: (val) => parseInt(val) >= 500,
          },
        ],
      },
      {
        id: 'payment',
        title: 'Confirm Investment',
        description: 'Complete your investment',
        fields: [],
      },
    ],
    successMessage: 'Investment successful! Units added to your portfolio.',
  },

  demandraft: {
    serviceId: 'demandraft',
    serviceName: 'Demand Draft',
    icon: <FileText className="w-6 h-6" />,
    steps: [
      {
        id: 'beneficiary_details',
        title: 'Beneficiary Details',
        description: 'Enter beneficiary information',
        fields: [
          {
            name: 'beneficiary_name',
            label: 'Beneficiary Name',
            type: 'text',
            placeholder: 'Full name',
            required: true,
          },
          {
            name: 'bank_branch',
            label: 'Bank Branch',
            type: 'text',
            placeholder: 'e.g., Mumbai Main Branch',
            required: true,
          },
          {
            name: 'payable_city',
            label: 'Payable City',
            type: 'text',
            placeholder: 'e.g., Mumbai',
            required: true,
          },
          {
            name: 'dd_amount',
            label: 'DD Amount (₹)',
            type: 'number',
            placeholder: 'e.g., 50000',
            required: true,
          },
        ],
      },
      {
        id: 'payment_mode',
        title: 'Select Payment Mode',
        description: 'Choose how to fund the DD',
        fields: [
          {
            name: 'payment_mode',
            label: 'Payment Mode',
            type: 'select',
            required: true,
            options: [
              { label: 'Debit from Account', value: 'account' },
              { label: 'Cash Deposit', value: 'cash' },
            ],
          },
        ],
      },
      {
        id: 'confirmation',
        title: 'Confirm DD Request',
        description: 'Review and confirm demand draft',
        fields: [],
      },
    ],
    successMessage: 'Demand Draft issued successfully! You can collect it from your branch in 24 hours.',
  },

  neft: {
    serviceId: 'neft',
    serviceName: 'NEFT Transfer',
    icon: <Send className="w-6 h-6" />,
    steps: [
      {
        id: 'beneficiary_info',
        title: 'Beneficiary Information',
        description: 'Enter beneficiary bank details',
        fields: [
          {
            name: 'beneficiary_name',
            label: 'Beneficiary Name',
            type: 'text',
            placeholder: 'Full name',
            required: true,
          },
          {
            name: 'account_number',
            label: 'Account Number',
            type: 'text',
            placeholder: 'e.g., 123456789012345',
            required: true,
          },
          {
            name: 'ifsc_code',
            label: 'IFSC Code',
            type: 'text',
            placeholder: 'e.g., HDFC0001234',
            required: true,
          },
          {
            name: 'bank_name',
            label: 'Bank Name',
            type: 'text',
            placeholder: 'e.g., HDFC Bank',
            required: true,
          },
        ],
      },
      {
        id: 'transfer_amount',
        title: 'Enter Transfer Amount',
        description: 'Specify the amount to transfer',
        fields: [
          {
            name: 'transfer_amount',
            label: 'Transfer Amount (₹)',
            type: 'number',
            placeholder: 'e.g., 50000',
            required: true,
            validation: (val) => parseInt(val) > 0,
          },
        ],
      },
      {
        id: 'payment_method',
        title: 'Select Payment Method',
        description: 'Choose your preferred payment method',
        fields: [
          {
            name: 'payment_method',
            label: 'Payment Method',
            type: 'select',
            required: true,
            options: [
              { label: 'Debit from Account', value: 'account' },
              { label: 'UPI', value: 'upi' },
              { label: 'Net Banking', value: 'netbanking' },
            ],
          },
        ],
      },
      {
        id: 'review',
        title: 'Review Transfer',
        description: 'Confirm transfer details',
        fields: [],
      },
    ],
    successMessage: 'NEFT transfer initiated successfully! Amount will reach within 2 hours.',
  },
};

interface ServiceFlowEngineProps {
  serviceId: string;
  onClose: () => void;
}

export function ServiceFlowEngine({ serviceId, onClose }: ServiceFlowEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'flow' | 'success'>('flow');
  const [transactionRef, setTransactionRef] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');

  const flow = SERVICE_FLOWS[serviceId];
  if (!flow) return null;

  const step = flow.steps[currentStep];
  const isLastStep = currentStep === flow.steps.length - 1;

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const validateStep = (): boolean => {
    for (const field of step.fields) {
      if (field.required && !formData[field.name]) {
        toast.error(`${field.label} is required`);
        return false;
      }
      if (field.validation && formData[field.name]) {
        if (!field.validation(formData[field.name])) {
          toast.error(`${field.label} is invalid`);
          return false;
        }
      }
    }
    return true;
  };

  const handleStepComplete = () => {
    if (!validateStep()) return;

    if (isLastStep) {
      handleFinalPayment();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinalPayment = async () => {
    setShowOtp(true);
  };

  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }

    const extractAmount = () => {
      if (formData['amount']) return parseFloat(formData['amount']);
      if (formData['transfer_amount']) return parseFloat(formData['transfer_amount']);
      if (formData['dd_amount']) return parseFloat(formData['dd_amount']);
      if (formData['plan']) return parseFloat(formData['plan']);
      if (formData['package']) return parseFloat(formData['package']);
      if (serviceId === 'electricity') return getElectricityBill(formData['consumer_id']).totalDue;
      if (serviceId === 'gas') return getGasBill(formData['consumer_id'], formData['delivery_slot'] ? 'LPG' : 'PNG').totalDue;
      if (serviceId === 'creditcard') {
        const cards = getCreditCards();
        return formData['payment_type'] === 'minimum' ? cards[0].minDue : cards[0].outstanding;
      }
      if (serviceId === 'broadband') return getBroadbandBill(formData['account_number']).totalDue;
      if (serviceId === 'loans') return getLoans()[0].emiAmount;
      if (serviceId === 'insurance') return 12000;
      return 500;
    };

    const deductionAmount = extractAmount();

    // Use centralized balance deduction
    const result = deductBalance(deductionAmount);
    if (!result.success) {
      toast.error(`Insufficient balance. Available: ₹${getBalance().toLocaleString('en-IN')}. Required: ₹${deductionAmount}`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const refNumber = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setTransactionRef(refNumber);

      // Save to transaction history
      addTransaction({
        type: serviceId === 'investments' ? 'investment' : 'bill',
        serviceName: flow.serviceName,
        to: flow.serviceName,
        amount: deductionAmount,
        amountDisplay: `₹${deductionAmount.toLocaleString('en-IN')}`,
        category: serviceId,
        referenceNumber: refNumber,
        status: 'success',
      });

      // Fire notification
      addNotification({
        title: `${flow.serviceName} — ₹${deductionAmount.toLocaleString('en-IN')}`,
        message: `Payment successful. Ref: ${refNumber}`,
        type: 'payment',
      });

      // Progress savings quests
      progressQuest(serviceId);

      setStage('success');
      toast.success(`Payment of ₹${deductionAmount.toLocaleString('en-IN')} successful!`);
    }, 2000);
  };

  if (stage === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl text-center space-y-6 border-3 border-gray-400"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-success-600 rounded-full flex items-center justify-center mx-auto border-4 border-success-300"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-black text-surface-900 mb-2">{flow.successMessage}</h2>
            <p className="text-surface-600 font-bold">Transaction Reference: <span className="font-black text-primary-600">{transactionRef}</span></p>
          </div>

          <div className="bg-surface-100 p-4 rounded-lg space-y-3 text-left text-sm">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-surface-600 font-bold capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-surface-900 font-black">{String(value)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                setStage('flow');
                setCurrentStep(0);
                setFormData({});
                setOtp('');
                setShowOtp(false);
              }}
              className="w-full bg-primary-600 text-white font-black py-4 rounded-xl hover:bg-primary-700 transition-all active:scale-95 shadow-md hover:shadow-lg uppercase tracking-wide"
            >
              New Transaction
            </button>
            <button
              onClick={onClose}
              className="w-full border-2 border-surface-300 text-surface-700 font-black py-3 rounded-xl hover:bg-surface-100 transition-colors uppercase text-xs"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
    >
      <motion.div
        initial={{ y: 500, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 500, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md sm:shadow-xl max-h-[90vh] overflow-y-auto border-t-4 sm:border-2 border-surface-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-surface-900 uppercase tracking-tight">{flow.serviceName}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-200 rounded-full transition-colors text-surface-700"
          >
            ✕
          </button>
        </div>

        {!showOtp ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-surface-900 mb-2">{step.title}</h3>
              <p className="text-surface-600 font-bold text-sm leading-relaxed">{step.description}</p>
              <div className="mt-4 bg-primary-50 px-4 py-2 rounded-xl text-xs font-black text-primary-700 border-2 border-primary-100 uppercase tracking-widest inline-block">
                Step {currentStep + 1} / {flow.steps.length}
              </div>
            </div>

            <div className="space-y-4">
              {step.id === 'bill_details' && serviceId === 'electricity' && (
                <ElectricityBillView bill={getElectricityBill(formData['consumer_id'])} />
              )}
              {step.id === 'card_details' && serviceId === 'creditcard' && (
                <div className="space-y-4">
                  <CreditCardView card={getCreditCards()[0]} onSelectAmount={(amt) => handleFieldChange('amount', amt.toString())} />
                </div>
              )}
              {step.id === 'fastag_details' && serviceId === 'fastag' && (
                <FastagView fastag={getFastagInfo(formData['vehicle_number'])} />
              )}
              {step.id === 'bill_details' && serviceId === 'gas' && (
                <GasBillView bill={getGasBill(formData['consumer_id'], formData['delivery_slot'] ? 'LPG' : 'PNG')} />
              )}
              {step.id === 'bill_details' && serviceId === 'broadband' && (
                <BroadbandView bill={getBroadbandBill(formData['account_number'])} />
              )}
              {step.id === 'emi_details' && serviceId === 'loans' && (
                <div className="space-y-4">
                  <LoanView loan={getLoans()[0]} />
                </div>
              )}

              {step.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-black text-surface-900 ml-1">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full px-4 py-4 border-2 border-surface-200 rounded-2xl focus:border-primary-600 focus:outline-none font-bold text-surface-900 bg-surface-50"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full px-4 py-4 border-2 border-surface-200 rounded-2xl focus:border-primary-600 focus:outline-none font-bold text-surface-900 bg-surface-50"
                    />
                  )}
                </div>
              ))}

              {currentStep === flow.steps.length - 1 && Object.keys(formData).length > 0 && (
                <div className="bg-surface-100 p-4 rounded-lg space-y-2 max-h-40 overflow-y-auto">
                  <h4 className="font-bold text-surface-900 text-sm">Summary</h4>
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-surface-600 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-bold text-surface-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="flex-1 border-2 border-surface-300 text-surface-700 font-bold py-4 rounded-xl hover:bg-surface-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs"
              >
                Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStepComplete}
                className="flex-[2] bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl hover:shadow-lg transition-all active:scale-95 uppercase tracking-wide"
              >
                {isLastStep ? 'Review & Pay' : 'Next Step'}
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-surface-900 mb-2">Verify OTP</h3>
              <p className="text-surface-700 text-sm font-bold">Enter the 6-digit OTP sent to your registered mobile</p>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full px-4 py-5 border-2 border-surface-200 rounded-2xl focus:border-primary-600 focus:outline-none font-black text-4xl text-center tracking-widest text-surface-900 bg-surface-50"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOtpVerify}
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-black py-4 rounded-xl hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Payment'
              )}
            </motion.button>

            <button
              onClick={() => setShowOtp(false)}
              className="w-full border-2 border-surface-300 text-surface-600 font-bold py-3 rounded-xl hover:bg-surface-50 transition-colors uppercase text-xs"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export { SERVICE_FLOWS };
