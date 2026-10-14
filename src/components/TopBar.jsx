import React from 'react';
import { Menu, Camera, Sparkles, RefreshCw, Activity, ShieldCheck, Plus } from 'lucide-react';

export default function TopBar({
  activeTabTitle,
  onOpenMobileSidebar,
  onOpenLiveCamera,
  onResetScan,
  hasActiveDiagnosis
}) {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 border-b border-emerald-100/90 transition-all">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Mobile Menu Toggle + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">Dashboard /</span>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-800">
                  {activeTabTitle}
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                AI Leaf Pathology & Automated Treatment Protocols
              </p>
            </div>
          </div>

          {/* Right: Quick Live Camera & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Camera Quick Button */}
            <button
              onClick={onOpenLiveCamera}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all active:scale-95 shadow-2xs"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">Live Camera</span>
              <span className="relative flex h-2 w-2 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            {/* New Scan Reset */}
            <button
              onClick={onResetScan}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Scan</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
