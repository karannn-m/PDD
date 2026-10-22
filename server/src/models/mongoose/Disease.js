import mongoose from 'mongoose';

const DiseaseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true },
  commonName: { type: String, required: true },
  scientificName: { type: String, required: true },
  pathogenType: { 
    type: String, 
    required: true,
    enum: ['FUNGAL', 'BACTERIAL', 'VIRAL', 'PEST', 'DEFICIENCY', 'HEALTHY'] 
  },
  hostCrops: [{ type: String, required: true }],
  symptomsSummary: { type: String, required: true },
  environmentalTriggers: { type: String }
}, { timestamps: true });

DiseaseSchema.index({ pathogenType: 1 });
DiseaseSchema.index({ hostCrops: 1 });

export const Disease = mongoose.model('Disease', DiseaseSchema);
