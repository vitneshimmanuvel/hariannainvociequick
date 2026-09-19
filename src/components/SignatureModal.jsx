import React, { useRef, useState, useEffect } from 'react';
import { X, Check, RotateCcw, Upload, Edit3 } from 'lucide-react';
import workSignatureImg from '../assets/work-signature.png';
import signatureImg from '../assets/signature.png';

export function SignatureModal({ isOpen, onClose, currentSignature, onSaveSignature }) {
  const [activeTab, setActiveTab] = useState('preset'); // 'preset', 'draw', 'upload'
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState('work'); // 'work' or 'standard'

  useEffect(() => {
    if (isOpen && activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (activeTab === 'preset') {
      if (selectedPreset === 'standard') {
        onSaveSignature({ type: 'image', data: signatureImg });
      } else {
        onSaveSignature({ type: 'image', data: workSignatureImg });
      }
    } else if (activeTab === 'draw') {
      if (hasDrawn && canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        onSaveSignature({ type: 'drawn', data: dataUrl });
      } else {
        onSaveSignature({ type: 'image', data: workSignatureImg });
      }
    } else if (activeTab === 'upload') {
      if (uploadedImage) {
        onSaveSignature({ type: 'image', data: uploadedImage });
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Edit3 size={18} className="text-red-500" />
            Signature Settings
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === 'preset' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Official Signatures
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === 'draw' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Draw Signature
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
              activeTab === 'upload' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload Image
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {activeTab === 'preset' && (
            <div className="space-y-4">
              <label
                onClick={() => setSelectedPreset('work')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                  selectedPreset === 'work' ? 'border-red-500 bg-slate-950' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-slate-200">Official Work Signature (A.PH)</div>
                  <div className="text-xs text-slate-400">Authentic scanned signature from invoice full</div>
                </div>
                <div className="bg-white p-2 rounded-lg shadow max-w-[140px]">
                  <img src={workSignatureImg} alt="Work Signature" className="h-9 object-contain" />
                </div>
              </label>

              <label
                onClick={() => setSelectedPreset('standard')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                  selectedPreset === 'standard' ? 'border-red-500 bg-slate-950' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-slate-200">Alternative Signature (Signature 2)</div>
                  <div className="text-xs text-slate-400">Standard clean signature from invoice full</div>
                </div>
                <div className="bg-white p-2 rounded-lg shadow max-w-[140px]">
                  <img src={signatureImg} alt="Standard Signature" className="h-9 object-contain" />
                </div>
              </label>
            </div>
          )}

          {activeTab === 'draw' && (
            <div>
              <div className="relative bg-white rounded-xl overflow-hidden border border-slate-300 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-36 cursor-crosshair touch-none"
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-sm">
                    Draw your signature here with mouse or touch
                  </div>
                )}
              </div>
              <div className="mt-3 flex justify-between items-center text-xs text-slate-400">
                <span>Sign above</span>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="flex items-center gap-1 text-slate-300 hover:text-red-400 font-medium px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
                >
                  <RotateCcw size={12} /> Clear
                </button>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="text-center">
              <label className="block border-2 border-dashed border-slate-700 hover:border-red-500 rounded-xl p-6 cursor-pointer bg-slate-950 transition">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploadedImage ? (
                  <div className="flex flex-col items-center">
                    <img src={uploadedImage} alt="Uploaded signature" className="max-h-24 object-contain bg-white/90 p-2 rounded" />
                    <span className="text-xs text-emerald-400 mt-2">Signature loaded! Click Apply to save.</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={28} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">Click to upload signature image</span>
                    <span className="text-xs text-slate-500">PNG, JPG, WebP with transparent or white background</span>
                  </div>
                )}
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg shadow-red-600/30 transition flex items-center gap-2"
          >
            <Check size={16} /> Apply Signature
          </button>
        </div>
      </div>
    </div>
  );
}
