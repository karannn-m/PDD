import React, { useState } from 'react';
import { SAMPLE_DIAGNOSES } from '../data/plantData';
import {
  Search,
  Pill,
  Leaf,
  FlaskConical,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ExternalLink,
  Sprout
} from 'lucide-react';

export default function TreatmentLibrary({ onSelectSpecimen, onAskDoctorAbout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [expandedId, setExpandedId] = useState(SAMPLE_DIAGNOSES[0].id);

  const crops = ['All', 'Tomato', 'Apple Tree', 'Cucumber / Squash', 'Monstera Deliciosa'];

  const filteredDiagnoses = SAMPLE_DIAGNOSES.filter((d) => {
    const matchesCrop = selectedCrop === 'All' || d.plantName.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesSearch =
      d.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.pathogen.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Pill className="w-3.5 h-3.5 text-emerald-600" />
              Agronomy Disease & Treatment Codex
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800">
              Plant Disease Treatments & Cures
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Curated agronomic protocols for managing and eradicating foliar pathogens. Includes organic remedies, biological fungicides, and safe chemical interventions.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by disease name, pathogen, or plant..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 text-xs sm:text-sm bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {crops.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCrop === crop
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disease Treatment Accordion List */}
      <div className="space-y-4">
        {filteredDiagnoses.map((item) => {
          const isExpanded = expandedId === item.id;
          const isHealthy = item.severity === 'Healthy';

          return (
            <div
              key={item.id}
              className={`rounded-3xl bg-white border transition-all duration-200 overflow-hidden shadow-xs ${
                isExpanded ? 'border-emerald-300 ring-2 ring-emerald-50 shadow-md' : 'border-slate-200 hover:border-emerald-200'
              }`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 select-none hover:bg-emerald-50/30 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.image}
                    alt={item.plantName}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {item.plantName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isHealthy
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.severity}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                      <span className="text-xs text-slate-400 hidden sm:inline font-mono">{item.pathogen}</span>
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-800 truncate">
                      {item.diseaseName}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-emerald-700 hidden sm:inline">
                    {item.organicTreatments.length + item.chemicalTreatments.length} Treatments Available
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Accordion Expanded Body */}
              {isExpanded && (
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-6 animate-in fade-in duration-200">
                  
                  {/* Summary & Pathology Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/70 text-xs">
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Pathogen Class</span>
                      <span className="font-semibold text-slate-800">{item.category}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Spread Risk</span>
                      <span className="font-semibold text-slate-800">{item.spreadRisk}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Progression Velocity</span>
                      <span className="font-semibold text-slate-800">{item.progressionRate}</span>
                    </div>
                  </div>

                  {/* Bulleted Organic Remedies */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 font-heading font-bold text-sm">
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <span>Recommended Organic & Biological Remedies</span>
                    </div>
                    <div className="space-y-2">
                      {item.organicTreatments.map((ot, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/60 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{ot}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bulleted Targeted Chemical Solutions */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-teal-800 font-heading font-bold text-sm">
                      <FlaskConical className="w-4 h-4 text-teal-600" />
                      <span>Targeted Agronomic / Chemical Interventions</span>
                    </div>
                    <div className="space-y-2">
                      {item.chemicalTreatments.map((ct, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-teal-50/40 border border-teal-100/60 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{ct}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preventative Measures */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-700 font-heading font-bold text-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Long-term Cultural Controls & Prevention</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {item.prevention.map((pv, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{pv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => onAskDoctorAbout(item)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Ask AI Doctor about this disease
                    </button>

                    <button
                      onClick={() => onSelectSpecimen(item)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      <span>Load Specimen for Diagnosis</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
