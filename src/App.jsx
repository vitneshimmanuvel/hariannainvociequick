import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Printer, 
  Cloud, 
  FolderOpen, 
  Sparkles, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { InvoiceDocument } from './components/InvoiceDocument';
import { InvoiceEditor } from './components/InvoiceEditor';
import { SignatureModal } from './components/SignatureModal';
import { SavedInvoicesModal } from './components/SavedInvoicesModal';
import { DEFAULT_INVOICE, BLANK_INVOICE } from './data/defaultInvoice';
import { saveInvoiceToNeon, initDatabase, fetchAllInvoicesFromNeon } from './services/neonDb';
import { exportInvoiceToPdf } from './services/pdfExportService';

export function App() {
  const [invoice, setInvoice] = useState(DEFAULT_INVOICE);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState('split'); // 'split', 'editor', 'preview'
  const [previewZoom, setPreviewZoom] = useState(1); // 1 = 100%, 0.85, 0.75
  
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toast, setToast] = useState(null);
  const [dbInvoiceCount, setDbInvoiceCount] = useState(0);

  const invoiceSheetRef = useRef(null);

  // Initialize DB and fetch count on mount
  useEffect(() => {
    async function setupDb() {
      await initDatabase();
      const res = await fetchAllInvoicesFromNeon();
      if (res.success && res.data) {
        setDbInvoiceCount(res.data.length);
      }
    }
    setupDb();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSaveToNeon = async () => {
    setIsSaving(true);
    try {
      const res = await saveInvoiceToNeon(invoice);
      if (res.success) {
        showToast('Invoice saved to Neon DB successfully!', 'success');
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
        const countRes = await fetchAllInvoicesFromNeon();
        if (countRes.success) setDbInvoiceCount(countRes.data.length);
      } else {
        showToast('Failed to save to Neon: ' + res.error, 'error');
      }
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async () => {
    const element = invoiceSheetRef.current;
    if (!element) return;

    setIsGeneratingPdf(true);
    const clientNameSanitized = (invoice.client?.fullName || invoice.client?.givenName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
    const invoiceNumSanitized = (invoice.invoiceNumber || 'PO').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Invoice_${invoiceNumSanitized}_${clientNameSanitized}.pdf`;

    try {
      await exportInvoiceToPdf(element, filename);
      setIsGeneratingPdf(false);
      showToast(`PDF "${filename}" downloaded!`, 'success');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err) {
      setIsGeneratingPdf(false);
      showToast('PDF Generation error: ' + err.message, 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSignatureSave = (signatureInfo) => {
    setInvoice((prev) => ({
      ...prev,
      bank: {
        ...prev.bank,
        signatureType: signatureInfo.type,
        signatureData: signatureInfo.data,
      },
    }));
    showToast('Signature updated!', 'success');
  };

  const handleLoadInvoice = (loadedInvoice) => {
    setInvoice(loadedInvoice);
    showToast(`Loaded invoice ${loadedInvoice.invoiceNumber || ''}!`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 selection:bg-red-500 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium border backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/90 border-red-500/40 text-red-200'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-red-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="app-header h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 z-30 sticky top-0 shadow-sm">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-600/30">
            <FileText size={19} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
              Payana Overseas Invoice Generator
              <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                PRO PDF
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Pixel-Perfect PDF Generator & Neon PostgreSQL Database</p>
          </div>
        </div>

        {/* View Switcher for mobile / tablets */}
        <div className="flex lg:hidden bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveViewTab('editor')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeViewTab === 'editor' ? 'bg-red-600 text-white' : 'text-slate-400'
            }`}
          >
            <Edit3 size={13} className="inline mr-1" /> Edit
          </button>
          <button
            onClick={() => setActiveViewTab('preview')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              activeViewTab === 'preview' ? 'bg-red-600 text-white' : 'text-slate-400'
            }`}
          >
            <Eye size={13} className="inline mr-1" /> Preview
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Saved in Neon DB Drawer Button */}
          <button
            type="button"
            onClick={() => setIsSavedModalOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition hover:border-slate-600 shadow-sm"
            title="Browse all saved invoices from Neon DB"
          >
            <FolderOpen size={14} className="text-amber-400" />
            <span className="hidden md:inline">Saved Invoices</span>
            {dbInvoiceCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full text-[10px] font-mono border border-amber-500/30">
                {dbInvoiceCount}
              </span>
            )}
          </button>

          {/* Save to Neon Cloud */}
          <button
            type="button"
            onClick={handleSaveToNeon}
            disabled={isSaving}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            title="Save current invoice to Neon PostgreSQL"
          >
            <Cloud size={14} />
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save to Neon'}</span>
          </button>

          {/* Native Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
            title="Print invoice via system printer"
          >
            <Printer size={14} />
            <span className="hidden md:inline">Print</span>
          </button>

          {/* Download High-Resolution PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition disabled:opacity-50 active:scale-95"
            title="Download HD Single-Page A4 PDF"
          >
            <Download size={14} />
            <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Dual-Pane Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Input Editor */}
        <div
          className={`w-full lg:w-[460px] xl:w-[480px] flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] ${
            activeViewTab === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <InvoiceEditor
            invoice={invoice}
            onChange={setInvoice}
            onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
          />
        </div>

        {/* Right Pane: Live A4 Canvas Preview */}
        <div
          className={`flex-1 h-[calc(100vh-4rem)] overflow-y-auto bg-slate-950 flex flex-col items-center custom-scrollbar ${
            activeViewTab === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Live Preview Toolbar banner with Zoom Controls */}
          <div className="w-full max-w-[210mm] py-2 px-4 flex items-center justify-between text-xs text-slate-400 no-print">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live A4 PDF Preview (210mm × 297mm)
            </span>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setPreviewZoom((z) => Math.max(0.65, z - 0.1))}
                className="p-1 hover:text-white rounded hover:bg-slate-800 transition"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="text-[11px] font-mono px-1 min-w-[38px] text-center">
                {Math.round(previewZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setPreviewZoom((z) => Math.min(1.3, z + 0.1))}
                className="p-1 hover:text-white rounded hover:bg-slate-800 transition"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewZoom(1)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Reset Zoom to 100%"
              >
                100%
              </button>
            </div>
          </div>

          {/* The Scalable Pixel-Perfect Invoice Sheet */}
          <div 
            className="pb-16 flex justify-center w-full transition-transform duration-150 origin-top"
            style={{ transform: previewZoom !== 1 ? `scale(${previewZoom})` : 'none' }}
          >
            <InvoiceDocument ref={invoiceSheetRef} invoice={invoice} />
          </div>
        </div>

      </main>

      {/* Modals */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        currentSignature={invoice.bank.signatureData}
        onSaveSignature={handleSignatureSave}
      />

      <SavedInvoicesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onLoadInvoice={handleLoadInvoice}
      />

    </div>
  );
}

export default App;
