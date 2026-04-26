import React, { useState } from 'react';
import { FileText, ShieldCheck, Cpu, Calendar, Target, CheckCircle2, AlertCircle, BookOpen, Layers, Zap, Network, Key, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export function DocsViewer() {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Executive', icon: <Target className="w-4 h-4" /> },
    { id: 'product', label: 'Product Spec', icon: <FileText className="w-4 h-4" /> },
    { id: 'arch', label: 'Architecture', icon: <Cpu className="w-4 h-4" /> },
    { id: 'roadmap', label: 'Sprint Plan', icon: <Calendar className="w-4 h-4" /> },
    { id: 'compliance', label: 'Security', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'ops', label: 'Operations', icon: <Layers className="w-4 h-4" /> },
    { id: 'metrics', label: 'KPIs', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-surface-50 overflow-y-auto">
      {/* Tab Navigation */}
      <div className="sticky top-0 bg-white border-b border-surface-200 z-40 px-2 pt-2 shadow-sm overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all relative border-b-2 shrink-0 ${
              activeTab === tab.id ? 'text-primary-600 border-primary-600 bg-primary-50/50' : 'text-surface-400 border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 pb-24 max-w-md mx-auto w-full prose prose-surface prose-primary">
        {activeTab === 'summary' && <SummaryDoc />}
        {activeTab === 'product' && <ProductSpecDoc />}
        {activeTab === 'arch' && <ArchitectureDoc />}
        {activeTab === 'roadmap' && <SprintPlanDoc />}
        {activeTab === 'compliance' && <ComplianceDoc />}
        {activeTab === 'ops' && <OperationsDoc />}
        {activeTab === 'metrics' && <MetricsDoc />}
      </div>
    </div>
  );
}

function OperationsDoc() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <h1 className="text-2xl font-black text-surface-800 m-0 tracking-tight text-center uppercase">Operations & Support</h1>
      
      <section className="space-y-4">
        <h2 className="text-sm font-black text-primary-600 m-0 uppercase tracking-widest">1. Reconciliation</h2>
        <div className="bg-white p-5 rounded-3xl border border-surface-100 shadow-sm space-y-3">
          <p className="text-xs text-surface-500 font-bold leading-relaxed m-0">
            Daily T+1 automated reconciliation between PaySphere Ledger and Bank settlement files.
          </p>
          <ul className="list-none p-0 space-y-2">
            <li className="flex items-start gap-2 text-[11px] font-black text-surface-700 bg-surface-50 p-3 rounded-xl border border-surface-100">
              <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" /> Internal ledger balance verification.
            </li>
            <li className="flex items-start gap-2 text-[11px] font-black text-surface-700 bg-surface-50 p-3 rounded-xl border border-surface-100">
              <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" /> Bank statement (MT940) cross-referencing.
            </li>
            <li className="flex items-start gap-2 text-[11px] font-black text-surface-700 bg-surface-50 p-3 rounded-xl border border-surface-100">
              <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" /> Dispute auto-flagging for ops review.
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-black text-primary-600 m-0 uppercase tracking-widest">2. Support Playbook</h2>
        <div className="grid grid-cols-1 gap-3">
           <div className="border border-surface-200 p-4 rounded-2xl bg-white shadow-sm space-y-2">
              <h4 className="text-[11px] font-black text-surface-800 m-0 uppercase tracking-tight">Transaction Failed but Debited</h4>
              <p className="text-[10px] text-surface-500 font-bold m-0 leading-normal">Auto-refund within 2-4 hours via internal reconciliation bridge.</p>
           </div>
           <div className="border border-surface-200 p-4 rounded-2xl bg-white shadow-sm space-y-2">
              <h4 className="text-[11px] font-black text-surface-800 m-0 uppercase tracking-tight">KYC Verification Delayed</h4>
              <p className="text-[10px] text-surface-500 font-bold m-0 leading-normal">Manual review queue (SLA: 12 hours) with agent call-back.</p>
           </div>
        </div>
      </section>
    </motion.div>
  );
}

function MetricsDoc() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <h1 className="text-2xl font-black text-surface-800 m-0 tracking-tight text-center uppercase">Success Metrics</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary-600 p-5 rounded-3xl text-white space-y-1 shadow-lg border border-primary-500">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest m-0">Activation</p>
          <p className="text-3xl font-black m-0">≥ 20%</p>
          <p className="text-[9px] font-medium opacity-70 m-0">30-day conversion</p>
        </div>
        <div className="bg-secondary-600 p-5 rounded-3xl text-white space-y-1 shadow-lg border border-secondary-500">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest m-0">Fraud Rate</p>
          <p className="text-3xl font-black m-0">{'<'} 0.1%</p>
          <p className="text-[9px] font-medium opacity-70 m-0">Total volume target</p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-black text-primary-600 m-0 uppercase tracking-widest">Product KPIs</h2>
        <div className="bg-white rounded-3xl border border-surface-200 overflow-hidden shadow-sm">
          <table className="w-full text-[11px] text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-200">
                <th className="px-4 py-3 font-black text-primary-600 uppercase tracking-widest">Metric</th>
                <th className="px-4 py-3 font-black text-primary-600 uppercase tracking-widest text-right">Goal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              <tr><td className="px-4 py-3 font-black text-surface-700 uppercase">Monthly GMV</td><td className="px-4 py-3 font-bold text-surface-500 text-right">₹5 Cr+</td></tr>
              <tr><td className="px-4 py-3 font-black text-surface-700 uppercase">Retention</td><td className="px-4 py-3 font-bold text-surface-500 text-right">{"> 70%"}</td></tr>
              <tr><td className="px-4 py-3 font-black text-surface-700 uppercase">Latency</td><td className="px-4 py-3 font-bold text-surface-500 text-right">{"< 1.2s"}</td></tr>
              <tr><td className="px-4 py-3 font-black text-surface-700 uppercase">NPS Score</td><td className="px-4 py-3 font-bold text-surface-500 text-right">{"> 45"}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </motion.div>
  );
}

// ... (rest of the functions remain the same - SummaryDoc, ProductSpecDoc, etc. - copied from previous read for completeness, with fixed table)
function SummaryDoc() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 rounded-3xl shadow-xl space-y-2 border border-primary-500">
        <h1 className="text-2xl font-black text-white m-0 tracking-tight uppercase">Executive Summary</h1>
        <p className="text-primary-100 text-sm font-bold opacity-90 leading-relaxed uppercase tracking-tighter">
          PaySphere: A digital-first virtual banking & payments ecosystem for India.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-black text-surface-800 flex items-center gap-2 m-0 tracking-tight uppercase cursor-default">
          <BookOpen className="w-5 h-5 text-primary-600" />
          Mission
        </h2>
        <p className="text-xs text-surface-600 leading-relaxed font-bold border-l-4 border-primary-600 pl-4 py-1">
          To provide small merchants and urban consumers in Maharashtra with a seamless, RBI-compliant payment experience.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm space-y-1">
          <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest m-0">Primary Region</p>
          <p className="text-[11px] font-black text-surface-800 m-0 uppercase">Thane (MH)</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm space-y-1">
          <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest m-0">Initial Target</p>
          <p className="text-[11px] font-black text-surface-800 m-0 uppercase">50k MAU (Q1)</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-800 m-0 tracking-tight">Key Objectives</h2>
        <ul className="list-none p-0 space-y-3">
          {[
            'Deliver NPCI-integrated UPI & PPI wallet ecosystem.',
            'Tiered KYC (OTP, PAN, Video) for high transaction limits.',
            'Localized merchant QR solutions for Kirana stores.',
            'RBI/NPCI compliance by design (Data Localization).'
          ].map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-600 font-medium p-0">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function ProductSpecDoc() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <h1 className="text-2xl font-black text-slate-800 m-0 tracking-tight">Product Specification</h1>
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        A modular merchant and consumer payments platform that blends UPI, PPI, and digital banking workflows into one unified product.
      </p>
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-surface-200 shadow-sm space-y-3">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-primary-600 m-0 underline decoration-2 underline-offset-4">Core Flows</h2>
          <ul className="list-disc pl-5 space-y-2 text-[11px] text-surface-600 font-black uppercase tracking-tight">
            <li>Merchant onboarding with instant QR.</li>
            <li>Consumer wallet top-up & UPI.</li>
            <li>Settlement & dispute management.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function ArchitectureDoc() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <h1 className="text-2xl font-black text-slate-800 m-0 tracking-tight">Architecture Overview</h1>
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        A cloud-native architecture built for PCI-adjacent UPI integration, data localization, and fast reconciliation.
      </p>
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 m-0">Layered Design</h2>
          <ul className="list-disc pl-5 space-y-2 text-[11px] text-slate-600 font-medium">
            <li>API gateway and auth tier.</li>
            <li>Payment orchestration and settlement engine.</li>
            <li>Ops dashboard / monitoring layer.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function SprintPlanDoc() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <h1 className="text-2xl font-black text-slate-800 m-0 tracking-tight">Sprint Plan</h1>
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        Focused delivery milestones for launching MVP operations in the Thane pilot region.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-[11px] text-slate-600 font-medium">
        <li>Merchant onboarding and QR rollout.</li>
        <li>KYC workflows and limit-based verification.</li>
        <li>Settlement reconciliation and support playbook.</li>
      </ol>
    </motion.div>
  );
}

function ComplianceDoc() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <h1 className="text-2xl font-black text-slate-800 m-0 tracking-tight">Security & Compliance</h1>
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        RBI/NPCI compliance is enforced through data localization, strong access controls, and audit-ready logging.
      </p>
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 m-0">Compliance Highlights</h2>
        <ul className="list-disc pl-5 space-y-2 text-[11px] text-slate-600 font-medium">
          <li>Encrypted transaction storage</li>
          <li>Role-based admin controls</li>
          <li>Automated dispute and AML screening</li>
        </ul>
      </div>
    </motion.div>
  );
}

