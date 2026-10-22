import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Disease } from '../src/models/mongoose/Disease.js';
import { Treatment } from '../src/models/mongoose/Treatment.js';

dotenv.config();

const SEED_DISEASES = [
  {
    slug: 'tomato-early-blight',
    commonName: 'Early Blight',
    scientificName: 'Alternaria solani',
    pathogenType: 'FUNGAL',
    hostCrops: ['Tomato', 'Potato', 'Eggplant'],
    symptomsSummary: 'Concentric brown target rings on older foliage with chlorotic yellow halo. Causes leaf drop and sunscald.',
    environmentalTriggers: 'High relative humidity (>80%) and warm temperatures (24-29°C).'
  },
  {
    slug: 'potato-late-blight',
    commonName: 'Late Blight',
    scientificName: 'Phytophthora infestans',
    pathogenType: 'FUNGAL',
    hostCrops: ['Potato', 'Tomato'],
    symptomsSummary: 'Water-soaked irregular black/brown lesions with cottony white fungal growth on leaf undersides.',
    environmentalTriggers: 'Cool, wet, cloudy weather with persistent rain and temperatures between 12-22°C.'
  },
  {
    slug: 'grape-powdery-mildew',
    commonName: 'Powdery Mildew',
    scientificName: 'Erysiphe necator',
    pathogenType: 'FUNGAL',
    hostCrops: ['Grape', 'Cucumber', 'Pumpkin', 'Tomato'],
    symptomsSummary: 'Ash-grey powdery fungal mycelium over leaves, shoots, and young fruit bunches.',
    environmentalTriggers: 'Warm shade, high humidity without heavy rainfall (20-28°C).'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/florascan_db';
    await mongoose.connect(mongoUri);
    console.log('Seeding FloraScan Plant Pathology Hub catalog...');

    for (const d of SEED_DISEASES) {
      let disease = await Disease.findOneAndUpdate({ slug: d.slug }, d, { upsert: true, new: true });
      console.log(`✓ Seeded disease: ${disease.commonName} (${disease.scientificName})`);

      // Seed chemical treatment
      await Treatment.findOneAndUpdate(
        { diseaseId: disease._id, remedyType: 'CHEMICAL' },
        {
          diseaseId: disease._id,
          remedyType: 'CHEMICAL',
          brandName: 'Mancozeb 75% WP (Dithane M-45)',
          activeIngredient: 'Mancozeb 75% WP',
          recommendedDosageGramsOrMl: 600,
          waterDilutionLiters: 200,
          dilutionRatioMlPerL: 3.0,
          stage: 'EARLY_CURATIVE',
          applicationIntervalDays: 7,
          preHarvestIntervalDays: 7,
          safetyInstructions: ['Wear mask', 'Avoid spraying under direct midday heat'],
          affiliateStoreLinks: {
            bighaat: 'https://bighaat.com/search?q=mancozeb',
            agrostar: 'https://agrostar.in/search?q=mancozeb'
          }
        },
        { upsert: true }
      );

      // Seed organic treatment
      await Treatment.findOneAndUpdate(
        { diseaseId: disease._id, remedyType: 'ORGANIC' },
        {
          diseaseId: disease._id,
          remedyType: 'ORGANIC',
          brandName: 'Cold-Pressed Neem Oil (10,000 PPM)',
          activeIngredient: 'Azadirachtin',
          recommendedDosageGramsOrMl: 600,
          waterDilutionLiters: 200,
          dilutionRatioMlPerL: 3.0,
          stage: 'PREVENTIVE',
          applicationIntervalDays: 5,
          preHarvestIntervalDays: 0,
          safetyInstructions: ['Safe for bees if sprayed at dusk'],
          affiliateStoreLinks: {
            bighaat: 'https://bighaat.com/search?q=neem+oil'
          }
        },
        { upsert: true }
      );
    }

    console.log('🌱 Seed data imported successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDatabase();
