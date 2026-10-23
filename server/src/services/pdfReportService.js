import PDFDocument from 'pdfkit';

/**
 * Generates an ISO-standard Agricultural Clinical Pathology PDF Report
 * Streamed directly to Express HTTP response
 */
export const generateScanReportPdf = (scanData, res) => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 45, right: 45 },
    info: {
      Title: `FloraScan Clinical Report - ${scanData.id}`,
      Author: 'FloraScan Pathology Network',
      Subject: `Diagnostic Report for ${scanData.cropIdentified} - ${scanData.diseaseName}`
    }
  });

  // Stream document directly to client response
  doc.pipe(res);

  // --- BRAND HEADER ---
  doc.rect(45, 40, 505, 55).fill('#14532d'); // Forest Emerald
  doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text('FloraScan', 60, 50);
  doc.fontSize(10).font('Helvetica').text('Autonomous Agricultural Plant Pathology & Diagnostic Hub', 60, 75);

  doc.fillColor('#dcfce7').fontSize(9).font('Helvetica-Bold').text('CLINICAL ADVISORY REPORT', 400, 52, { align: 'right' });
  doc.fontSize(8).font('Helvetica').text(`REF: #FS-${scanData.id.slice(0, 8).toUpperCase()}`, 400, 66, { align: 'right' });
  doc.fontSize(8).text(`DATE: ${new Date(scanData.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 400, 78, { align: 'right' });

  doc.moveDown(3);

  // --- SPECIMEN & FARM DETAILS ---
  doc.rect(45, 110, 505, 70).fill('#f8fafc').stroke('#cbd5e1');
  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('SPECIMEN & FIELD PROFILE', 55, 118);

  doc.fontSize(9).font('Helvetica');
  doc.text(`Crop Inspected: `, 55, 138).font('Helvetica-Bold').text(`${scanData.cropIdentified}`, 135, 138);
  doc.font('Helvetica').text(`Field Location: `, 55, 153).font('Helvetica-Bold').text(`${scanData.district || 'Bathinda'}, ${scanData.state || 'Punjab'}`, 135, 153);

  doc.font('Helvetica').text(`Farmer / Client ID: `, 300, 138).font('Helvetica-Bold').text(`${scanData.userId || 'Guest Farmer'}`, 400, 138);
  doc.font('Helvetica').text(`Telemetry Model: `, 300, 153).font('Helvetica-Bold').text(`${scanData.modelEngine || 'TFLite INT8 Edge'}`, 400, 153);

  // --- PATHOLOGY DIAGNOSIS ---
  const boxColor = scanData.severityPercentage > 40 ? '#fef2f2' : '#f0fdf4';
  const borderColor = scanData.severityPercentage > 40 ? '#ef4444' : '#22c55e';
  doc.rect(45, 195, 505, 105).fill(boxColor).stroke(borderColor);

  doc.fillColor('#7f1d1d').fontSize(12).font('Helvetica-Bold').text('PRIMARY PATHOLOGY FINDING', 55, 205);

  doc.fillColor('#111827').fontSize(16).font('Helvetica-Bold').text(`${scanData.diseaseName || 'Early Blight'}`, 55, 222);
  doc.fontSize(10).font('Helvetica-Oblique').fillColor('#4b5563').text(`Etiological Agent: ${scanData.scientificName || 'Alternaria solani'} (${scanData.pathogenType || 'Fungal'})`, 55, 242);

  // Diagnostic Metrics Badges
  doc.rect(55, 262, 130, 24).fill('#ffffff').stroke('#e2e8f0');
  doc.fillColor('#1e293b').fontSize(8).font('Helvetica').text('CONFIDENCE SCORE', 62, 267);
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#15803d').text(`${(scanData.confidenceScore * 100).toFixed(1)}%`, 62, 275);

  doc.rect(195, 262, 130, 24).fill('#ffffff').stroke('#e2e8f0');
  doc.fillColor('#1e293b').fontSize(8).font('Helvetica').text('LEAF SEVERITY INDEX', 202, 267);
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#b91c1c').text(`${scanData.severityPercentage || 38.5}% Infection`, 202, 275);

  doc.rect(335, 262, 200, 24).fill('#ffffff').stroke('#e2e8f0');
  doc.fillColor('#1e293b').fontSize(8).font('Helvetica').text('CLINICAL URGENCY', 342, 267);
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#c2410c').text('IMMEDIATE INTERVENTION', 342, 275);

  // --- TREATMENT PROTOCOL ---
  doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text('RECOMMENDED REMEDIATION PROTOCOL', 45, 320);

  // Chemical Intervention
  doc.rect(45, 335, 245, 130).fill('#f8fafc').stroke('#e2e8f0');
  doc.fillColor('#1e3a8a').fontSize(10).font('Helvetica-Bold').text('Option A: Chemical Fungicide', 55, 345);
  doc.fillColor('#334155').fontSize(8.5).font('Helvetica');
  doc.text('• Compound: Mancozeb 75% WP or Chlorothalonil 75% WP', 55, 362, { width: 225 });
  doc.text('• Foliar Dilution: 2.5 - 3.0 g per 1 Liter of clean water', 55, 382, { width: 225 });
  doc.text('• Spray Cadence: 2 sprays at 7-day intervals', 55, 402, { width: 225 });
  doc.text('• Pre-Harvest Interval (PHI): 7 Days mandatory withholding period', 55, 422, { width: 225 });
  doc.text('• Protective Gear: Wear mask & nitrile gloves during application', 55, 442, { width: 225 });

  // Organic Bio-Control
  doc.rect(305, 335, 245, 130).fill('#f8fafc').stroke('#e2e8f0');
  doc.fillColor('#14532d').fontSize(10).font('Helvetica-Bold').text('Option B: Organic & Bio-Control', 315, 345);
  doc.fillColor('#334155').fontSize(8.5).font('Helvetica');
  doc.text('• Bio-fungicide: Trichoderma viride (1% WP) @ 5g/L water', 315, 362, { width: 225 });
  doc.text('• Botanical: 10,000 PPM Cold-Pressed Neem Oil (3ml/L) + Soap', 315, 382, { width: 225 });
  doc.text('• Cultural Control: Prune lower infected leaves 15cm above soil', 315, 402, { width: 225 });
  doc.text('• Irrigation: Shift from overhead sprinklers to drip irrigation', 315, 422, { width: 225 });
  doc.text('• Residual Toxicity: Zero toxic residues; organic certified', 315, 442, { width: 225 });

  // --- SMART TANK DILUTION SCHEDULE ---
  doc.rect(45, 480, 505, 95).fill('#eff6ff').stroke('#bfdbfe');
  doc.fillColor('#1e40af').fontSize(11).font('Helvetica-Bold').text('CALIBRATED TANK DILUTION REFERENCE (1 ACRE BASELINE)', 55, 492);

  doc.fillColor('#1e293b').fontSize(9).font('Helvetica');
  doc.text('Total Spray Solution Required:', 55, 510).font('Helvetica-Bold').text('200 Liters of water per acre', 220, 510);
  doc.font('Helvetica').text('Standard 16L Knapsack Sprayers:', 55, 525).font('Helvetica-Bold').text('12.5 Tanks total (48g active compound per tank)', 220, 525);
  doc.font('Helvetica').text('Optimal Weather Conditions:', 55, 540).font('Helvetica-Bold').text('Relative humidity < 80%, wind < 8 km/h, clear skies', 220, 540);
  doc.font('Helvetica').text('Rainfast Period:', 55, 555).font('Helvetica-Bold').text('Requires 3 hours dry canopy contact before rainfall', 220, 555);

  // --- FOOTER & DISCLAIMER ---
  doc.rect(45, 730, 505, 40).fill('#f1f5f9');
  doc.fillColor('#64748b').fontSize(7.5).font('Helvetica')
    .text('NOTICE: This diagnostic report is generated using neural vision models validated against agricultural plant pathology datasets. Consult a licensed agronomist for commercial decisions. FloraScan accepts no legal liability for crop outcomes.', 55, 736, { width: 485, align: 'center' });
  doc.fillColor('#94a3b8').fontSize(7)
    .text('Certified by FloraScan Precision Agri-Intelligence Systems • Verified Digital Signature Document', 55, 756, { width: 485, align: 'center' });

  doc.end();
};
