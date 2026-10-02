import React from 'react';
import { SlidersHorizontal, Mic2, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

interface QuickControlsProps {
  onOpenMicTest: () => void;
  onOpenIdealAnswer: () => void;
  onEndSession: () => void;
}

export const QuickControls: React.FC<QuickControlsProps> = ({
  onOpenMicTest,
  onOpenIdealAnswer,
  onEndSession,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mt-3.5 space-y-2.5">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900">Kendali Sesi Cepat</h4>
        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
      </div>

      {/* Button 1: Test Mic */}
      <button
        onClick={onOpenMicTest}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-700 text-xs font-semibold transition-all group active:scale-[0.99]"
      >
        <div className="flex items-center gap-2">
          <Mic2 className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
          <span>Uji Ulang Input Mikrofon</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Button 2: Ideal Answer */}
      <button
        onClick={onOpenIdealAnswer}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-700 text-xs font-semibold transition-all group active:scale-[0.99]"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
          <span>Contoh Jawaban Ideal STAR</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Link: Exit Session */}
      <div className="pt-2 text-center">
        <button
          onClick={onEndSession}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Akhiri Sesi & Simpan Draf</span>
        </button>
      </div>
    </div>
  );
};
