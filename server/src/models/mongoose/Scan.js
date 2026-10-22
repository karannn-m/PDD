import mongoose from 'mongoose';

const ScanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fieldId: { type: mongoose.Schema.Types.ObjectId },
  imageUrl: { type: String, required: true },
  originalFilename: { type: String },
  cropIdentified: { type: String, required: true },
  diseaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Disease' },
  confidenceScore: { type: Number, required: true, min: 0, max: 1 },
  severityPercentage: { type: Number, min: 0, max: 100 },
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED'], 
    default: 'COMPLETED' 
  },
  // GeoJSON Point for spatial disease clustering & outbreak detection
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false
    }
  },
  district: { type: String },
  state: { type: String },
  sourcePlatform: { type: String, default: 'WEB' },
  modelEngine: { type: String, default: 'ONNX_TFLITE_V2_QUANT' },
  inferenceTimeMs: { type: Number }
}, { timestamps: true });

// 2dsphere index for fast geospatial proximity queries (e.g. 15km radius)
ScanSchema.index({ location: '2dsphere' });
ScanSchema.index({ cropIdentified: 1 });
ScanSchema.index({ diseaseId: 1 });
ScanSchema.index({ createdAt: -1 });

export const Scan = mongoose.model('Scan', ScanSchema);
