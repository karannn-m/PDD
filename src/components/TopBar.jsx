import React from 'react';
import {
  Menu,
  Camera,
  Plus,
  Sun,
  Moon
} from 'lucide-react';

export default function TopBar({
  activeTabTitle,
  onOpenMobileSidebar,
  onOpenLiveCamera,
  onResetScan,
  onOpenRadar,
  theme = 'light',
  onToggleTheme,
  currentUser = null,
  onOpenAuthModal
}) {

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/90 border-b border-emerald-100/90 dark:border-slate-800 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Mobile Menu Toggle + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                {activeTabTitle}
              </h2>
            </div>
          </div>

          {/* Right: Theme Toggle, User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* LIGHT / DARK THEME TOGGLE BUTTON */}
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 shadow-2xs transition-all active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-90 duration-300" />
              )}
            </button>

            {/* Live Camera Quick Button */}
            <button
              onClick={onOpenLiveCamera}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition-all active:scale-95 shadow-2xs"
            >
              <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold hidden sm:inline">Camera</span>
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
