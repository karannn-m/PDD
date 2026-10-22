import jwt from 'jsonwebtoken';
import { firebaseAdmin } from '../config/firebase.js';
import { User } from '../models/mongoose/User.js';
import { pgPool } from '../config/db.js';

/**
 * Dual Authentication Middleware:
 * Verifies either Firebase ID Token or FloraScan Native JWT Token
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Missing or malformed Authorization header. Expected Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1];

    // 1. Try Firebase Authentication first if token looks like Firebase token
    try {
      const decodedFirebaseToken = await firebaseAdmin.auth().verifyIdToken(token);
      if (decodedFirebaseToken) {
        req.user = {
          id: decodedFirebaseToken.uid,
          firebaseUid: decodedFirebaseToken.uid,
          email: decodedFirebaseToken.email,
          phone: decodedFirebaseToken.phone_number,
          role: decodedFirebaseToken.role || 'FARMER',
          tier: decodedFirebaseToken.tier || 'FREE'
        };
        return next();
      }
    } catch (fbErr) {
      // If not Firebase, fall through to native JWT verification
    }

    // 2. Try FloraScan Native JWT
    const jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_florascan_enterprise_2026_change_in_production';
    const decoded = jwt.verify(token, jwtSecret);

    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      role: decoded.role || 'FARMER',
      tier: decoded.tier || 'FREE'
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'InvalidToken',
      message: 'Token verification failed or session expired.',
      details: err.message
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Guard
 * Allowed roles: 'FARMER', 'AGRI_EXPERT', 'ADMIN'
 */
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required prior to role verification.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Access denied. Endpoint requires one of following roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      });
    }

    next();
  };
};
