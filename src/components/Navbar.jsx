import React from 'react';
import { Leaf, Sparkles, Activity, BookOpen, RefreshCw, History, ShieldCheck } from 'lucide-react';

export default function Navbar({ onReset, historyCount, onOpenHistory, onOpenGuide }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-emerald-100/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onReset}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
                  FloraScan
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  v4.2 AI
                </span>
              </div>
              <p className="text-xs text-emerald-900/60 hidden sm:block font-medium">
                Botanical Pathology & Leaf Disease Diagnostics
              </p>
            </div>
          </div>

          {/* Center Info / Model Status (Desktop) */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/70 border border-emerald-200/60 text-xs font-medium text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Vision Engine: <strong>DeepFlora Net-50</strong></span>
            <span className="text-emerald-400">|</span>
            <span className="text-emerald-700">98.7% Certified Accuracy</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-emerald-800 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200"
              title="Photography tips for best detection"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Photo Guide</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-emerald-800 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200"
              title="Recent session scan history"
            >
              <History className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm shadow-emerald-600/30 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Scan</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
