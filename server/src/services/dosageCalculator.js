/**
 * FloraScan - Smart Dosage Calculation Engine
 * 
 * Computes calibrated organic and chemical spray mixtures based on:
 * - Land acreage or square footage
 * - Standard 16L knapsack backpack vs 200L/500L tractor sprayers
 * - Recommended active ingredient concentration per acre
 */

export const calculateDosage = ({
  acreage = 1.0,
  unit = 'ACRES', // 'ACRES', 'HECTARES', 'SQ_FT'
  tankCapacityLiters = 16, // Default 16L manual knapsack sprayer
  recommendedDosageGramsOrMl = 600, // e.g. 600g per acre
  standardWaterVolumeLiters = 200, // Standard 200 Liters of water per acre
  dilutionRatioMlPerL = 3.0, // 3 ml/g per Liter of water
  sprayType = 'FOLIAR_SPRAY' // 'FOLIAR_SPRAY', 'SOIL_DRENCH', 'SEED_TREATMENT'
}) => {
  // 1. Normalize land area to Acres
  let normalizedAcres = acreage;
  if (unit === 'HECTARES') {
    normalizedAcres = acreage * 2.47105;
  } else if (unit === 'SQ_FT') {
    normalizedAcres = acreage / 43560.0;
  }

  // 2. Total Water and Product Requirements
  const totalWaterLiters = Math.round(normalizedAcres * standardWaterVolumeLiters * 10) / 10;
  const totalProductAmount = Math.round(normalizedAcres * recommendedDosageGramsOrMl * 10) / 10;

  // 3. Tank-by-Tank Breakdown
  const totalTanksNeeded = Math.ceil(totalWaterLiters / tankCapacityLiters);
  const productPerTank = Math.round((tankCapacityLiters * dilutionRatioMlPerL) * 10) / 10;

  // 4. Mixing Guidance & Safety Steps
  const mixingInstructions = [
    `Fill the ${tankCapacityLiters}L sprayer tank with 50% clean, debris-free water.`,
    `Accurately measure ${productPerTank} ml/g of the solution using a calibrated measuring cup.`,
    `Premix the ${productPerTank} ml/g in a separate small bucket with 1-2 liters of water until fully dissolved.`,
    `Pour the premix slurry into the spray tank and agitate thoroughly.`,
    `Top up the tank with water to the full ${tankCapacityLiters}L mark and seal the cap tightly.`,
    `Maintain uniform pressure; apply fine droplets during early morning (6:00 - 9:00 AM) or late afternoon (4:30 - 6:30 PM).`
  ];

  return {
    inputSummary: {
      requestedArea: acreage,
      unit,
      normalizedAcres: Number(normalizedAcres.toFixed(3)),
      tankCapacityLiters,
      sprayType
    },
    totalRequirements: {
      totalWaterLiters,
      totalProductGramsOrMl: totalProductAmount,
      dilutionRatio: `${dilutionRatioMlPerL} ml/g per Liter of water`
    },
    tankMixingPlan: {
      totalTanksNeeded,
      productAmountPerTank: productPerTank,
      measurementUnit: 'ml or grams',
      recommendedSprayerType: tankCapacityLiters <= 25 ? 'Knapsack Backpack Sprayer' : 'Tractor-Mounted Power Boom Sprayer'
    },
    safetyAndTiming: {
      idealSprayWindow: 'Early morning before dew dries or late evening before dusk',
      windSpeedGuideline: 'Do not spray if wind exceeds 10 km/h to prevent chemical drift',
      personalProtectiveEquipment: ['Nitrile gloves', 'Protective goggles', 'N95 face mask', 'Rubber gumboots']
    },
    stepByStepInstructions: mixingInstructions
  };
};
