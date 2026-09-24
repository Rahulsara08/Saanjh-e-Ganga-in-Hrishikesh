import React, { useState, useEffect } from 'react';
import { WeddingConfig } from '../types';
import { X, RotateCcw, Download, Check, AlertCircle, Settings } from 'lucide-react';

interface CMSConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: WeddingConfig;
  onSaveConfig: (newConfig: WeddingConfig) => void;
  onResetDefault: () => void;
}

export const CMSConfigModal: React.FC<CMSConfigModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSaveConfig,
  onResetDefault,
}) => {
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJsonString(JSON.stringify(currentConfig, null, 2));
      setError(null);
      setSaveSuccess(false);
    }
  }, [isOpen, currentConfig]);

  if (!isOpen) return null;

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonString) as WeddingConfig;
      // Basic sanity check
      if (!parsed.couple || !parsed.ourStory) {
        throw new Error('Config must contain couple and ourStory objects');
      }
      onSaveConfig(parsed);
      setError(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'meher_kabir_wedding_config.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4038]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF6F0] w-full max-w-4xl max-h-[92vh] rounded-3xl border border-[#DFC48F] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DFC48F]/40 bg-[#F3EDE3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="text-[#C6A15B]" size={20} />
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#4A4038] font-normal">
                Wedding CMS Config Editor
              </h3>
              <p className="text-[10px] tracking-wider uppercase text-[#8A7F72]">
                Live In-App JSON Configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FAF6F0] text-[#8A7F72] hover:text-[#4A4038] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-6 py-3 border-b border-[#DFC48F]/30 bg-[#FAF6F0] flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#8A7F72]">
            Modify any copy, dates, timings, venues, or FAQs. Changes apply instantly to the invitation.
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={onResetDefault}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#DFC48F] text-xs font-sans text-[#8A7F72] hover:text-[#4A4038] hover:bg-[#F3EDE3] transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset to Default</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#DFC48F] text-xs font-sans text-[#8A7F72] hover:text-[#4A4038] hover:bg-[#F3EDE3] transition-colors"
            >
              <Download size={12} />
              <span>Download JSON</span>
            </button>
          </div>
        </div>

        {/* Error or Success notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>JSON Error: {error}</span>
          </div>
        )}
        {saveSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <Check size={15} className="shrink-0" />
            <span>Config successfully saved & live changes applied!</span>
          </div>
        )}

        {/* Editor Area */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <textarea
            value={jsonString}
            onChange={(e) => setJsonString(e.target.value)}
            className="w-full flex-1 p-4 rounded-xl font-mono text-xs text-[#4A4038] bg-white border border-[#DFC48F]/60 focus:outline-none focus:border-[#C6A15B] leading-relaxed resize-none shadow-inner"
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#DFC48F]/40 bg-[#F3EDE3] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-[#DFC48F] text-xs font-sans uppercase tracking-wider text-[#8A7F72] hover:bg-[#FAF6F0]"
          >
            Close
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 rounded-full bg-[#F1D9D6] hover:bg-[#E3B9B4] text-[#4A4038] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs border border-[#E3B9B4] flex items-center space-x-1.5"
          >
            <Check size={14} />
            <span>Apply Live Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
