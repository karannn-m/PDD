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
  AlertCircle
} from 'lucide-react';

export default function PlantDoctorModal({ isOpen, onClose, diagnosis }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'bot',
      text: `Hello! I'm your FloraScan Senior Plant Pathologist & Agronomist Assistant. I am actively reviewing your specimen: **${diagnosis.plantName}** (${diagnosis.diseaseName}, Certainty: ${diagnosis.confidence}%).\n\nYou can type your question below or click the 🎙️ **Microphone** to speak with me in English or Hindi! How can I assist you with curing this crop or dosage guidelines?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef(null);

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
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Remove markdown formatting symbols for natural vocalization
    const cleanSpeech = text
      .replace(/[*_#`[\]()]/g, '')
      .replace(/•/g, ', ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Voice Assistant: Speech to Text (STT)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // Supports Hinglish/English

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed to start:', err);
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  const quickQuestions = [
    `How to treat ${diagnosis.diseaseName} organically?`,
    'Neem oil dilution & exact spray dosage?',
    'Is the fruit safe for human consumption?',
    'Patte peele kyun pad rahe hain? (Why yellow leaves?)'
  ];

  // Deep Agronomic Knowledge Engine
  const generateDoctorResponse = (query) => {
    const q = query.toLowerCase();

    // Hindi / Hinglish and English NLP matching
    if (q.includes('neem') || q.includes('dosage') || q.includes('kitna') || q.includes('spray')) {
      return `**Standard Organic Neem Oil Protocol:**\n\n• **Dosage:** Mix 5ml pure cold-pressed Neem Oil + 2ml mild liquid soap (as emulsifier) per 1 Litre of lukewarm water.\n• **Application:** Spray thoroughly under and over the leaf surfaces.\n• **Timing:** Apply strictly at sunrise or late afternoon (after 5 PM) to prevent solar leaf burning.\n• **Frequency:** Repeat once every 5 to 7 days until no new active lesions form.`;
    }

    if (q.includes('fruit') || q.includes('eat') || q.includes('khana') || q.includes('safe') || q.includes('sabzi')) {
      return diagnosis.severity === 'Healthy'
        ? "Yes! This specimen is 100% healthy, and produce from this crop is completely safe, fresh, and nutritious to consume."
        : `**Produce Safety Guidelines for ${diagnosis.diseaseName}:**\n\n• **Blemished Fruit:** Do not consume soft, sunken, or rotting produce.\n• **Unblemished Fruit:** Clean, firm fruit from the same vine can be eaten if washed under running water.\n• **Chemical Spray Warning:** If you applied synthetic fungicides (like Mancozeb or Chlorothalonil), you must observe a mandatory **Pre-Harvest Interval (PHI)** of 5–7 days before harvesting!`;
    }

    if (q.includes('peele') || q.includes('yellow') || q.includes('chlorosis')) {
      return `**Why Foliage Turns Yellow (Chlorosis):**\n\n1. **Fungal Halo:** Pathogens like Early/Late Blight produce toxins that destroy chlorophyll around lesions.\n2. **Nitrogen Deficiency:** Older lower leaves turn pale yellow uniformly.\n3. **Over-Watering:** Waterlogged soil suffocates fine feeder roots, preventing nutrient uptake. Allow the top 5cm of soil to dry out before watering again.`;
    }

    if (q.includes('organic') || q.includes('gharelu') || q.includes('home remedy') || q.includes('nuskhe')) {
      return `**Top 3 Organic Remedies for ${diagnosis.diseaseName}:**\n\n1. **Baking Soda / Potassium Bicarbonate Fungicide:** 1 tablespoon baking soda + 1/2 teaspoon liquid soap in 4 litres of water. Alters leaf pH to inhibit spore germination.\n2. **Bio-Fungicide (Bacillus subtilis):** Apply beneficial bacterial inoculants (like Serenade) that actively outcompete pathogen hyphae.\n3. **Sanitary Pruning:** Clip affected foliage using shears wiped with 70% alcohol and discard in trash bags (never compost infected tissue).`;
    }

    if (q.includes('fail') || q.includes('spread') || q.includes('contagious') || q.includes('doosre')) {
      return `**Contagion Risk Assessment:**\n\n${diagnosis.diseaseName} is **${diagnosis.spreadRisk}**! Fungal conidia and bacterial ooze transfer rapidly through wind drafts, splash from overhead irrigation, and contaminated pruning tools. Space plants at least 60cm apart and install drip lines to keep canopy foliage dry.`;
    }

    // Default intelligent botanical answer
    return `**Agronomy Diagnostic Assessment for ${diagnosis.plantName}:**\n\nRegarding "${query}": For **${diagnosis.diseaseName}** (${diagnosis.confidence}% confidence), your primary immediate priority is to physically remove the affected leaves with sterilized shears. Then follow up with **${diagnosis.organicTreatments[0] || 'an organic bio-fungicide spray'}**. Monitor new vegetative shoots over the next 4–6 days for clean tissue expansion.`;
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Generate smart agronomy response
    setTimeout(() => {
      const responseText = generateDoctorResponse(query);
      const botMsg = { id: `bot-${Date.now()}`, sender: 'bot', text: responseText };
      setMessages((prev) => [...prev, botMsg]);

      // Automatically speak out response if enabled
      if (autoSpeak) {
        speakText(responseText);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col h-[650px] max-h-[92vh] overflow-hidden">
        
        {/* Header with Voice Status */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-emerald-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-slate-800 text-base sm:text-lg">
                  AI Plant Doctor & Voice Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 border border-teal-200">
                  Trained Agronomist
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Specimen Context: <strong className="text-emerald-800">{diagnosis.plantName}</strong> • {diagnosis.diseaseName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Toggle */}
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
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
                stopSpeaking();
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

              <div className="space-y-1 max-w-[85%]">
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Speak button on bot messages */}
                {msg.sender === 'bot' && (
                  <div className="flex items-center gap-2 pl-1">
                    <button
                      onClick={() => speakText(msg.text)}
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Ask:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 transition-colors text-xs font-medium shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar with Voice Microphone */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={isListening ? () => setIsListening(false) : startListening}
              className={`p-3 rounded-2xl transition-all flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
              title={isListening ? 'Listening... Speak now' : 'Click to speak via Microphone'}
            >
              {isListening ? <Mic className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : `Ask doctor about ${diagnosis.diseaseName}...`}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 text-xs sm:text-sm bg-slate-50/50"
            />

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-all shadow-md shadow-emerald-600/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {isListening && (
            <p className="text-[11px] text-rose-600 text-center font-bold pt-1.5 animate-pulse">
              🎙️ Listening to your voice... Speak your plant question clearly.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
