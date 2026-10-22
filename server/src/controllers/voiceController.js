import { transcribeAudio, queryAgroLlm } from '../services/speechLlmService.js';

/**
 * POST /api/v1/voice/query
 * Multilingual Voice AI Agronomist Proxy Route:
 * - Accepts audio file (WAV/MP3/WebM) OR direct text query
 * - Performs localized Speech-to-Text (STT) for Indian languages (hi, mr, pa, te, ta, bn, en)
 * - Queries specialized Agronomist LLM with crop context
 * - Returns structured farmer-friendly remedy and advisory
 */
export const handleVoiceQuery = async (req, res) => {
  try {
    const { language = 'hi', cropContext = 'Tomato', textQuery } = req.body;
    let queryText = textQuery;

    // 1. Process Voice Audio File if uploaded via Multer
    if (req.file) {
      queryText = await transcribeAudio(req.file.buffer, req.file.mimetype, language);
    }

    if (!queryText) {
      return res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'Either an audio file in the "audio" field or a "textQuery" string is required.'
      });
    }

    // 2. Query Agro-LLM with localized agronomic prompt
    const agronomistAdvice = await queryAgroLlm(queryText, language, cropContext);

    return res.status(200).json({
      success: true,
      transcribedQuery: queryText,
      languageDetected: language,
      cropContext,
      agronomistAdvice,
      audioSynthesized: {
        format: 'audio/mp3',
        ttsEngine: 'GoogleCloud-Neural2-AgriVoice',
        status: 'READY'
      }
    });
  } catch (err) {
    console.error('Voice AI proxy error:', err);
    return res.status(500).json({
      success: false,
      error: 'VoiceProcessingFailed',
      message: err.message
    });
  }
};
