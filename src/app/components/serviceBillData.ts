/**
 * serviceBillData.ts — Mock bill data for all service payment flows.
 * Provides realistic Indian billing data for demo/prototype purposes.
 */

// ─── Electricity ─────────────────────────────────────────────────────────────

export interface ElectricityBill {
  consumerName: string;
  consumerId: string;
  provider: string;
  billingPeriod: string;
  unitsConsumed: number;
  slabs: { label: string; units: number; rate: number; amount: number }[];
  fixedCharges: number;
  taxPercent: number;
  taxAmount: number;
  totalDue: number;
  dueDate: string;
  daysLeft: number;
  lateFee: number;
  lastPayment: { amount: number; date: string };
  status: 'overdue' | 'due-soon' | 'upcoming';
}

export function getElectricityBill(consumerId: string): ElectricityBill {
  const slabs = [
    { label: 'Slab 1 (0–100 units)', units: 100, rate: 3.5, amount: 350 },
    { label: 'Slab 2 (101–300 units)', units: 200, rate: 5.75, amount: 1150 },
    { label: 'Slab 3 (301+ units)', units: 42, rate: 8.0, amount: 336 },
  ];
  const subtotal = slabs.reduce((s, sl) => s + sl.amount, 0) + 120;
  const tax = Math.round(subtotal * 0.09);
  return {
    consumerName: 'Nirmal Kumar',
    consumerId: consumerId || 'MSEB-12345678',
    provider: 'MSEB (Maharashtra)',
    billingPeriod: '01 Apr – 30 Apr 2026',
    unitsConsumed: 342,
    slabs,
    fixedCharges: 120,
    taxPercent: 9,
    taxAmount: tax,
    totalDue: subtotal + tax,
    dueDate: '15 May 2026',
    daysLeft: 19,
    lateFee: 50,
    lastPayment: { amount: 1980, date: '15 Apr 2026' },
    status: 'upcoming',
  };
}

// ─── Credit Cards ────────────────────────────────────────────────────────────

export interface CreditCardInfo {
  id: string;
  bankName: string;
  cardName: string;
  last4: string;
  network: 'Visa' | 'Mastercard' | 'RuPay';
  outstanding: number;
  minDue: number;
  dueDate: string;
  daysLeft: number;
  creditLimit: number;
  availableLimit: number;
  statementDate: string;
  status: 'overdue' | 'due-soon' | 'upcoming';
  rewardPoints: number;
  transactions: CreditCardTransaction[];
  gradient: string;
}

export interface CreditCardTransaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  type: 'debit' | 'credit';
}

export function getCreditCards(): CreditCardInfo[] {
  return [
    {
      id: 'cc_1',
      bankName: 'HDFC Bank',
      cardName: 'Regalia',
      last4: '4521',
      network: 'Visa',
      outstanding: 18450,
      minDue: 2500,
      dueDate: '05 May 2026',
      daysLeft: 9,
      creditLimit: 300000,
      availableLimit: 281550,
      statementDate: '25 Apr 2026',
      status: 'due-soon',
      rewardPoints: 4520,
      gradient: 'from-blue-800 to-blue-950',
      transactions: [
        { id: 'ct1', merchant: 'Amazon.in', category: 'Shopping', amount: 2350, date: '24 Apr', type: 'debit' },
        { id: 'ct2', merchant: 'Swiggy', category: 'Food', amount: 540, date: '22 Apr', type: 'debit' },
        { id: 'ct3', merchant: 'IOCL Fuel Station', category: 'Fuel', amount: 3200, date: '20 Apr', type: 'debit' },
        { id: 'ct4', merchant: 'Netflix', category: 'Entertainment', amount: 649, date: '18 Apr', type: 'debit' },
        { id: 'ct5', merchant: 'BigBasket', category: 'Grocery', amount: 1870, date: '15 Apr', type: 'debit' },
        { id: 'ct6', merchant: 'Payment Received', category: 'Payment', amount: 5000, date: '12 Apr', type: 'credit' },
      ],
    },
    {
      id: 'cc_2',
      bankName: 'SBI Card',
      cardName: 'Simply Click',
      last4: '7832',
      network: 'Mastercard',
      outstanding: 6200,
      minDue: 900,
      dueDate: '12 May 2026',
      daysLeft: 16,
      creditLimit: 150000,
      availableLimit: 143800,
      statementDate: '28 Apr 2026',
      status: 'upcoming',
      rewardPoints: 1890,
      gradient: 'from-indigo-700 to-purple-900',
      transactions: [
        { id: 'ct7', merchant: 'Flipkart', category: 'Shopping', amount: 3450, date: '23 Apr', type: 'debit' },
        { id: 'ct8', merchant: 'Zomato', category: 'Food', amount: 680, date: '21 Apr', type: 'debit' },
        { id: 'ct9', merchant: 'Uber', category: 'Travel', amount: 420, date: '19 Apr', type: 'debit' },
        { id: 'ct10', merchant: 'Spotify', category: 'Entertainment', amount: 119, date: '15 Apr', type: 'debit' },
      ],
    },
    {
      id: 'cc_3',
      bankName: 'Axis Bank',
      cardName: 'Flipkart',
      last4: '9154',
      network: 'Visa',
      outstanding: 32100,
      minDue: 4200,
      dueDate: '20 May 2026',
      daysLeft: 24,
      creditLimit: 200000,
      availableLimit: 167900,
      statementDate: '30 Apr 2026',
      status: 'upcoming',
      rewardPoints: 8340,
      gradient: 'from-rose-700 to-rose-950',
      transactions: [
        { id: 'ct11', merchant: 'Flipkart', category: 'Shopping', amount: 15600, date: '22 Apr', type: 'debit' },
        { id: 'ct12', merchant: 'Croma', category: 'Electronics', amount: 8900, date: '18 Apr', type: 'debit' },
        { id: 'ct13', merchant: 'MakeMyTrip', category: 'Travel', amount: 4500, date: '14 Apr', type: 'debit' },
        { id: 'ct14', merchant: 'Myntra', category: 'Shopping', amount: 2100, date: '10 Apr', type: 'debit' },
        { id: 'ct15', merchant: 'Payment Received', category: 'Payment', amount: 10000, date: '08 Apr', type: 'credit' },
      ],
    },
  ];
}

// ─── FASTag ──────────────────────────────────────────────────────────────────

export interface FastagInfo {
  vehicleNumber: string;
  vehicleType: string;
  tagId: string;
  issuingBank: string;
  balance: number;
  status: 'active' | 'low-balance' | 'blacklisted';
  tollHistory: FastagToll[];
}

export interface FastagToll {
  id: string;
  plazaName: string;
  location: string;
  amount: number;
  date: string;
  laneType: string;
}

export function getFastagInfo(vehicleNumber: string): FastagInfo {
  const bal = 245;
  return {
    vehicleNumber: vehicleNumber || 'MH 05 AB 1234',
    vehicleType: 'Car / Jeep / Van',
    tagId: '3400 0123 4567 8901',
    issuingBank: 'ICICI Bank',
    balance: bal,
    status: bal < 300 ? 'low-balance' : 'active',
    tollHistory: [
      { id: 'ft1', plazaName: 'Khalapur Toll Plaza', location: 'Mumbai–Pune Expressway', amount: 295, date: '25 Apr, 10:32 AM', laneType: 'ETC' },
      { id: 'ft2', plazaName: 'Vashi Toll Plaza', location: 'Sion–Panvel Highway', amount: 40, date: '23 Apr, 8:15 AM', laneType: 'ETC' },
      { id: 'ft3', plazaName: 'Bandra-Worli Sea Link', location: 'Mumbai', amount: 80, date: '21 Apr, 6:45 PM', laneType: 'ETC' },
      { id: 'ft4', plazaName: 'Khalapur Toll Plaza', location: 'Mumbai–Pune Expressway', amount: 295, date: '18 Apr, 9:20 AM', laneType: 'ETC' },
      { id: 'ft5', plazaName: 'Airoli Toll Naka', location: 'Thane–Belapur Road', amount: 40, date: '15 Apr, 7:00 AM', laneType: 'ETC' },
      { id: 'ft6', plazaName: 'Dahisar Toll Plaza', location: 'Western Express Hwy', amount: 55, date: '12 Apr, 11:45 AM', laneType: 'ETC' },
    ],
  };
}

// ─── Gas Bill ────────────────────────────────────────────────────────────────

export interface GasBill {
  consumerName: string;
  consumerId: string;
  provider: string;
  gasType: 'PNG' | 'LPG';
  // PNG fields
  billingPeriod?: string;
  unitsConsumed?: number;
  ratePerUnit?: number;
  gasCharges?: number;
  fixedCharge?: number;
  gstPercent?: number;
  gstAmount?: number;
  // LPG fields
  cylinderType?: string;
  cylinderWeight?: string;
  subsidyAmount?: number;
  deliveryCharge?: number;
  basePrice?: number;
  // Common
  totalDue: number;
  dueDate: string;
  daysLeft: number;
  lastPayment: { amount: number; date: string };
  status: 'overdue' | 'due-soon' | 'upcoming';
}

export function getGasBill(consumerId: string, type: 'PNG' | 'LPG' = 'PNG'): GasBill {
  if (type === 'LPG') {
    return {
      consumerName: 'Nirmal Kumar',
      consumerId: consumerId || 'HP-98765432',
      provider: 'HP Gas',
      gasType: 'LPG',
      cylinderType: 'Domestic (Subsidized)',
      cylinderWeight: '14.2 kg',
      basePrice: 803,
      subsidyAmount: 0,
      deliveryCharge: 50,
      gstPercent: 5,
      gstAmount: 43,
      totalDue: 896,
      dueDate: '10 May 2026',
      daysLeft: 14,
      lastPayment: { amount: 875, date: '10 Mar 2026' },
      status: 'upcoming',
    };
  }
  const units = 18;
  const rate = 46;
  const gasCharges = units * rate;
  const fixedCharge = 65;
  const gst = Math.round((gasCharges + fixedCharge) * 0.05);
  return {
    consumerName: 'Nirmal Kumar',
    consumerId: consumerId || 'MGL-98765432',
    provider: 'Mahanagar Gas Ltd',
    gasType: 'PNG',
    billingPeriod: '01 Apr – 30 Apr 2026',
    unitsConsumed: units,
    ratePerUnit: rate,
    gasCharges,
    fixedCharge,
    gstPercent: 5,
    gstAmount: gst,
    totalDue: gasCharges + fixedCharge + gst,
    dueDate: '10 May 2026',
    daysLeft: 14,
    lastPayment: { amount: 892, date: '10 Apr 2026' },
    status: 'upcoming',
  };
}

// ─── Broadband ───────────────────────────────────────────────────────────────

export interface BroadbandBill {
  consumerName: string;
  accountId: string;
  provider: string;
  planName: string;
  speed: string;
  dataUsed: string;
  dataLimit: string;
  billingPeriod: string;
  monthlyCharge: number;
  gstPercent: number;
  gstAmount: number;
  totalDue: number;
  dueDate: string;
  daysLeft: number;
  lastPayment: { amount: number; date: string };
  connectionType: string;
  status: 'overdue' | 'due-soon' | 'upcoming';
}

export function getBroadbandBill(accountId: string): BroadbandBill {
  const monthly = 1049;
  const gst = Math.round(monthly * 0.18);
  return {
    consumerName: 'Nirmal Kumar',
    accountId: accountId || 'ACT-BB-456789',
    provider: 'ACT Fibernet',
    planName: 'ACT Storm',
    speed: '300 Mbps',
    dataUsed: '287 GB',
    dataLimit: 'Unlimited',
    billingPeriod: '01 Apr – 30 Apr 2026',
    monthlyCharge: monthly,
    gstPercent: 18,
    gstAmount: gst,
    totalDue: monthly + gst,
    dueDate: '08 May 2026',
    daysLeft: 12,
    lastPayment: { amount: 1238, date: '08 Apr 2026' },
    connectionType: 'Fiber Optic (FTTH)',
    status: 'upcoming',
  };
}

// ─── Loans ───────────────────────────────────────────────────────────────────

export interface LoanInfo {
  id: string;
  loanType: string;
  bankName: string;
  accountNumber: string;
  sanctionedAmount: number;
  outstandingPrincipal: number;
  emiAmount: number;
  interestRate: number;
  tenure: string;
  nextDueDate: string;
  daysLeft: number;
  emisPaid: number;
  totalEmis: number;
  principalComponent: number;
  interestComponent: number;
  prepaymentCharges: string;
  status: 'overdue' | 'due-soon' | 'upcoming';
  gradient: string;
  icon: string;
}

export function getLoans(): LoanInfo[] {
  return [
    {
      id: 'loan_1',
      loanType: 'Home Loan',
      bankName: 'HDFC Bank',
      accountNumber: 'HL-2023-00456',
      sanctionedAmount: 3500000,
      outstandingPrincipal: 2845000,
      emiAmount: 29500,
      interestRate: 8.5,
      tenure: '20 years',
      nextDueDate: '05 May 2026',
      daysLeft: 9,
      emisPaid: 36,
      totalEmis: 240,
      principalComponent: 8750,
      interestComponent: 20750,
      prepaymentCharges: 'Nil (floating rate)',
      status: 'due-soon',
      gradient: 'from-emerald-600 to-emerald-800',
      icon: '🏠',
    },
    {
      id: 'loan_2',
      loanType: 'Personal Loan',
      bankName: 'ICICI Bank',
      accountNumber: 'PL-2024-01289',
      sanctionedAmount: 500000,
      outstandingPrincipal: 280000,
      emiAmount: 12500,
      interestRate: 10.99,
      tenure: '4 years',
      nextDueDate: '10 May 2026',
      daysLeft: 14,
      emisPaid: 18,
      totalEmis: 48,
      principalComponent: 6950,
      interestComponent: 5550,
      prepaymentCharges: '2% + GST',
      status: 'upcoming',
      gradient: 'from-orange-500 to-orange-700',
      icon: '💼',
    },
    {
      id: 'loan_3',
      loanType: 'Car Loan',
      bankName: 'Axis Bank',
      accountNumber: 'CL-2024-07834',
      sanctionedAmount: 800000,
      outstandingPrincipal: 520000,
      emiAmount: 16800,
      interestRate: 9.25,
      tenure: '5 years',
      nextDueDate: '15 May 2026',
      daysLeft: 19,
      emisPaid: 21,
      totalEmis: 60,
      principalComponent: 8800,
      interestComponent: 8000,
      prepaymentCharges: '4% + GST',
      status: 'upcoming',
      gradient: 'from-sky-600 to-sky-800',
      icon: '🚗',
    },
  ];
}

// ─── Status badge helpers ────────────────────────────────────────────────────

export function getStatusColor(status: 'overdue' | 'due-soon' | 'upcoming'): string {
  switch (status) {
    case 'overdue': return 'bg-error-100 text-error-700 border-error-200';
    case 'due-soon': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'upcoming': return 'bg-success-100 text-success-700 border-success-200';
  }
}

export function getStatusLabel(status: 'overdue' | 'due-soon' | 'upcoming'): string {
  switch (status) {
    case 'overdue': return 'OVERDUE';
    case 'due-soon': return 'DUE SOON';
    case 'upcoming': return 'UPCOMING';
  }
}
