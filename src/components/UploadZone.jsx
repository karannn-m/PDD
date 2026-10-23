import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  RefreshCw,
  ZoomIn,
  Wifi,
  WifiOff,
  Cpu
} from 'lucide-react';
import { SAMPLE_DIAGNOSES } from '../data/plantData';
import { checkIsOffline, EDGE_MODEL_METADATA } from '../services/edgeModelService';

export default function UploadZone({
  selectedImage,
  previewUrl,
  fileName,
  onImageSelect,
  onSampleSelect,
  onStartAnalysis,
  onOpenLiveCamera,
  isAnalyzing
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isEdgeMode, setIsEdgeMode] = useState(false);
  const [isDeviceOffline, setIsDeviceOffline] = useState(false);
  const fileInputRef = useRef(null);

  // Monitor network status
  useEffect(() => {
    const updateOnlineStatus = () => {
      const offline = checkIsOffline();
      setIsDeviceOffline(offline);
      if (offline) {
        setIsEdgeMode(true); // Automatically switch to edge AI on offline
      }
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragError('');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileChange = (e) => {
    setDragError('');
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setDragError('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setDragError('File size exceeds 20MB. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Edge AI / Cloud Mode Switcher Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-emerald-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isEdgeMode ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                Inference Engine: {isEdgeMode ? 'Offline Edge AI (TFLite / ONNX)' : 'Cloud GPU Neural Cluster'}
              </span>
              {isDeviceOffline && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Offline Detected
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {isEdgeMode
                ? 'Zero internet required • Sub-95ms WASM inference • 3.4MB INT8 edge weights'
                : 'High-precision 65k sample cloud pathology database with real-time agronomic triage'}
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEdgeMode(!isEdgeMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isEdgeMode
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isEdgeMode ? 'fill-slate-950' : 'text-amber-500'}`} />
            <span>{isEdgeMode ? '⚡ Edge Mode Active' : 'Enable Edge Offline Mode'}</span>
          </button>
        </div>
      </div>

      {/* Upload Box / Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${
          isDragging
            ? 'border-2 border-emerald-500 bg-emerald-50/90 scale-[1.01] shadow-xl shadow-emerald-500/10'
            : previewUrl
            ? 'border border-emerald-200/80 bg-white/90 shadow-lg shadow-emerald-950/5'
            : 'border-2 border-dashed border-emerald-300/80 bg-white/60 hover:bg-emerald-50/40 hover:border-emerald-400 shadow-md shadow-emerald-900/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {!previewUrl ? (
          /* Empty / Initial State */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-5">
            {/* Animated Eco Icon */}
            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-100 to-teal-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Upload className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600 transition-transform group-hover:-translate-y-1" />
              </div>
              <span className="absolute -bottom-1 -right-1 p-2 rounded-full bg-emerald-600 text-white shadow-md">
                <Camera className="w-4 h-4" />
              </span>
            </div>

            <div className="max-w-md">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-800">
                {isDragging ? 'Drop your leaf photo here!' : 'Drop your leaf photo here'}
              </h3>
            </div>

            {/* Error banner if any */}
            {dragError && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{dragError}</span>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenLiveCamera}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all text-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Open Live Camera</span>
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </button>

              <button
                type="button"
                onClick={triggerFileInput}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 transition-all text-sm shadow-xs"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Browse Files</span>
              </button>
            </div>

            {/* Micro specs */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 font-medium">
              <span>Supports JPG, PNG, WEBP</span>
              <span>•</span>
              <span>Up to 20MB</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free & Instant
              </span>
            </div>
          </div>
        ) : (
          /* Image Selected / Instant Preview State */
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-8">
              
              {/* Image Preview Container with Zoom capability */}
              <div className="relative w-full md:w-1/2 aspect-square max-h-[320px] rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
                <img
                  src={previewUrl}
                  alt="Leaf Specimen Preview"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
                
                {/* Floating badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Specimen Loaded</span>
                </div>

                {/* Zoom toggle button */}
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-colors"
                  title="Toggle Zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Action and Confirmation Panel */}
              <div className="w-full md:w-1/2 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    High-Res Specimen Ready
                  </div>
                  <h4 className="font-heading text-xl font-bold text-slate-800 truncate" title={fileName}>
                    {fileName || 'Leaf Image Specimen'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {isEdgeMode
                      ? 'Local client-side Edge AI will process normalized 224x224 tensor pixels on your browser canvas with sub-95ms offline latency.'
                      : 'AI will cross-examine chloroplast texture, discoloration rings, necrosis patterns, and margin venation against 65,000+ pathological samples.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Start AI Diagnostic CTA */}
                  <button
                    type="button"
                    onClick={() => onStartAnalysis(isEdgeMode)}
                    disabled={isAnalyzing}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <Zap className="w-5 h-5 fill-current text-amber-300" />
                    <span>{isEdgeMode ? 'Run Edge AI Analysis (Offline)' : 'Run AI Disease Analysis'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Change Image Button */}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Choose Different Photo</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
                  <span>Privacy secured</span>
                  <span>•</span>
                  <span>{isEdgeMode ? 'Sub-95ms Offline TFLite Engine' : 'Instant browser inference'}</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Quick Test Pre-loaded Pathology Samples */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-700 tracking-wide uppercase">
              Or Try A Verified Specimen
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click to test instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {SAMPLE_DIAGNOSES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSampleSelect(sample)}
              className="group relative flex flex-col p-2.5 sm:p-3 rounded-2xl bg-white/80 hover:bg-white border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-300 text-left cursor-pointer"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-emerald-50 mb-2.5">
                <img
                  src={sample.image}
                  alt={sample.plantName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  sample.severity === 'Healthy'
                    ? 'bg-emerald-600 text-white'
                    : sample.severity === 'Critical'
                    ? 'bg-rose-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}>
                  {sample.severity}
                </span>
              </div>
              
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {sample.plantName}
                </span>
                <span className="text-[11px] font-medium text-slate-500 block truncate">
                  {sample.diseaseName}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-100">
                <span>{sample.confidence}% match</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
