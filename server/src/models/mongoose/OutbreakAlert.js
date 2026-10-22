import mongoose from 'mongoose';

const OutbreakAlertSchema = new mongoose.Schema({
  district: { type: String, required: true },
  state: { type: String, required: true },
  diseaseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Disease', 
    required: true 
  },
  // GeoJSON Center point of the detected disease cluster
  centerPoint: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  affectedRadiusKm: { type: Number, default: 15.0 }, // 15km radar perimeter
  activeCasesCount: { type: Number, required: true },
  densityIndex: { type: Number, required: true },
  riskLevel: { 
    type: String, 
    enum: ['LOW_WATCH', 'MODERATE_WATCH', 'HIGH_ALERT', 'CRITICAL_OUTBREAK'], 
    default: 'MODERATE_WATCH' 
  },
  alertHeadline: { type: String, required: true },
  advisoryText: { type: String, required: true },
  isBroadcasted: { type: Boolean, default: false },
  broadcastedAt: { type: Date },
  createdByExpertId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

OutbreakAlertSchema.index({ centerPoint: '2dsphere' });
OutbreakAlertSchema.index({ district: 1, state: 1 });
OutbreakAlertSchema.index({ riskLevel: 1 });
OutbreakAlertSchema.index({ createdAt: -1 });

export const OutbreakAlert = mongoose.model('OutbreakAlert', OutbreakAlertSchema);
