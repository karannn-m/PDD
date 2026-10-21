import React, { useState, useId } from 'react';
import {
  Calculator,
  Droplets,
  Sprout,
  FlaskConical,
  Layers,
  Wind,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  ShoppingCart,
  ExternalLink,
  Info,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const REMEDY_DATABASE = [
  {
    id: 'neem-10k',
    name: 'Cold-Pressed Neem Oil (10,000 PPM)',
    type: 'Organic Bio-Fungicide & Insecticide',
    unit: 'ml',
    baseRatePerLiter: 3.5,
    spreaderPerLiter: 0.5,
    phiDays: 0,
    costPerUnitInr: 0.9, // ₹0.9 per ml
    idealTime: 'Late Evening (5:00 PM - 7:00 PM)'
  },
  {
    id: 'bacillus-subtilis',
    name: 'Bacillus subtilis Bio-Fungicide (Serenade)',
    type: 'Biological Fungicide',
    unit: 'ml',
    baseRatePerLiter: 3.0,
    spreaderPerLiter: 0.3,
    phiDays: 0,
    costPerUnitInr: 0.92,
    idealTime: 'Early Morning (6:00 AM - 9:00 AM)'
  },
  {
    id: 'copper-hydroxide',
    name: 'Copper Hydroxide 46.1% WP (Kocide)',
    type: 'Chemical / Contact Protectant',
    unit: 'grams',
    baseRatePerLiter: 2.0,
    spreaderPerLiter: 0.4,
    phiDays: 3,
    costPerUnitInr: 1.28,
    idealTime: 'Calm Morning (Wind < 8 km/h)'
  },
  {
    id: 'mancozeb-75',
    name: 'Mancozeb 75% WP (Dithane M-45)',
    type: 'Chemical Multi-Site Fungicide',
    unit: 'grams',
    baseRatePerLiter: 2.5,
    spreaderPerLiter: 0.5,
    phiDays: 7,
    costPerUnitInr: 0.49,
    idealTime: 'Dry Canopy in Morning'
  },
  {
    id: 'potassium-bicarbonate',
    name: 'Potassium Bicarbonate Eco-Spray',
    type: 'Organic Contact Eradicant',
    unit: 'grams',
    baseRatePerLiter: 4.0,
    spreaderPerLiter: 0.5,
    phiDays: 0,
    costPerUnitInr: 0.75,
    idealTime: 'Sunny Morning'
  }
];

export default function DosageCalculator({
  initialDiseaseName = 'Late Blight',
  onOrderProduct
}) {
  const farmAreaId = useId();
  const potCountId = useId();
  const cropTypeId = useId();
  const severityId = useId();
  const sprayerTypeId = useId();
  const remedySelectId = useId();

  // Mode: 'field' (Acreage/Farm) vs 'garden' (Pots/Containers)
  const [mode, setMode] = useState('field');

  // Field Inputs
  const [areaValue, setAreaValue] = useState(1);
  const [areaUnit, setAreaUnit] = useState('acres'); // acres, hectares, bighas

  // Garden Inputs
  const [potCount, setPotCount] = useState(6);
  const [potSize, setPotSize] = useState('medium'); // small, medium, large

  // Common Inputs
  const [cropType, setCropType] = useState('Tomato');
  const [severity, setSeverity] = useState('moderate'); // preventative, mild, moderate, severe
  const [sprayerType, setSprayerType] = useState('knapsack-16'); // knapsack-16, battery-20, mister-1.5, tractor-400
  const [selectedRemedyId, setSelectedRemedyId] = useState(REMEDY_DATABASE[0].id);
  const [copiedRecipe, setCopiedRecipe] = useState(false);

  // Selected remedy data
  const selectedRemedy =
    REMEDY_DATABASE.find((r) => r.id === selectedRemedyId) || REMEDY_DATABASE[0];

  // Sprayer Tank Sizes (Liters)
  const sprayerCapacities = {
    'knapsack-16': { name: '16L Manual Knapsack Sprayer', capacity: 16 },
    'battery-20': { name: '20L Electric Battery Sprayer', capacity: 20 },
    'mister-1.5': { name: '1.5L Handheld Pressure Mister', capacity: 1.5 },
    'tractor-400': { name: '400L Tractor Boom Sprayer', capacity: 400 }
  };
  const currentSprayer = sprayerCapacities[sprayerType];

  // Severity Multiplier
  const severityMultipliers = {
    preventative: 1.0,
    mild: 1.1,
    moderate: 1.25,
    severe: 1.45
  };
  const severityFactor = severityMultipliers[severity];

  // Calculations
  let totalWaterLiters = 0;

  if (mode === 'field') {
    // Normalization to Acres: 1 Hectare = 2.47 Acres, 1 Bigha ~ 0.4 Acres (North India standard)
    let acresEquivalent = areaValue;
    if (areaUnit === 'hectares') acresEquivalent = areaValue * 2.47;
    if (areaUnit === 'bighas') acresEquivalent = areaValue * 0.4;

    // Standard foliar water requirement: 180 to 220 Liters per acre for vegetables
    const baseWaterPerAcre = cropType === 'Apple' ? 380 : 200;
    totalWaterLiters = Math.round(acresEquivalent * baseWaterPerAcre);
  } else {
    // Pot calculations (Small: ~0.15L, Medium: ~0.35L, Large: ~0.75L)
    const potWater = potSize === 'small' ? 0.15 : potSize === 'medium' ? 0.35 : 0.75;
    totalWaterLiters = +(potCount * potWater).toFixed(1);
  }

  // Ensure minimum 1L
  totalWaterLiters = Math.max(1, totalWaterLiters);

  // Required Concentrate Amount
  const ratePerLiter = +(selectedRemedy.baseRatePerLiter * severityFactor).toFixed(2);
  const totalConcentrate = Math.round(totalWaterLiters * ratePerLiter);
  const totalSpreaderMl = Math.round(totalWaterLiters * selectedRemedy.spreaderPerLiter);

  // Tank Refills
  const tanksNeeded = +(totalWaterLiters / currentSprayer.capacity).toFixed(1);
  const concentratePerTank = Math.round(currentSprayer.capacity * ratePerLiter);
  const spreaderPerTank = +(currentSprayer.capacity * selectedRemedy.spreaderPerLiter).toFixed(1);

  // Estimated Cost (INR)
  const estimatedCostInr = Math.round(totalConcentrate * selectedRemedy.costPerUnitInr);

  const handleCopyRecipe = () => {
    const text = `FloraScan.ai - Smart Agronomy Dosage Recipe
--------------------------------------------------
Remedy: ${selectedRemedy.name} (${selectedRemedy.type})
Scope: ${mode === 'field' ? `${areaValue} ${areaUnit}` : `${potCount} ${potSize} pots`} of ${cropType}
Infestation Severity: ${severity.toUpperCase()}

DOSAGE SPECIFICATION:
• Total Water Required: ${totalWaterLiters} Liters
• Total Active Concentrate: ${totalConcentrate} ${selectedRemedy.unit} (${ratePerLiter} ${selectedRemedy.unit}/L)
• Organic Sticker / Spreader: ${totalSpreaderMl} ml (${selectedRemedy.spreaderPerLiter} ml/L)

TANK-BY-TANK MIXING GUIDE:
• Sprayer: ${currentSprayer.name} (${currentSprayer.capacity}L Tank)
• Number of Tanks: ~${tanksNeeded} tanks
• Add per Tank: ${concentratePerTank} ${selectedRemedy.unit} of remedy + ${spreaderPerTank} ml spreader

SAFETY & PRE-HARVEST INTERVAL:
• Pre-Harvest Interval (PHI): ${selectedRemedy.phiDays} days before harvest
• Optimal Spraying Window: ${selectedRemedy.idealTime}
• Rainfastness: 2 hours after application
`;
    navigator.clipboard.writeText(text);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-bold mb-2 border border-white/20">
              <Calculator className="w-3.5 h-3.5" />
              <span>Precision Agronomic Formulation Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Smart Dosage & Remedy Dilution Calculator
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mt-1">
              Compute the exact ml/grams of organic and chemical solutions per liter of water based on acreage, sprayer tank size, and infestation severity.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-black/25 backdrop-blur-md p-1 rounded-2xl border border-white/20 self-start sm:self-auto">
            <button
              onClick={() => setMode('field')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'field'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              🌾 Commercial Acreage
            </button>
            <button
              onClick={() => setMode('garden')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'garden'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              🪴 Home Garden / Pots
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-emerald-100">
        
        {/* Left Column: Interactive Inputs (7 cols) */}
        <div className="p-6 sm:p-8 lg:col-span-7 space-y-6">
          
          {/* 1. Remedy Selection */}
          <div className="space-y-2">
            <label htmlFor={remedySelectId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Select Active Remedy / Fungicide
            </label>
            <div className="relative">
              <select
                id={remedySelectId}
                value={selectedRemedyId}
                onChange={(e) => setSelectedRemedyId(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all pr-10 cursor-pointer"
              >
                {REMEDY_DATABASE.map((rem) => (
                  <option key={rem.id} value={rem.id}>
                    {rem.name} ({rem.type})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Target Crop & Infestation Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor={cropTypeId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Crop
              </label>
              <select
                id={cropTypeId}
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                <option value="Apple">Apple Orchard (Malus domestica)</option>
                <option value="Cucumber">Cucumber / Squash</option>
                <option value="Potato">Potato (Solanum tuberosum)</option>
                <option value="Wheat">Wheat / Cereals</option>
                <option value="Cotton">Cotton (Gossypium)</option>
                <option value="Chillies">Chilli / Peppers</option>
                <option value="Houseplants">Indoor Botanical / Monstera</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor={severityId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Infestation Severity Level
              </label>
              <select
                id={severityId}
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="preventative">🛡️ Preventative (No active lesions)</option>
                <option value="mild">⚠️ Mild (1% - 15% leaf surface)</option>
                <option value="moderate">🔥 Moderate (15% - 35% leaf surface)</option>
                <option value="severe">🚨 Critical Epidemic (&gt;35% canopy)</option>
              </select>
            </div>
          </div>

          {/* 3. Area or Pot Size Inputs */}
          {mode === 'field' ? (
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor={farmAreaId} className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Land Area / Farm Size
                </label>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-emerald-200 text-xs font-bold">
                  {['acres', 'hectares', 'bighas'].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setAreaUnit(unit)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                        areaUnit === unit
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  id={farmAreaId}
                  type="range"
                  min="0.25"
                  max="20"
                  step="0.25"
                  value={areaValue}
                  onChange={(e) => setAreaValue(+e.target.value)}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-emerald-200 font-bold text-emerald-800 text-sm">
                  <span>{areaValue}</span>
                  <span className="text-xs font-normal text-slate-500">{areaUnit}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor={potCountId} className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Number of Pots & Container Size
                </label>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-emerald-200 text-xs font-bold">
                  {[
                    { id: 'small', label: 'Small (6-8")' },
                    { id: 'medium', label: 'Med (10-12")' },
                    { id: 'large', label: 'Large (16"+)' }
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => setPotSize(sz.id)}
                      className={`px-2 py-1 rounded-lg transition-colors ${
                        potSize === sz.id
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  id={potCountId}
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={potCount}
                  onChange={(e) => setPotCount(+e.target.value)}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-emerald-200 font-bold text-emerald-800 text-sm">
                  <span>{potCount}</span>
                  <span className="text-xs font-normal text-slate-500">Pots</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Sprayer Equipment */}
          <div className="space-y-2">
            <label htmlFor={sprayerTypeId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Application Sprayer Equipment
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(sprayerCapacities).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSprayerType(key)}
                  className={`p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    sprayerType === key
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="text-xs">
                    <div>{item.name}</div>
                    <span className="text-[11px] font-normal text-slate-500">
                      Capacity: {item.capacity} Liters
                    </span>
                  </div>
                  {sprayerType === key && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Output Recipe & Guidance (5 cols) */}
        <div className="p-6 sm:p-8 lg:col-span-5 bg-gradient-to-b from-slate-50/60 to-white space-y-6 flex flex-col justify-between">
          
          <div className="space-y-5">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Precision Dosage Output
              </span>
              <button
                onClick={handleCopyRecipe}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
              >
                {copiedRecipe ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Recipe</span>
                  </>
                )}
              </button>
            </div>

            {/* Big Headline Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Concentrate Card */}
              <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 block">
                  Active Concentrate
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold mt-1">
                  {totalConcentrate.toLocaleString()}
                  <span className="text-sm font-semibold ml-1 text-emerald-200">
                    {selectedRemedy.unit}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-100 mt-1">
                  Rate: {ratePerLiter} {selectedRemedy.unit} / Liter
                </div>
              </div>

              {/* Water Card */}
              <div className="p-4 rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-700/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100 block">
                  Total Water Needed
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold mt-1">
                  {totalWaterLiters}
                  <span className="text-sm font-semibold ml-1 text-teal-200">Liters</span>
                </div>
                <div className="text-[11px] text-teal-100 mt-1">
                  ~{tanksNeeded} tanks of {currentSprayer.capacity}L
                </div>
              </div>

            </div>

            {/* Tank-by-Tank Recipe Breakdown */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span>Per-Tank Mixing Instructions</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span>Tank Capacity:</span>
                  <span className="font-bold text-slate-800">{currentSprayer.capacity} Liters</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 text-emerald-950">
                  <span>Add Remedy Concentrate:</span>
                  <span className="font-bold text-emerald-800">
                    {concentratePerTank} {selectedRemedy.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-teal-50/60 text-teal-950">
                  <span>Add Organic Sticker / Spreader:</span>
                  <span className="font-bold text-teal-800">{spreaderPerTank} ml</span>
                </div>
              </div>
            </div>

            {/* Agronomic Safety & PHI */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Pre-Harvest Interval (PHI)
                </span>
                <span className="font-bold text-slate-800">
                  {selectedRemedy.phiDays === 0
                    ? '0 Days (Harvest Safe)'
                    : `${selectedRemedy.phiDays} Days`}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Estimated Input Cost
                </span>
                <span className="font-bold text-emerald-700">₹{estimatedCostInr} INR</span>
              </div>
            </div>

            {/* Spray Window Advisory */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-950">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Ideal Spraying Window:</strong> {selectedRemedy.idealTime}. Do not spray during peak midday heat to avoid foliar phytotoxicity.
              </div>
            </div>

          </div>

          {/* Direct Buy Bridge */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => onOrderProduct && onOrderProduct(selectedRemedy)}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Order Pre-Measured Solution ({selectedRemedy.name.split(' ')[0]})</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
