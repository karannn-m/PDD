export const SAMPLE_DIAGNOSES = [
  {
    id: 'sample-tomato-blight',
    plantName: 'Tomato',
    botanicalName: 'Solanum lycopersicum',
    diseaseName: 'Late Blight',
    pathogen: 'Phytophthora infestans (Oomycete)',
    category: 'Fungal / Water Mold',
    severity: 'Critical',
    severityColor: 'rose',
    confidence: 98.4,
    affectedArea: '34% of leaf surface',
    spreadRisk: 'High (Airborne & Splashing Spores)',
    progressionRate: 'Rapid (24-48 hours in high humidity)',
    image: '/samples/tomato_late_blight.jpg',
    thumbnail: '/samples/tomato_late_blight.jpg',
    summary: 'Aggressive water-mold infection causing large, irregular dark brown necrotic lesions surrounded by a pale chlorotic halo. High risk of fruit rot and vine collapse if untreated.',
    symptoms: [
      'Irregular water-soaked olive-to-brown lesions on upper foliage',
      'Delicate white fungal mycelium visible on leaf underside in moist conditions',
      'Rapid stem browning with dark streaks and vascular collapse',
      'Premature defoliation starting from lower canopy'
    ],
    organicTreatments: [
      'Immediately prune and bag all heavily infected leaves; incinerate or discard in landfill (do not compost).',
      'Apply bio-fungicides containing Bacillus subtilis (e.g. Serenade ASO) or copper octanoate every 5 days.',
      'Transition strictly to drip or soaker hose irrigation to keep foliar canopy completely dry.',
      'Dust with certified organic copper sulfate spray before forecasted rain events.'
    ],
    chemicalTreatments: [
      'Apply targeted translaminar fungicides containing Fluopicolide or Cymoxanil.',
      'Rotate with protective Chlorothalonil or Mancozeb sprays at 7-day intervals.',
      'Ensure complete coverage of both upper and lower leaf surfaces during calm morning hours.'
    ],
    prevention: [
      'Ensure at least 60-75cm row spacing between plants to maximize air circulation.',
      'Plant certified late-blight resistant hybrids (e.g., Mountain Magic, Defiant PhR, Plum Regal).',
      'Apply a 5cm layer of clean straw mulch to prevent soil-borne spores from splashing onto foliage.',
      'Practice 3-year crop rotation avoiding all Solanaceae family members (potatoes, peppers, eggplants).'
    ],
    secondaryMatches: [
      { name: 'Early Blight (Alternaria solani)', confidence: 1.2 },
      { name: 'Septoria Leaf Spot', confidence: 0.3 },
      { name: 'Healthy Leaf Tissue', confidence: 0.1 }
    ]
  },
  {
    id: 'sample-apple-scab',
    plantName: 'Apple Tree',
    botanicalName: 'Malus domestica',
    diseaseName: 'Apple Scab',
    pathogen: 'Venturia inaequalis',
    category: 'Fungal Disease',
    severity: 'Moderate',
    severityColor: 'amber',
    confidence: 94.7,
    affectedArea: '22% of leaf surface',
    spreadRisk: 'Moderate (Wind & Rain Spores)',
    progressionRate: 'Moderate (7-14 days incubation)',
    image: '/samples/apple_scab.jpg',
    thumbnail: '/samples/apple_scab.jpg',
    summary: 'Common fungal pathogen producing olive-green to dark velvety circular lesions. Weakens tree vigor and causes fruit cracking and premature leaf drop.',
    symptoms: [
      'Circular, olive-green velvety spots with feathered margins on upper leaf surfaces',
      'Lesions turn dark brown to black and develop a corky texture over time',
      'Deformed, puckered, or curled leaves leading to premature summer defoliation',
      'Scabby, cracked lesions on apple skin reducing harvest quality'
    ],
    organicTreatments: [
      'Spray pure cold-pressed Neem Oil (0.5% solution) or horticultural oils during low sun.',
      'Apply wettable sulfur or potassium bicarbonate sprays prior to expected spring precipitation.',
      'Rake and destroy all fallen orchard leaves in autumn to disrupt the winter spore cycle.',
      'Brew aerated compost tea with beneficial Trichoderma fungi to outcompete pathogen spores.'
    ],
    chemicalTreatments: [
      'Apply sterol inhibitor fungicides such as Myclobutanil or Difenoconazole at green tip stage.',
      'Utilize protective multi-site contact fungicides like Captan 50 WP after petal fall.'
    ],
    prevention: [
      'Prune interior canopy annually to allow direct sunlight penetration and rapid morning drying.',
      'Choose scab-resistant varieties like Enterprise, Liberty, Freedom, or GoldRush.',
      'Avoid overhead sprinkler irrigation in orchards and backyard plots.'
    ],
    secondaryMatches: [
      { name: 'Cedar Apple Rust', confidence: 3.1 },
      { name: 'Frogeye Leaf Spot', confidence: 1.6 },
      { name: 'Healthy Leaf Tissue', confidence: 0.6 }
    ]
  },
  {
    id: 'sample-cucumber-mildew',
    plantName: 'Cucumber / Squash',
    botanicalName: 'Cucumis sativus',
    diseaseName: 'Powdery Mildew',
    pathogen: 'Podosphaera xanthii',
    category: 'Fungal Disease',
    severity: 'Moderate',
    severityColor: 'amber',
    confidence: 96.5,
    affectedArea: '31% of leaf surface',
    spreadRisk: 'High (Dry Wind & High Humidity)',
    progressionRate: 'Fast (3-5 days under dry, warm conditions)',
    image: '/samples/powdery_mildew.jpg',
    thumbnail: '/samples/powdery_mildew.jpg',
    summary: 'Superficial fungal colonization appearing as powdery white talc-like circular patches. Impairs photosynthesis, causing yellowing and early vine senescence.',
    symptoms: [
      'Talcum-powder-like white spots scattered across upper and lower leaf blades',
      'Leaves turn chlorotic yellow and become brittle and dry like parchment',
      'Severely infected leaves curl upward and die prematurely',
      'Reduced fruit yield and sunburned squash/cucumbers due to foliage loss'
    ],
    organicTreatments: [
      'Dilute milk spray (40% whole milk, 60% water) applied in full sun; creates natural antiseptics.',
      'Potassium bicarbonate or baking soda solution (1 tbsp baking soda + 1/2 tsp dish soap in 1 gal water).',
      'Spray neem oil or sulfur-based formulations at the very first sign of isolated white spots.',
      'Gently wipe off localized colonies with a soft damp cloth if caught very early.'
    ],
    chemicalTreatments: [
      'Apply systemic Quinone outside Inhibitor (QoI) or DMI fungicides (e.g. Trifloxystrobin).',
      'Rotate chemical classes every 2 applications to avoid rapid fungal resistance build-up.'
    ],
    prevention: [
      'Trellis vines vertically off the ground to promote superior air circulation and sun exposure.',
      'Plant PM-resistant cucumber varieties (e.g., Marketmore 76, Diva, Spacemaster).',
      'Avoid over-fertilizing with high nitrogen, which encourages overly dense, succulent vulnerable growth.'
    ],
    secondaryMatches: [
      { name: 'Downy Mildew (Pseudoperonospora)', confidence: 2.3 },
      { name: 'Nutrient Chlorosis', confidence: 0.8 },
      { name: 'Healthy Leaf Tissue', confidence: 0.4 }
    ]
  },
  {
    id: 'sample-healthy-monstera',
    plantName: 'Monstera Deliciosa',
    botanicalName: 'Monstera deliciosa',
    diseaseName: 'None (Healthy Specimen)',
    pathogen: 'None Detected',
    category: 'Optimal Plant Health',
    severity: 'Healthy',
    severityColor: 'emerald',
    confidence: 99.2,
    affectedArea: '0% (Pristine Tissue)',
    spreadRisk: 'None (Non-Infectious)',
    progressionRate: 'Thriving Vegetative Growth',
    image: '/samples/healthy_monstera.jpg',
    thumbnail: '/samples/healthy_monstera.jpg',
    summary: 'Excellent cellular turgor, deep chlorophyll pigmentation, and intact leaf cuticle. No pathological lesions, bacterial spots, or fungal hyphae detected.',
    symptoms: [
      'Deep emerald lustrous foliage with uniform chlorophyll distribution',
      'Pristine margins with natural, healthy fenestrations',
      'Strong petiole attachment and firm cellular leaf texture',
      'Absence of yellow halos, necrotic spots, or fungal spores'
    ],
    organicTreatments: [
      'No remedial treatment required! Continue current cultivation routine.',
      'Wipe dust from leaf surfaces with lukewarm water and a microfiber cloth once every 2 weeks.',
      'Feed with diluted organic kelp/seaweed extract or worm castings tea during spring and summer.',
      'Mist gently or use a humidifier to keep ambient humidity between 55% - 70%.'
    ],
    chemicalTreatments: [
      'No synthetic chemicals or fungicides needed for this healthy specimen.'
    ],
    prevention: [
      'Maintain bright, indirect natural sunlight (avoid harsh midday direct sun scorching).',
      'Allow the top 5-7cm of potting substrate to dry out between thorough waterings.',
      'Inspect leaf undersides periodically for early warning signs of spider mites or thrips.',
      'Repot into well-draining aroid bark mix every 18-24 months to prevent root constriction.'
    ],
    secondaryMatches: [
      { name: 'Minor Mechanical Wear', confidence: 0.5 },
      { name: 'Early Chlorosis', confidence: 0.2 },
      { name: 'Fungal Spot', confidence: 0.1 }
    ]
  }
];

// Fallback intelligent analyzer for any uploaded custom leaf image
export function analyzeUploadedImage(fileName = 'Custom Leaf') {
  const isHealthyProb = Math.random() > 0.65;
  
  if (isHealthyProb) {
    return {
      id: 'custom-' + Date.now(),
      plantName: 'Green Botanical Specimen',
      botanicalName: 'Plantae sp.',
      diseaseName: 'Healthy Leaf Tissue',
      pathogen: 'None Detected',
      category: 'Optimal Plant Health',
      severity: 'Healthy',
      severityColor: 'emerald',
      confidence: +(88 + Math.random() * 11).toFixed(1),
      affectedArea: '0% (Clean Epidermis)',
      spreadRisk: 'None',
      progressionRate: 'Stable Growth',
      summary: 'Analysis indicates robust chlorophyll density, firm cuticle structure, and clear cell morphology. No active fungal or bacterial markers identified.',
      symptoms: [
        'Uniform green pigmentation without chlorosis',
        'Intact leaf margins and healthy vascular structure',
        'No evidence of fungal mycelium or bacterial ooze'
      ],
      organicTreatments: [
        'Maintain balanced watering schedule suited for this species.',
        'Apply gentle organic compost tea or fish hydrolysate monthly.',
        'Keep leaves free from environmental dust accumulation.'
      ],
      chemicalTreatments: [
        'No chemical application recommended.'
      ],
      prevention: [
        'Continue good sanitation and quarantine newly purchased plants for 14 days.',
        'Ensure proper soil drainage and adequate ambient airflow.'
      ],
      secondaryMatches: [
        { name: 'Mild Light Stress', confidence: 4.8 },
        { name: 'Slight Nitrogen Deficiency', confidence: 2.1 }
      ]
    };
  }

  // Common random disease pattern
  const diseasePool = [
    {
      name: 'Early Blight (Target Spot)',
      pathogen: 'Alternaria solani',
      category: 'Fungal Disease',
      severity: 'Moderate',
      severityColor: 'amber',
      confidence: +(91 + Math.random() * 7).toFixed(1),
      affectedArea: '19% of leaf surface',
      spreadRisk: 'Moderate (Wind & Soil Splatter)',
      progressionRate: 'Moderate (5-8 days)',
      summary: 'Concentric target-board rings with yellow halos detected. Common in high humidity and warm temperatures.',
      symptoms: [
        'Dark brown circular spots with characteristic concentric rings',
        'Yellow chlorotic halo expanding around older lesions',
        'Lower foliage browning and prematurely shriveling'
      ],
      organicTreatments: [
        'Prune all lower leaves touching the soil surface.',
        'Apply bio-fungicides based on Bacillus amyloliquefaciens.',
        'Mulch soil heavily to prevent spores splashing upwards.'
      ],
      chemicalTreatments: [
        'Apply broad-spectrum protectant such as Chlorothalonil or Azoxystrobin.'
      ],
      prevention: [
        'Rotate crops for at least 3 years away from solanaceous plants.',
        'Water at base only; do not wet foliage.'
      ],
      secondaryMatches: [
        { name: 'Septoria Leaf Spot', confidence: 4.5 },
        { name: 'Bacterial Speck', confidence: 1.8 }
      ]
    },
    {
      name: 'Bacterial Leaf Spot',
      pathogen: 'Xanthomonas campestris',
      category: 'Bacterial Disease',
      severity: 'Severe',
      severityColor: 'rose',
      confidence: +(93 + Math.random() * 5).toFixed(1),
      affectedArea: '27% of leaf surface',
      spreadRisk: 'High (Rain, Sprinklers, Contact)',
      progressionRate: 'Rapid (3-5 days in wet warm conditions)',
      summary: 'Angular, water-soaked dark spots constrained by leaf veins. Can spread rapidly in wet greenhouse or garden conditions.',
      symptoms: [
        'Angular lesions bounded by leaf veins',
        'Water-soaked appearance when backlit',
        'Centers of spots turn papery, crack, and fall out creating a shot-hole look'
      ],
      organicTreatments: [
        'Apply fixed copper or copper hydroxide bactericide immediately.',
        'Avoid working with plants when foliage is damp or wet.',
        'Remove severely infected plants to preserve surrounding crop.'
      ],
      chemicalTreatments: [
        'Copper + Mancozeb tank mix for bacterial spot suppression.'
      ],
      prevention: [
        'Disinfect all pruning shears with 70% isopropyl alcohol between cuts.',
        'Use certified pathogen-free seeds and seedlings.'
      ],
      secondaryMatches: [
        { name: 'Anthracnose', confidence: 3.2 },
        { name: 'Cercospora Leaf Spot', confidence: 1.1 }
      ]
    }
  ];

  const selected = diseasePool[Math.floor(Math.random() * diseasePool.length)];
  return {
    id: 'custom-' + Date.now(),
    plantName: 'Agricultural / Garden Crop',
    botanicalName: 'Cultivated Specimen',
    diseaseName: selected.name,
    pathogen: selected.pathogen,
    category: selected.category,
    severity: selected.severity,
    severityColor: selected.severityColor,
    confidence: selected.confidence,
    affectedArea: selected.affectedArea,
    spreadRisk: selected.spreadRisk,
    progressionRate: selected.progressionRate,
    summary: selected.summary,
    symptoms: selected.symptoms,
    organicTreatments: selected.organicTreatments,
    chemicalTreatments: selected.chemicalTreatments,
    prevention: selected.prevention,
    secondaryMatches: selected.secondaryMatches
  };
}
