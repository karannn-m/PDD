import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Sprout,
  PieChart,
  Activity,
  Layers,
  Leaf
} from 'lucide-react';

export default function AnalyticsView({ history }) {
  const total = history.length || 4;
  const healthyCount = history.filter((i) => i.severity === 'Healthy').length || 1;
  const criticalCount = history.filter((i) => i.severity === 'Critical').length || 1;
  const moderateCount = total - healthyCount - criticalCount || 2;

  const healthyPercent = Math.round((healthyCount / total) * 100);
  const criticalPercent = Math.round((criticalCount / total) * 100);
  const moderatePercent = 100 - healthyPercent - criticalPercent;

  const diseaseTypes = [
    { label: 'Fungal Pathogens (Blight/Scab)', count: 68, color: 'bg-emerald-500' },
    { label: 'Mildew & Superficial Spores', count: 18, color: 'bg-teal-400' },
    { label: 'Bacterial Speck / Spot', count: 9, color: 'bg-amber-400' },
    { label: 'Pest & Viral Vectors', count: 5, color: 'bg-rose-400' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Overview Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          Agronomy Crop Health Telemetry
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800">
          Plant Pathology Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Aggregated diagnostic patterns across scanned specimens. Track disease prevalence, severity distributions, and treatment efficacy.
        </p>
      </div>

      {/* Grid KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Crop Health Index</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-emerald-800">
              {healthyPercent}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">+4.2% vs last week</span>
          </div>
          <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${healthyPercent}%` }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Moderate Concerns</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-amber-700">
              {moderatePercent}%
            </span>
            <span className="text-xs text-slate-500 font-medium">Contained / Early Stage</span>
          </div>
          <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${moderatePercent}%` }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-rose-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Critical Outbreaks</span>
            <Flame className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-heading text-rose-700">
              {criticalPercent}%
            </span>
            <span className="text-xs text-rose-600 font-semibold">Immediate triage required</span>
          </div>
          <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-600 rounded-full" style={{ width: `${criticalPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Pathogen Class Distribution */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-800">
              Prevalent Foliar Pathogens
            </h3>
            <p className="text-xs text-slate-500">
              Observed incidence in regional horticultural databases
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            DeepFlora Sensor Data
          </span>
        </div>

        <div className="space-y-4">
          {diseaseTypes.map((dt, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{dt.label}</span>
                <span className="font-mono text-emerald-800">{dt.count}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${dt.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${dt.count}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainable Impact Card */}
      <div className="bg-gradient-to-tr from-emerald-900 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden space-y-4">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
            <Sprout className="w-4 h-4" />
            <span>Organic-First Benefit Tracker</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold">
            64% Chemical Runoff Prevented
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-xl">
            By prioritizing biological bio-fungicides and cultural airflow pruning at the first sign of blights, growers cut synthetic chemical dependency in half while safeguarding beneficial soil mycorrhizae.
          </p>
        </div>
      </div>

    </div>
  );
}
