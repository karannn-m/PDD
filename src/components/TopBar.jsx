import React, { useState, useEffect } from 'react';
import {
  Menu,
  Camera,
  Plus,
  Radio,
  Sun,
  Moon,
  User,
  Tractor,
  Sprout,
  ShieldCheck
} from 'lucide-react';
import { checkIsOffline } from '../services/edgeModelService';

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
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleStatus = () => setIsOffline(checkIsOffline());
    handleStatus();
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

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
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">Dashboard /</span>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                  {activeTabTitle}
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                AI Leaf Pathology & Precision Agronomic Telemetry
              </p>
            </div>
          </div>

          {/* Right: Theme Toggle, User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Network / Edge Status Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              {isOffline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="font-bold text-amber-700 dark:text-amber-400">Offline Edge TFLite</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-200">Cloud GPU / Edge Hybrid</span>
                </>
              )}
            </div>

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

            {/* Radar Shortcut Button */}
            {onOpenRadar && (
              <button
                onClick={onOpenRadar}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-emerald-400 border border-slate-800 dark:border-slate-700 transition-all active:scale-95 shadow-2xs"
                title="Open Geospatial Outbreak Radar"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden md:inline">Outbreak Radar</span>
              </button>
            )}

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

            {/* TWO-TIER LOGIN / USER PROFILE BUTTON */}
            <button
              onClick={onOpenAuthModal}
              className={`inline-flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl text-xs font-bold border transition-all active:scale-95 ${
                currentUser
                  ? currentUser.tier === 'farmer'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800/80 shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                  : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white border-slate-700 shadow-sm'
              }`}
              title={currentUser ? `Logged in as ${currentUser.name}` : 'Sign In as Farmer or User'}
            >
              {currentUser ? (
                <>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                    currentUser.tier === 'farmer' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {currentUser.avatarInitial || (currentUser.tier === 'farmer' ? '🌾' : '🌱')}
                  </div>
                  <div className="hidden md:block text-left leading-tight">
                    <span className="block font-bold truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-semibold opacity-75 flex items-center gap-0.5">
                      {currentUser.tier === 'farmer' ? (
                        <Tractor className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                      ) : (
                        <Sprout className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                      )}
                      <span>{currentUser.tier === 'farmer' ? 'Farmer' : 'User'}</span>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
