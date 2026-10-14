import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Zap,
  ShieldCheck,
  Crown,
  Leaf,
  Sprout,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SubscriptionView({ isProUser, onUpgradeToPro }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [upgraded, setUpgraded] = useState(isProUser);

  const handleUpgrade = (tierName) => {
    setUpgraded(true);
    onUpgradeToPro();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#3b82f6']
      });
    } catch (e) {
      // Continue silently
    }
  };

  const plans = [
    {
      name: 'Free Hobbyist',
      tagline: 'Ideal for home gardens & indoor houseplants',
      price: '₹0',
      period: 'forever',
      badge: 'Current Plan',
      features: [
        '10 Leaf Scans per day',
        'Standard DeepFlora Neural Engine',
        'Organic & Chemical treatment guides',
        'Basic web diagnosis results',
        'Community plant care tips'
      ],
      cta: 'Active Plan',
      active: !upgraded,
      disabled: true
    },
    {
      name: 'Farm Pro',
      tagline: 'Best for farmers, nursery owners & commercial growers',
      price: billingCycle === 'monthly' ? '₹799' : '₹640',
      period: 'per month',
      popular: true,
      badge: 'Most Popular',
      features: [
        'Unlimited Real-time HD Leaf Scans',
        'Live Camera Instant Viewfinder',
        'AI Plant Doctor with Voice Assistant (Hindi & English)',
        'Official Downloadable Laboratory PDF Certificates',
        'Emergency 4-Step Outbreak Triage Protocols',
        'Priority Sub-second Cloud Inference',
        'Email & WhatsApp Disease Alerts'
      ],
      cta: upgraded ? 'Plan Active (Pro)' : 'Upgrade to Farm Pro',
      active: upgraded,
      highlight: true
    },
    {
      name: 'Agri-Enterprise',
      tagline: 'For commercial plantations, agronomists & co-operatives',
      price: billingCycle === 'monthly' ? '₹2,499' : '₹1,999',
      period: 'per month',
      badge: 'Estate / Co-op',
      features: [
        'Everything in Farm Pro',
        'Multi-farm drone & field sensor integration',
        'Custom agronomy pathogen model training',
        'Unlimited Laboratory Reports & Export to CSV/GIS',
        'Team access (up to 15 field scouts)',
        '24/7 Dedicated Agronomist Hotline'
      ],
      cta: 'Contact Agriculture Sales',
      active: false
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Crown className="w-3.5 h-3.5 text-amber-500" />
          <span>Flexible Agronomy Subscriptions</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Supercharge Your Crop Protection
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Unlock unlimited live camera diagnoses, voice assistant consultations, and official printable laboratory certificates for your farm.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pt-3 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-7 rounded-full bg-emerald-600 p-1 flex items-center transition-colors"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-bold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, idx) => {
          return (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.highlight
                  ? 'bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-2xl scale-100 md:scale-105 border-2 border-emerald-400'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                    plan.highlight
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className={`font-heading text-xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1 ${plan.highlight ? 'text-emerald-200/80' : 'text-slate-500'}`}>
                    {plan.tagline}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold font-heading">
                      {plan.price}
                    </span>
                    <span className={`text-xs ${plan.highlight ? 'text-emerald-300' : 'text-slate-400'}`}>
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/20 space-y-2.5">
                  <p className={`text-xs font-bold uppercase tracking-wider ${plan.highlight ? 'text-emerald-300' : 'text-slate-400'}`}>
                    Features Included:
                  </p>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={plan.highlight ? 'text-emerald-50' : 'text-slate-600'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={plan.disabled || (plan.highlight && upgraded)}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? 'bg-emerald-400 hover:bg-emerald-300 active:scale-95 text-slate-950 shadow-lg shadow-emerald-400/30'
                      : plan.disabled
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs'
                  }`}
                >
                  {plan.highlight && <Zap className="w-4 h-4 fill-current" />}
                  <span>{plan.cta}</span>
                  {!plan.disabled && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Guarantee Note */}
      <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-4 pt-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cancel anytime in 1 click</span>
        </span>
        <span>•</span>
        <span>Instant Activation</span>
        <span>•</span>
        <span>GST Invoice Provided</span>
      </div>

    </div>
  );
}
