import { Router } from 'express';
import { registerUser, loginUser, updateProfile, sendOtp, verifyOtp } from '../controllers/authController.js';
import { analyzeScan, getScanHistory } from '../controllers/scanController.js';
import { getDiseaseRemedies, calculateSmartDosage } from '../controllers/treatmentController.js';
import { getOutbreakClusters, triggerRegionalAlert } from '../controllers/radarController.js';
import { handleVoiceQuery } from '../controllers/voiceController.js';
import { getScanReportPdf } from '../controllers/reportController.js';

import { authenticate, requireRoles } from '../middlewares/authMiddleware.js';
import { checkScanQuota, requireFeature } from '../middlewares/subscriptionMiddleware.js';
import { leafUpload, voiceUpload } from '../middlewares/uploadMiddleware.js';

const router = Router();

// ==========================================
// 1. AUTHENTICATION & USER PROFILE MODULE
// ==========================================
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/send-otp', sendOtp);
router.post('/auth/verify-otp', verifyOtp);
router.put('/auth/profile', authenticate, updateProfile);

// ==========================================
// 2. LEAF SCAN & AI DIAGNOSTIC PIPELINE
// ==========================================
// Note: Quota check allows free scans up to daily cap, or unlimited for Pro
router.post(
  '/scans/analyze',
  leafUpload.single('image'),
  checkScanQuota,
  analyzeScan
);
router.get('/scans', authenticate, getScanHistory);

// ==========================================
// 3. TREATMENT & CARE HUB ENGINE
// ==========================================
router.get('/diseases/:id/remedies', getDiseaseRemedies);
router.post('/treatments/calculate-dosage', calculateSmartDosage);

// ==========================================
// 4. GEOSPATIAL DISEASE TRACKING & ALERT RADAR
// ==========================================
router.get('/radar/outbreak-clusters', getOutbreakClusters);
router.post(
  '/radar/trigger-alert',
  authenticate,
  requireRoles('AGRI_EXPERT', 'ADMIN'),
  triggerRegionalAlert
);

// ==========================================
// 5. VOICE AI & LOCALIZATION INTERFACE
// ==========================================
router.post('/voice/query', voiceUpload.single('audio'), handleVoiceQuery);

// ==========================================
// 6. REPORT GENERATION & SUBSCRIPTION SYSTEM
// ==========================================
router.get(
  '/scans/:id/report-pdf',
  authenticate,
  requireFeature('CLINICAL_PDF_REPORT'),
  getScanReportPdf
);

// Mock upgrade checkout session endpoint
router.post('/subscriptions/upgrade', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Subscription upgrade initiated.',
    checkoutUrl: 'https://checkout.stripe.com/pay/florascan_pro_monthly'
  });
});

export default router;
