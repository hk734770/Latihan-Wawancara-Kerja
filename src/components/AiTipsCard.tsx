import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

interface AiTipsCardProps {
  tip: string;
}

export const AiTipsCard: React.FC<AiTipsCardProps> = ({ tip }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mt-3.5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/70">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Tips AI Spontan</h4>
        </div>

        <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
          <Sparkles className="w-3 h-3 text-sky-600" />
          <span>Co-Pilot Aktif</span>
        </span>
      </div>

      <div className="bg-amber-50/60 border-l-2 border-amber-400 p-3 rounded-r-xl">
        <p className="text-xs text-slate-800 leading-relaxed italic">
          &ldquo;{tip}&rdquo;
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
        <span>Dianalisis secara real-time</span>
        <span className="text-slate-500 font-medium">Berdasarkan transkrip suara</span>
      </div>
    </div>
  );
};
