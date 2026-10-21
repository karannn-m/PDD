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
import DosageCalculator from './components/DosageCalculator';
import OutbreakRadar from './components/OutbreakRadar';
import AgroStoreModal from './components/AgroStoreModal';
import Footer from './components/Footer';
import { SAMPLE_DIAGNOSES, analyzeUploadedImage } from './data/plantData';
import { runLocalEdgeInference, checkIsOffline } from './services/edgeModelService';
import { captureScanCoordinates, checkAndDispatchOutbreakAlert } from './services/geospatialService';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Navigation State
  // 'scanner', 'camera', 'treatments', 'calculator', 'radar', 'doctor', 'store', 'reports', 'subscription', 'guide', 'history'
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
  const [useEdgeModel, setUseEdgeModel] = useState(false);

  // Live Camera Viewfinder State
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);

  // Modals & Drawers
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [doctorDiseaseContext, setDoctorDiseaseContext] = useState(SAMPLE_DIAGNOSES[0]);

  // Outbreak notification banner
  const [activeOutbreakNotice, setActiveOutbreakNotice] = useState(null);

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

    // Automatically initiate neural analysis on live snapshot
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
  const handleStartAnalysis = (isEdge = false) => {
    if (!previewUrl) return;
    setUseEdgeModel(isEdge || checkIsOffline());
    setIsAnalyzing(true);
  };

  // Callback when scanning laser completes
  const handleAnalysisComplete = async () => {
    setIsAnalyzing(false);

    let result;
    if (activeSample) {
      result = { ...activeSample };
    } else if (useEdgeModel || checkIsOffline()) {
      // 1. Feature 1: Offline Edge AI Model
      result = await runLocalEdgeInference(previewUrl, fileName);
    } else {
      result = analyzeUploadedImage(fileName);
      result.image = previewUrl;
    }

    // Set unique report ID if not present
    if (!result.id) {
      result.id = `FS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // 2. Feature 3: Capture Geospatial Coordinates with privacy fuzzing
    const geo = await captureScanCoordinates();
    if (geo.coords) {
      result.geoCoordinates = geo.coords;
      // Check district outbreak trigger
      const alert = checkAndDispatchOutbreakAlert(geo.coords.district || 'Bathinda', result.diseaseName);
      if (alert.alertTriggered) {
        setActiveOutbreakNotice(alert);
      }
    }

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
      case 'calculator':
        return 'Smart Dosage & Dilution Calculator';
      case 'radar':
        return 'Geospatial Disease Outbreak Radar';
      case 'doctor':
        return 'AI Plant Doctor Consultation (Voice AI)';
      case 'store':
        return 'Certified Agro-Store & Certified Inputs';
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
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'guide') {
            setIsGuideOpen(true);
          } else if (tab === 'doctor') {
            setIsDoctorOpen(true);
          } else if (tab === 'store') {
            setIsStoreOpen(true);
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
          onOpenRadar={() => setActiveTab('radar')}
          hasActiveDiagnosis={!!diagnosis}
        />

        {/* Proactive Geospatial Outbreak Warning Bar */}
        {activeOutbreakNotice && (
          <div className="bg-rose-600 text-white px-4 py-2 text-xs flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <strong>{activeOutbreakNotice.title}:</strong>
              <span className="hidden sm:inline">{activeOutbreakNotice.message}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('radar')}
                className="underline font-bold hover:text-rose-200"
              >
                View Radar Map
              </button>
              <button
                onClick={() => setActiveOutbreakNotice(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1: AI LEAF SCANNER */}
          {activeTab === 'scanner' && (
            <div className="space-y-8">
              {!diagnosis ? (
                <>
                  {/* Hero Header */}
                  <div className="max-w-3xl space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live Machine-Vision Crop Pathology • Edge & Cloud Hybrid</span>
                    </div>
                    <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      Detect Leaf Diseases & Receive Instant Cures
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      Capture a live photo using your camera or upload a leaf image to pinpoint pathogens, check confidence ratings, calculate precision remedy dosages, and follow verified treatment protocols.
                    </p>
                  </div>

                  {/* Drag-and-drop & Camera Upload Hub (Supports Edge AI Mode) */}
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
                /* Dynamic Results Dashboard with Confidence, Dosage Calculator & Treatment Links */
                <ResultsDashboard
                  diagnosis={diagnosis}
                  previewUrl={previewUrl}
                  onReset={handleResetScan}
                  onAskDoctor={() => setIsDoctorOpen(true)}
                />
              )}
            </div>
          )}

          {/* TAB 2: LIVE CAMERA CAPTURE */}
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

          {/* TAB 3: TREATMENT & CURE LIBRARY */}
          {activeTab === 'treatments' && (
            <TreatmentLibrary
              onSelectSpecimen={(sample) => {
                handleSampleSelect(sample);
              }}
              onAskDoctorAbout={handleAskDoctorAbout}
            />
          )}

          {/* FEATURE 4: SMART DOSAGE & REMEDY CALCULATOR (STANDALONE VIEW) */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <DosageCalculator
                initialDiseaseName={diagnosis?.diseaseName || 'Late Blight'}
                onOrderProduct={() => {
                  setIsStoreOpen(true);
                }}
              />
            </div>
          )}

          {/* FEATURE 3: GEOSPATIAL DISEASE OUTBREAK RADAR */}
          {activeTab === 'radar' && (
            <div className="space-y-6">
              <OutbreakRadar />
            </div>
          )}

          {/* TAB: DOWNLOAD REPORTS */}
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

          {/* TAB: SUBSCRIPTION PLANS */}
          {activeTab === 'subscription' && (
            <SubscriptionView
              isProUser={isProUser}
              onUpgradeToPro={() => setIsProUser(true)}
            />
          )}

          {/* TAB: SCAN HISTORY */}
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

      {/* Live Camera Viewfinder Overlay */}
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

      {/* Feature 2: Multilingual Voice AI Plant Doctor Assistant Modal */}
      {isDoctorOpen && (
        <PlantDoctorModal
          isOpen={isDoctorOpen}
          onClose={() => setIsDoctorOpen(false)}
          diagnosis={doctorDiseaseContext || SAMPLE_DIAGNOSES[0]}
        />
      )}

      {/* Feature 5: Direct Agro-Store & Affiliate Purchase Modal */}
      {isStoreOpen && (
        <AgroStoreModal
          isOpen={isStoreOpen}
          onClose={() => setIsStoreOpen(false)}
          diagnosis={doctorDiseaseContext || SAMPLE_DIAGNOSES[0]}
        />
      )}

    </div>
  );
}
