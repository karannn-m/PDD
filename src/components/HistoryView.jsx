import React, { useState } from 'react';
import {
  History,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function HistoryView({
  history,
  onSelectScan,
  onClearHistory,
  onNewScan
}) {
  const [filter, setFilter] = useState('all');

  const filteredHistory = history.filter((item) => {
    if (filter === 'healthy') return item.severity === 'Healthy';
    if (filter === 'diseased') return item.severity !== 'Healthy';
    return true;
  });

  const healthyCount = history.filter((i) => i.severity === 'Healthy').length;
  const diseasedCount = history.filter((i) => i.severity !== 'Healthy').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Metrics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <History className="w-3.5 h-3.5 text-emerald-600" />
              Session Diagnostic Journal
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800">
              Leaf Diagnostic History
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Review and recall previous leaf scans, confidence scores, and applied treatment regimens.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Journal</span>
            </button>
          )}
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Scans</span>
            <span className="text-2xl font-extrabold font-heading text-emerald-900">{history.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-100/50 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Healthy Crops</span>
            <span className="text-2xl font-extrabold font-heading text-emerald-800">{healthyCount}</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">Diseases Detected</span>
            <span className="text-2xl font-extrabold font-heading text-rose-700">{diseasedCount}</span>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">Avg Confidence</span>
            <span className="text-2xl font-extrabold font-heading text-teal-800">
              {history.length > 0
                ? `${(history.reduce((acc, curr) => acc + (curr.confidence || 95), 0) / history.length).toFixed(1)}%`
                : '—'}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-1">Filter:</span>
          {['all', 'healthy', 'diseased'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? `All Scans (${history.length})` : f === 'healthy' ? `Healthy (${healthyCount})` : `Diseased (${diseasedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <History className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-800">No records found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Scan a leaf using the camera or file upload to generate your first diagnostic history item.
          </p>
          <button
            onClick={onNewScan}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20"
          >
            Start Leaf Scan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((item) => {
            const isHealthy = item.severity === 'Healthy';
            return (
              <div
                key={item.id}
                onClick={() => onSelectScan(item)}
                className="group relative bg-white hover:bg-emerald-50/30 p-4 sm:p-5 rounded-3xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.plantName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                        isHealthy ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {item.plantName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.timestamp || 'Recent'}
                      </span>
                    </div>

                    <h4 className="font-heading text-base sm:text-lg font-bold text-slate-800 truncate group-hover:text-emerald-800 transition-colors">
                      {item.diseaseName}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.summary || item.pathogen}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-500">Certainty:</span>
                    <span className="font-heading font-extrabold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {item.confidence}%
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 text-emerald-700 font-bold group-hover:translate-x-1 transition-transform">
                    <span>View Treatment Protocol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
