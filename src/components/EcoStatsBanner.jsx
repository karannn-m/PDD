import React from 'react';
import { ShieldCheck, Sprout, Leaf, Zap, HeartHandshake, Award } from 'lucide-react';

export default function EcoStatsBanner() {
  const stats = [
    {
      icon: Award,
      value: '98.7%',
      label: 'Model Accuracy',
      desc: 'Validated against 65k+ agronomy lab specimens'
    },
    {
      icon: Sprout,
      value: '120+',
      label: 'Crops & Flora',
      desc: 'Vegetables, fruits, herbs & indoor ornamentals'
    },
    {
      icon: Leaf,
      value: '100% Eco',
      label: 'Organic First',
      desc: 'Prioritizing biological remedies & soil health'
    },
    {
      icon: Zap,
      value: '< 1.5s',
      label: 'Realtime Latency',
      desc: 'Instant in-browser neural diagnosis'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-12 px-4">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-400/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sustainable Agriculture & Gardening Initiative</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Smarter Plant Health. Gentler on the Earth.
            </h3>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              FloraScan AI pairs deep vision neural models with agroecological guidance to catch disease outbreaks early, minimize pesticide runoff, and safeguard pollinator ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-emerald-700/50">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Icon className="w-4 h-4" />
                    <span className="text-xl sm:text-2xl font-extrabold font-heading text-white">
                      {s.value}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-200">
                    {s.label}
                  </p>
                  <p className="text-[11px] text-emerald-300/70 leading-normal">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
