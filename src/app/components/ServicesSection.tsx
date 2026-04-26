import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router';
import { 
  Smartphone, Zap, CreditCard, Receipt, ShoppingBag, 
  Wifi, TrendingUp, FileText, Eye, Clock, Check, ChevronRight,
  DollarSign, Send, ArrowUpRight, Settings, HelpCircle, Lock
} from 'lucide-react';
import { ServiceFlowEngine } from './ServiceFlowEngine';

interface Service {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  features: string[];
  bgGradient: string;
}

const services: Service[] = [
  {
    id: 'mobile',
    label: 'Mobile',
    icon: <Smartphone className="w-6 h-6" />,
    color: 'bg-primary-50',
    description: 'Recharge & bills',
    features: ['Prepaid Recharge', 'Postpaid Payment', 'Data Offers', 'Number Porting'],
    bgGradient: 'from-primary-500 to-primary-700'
  },
  {
    id: 'electricity',
    label: 'Electricity',
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-accent-50',
    description: 'Pay bills quickly',
    features: ['Bill Payment', 'View History', 'Set Reminders', 'Auto-Pay Setup'],
    bgGradient: 'from-accent-500 to-accent-600'
  },
  {
    id: 'creditcard',
    label: 'Credit Card',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'bg-secondary-50',
    description: 'Manage accounts',
    features: ['Check Balance', 'View Statement', 'Pay Bills', 'Credit Score'],
    bgGradient: 'from-secondary-500 to-secondary-600'
  },
  {
    id: 'dth',
    label: 'DTH',
    icon: <Receipt className="w-6 h-6" />,
    color: 'bg-success-50',
    description: 'TV recharge',
    features: ['Subscription Recharge', 'Channel Add-ons', 'Box Referral', 'Support'],
    bgGradient: 'from-success-500 to-success-600'
  },
  {
    id: 'fastag',
    label: 'FASTag',
    icon: <ShoppingBag className="w-6 h-6" />,
    color: 'bg-error-50',
    description: 'Toll payments',
    features: ['Quick Recharge', 'Toll Rates', 'History', 'Complaints'],
    bgGradient: 'from-error-500 to-error-600'
  },
  {
    id: 'gas',
    label: 'Gas',
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-primary-50',
    description: 'Cooking gas',
    features: ['Book Cylinder', 'Check Status', 'Safety', 'Analysis'],
    bgGradient: 'from-primary-600 to-primary-700'
  },
  {
    id: 'broadband',
    label: 'Broadband',
    icon: <Wifi className="w-6 h-6" />,
    color: 'bg-secondary-50',
    description: 'Internet plans',
    features: ['Plan Upgrade', 'Speed Test', 'Bill Payment', 'Install Request'],
    bgGradient: 'from-secondary-600 to-secondary-700'
  },
  {
    id: 'loans',
    label: 'Loans',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'bg-accent-50',
    description: 'Instant loans',
    features: ['Quick Approval', 'Eligibility Check', 'EMI Calculator', 'Status'],
    bgGradient: 'from-accent-600 to-accent-700'
  },
];

type CategoryFilter = 'all' | 'utilities' | 'financial' | 'lifestyle';

export function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [animating, setAnimating] = useState(false);
  const [flowServiceId, setFlowServiceId] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All', color: 'bg-primary-600' },
    { id: 'utilities', label: 'Utilities', color: 'bg-secondary-600' },
    { id: 'financial', label: 'Financial', color: 'bg-accent-500' },
    { id: 'lifestyle', label: 'Lifestyle', color: 'bg-success-600' },
  ];

  const categoryMap: Record<CategoryFilter, string[]> = {
    all: services.map(s => s.id),
    utilities: ['mobile', 'electricity', 'dth', 'fastag', 'gas', 'broadband'],
    financial: ['creditcard', 'loans', 'insurance', 'investments', 'demandraft', 'neft'],
    lifestyle: ['bookings', 'fooddelivery'],
  };

  const filteredServices = services.filter(s => 
    categoryMap[activeCategory].includes(s.id)
  );

  const handleCategoryChange = (category: CategoryFilter) => {
    setAnimating(true);
    setActiveCategory(category);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <section className="space-y-6 w-full">
      {/* Services Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-surface-900">Services</h2>
        <Link to="/services" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          View All →
        </Link>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id as CategoryFilter)}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-semibold text-xs whitespace-nowrap transition-all border-2 ${
              activeCategory === cat.id
                ? `${cat.color} text-white border-transparent shadow-md`
                : 'bg-white text-surface-700 hover:bg-surface-50 border-surface-200'
            }`}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Services Grid - Professional Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
        >
          {filteredServices.map((service, idx) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedService(service)}
              className="group flex flex-col items-center gap-3 cursor-pointer transition-all"
            >
              {/* Service Icon Card */}
              <motion.div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-md border border-surface-200 ${service.color} group-hover:shadow-lg transition-all text-surface-700`}
                whileHover={{ boxShadow: '0 12px 24px rgba(30,58,138,0.15)' }}
              >
                {service.icon}
              </motion.div>
              {/* Service Label */}
              <div className="text-center flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-900 line-clamp-1">{service.label}</p>
                <p className="text-xs text-surface-600 line-clamp-1">{service.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ y: 500, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 500, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 w-full sm:w-96 sm:shadow-2xl max-h-[90vh] overflow-y-auto border-t-2 sm:border-0 sm:border border-surface-200"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${selectedService.bgGradient} text-white shadow-lg`}>
                    {selectedService.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-surface-900">{selectedService.label}</h3>
                    <p className="text-sm text-surface-600">{selectedService.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-surface-700"
                >
                  ✕
                </button>
              </div>

              {/* Features Grid */}
              <div className="space-y-4 mb-6">
                <h4 className="font-bold text-surface-900">Features</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedService.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-2 p-3 bg-surface-50 rounded-lg border border-surface-200 hover:bg-surface-100 transition-colors"
                    >
                      <Check className="w-4 h-4 text-success-600 flex-shrink-0 font-bold" />
                      <span className="text-sm font-medium text-surface-900">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => {
                    setFlowServiceId(selectedService.id);
                    setSelectedService(null);
                  }}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Get Started
                </button>
                <button className="w-full border-2 border-surface-200 text-surface-900 font-semibold py-3 rounded-lg hover:bg-surface-50 transition-colors active:scale-95 flex items-center justify-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Learn More
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <Lock className="w-5 h-5 mx-auto mb-2 text-primary-600" />
                  <p className="font-semibold text-surface-900">Secure</p>
                </div>
                <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-secondary-600" />
                  <p className="font-semibold text-surface-900">Fast</p>
                </div>
                <div className="p-3 bg-success-50 rounded-lg border border-success-200">
                  <Check className="w-5 h-5 mx-auto mb-2 text-success-600" />
                  <p className="font-semibold text-surface-900">Easy</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Flow Engine */}
      <AnimatePresence>
        {flowServiceId && (
          <ServiceFlowEngine 
            serviceId={flowServiceId} 
            onClose={() => setFlowServiceId(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer active:scale-90 transition-transform">
      <motion.div
        className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm border-2 border-slate-100 ${service.color} group-hover:shadow-lg transition-all`}
        whileHover={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      >
        {service.icon}
      </motion.div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-800">{service.label}</p>
        <p className="text-xs text-slate-500">{service.description}</p>
      </div>
    </div>
  );
}
