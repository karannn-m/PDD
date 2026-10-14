import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import UploadZone from './components/UploadZone';
import LiveCamera from './components/LiveCamera';
import ScanningOverlay from './components/ScanningOverlay';
import ResultsDashboard from './components/ResultsDashboard';
import HistoryView from './components/HistoryView';
import TreatmentLibrary from './components/TreatmentLibrary';
import ReportsView from './components/ReportsView';
import SubscriptionView from './components/SubscriptionView';
import PhotoGuideModal from './components/PhotoGuideModal';
import PlantDoctorModal from './components/PlantDoctorModal';
import EcoStatsBanner from './components/EcoStatsBanner';
import Footer from './components/Footer';
import { SAMPLE_DIAGNOSES, analyzeUploadedImage } from './data/plantData';
import { Sparkles, Leaf, Camera, ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function App() {
  // Navigation State (Line-by-line options on left sidebar)
  // 1: 'scanner', 2: 'camera', 3: 'treatments', 4: 'doctor', 5: 'reports', 6: 'subscription', 7: 'guide', 8: 'history'
  const [activeTab, setActiveTab] = useState('scanner');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Subscription state
  const [isProUser, setIsProUser] = useState(false);

  // Scan & Diagnostic State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [activeSample, setActiveSample] = useState(null);

  // Live Camera Viewfinder State
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [doctorDiseaseContext, setDoctorDiseaseContext] = useState(SAMPLE_DIAGNOSES[0]);

  // Scan History & Reports Journal
  const [scanHistory, setScanHistory] = useState([
    {
      id: 'FS-2026-9041',
      plantName: 'Tomato',
      botanicalName: 'Solanum lycopersicum',
      diseaseName: 'Late Blight',
      severity: 'Critical',
      confidence: 98.4,
      image: '/samples/tomato_late_blight.jpg',
      timestamp: '15 mins ago',
      ...SAMPLE_DIAGNOSES[0]
    },
    {
      id: 'FS-2026-8812',
      plantName: 'Monstera Deliciosa',
      botanicalName: 'Monstera deliciosa',
      diseaseName: 'None (Healthy Specimen)',
      severity: 'Healthy',
      confidence: 99.2,
      image: '/samples/healthy_monstera.jpg',
      timestamp: '35 mins ago',
      ...SAMPLE_DIAGNOSES[3]
    }
  ]);

  // Handle local file upload
  const handleImageSelect = (file, dataUrl) => {
    setSelectedFile(file);
    setPreviewUrl(dataUrl);
    setFileName(file.name);
    setActiveSample(null);
    setDiagnosis(null);
    setActiveTab('scanner');
  };

  // Handle live camera capture snapshot
  const handleLiveCameraCapture = (dataUrl, name) => {
    setIsLiveCameraOpen(false);
    setSelectedFile(null);
    setPreviewUrl(dataUrl);
    setFileName(name || 'Live_Camera_Leaf.jpg');
    setActiveSample(null);
    setDiagnosis(null);
    setActiveTab('scanner');

    // Automatically initiate neural analysis on live snapshot!
    setIsAnalyzing(true);
  };

  // Handle clicking one of the verified sample specimens
  const handleSampleSelect = (sample) => {
    setActiveSample(sample);
    setSelectedFile(null);
    setPreviewUrl(sample.image);
    setFileName(`${sample.plantName} Specimen`);
    setDiagnosis(null);
    setActiveTab('scanner');

    // Automatically trigger analysis
    setIsAnalyzing(true);
  };

  // Trigger analysis for loaded preview
  const handleStartAnalysis = () => {
    if (!previewUrl) return;
    setIsAnalyzing(true);
  };

  // Callback when scanning laser completes
  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);

    let result;
    if (activeSample) {
      result = activeSample;
    } else {
      result = analyzeUploadedImage(fileName);
      result.image = previewUrl;
    }

    // Set unique report ID
    result.id = `FS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setDiagnosis(result);
    setDoctorDiseaseContext(result);

    // Add to session scan history & reports
    const historyItem = {
      ...result,
      timestamp: 'Just now',
      image: previewUrl
    };

    setScanHistory((prev) => [
      historyItem,
      ...prev.filter((item) => item.id !== result.id)
    ]);
  };

  // Reset scan back to clean upload state
  const handleResetScan = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName('');
    setDiagnosis(null);
    setActiveSample(null);
    setIsAnalyzing(false);
    setActiveTab('scanner');
  };

  // Recall item from history / reports
  const handleSelectHistoryItem = (item) => {
    setDiagnosis(item);
    setPreviewUrl(item.image);
    setFileName(`${item.plantName} (Historical Record)`);
    setActiveSample(item);
    setDoctorDiseaseContext(item);
    setActiveTab('scanner');
  };

  // Open doctor about specific disease from Treatment Library
  const handleAskDoctorAbout = (diseaseItem) => {
    setDoctorDiseaseContext(diseaseItem);
    setIsDoctorOpen(true);
  };

  // Get human readable tab title for TopBar
  const getTabTitle = () => {
    switch (activeTab) {
      case 'scanner':
        return diagnosis ? 'Diagnostic Results & Treatment Protocol' : 'AI Leaf Disease Scanner';
      case 'camera':
        return 'Live Camera Scanner';
      case 'treatments':
        return 'Treatment & Agronomy Library';
      case 'doctor':
        return 'AI Plant Doctor Consultation (Voice AI)';
      case 'reports':
        return 'Download & Print Leaf Diagnostic Reports';
      case 'subscription':
        return 'Subscription & Agronomy Plans';
      case 'guide':
        return 'Leaf Photography Guidelines';
      case 'history':
        return 'Scan History & Past Diagnostics';
      default:
        return 'AI Leaf Disease Scanner';
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/40 text-slate-800 antialiased">
      
      {/* 1. Left Sidebar Navigation (Ordered strictly as requested) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'guide') {
            setIsGuideOpen(true);
          } else if (tab === 'doctor') {
            setIsDoctorOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        historyCount={scanHistory.length}
        reportsCount={scanHistory.length}
        isProUser={isProUser}
        onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
        onResetScan={handleResetScan}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Dashboard Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TopBar Header with Mobile Hamburger & Quick Camera */}
        <TopBar
          activeTabTitle={getTabTitle()}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
          onResetScan={handleResetScan}
          hasActiveDiagnosis={!!diagnosis}
        />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1: AI LEAF SCANNER (1st Position) */}
          {activeTab === 'scanner' && (
            <div className="space-y-8">
              {!diagnosis ? (
                <>
                  {/* Hero Header */}
                  <div className="max-w-3xl space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live Machine-Vision Crop Pathology</span>
                    </div>
                    <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      Detect Leaf Diseases & Receive Instant Cures
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      Capture a live photo using your camera or upload a leaf image to pinpoint pathogens, check confidence ratings, and follow organic & targeted treatment checklists.
                    </p>
                  </div>

                  {/* Drag-and-drop & Camera Upload Hub */}
                  <UploadZone
                    selectedImage={selectedFile}
                    previewUrl={previewUrl}
                    fileName={fileName}
                    onImageSelect={handleImageSelect}
                    onSampleSelect={handleSampleSelect}
                    onStartAnalysis={handleStartAnalysis}
                    onOpenLiveCamera={() => setIsLiveCameraOpen(true)}
                    isAnalyzing={isAnalyzing}
                  />

                  {/* Agronomy Telemetry & Sustainability Banner */}
                  <EcoStatsBanner />
                </>
              ) : (
                /* Dynamic Results Dashboard with Confidence & Treatment Recommendations */
                <ResultsDashboard
                  diagnosis={diagnosis}
                  previewUrl={previewUrl}
                  onReset={handleResetScan}
                  onAskDoctor={() => setIsDoctorOpen(true)}
                />
              )}
            </div>
          )}

          {/* TAB 2: LIVE CAMERA CAPTURE (2nd Position direct trigger / view) */}
          {activeTab === 'camera' && (
            <div className="bg-white rounded-3xl p-8 border border-emerald-100 text-center space-y-6 shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
                <Camera className="w-10 h-10" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-heading text-2xl font-bold text-slate-800">
                  Live Camera Scanner Viewfinder
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Stream high-definition video directly from your webcam or smartphone camera with real-time leaf alignment guides.
                </p>
              </div>
              <button
                onClick={() => setIsLiveCameraOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
              >
                <Camera className="w-5 h-5" />
                <span>Launch Camera Viewfinder</span>
              </button>
            </div>
          )}

          {/* TAB 3: TREATMENT & CURE LIBRARY (3rd Position) */}
          {activeTab === 'treatments' && (
            <TreatmentLibrary
              onSelectSpecimen={(sample) => {
                handleSampleSelect(sample);
              }}
              onAskDoctorAbout={handleAskDoctorAbout}
            />
          )}

          {/* TAB 5: DOWNLOAD REPORTS (Replaces Health Analytics - 5th Position) */}
          {activeTab === 'reports' && (
            <ReportsView
              history={scanHistory}
              onSelectReport={handleSelectHistoryItem}
              onNewScan={() => {
                handleResetScan();
                setActiveTab('scanner');
              }}
            />
          )}

          {/* TAB 6: SUBSCRIPTION PLANS (6th Position) */}
          {activeTab === 'subscription' && (
            <SubscriptionView
              isProUser={isProUser}
              onUpgradeToPro={() => setIsProUser(true)}
            />
          )}

          {/* TAB 8: SCAN HISTORY (LAST Position) */}
          {activeTab === 'history' && (
            <HistoryView
              history={scanHistory}
              onSelectScan={handleSelectHistoryItem}
              onClearHistory={() => setScanHistory([])}
              onNewScan={() => {
                handleResetScan();
                setActiveTab('scanner');
              }}
            />
          )}

        </main>

        {/* Footer */}
        <Footer />

      </div>

      {/* Live Camera Viewfinder Overlay (WebRTC camera stream & snapshot) */}
      {isLiveCameraOpen && (
        <LiveCamera
          onCapture={handleLiveCameraCapture}
          onClose={() => setIsLiveCameraOpen(false)}
        />
      )}

      {/* High-Tech Botanical Laser Scanning Overlay */}
      {isAnalyzing && (
        <ScanningOverlay
          previewUrl={previewUrl}
          onComplete={handleAnalysisComplete}
        />
      )}

      {/* Photography Tips Modal */}
      <PhotoGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Ask AI Plant Doctor Assistant Modal with Voice Input & Voice Output */}
      {isDoctorOpen && (
        <PlantDoctorModal
          isOpen={isDoctorOpen}
          onClose={() => setIsDoctorOpen(false)}
          diagnosis={doctorDiseaseContext || SAMPLE_DIAGNOSES[0]}
        />
      )}

    </div>
  );
}
