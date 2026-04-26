import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { Home, LayoutDashboard, FileText, QrCode, Zap, Wallet, MapPin, Search, Menu, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NotificationBell } from './NotificationPanel';
import { FraudChatbot } from './FraudChatbot';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function AppShell() {
  const location = useLocation();
  const isDoc = location.pathname.startsWith('/docs');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-surface-50 w-full max-w-md mx-auto relative shadow-lg overflow-hidden border-x border-surface-200 px-0">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-surface-200 shadow-sm w-full">
        {/* Header with search and location */}
        <div className="p-4 space-y-3">
          {/* Logo and Menu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-primary-950">PaySphere</span>
            </div>
            <div className="flex items-center gap-1">
              <NotificationBell />
              <Link to="/profile" className="p-2 hover:bg-surface-100 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search transactions…"
              className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm text-surface-900 placeholder-surface-500 focus:outline-none focus:bg-white focus:border-primary-300 focus:ring-1 focus:ring-primary-200 transition-all font-medium"
            />
          </div>

          {/* Location Tag */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-secondary-600" />
            <span className="text-surface-700 font-bold">San Francisco, CA</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-surface-200 px-4 py-3 flex justify-between items-center z-50 shadow-lg">
        <NavItem to="/" icon={<Home className="w-5 h-5" />} label="Home" active={location.pathname === '/'} />
        <NavItem to="/services" icon={<Zap className="w-5 h-5" />} label="Services" active={location.pathname === '/services'} />
        <NavItem to="/pay" icon={<QrCode className="w-5 h-5 text-white" />} label="Scan" active={location.pathname === '/pay'} isCenter />
        <NavItem to="/merchant" icon={<LayoutDashboard className="w-5 h-5" />} label="Merchant" active={location.pathname === '/merchant'} />
        <NavItem to="/docs" icon={<FileText className="w-5 h-5" />} label="Docs" active={location.pathname === '/docs'} />
      </nav>
      <FraudChatbot />
    </div>
  );
}

function NavItem({ to, icon, label, active, isCenter }: { to: string, icon: React.ReactNode, label: string, active?: boolean, isCenter?: boolean }) {
  if (isCenter) {
    return (
      <Link to={to} className="flex flex-col items-center gap-1 -mt-12 group">
        <div className="w-14 h-14 bg-accent-500 rounded-full flex items-center justify-center shadow-lg group-active:scale-95 transition-transform border-4 border-white ring-4 ring-accent-100 hover:bg-accent-600">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-accent-600 uppercase tracking-wider">{label}</span>
      </Link>
    );
  }

  return (
    <Link to={to} className={cn("flex flex-col items-center gap-1 transition-colors", active ? "text-primary-600" : "text-surface-500 hover:text-surface-700")}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
