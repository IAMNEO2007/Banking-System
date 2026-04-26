import React from 'react';
import { QrCode, TrendingUp, ArrowUpRight, ArrowDownRight, Users, Store, CheckCircle, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { motion } from 'motion/react';
import { ServicesSection } from './ServicesSection';

const salesData = [
  { day: 'Mon', sales: 4200 },
  { day: 'Tue', sales: 5800 },
  { day: 'Wed', sales: 3200 },
  { day: 'Thu', sales: 8500 },
  { day: 'Fri', sales: 6700 },
  { day: 'Sat', sales: 12000 },
  { day: 'Sun', sales: 9500 },
];

export function MerchantDashboard() {
  return (
    <div className="flex flex-col gap-6 p-4 bg-surface-50 min-h-full">
      {/* Merchant Profile Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 border border-primary-200 shadow-sm">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-surface-900 tracking-tight text-lg">Sai Ram Kirana</h2>
            <p className="text-xs text-surface-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-success-600" />
              Verified • Thane
            </p>
          </div>
        </div>
        <button className="bg-accent-500 hover:bg-accent-600 text-white p-3 rounded-lg shadow-md active:scale-95 transition-all">
          <QrCode className="w-6 h-6" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs font-semibold text-surface-600 uppercase tracking-wide mb-2">Total Sales</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-xs font-medium text-surface-600">₹</span>
            <span className="text-2xl font-bold text-surface-900">49.8k</span>
          </div>
          <p className="text-xs text-success-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            +12% this week
          </p>
        </motion.div>
        <motion.div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-all">
          <p className="text-xs font-semibold text-surface-600 uppercase tracking-wide mb-2">Customers</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold text-surface-900">342</span>
          </div>
          <p className="text-xs text-primary-600 font-semibold flex items-center gap-0.5">
            <Users className="w-3 h-3" />
            +8 new today
          </p>
        </motion.div>
      </div>

      {/* Services Section for Merchants */}
      <div className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm">
        <ServicesSection />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-surface-900 text-lg">Weekly Performance</h3>
          <select className="text-xs font-semibold bg-surface-50 border border-surface-200 rounded-lg focus:ring-1 focus:ring-primary-300 text-surface-900 px-3 py-2">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }} 
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-surface-900 text-white p-2 rounded-lg text-xs font-semibold shadow-xl border border-white/10">
                        ₹{Number(payload[0]?.value).toLocaleString()}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                {salesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.sales > 8000 ? '#1E3A8A' : '#93C5FD'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Customers Section */}
      <section className="space-y-4">
        <h3 className="font-bold text-surface-900">Top Customers</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {[
            { name: 'Rahul D.', initial: 'RD', sales: '₹8,450', color: 'bg-error-100 text-error-600' },
            { name: 'Sneha K.', initial: 'SK', sales: '₹6,200', color: 'bg-primary-100 text-primary-600' },
            { name: 'Deepak P.', initial: 'DP', sales: '₹4,100', color: 'bg-success-100 text-success-600' },
            { name: 'Amit S.', initial: 'AS', sales: '₹2,850', color: 'bg-secondary-100 text-secondary-600' },
          ].map((cust, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0 bg-white p-4 rounded-xl border border-surface-200 shadow-sm min-w-[110px]">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm ${cust.color}`}>
                {cust.initial}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-surface-900">{cust.name}</p>
                <p className="text-xs font-medium text-surface-600">{cust.sales}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Settlement Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-surface-900">Settlements</h3>
          <button className="text-xs font-semibold text-primary-600 flex items-center gap-0.5 hover:text-primary-700">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <motion.div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden active:scale-95 transition-all cursor-pointer">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-1">Available for Payout</p>
              <h4 className="text-3xl font-bold flex items-baseline gap-1">
                <span className="text-lg font-medium">₹</span>
                8,420
                <span className="text-sm font-normal opacity-80">.00</span>
              </h4>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <button className="mt-4 w-full bg-white text-primary-700 hover:bg-surface-50 py-2.5 rounded-lg font-semibold text-sm shadow-md relative z-10 transition-colors uppercase tracking-tight">
            Settle Now to Bank
          </button>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </motion.div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <h3 className="font-bold text-surface-900 tracking-tight">Recent Payments</h3>
        <div className="space-y-3">
          {[
            { id: 1, user: 'Deepak Patil', time: '12 mins ago', amount: '₹1,240', status: 'success' },
            { id: 2, user: 'Sneha Kulkarni', time: '45 mins ago', amount: '₹85', status: 'success' },
            { id: 3, user: 'Rahul Deshmukh', time: '2 hours ago', amount: '₹2,500', status: 'pending' },
          ].map(tx => (
            <motion.div 
              key={tx.id}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-4 bg-white border border-surface-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-inner ${tx.status === 'success' ? 'bg-success-50 text-success-600 border-2 border-success-100' : 'bg-accent-50 text-accent-600 border-2 border-accent-100'}`}>
                  {tx.status === 'success' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-black text-surface-900 tracking-tight leading-none mb-1">{tx.user}</p>
                  <p className="text-[10px] text-surface-600 font-bold uppercase tracking-wider">{tx.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-surface-900 tracking-tighter">{tx.amount}</p>
                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${tx.status === 'success' ? 'bg-success-50 text-success-700 border-success-200' : 'bg-accent-50 text-accent-700 border-accent-200'}`}>
                  {tx.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
