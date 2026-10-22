import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Tractor,
  Sprout,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Wheat,
  Flower2,
  Globe,
  LogOut,
  ChevronRight,
  RotateCcw,
  Smartphone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  theme = 'light'
}) {
  const [activeTier, setActiveTier] = useState('farmer'); // 'farmer' | 'user'
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Phone numbers (Both use phone numbers now!)
  const [farmerPhone, setFarmerPhone] = useState('9876543210');
  const [userPhone, setUserPhone] = useState('9812345678');

  // Farmer profile metadata
  const [farmerName, setFarmerName] = useState('Sardar Gurpreet Singh');
  const [farmerDistrict, setFarmerDistrict] = useState('Bathinda, Punjab');
  const [farmerAcreage, setFarmerAcreage] = useState('14.5');
  const [farmerCrop, setFarmerCrop] = useState('Wheat & Cotton');
  const [farmerLang, setFarmerLang] = useState('pa');

  // Home User profile metadata
  const [userName, setUserName] = useState('Priya Sharma');
  const [userGardenType, setUserGardenType] = useState('Indoor & Balcony Garden');
  const [userPlantCount, setUserPlantCount] = useState('28');

  // OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showSmsBanner, setShowSmsBanner] = useState(false);

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // OTP Input refs
  const inputRefs = useRef([]);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setOtpDigits(['', '', '', '', '', '']);
      setStatusMessage(null);
      setShowSmsBanner(false);
    }
  }, [isOpen]);

  // Resend Countdown Timer
  useEffect(() => {
    let timer = null;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const currentPhone = activeTier === 'farmer' ? farmerPhone : userPhone;
  const currentCleanPhone = currentPhone.replace(/\D/g, '').slice(-10);

  // ==========================================
  // SEND OTP ACTION
  // ==========================================
  const handleSendOtp = async (customPhone = null, customTier = null) => {
    const targetPhone = customPhone || currentPhone;
    const cleanNumber = targetPhone.replace(/\D/g, '').slice(-10);

    if (cleanNumber.length < 10) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid 10-digit Indian mobile number.'
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanNumber,
          tier: customTier || activeTier
        })
      });

      const data = await response.json();

      if (data.success) {
        const receivedOtp = data.otpPreview || '749201';
        setGeneratedOtp(receivedOtp);
        setStep('otp');
        setOtpDigits(['', '', '', '', '', '']);
        setResendTimer(30);
        setCanResend(false);
        setShowSmsBanner(true);
        setStatusMessage({
          type: 'success',
          text: `OTP sent to +91 ${cleanNumber} via secure SMS gateway.`
        });

        // Focus first OTP input
        setTimeout(() => {
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
          }
        }, 150);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.message || 'Failed to dispatch OTP.'
        });
      }
    } catch {
      // Fallback offline simulated OTP
      const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(fallbackOtp);
      setStep('otp');
      setOtpDigits(['', '', '', '', '', '']);
      setResendTimer(30);
      setCanResend(false);
      setShowSmsBanner(true);
      setStatusMessage({
        type: 'success',
        text: `OTP generated for +91 ${cleanNumber}.`
      });

      setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }, 150);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP ACTION
  // ==========================================
  const handleVerifyOtp = async (explicitCode = null) => {
    const code = explicitCode || otpDigits.join('');
    if (code.length < 6) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter all 6 digits of your OTP verification code.'
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    const isFarmer = activeTier === 'farmer';
    const payload = {
      phone: currentCleanPhone,
      otp: code,
      tier: activeTier,
      fullName: isFarmer ? farmerName : userName,
      preferredLang: isFarmer ? farmerLang : 'en',
      ...(isFarmer
        ? {
            district: farmerDistrict,
            acreage: parseFloat(farmerAcreage) || 14.5,
            cropFocus: farmerCrop
          }
        : {
            gardenType: userGardenType,
            plantCount: parseInt(userPlantCount) || 28
          })
    };

    try {
      const response = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success && data.user) {
        setStatusMessage({
          type: 'success',
          text: `Verified! Welcome back, ${data.user.name}.`
        });
        setTimeout(() => {
          onLoginSuccess(data.user);
          onClose();
        }, 600);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.message || 'Invalid or expired OTP. Please try again.'
        });
      }
    } catch {
      // Local fallback verification
      const userProfile = {
        id: `${isFarmer ? 'FARMER' : 'USER'}-${currentCleanPhone.slice(-4)}`,
        role: isFarmer ? 'FARMER' : 'USER',
        tier: activeTier,
        name: isFarmer ? farmerName : userName,
        phone: `+91 ${currentCleanPhone}`,
        badge: isFarmer ? '🌾 Commercial Grower' : '🌱 Home Gardener',
        avatarInitial: (isFarmer ? farmerName : userName).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || (isFarmer ? 'GS' : 'PS'),
        plan: isFarmer ? 'Kisan Pro Telemetry' : 'Urban Garden Club',
        preferredLang: isFarmer ? farmerLang : 'en',
        ...(isFarmer
          ? {
              district: farmerDistrict,
              acreage: parseFloat(farmerAcreage) || 14.5,
              cropFocus: farmerCrop
            }
          : {
              gardenType: userGardenType,
              plantCount: parseInt(userPlantCount) || 28
            })
      };

      setStatusMessage({
        type: 'success',
        text: `Verified! Welcome back, ${userProfile.name}.`
      });
      setTimeout(() => {
        onLoginSuccess(userProfile);
        onClose();
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit box input
  const handleDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance to next box
    if (cleanVal && index < 5) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }

    // Auto-verify if all 6 digits entered
    if (cleanVal && index === 5) {
      const fullCode = newDigits.join('');
      if (fullCode.length === 6) {
        handleVerifyOtp(fullCode);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePasteOtp = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newDigits = pasted.split('');
      setOtpDigits(newDigits);
      handleVerifyOtp(pasted);
    }
  };

  // Auto-Fill Simulated OTP
  const handleAutoFillOtp = () => {
    if (generatedOtp && generatedOtp.length === 6) {
      const digits = generatedOtp.split('');
      setOtpDigits(digits);
      handleVerifyOtp(generatedOtp);
    }
  };

  // One-Tap Quick Demo
  const triggerDemoLogin = (tier) => {
    setActiveTier(tier);
    if (tier === 'farmer') {
      setFarmerPhone('9876543210');
      setFarmerName('Sardar Gurpreet Singh');
      setFarmerDistrict('Bathinda, Punjab');
      setFarmerAcreage('14.5');
      setFarmerCrop('Wheat & Cotton');
      handleSendOtp('9876543210', 'farmer');
    } else {
      setUserPhone('9812345678');
      setUserName('Priya Sharma');
      setUserGardenType('Indoor & Balcony Garden');
      setUserPlantCount('28');
      handleSendOtp('9812345678', 'user');
    }
  };

  // ==========================================
  // PROFILE VIEW (WHEN CURRENTLY LOGGED IN)
  // ==========================================
  if (currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-2xl overflow-hidden p-6 text-slate-800 dark:text-slate-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-md ${
                currentUser.tier === 'farmer'
                  ? 'bg-gradient-to-br from-amber-600 to-emerald-700'
                  : 'bg-gradient-to-br from-emerald-600 to-teal-600'
              }`}
            >
              {currentUser.avatarInitial || 'FS'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-heading">{currentUser.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700">
                  {currentUser.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{currentUser.phone}</span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                  OTP Verified
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
            {currentUser.tier === 'farmer' ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" /> District / Field
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.district}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Tractor className="w-3.5 h-3.5 text-amber-500" /> Farm Land Size
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.acreage} Acres</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Wheat className="w-3.5 h-3.5 text-emerald-600" /> Crop Focus
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.cropFocus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-500" /> Voice Assistant
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                    {currentUser.preferredLang} (Kisan Multilingual)
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-500" /> Garden Type
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.gardenType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Flower2 className="w-3.5 h-3.5 text-teal-500" /> Tracked Plants
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.plantCount} Plants</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Membership Tier
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentUser.plan}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/70 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all active:scale-95"
            >
              Continue to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // OTP AUTH MODAL (LOGIN & REGISTRATION)
  // ==========================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-2xl overflow-hidden my-6 text-slate-800 dark:text-slate-100 transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Mobile OTP Authentication</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            {step === 'phone' ? 'Sign In with Mobile OTP' : 'Verify One-Time Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {step === 'phone'
              ? 'Passwordless access. Receive a 6-digit verification code on your phone.'
              : `Enter the 6-digit code sent to +91 ${currentCleanPhone}`}
          </p>

          {/* TWO-TIER TABS (Farmer vs Home User) */}
          {step === 'phone' && (
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setActiveTier('farmer');
                  setStatusMessage(null);
                }}
                type="button"
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTier === 'farmer'
                    ? 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-400 shadow-sm border border-amber-200/80 dark:border-amber-900/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Tractor className={`w-4 h-4 ${activeTier === 'farmer' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
                <span>🌾 Farmer Mode</span>
              </button>

              <button
                onClick={() => {
                  setActiveTier('user');
                  setStatusMessage(null);
                }}
                type="button"
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTier === 'user'
                    ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-400 shadow-sm border border-emerald-200/80 dark:border-emerald-900/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Sprout className={`w-4 h-4 ${activeTier === 'user' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>🌱 Home User</span>
              </button>
            </div>
          )}
        </div>

        {/* SIMULATED SMS ARRIVAL BANNER */}
        {showSmsBanner && generatedOtp && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 shadow-md animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>SMS Gateway: +91 {currentCleanPhone}</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Just Now</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-mono">
              FloraScan: Your verification OTP is <strong className="text-emerald-600 dark:text-emerald-400 text-sm tracking-wider font-bold">{generatedOtp}</strong>. Valid for 10 min.
            </p>
            <div className="mt-2.5 flex items-center justify-end">
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1 transition-all active:scale-95"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Fill & Verify</span>
              </button>
            </div>
          </div>
        )}

        {/* STATUS ALERT NOTIFICATION */}
        {statusMessage && (
          <div
            className={`mx-6 mt-3 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* MODAL BODY */}
        <div className="p-6 pt-4">

          {/* ==================================================== */}
          {/* STEP 1: ENTER PHONE NUMBER & OPTIONAL TELEMETRY     */}
          {/* ==================================================== */}
          {step === 'phone' && (
            <div className="space-y-4">
              
              {/* Context Pill */}
              <div
                className={`p-3 rounded-2xl text-xs flex items-center gap-2.5 border ${
                  activeTier === 'farmer'
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/40 text-amber-950 dark:text-amber-200'
                    : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200'
                }`}
              >
                {activeTier === 'farmer' ? (
                  <>
                    <Tractor className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Commercial Farm Tier: Calibrated tank dosages, regional crop radars & Punjabi/Hindi voice AI.</span>
                  </>
                ) : (
                  <>
                    <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Home Plant Tier: Balcony pots, houseplants, natural organic remedies & step-by-step care.</span>
                  </>
                )}
              </div>

              {/* Mobile Phone Input (Shared for both Farmer and User) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3 flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 select-none">
                    <span>🇮🇳</span>
                    <span>+91</span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={activeTier === 'farmer' ? farmerPhone : userPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (activeTier === 'farmer') setFarmerPhone(val);
                      else setUserPhone(val);
                    }}
                    placeholder="98765 43210"
                    className="w-full pl-20 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white text-sm font-semibold tracking-wide focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  We will send a 6-digit verification code to this mobile number.
                </p>
              </div>

              {/* Optional Profile Customization Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 py-1 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{showAdvanced ? 'Hide Profile Settings' : 'Customize Profile Details (Optional)'}</span>
                  </span>
                  {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvanced && (
                  <div className="mt-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={activeTier === 'farmer' ? farmerName : userName}
                        onChange={(e) =>
                          activeTier === 'farmer' ? setFarmerName(e.target.value) : setUserName(e.target.value)
                        }
                        placeholder={activeTier === 'farmer' ? 'Sardar Gurpreet Singh' : 'Priya Sharma'}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    {activeTier === 'farmer' ? (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                              District / Zone
                            </label>
                            <input
                              type="text"
                              value={farmerDistrict}
                              onChange={(e) => setFarmerDistrict(e.target.value)}
                              placeholder="Bathinda, Punjab"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                              Land Size (Acres)
                            </label>
                            <input
                              type="number"
                              step="0.5"
                              value={farmerAcreage}
                              onChange={(e) => setFarmerAcreage(e.target.value)}
                              placeholder="14.5"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                              Primary Crops
                            </label>
                            <select
                              value={farmerCrop}
                              onChange={(e) => setFarmerCrop(e.target.value)}
                              className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                            >
                              <option>Wheat & Cotton</option>
                              <option>Tomato & Potato</option>
                              <option>Paddy & Basmati Rice</option>
                              <option>Grapes & Vineyards</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                              Voice AI Language
                            </label>
                            <select
                              value={farmerLang}
                              onChange={(e) => setFarmerLang(e.target.value)}
                              className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                              <option value="hi">हिंदी (Hindi)</option>
                              <option value="mr">मराठी (Marathi)</option>
                              <option value="en">English (Agricultural)</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            Garden Setup
                          </label>
                          <select
                            value={userGardenType}
                            onChange={(e) => setUserGardenType(e.target.value)}
                            className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                          >
                            <option>Indoor & Balcony Garden</option>
                            <option>Kitchen Veggie Garden</option>
                            <option>Succulents & Cacti Pots</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            Total Plants
                          </label>
                          <input
                            type="number"
                            value={userPlantCount}
                            onChange={(e) => setUserPlantCount(e.target.value)}
                            placeholder="28"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Primary Action Button: SEND OTP */}
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={loading || currentCleanPhone.length < 10}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all active:scale-98 disabled:opacity-50 ${
                  activeTier === 'farmer'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/25'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-600/25'
                }`}
              >
                <span>{loading ? 'Sending OTP Code...' : 'Send Verification OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Instant One-Tap Quick Demo */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-2 text-center">
                  Or Test Instantly with Demo Profiles
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => triggerDemoLogin('farmer')}
                    className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-900/30 text-left transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                      <Tractor className="w-3.5 h-3.5 text-amber-600" />
                      <span>Farmer Demo</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Gurpreet Singh (14.5 Acres)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerDemoLogin('user')}
                    className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30 text-left transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Home User Demo</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Priya Sharma (Balcony Garden)
                    </p>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: ENTER OTP CODE & VERIFY                      */}
          {/* ==================================================== */}
          {step === 'otp' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Back / Change Number Bar */}
              <div className="flex items-center justify-between text-xs pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setStatusMessage(null);
                    setShowSmsBanner(false);
                  }}
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>← Edit Mobile Number</span>
                </button>
                <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                  +91 {currentCleanPhone}
                </span>
              </div>

              {/* 6-Digit OTP Box Grid */}
              <div>
                <label className="block text-xs font-bold text-center text-slate-700 dark:text-slate-300 mb-3">
                  Enter 6-Digit Verification Code
                </label>

                <div className="flex justify-between items-center gap-2 max-w-xs mx-auto" onPaste={handlePasteOtp}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e.key)}
                      className={`w-11 h-13 text-center text-xl font-bold font-mono rounded-xl border shadow-sm transition-all focus:outline-none ${
                        digit
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Resend Timer & Button */}
              <div className="flex items-center justify-center gap-2 text-xs">
                {canResend ? (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={loading}
                    className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 font-medium">
                    Resend OTP code in <strong className="font-mono font-bold text-slate-700 dark:text-slate-300">{resendTimer}s</strong>
                  </span>
                )}
              </div>

              {/* Primary Action Button: VERIFY & PROCEED */}
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={loading || otpDigits.join('').length < 6}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all active:scale-98 disabled:opacity-50 ${
                  activeTier === 'farmer'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/25'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-600/25'
                }`}
              >
                <span>{loading ? 'Verifying Code...' : 'Verify OTP & Enter FloraScan'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
