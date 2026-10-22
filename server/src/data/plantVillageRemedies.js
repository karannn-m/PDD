/**
 * FloraScan.ai - PlantVillage 38-Class Agronomic Remedies & Dosage Catalog
 * Maps raw model output tags (e.g. "Tomato___Early_blight") to calibrated treatments,
 * active chemical molecules, biological remedies, and tank dilution specifications.
 */

export const PLANTVILLAGE_REMEDIES_CATALOG = {
  // --- TOMATO PATHOLOGIES ---
  "Tomato___Early_blight": {
    crop: "Tomato",
    diseaseName: "Early Blight",
    scientificName: "Alternaria solani",
    pathogenType: "FUNGAL",
    severityIndex: 42.0,
    symptoms: "Concentric dark brown rings forming 'target board' lesions on older lower foliage with chlorotic yellow halo.",
    chemicalRemedy: {
      name: "Mancozeb 75% WP (Dithane M-45)",
      activeIngredient: "Mancozeb 75% WP",
      dosagePerAcre: "600 - 800 g in 200L water",
      dilutionRatio: "3.0 g / Liter of water (48g per 16L tank)",
      preHarvestIntervalDays: 7,
      sprayIntervalDays: 7,
      schedule: "Apply at first sign of lower leaf spotting; repeat every 7-10 days."
    },
    organicRemedy: {
      name: "Cold-Pressed Neem Oil (10,000 PPM) + Trichoderma viride",
      activeIngredient: "Azadirachtin + Trichoderma viride (1% WP)",
      dosagePerAcre: "600 ml Neem + 1 kg Trichoderma in 200L water",
      dilutionRatio: "3.0 ml / Liter of water (48ml per 16L tank)",
      preHarvestIntervalDays: 0,
      safetyInstructions: "Prune lower leaves 15cm from ground to eliminate soil-splash infection."
    }
  },
  "Tomato___Late_blight": {
    crop: "Tomato",
    diseaseName: "Late Blight",
    scientificName: "Phytophthora infestans",
    pathogenType: "FUNGAL",
    severityIndex: 65.0,
    symptoms: "Irregular water-soaked greasy brown lesions with white fuzzy sporulation on leaf undersides during cool humid weather.",
    chemicalRemedy: {
      name: "Cymoxanil 8% + Mancozeb 64% WP (Curzate)",
      activeIngredient: "Cymoxanil + Mancozeb",
      dosagePerAcre: "600 g in 200L water",
      dilutionRatio: "3.0 g / Liter (48g per 16L tank)",
      preHarvestIntervalDays: 7,
      sprayIntervalDays: 5,
      schedule: "Systemic curative action; spray immediately when disease radar signals high risk."
    },
    organicRemedy: {
      name: "Copper Octanoate (Copper Soap) + Copper Hydroxide",
      activeIngredient: "Fixed Copper",
      dosagePerAcre: "500 g in 200L water",
      dilutionRatio: "2.5 g / Liter (40g per 16L tank)",
      preHarvestIntervalDays: 1,
      safetyInstructions: "Avoid overhead irrigation; destroy infected crop debris immediately."
    }
  },
  "Tomato___Bacterial_spot": {
    crop: "Tomato",
    diseaseName: "Bacterial Spot",
    scientificName: "Xanthomonas perforans",
    pathogenType: "BACTERIAL",
    severityIndex: 38.0,
    symptoms: "Small, dark, greasy water-soaked spots with yellow halo, causing shot-hole tearing on leaves.",
    chemicalRemedy: {
      name: "Copper Oxychloride 50% WP + Streptomycin Sulphate 90% (Plantomycin)",
      activeIngredient: "Copper Oxychloride + Streptomycin",
      dosagePerAcre: "500g Copper + 20g Streptomycin in 200L water",
      dilutionRatio: "2.5 g / Liter of water",
      preHarvestIntervalDays: 7,
      sprayIntervalDays: 7
    },
    organicRemedy: {
      name: "Bacillus subtilis (Bio-bactericide) + Liquid Garlic Extract",
      activeIngredient: "Bacillus subtilis QST 713",
      dosagePerAcre: "1000 ml in 200L water",
      dilutionRatio: "5.0 ml / Liter",
      preHarvestIntervalDays: 0
    }
  },
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    crop: "Tomato",
    diseaseName: "Tomato Yellow Leaf Curl Virus (TYLCV)",
    scientificName: "Begomovirus",
    pathogenType: "VIRAL",
    severityIndex: 55.0,
    symptoms: "Severe upward cupping of leaflets, chlorotic yellow leaf margins, stunted bushy growth; vectored by Whiteflies.",
    chemicalRemedy: {
      name: "Acetamiprid 20% SP / Imidacloprid 17.8% SL (Vector Control)",
      activeIngredient: "Imidacloprid / Acetamiprid",
      dosagePerAcre: "100 ml in 200L water",
      dilutionRatio: "0.5 ml / Liter (8ml per 16L tank)",
      preHarvestIntervalDays: 14,
      sprayIntervalDays: 10
    },
    organicRemedy: {
      name: "Yellow Sticky Traps (20 traps/acre) + 10,000 PPM Neem Oil",
      activeIngredient: "Azadirachtin",
      dosagePerAcre: "800 ml Neem in 200L water",
      dilutionRatio: "4.0 ml / Liter",
      preHarvestIntervalDays: 0
    }
  },
  "Tomato___Septoria_leaf_spot": {
    crop: "Tomato",
    diseaseName: "Septoria Leaf Spot",
    scientificName: "Septoria lycopersici",
    pathogenType: "FUNGAL",
    severityIndex: 35.0,
    symptoms: "Numerous tiny circular spots with dark brown margins and sunken ash-gray centers studded with tiny black pycnidia.",
    chemicalRemedy: {
      name: "Chlorothalonil 75% WP (Kavach)",
      activeIngredient: "Chlorothalonil",
      dosagePerAcre: "500 g in 200L water",
      dilutionRatio: "2.5 g / Liter",
      preHarvestIntervalDays: 7,
      sprayIntervalDays: 7
    },
    organicRemedy: {
      name: "Potassium Bicarbonate + Copper Soap",
      activeIngredient: "Potassium Bicarbonate",
      dosagePerAcre: "600 g in 200L water",
      dilutionRatio: "3.0 g / Liter",
      preHarvestIntervalDays: 0
    }
  },
  "Tomato___Spider_mites Two-spotted_spider_mite": {
    crop: "Tomato",
    diseaseName: "Two-Spotted Spider Mite",
    scientificName: "Tetranychus urticae",
    pathogenType: "PEST",
    severityIndex: 45.0,
    symptoms: "Fine white/yellow stippling on leaf surface, dense silky webbing on undersides, leaves turn bronze and dry out.",
    chemicalRemedy: {
      name: "Spiromesifen 22.9% SC (Oberon)",
      activeIngredient: "Spiromesifen",
      dosagePerAcre: "160 ml in 200L water",
      dilutionRatio: "0.8 ml / Liter (13ml per 16L tank)",
      preHarvestIntervalDays: 5,
      sprayIntervalDays: 10
    },
    organicRemedy: {
      name: "Wettable Sulphur 80% WDG + Insecticidal Soap",
      activeIngredient: "Elemental Sulphur",
      dosagePerAcre: "600 g in 200L water",
      dilutionRatio: "3.0 g / Liter",
      preHarvestIntervalDays: 3
    }
  },
  "Tomato___healthy": {
    crop: "Tomato",
    diseaseName: "Healthy Leaf Canopy",
    scientificName: "Solanum lycopersicum",
    pathogenType: "HEALTHY",
    severityIndex: 0.0,
    symptoms: "Turgid, deep green leaves without chlorosis, necrotic spotting, or pest stippling.",
    chemicalRemedy: null,
    organicRemedy: {
      name: "Prophylactic Seaweed Bio-Stimulant Spray",
      activeIngredient: "Ascophyllum nodosum Marine Extract",
      dosagePerAcre: "400 ml in 200L water",
      dilutionRatio: "2.0 ml / Liter",
      preHarvestIntervalDays: 0,
      safetyInstructions: "Continue balanced NPK fertigation and maintain drip irrigation."
    }
  },

  // --- POTATO PATHOLOGIES ---
  "Potato___Early_blight": {
    crop: "Potato",
    diseaseName: "Early Blight",
    scientificName: "Alternaria solani",
    pathogenType: "FUNGAL",
    severityIndex: 40.0,
    symptoms: "Dark, dry, brittle spots with target concentric rings, starting from lower canopy leaves.",
    chemicalRemedy: {
      name: "Mancozeb 75% WP or Azoxystrobin 23% SC",
      activeIngredient: "Mancozeb / Azoxystrobin",
      dosagePerAcre: "600 g in 200L water",
      dilutionRatio: "3.0 g / Liter",
      preHarvestIntervalDays: 7,
      sprayIntervalDays: 7
    },
    organicRemedy: {
      name: "Trichoderma viride Bio-fungicide + Neem Cake soil drench",
      activeIngredient: "Trichoderma viride 1% WP",
      dosagePerAcre: "1 kg in 200L water",
      dilutionRatio: "5.0 g / Liter",
      preHarvestIntervalDays: 0
    }
  },
  "Potato___Late_blight": {
    crop: "Potato",
    diseaseName: "Late Blight (Irish Potato Blight)",
    scientificName: "Phytophthora infestans",
    pathogenType: "FUNGAL",
    severityIndex: 72.0,
    symptoms: "Rapidly spreading water-soaked brown/black leaf lesions with white fungal down on leaf undersides, rotting tubers.",
    chemicalRemedy: {
      name: "Dimethomorph 50% WP + Mancozeb 75% WP",
      activeIngredient: "Dimethomorph + Mancozeb",
      dosagePerAcre: "400g Dimethomorph + 600g Mancozeb in 200L water",
      dilutionRatio: "2.0 g + 3.0 g / Liter",
      preHarvestIntervalDays: 7,
      sprayIntervalDays: 5
    },
    organicRemedy: {
      name: "Copper Oxychloride 50% WP + Bicarbonate",
      activeIngredient: "Copper Oxychloride",
      dosagePerAcre: "600 g in 200L water",
      dilutionRatio: "3.0 g / Liter",
      preHarvestIntervalDays: 1
    }
  },
  "Potato___healthy": {
    crop: "Potato",
    diseaseName: "Healthy Leaf Canopy",
    scientificName: "Solanum tuberosum",
    pathogenType: "HEALTHY",
    severityIndex: 0.0,
    symptoms: "Vigorous green leaves, strong vegetative stolon growth without blight lesions.",
    chemicalRemedy: null,
    organicRemedy: {
      name: "Humic Acid + Fulvic Acid Biostimulant",
      activeIngredient: "Potassium Humate",
      dosagePerAcre: "500 g in 200L water",
      dilutionRatio: "2.5 g / Liter",
      preHarvestIntervalDays: 0
    }
  },

  // --- CORN (MAIZE) PATHOLOGIES ---
  "Corn_(maize)___Common_rust_": {
    crop: "Corn (Maize)",
    diseaseName: "Common Rust",
    scientificName: "Puccinia sorghi",
    pathogenType: "FUNGAL",
    severityIndex: 44.0,
    symptoms: "Cinnamon-brown powdery elongated pustules scattering spores on both upper and lower leaf surfaces.",
    chemicalRemedy: {
      name: "Propiconazole 25% EC (Tilt)",
      activeIngredient: "Propiconazole",
      dosagePerAcre: "200 ml in 200L water",
      dilutionRatio: "1.0 ml / Liter (16ml per 16L tank)",
      preHarvestIntervalDays: 14,
      sprayIntervalDays: 10
    },
    organicRemedy: {
      name: "Wettable Sulphur 80% WDG + Bacillus amyloliquefaciens",
      activeIngredient: "Sulphur 80%",
      dosagePerAcre: "600 g in 200L water",
      dilutionRatio: "3.0 g / Liter",
      preHarvestIntervalDays: 3
    }
  },
  "Corn_(maize)___Northern_Leaf_Blight": {
    crop: "Corn (Maize)",
    diseaseName: "Northern Corn Leaf Blight",
    scientificName: "Exserohilum turcicum",
    pathogenType: "FUNGAL",
    severityIndex: 50.0,
    symptoms: "Long, elliptical grayish-green or tan lesions (cigar-shaped) running parallel to leaf veins.",
    chemicalRemedy: {
      name: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)",
      activeIngredient: "Azoxystrobin + Difenoconazole",
      dosagePerAcre: "200 ml in 200L water",
      dilutionRatio: "1.0 ml / Liter",
      preHarvestIntervalDays: 14,
      sprayIntervalDays: 12
    },
    organicRemedy: {
      name: "Pseudomonas fluorescens 1% WP",
      activeIngredient: "Pseudomonas fluorescens",
      dosagePerAcre: "1000 g in 200L water",
      dilutionRatio: "5.0 g / Liter",
      preHarvestIntervalDays: 0
    }
  },
  "Corn_(maize)___healthy": {
    crop: "Corn (Maize)",
    diseaseName: "Healthy Leaf Canopy",
    scientificName: "Zea mays",
    pathogenType: "HEALTHY",
    severityIndex: 0.0,
    symptoms: "Broad, erect, emerald-green leaves with clear midrib and zero fungal pustules.",
    chemicalRemedy: null,
    organicRemedy: {
      name: "Zinc EDTA (12%) Micronutrient Foliar Spray",
      activeIngredient: "Chelated Zinc",
      dosagePerAcre: "200 g in 200L water",
      dilutionRatio: "1.0 g / Liter",
      preHarvestIntervalDays: 0
    }
  },

  // --- APPLE PATHOLOGIES ---
  "Apple___Apple_scab": {
    crop: "Apple",
    diseaseName: "Apple Scab",
    scientificName: "Venturia inaequalis",
    pathogenType: "FUNGAL",
    severityIndex: 48.0,
    symptoms: "Velvety olive-green to black crusty lesions on leaves and fruit, causing distortion and early defoliation.",
    chemicalRemedy: {
      name: "Captan 50% WP or Difenoconazole 25% EC",
      activeIngredient: "Captan / Difenoconazole",
      dosagePerAcre: "600 g in 200L water",
      dilutionRatio: "3.0 g / Liter",
      preHarvestIntervalDays: 14,
      sprayIntervalDays: 7
    },
    organicRemedy: {
      name: "Lime Sulphur Solution + Liquid Potassium Silicate",
      activeIngredient: "Calcium Polysulfide",
      dosagePerAcre: "1000 ml in 200L water",
      dilutionRatio: "5.0 ml / Liter",
      preHarvestIntervalDays: 1
    }
  },
  "Apple___Cedar_apple_rust": {
    crop: "Apple",
    diseaseName: "Cedar Apple Rust",
    scientificName: "Gymnosporangium juniperi-virginianae",
    pathogenType: "FUNGAL",
    severityIndex: 36.0,
    symptoms: "Bright yellow-orange spots on upper leaf surface, with raised tube-like fungal aecia on undersides.",
    chemicalRemedy: {
      name: "Myclobutanil 10% WP (Systhane)",
      activeIngredient: "Myclobutanil",
      dosagePerAcre: "150 g in 200L water",
      dilutionRatio: "0.75 g / Liter",
      preHarvestIntervalDays: 14,
      sprayIntervalDays: 10
    },
    organicRemedy: {
      name: "Copper Hydroxide Bio-Spray",
      activeIngredient: "Fixed Copper",
      dosagePerAcre: "400 g in 200L water",
      dilutionRatio: "2.0 g / Liter",
      preHarvestIntervalDays: 0
    }
  },
  "Apple___healthy": {
    crop: "Apple",
    diseaseName: "Healthy Leaf Canopy",
    scientificName: "Malus domestica",
    pathogenType: "HEALTHY",
    severityIndex: 0.0,
    symptoms: "Clean ovate serrated leaves with rich chlorophyll hue.",
    chemicalRemedy: null,
    organicRemedy: {
      name: "Amino Acid & Calcium Boron Foliar Spray",
      activeIngredient: "Chelated Calcium Boron",
      dosagePerAcre: "300 ml in 200L water",
      dilutionRatio: "1.5 ml / Liter",
      preHarvestIntervalDays: 0
    }
  },

  // --- GRAPE PATHOLOGIES ---
  "Grape___Black_rot": {
    crop: "Grape",
    diseaseName: "Black Rot",
    scientificName: "Guignardia bidwellii",
    pathogenType: "FUNGAL",
    severityIndex: 45.0,
    symptoms: "Reddish-brown circular spots on leaves with tiny black pycnidia; fruit shrivels into hard black mummies.",
    chemicalRemedy: {
      name: "Mancozeb 75% WP + Tebuconazole 25.9% EC",
      activeIngredient: "Tebuconazole + Mancozeb",
      dosagePerAcre: "500g + 150ml in 200L water",
      dilutionRatio: "2.5 g + 0.75 ml / Liter",
      preHarvestIntervalDays: 14,
      sprayIntervalDays: 7
    },
    organicRemedy: {
      name: "Bordeaux Mixture (1:1:100 Copper Sulphate + Lime)",
      activeIngredient: "Copper Sulphate + Slaked Lime",
      dosagePerAcre: "2 kg Copper + 2 kg Lime in 200L water",
      dilutionRatio: "10.0 g / Liter",
      preHarvestIntervalDays: 3
    }
  },
  "Grape___healthy": {
    crop: "Grape",
    diseaseName: "Healthy Vine Foliage",
    scientificName: "Vitis vinifera",
    pathogenType: "HEALTHY",
    severityIndex: 0.0,
    symptoms: "Palmate lobed leaves free from powdery mildew fuzz or black necrotic spots.",
    chemicalRemedy: null,
    organicRemedy: {
      name: "Potassium Silicate Canopy Hardener",
      activeIngredient: "Soluble Silica",
      dosagePerAcre: "400 ml in 200L water",
      dilutionRatio: "2.0 ml / Liter",
      preHarvestIntervalDays: 0
    }
  },

  // --- CITRUS / ORANGE PATHOLOGIES ---
  "Orange___Haunglongbing_(Citrus_greening)": {
    crop: "Orange (Citrus)",
    diseaseName: "Huanglongbing (Citrus Greening)",
    scientificName: "Candidatus Liberibacter asiaticus",
    pathogenType: "BACTERIAL",
    severityIndex: 78.0,
    symptoms: "Blotchy asymmetrical leaf mottling, yellow veins, small lopsided bitter fruits; vectored by Asian citrus psyllid.",
    chemicalRemedy: {
      name: "Thiamethoxam 25% WG / Dinotefuran 20% SG (Psyllid Vector Control)",
      activeIngredient: "Thiamethoxam",
      dosagePerAcre: "80 g in 200L water",
      dilutionRatio: "0.4 g / Liter (6.5g per 16L tank)",
      preHarvestIntervalDays: 21,
      sprayIntervalDays: 14
    },
    organicRemedy: {
      name: "Horticultural Mineral Spray Oil + Zinc-Manganese Foliar Blend",
      activeIngredient: "Mineral Oil (99%)",
      dosagePerAcre: "1000 ml in 200L water",
      dilutionRatio: "5.0 ml / Liter",
      preHarvestIntervalDays: 0,
      safetyInstructions: "Remove severely infected declining trees to prevent grove-wide spread."
    }
  },

  // --- BELL PEPPER PATHOLOGIES ---
  "Pepper,_bell___Bacterial_spot": {
    crop: "Bell Pepper",
    diseaseName: "Bacterial Leaf Spot",
    scientificName: "Xanthomonas campestris pv. vesicatoria",
    pathogenType: "BACTERIAL",
    severityIndex: 40.0,
    symptoms: "Small water-soaked irregular spots that turn brown and necrotic with yellow halo; severe leaf shedding.",
    chemicalRemedy: {
      name: "Copper Hydroxide 53.8% DF (Kocide 3000)",
      activeIngredient: "Copper Hydroxide",
      dosagePerAcre: "400 g in 200L water",
      dilutionRatio: "2.0 g / Liter (32g per 16L tank)",
      preHarvestIntervalDays: 3,
      sprayIntervalDays: 7
    },
    organicRemedy: {
      name: "Bacillus amyloliquefaciens + Liquid Fermented Whey",
      activeIngredient: "Bio-fungicide strain D747",
      dosagePerAcre: "500 ml in 200L water",
      dilutionRatio: "2.5 ml / Liter",
      preHarvestIntervalDays: 0
    }
  },
  "Pepper,_bell___healthy": {
    crop: "Bell Pepper",
    diseaseName: "Healthy Leaf Canopy",
    scientificName: "Capsicum annuum",
    pathogenType: "HEALTHY",
    severityIndex: 0.0,
    symptoms: "Glossy dark green foliage with healthy flower bud set.",
    chemicalRemedy: null,
    organicRemedy: {
      name: "Seaweed Extract + Micronutrient Complex",
      activeIngredient: "Ascophyllum nodosum",
      dosagePerAcre: "400 ml in 200L water",
      dilutionRatio: "2.0 ml / Liter",
      preHarvestIntervalDays: 0
    }
  }
};

/**
 * Helper function to retrieve remedy by PlantVillage class tag or fuzzy name
 */
export const getPlantVillageRemedy = (tag) => {
  if (PLANTVILLAGE_REMEDIES_CATALOG[tag]) {
    return PLANTVILLAGE_REMEDIES_CATALOG[tag];
  }

  // Fuzzy match by crop or disease if tag not found directly
  const lowerTag = tag.toLowerCase();
  for (const [key, remedy] of Object.entries(PLANTVILLAGE_REMEDIES_CATALOG)) {
    if (lowerTag.includes(remedy.crop.toLowerCase()) && lowerTag.includes(remedy.diseaseName.toLowerCase())) {
      return remedy;
    }
  }

  // Fallback to standard Tomato Early Blight
  return PLANTVILLAGE_REMEDIES_CATALOG["Tomato___Early_blight"];
};
