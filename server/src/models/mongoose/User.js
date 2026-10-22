import mongoose from 'mongoose';

const FieldSubSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  cropType: { type: String, required: true },
  acreage: { type: Number, required: true },
  soilType: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude] GeoJSON standard
      required: true
    }
  }
}, { _id: true, timestamps: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  passwordHash: { type: String },
  firebaseUid: { type: String, unique: true, sparse: true },
  role: { 
    type: String, 
    enum: ['FARMER', 'AGRI_EXPERT', 'ADMIN'], 
    default: 'FARMER' 
  },
  tier: { 
    type: String, 
    enum: ['FREE', 'PRO', 'ENTERPRISE'], 
    default: 'FREE' 
  },
  preferredLang: { 
    type: String, 
    enum: ['hi', 'en', 'mr', 'pa', 'te', 'ta', 'bn'], 
    default: 'hi' 
  },
  cropFocus: [{ type: String }],
  fcmPushToken: { type: String },
  fields: [FieldSubSchema],
  dailyScanCount: { type: Number, default: 0 },
  lastScanReset: { type: Date, default: Date.now }
}, { timestamps: true });

UserSchema.index({ 'fields.location': '2dsphere' });
UserSchema.index({ role: 1 });
UserSchema.index({ tier: 1 });

export const User = mongoose.model('User', UserSchema);
