import React, { useState, useEffect } from 'react';
import { Menu, Camera, Sparkles, RefreshCw, Activity, ShieldCheck, Plus, Wifi, WifiOff, Cpu, Radio } from 'lucide-react';
import { checkIsOffline } from '../services/edgeModelService';

export default function TopBar({
  activeTabTitle,
  onOpenMobileSidebar,
  onOpenLiveCamera,
  onResetScan,
  onOpenRadar,
  hasActiveDiagnosis
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
                AI Leaf Pathology & Precision Agronomic Telemetry
              </p>
            </div>
          </div>

          {/* Right: Engine Status Badge, Quick Camera & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Network / Edge Status Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-600">
              {isOffline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="font-bold text-amber-700">Offline Edge TFLite</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-700">Cloud GPU / Edge Hybrid</span>
                </>
              )}
            </div>

            {/* Radar Shortcut Button */}
            {onOpenRadar && (
              <button
                onClick={onOpenRadar}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-emerald-400 transition-all active:scale-95 shadow-2xs"
                title="Open Geospatial Outbreak Radar"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Outbreak Radar</span>
              </button>
            )}

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
