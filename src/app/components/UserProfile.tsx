import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Mail, Phone, MapPin, CreditCard, Shield, ChevronRight, LogOut,
  Loader2, Edit3, Settings, Bell, Lock, HelpCircle, FileText,
  CheckCircle, Star, TrendingUp, Activity, Eye, EyeOff, Copy, Check,
  AlertTriangle, X
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

interface UserProfileData {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  accountType: string;
  accountNumber: string;
  balance: number;
}

// ── Fallback profile (works even when backend is offline) ──────────────────────
const FALLBACK_PROFILE: UserProfileData = {
  id: 1,
  name: 'Vikas Sharma',
  email: 'vikas.sharma@example.com',
  phone: '+91 9876543210',
  address: '123, Palm Grove, Hiranandani Estate, Thane West, Maharashtra – 400607',
  accountType: 'Savings Account',
  accountNumber: 'XXXX-XXXX-1234',
  balance: 12450.45,
};

// ── Small helper ───────────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
  iconBg = 'bg-surface-100',
  iconColor = 'text-surface-600',
  copyable = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg?: string;
  iconColor?: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="py-3.5 flex items-center gap-4">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-surface-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-surface-900 truncate text-sm mt-0.5">{value}</p>
      </div>
      {copyable && (
        <button onClick={copy} className="ml-auto p-1.5 rounded-lg hover:bg-surface-100 transition-colors">
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-surface-400" />}
        </button>
      )}
    </div>
  );
}

// ── Logout Confirmation Modal ─────────────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end justify-center"
        onClick={onCancel}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pull indicator */}
          <div className="w-10 h-1 bg-surface-200 rounded-full mx-auto mb-6" />

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-surface-900 mb-2">Log Out?</h3>
            <p className="text-surface-500 text-sm leading-relaxed">
              You'll be signed out of your PaySphere account. Any unsaved changes will be lost.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Yes, Log Me Out
            </button>
            <button
              onClick={onCancel}
              className="w-full py-4 bg-surface-100 hover:bg-surface-200 active:scale-95 text-surface-800 font-bold rounded-2xl transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Menu Row helper ────────────────────────────────────────────────────────────
function MenuRow({
  icon,
  iconBg,
  iconColor,
  label,
  sublabel,
  badge,
  danger = false,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  sublabel?: string;
  badge?: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3.5 flex items-center gap-3.5 transition-colors ${danger ? 'hover:bg-red-50 active:bg-red-100' : 'hover:bg-surface-50 active:bg-surface-100'} group`}
    >
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className={`font-semibold text-sm ${danger ? 'text-red-500' : 'text-surface-900'}`}>{label}</p>
        {sublabel && <p className="text-xs text-surface-400 mt-0.5">{sublabel}</p>}
      </div>
      {badge && (
        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{badge}</span>
      )}
      <ChevronRight className={`w-4 h-4 shrink-0 ${danger ? 'text-red-300 group-hover:text-red-400' : 'text-surface-300 group-hover:text-surface-500'} transition-colors`} />
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('currentUser') || '1';
        const res = await fetch(`http://localhost:8081/api/users/${userId}/profile`);
        if (res.ok) {
          setProfile(await res.json());
        } else {
          setProfile(FALLBACK_PROFILE);
        }
      } catch {
        // Backend offline – use fallback silently
        setProfile(FALLBACK_PROFILE);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-sm text-surface-400 font-medium">Loading profile…</p>
      </div>
    );
  }

  const p = profile!;
  const initials = p.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="pb-28 bg-surface-50">
      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-600 px-5 pt-8 pb-20 overflow-hidden">
        {/* decorative orbs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-primary-400/25 blur-2xl" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* top row */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <p className="text-primary-100 text-sm font-semibold tracking-wide uppercase">My Profile</p>
          <button className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* avatar + name */}
        <div className="relative z-10 flex items-center gap-5">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="relative shrink-0"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <span className="text-2xl font-black text-white tracking-tight">{initials}</span>
            </div>
            {/* KYC verified badge */}
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center shadow-md">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            {/* edit button */}
            <button className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent-500 border-2 border-white flex items-center justify-center shadow-md hover:bg-accent-600 transition-colors">
              <Edit3 className="w-3 h-3 text-white" />
            </button>
          </motion.div>

          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="flex-1 min-w-0"
          >
            <h1 className="text-xl font-black text-white leading-tight truncate">{p.name}</h1>
            <p className="text-primary-200 text-xs font-semibold mt-0.5">{p.accountType}</p>
            {/* KYC tag */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <CheckCircle className="w-2.5 h-2.5" /> KYC Verified
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-300/30 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5" /> Gold Member
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Floating Balance Card ────────────────────────────────────────────── */}
      <div className="px-4 -mt-10 relative z-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md border border-surface-100 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-surface-500 uppercase tracking-wider">Available Balance</p>
            </div>
            <button
              onClick={() => setShowBalance((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
            >
              {showBalance ? <EyeOff className="w-4 h-4 text-surface-400" /> : <Eye className="w-4 h-4 text-surface-400" />}
            </button>
          </div>
          <p className="text-3xl font-black text-surface-900 tracking-tight">
            {showBalance ? `₹${p.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹ ••••••'}
          </p>
          <p className="text-xs text-surface-400 mt-1 font-medium">As of today · Account No. {p.accountNumber}</p>

          {/* Quick stats row */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'This Month', value: '₹3,240', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Spent', value: '₹1,890', color: 'text-red-500', bg: 'bg-red-50' },
              { label: 'Savings', value: '₹1,350', color: 'text-primary-600', bg: 'bg-primary-50' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-2.5 text-center`}>
                <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-surface-500 font-semibold mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="px-4 mt-4 space-y-4">

        {/* Personal Details Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-surface-100 px-4 overflow-hidden"
        >
          <div className="flex items-center justify-between pt-4 pb-2">
            <h2 className="text-[11px] font-black text-surface-400 uppercase tracking-widest">Personal Information</h2>
            <button className="text-[11px] font-bold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="divide-y divide-surface-50">
            <InfoRow icon={<User className="w-4 h-4" />} iconBg="bg-primary-100" iconColor="text-primary-600" label="Full Name" value={p.name} />
            <InfoRow icon={<Mail className="w-4 h-4" />} iconBg="bg-sky-100" iconColor="text-sky-600" label="Email Address" value={p.email} copyable />
            <InfoRow icon={<Phone className="w-4 h-4" />} iconBg="bg-violet-100" iconColor="text-violet-600" label="Phone Number" value={p.phone} copyable />
            <InfoRow icon={<MapPin className="w-4 h-4" />} iconBg="bg-rose-100" iconColor="text-rose-600" label="Residential Address" value={p.address} />
          </div>
        </motion.div>

        {/* Account Details Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-sm border border-surface-100 px-4 overflow-hidden"
        >
          <h2 className="text-[11px] font-black text-surface-400 uppercase tracking-widest pt-4 pb-2">Account Details</h2>
          <div className="divide-y divide-surface-50">
            <InfoRow icon={<CreditCard className="w-4 h-4" />} iconBg="bg-emerald-100" iconColor="text-emerald-600" label="Account Number" value={p.accountNumber} copyable />
            <InfoRow icon={<Activity className="w-4 h-4" />} iconBg="bg-amber-100" iconColor="text-amber-600" label="Account Type" value={p.accountType} />
            <InfoRow icon={<Shield className="w-4 h-4" />} iconBg="bg-teal-100" iconColor="text-teal-600" label="KYC Status" value="Verified · Completed" />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden"
        >
          <h2 className="text-[11px] font-black text-surface-400 uppercase tracking-widest px-4 pt-4 pb-2">Account Settings</h2>
          <div className="divide-y divide-surface-50">
            <MenuRow
              icon={<Bell className="w-4 h-4" />}
              iconBg="bg-violet-100" iconColor="text-violet-600"
              label="Notifications"
              sublabel="Manage alerts & reminders"
              badge="3 New"
            />
            <MenuRow
              icon={<Lock className="w-4 h-4" />}
              iconBg="bg-primary-100" iconColor="text-primary-600"
              label="Security & Privacy"
              sublabel="PIN, biometrics, 2FA"
            />
            <MenuRow
              icon={<FileText className="w-4 h-4" />}
              iconBg="bg-sky-100" iconColor="text-sky-600"
              label="Statements & Reports"
              sublabel="Download or view bank statements"
            />
            <MenuRow
              icon={<HelpCircle className="w-4 h-4" />}
              iconBg="bg-amber-100" iconColor="text-amber-600"
              label="Help & Support"
              sublabel="FAQs, raise a ticket"
            />
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden"
        >
          <MenuRow
            icon={<LogOut className="w-4 h-4" />}
            iconBg="bg-red-100" iconColor="text-red-500"
            label="Log Out"
            sublabel="Sign out of your account"
            danger
            onClick={() => setShowLogoutModal(true)}
          />
        </motion.div>

        {/* App Version footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-center text-[11px] text-surface-300 font-semibold pb-2"
        >
          PaySphere · Version 1.0.0 MVP · © 2026
        </motion.p>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}
