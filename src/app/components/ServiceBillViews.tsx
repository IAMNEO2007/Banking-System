import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, CreditCard as CardIcon, ShoppingBag, Wifi, TrendingUp,
  Calendar, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp, FileText, Download
} from 'lucide-react';
import { 
  ElectricityBill, CreditCardInfo, FastagInfo, GasBill, BroadbandBill, LoanInfo,
  getStatusColor, getStatusLabel 
} from './serviceBillData';

// --- Electricity Bill View ---
export function ElectricityBillView({ bill }: { bill: ElectricityBill }) {
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl border ${getStatusColor(bill.status)}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm">Amount Due</span>
          <span className="font-black text-xl">₹{bill.totalDue.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center text-xs font-semibold">
          <span>Due by {bill.dueDate}</span>
          <span className="px-2 py-1 bg-white/50 rounded uppercase">{getStatusLabel(bill.status)}</span>
        </div>
      </div>

      <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 text-sm">
        <h4 className="font-black text-surface-900 mb-3 border-b border-surface-200 pb-2">Bill Details</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-surface-600 font-bold">Consumer</span>
            <span className="text-surface-900 font-black">{bill.consumerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-600 font-bold">Period</span>
            <span className="text-surface-900 font-bold">{bill.billingPeriod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-600 font-bold">Consumption</span>
            <span className="text-surface-900 font-bold">{bill.unitsConsumed} Units</span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-surface-200 space-y-1">
            {bill.slabs.map((slab, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-surface-600">{slab.label} @ ₹{slab.rate}</span>
                <span className="font-bold text-surface-900">₹{slab.amount}</span>
              </div>
            ))}
            <div className="flex justify-between text-xs">
              <span className="text-surface-600">Fixed Charges</span>
              <span className="font-bold text-surface-900">₹{bill.fixedCharges}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-surface-600">Tax ({bill.taxPercent}%)</span>
              <span className="font-bold text-surface-900">₹{bill.taxAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Credit Card View ---
export function CreditCardView({ card, onSelectAmount }: { card: CreditCardInfo, onSelectAmount: (amt: number) => void }) {
  const [showTxns, setShowTxns] = useState(false);
  
  return (
    <div className="space-y-4">
      <div className={`p-5 rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="flex justify-between items-start relative z-10 mb-6">
          <div>
            <p className="font-bold opacity-80 text-sm">{card.bankName}</p>
            <p className="font-black text-lg">{card.cardName}</p>
          </div>
          <CardIcon className="w-8 h-8 opacity-80" />
        </div>
        <div className="relative z-10">
          <p className="font-mono tracking-widest opacity-90 mb-1">•••• •••• •••• {card.last4}</p>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-xs opacity-80 font-bold">Outstanding</p>
              <p className="font-black text-2xl">₹{card.outstanding.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-80 font-bold">Due Date</p>
              <p className="font-bold">{card.dueDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onSelectAmount(card.minDue)}
          className="p-3 border-2 border-surface-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
        >
          <p className="text-xs font-bold text-surface-600">Min Due</p>
          <p className="font-black text-surface-900">₹{card.minDue.toLocaleString('en-IN')}</p>
        </button>
        <button 
          onClick={() => onSelectAmount(card.outstanding)}
          className="p-3 border-2 border-primary-500 bg-primary-50 rounded-xl text-left"
        >
          <p className="text-xs font-bold text-primary-600">Total Due</p>
          <p className="font-black text-primary-900">₹{card.outstanding.toLocaleString('en-IN')}</p>
        </button>
      </div>

      <div className="border border-surface-200 rounded-xl overflow-hidden">
        <button 
          onClick={() => setShowTxns(!showTxns)}
          className="w-full p-4 flex justify-between items-center bg-surface-50 hover:bg-surface-100 transition-colors"
        >
          <span className="font-bold text-sm text-surface-900">Recent Transactions</span>
          {showTxns ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showTxns && (
          <div className="p-4 bg-white space-y-3 max-h-48 overflow-y-auto">
            {card.transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center border-b border-surface-100 last:border-0 pb-2 last:pb-0">
                <div>
                  <p className="font-bold text-sm text-surface-900">{tx.merchant}</p>
                  <p className="text-xs text-surface-500">{tx.date} • {tx.category}</p>
                </div>
                <p className={`font-black text-sm ${tx.type === 'credit' ? 'text-success-600' : 'text-surface-900'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- FASTag View ---
export function FastagView({ fastag }: { fastag: FastagInfo }) {
  return (
    <div className="space-y-4">
      <div className="bg-surface-50 border-2 border-surface-200 p-4 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-surface-500 uppercase">Current Balance</p>
          <p className="font-black text-2xl text-surface-900">₹{fastag.balance}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
          fastag.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'
        }`}>
          {fastag.status.replace('-', ' ')}
        </div>
      </div>

      <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
        <div className="p-3 bg-surface-50 border-b border-surface-200">
          <h4 className="font-bold text-xs text-surface-700 uppercase tracking-wider">Recent Tolls</h4>
        </div>
        <div className="p-0 max-h-48 overflow-y-auto">
          {fastag.tollHistory.slice(0, 4).map(toll => (
            <div key={toll.id} className="p-3 border-b border-surface-100 last:border-0 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm text-surface-900 line-clamp-1">{toll.plazaName}</p>
                <p className="text-xs text-surface-500">{toll.date}</p>
              </div>
              <p className="font-black text-surface-900">-₹{toll.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Gas Bill View ---
export function GasBillView({ bill }: { bill: GasBill }) {
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl border ${getStatusColor(bill.status)} flex justify-between items-center`}>
        <div>
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Total Due</p>
          <p className="font-black text-2xl">₹{bill.totalDue.toLocaleString('en-IN')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold opacity-80">Due Date</p>
          <p className="font-black">{bill.dueDate}</p>
        </div>
      </div>

      <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 text-sm">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-surface-200">
          <Zap className="w-4 h-4 text-primary-600" />
          <h4 className="font-black text-surface-900">{bill.provider} ({bill.gasType})</h4>
        </div>
        
        <div className="space-y-2">
          {bill.gasType === 'PNG' ? (
            <>
              <div className="flex justify-between">
                <span className="text-surface-600 font-bold">Units Consumed</span>
                <span className="font-bold text-surface-900">{bill.unitsConsumed} SCM</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-600">Gas Charges</span>
                <span className="font-bold text-surface-900">₹{bill.gasCharges}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-600">Fixed Charge</span>
                <span className="font-bold text-surface-900">₹{bill.fixedCharge}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-surface-600 font-bold">Cylinder Type</span>
                <span className="font-bold text-surface-900">{bill.cylinderWeight}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-600">Base Price</span>
                <span className="font-bold text-surface-900">₹{bill.basePrice}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-600">Delivery</span>
                <span className="font-bold text-surface-900">₹{bill.deliveryCharge}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-xs border-t border-surface-200 pt-1 mt-1">
            <span className="text-surface-600">Taxes</span>
            <span className="font-bold text-surface-900">₹{bill.gstAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Broadband View ---
export function BroadbandView({ bill }: { bill: BroadbandBill }) {
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl border ${getStatusColor(bill.status)}`}>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Amount Due</p>
            <p className="font-black text-2xl">₹{bill.totalDue.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold opacity-80">Due Date</p>
            <p className="font-black">{bill.dueDate}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-surface-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-secondary-600" />
            <div>
              <p className="font-black text-surface-900">{bill.planName}</p>
              <p className="text-xs font-bold text-surface-500">{bill.speed} • {bill.dataLimit}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-50 p-3 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-surface-600 font-bold">Monthly Charge</span>
            <span className="font-bold text-surface-900">₹{bill.monthlyCharge}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-600 font-bold">GST ({bill.gstPercent}%)</span>
            <span className="font-bold text-surface-900">₹{bill.gstAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Loans View ---
export function LoanView({ loan }: { loan: LoanInfo }) {
  return (
    <div className="space-y-4">
      <div className={`p-5 rounded-2xl bg-gradient-to-br ${loan.gradient} text-white shadow-md`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{loan.icon}</span>
          <div>
            <p className="font-bold opacity-90 text-sm">{loan.bankName}</p>
            <p className="font-black text-lg">{loan.loanType}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-bold opacity-80 mb-1">Upcoming EMI</p>
            <p className="font-black text-2xl">₹{loan.emiAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold opacity-80 mb-1">Due Date</p>
            <p className="font-bold">{loan.nextDueDate}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-surface-200 text-sm space-y-3">
        <h4 className="font-black text-surface-900 border-b border-surface-200 pb-2">EMI Breakdown</h4>
        <div className="flex justify-between">
          <span className="text-surface-600 font-bold">Principal Component</span>
          <span className="font-bold text-surface-900">₹{loan.principalComponent.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-surface-600 font-bold">Interest Component</span>
          <span className="font-bold text-surface-900">₹{loan.interestComponent.toLocaleString('en-IN')}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-surface-100 flex items-center justify-between">
          <span className="text-xs text-surface-500 font-bold">EMIs Paid: {loan.emisPaid}/{loan.totalEmis}</span>
          <div className="w-1/2 bg-surface-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary-500 h-full rounded-full" 
              style={{ width: `${(loan.emisPaid / loan.totalEmis) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
