import React from 'react';
import { X, History, Trash2, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function HistoryDrawer({ isOpen, onClose, history, onSelectScan, onClearHistory }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-emerald-100">
          
          {/* Header */}
          <div className="p-5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-800 text-base">
                  Recent Leaf Scans
                </h3>
                <p className="text-xs text-slate-500">
                  {history.length} {history.length === 1 ? 'record' : 'records'} saved in this session
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <History className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-slate-600">No scans yet</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Upload a leaf photo or test with our verified specimens to see your diagnostics saved here.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectScan(item);
                    onClose();
                  }}
                  className="group flex items-center gap-3.5 p-3 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-sm cursor-pointer transition-all duration-200"
                >
                  <img
                    src={item.image}
                    alt={item.plantName}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {item.plantName}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        item.severity === 'Healthy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.severity}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium truncate">
                      {item.diseaseName}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="text-emerald-700 font-bold">{item.confidence}%</span>
                      <span>•</span>
                      <span>{item.timestamp || 'Just now'}</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {history.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={onClearHistory}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Scan History</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
