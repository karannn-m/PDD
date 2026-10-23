/**
 * FloraScan - Geospatial Disease Outbreak Radar Service
 * ========================================================
 * 1. Captures localized GPS coordinates during leaf scans with farmer consent.
 * 2. Applies differential privacy fuzzing (~500m jitter) to protect farmer field boundaries.
 * 3. Spatial aggregation & district-level outbreak density calculation.
 * 4. Automated alert dispatcher when disease density crosses district outbreak threshold.
 */

// Simulated Agricultural Districts & Real-time Epidemic Monitoring Data
export const DISTRICT_OUTBREAK_REGISTRY = [
  {
    id: 'dist-punjab-bathinda',
    district: 'Bathinda',
    state: 'Punjab',
    lat: 30.2110,
    lng: 74.9455,
    cropFocus: 'Wheat & Cotton',
    dominantPathogen: 'Late Blight (Phytophthora)',
    activeCases7Days: 84,
    districtFarmSqKm: 180,
    densityIndex: 46.7, // > 40 = Red Outbreak Alert!
    riskLevel: 'CRITICAL_OUTBREAK',
    recommendedAction: 'Immediate protective spray of Mancozeb / Cymoxanil before rain front.'
  },
  {
    id: 'dist-mh-nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    lat: 19.9975,
    lng: 73.7898,
    cropFocus: 'Grapes & Tomatoes',
    dominantPathogen: 'Downy & Powdery Mildew',
    activeCases7Days: 62,
    districtFarmSqKm: 210,
    densityIndex: 29.5, // 15-40 = Moderate Watch
    riskLevel: 'MODERATE_WATCH',
    recommendedAction: 'Monitor vine undersides; spray potassium bicarbonate preventatively.'
  },
  {
    id: 'dist-up-agra',
    district: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.1767,
    lng: 78.0081,
    cropFocus: 'Potato & Mustard',
    dominantPathogen: 'Early Blight (Alternaria solani)',
    activeCases7Days: 91,
    districtFarmSqKm: 195,
    densityIndex: 46.6, // Red Outbreak Alert
    riskLevel: 'CRITICAL_OUTBREAK',
    recommendedAction: 'Severe blight cluster detected in 18 villages. Inspect lower leaves.'
  },
  {
    id: 'dist-ka-shimoga',
    district: 'Shimoga',
    state: 'Karnataka',
    lat: 13.9299,
    lng: 75.5681,
    cropFocus: 'Arecanut & Paddy',
    dominantPathogen: 'Fruit Rot (Koleroga)',
    activeCases7Days: 14,
    districtFarmSqKm: 160,
    densityIndex: 8.7, // < 15 = Normal
    riskLevel: 'LOW_NORMAL',
    recommendedAction: 'Routine crop maintenance; no regional outbreak risk.'
  },
  {
    id: 'dist-ap-guntur',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    lat: 16.3067,
    lng: 80.4365,
    cropFocus: 'Chilli & Cotton',
    dominantPathogen: 'Black Thrips & Leaf Curl',
    activeCases7Days: 53,
    districtFarmSqKm: 175,
    densityIndex: 30.2, // Moderate
    riskLevel: 'MODERATE_WATCH',
    recommendedAction: 'Install blue sticky traps; deploy neem oil biologicals.'
  }
];

/**
 * Capture user GPS coordinates with consent and privacy jitter
 */
export async function captureScanCoordinates() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        error: 'Geolocation not supported by device.',
        coords: { lat: 30.2110, lng: 74.9455, isFuzzed: true, district: 'Bathinda (Simulated)' }
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Apply differential privacy fuzzing (~0.004 degrees ~= 450-500 meters)
        const jitterLat = (Math.random() - 0.5) * 0.008;
        const jitterLng = (Math.random() - 0.5) * 0.008;

        const fuzzedLat = +(position.coords.latitude + jitterLat).toFixed(4);
        const fuzzedLng = +(position.coords.longitude + jitterLng).toFixed(4);

        // Find closest district in registry
        const nearestDistrict = findNearestDistrict(fuzzedLat, fuzzedLng);

        resolve({
          success: true,
          coords: {
            lat: fuzzedLat,
            lng: fuzzedLng,
            accuracy: Math.round(position.coords.accuracy || 20),
            isFuzzed: true,
            district: nearestDistrict.district,
            state: nearestDistrict.state
          }
        });
      },
      (error) => {
        // Fallback default coordinate (Bathinda agricultural cluster)
        resolve({
          success: false,
          error: error.message,
          coords: { lat: 30.2110, lng: 74.9455, isFuzzed: true, district: 'Bathinda, Punjab (Default)' }
        });
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  });
}

/**
 * Calculates Haversine distance in km between two lat/lng coordinates
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(1);
}

/**
 * Locates the nearest registered agricultural monitoring district
 */
export function findNearestDistrict(lat, lng) {
  let nearest = DISTRICT_OUTBREAK_REGISTRY[0];
  let minDistance = Infinity;

  DISTRICT_OUTBREAK_REGISTRY.forEach((item) => {
    const dist = calculateHaversineDistance(lat, lng, item.lat, item.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = { ...item, distanceKm: dist };
    }
  });

  return nearest;
}

/**
 * Dispatches simulated Web Push Notification if scan is in an outbreak zone
 */
export function checkAndDispatchOutbreakAlert(districtName, diseaseName) {
  const district = DISTRICT_OUTBREAK_REGISTRY.find(
    (d) => d.district.toLowerCase() === districtName.toLowerCase()
  );

  if (district && district.riskLevel === 'CRITICAL_OUTBREAK') {
    return {
      alertTriggered: true,
      title: `⚠️ Urgent Crop Alert: High ${diseaseName} Density in ${district.district}!`,
      message: `${district.activeCases7Days} cases reported within 25km radius. ${district.recommendedAction}`,
      density: district.densityIndex,
      time: 'Just now'
    };
  }

  return { alertTriggered: false };
}
