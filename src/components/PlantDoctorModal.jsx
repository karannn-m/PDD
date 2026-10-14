import React, { useState } from 'react';
import { X, MessageSquare, Send, Sparkles, Bot, User, CheckCircle2, Sprout } from 'lucide-react';

export default function PlantDoctorModal({ isOpen, onClose, diagnosis }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! I'm your FloraScan Plant Doctor assistant. I have reviewed your scan for **${diagnosis.plantName}** diagnosed with **${diagnosis.diseaseName}** (${diagnosis.confidence}% confidence). How can I assist you with treating this or protecting the rest of your garden?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const quickQuestions = [
    `Is ${diagnosis.diseaseName} contagious to other plants?`,
    'Is the fruit/harvest safe to eat?',
    'What time of day is best to spray treatments?',
    'How do I sanitize my pruning shears?'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInputValue('');

    // Formulate tailored intelligent plant doctor answer
    setTimeout(() => {
      let reply = '';
      const lower = query.toLowerCase();

      if (lower.includes('contagious') || lower.includes('spread')) {
        reply = diagnosis.severity === 'Healthy'
          ? "No risk of contagion! Your plant has no active fungal or viral pathogens detected. Keep up your routine maintenance."
          : `Yes, ${diagnosis.diseaseName} is considered ${diagnosis.spreadRisk.toLowerCase()}. Spores travel quickly via wind gusts and overhead water splashing. We strongly advise quarantining or spacing out neighboring plants and watering only at the soil line.`;
      } else if (lower.includes('eat') || lower.includes('fruit') || lower.includes('harvest') || lower.includes('safe')) {
        reply = diagnosis.severity === 'Healthy'
          ? "The plant is healthy, and properly grown produce is completely safe to enjoy."
          : `For fruit from plants with ${diagnosis.diseaseName}: If the fruit itself exhibits rot, lesions, or sunken soft spots, discard it immediately. Blemish-free fruit from the same vine can generally be eaten if washed thoroughly, provided you haven't applied synthetic chemicals within the designated Pre-Harvest Interval (PHI).`;
      } else if (lower.includes('time') || lower.includes('spray') || lower.includes('when')) {
        reply = "The best time to apply treatments (both organic copper/neem or targeted fungicides) is either **early morning before 9 AM** or **late afternoon near sunset**. Applying during intense midday sun can cause severe phytotoxic leaf scorching, and wet leaves overnight invite mold.";
      } else if (lower.includes('sanitize') || lower.includes('shears') || lower.includes('tools')) {
        reply = "Soak or wipe your blades with **70% Isopropyl alcohol** or a 1:9 household bleach solution for at least 30 seconds between every single cut. This prevents transferring microscopic fungal hyphae and bacteria from sick foliage to healthy stems.";
      } else {
        reply = `Regarding "${query}": For ${diagnosis.diseaseName} on ${diagnosis.plantName}, the primary priority is to prune away damaged tissue with sterilized shears, reduce foliage dampness, and apply the recommended ${diagnosis.organicTreatments[0] || 'preventative measures'}. Monitor the new emerging growth over the next 5-7 days!`;
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col h-[580px] max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-emerald-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-slate-800 text-base">
                  Ask FloraScan Plant Doctor
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                  AI Agronomist
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Context: {diagnosis.plantName} • {diagnosis.diseaseName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-100 text-teal-800'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-800 border border-slate-200/60'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick ask:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 transition-colors text-[11px] font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask a question about ${diagnosis.diseaseName}...`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
