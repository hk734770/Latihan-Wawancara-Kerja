import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';

interface InfoBannerProps {
  onOpenAudioHelp: () => void;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ onOpenAudioHelp }) => {
  return (
    <div className="bg-white/80 border border-slate-200/80 rounded-xl p-3 sm:p-3.5 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 shrink-0">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
        </div>
        <div className="text-xs">
          <span className="font-semibold text-slate-800">Mode Latihan Bebas Tekanan</span>
          <span className="hidden sm:inline text-slate-400 mx-1.5">—</span>
          <span className="block sm:inline text-slate-500">
            Simulasi ini merefleksikan standar wawancara FAANG & Unicorn regional.
          </span>
        </div>
      </div>

      <button
        onClick={onOpenAudioHelp}
        className="flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap self-end sm:self-center"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Bantuan Setup Audio</span>
      </button>
    </div>
  );
};
