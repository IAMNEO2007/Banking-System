/**
 * walletUtils.ts — Shared localStorage helpers for balance, transactions, notifications,
 * Pocket Shield, Savings Quests, and Auto-Bill Scout.
 */

// ─── Balance ───────────────────────────────────────────────────────────────

const BALANCE_KEY = 'mockBalance';
const DEFAULT_BALANCE = 12450.45;

export function getBalance(): number {
  const raw = localStorage.getItem(BALANCE_KEY);
  return raw ? parseFloat(raw) : DEFAULT_BALANCE;
}

export function setBalance(amount: number): void {
  localStorage.setItem(BALANCE_KEY, amount.toFixed(2));
  window.dispatchEvent(new CustomEvent('balanceUpdated', { detail: amount }));
}

export function deductBalance(amount: number): { success: boolean; newBalance: number } {
  const current = getBalance();
  if (current < amount) return { success: false, newBalance: current };
  const newBal = current - amount;
  setBalance(newBal);
  return { success: true, newBalance: newBal };
}

// ─── Transaction History ───────────────────────────────────────────────────

const TX_HISTORY_KEY = 'transactionHistory';

export interface TransactionEntry {
  id: string;
  type: 'paid' | 'received' | 'bill' | 'transfer' | 'investment';
  serviceName: string;
  to?: string;
  from?: string;
  amount: number;
  amountDisplay: string;
  date: string;
  category: string;
  referenceNumber: string;
  status: 'success' | 'pending' | 'failed';
}

export function getTransactionHistory(): TransactionEntry[] {
  try {
    const raw = localStorage.getItem(TX_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addTransaction(entry: Omit<TransactionEntry, 'id' | 'date'>): TransactionEntry {
  const history = getTransactionHistory();
  const full: TransactionEntry = {
    ...entry,
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    date: new Date().toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }),
  };
  history.unshift(full);
  if (history.length > 100) history.length = 100;
  localStorage.setItem(TX_HISTORY_KEY, JSON.stringify(history));
  window.dispatchEvent(new CustomEvent('transactionAdded', { detail: full }));
  return full;
}

// ─── Notifications ─────────────────────────────────────────────────────────

const NOTIF_KEY = 'notifications';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'payment' | 'alert' | 'quest' | 'bill' | 'pocket';
  timestamp: string;
  read: boolean;
  icon?: string;
}

export function getNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
  const list = getNotifications();
  const full: AppNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toLocaleString('en-IN', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }),
    read: false,
  };
  list.unshift(full);
  if (list.length > 50) list.length = 50;
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('notificationAdded'));
  return full;
}

export function markAllNotificationsRead(): void {
  const list = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('notificationAdded'));
}

export function getUnreadCount(): number {
  return getNotifications().filter(n => !n.read).length;
}

// ─── Pocket Shield (UPI Lite) ──────────────────────────────────────────────

const POCKET_KEY = 'pocketShield';
const POCKET_MAX = 500;
const POCKET_PIN_FREE_MAX = 200;

export interface PocketShield {
  balance: number;
  enabled: boolean;
  dailySpent: number;
  lastResetDate: string;
  autoTopUp: boolean;
}

export function getPocket(): PocketShield {
  try {
    const raw = localStorage.getItem(POCKET_KEY);
    if (raw) {
      const pocket = JSON.parse(raw) as PocketShield;
      const today = new Date().toDateString();
      if (pocket.lastResetDate !== today) {
        pocket.dailySpent = 0;
        pocket.lastResetDate = today;
        savePocket(pocket);
      }
      return pocket;
    }
  } catch { /* fallthrough */ }
  return { balance: 0, enabled: false, dailySpent: 0, lastResetDate: new Date().toDateString(), autoTopUp: true };
}

export function savePocket(pocket: PocketShield): void {
  localStorage.setItem(POCKET_KEY, JSON.stringify(pocket));
  window.dispatchEvent(new CustomEvent('pocketUpdated'));
}

export function topUpPocket(amount: number): { success: boolean } {
  const pocket = getPocket();
  const max = POCKET_MAX - pocket.balance;
  const topUp = Math.min(amount, max);
  if (topUp <= 0) return { success: false };

  const deduction = deductBalance(topUp);
  if (!deduction.success) return { success: false };

  pocket.balance += topUp;
  savePocket(pocket);
  addNotification({
    title: 'Pocket Shield Top-Up',
    message: `₹${topUp} added to your Pocket. Balance: ₹${pocket.balance}`,
    type: 'pocket',
  });
  return { success: true };
}

export function payFromPocket(amount: number): { success: boolean; needsPin: boolean } {
  if (amount > POCKET_MAX) return { success: false, needsPin: true };
  const pocket = getPocket();
  if (!pocket.enabled) return { success: false, needsPin: true };
  if (pocket.balance < amount) {
    if (pocket.autoTopUp) {
      const needed = amount - pocket.balance;
      const topUpResult = topUpPocket(Math.min(needed + 100, POCKET_MAX));
      if (!topUpResult.success) return { success: false, needsPin: true };
    } else {
      return { success: false, needsPin: true };
    }
  }

  const updatedPocket = getPocket();
  updatedPocket.balance -= amount;
  updatedPocket.dailySpent += amount;
  savePocket(updatedPocket);
  return { success: true, needsPin: amount > POCKET_PIN_FREE_MAX };
}

export const POCKET_CONFIG = { MAX: POCKET_MAX, PIN_FREE_MAX: POCKET_PIN_FREE_MAX };

// ─── Savings Quests ────────────────────────────────────────────────────────

const QUESTS_KEY = 'savingsQuests';

export interface SavingsQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  category: string;
  expiresAt: string;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

function getDefaultQuests(): SavingsQuest[] {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  const exp = expires.toISOString();

  return [
    {
      id: 'q_recharge3', title: 'Recharge Rally', description: 'Complete 3 mobile recharges this week',
      target: 3, current: 0, reward: 25, category: 'mobile', expiresAt: exp,
      completed: false, claimed: false, icon: '📱',
    },
    {
      id: 'q_utility5', title: 'Bill Master', description: 'Pay 5 utility bills this week',
      target: 5, current: 0, reward: 50, category: 'utilities', expiresAt: exp,
      completed: false, claimed: false, icon: '⚡',
    },
    {
      id: 'q_any10', title: 'Power User', description: 'Make 10 transactions of any type',
      target: 10, current: 0, reward: 100, category: 'all', expiresAt: exp,
      completed: false, claimed: false, icon: '🏆',
    },
    {
      id: 'q_scan5', title: 'Scan Star', description: 'Complete 5 scan-and-pay transactions',
      target: 5, current: 0, reward: 40, category: 'scan', expiresAt: exp,
      completed: false, claimed: false, icon: '📷',
    },
  ];
}

export function getQuests(): SavingsQuest[] {
  try {
    const raw = localStorage.getItem(QUESTS_KEY);
    if (raw) {
      const quests = JSON.parse(raw) as SavingsQuest[];
      const now = new Date();
      const allExpired = quests.every(q => new Date(q.expiresAt) < now);
      if (allExpired) {
        const fresh = getDefaultQuests();
        localStorage.setItem(QUESTS_KEY, JSON.stringify(fresh));
        return fresh;
      }
      return quests;
    }
  } catch { /* fallthrough */ }
  const defaults = getDefaultQuests();
  localStorage.setItem(QUESTS_KEY, JSON.stringify(defaults));
  return defaults;
}

export function progressQuest(category: string): void {
  const quests = getQuests();
  let updated = false;

  for (const quest of quests) {
    if (quest.completed || quest.claimed) continue;
    const matches =
      quest.category === 'all' ||
      quest.category === category ||
      (quest.category === 'utilities' && ['mobile', 'electricity', 'dth', 'fastag', 'gas', 'broadband'].includes(category));

    if (matches) {
      quest.current = Math.min(quest.current + 1, quest.target);
      if (quest.current >= quest.target) {
        quest.completed = true;
        addNotification({
          title: `🎉 Quest Complete: ${quest.title}`,
          message: `Claim your ₹${quest.reward} cashback reward!`,
          type: 'quest',
        });
      }
      updated = true;
    }
  }

  if (updated) {
    localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
    window.dispatchEvent(new CustomEvent('questsUpdated'));
  }
}

export function claimQuestReward(questId: string): boolean {
  const quests = getQuests();
  const quest = quests.find(q => q.id === questId);
  if (!quest || !quest.completed || quest.claimed) return false;
  quest.claimed = true;
  const current = getBalance();
  setBalance(current + quest.reward);
  localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
  addNotification({
    title: 'Reward Claimed! 💰',
    message: `₹${quest.reward} cashback added to your wallet for "${quest.title}"`,
    type: 'quest',
  });
  window.dispatchEvent(new CustomEvent('questsUpdated'));
  return true;
}

// ─── Auto-Bill Scout ───────────────────────────────────────────────────────

export interface BillPrediction {
  serviceName: string;
  serviceId: string;
  predictedAmount: number;
  predictedDate: string;
  daysUntilDue: number;
  lastPaidDate: string;
}

export function getBillPredictions(): BillPrediction[] {
  const history = getTransactionHistory();
  const serviceMap = new Map<string, { amounts: number[]; dates: Date[]; name: string }>();

  for (const tx of history) {
    if (tx.status !== 'success') continue;
    const key = tx.category || tx.serviceName;
    if (!serviceMap.has(key)) {
      serviceMap.set(key, { amounts: [], dates: [], name: tx.serviceName });
    }
    const entry = serviceMap.get(key)!;
    entry.amounts.push(tx.amount);
    entry.dates.push(new Date(tx.date));
  }

  const predictions: BillPrediction[] = [];
  const now = new Date();

  for (const [serviceId, data] of serviceMap) {
    if (data.dates.length < 1) continue;

    const avgAmount = data.amounts.reduce((a, b) => a + b, 0) / data.amounts.length;
    const lastPaid = data.dates[0];
    const nextDue = new Date(lastPaid);
    nextDue.setDate(nextDue.getDate() + 30);

    const daysUntilDue = Math.ceil((nextDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue <= 10 && daysUntilDue >= -3) {
      predictions.push({
        serviceName: data.name,
        serviceId,
        predictedAmount: Math.round(avgAmount),
        predictedDate: nextDue.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        daysUntilDue,
        lastPaidDate: lastPaid.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      });
    }
  }

  return predictions.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

// ─── Spending Analytics ────────────────────────────────────────────────────

export interface SpendingAnalytics {
  totalSpentThisMonth: number;
  transactionCount: number;
  topCategory: string;
  topCategoryAmount: number;
  avgTransaction: number;
}

export function getSpendingAnalytics(): SpendingAnalytics {
  const history = getTransactionHistory();
  const now = new Date();
  const thisMonth = history.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear() && tx.status === 'success';
  });

  const totalSpent = thisMonth.reduce((sum, tx) => sum + tx.amount, 0);
  const categoryTotals = new Map<string, number>();
  for (const tx of thisMonth) {
    const cat = tx.category || 'Other';
    categoryTotals.set(cat, (categoryTotals.get(cat) || 0) + tx.amount);
  }

  let topCategory = 'None';
  let topAmount = 0;
  for (const [cat, amount] of categoryTotals) {
    if (amount > topAmount) { topCategory = cat; topAmount = amount; }
  }

  return {
    totalSpentThisMonth: totalSpent,
    transactionCount: thisMonth.length,
    topCategory,
    topCategoryAmount: topAmount,
    avgTransaction: thisMonth.length > 0 ? Math.round(totalSpent / thisMonth.length) : 0,
  };
}
