import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Search,
  ExternalLink,
  QrCode,
  Award,
  Sparkles,
  Eye,
  X
} from 'lucide-react';

export default function ReportsView({ history, onSelectReport, onNewScan }) {
  const [selectedReportForPrint, setSelectedReportForPrint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = history.filter((item) =>
    item.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrintReport = (report) => {
    setSelectedReportForPrint(report);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownloadJSON = (report) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `FloraScan_Report_${report.id || 'diagnostic'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Agronomic Pathology Archive
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800">
              Download & Print Leaf Reports
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Official diagnostic certificates generated for every scanned leaf. Print laboratory-grade reports for agricultural records, insurance, or agronomy consults.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              {history.length} Reports Archived
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by plant, disease name, or report ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 text-xs sm:text-sm bg-slate-50/50"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-800">No Reports Available Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Complete a leaf scan or test with a sample to generate an official pathology certificate report here.
          </p>
          <button
            onClick={onNewScan}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20"
          >
            Start Leaf Scan Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((report) => {
            const isHealthy = report.severity === 'Healthy';
            return (
              <div
                key={report.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Specimen Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                    <img
                      src={report.image}
                      alt={report.plantName}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute bottom-1 right-1 px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                        isHealthy ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {report.severity}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        ID: {report.id}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {report.timestamp || 'Today'}
                      </span>
                    </div>

                    <h3 className="font-heading text-base sm:text-lg font-bold text-slate-800 truncate">
                      {report.plantName} — {report.diseaseName}
                    </h3>

                    <p className="text-xs text-slate-500 truncate max-w-md">
                      Pathogen: <span className="font-mono text-slate-700">{report.pathogen || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* Center: Confidence & Metrics */}
                <div className="flex items-center gap-6 text-xs text-slate-600 shrink-0">
                  <div>
                    <span className="font-bold text-slate-400 block text-[10px] uppercase">Certainty</span>
                    <span className="text-base font-extrabold font-heading text-emerald-800">
                      {report.confidence}%
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-400 block text-[10px] uppercase">Area Affected</span>
                    <span className="font-semibold text-slate-700">
                      {report.affectedArea || '0%'}
                    </span>
                  </div>

                  <div className="hidden sm:block">
                    <span className="font-bold text-slate-400 block text-[10px] uppercase">Treatments</span>
                    <span className="font-semibold text-emerald-700">
                      {(report.organicTreatments?.length || 0) + (report.chemicalTreatments?.length || 0)} remedies
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onSelectReport(report)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="View Full Dashboard"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDownloadJSON(report)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Download Report Data (JSON)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePrintReport(report)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Report</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Laboratory Report Modal / Print Preview */}
      {selectedReportForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 my-8">
            
            {/* Modal Close / Print Action Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span className="font-heading font-bold text-slate-800 text-sm">
                  Official Pathology Laboratory Report
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setSelectedReportForPrint(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Document Body */}
            <div className="space-y-6 pt-4 text-slate-800" id="printable-report">
              
              {/* Lab Header */}
              <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-2xl font-black text-emerald-900 tracking-tight">
                      FloraScan AI
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ISO 17025 Compliant
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    National Agricultural AI Pathology Diagnostic Lab
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className="font-mono font-bold text-slate-700">REPORT NO: {selectedReportForPrint.id}</p>
                  <p>DATE: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Specimen & Findings Card */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="col-span-1">
                  <img
                    src={selectedReportForPrint.image}
                    alt={selectedReportForPrint.plantName}
                    className="w-full aspect-square rounded-xl object-cover border border-slate-200"
                  />
                </div>
                <div className="col-span-2 space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Crop / Host Plant</span>
                    <h4 className="font-heading text-base font-bold text-slate-900">
                      {selectedReportForPrint.plantName} <span className="text-xs italic font-normal text-slate-500">({selectedReportForPrint.botanicalName})</span>
                    </h4>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Diagnosis</span>
                    <p className="text-sm font-extrabold text-emerald-900">
                      {selectedReportForPrint.diseaseName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Certainty</span>
                      <span className="font-bold text-emerald-700">{selectedReportForPrint.confidence}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Severity</span>
                      <span className="font-bold text-rose-700">{selectedReportForPrint.severity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescribed Treatments */}
              <div className="space-y-3 text-xs">
                <h5 className="font-heading font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1">
                  Prescribed Agronomic Treatment Protocol
                </h5>
                
                <div className="space-y-2">
                  <p className="font-bold text-emerald-800">Organic & Cultural Remediation:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {selectedReportForPrint.organicTreatments?.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>

                {selectedReportForPrint.chemicalTreatments?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="font-bold text-teal-800">Targeted Chemical Interventions:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      {selectedReportForPrint.chemicalTreatments?.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Seal & Certification */}
              <div className="flex items-end justify-between pt-6 border-t border-slate-200 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Verified by DeepFlora Vision Net v4.2</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Certified Agricultural Artificial Intelligence Protocol
                  </p>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-24 h-8 border-b border-slate-400 flex items-center justify-center font-serif italic text-slate-600 text-sm">
                    FloraScan AI Lab
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">AUTHORIZED SEAL</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
