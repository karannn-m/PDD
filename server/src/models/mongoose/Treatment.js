import mongoose from 'mongoose';

const TreatmentSchema = new mongoose.Schema({
  diseaseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Disease', 
    required: true 
  },
  remedyType: { 
    type: String, 
    enum: ['ORGANIC', 'CHEMICAL'], 
    required: true 
  },
  brandName: { type: String },
  activeIngredient: { type: String, required: true },
  
  // Dosage calculation parameters per Acre
  recommendedDosageGramsOrMl: { type: Number, required: true }, // e.g. 600g or 1000ml per acre
  waterDilutionLiters: { type: Number, required: true, default: 200 }, // Standard 200L/acre
  dilutionRatioMlPerL: { type: Number, required: true }, // e.g. 3.0 ml / gm per Liter
  
  stage: { 
    type: String, 
    enum: ['PREVENTIVE', 'EARLY_CURATIVE', 'CRITICAL_ERADICATION'],
    required: true 
  },
  applicationIntervalDays: { type: Number, default: 7 },
  preHarvestIntervalDays: { type: Number, default: 0 }, // PHI in days
  safetyInstructions: [{ type: String }],
  affiliateStoreLinks: {
    bighaat: { type: String },
    agrostar: { type: String },
    iffco: { type: String },
    amazon: { type: String }
  }
}, { timestamps: true });

TreatmentSchema.index({ diseaseId: 1, remedyType: 1 });

export const Treatment = mongoose.model('Treatment', TreatmentSchema);
