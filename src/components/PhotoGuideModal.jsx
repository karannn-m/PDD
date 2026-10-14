import React from 'react';
import { X, Camera, Sun, Focus, Scissors, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function PhotoGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-emerald-100 p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Camera className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-800 text-lg">
                Leaf Photography Best Practices
              </h3>
              <p className="text-xs text-slate-500">
                Ensure 98%+ AI diagnostic accuracy with clean specimens
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Sun className="w-4 h-4 text-emerald-600" />
              <span>Natural, Soft Lighting</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Take pictures in daylight or soft shade. Avoid harsh camera flashes or dark indoor shadows that distort leaf discoloration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Focus className="w-4 h-4 text-emerald-600" />
              <span>Macro Sharp Focus</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hold the camera 10–20 cm away and tap the screen to focus on the spots or lesions. Make sure leaf vein detail is crisp.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Scissors className="w-4 h-4 text-emerald-600" />
              <span>Single Leaf Specimen</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Isolate one representative leaf on a plain neutral background (your hand, wood, or paper) rather than whole garden foliage.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <AlertOctagon className="w-4 h-4 text-emerald-600" />
              <span>Both Sides Matter</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Many pathogens (like Downy Mildew or Rust) hide mycelium under the leaf. Check both dorsal and ventral surfaces.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/25"
        >
          Got it, Ready to Scan!
        </button>

      </div>
    </div>
  );
}
