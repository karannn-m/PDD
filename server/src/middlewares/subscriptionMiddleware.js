import { User } from '../models/mongoose/User.js';

const TIER_LIMITS = {
  FREE: {
    dailyScanLimit: 5,
    features: ['STANDARD_DIAGNOSTICS', 'BASIC_REMEDIES', 'RADAR_VIEW']
  },
  PRO: {
    dailyScanLimit: 100,
    features: [
      'STANDARD_DIAGNOSTICS',
      'BASIC_REMEDIES',
      'RADAR_VIEW',
      'SMART_DOSAGE_CALCULATOR',
      'GEOSPATIAL_PUSH_ALERTS',
      'CLINICAL_PDF_REPORT',
      'VOICE_AI_MULTILINGUAL'
    ]
  },
  ENTERPRISE: {
    dailyScanLimit: Infinity,
    features: ['ALL']
  }
};

/**
 * Middleware: Enforces daily scan quotas per subscription tier
 */
export const checkScanQuota = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      // Unauthenticated anonymous scan fallback: allow 2 scans/day or require login
      return next();
    }

    const tier = req.user.tier || 'FREE';
    if (tier === 'PRO' || tier === 'ENTERPRISE') {
      return next(); // Unlimited or elevated scans
    }

    // Try finding user in database or cache
    const user = await User.findById(userId).catch(() => null);
    if (!user) {
      return next();
    }

    const now = new Date();
    const lastReset = new Date(user.lastScanReset || 0);
    const isNewDay = now.toDateString() !== lastReset.toDateString();

    if (isNewDay) {
      user.dailyScanCount = 0;
      user.lastScanReset = now;
      await user.save();
    }

    const maxAllowed = TIER_LIMITS[tier]?.dailyScanLimit || 5;

    if (user.dailyScanCount >= maxAllowed) {
      return res.status(429).json({
        success: false,
        error: 'QuotaExceeded',
        message: `Daily leaf scan quota of ${maxAllowed} scans reached for the FREE tier. Upgrade to FloraScan Pro for unlimited scans, clinical PDF reports, and real-time radar alerts.`,
        upgradeUrl: '/api/v1/subscriptions/upgrade',
        currentUsage: user.dailyScanCount,
        maxLimit: maxAllowed
      });
    }

    // Increment scan count
    user.dailyScanCount += 1;
    await user.save();

    next();
  } catch (err) {
    console.error('Error checking scan quota:', err);
    next(); // Fail open for resilience if quota check encounters transient error
  }
};

/**
 * Middleware: Feature Gating Guard
 * Example: requireFeature('CLINICAL_PDF_REPORT')
 */
export const requireFeature = (featureName) => {
  return (req, res, next) => {
    const userTier = req.user?.tier || 'FREE';
    const allowedFeatures = TIER_LIMITS[userTier]?.features || [];

    if (allowedFeatures.includes('ALL') || allowedFeatures.includes(featureName)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'FeatureGated',
      message: `The feature '${featureName}' is available exclusively to FloraScan Pro and Enterprise subscribers.`,
      requiredTier: 'PRO',
      currentTier: userTier,
      upgradeUrl: '/api/v1/subscriptions/upgrade'
    });
  };
};
