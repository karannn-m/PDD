import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sprout,
  HelpCircle,
  AlertCircle,
  Globe,
  Radio,
  ChevronDown
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  playSpeech,
  stopSpeech,
  createSpeechRecognizer,
  getVernacularDoctorAnswer
} from '../services/voiceService';

export default function PlantDoctorModal({ isOpen, onClose, diagnosis }) {
  // Active regional language
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]); // Hindi default
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'bot',
      text: `नमस्ते! मैं आपका फ्लोरास्कैन पौधा रोग विशेषज्ञ हूँ। मैं आपके पौधे **${diagnosis?.plantName || 'पौधा'}** (${diagnosis?.diseaseName || 'जाँच जारी'}, सटीकता: ${diagnosis?.confidence || 98}%) का विश्लेषण कर रहा हूँ।\n\nआप मुझसे हिंदी, पंजाबी, मराठी, तेलुगु, तमिल, बंगाली या अंग्रेज़ी में बोलकर या लिखकर सवाल पूछ सकते हैं।`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef(null);
  const recognizerRef = useRef(null);

  // Check Web Speech API availability
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice Assistant: Text to Speech (TTS)
  const speakCurrentText = (text) => {
    if (!autoSpeak) return;
    playSpeech({
      text,
      langCode: selectedLang.code,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const handleStopSpeaking = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  // Change language and reset greetings
  const handleSelectLanguage = (lang) => {
    setSelectedLang(lang);
    setIsLangDropdownOpen(false);
    handleStopSpeaking();

    const welcomeMsg = {
      id: `lang-change-${Date.now()}`,
      sender: 'bot',
      text: `${lang.flag} **${lang.nativeName} (${lang.name}) Active:**\n${lang.welcome}\n\n*Specimen: ${diagnosis.plantName} (${diagnosis.diseaseName})*`
    };
    setMessages((prev) => [...prev, welcomeMsg]);
    if (autoSpeak) {
      playSpeech({
        text: lang.welcome,
        langCode: lang.code,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  // Voice Assistant: Speech to Text (STT)
  const toggleListening = () => {
    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    handleStopSpeaking();

    const recognizer = createSpeechRecognizer({
      langCode: selectedLang.code,
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onError: (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      },
      onResult: (transcript) => {
        setInputValue(transcript);
        setIsListening(false);
        handleSend(transcript);
      }
    });

    if (!recognizer) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome or Edge.');
      return;
    }

    recognizerRef.current = recognizer;
    try {
      recognizer.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  // Vernacular Quick Question Chips based on selected language
  const getQuickQuestions = () => {
    switch (selectedLang.code) {
      case 'hi-IN':
        return [
          'इस बीमारी का जैविक इलाज क्या है?',
          'नीम के तेल का सही अनुपात और मात्रा क्या है?',
          'क्या यह रोग आसपास की दूसरी फसलों में फैलेगा?',
          'पत्तियां पीली क्यों पड़ रही हैं?'
        ];
      case 'pa-IN':
        return [
          'ਇਸ ਬਿਮਾਰੀ ਦਾ ਦੇਸੀ / ਜੈਵਿਕ ਇਲਾਜ ਕੀ ਹੈ?',
          'ਨਿੰਮ ਦੇ ਤੇਲ ਦਾ ਛਿੜਕਾਅ ਕਿਵੇਂ ਕਰੀਏ?',
          'ਕੀ ਇਹ ਬਿਮਾਰੀ ਹੋਰ ਬੂਟਿਆਂ ਵਿੱਚ ਫੈਲੇਗੀ?'
        ];
      case 'mr-IN':
        return [
          'या रोगावर सेंद्रिय उपाय काय आहेत?',
          'कडुनिंब तेलाचे प्रमाण किती असावे?',
          'रोग इतर झाडांवर पसरू नये म्हणून काय करावे?'
        ];
      case 'te-IN':
        return [
          'ఈ తెగులుకు సేంద్రీయ నివారణ ఏమిటి?',
          'వేప నూనె ఎంత మోతాదులో పిచికారీ చేయాలి?',
          'ఇది ఇతర పంటలకు వ్యాపిస్తుందా?'
        ];
      case 'ta-IN':
        return [
          'இந்த நோய்க்கு இயற்கை தீர்வு என்ன?',
          'வேப்பெண்ணெய் தெளிக்கும் அளவு என்ன?',
          'இந்த நோய் மற்ற பயிர்களுக்கு பரவுமா?'
        ];
      case 'bn-IN':
        return [
          'এই রোগের জৈব প্রতিকার কী?',
          'নিম তেল স্প্রে করার সঠিক মাত্রা কত?',
          'এই রোগ কি অন্য গাছেও ছড়াতে পারে?'
        ];
      default:
        return [
          `How to treat ${diagnosis.diseaseName} organically?`,
          'Exact neem oil dilution and dosage rate?',
          'Is the fruit safe for human consumption?',
          'Why are leaves turning yellow?'
        ];
    }
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Generate smart agronomy response using multilingual vernacular engine
    setTimeout(() => {
      const responseText = getVernacularDoctorAnswer(query, diagnosis, selectedLang.code);
      const botMsg = { id: `bot-${Date.now()}`, sender: 'bot', text: responseText };
      setMessages((prev) => [...prev, botMsg]);

      if (autoSpeak) {
        speakCurrentText(responseText);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col h-[680px] max-h-[92vh] overflow-hidden">
        
        {/* Header with Multilingual Voice Status */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-slate-800 text-base sm:text-lg">
                  AI Plant Doctor & Voice Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 border border-teal-200">
                  Multilingual AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Specimen: <strong className="text-emerald-800">{diagnosis.plantName}</strong> • {diagnosis.diseaseName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Regional Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-slate-700 shadow-2xs hover:bg-emerald-50/60 transition-colors"
                title="Select Vernacular Language"
              >
                <span>{selectedLang.flag}</span>
                <span className="hidden sm:inline">{selectedLang.nativeName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-emerald-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Regional Languages
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang)}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        selectedLang.code === lang.code
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Voice Toggle */}
            <button
              onClick={() => {
                if (isSpeaking) {
                  handleStopSpeaking();
                }
                setAutoSpeak(!autoSpeak);
              }}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                autoSpeak ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
              }`}
              title={autoSpeak ? 'Voice response enabled (Click to mute)' : 'Voice response muted'}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                handleStopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-teal-100 text-teal-800 border border-teal-200'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-50 border border-emerald-100/80 text-slate-800 rounded-tl-none shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                {msg.sender === 'bot' && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {selectedLang.nativeName} Voice AI
                    </span>
                    <button
                      onClick={() => speakCurrentText(msg.text)}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                      title="Play Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Active Audio Waveform Indicator */}
        {isListening && (
          <div className="px-6 py-2.5 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-800 font-bold animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span>Listening in {selectedLang.nativeName} ({selectedLang.name})... Speak now!</span>
            </div>
            <span className="text-[11px] font-mono">Microphone Active</span>
          </div>
        )}

        {/* Vernacular Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {getQuickQuestions().map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] font-medium text-emerald-800 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0 shadow-2xs transition-all active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar with Regional Voice Button */}
        <div className="p-4 border-t border-emerald-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Microphone Toggle */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl transition-all shadow-md active:scale-95 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-4 ring-rose-300'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
              }`}
              title={`Click to speak in ${selectedLang.name}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask in ${selectedLang.nativeName} (e.g. "${selectedLang.sampleQuery}")...`}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-all active:scale-95 shadow-md shadow-emerald-600/20"
              title="Send Question"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
