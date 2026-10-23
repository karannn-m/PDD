import React from 'react';
import {
  ScanLine,
  Camera,
  Pill,
  Bot,
  FileText,
  BookOpen,
  History,
  Leaf,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
  Radio,
  Calculator,
  ShoppingCart,
  User,
  Tractor,
  Sprout,
  Sun,
  Moon
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
  onCloseMobile,
  currentUser = null,
  onOpenAuthModal,
  theme = 'light',
  onToggleTheme
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
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
      desc: 'Organic & chemical solutions'
    },
    {
      id: 'calculator',
      label: 'Dosage & Dilution Calculator',
      icon: Calculator,
      badge: 'Precision',
      badgeColor: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800',
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
      badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
      desc: 'Multilingual voice AI agronomist'
    },
    {
      id: 'store',
      label: 'Certified Agro-Store',
      icon: ShoppingCart,
      badge: 'Affiliate',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
      desc: 'Direct buy agrochemicals & bio'
    },
    {
      id: 'reports',
      label: 'Download Reports',
      icon: FileText,
      badge: reportsCount > 0 ? `${reportsCount}` : 'Print',
      badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
      desc: 'Save & print clinical reports'
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
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-emerald-100/90 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-lg lg:shadow-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-emerald-100/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-heading text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    FloraScan
                  </h1>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    v4.5
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Reset Scan Icon */}
            <button
              onClick={() => {
                onResetScan();
                onCloseMobile();
              }}
              className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Start Clean Scan"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                      : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50/70 dark:hover:bg-slate-800/80 hover:text-emerald-950 dark:hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-emerald-800'
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
                          isActive ? 'text-emerald-100/90' : 'text-slate-400 dark:text-slate-500'
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

        {/* Footer info & Account Card */}
        <div className="p-4 border-t border-emerald-100/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-2">
          
          {/* USER PROFILE / LOGIN TRIGGER CARD */}
          <button
            onClick={() => {
              onOpenAuthModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full text-left flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-100/90 dark:border-slate-700 shadow-2xs hover:border-emerald-300 dark:hover:border-slate-600 transition-all"
          >
            {currentUser ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0 ${
                  currentUser.tier === 'farmer' ? 'bg-amber-600' : 'bg-emerald-600'
                }`}>
                  {currentUser.avatarInitial || 'FS'}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    {currentUser.tier === 'farmer' ? (
                      <Tractor className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Sprout className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span>{currentUser.badge}</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-700 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                    Join FloraScan Hub
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Farmer or User Sign In
                  </span>
                </div>
              </div>
            )}

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          </button>

          {/* Quick Theme Toggle in Sidebar */}
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Interface Theme:
            </span>
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}
