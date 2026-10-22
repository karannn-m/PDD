import jwt from 'jsonwebtoken';
import { User } from '../models/mongoose/User.js';
import { pgPool } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_florascan_enterprise_2026_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Register new user / farmer
 */
export const registerUser = async (req, res) => {
  try {
    const { email, phone, fullName, password, role = 'FARMER', preferredLang = 'hi', cropFocus = [] } = req.body;

    if (!fullName || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Full name and either an email or phone number are required.'
      });
    }

    // Try finding existing user
    let user = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase() }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    }).catch(() => null);

    if (user) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'A user with this email or phone number already exists.'
      });
    }

    // In production, bcrypt.hash(password, 10)
    const passwordHash = password ? `hashed_${password}` : null;

    user = new User({
      email: email?.toLowerCase(),
      phone,
      fullName,
      passwordHash,
      role,
      tier: 'FREE',
      preferredLang,
      cropFocus
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, tier: user.tier },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: 'Farmer account registered successfully.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
        preferredLang: user.preferredLang,
        cropFocus: user.cropFocus
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'RegistrationFailed',
      message: err.message
    });
  }
};

/**
 * Login user via email/phone and password
 */
export const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Email/phone and password are required.'
      });
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase() },
        { phone: emailOrPhone }
      ]
    }).catch(() => null);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'AuthenticationFailed',
        message: 'Invalid credentials provided.'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, tier: user.tier },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
        preferredLang: user.preferredLang,
        cropFocus: user.cropFocus,
        fields: user.fields
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'LoginError',
      message: err.message
    });
  }
};

/**
 * Get and update farmer profile (crop preferences, field coordinates, FCM token)
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { preferredLang, cropFocus, fcmPushToken, fields } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (preferredLang) user.preferredLang = preferredLang;
    if (cropFocus) user.cropFocus = cropFocus;
    if (fcmPushToken) user.fcmPushToken = fcmPushToken;
    if (fields && Array.isArray(fields)) user.fields = fields;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        tier: user.tier,
        preferredLang: user.preferredLang,
        cropFocus: user.cropFocus,
        fields: user.fields
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
