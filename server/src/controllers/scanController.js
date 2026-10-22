import { uploadBufferToS3 } from '../config/s3.js';
import { runLeafDiseaseInference } from '../services/mlInferenceService.js';
import { calculateDosage } from '../services/dosageCalculator.js';
import { Scan } from '../models/mongoose/Scan.js';
import { pgPool } from '../config/db.js';

/**
 * Applies differential privacy fuzzing to GPS coordinates (~500m offset)
 * Prevents exact pinpointing of farmer homesteads while preserving cluster epidemiologic accuracy.
 */
const applyDifferentialPrivacyJitter = (lat, lng, jitterRadiusKm = 0.5) => {
  if (!lat || !lng) return { lat: null, lng: null };
  const earthRadiusKm = 6371;
  const radiusInDegrees = jitterRadiusKm / earthRadiusKm;

  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const jitteredLat = lat + (x * 180) / Math.PI;
  const jitteredLng = lng + (y * 180) / Math.PI / Math.cos((lat * Math.PI) / 180);

  return {
    lat: Number(jitteredLat.toFixed(5)),
    lng: Number(jitteredLng.toFixed(5))
  };
};

/**
 * POST /api/v1/scans/analyze
 * Main image diagnostic pipeline:
 * 1. Validates and uploads file buffer to S3
 * 2. Runs AI Disease Classification (TFLite / ONNX / TorchServe)
 * 3. Logs scan metadata & PostGIS spatial point
 * 4. Precomputes basic dosage & remedy recommendations
 */
export const analyzeScan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'BadRequest',
        message: 'No leaf image uploaded. Please provide a JPEG, PNG, or WebP photo in the "image" field.'
      });
    }

    const {
      cropHint,
      latitude,
      longitude,
      district = 'Bathinda',
      state = 'Punjab',
      sourcePlatform = 'WEB'
    } = req.body;

    // 1. Upload leaf photo to S3 Storage
    const timestamp = Date.now();
    const s3Key = `scans/${timestamp}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const imageUrl = await uploadBufferToS3(req.file.buffer, s3Key, req.file.mimetype);

    // 2. Execute AI ML Inference Pipeline
    const aiPrediction = await runLeafDiseaseInference(req.file.buffer, req.file.mimetype, cropHint);

    // 3. Apply Differential Privacy to Farm Coordinates
    const parsedLat = latitude ? parseFloat(latitude) : null;
    const parsedLng = longitude ? parseFloat(longitude) : null;
    const { lat: fuzzedLat, lng: fuzzedLng } = applyDifferentialPrivacyJitter(parsedLat, parsedLng);

    // 4. Save Scan Log to Database (Mongoose)
    const scanLog = new Scan({
      userId: req.user?.id || null,
      imageUrl,
      originalFilename: req.file.originalname,
      cropIdentified: aiPrediction.cropIdentified,
      confidenceScore: aiPrediction.confidenceScore,
      severityPercentage: aiPrediction.severityPercentage,
      status: 'COMPLETED',
      location: (fuzzedLat && fuzzedLng) ? {
        type: 'Point',
        coordinates: [fuzzedLng, fuzzedLat] // [longitude, latitude] GeoJSON
      } : undefined,
      district,
      state,
      sourcePlatform,
      modelEngine: aiPrediction.modelEngine,
      inferenceTimeMs: aiPrediction.inferenceTimeMs
    });

    await scanLog.save().catch((err) => console.warn('Mongoose scan log note:', err.message));

    // Optional: Save to PostgreSQL with PostGIS geometry
    try {
      if (fuzzedLat && fuzzedLng) {
        await pgPool.query(
          `INSERT INTO scans (id, image_url, original_filename, crop_identified, confidence_score, severity_percentage, status, latitude, longitude, location, district, state, model_engine, inference_time_ms)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, ST_SetSRID(ST_MakePoint($10, $11), 4326), $12, $13, $14, $15)`,
          [
            scanLog._id.toString(),
            imageUrl,
            req.file.originalname,
            aiPrediction.cropIdentified,
            aiPrediction.confidenceScore,
            aiPrediction.severityPercentage,
            'COMPLETED',
            fuzzedLat,
            fuzzedLng,
            fuzzedLng, // ST_MakePoint(lng, lat)
            fuzzedLat,
            district,
            state,
            aiPrediction.modelEngine,
            aiPrediction.inferenceTimeMs
          ]
        );
      }
    } catch (pgErr) {
      // PostgreSQL logging fallback
    }

    // 5. Precalculate Standard 1-Acre Dosage Plan for farmer convenience
    const standardDosage = calculateDosage({
      acreage: 1.0,
      unit: 'ACRES',
      tankCapacityLiters: 16,
      recommendedDosageGramsOrMl: 600,
      dilutionRatioMlPerL: 3.0
    });

    return res.status(200).json({
      success: true,
      message: 'Leaf scan analyzed successfully.',
      scanId: scanLog._id,
      imageUrl,
      diagnosis: {
        crop: aiPrediction.cropIdentified,
        diseaseSlug: aiPrediction.diseaseSlug,
        diseaseName: aiPrediction.diseaseName,
        scientificName: aiPrediction.scientificName,
        pathogenType: aiPrediction.pathogenType,
        confidenceScore: aiPrediction.confidenceScore,
        confidenceFormatted: `${(aiPrediction.confidenceScore * 100).toFixed(1)}%`,
        severityPercentage: aiPrediction.severityPercentage,
        symptoms: aiPrediction.symptoms
      },
      quickRemedies: {
        chemical: aiPrediction.chemicalRemedy ? `${aiPrediction.chemicalRemedy.name} - ${aiPrediction.chemicalRemedy.dosagePerAcre}` : 'No chemical fungicide required for healthy foliage.',
        organic: aiPrediction.organicRemedy ? `${aiPrediction.organicRemedy.name} - ${aiPrediction.organicRemedy.dosagePerAcre}` : 'Maintain organic soil health.'
      },
      detailedTreatmentPlan: {
        chemical: aiPrediction.chemicalRemedy,
        organic: aiPrediction.organicRemedy
      },
      top3Candidates: aiPrediction.top3Candidates || [],
      standardDosagePlan: standardDosage,
      reportDownloadUrl: `/api/v1/scans/${scanLog._id}/report-pdf`,
      telemetry: {
        inferenceTimeMs: aiPrediction.inferenceTimeMs,
        modelEngine: aiPrediction.modelEngine,
        privacyPreservedGPS: fuzzedLat && fuzzedLng ? { lat: fuzzedLat, lng: fuzzedLng } : null
      }
    });
  } catch (err) {
    console.error('Scan analysis error:', err);
    return res.status(500).json({
      success: false,
      error: 'AnalysisFailed',
      message: err.message
    });
  }
};

/**
 * GET /api/v1/scans
 * Fetch historical scan logs for authenticated farmer
 */
export const getScanHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { limit = 20, page = 1 } = req.query;

    const scans = await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: scans.length,
      scans
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
