import React from 'react';
import { Leaf, Heart, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-emerald-100/80 bg-white/60 py-8 px-4 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <span className="font-heading font-bold text-slate-700">
            FloraScan AI
          </span>
          <span>— Plant Disease Detection & Eco Care</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Trained on Agronomic PathoSets</span>
          <span>•</span>
          <span>React 19 & Tailwind CSS</span>
          <span>•</span>
          <span className="text-emerald-700 font-medium">Free Open Diagnostic</span>
        </div>

      </div>
    </footer>
  );
}
