import React, { useEffect, useCallback } from 'react';
import { CreditCard, Smartphone, Zap, ShoppingBag, Receipt, ArrowRight, TrendingUp, ShieldCheck, Search, Wallet, Trophy, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ServicesSection } from './ServicesSection';
import { toast } from 'sonner';
import { AddMoneyFlow } from './AddMoneyFlow';
import { TransferFlow } from './TransferFlow';
import {
  getBalance, setBalance as setWalletBalance,
  getTransactionHistory, getSpendingAnalytics,
  getBillPredictions, getPocket, topUpPocket, savePocket,
  getQuests, claimQuestReward, POCKET_CONFIG,
  type TransactionEntry, type SpendingAnalytics, type BillPrediction, type PocketShield, type SavingsQuest,
} from './walletUtils';

const fallbackTransactions = [
  { id: '1', type: 'paid' as const, serviceName: 'Shopping', to: 'Krishna General Store', amount: 140, amountDisplay: '₹140', date: 'Today, 10:24 AM', category: 'Shopping', referenceNumber: 'TXN001', status: 'success' as const },
  { id: '2', type: 'received' as const, serviceName: 'Transfer', from: 'Amit Sharma', amount: 500, amountDisplay: '₹500', date: 'Yesterday, 8:15 PM', category: 'Transfer', referenceNumber: 'TXN002', status: 'success' as const },
  { id: '3', type: 'bill' as const, serviceName: 'Electricity', to: 'MSEB - Thane West', amount: 2450, amountDisplay: '₹2,450', date: '14 Apr, 2026', category: 'Utility', referenceNumber: 'TXN003', status: 'success' as const },
  { id: '4', type: 'paid' as const, serviceName: 'Food', to: 'Starbucks Thane', amount: 450, amountDisplay: '₹450', date: '13 Apr, 2026', category: 'Food', referenceNumber: 'TXN004', status: 'success' as const },
];

const getIconForCategory = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'shopping': case 'food': return <ShoppingBag className="w-4 h-4 text-accent-500" />;
    case 'transfer': case 'received': return <ArrowRight className="w-4 h-4 text-success-600 rotate-180" />;
    case 'utility': case 'electricity': case 'gas': case 'broadband': return <Zap className="w-4 h-4 text-secondary-600" />;
    case 'mobile': case 'dth': return <Smartphone className="w-4 h-4 text-primary-600" />;
    case 'creditcard': case 'loans': case 'insurance': return <CreditCard className="w-4 h-4 text-purple-500" />;
    case 'scan': return <Search className="w-4 h-4 text-indigo-500" />;
    case 'investments': return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    case 'add-money': return <Wallet className="w-4 h-4 text-green-600" />;
    default: return <Receipt className="w-4 h-4 text-surface-600" />;
  }
};

export function ConsumerDashboard() {
  const [search, setSearch] = React.useState('');
  const [balance, setBalance] = React.useState<number>(0);
  const [transactions, setTransactions] = React.useState<TransactionEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [analytics, setAnalytics] = React.useState<SpendingAnalytics | null>(null);
  const [billPredictions, setBillPredictions] = React.useState<BillPrediction[]>([]);
  const [pocket, setPocket] = React.useState<PocketShield | null>(null);
  const [quests, setQuests] = React.useState<SavingsQuest[]>([]);
  const [showAllQuests, setShowAllQuests] = React.useState(false);
  const [showAddMoney, setShowAddMoney] = React.useState(false);
  const [showTransfer, setShowTransfer] = React.useState(false);

  // Load all data
  const refreshData = useCallback(() => {
    // Balance
    const bal = getBalance();
    setBalance(bal);

    // Transactions (prefer real history, fallback to mock)
    const history = getTransactionHistory();
    setTransactions(history.length > 0 ? history : fallbackTransactions);

    // Analytics
    setAnalytics(getSpendingAnalytics());

    // Bill predictions
    setBillPredictions(getBillPredictions());

    // Pocket Shield
    setPocket(getPocket());

    // Quests
    setQuests(getQuests());

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();

    // Re-sync when tab becomes visible (e.g., user returns from payment)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshData();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Listen for custom balance/transaction events
    const handleBalanceUpdate = () => refreshData();
    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    window.addEventListener('transactionAdded', handleBalanceUpdate);
    window.addEventListener('pocketUpdated', handleBalanceUpdate);
    window.addEventListener('questsUpdated', handleBalanceUpdate);
    window.addEventListener('storage', handleBalanceUpdate);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('balanceUpdated', handleBalanceUpdate);
      window.removeEventListener('transactionAdded', handleBalanceUpdate);
      window.removeEventListener('pocketUpdated', handleBalanceUpdate);
      window.removeEventListener('questsUpdated', handleBalanceUpdate);
      window.removeEventListener('storage', handleBalanceUpdate);
    };
  }, [refreshData]);

  const filteredTransactions = transactions.filter(tx => 
    (tx.to || tx.from || tx.serviceName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleTopUpPocket = () => {
    const amount = prompt(`Add to Pocket Shield (max ₹${POCKET_CONFIG.MAX}):`);
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      const result = topUpPocket(Number(amount));
      if (result.success) {
        toast.success(`₹${amount} added to Pocket Shield!`);
        refreshData();
      } else {
        toast.error('Insufficient balance or pocket is full');
      }
    }
  };

  const handleEnablePocket = () => {
    const p = getPocket();
    p.enabled = !p.enabled;
    savePocket(p);
    setPocket(p);
    toast.success(p.enabled ? 'Pocket Shield enabled!' : 'Pocket Shield disabled');
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Wallet Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <p className="text-white/80 text-xs font-medium uppercase tracking-widest mb-2">Total Balance</p>
            <h2 className="text-5xl font-bold flex items-baseline gap-1.5">
              <span className="text-2xl font-medium opacity-90">₹</span>
              {Math.floor(balance).toLocaleString('en-IN')}
              <span className="text-lg font-normal opacity-80">.{(balance % 1).toFixed(2).substring(2)}</span>
            </h2>
          </div>
          <Link to="/kyc" className="bg-white/20 hover:bg-white/30 p-2.5 rounded-lg backdrop-blur-md transition-all active:scale-90 flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </Link>
        </div>

        <div className="flex gap-3 relative z-10">
          <button 
            onClick={() => setShowAddMoney(true)}
            className="flex-1 bg-white text-primary-700 px-4 py-3 rounded-lg font-semibold text-sm shadow-md active:scale-95 transition-all hover:bg-surface-50">
            + Add Money
          </button>
          <button 
            onClick={() => setShowTransfer(true)}
            className="flex-1 border-2 border-white text-white px-4 py-3 rounded-lg font-semibold text-sm backdrop-blur-sm active:scale-95 transition-all hover:bg-white/10">
            Transfer
          </button>
        </div>
      </motion.div>

      {/* Spending Analytics Mini-Card */}
      {analytics && analytics.transactionCount > 0 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-white p-3.5 rounded-xl border border-surface-200 shadow-sm text-center">
            <p className="text-[9px] font-black text-surface-400 uppercase tracking-widest mb-1">Spent This Month</p>
            <p className="text-lg font-black text-surface-900">₹{analytics.totalSpentThisMonth.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-surface-200 shadow-sm text-center">
            <p className="text-[9px] font-black text-surface-400 uppercase tracking-widest mb-1">Transactions</p>
            <p className="text-lg font-black text-primary-600">{analytics.transactionCount}</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-surface-200 shadow-sm text-center">
            <p className="text-[9px] font-black text-surface-400 uppercase tracking-widest mb-1">Top Category</p>
            <p className="text-xs font-black text-secondary-600 uppercase">{analytics.topCategory}</p>
          </div>
        </motion.div>
      )}

      {/* Pocket Shield Card */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-surface-900">Pocket Shield</h3>
              <p className="text-[10px] text-surface-500 font-bold">PIN-free payments under ₹{POCKET_CONFIG.PIN_FREE_MAX}</p>
            </div>
          </div>
          <button
            onClick={handleEnablePocket}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
              pocket?.enabled 
                ? 'bg-success-100 text-success-700 border border-success-200' 
                : 'bg-surface-100 text-surface-500 border border-surface-200'
            }`}
          >
            {pocket?.enabled ? '● Active' : '○ Off'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider">Pocket Balance</p>
            <p className="text-2xl font-black text-indigo-700">₹{pocket?.balance?.toFixed(0) || 0}</p>
          </div>
          <button
            onClick={handleTopUpPocket}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md active:scale-95 transition-all"
          >
            + Top Up
          </button>
        </div>

        <div className="mt-3 bg-indigo-100/50 rounded-lg p-2 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <p className="text-[9px] text-indigo-600 font-bold">Auto-refill enabled • Max ₹{POCKET_CONFIG.MAX} • No PIN for payments under ₹{POCKET_CONFIG.PIN_FREE_MAX}</p>
        </div>
      </motion.div>

      {/* Auto-Bill Scout */}
      {billPredictions.length > 0 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-surface-900 text-sm">Auto-Bill Scout</h3>
          </div>
          {billPredictions.slice(0, 2).map((bill, i) => (
            <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-surface-800">{bill.serviceName}</p>
                <p className="text-[10px] text-surface-500 font-bold">
                  Est. ₹{bill.predictedAmount.toLocaleString('en-IN')} • Due {bill.predictedDate}
                  {bill.daysUntilDue <= 0 ? ' (OVERDUE)' : ` (${bill.daysUntilDue}d left)`}
                </p>
              </div>
              <Link
                to="/services"
                className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all shadow-sm"
              >
                Pay Now
              </Link>
            </div>
          ))}
        </motion.div>
      )}

      {/* Savings Quests */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-secondary-600" />
            <h3 className="font-bold text-surface-900 text-sm">Savings Quests</h3>
          </div>
          <button
            onClick={() => setShowAllQuests(!showAllQuests)}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            {showAllQuests ? 'Show Less' : 'View All'}
          </button>
        </div>
        <div className="space-y-2.5">
          {(showAllQuests ? quests : quests.slice(0, 2)).map((quest) => (
            <div
              key={quest.id}
              className={`bg-white border rounded-xl p-4 shadow-sm transition-all ${
                quest.completed && !quest.claimed
                  ? 'border-success-300 bg-success-50/30'
                  : quest.claimed
                  ? 'border-surface-200 opacity-60'
                  : 'border-surface-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{quest.icon}</span>
                  <div>
                    <p className="text-xs font-black text-surface-900">{quest.title}</p>
                    <p className="text-[10px] text-surface-500 font-medium">{quest.description}</p>
                  </div>
                </div>
                <div className="bg-secondary-50 px-2 py-1 rounded-lg border border-secondary-200">
                  <p className="text-[9px] font-black text-secondary-600">₹{quest.reward}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2.5">
                <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(quest.current / quest.target) * 100}%` }}
                    className={`h-full rounded-full ${quest.completed ? 'bg-success-500' : 'bg-primary-500'}`}
                  />
                </div>
                <span className="text-[10px] font-black text-surface-500">
                  {quest.current}/{quest.target}
                </span>
                {quest.completed && !quest.claimed && (
                  <button
                    onClick={() => {
                      claimQuestReward(quest.id);
                      refreshData();
                      toast.success('Reward claimed!');
                    }}
                    className="bg-success-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider active:scale-95 transition-all animate-pulse"
                  >
                    Claim
                  </button>
                )}
                {quest.claimed && (
                  <span className="text-[9px] font-black text-success-600 uppercase">Claimed ✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Promotional Banner */}
      <div className="bg-accent-50 border-2 border-accent-200 rounded-2xl p-5 flex gap-4 items-center relative overflow-hidden shadow-sm">
        <div className="flex-1 relative z-10">
          <p className="text-accent-950 text-sm font-semibold leading-relaxed">Win up to ₹500 cashback on your 1st scan today!</p>
          <Link to="/pay" className="mt-3 text-xs font-bold bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition-colors inline-block">Scan Now</Link>
        </div>
        <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center relative z-10 animate-bounce">
          <QrCode className="w-8 h-8 text-accent-500" />
        </div>
      </div>

      {/* Quick Services Grid */}
      <ServicesSection />

      {/* Recent Transactions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-surface-900 text-lg">Recent Activity</h3>
          <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">See All</button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
          />
        </div>

        <div className="space-y-3">
          {filteredTransactions.slice(0, 6).map(tx => (
            <motion.div 
              key={tx.id}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-4 bg-white border border-surface-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center">
                  {getIconForCategory(tx.category)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 line-clamp-1">{tx.to || tx.from || tx.serviceName}</p>
                  <p className="text-xs text-surface-600 font-medium">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'received' ? 'text-success-600' : 'text-surface-900'}`}>
                  {tx.type === 'received' ? '+' : '-'}{tx.amountDisplay || `₹${tx.amount}`}
                </p>
                <p className={`text-xs font-semibold uppercase tracking-tight ${tx.status === 'success' ? 'text-success-600' : 'text-amber-500'}`}>
                  {tx.status === 'success' ? 'SUCCESS' : 'PENDING'}
                </p>
              </div>
            </motion.div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-surface-400">
              <Receipt className="w-10 h-10 mx-auto mb-2 text-surface-300" />
              <p className="text-sm font-bold">No transactions found</p>
            </div>
          )}
        </div>
      </section>
      {/* ── Add Money & Transfer Modals ── */}
      <AddMoneyFlow
        isOpen={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        onSuccess={() => refreshData()}
      />
      <TransferFlow
        isOpen={showTransfer}
        onClose={() => setShowTransfer(false)}
        onSuccess={() => refreshData()}
      />
    </div>
  );
}

function QrCode({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M7 7h.01M17 7h.01M7 17h.01" />
    </svg>
  );
}
