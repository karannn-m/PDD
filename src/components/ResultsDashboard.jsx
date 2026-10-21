import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Leaf,
  FlaskConical,
  Sprout,
  Calendar,
  Share2,
  Printer,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  Activity,
  Layers,
  Thermometer,
  Wind,
  Info,
  ChevronRight,
  Calculator,
  ShoppingCart,
  ExternalLink,
  Zap,
  Tag,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import DosageCalculator from './DosageCalculator';
import AgroStoreModal from './AgroStoreModal';
import {
  getRecommendedProductsForDisease,
  generateAffiliateUrl,
  recordAffiliateClick
} from '../services/affiliateService';

export default function ResultsDashboard({
  diagnosis,
  previewUrl,
  onReset,
  onAskDoctor
}) {
  const [activeTab, setActiveTab] = useState('organic'); // organic, chemical, prevention, calculator
  const [copied, setCopied] = useState(false);
  const [checkedActions, setCheckedActions] = useState({});
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [storeInitialProduct, setStoreInitialProduct] = useState(null);

  const isHealthy = diagnosis.severity === 'Healthy';
  const matchedProducts = getRecommendedProductsForDisease(diagnosis.diseaseName);

  useEffect(() => {
    // If plant is healthy, trigger celebratory eco-friendly confetti!
    if (isHealthy) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24']
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isHealthy]);

  const toggleAction = (idx) => {
    setCheckedActions((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopyReport = () => {
    const reportText = `FloraScan AI Pathology Report
Plant: ${diagnosis.plantName} (${diagnosis.botanicalName})
Diagnosis: ${diagnosis.diseaseName}
Confidence: ${diagnosis.confidence}%
Severity: ${diagnosis.severity}
Affected Area: ${diagnosis.affectedArea}
Pathogen: ${diagnosis.pathogen}

Recommended Organic Treatments:
${diagnosis.organicTreatments.map((t) => `• ${t}`).join('\n')}

Preventive Measures:
${diagnosis.prevention.map((p) => `• ${p}`).join('\n')}
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenProductStore = (product) => {
    setStoreInitialProduct(product);
    setIsStoreOpen(true);
  };

  const handleDirectBuy = (product, e) => {
    e.stopPropagation();
    recordAffiliateClick(product, 'ResultsDashboardList');
    const redirectUrl = generateAffiliateUrl({
      productId: product.id,
      partner: product.partner,
      disease: diagnosis.diseaseName
    });
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  // Severity theme tokens
  const severityBadge = {
    Healthy: {
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badgeBg: 'bg-emerald-600 text-white',
      ring: 'text-emerald-500',
      icon: ShieldCheck,
      gradient: 'from-emerald-600 to-teal-500'
    },
    Moderate: {
      bg: 'bg-amber-100 text-amber-800 border-amber-300',
      badgeBg: 'bg-amber-600 text-white',
      ring: 'text-amber-500',
      icon: AlertTriangle,
      gradient: 'from-amber-600 to-yellow-500'
    },
    Critical: {
      bg: 'bg-rose-100 text-rose-800 border-rose-300',
      badgeBg: 'bg-rose-600 text-white',
      ring: 'text-rose-500',
      icon: Flame,
      gradient: 'from-rose-600 to-red-500'
    }
  }[diagnosis.severity] || {
    bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badgeBg: 'bg-emerald-600 text-white',
    ring: 'text-emerald-500',
    icon: ShieldCheck,
    gradient: 'from-emerald-600 to-teal-500'
  };

  const SeverityIcon = severityBadge.icon;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/70 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-emerald-100 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 flex-wrap">
          <span className="font-semibold text-emerald-800">Diagnostic ID:</span>
          <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md text-xs">{diagnosis.id}</span>
          
          {/* Edge AI Telemetry Badge if run offline */}
          {diagnosis.isOfflineInference && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Edge AI Model ({diagnosis.inferenceLatencyMs}ms - Offline TFLite)</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStoreOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Certified Agro-Store</span>
            <span className="sm:hidden">Store</span>
          </button>

          <button
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Scan Another</span>
          </button>
        </div>
      </div>

      {/* Hero Diagnosis Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-emerald-100 shadow-xl shadow-emerald-950/5">
        
        {/* Subtle decorative background gradient */}
        <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${severityBadge.gradient} opacity-10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20`} />

        <div className="p-6 sm:p-8 lg:p-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Specimen Photo with Diagnostic Overlay */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-[280px] rounded-3xl overflow-hidden shadow-lg border-2 border-white ring-4 ring-emerald-50">
                <img
                  src={previewUrl}
                  alt={diagnosis.plantName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {/* Overlay labels */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-semibold text-emerald-300">Specimen Examined</p>
                  <p className="text-sm font-bold truncate">{diagnosis.plantName}</p>
                </div>

                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${severityBadge.badgeBg} shadow-md`}>
                    <SeverityIcon className="w-3.5 h-3.5" />
                    {diagnosis.severity}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Disease Title, Classification & Confidence */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 font-semibold text-xs border border-emerald-200">
                    {diagnosis.plantName}
                  </span>
                  <span className="text-xs text-slate-500 italic">
                    ({diagnosis.botanicalName})
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-500">
                    Category: {diagnosis.category}
                  </span>
                </div>

                <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                  {diagnosis.diseaseName}
                </h1>
                
                <p className="text-sm text-slate-600 mt-1 font-mono">
                  Pathogen: <span className="text-emerald-700 font-semibold">{diagnosis.pathogen}</span>
                </p>
              </div>

              {/* Confidence Score Gauge / Bar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Diagnostic Confidence Score
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-800">
                      {diagnosis.confidence}%
                    </span>
                    <span className="ml-2 text-xs font-semibold text-emerald-600">
                      (High Certainty)
                    </span>
                  </div>

                  <div className="w-14 h-14 sm:w-16 sm:h-16 relative flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-emerald-200"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={severityBadge.ring}
                        strokeDasharray={`${diagnosis.confidence}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-bold text-emerald-900">
                      {Math.round(diagnosis.confidence)}%
                    </span>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                    style={{ width: `${diagnosis.confidence}%` }}
                  />
                </div>

                {/* Secondary Matches for AI Depth */}
                {diagnosis.secondaryMatches && diagnosis.secondaryMatches.length > 0 && (
                  <div className="pt-2 border-t border-emerald-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">Differential Diagnosis:</span>
                    {diagnosis.secondaryMatches.map((m, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1">
                        <span>{m.name}</span>
                        <span className="font-mono text-emerald-700 font-bold">({m.confidence}%)</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {diagnosis.summary}
              </p>

            </div>

          </div>
        </div>

        {/* 3 Metric Badges Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-emerald-100 bg-emerald-50/30 border-t border-emerald-100 text-slate-700">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Leaf Area Affected</span>
              <span className="text-sm font-bold text-slate-800">{diagnosis.affectedArea}</span>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Spread Risk</span>
              <span className="text-sm font-bold text-slate-800">{diagnosis.spreadRisk}</span>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Progression Velocity</span>
              <span className="text-sm font-bold text-slate-800">{diagnosis.progressionRate}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Symptoms & Visual Markers Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-md shadow-emerald-950/5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-800">
              Detected Symptoms & Pathological Markers
            </h3>
            <p className="text-xs text-slate-500">
              Correlated with machine-vision visual feature extraction
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {diagnosis.symptoms.map((symptom, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/60"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
                {symptom}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Recommendations Hub (Interactive Tabs) */}
      <div className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-xl shadow-emerald-950/5">
        
        {/* Hub Header & Navigation Tabs */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-emerald-50/50 to-white border-b border-emerald-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                Actionable Agronomy Plan
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-800">
                Bulleted Treatment, Remedies & Agro-Store Links
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Click any recommendation to track it in your crop care checklist or order certified inputs.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsStoreOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Agro-Store Inputs</span>
              </button>

              <button
                onClick={onAskDoctor}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-teal-600/20 active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask Plant Doctor AI</span>
              </button>
            </div>
          </div>

          {/* Quick 4-Step Triage if Disease Detected */}
          {!isHealthy && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-heading font-bold text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Immediate 4-Step Disease Triage Protocol</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs text-rose-950">
                <div className="p-2.5 rounded-xl bg-white/80 border border-rose-100 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                  <span><strong>Prune & Isolate:</strong> Cut infected leaves immediately and bag them. Do not compost.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-rose-100 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                  <span><strong>Dry Foliage:</strong> Stop overhead sprinklers; water base soil only in early morning.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-rose-100 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                  <span><strong>Apply Remedy:</strong> Spray the selected organic or targeted treatment below.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-rose-100 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
                  <span><strong>Disinfect Tools:</strong> Wipe shears with 70% alcohol after every cut to stop spread.</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Navigation Pills (Includes 4th Dosage Calculator Tab!) */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200">
            <button
              onClick={() => setActiveTab('organic')}
              className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'organic'
                  ? 'bg-white text-emerald-800 shadow-sm border border-emerald-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Organic Remedies</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {diagnosis.organicTreatments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('chemical')}
              className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'chemical'
                  ? 'bg-white text-teal-800 shadow-sm border border-teal-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-teal-600" />
              <span>Targeted / Chemical</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 font-bold">
                {diagnosis.chemicalTreatments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('prevention')}
              className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'prevention'
                  ? 'bg-white text-emerald-800 shadow-sm border border-emerald-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Preventive Culture</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {diagnosis.prevention.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'calculator'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Calculator className="w-4 h-4 text-amber-300" />
              <span>Dosage Calculator</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-bold">
                Live
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="p-6 sm:p-8">
          
          {/* Organic Tab with Direct Store Links */}
          {activeTab === 'organic' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-emerald-800">
                  Eco-Friendly & Non-Toxic Applications
                </span>
                <span>Click bullet to toggle completion</span>
              </div>

              <div className="space-y-3">
                {diagnosis.organicTreatments.map((treatment, idx) => {
                  const key = `organic-${idx}`;
                  const isDone = !!checkedActions[key];
                  
                  // Pick corresponding product recommendation if available
                  const matchedProduct = matchedProducts[idx % matchedProducts.length];

                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${
                        isDone
                          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                          : 'bg-white hover:bg-emerald-50/40 border-slate-200 hover:border-emerald-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 cursor-pointer" onClick={() => toggleAction(key)}>
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div className="flex-1">
                          <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDone ? 'line-through text-emerald-800/70' : ''}`}>
                            {treatment}
                          </p>
                        </div>

                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-md self-center hidden sm:inline">
                          Organic
                        </span>
                      </div>

                      {/* Direct Store Input Link Strip for this treatment */}
                      {matchedProduct && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/60 p-3 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-semibold text-slate-800">{matchedProduct.title}</span>
                            <span className="text-emerald-700 font-bold">₹{matchedProduct.priceInr}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleDirectBuy(matchedProduct, e)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                            >
                              <span>Buy on {matchedProduct.partner}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            
                            <button
                              onClick={() => handleOpenProductStore(matchedProduct)}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-900 leading-relaxed">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Eco Tip:</strong> Organic and biological fungicides perform best when applied preventatively or at the earliest hint of symptoms, and should be reapplied after heavy rains.
                </span>
              </div>
            </div>
          )}

          {/* Chemical Tab with Direct Store Links */}
          {activeTab === 'chemical' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-teal-800">
                  Targeted Agronomic Active Ingredients
                </span>
                <span>Click bullet to toggle completion</span>
              </div>

              <div className="space-y-3">
                {diagnosis.chemicalTreatments.map((treatment, idx) => {
                  const key = `chemical-${idx}`;
                  const isDone = !!checkedActions[key];
                  const matchedProduct = matchedProducts[(idx + 1) % matchedProducts.length];

                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${
                        isDone
                          ? 'bg-teal-50/90 border-teal-300 text-teal-950'
                          : 'bg-white hover:bg-teal-50/40 border-slate-200 hover:border-teal-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 cursor-pointer" onClick={() => toggleAction(key)}>
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                            isDone
                              ? 'bg-teal-600 border-teal-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div className="flex-1">
                          <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDone ? 'line-through text-teal-800/70' : ''}`}>
                            {treatment}
                          </p>
                        </div>

                        <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-md self-center hidden sm:inline">
                          Targeted
                        </span>
                      </div>

                      {/* Store Card Strip */}
                      {matchedProduct && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/60 p-3 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-teal-600" />
                            <span className="font-semibold text-slate-800">{matchedProduct.title}</span>
                            <span className="text-teal-700 font-bold">₹{matchedProduct.priceInr}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleDirectBuy(matchedProduct, e)}
                              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                            >
                              <span>Buy on {matchedProduct.partner}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            
                            <button
                              onClick={() => handleOpenProductStore(matchedProduct)}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Safety Notice:</strong> Always wear protective gloves and respirator when preparing synthetic sprays. Observe local pre-harvest intervals (PHI) before consuming edible produce.
                </span>
              </div>
            </div>
          )}

          {/* Prevention Tab */}
          {activeTab === 'prevention' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-emerald-800">
                  Cultural Practices & Crop Sanitation
                </span>
                <span>Click bullet to toggle completion</span>
              </div>

              <div className="space-y-3">
                {diagnosis.prevention.map((treatment, idx) => {
                  const key = `prevention-${idx}`;
                  const isDone = !!checkedActions[key];
                  return (
                    <div
                      key={key}
                      onClick={() => toggleAction(key)}
                      className={`flex items-start gap-3.5 p-4 rounded-2xl cursor-pointer border transition-all duration-200 ${
                        isDone
                          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                          : 'bg-white hover:bg-emerald-50/40 border-slate-200 hover:border-emerald-200 text-slate-700'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1">
                        <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDone ? 'line-through text-emerald-800/70' : ''}`}>
                          {treatment}
                        </p>
                      </div>

                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-md self-center hidden sm:inline">
                        Prevention
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feature 4: Interactive Dosage & Remedy Calculator Tab */}
          {activeTab === 'calculator' && (
            <div className="animate-in fade-in duration-300">
              <DosageCalculator
                initialDiseaseName={diagnosis.diseaseName}
                onOrderProduct={(remedy) => {
                  setIsStoreOpen(true);
                }}
              />
            </div>
          )}

        </div>

      </div>

      {/* Direct Agro-Store & Affiliate Modal */}
      <AgroStoreModal
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        diagnosis={diagnosis}
        initialProduct={storeInitialProduct}
      />

      {/* Floating Bottom Quick Action on Mobile */}
      <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-950/20 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Upload Another Leaf</span>
        </button>
      </div>

    </div>
  );
}
