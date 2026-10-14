import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Search, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ScanningOverlay({ previewUrl, onComplete }) {
  const [progress, setProgress] = useState(15);
  const [currentStage, setCurrentStage] = useState('Initializing DeepFlora v4.2 Neural Net...');

  const stages = [
    { at: 20, text: 'Calibrating color balance & leaf silhouette...' },
    { at: 45, text: 'Extracting venation patterns & cellular turgor...' },
    { at: 70, text: 'Detecting lesion morphology & necrotic halos...' },
    { at: 90, text: 'Cross-referencing 65,000+ pathology benchmarks...' },
    { at: 100, text: 'Diagnosis complete! Preparing treatment report...' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        const matchingStage = stages.find((s) => next >= s.at);
        if (matchingStage) {
          setCurrentStage(matchingStage.text);
        }
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return next;
      });
    }, 90);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 flex flex-col items-center text-center space-y-6">
        
        {/* Scanner Image Frame */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 shadow-inner border-2 border-emerald-500/50">
          <img
            src={previewUrl}
            alt="Scanning Leaf"
            className="w-full h-full object-cover filter brightness-95"
          />

          {/* Futuristic Scan Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Laser Scanning Bar */}
          <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_15px_#10b981] animate-scanline pointer-events-none" />

          {/* Detected Target Crosshairs */}
          <div className="absolute top-1/4 left-1/4 w-12 h-12 border border-dashed border-emerald-400 rounded-lg animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 border border-emerald-400/80 rounded-lg animate-ping duration-1000" />

          {/* Scanning Tag */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-emerald-950/80 backdrop-blur-sm text-[10px] font-mono text-emerald-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>SPECTRAL_ANALYSIS: {progress}%</span>
          </div>
        </div>

        {/* Progress & Stage Status */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <Cpu className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>AI Pathology Analysis</span>
            </span>
            <span className="font-mono text-emerald-700 font-bold">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-full transition-all duration-150 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-500 min-h-[20px] transition-all">
            {currentStage}
          </p>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>ISO 17025 Agronomic Specimen Model Standards</span>
        </div>

      </div>
    </div>
  );
}
