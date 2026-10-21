import React, { useState, useEffect } from 'react';
import {
  Radio,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Bell,
  BellRing,
  Navigation,
  Compass,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
  Send
} from 'lucide-react';
import {
  DISTRICT_OUTBREAK_REGISTRY,
  captureScanCoordinates,
  checkAndDispatchOutbreakAlert
} from '../services/geospatialService';

export default function OutbreakRadar() {
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICT_OUTBREAK_REGISTRY[0]);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [alertSubscribed, setAlertSubscribed] = useState(true);
  const [simulatedAlert, setSimulatedAlert] = useState(null);

  // Capture user coordinates on mount
  const handleAcquireLocation = async () => {
    setIsLocating(true);
    const result = await captureScanCoordinates();
    setIsLocating(false);
    setUserLocation(result.coords);

    // If near Bathinda or Agra, simulate alert
    const alertResult = checkAndDispatchOutbreakAlert(
      result.coords.district || 'Bathinda',
      'Late Blight'
    );
    if (alertResult.alertTriggered) {
      setSimulatedAlert(alertResult);
    }
  };

  const triggerSimulatedAlert = (dist) => {
    const alert = checkAndDispatchOutbreakAlert(dist.district, dist.dominantPathogen);
    setSimulatedAlert(alert.alertTriggered ? alert : null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border border-emerald-900/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Real-Time Geospatial Epidemiology Network</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Crop Disease Outbreak Radar
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monitors aggregated leaf scans across agricultural clusters. Automatically dispatches localized early-warning notifications to farmers whenever pathogen density crosses critical epidemiological thresholds.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleAcquireLocation}
              disabled={isLocating}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              {isLocating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              <span>{userLocation ? 'Update Field GPS' : 'Acquire My GPS'}</span>
            </button>

            <button
              onClick={() => setAlertSubscribed(!alertSubscribed)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                alertSubscribed
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/15'
              }`}
            >
              {alertSubscribed ? (
                <>
                  <BellRing className="w-4 h-4 text-emerald-400" />
                  <span>Outbreak Alerts: ON</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-slate-400" />
                  <span>Enable Push Alerts</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* GPS Consent & Differential Privacy Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Differential Privacy Enabled: Field GPS coordinates are fuzzed by ~500m to preserve land boundary confidentiality.</span>
          </div>
          {userLocation && (
            <span className="text-emerald-400 font-mono">
              Fuzzed GPS: {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E ({userLocation.district})
            </span>
          )}
        </div>
      </div>

      {/* Simulated Push Alert Banner if Active */}
      {simulatedAlert && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex items-start justify-between gap-4 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-sm sm:text-base text-rose-900 flex items-center gap-2">
                <span>{simulatedAlert.title}</span>
                <span className="text-[10px] uppercase font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">
                  Density: {simulatedAlert.density}%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">
                {simulatedAlert.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSimulatedAlert(null)}
            className="text-xs text-rose-600 hover:text-rose-900 font-bold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Radar Screen & District Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[460px]">
          
          {/* Subtle Grid Backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Radar Circles & Rotating Beam */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-emerald-500/30 flex items-center justify-center">
            
            {/* Concentric distance rings */}
            <div className="absolute w-3/4 h-3/4 rounded-full border border-emerald-500/20" />
            <div className="absolute w-1/2 h-1/2 rounded-full border border-emerald-500/20" />
            <div className="absolute w-1/4 h-1/4 rounded-full border border-emerald-500/30" />

            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-emerald-500/20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-[1px] bg-emerald-500/20" />
            </div>

            {/* Sweeping Radar Beam */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div
                className="w-1/2 h-1/2 origin-bottom-right animate-[spin_4s_linear_infinite]"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(16, 185, 129, 0.4) 360deg)'
                }}
              />
            </div>

            {/* Center Origin (User Location) */}
            <div className="relative z-20 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-lg shadow-emerald-400/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>

            {/* Hotspot Pins */}
            {DISTRICT_OUTBREAK_REGISTRY.map((dist, idx) => {
              // Position relative on circle
              const angles = [35, 125, 215, 290, 160];
              const distances = [75, 110, 85, 130, 95];
              const rad = (angles[idx] * Math.PI) / 180;
              const x = Math.cos(rad) * distances[idx];
              const y = Math.sin(rad) * distances[idx];

              const isCritical = dist.riskLevel === 'CRITICAL_OUTBREAK';
              const isSelected = selectedDistrict.id === dist.id;

              return (
                <button
                  key={dist.id}
                  onClick={() => {
                    setSelectedDistrict(dist);
                    triggerSimulatedAlert(dist);
                  }}
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                  className={`absolute z-30 flex items-center justify-center transition-all ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                  }`}
                  title={`${dist.district} (${dist.densityIndex}% Density)`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shadow-lg transition-transform ${
                      isCritical
                        ? 'bg-rose-600 border-rose-300 text-white animate-pulse'
                        : 'bg-amber-500 border-amber-200 text-slate-900'
                    } ${isSelected ? 'ring-4 ring-white/50' : ''}`}
                  >
                    !
                  </div>
                </button>
              );
            })}

            {/* Radius Labels */}
            <span className="absolute top-2 text-[9px] text-emerald-400/60 font-mono">50 km</span>
            <span className="absolute top-12 text-[9px] text-emerald-400/60 font-mono">25 km</span>
            <span className="absolute top-24 text-[9px] text-emerald-400/60 font-mono">10 km</span>
          </div>

          {/* Radar Status Bar */}
          <div className="relative z-10 mt-6 flex items-center justify-between w-full max-w-sm text-xs text-slate-400 px-2 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Scanning Sector 7-North
            </span>
            <span>Freq: 4.8 GHz</span>
            <span>Radius: 50 KM</span>
          </div>

        </div>

        {/* District Hotspot Details & Threshold Monitor (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Selected District Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Epidemiological Telemetry
                </span>
                <h3 className="text-xl font-extrabold text-slate-800">
                  {selectedDistrict.district}, {selectedDistrict.state}
                </h3>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  selectedDistrict.riskLevel === 'CRITICAL_OUTBREAK'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {selectedDistrict.riskLevel === 'CRITICAL_OUTBREAK'
                  ? '🚨 Critical Outbreak'
                  : '⚠️ Moderate Watch'}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-400 block font-semibold">Active Pathogen</span>
                <span className="text-xs font-bold text-slate-800 line-clamp-1">
                  {selectedDistrict.dominantPathogen}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-[11px] text-rose-500 block font-semibold">Density Index</span>
                <span className="text-base font-extrabold text-rose-700">
                  {selectedDistrict.densityIndex}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Cases Reported (7 Days):</span>
                <span className="font-bold text-slate-800">{selectedDistrict.activeCases7Days} farms</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Crop Vulnerability:</span>
                <span className="font-bold text-slate-800">{selectedDistrict.cropFocus}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Threshold Trigger:</span>
                <span className="font-bold text-rose-600">&gt; 40% Density</span>
              </div>
            </div>

            {/* Recommended Containment Protocol */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>District Action Protocol</span>
              </div>
              <p className="leading-relaxed">
                {selectedDistrict.recommendedAction}
              </p>
            </div>

            <button
              onClick={() => triggerSimulatedAlert(selectedDistrict)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate District Push Notification</span>
            </button>

          </div>

          {/* Quick District Selector List */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-1">
              Registered Agricultural Clusters
            </span>

            <div className="space-y-1.5">
              {DISTRICT_OUTBREAK_REGISTRY.map((dist) => (
                <button
                  key={dist.id}
                  onClick={() => {
                    setSelectedDistrict(dist);
                    triggerSimulatedAlert(dist);
                  }}
                  className={`w-full p-3 rounded-2xl text-left text-xs transition-all flex items-center justify-between ${
                    selectedDistrict.id === dist.id
                      ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                      : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{dist.district}, {dist.state}</span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      dist.riskLevel === 'CRITICAL_OUTBREAK'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {dist.densityIndex}%
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
