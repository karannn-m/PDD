/**
 * FloraScan - Multilingual Voice AI Assistant Service
 * ========================================================
 * Provides bidirectional voice interaction (STT & TTS) tailored for farmers
 * in regional Indian languages & dialects (Hindi, Punjabi, Marathi, Telugu, Tamil, Bengali, English).
 */

export const SUPPORTED_LANGUAGES = [
  {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    sampleQuery: 'इस बीमारी को ठीक करने के लिए क्या छिड़कें?',
    welcome: 'नमस्ते! मैं आपका फ्लोरास्कैन पौधा चिकित्सक हूँ। आप मुझसे बोलकर या लिखकर अपनी फसल के बारे में पूछ सकते हैं।'
  },
  {
    code: 'pa-IN',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🌾',
    sampleQuery: 'ਇਸ ਬਿਮਾਰੀ ਦੇ ਇਲਾਜ ਲਈ ਕਿਹੜੀ ਦਵਾਈ ਪਾਈਏ?',
    welcome: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਪੌਦਾ ਡਾਕਟਰ ਹਾਂ। ਤੁਸੀਂ ਬੋਲ ਕੇ ਆਪਣੀ ਫਸਲ ਦੀ ਬਿਮਾਰੀ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।'
  },
  {
    code: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🌱',
    sampleQuery: 'पानावरील डागांवर कोणता उपाय करावा?',
    welcome: 'नमस्कार! मी तुमचा फ्लोरास्कॅन पीक सल्लागार आहे. आपल्या पिकाच्या रोगाबद्दल विचारा.'
  },
  {
    code: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🌿',
    sampleQuery: 'ఈ తెగులు నివారణకు ఏ మందు పిచికారీ చేయాలి?',
    welcome: 'నమస్కారం! నేను మీ ఫ్లోరాస్కాన్ మొక్కల వైద్యుడిని. మీ పంట సమస్య గురించి అడగండి.'
  },
  {
    code: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🍃',
    sampleQuery: 'இந்த நோயைக் குணப்படுத்த என்ன மருந்து தெளிக்க வேண்டும்?',
    welcome: 'வணக்கம்! நான் உங்கள் பயிர் மருத்துவர். உங்கள் பயிரின் நோய் பற்றி குரல் மூலம் கேட்கலாம்.'
  },
  {
    code: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🌾',
    sampleQuery: 'পাতার এই দাগ দূর করতে কী স্প্রে করব?',
    welcome: 'নমস্কার! আমি আপনার ফ্লোরাস্ক্যান উদ্ভিদ চিকিৎসক। ফসলের রোগ নিয়ে আমাকে বলুন।'
  },
  {
    code: 'en-IN',
    name: 'English (India)',
    nativeName: 'English',
    flag: '🌐',
    sampleQuery: 'What is the dosage of organic neem spray?',
    welcome: 'Hello! I am your FloraScan Plant Doctor. Speak or type your questions regarding cures and dosage.'
  }
];

// Vernacular Agricultural Knowledge Responses mapped by disease & language
const VERNACULAR_RESPONSES = {
  'hi-IN': {
    blight: 'आपकी फसल में लेट ब्लाइट (झुलसा रोग) के लक्षण हैं। तुरंत प्रभावित पत्तियों को काटकर खेत से दूर फेंकें। नीम तेल 5 मिली प्रति लीटर पानी में या कॉपर ऑक्सीक्लोराइड 2.5 ग्राम प्रति लीटर पानी का छिड़काव सुबह के समय करें।',
    scab: 'पत्तियों पर काले-भूरे पपड़ीदार धब्बे (स्कैब) हैं। इसके लिए फफूंदनाशक मैन्कोज़ेब या नीम के अर्क का छिड़काव करें और पेड़ों की कटाई-छंटाई कर धूप आने दें।',
    mildew: 'सफेद चूर्ण जैसा फफूंद (पाउडरी मिल्ड्यू) फैला है। 1 लीटर पानी में 5 ग्राम बेकिंग सोडा और थोड़ा साबुन मिलाकर छिड़कें, या घुलनशील सल्फर का उपयोग करें।',
    healthy: 'आपकी फसल एकदम स्वस्थ और हरी-भरी है! इसमें किसी दवा की आवश्यकता नहीं है। समय पर जैविक खाद और सिंचाई जारी रखें।'
  },
  'pa-IN': {
    blight: 'ਤੁਹਾਡੀ ਫਸਲ ਉੱਤੇ ਝੁਲਸ ਰੋਗ (ਲੇਟ ਬਲਾਈਟ) ਦਾ ਅਸਰ ਹੈ। ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਤੁਰੰਤ ਤੋੜ ਕੇ ਨਸ਼ਟ ਕਰੋ। ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ ਜਾਂ ਨਿੰਮ ਦੇ ਤੇਲ ਦਾ ਸਵੇਰੇ ਛਿੜਕਾਅ ਕਰੋ।',
    scab: 'ਪੱਤਿਆਂ ਤੇ ਕਾਲੇ ਧੱਬੇ ਦਿਖ ਰਹੇ ਹਨ। ਮੈਨਕੋਜ਼ੇਬ ਫੰਗੀਸਾਈਡ ਦਾ ਛਿੜਕਾਅ ਕਰੋ ਅਤੇ ਪਾਣੀ ਜ਼ਿਆਦਾ ਨਾ ਖੜ੍ਹਾ ਹੋਣ ਦਿਓ।',
    mildew: 'ਪੱਤਿਆਂ ਉੱਤੇ ਚਿੱਟੀ ਉੱਲੀ ਦਾ ਹਮਲਾ ਹੈ। ਸਲਫਰ ਜਾਂ ਨਿੰਮ ਦੇ ਅਰਕ ਦਾ ਛਿੜਕਾਅ ਲਾਹੇਵੰਦ ਰਹੇਗਾ।',
    healthy: 'ਤੁਹਾਡੀ ਫਸਲ ਬਿਲਕੁਲ ਤੰਦਰੁਸਤ ਹੈ! ਕੋਈ ਦਵਾਈ ਪਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ, ਸਿਰਫ ਸੰਤੁਲਿਤ ਪਾਣੀ ਦਿਓ।'
  },
  'mr-IN': {
    blight: 'तुमच्या पिकावर करपा (ब्लाइट) रोगाचा प्रादुर्भाव झाला आहे. तातडीने बाधित पाने काढून नष्ट करा. कॉपर ऑक्सीक्लोराईड किंवा ट्रायकोडर्माची फवारणी करा.',
    scab: 'पानांवर काळे ठिपके आहेत. मँकोझेब किंवा कडुनिंब तेलाची योग्य प्रमाणात फवारणी करावी.',
    mildew: 'भुरी रोगाची लक्षणे दिसत आहेत. पाण्यात विरघळणारे गंधक (सल्फर) किंवा बेकिंग सोडा फवारा.',
    healthy: 'तुमचे पीक पूर्णपणे निरोगी आहे! कोणत्याही रासायनिक औषधाची गरज नाही.'
  },
  'te-IN': {
    blight: 'మీ పంటకు ఆకుమాడు తెగులు (బ్లైట్) సోకింది. దెబ్బతిన్న ఆకులను వెంటనే తొలగించండి. కాపర్ ఆక్సిక్లోరైడ్ మందును లీటరు నీటికి 3 గ్రాములు కలిపి పిచికారీ చేయండి.',
    scab: 'ఆకులపై నల్లని మచ్చలు ఉన్నాయి. మాంకోజెబ్ మందు పిచికారీ చేయడం వల్ల రోగం తగ్గుతుంది.',
    mildew: 'బూడిద తెగులు లక్షణాలు కనిపిస్తున్నాయి. లీటరు నీటికి వేప నూనె 5 మి.లీ కలిపి చల్లండి.',
    healthy: 'మీ పంట చాలా ఆరోగ్యంగా ఉంది! ఎటువంటి మందులు పిచికారీ చేయాల్సిన అవసరం లేదు.'
  },
  'ta-IN': {
    blight: 'உங்கள் பயிரில் இலைக்கருகல் நோய் காணப்படுகிறது. பாதிக்கப்பட்ட இலைகளை உடனே அப்புறப்படுத்துங்கள். காப்பர் ஆக்ஸிகுளோரைடு அல்லது வேப்பெண்ணெய் தெளிக்கவும்.',
    scab: 'இலைகளில் கரும்புள்ளிகள் உள்ளன. மான்கோசெப் பூஞ்சாணக்கொல்லி தெளிக்க பரிந்துரைக்கப்படுகிறது.',
    mildew: 'சாம்பல் நோய் அறிகுறி தெரிகிறது. நனையும் கந்தகம் அல்லது வேப்பெண்ணெய் தெளிக்கவும்.',
    healthy: 'உங்கள் பயிர் மிகவும் ஆரோக்கியமாக உள்ளது! எந்த மருந்தும் தேவையில்லை.'
  },
  'bn-IN': {
    blight: 'আপনার ফসলে ধসা রোগ (ব্লাইট) দেখা দিয়েছে। আক্রান্ত পাতা দ্রুত কেটে ফেলুন। কপার অক্সিক্লোরাইড স্প্রে করুন।',
    scab: 'পাতায় কালো দাগ পড়েছে। ম্যানকোজেব ছত্রাকনাশক স্প্রে করা জরুরি।',
    mildew: 'পাতায় সাদা পাউডারের মতো ছত্রাক (পাউডারি মিলডিউ) রয়েছে। নিম তেল স্প্রে করুন।',
    healthy: 'আপনার ফসল সম্পূর্ণ সুস্থ রয়েছে! কোনো রাসায়নিক ব্যবহারের প্রয়োজন নেই।'
  },
  'en-IN': {
    blight: 'Late Blight water-mold detected. Promptly prune infected leaves, switch strictly to drip irrigation, and apply bio-fungicide Bacillus subtilis or Copper Octanoate at 2.5g/L.',
    scab: 'Apple Scab symptoms observed. Apply pure cold-pressed Neem Oil (0.5% solution) or Mancozeb protective fungicide.',
    mildew: 'Powdery Mildew identified. Use potassium bicarbonate or diluted whole milk spray (40% milk, 60% water) in morning sun.',
    healthy: 'Specimen is in optimal health! Maintain regular balanced organic nutrition and proper soil moisture.'
  }
};

/**
 * Text-to-Speech (TTS) Voice Engine
 * Cleans markdown and synthesizes speech using the browser SpeechSynthesis API.
 */
export function playSpeech({ text, langCode = 'hi-IN', onStart, onEnd, onError }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError(new Error('Speech Synthesis not supported in this browser.'));
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown, asterisks, brackets, hashes, links
  const sanitizedText = text
    .replace(/[*_#`[\]()]/g, '')
    .replace(/•/g, ', ')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(sanitizedText);
  utterance.lang = langCode;
  utterance.rate = 0.95; // Slightly slower for crisp agricultural comprehension
  utterance.pitch = 1.0;

  // Try to pick a native localized voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.startsWith(langCode.slice(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
}

/**
 * Cancel active speech
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speech-to-Text (STT) Voice Recognition Wrapper
 */
export function createSpeechRecognizer({
  langCode = 'hi-IN',
  onResult,
  onError,
  onStart,
  onEnd
}) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = langCode;

  if (onStart) recognition.onstart = onStart;
  if (onEnd) recognition.onend = onEnd;

  recognition.onresult = (event) => {
    if (event.results && event.results[0] && event.results[0][0]) {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    if (onError) onError(event);
  };

  return recognition;
}

/**
 * Generates an agronomy diagnosis answer in the target language
 */
export function getVernacularDoctorAnswer(userQuery, diagnosis, langCode = 'hi-IN') {
  const langKey = VERNACULAR_RESPONSES[langCode] ? langCode : 'hi-IN';
  const responses = VERNACULAR_RESPONSES[langKey];

  const disease = (diagnosis.diseaseName || '').toLowerCase();
  let key = 'blight';

  if (disease.includes('healthy') || diagnosis.severity === 'Healthy') {
    key = 'healthy';
  } else if (disease.includes('mildew')) {
    key = 'mildew';
  } else if (disease.includes('scab') || disease.includes('spot')) {
    key = 'scab';
  }

  const baseAnswer = responses[key];
  return baseAnswer;
}
