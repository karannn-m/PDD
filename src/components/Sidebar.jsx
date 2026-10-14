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
  Printer
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
  // Line-by-line options in the exact order requested:
  // 1st: AI Leaf Scanner
  // 2nd: Live Camera Capture
  // 3rd: Treatment & Cure Library
  // 4th: AI Plant Doctor (with Voice Assistant)
  // 5th: Download Reports (Replaces Health Analytics)
  // 6th: Subscription Plans
  // 7th: Photography Guide
  // LAST: Scan History
  const menuItems = [
    {
      id: 'scanner',
      label: 'AI Leaf Scanner',
      icon: ScanLine,
      badge: '1st',
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
      id: 'doctor',
      label: 'AI Plant Doctor',
      icon: Bot,
      badge: 'Voice AI',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300',
      desc: 'Voice & text agronomy assistant'
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
        <div className="p-5 border-b border-emerald-100/80">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              onSelectTab('scanner');
              if (isOpenMobile) onCloseMobile();
            }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5 h-5 -rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xl font-bold bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
                  FloraScan<span className="text-emerald-500">.ai</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Plant Disease Detector & Care Hub
              </p>
            </div>
          </div>
        </div>

        {/* Quick New Scan Action Button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => {
              onResetScan();
              onSelectTab('scanner');
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Leaf Scan</span>
          </button>
        </div>

        {/* Navigation Menu (Line by Line Options Ordered Strictly) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Dashboard Options
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'camera') {
                    onOpenLiveCamera();
                  } else {
                    onSelectTab(item.id);
                  }
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-left font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/70 border border-transparent hover:border-emerald-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold block truncate">
                      {item.label}
                    </span>
                    <span
                      className={`text-[10px] block truncate ${
                        isActive ? 'text-emerald-100' : 'text-slate-400 group-hover:text-slate-500'
                      }`}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isActive
                        ? 'bg-white text-emerald-800'
                        : item.badgeColor || 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Status & Plan Badge */}
        <div className="p-4 border-t border-emerald-100/80 bg-emerald-50/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700">
                {isProUser ? 'Farm Pro License' : 'Free Agronomy Tier'}
              </span>
            </div>

            <button
              onClick={() => {
                onSelectTab('subscription');
                if (isOpenMobile) onCloseMobile();
              }}
              className="text-[11px] font-extrabold text-emerald-700 hover:underline"
            >
              {isProUser ? 'Active' : 'Upgrade'}
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-emerald-100 text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Voice AI Assistant</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Mic className="w-3 h-3" /> Ready
              </span>
            </div>
            <div className="flex justify-between">
              <span>Report Printing</span>
              <span className="text-slate-700 flex items-center gap-1">
                <Printer className="w-3 h-3" /> Enabled
              </span>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}
