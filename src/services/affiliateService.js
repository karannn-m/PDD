/**
 * FloraScan - Direct Agro-Store & Affiliate Integration Service
 * ================================================================
 * Maps diagnostic pathology treatments directly to certified agri-inputs
 * from verified partners (AgroStar, IFFCO Kisan, BigHaat, Amazon Agri).
 * Generates tracked affiliate redirect links with UTM tags and subIDs.
 */

export const AFFILIATE_PRODUCTS = [
  {
    id: 'AGRO-NEEM-10K',
    title: 'NeemGuard 10,000 PPM Cold-Pressed Bio-Insecticide / Fungicide',
    brand: 'Kisan BioTech',
    type: 'Organic',
    category: 'Bio-Fungicide',
    targetDiseases: ['Late Blight', 'Apple Scab', 'Powdery Mildew', 'Spider Mites'],
    activeIngredient: 'Azadirachtin 1% (10,000 PPM)',
    packSize: '500 ml',
    rating: 4.8,
    reviewsCount: 1420,
    priceInr: 450,
    mrpInr: 599,
    discountPercent: 25,
    partner: 'AgroStar',
    inStock: true,
    deliveryDays: '1-2 Days (Free Delivery to Rural PINs)',
    badges: ['Certified Organic (NPOP)', 'Bee Safe'],
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&auto=format&fit=crop&q=80',
    dosageRate: '3 to 5 ml per Liter of water'
  },
  {
    id: 'AGRO-BACILLUS-BIO',
    title: 'Serenade ASO Bio-Fungicide (Bacillus subtilis Strain QST 713)',
    brand: 'Bayer CropScience',
    type: 'Organic / Biological',
    category: 'Targeted Bio-Control',
    targetDiseases: ['Late Blight', 'Early Blight', 'Apple Scab', 'Bacterial Spot'],
    activeIngredient: 'Bacillus subtilis (Minimum 1x10^9 CFU/ml)',
    packSize: '1 Liter',
    rating: 4.9,
    reviewsCount: 890,
    priceInr: 920,
    mrpInr: 1150,
    discountPercent: 20,
    partner: 'BigHaat',
    inStock: true,
    deliveryDays: '2 Days Delivery',
    badges: ['OMRI Listed', 'Translaminar Bio-Shield'],
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&auto=format&fit=crop&q=80',
    dosageRate: '2.5 to 4 ml per Liter of water'
  },
  {
    id: 'AGRO-COPPER-WP',
    title: 'Kocide 3000 Copper Hydroxide 46.1% DF Broad Spectrum Fungicide',
    brand: 'Corteva Agriscience',
    type: 'Chemical / Protectant',
    category: 'Contact Fungicide',
    targetDiseases: ['Late Blight', 'Apple Scab', 'Downy Mildew'],
    activeIngredient: 'Copper Hydroxide 46.1% WG',
    packSize: '500 grams',
    rating: 4.7,
    reviewsCount: 2130,
    priceInr: 640,
    mrpInr: 780,
    discountPercent: 18,
    partner: 'IFFCO Bazar',
    inStock: true,
    deliveryDays: 'Same-day Dispatch',
    badges: ['High Rainfastness', 'Bio-Available Copper'],
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=300&auto=format&fit=crop&q=80',
    dosageRate: '2 to 2.5 grams per Liter of water'
  },
  {
    id: 'AGRO-MANCOZEB-75',
    title: 'Dithane M-45 Contact Fungicide (Mancozeb 75% WP)',
    brand: 'Indofil Industries',
    type: 'Chemical / Multi-site',
    category: 'Protective Fungicide',
    targetDiseases: ['Early Blight', 'Late Blight', 'Apple Scab', 'Leaf Spot'],
    activeIngredient: 'Mancozeb 75% WP',
    packSize: '1 kg',
    rating: 4.8,
    reviewsCount: 3410,
    priceInr: 490,
    mrpInr: 600,
    discountPercent: 18,
    partner: 'AgroStar',
    inStock: true,
    deliveryDays: '1-2 Days Delivery',
    badges: ['Multi-Site Activity', 'Zinc & Manganese Enriched'],
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=300&auto=format&fit=crop&q=80',
    dosageRate: '2.5 to 3 grams per Liter of water'
  },
  {
    id: 'AGRO-SPRAYER-16L',
    title: 'KisanPro 16L 12V 12Ah Dual Battery Knapsack Agriculture Sprayer',
    brand: 'KisanKraft',
    type: 'Equipment',
    category: 'Application Equipment',
    targetDiseases: ['All Crops & Foliar Sprays'],
    activeIngredient: 'High-Pressure Diaphragm Pump (8 Bar)',
    packSize: '1 Unit (Complete with 4 Brass Nozzles & Telescopic Lance)',
    rating: 4.9,
    reviewsCount: 1650,
    priceInr: 2850,
    mrpInr: 3999,
    discountPercent: 29,
    partner: 'Amazon Agri',
    inStock: true,
    deliveryDays: 'Fast 2-Day Courier Delivery',
    badges: ['6-Month Warranty', 'Heavy Duty Battery (8 hrs)'],
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=300&auto=format&fit=crop&q=80',
    dosageRate: 'Tank Capacity: 16 Liters'
  },
  {
    id: 'AGRO-STICKER-SPREADER',
    title: 'Spreader-90 Non-Ionic Organo-Silicone Wetting Agent & Sticker',
    brand: 'Anand Agro Care',
    type: 'Adjuvant',
    category: 'Surfactant & Penetrant',
    targetDiseases: ['All Foliar Treatments'],
    activeIngredient: 'Polyalkyleneoxide modified heptamethyltrisiloxane',
    packSize: '250 ml',
    rating: 4.8,
    reviewsCount: 780,
    priceInr: 290,
    mrpInr: 390,
    discountPercent: 26,
    partner: 'BigHaat',
    inStock: true,
    deliveryDays: '1-2 Days Delivery',
    badges: ['3x Droplet Spread', 'Rainfast in 20 Mins'],
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=300&auto=format&fit=crop&q=80',
    dosageRate: '0.3 to 0.5 ml per Liter of water'
  }
];

/**
 * Returns products matched to a specific diagnosed disease
 */
export function getRecommendedProductsForDisease(diseaseName = '') {
  const normalized = diseaseName.toLowerCase();

  return AFFILIATE_PRODUCTS.filter((prod) => {
    // Check if targetDiseases array matches disease or general equipment
    return (
      prod.category === 'Application Equipment' ||
      prod.category === 'Surfactant & Penetrant' ||
      prod.targetDiseases.some((d) => normalized.includes(d.toLowerCase()))
    );
  });
}

/**
 * Generates tracked affiliate redirection URL
 */
export function generateAffiliateUrl({
  productId,
  partner = 'AgroStar',
  source = 'florascan_web',
  disease = 'late_blight',
  farmerId = 'FS_FARMER'
}) {
  const baseUrl = '/api/v1/affiliate/redirect';
  const params = new URLSearchParams({
    sku: productId,
    partner: partner.toLowerCase(),
    utm_source: source,
    utm_medium: 'agronomy_treatment_link',
    utm_campaign: disease.replace(/\s+/g, '_').toLowerCase(),
    sub_id: farmerId,
    timestamp: Date.now().toString()
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Records click telemetry for conversion analytics
 */
export function recordAffiliateClick(product, context = 'TreatmentTab') {
  try {
    const log = {
      productId: product.id,
      title: product.title,
      price: product.priceInr,
      partner: product.partner,
      context,
      clickedAt: new Date().toISOString()
    };

    const existingLogs = JSON.parse(localStorage.getItem('florascan_affiliate_clicks') || '[]');
    existingLogs.push(log);
    localStorage.setItem('florascan_affiliate_clicks', JSON.stringify(existingLogs.slice(-50)));
  } catch (e) {
    // Silent fail
  }
}
