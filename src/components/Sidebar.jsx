import React from 'react';
import {
  ScanLine,
  Camera,
  Pill,
  Bot,
  FileText,
  Crown,
  BookOpen,
  History,
  Leaf,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
  Mic,
  Printer,
  Radio,
  Calculator,
  ShoppingCart
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onSelectTab,
  historyCount,
  reportsCount,
  isProUser,
  onOpenLiveCamera,
  onResetScan,
  isOpenMobile,
  onCloseMobile
}) {
  const menuItems = [
    {
      id: 'scanner',
      label: 'AI Leaf Scanner',
      icon: ScanLine,
      badge: 'Edge / Cloud',
      badgeColor: 'bg-emerald-500 text-white',
      desc: 'Upload or drop leaf photo'
    },
    {
      id: 'camera',
      label: 'Live Camera Capture',
      icon: Camera,
      badge: 'Live HD',
      badgeColor: 'bg-teal-600 text-white',
      desc: 'Real-time camera viewfinder'
    },
    {
      id: 'treatments',
      label: 'Treatment & Cure Library',
      icon: Pill,
      badge: 'Cures',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      desc: 'Organic & chemical solutions'
    },
    {
      id: 'calculator',
      label: 'Dosage & Dilution Calculator',
      icon: Calculator,
      badge: 'Precision',
      badgeColor: 'bg-teal-100 text-teal-800 border border-teal-200',
      desc: 'Acreage & sprayer mixing metrics'
    },
    {
      id: 'radar',
      label: 'Disease Outbreak Radar',
      icon: Radio,
      badge: 'GPS Alert',
      badgeColor: 'bg-rose-500 text-white animate-pulse',
      desc: 'District epidemic tracking & alerts'
    },
    {
      id: 'doctor',
      label: 'AI Plant Doctor (Voice)',
      icon: Bot,
      badge: '7 Languages',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
      desc: 'Multilingual voice AI agronomist'
    },
    {
      id: 'store',
      label: 'Certified Agro-Store',
      icon: ShoppingCart,
      badge: 'Affiliate',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      desc: 'Direct buy agrochemicals & bio'
    },
    {
      id: 'reports',
      label: 'Download Reports',
      icon: FileText,
      badge: reportsCount > 0 ? `${reportsCount}` : 'Print',
      badgeColor: 'bg-blue-100 text-blue-800 border border-blue-200',
      desc: 'Save & print clinical reports'
    },
    {
      id: 'subscription',
      label: 'Subscription Plans',
      icon: Crown,
      badge: isProUser ? 'PRO ACTIVE' : 'UPGRADE',
      badgeColor: isProUser ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
      desc: 'Pro farm & laboratory access'
    },
    {
      id: 'guide',
      label: 'Photography Guide',
      icon: BookOpen,
      desc: 'Tips for high accuracy'
    },
    {
      id: 'history',
      label: 'Scan History',
      icon: History,
      badge: historyCount > 0 ? `${historyCount}` : null,
      desc: 'Past diagnostic logs'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-xl border-r border-emerald-100/90 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-emerald-100/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-heading text-lg font-extrabold tracking-tight text-slate-900">
                    FloraScan<span className="text-emerald-600">.ai</span>
                  </h1>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    v4.2
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Autonomous Plant Pathology
                </p>
              </div>
            </div>

            {/* Quick Reset Scan Icon */}
            <button
              onClick={() => {
                onResetScan();
                onCloseMobile();
              }}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
              title="Start Clean Scan"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Core Diagnostic Modules
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 text-left group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                      : 'text-slate-600 hover:bg-emerald-50/70 hover:text-emerald-950 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-50 text-emerald-700 group-hover:bg-white group-hover:text-emerald-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] truncate leading-tight mt-0.5 ${
                          isActive ? 'text-emerald-100/90' : 'text-slate-400'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-1.5 ${
                        isActive ? 'bg-white text-emerald-900' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Account */}
        <div className="p-4 border-t border-emerald-100/80 bg-slate-50/60">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-emerald-100/90 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                FS
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-800 block truncate">
                  Dr. Rajesh Sharma
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {isProUser ? 'Pro Agronomist' : 'Kisan Free Plan'}
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
