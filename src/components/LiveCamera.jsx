import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  X,
  Zap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Sun,
  Shield,
  RotateCcw
} from 'lucide-react';

export default function LiveCamera({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // rear camera by default
  const [flashEffect, setFlashEffect] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  // Initialize camera stream
  const startCamera = async () => {
    try {
      setError('');
      setCameraReady(false);
      
      // Stop existing tracks if any
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera API is not supported in this browser. Please use the file upload option.');
        return;
      }

      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraReady(true);
        };
      }

      // Check if torch/flashlight is supported
      const track = newStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      if (capabilities.torch) {
        setHasTorch(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission was denied. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera device was detected on your computer/phone.');
      } else {
        setError(`Unable to start camera: ${err.message || 'Unknown error'}`);
      }
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      // Cleanup camera on unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Toggle front and back camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle Torch/Flash if supported
  const toggleTorch = async () => {
    if (!stream || !hasTorch) return;
    try {
      const track = stream.getVideoTracks()[0];
      const nextTorch = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setTorchOn(nextTorch);
    } catch (e) {
      console.warn('Torch toggle failed:', e);
    }
  };

  // Capture high-res frame from video stream
  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    setFlashEffect(true);

    // Audio beep/shutter simulation
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Audio not permitted/supported, continue silently
    }

    setTimeout(() => {
      setFlashEffect(false);
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const videoWidth = video.videoWidth || 640;
      const videoHeight = video.videoHeight || 480;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const ctx = canvas.getContext('2d');
      if (facingMode === 'user') {
        // Mirror if front camera
        ctx.translate(videoWidth, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

      // Stop camera stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      setIsCapturing(false);
      onCapture(dataUrl, `Live_Capture_${new Date().toLocaleTimeString().replace(/:/g, '-')}.jpg`);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 flex flex-col max-h-[92vh]">
        
        {/* Camera Header */}
        <div className="p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <h3 className="font-heading text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Live Leaf Diagnostic Viewfinder</span>
              </h3>
              <p className="text-[11px] text-emerald-400 font-mono">
                {cameraReady ? 'Active HD Stream • Align Leaf Within Frame' : 'Connecting to Camera Sensor...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasTorch && (
              <button
                onClick={toggleTorch}
                className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                  torchOn ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Toggle Torch/Flash"
              >
                <Sun className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={toggleFacingMode}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              title="Flip Front/Rear Camera"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Camera"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewfinder Video Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[380px] sm:min-h-[460px]">
          
          {/* Flash animation upon snapshot */}
          {flashEffect && (
            <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300 pointer-events-none" />
          )}

          {error ? (
            <div className="p-6 text-center max-w-md space-y-4 text-slate-300">
              <div className="w-14 h-14 rounded-2xl bg-rose-900/50 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h4 className="font-heading text-lg font-bold text-white">Camera Access Notice</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {error}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={startCamera}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Switch to Upload
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Video Stream Element */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Viewfinder Target Brackets & Reticle */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                
                {/* Rule of thirds grid lines */}
                <div className="absolute inset-12 border border-emerald-500/20 rounded-3xl" />
                
                {/* Center Targeting Box */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-emerald-400/80 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex flex-col justify-between p-3 animate-pulse">
                  
                  {/* Four Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                  {/* Top Target Label */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 bg-slate-950/70 backdrop-blur-xs px-2 py-1 rounded-md self-center">
                    <span>FOCUS ON DISEASED LEAF SPOT</span>
                  </div>

                  {/* Center Crosshair */}
                  <div className="self-center w-8 h-8 relative flex items-center justify-center opacity-60">
                    <div className="w-full h-[1px] bg-emerald-400" />
                    <div className="h-full w-[1px] bg-emerald-400 absolute" />
                  </div>

                  {/* Bottom Indicator */}
                  <div className="text-[10px] font-mono text-slate-300 text-center bg-slate-950/60 backdrop-blur-xs px-2 py-0.5 rounded-md self-center">
                    DISTANCE: 15–20 CM • HOLD STEADY
                  </div>

                </div>

              </div>
            </>
          )}

          {/* Hidden Canvas for capture processing */}
          <canvas ref={canvasRef} className="hidden" />

        </div>

        {/* Shutter & Controls Bottom Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between z-20">
          <div className="text-xs text-slate-400 hidden sm:block">
            <span>Tip: Ensure good lighting for highest accuracy</span>
          </div>

          {/* Large Shutter Button */}
          <div className="mx-auto flex items-center gap-4">
            <button
              onClick={takeSnapshot}
              disabled={!cameraReady || !!error || isCapturing}
              className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center p-1.5 shadow-xl shadow-emerald-500/30"
              title="Capture Leaf Image"
            >
              <div className="w-full h-full rounded-full border-2 border-white/80 flex items-center justify-center bg-emerald-500 group-hover:bg-emerald-400 transition-colors">
                <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform" />
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
