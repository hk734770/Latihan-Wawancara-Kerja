import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

interface SubHeaderProps {
  roleTitle: string;
  roleCode: string;
  questionNumber: number;
  totalQuestions: number;
  sessionTime: string;
  onBack: () => void;
  onSelectRole: () => void;
}

export const SubHeader: React.FC<SubHeaderProps> = ({
  roleTitle,
  roleCode,
  questionNumber,
  totalQuestions,
  sessionTime,
  onBack,
  onSelectRole,
}) => {
  const percentCompleted = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <div className="bg-[#faf8ff] border-b border-slate-200/60 py-3">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors font-medium text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda</span>
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={onSelectRole}
            className="flex items-center gap-1.5 hover:text-sky-700 transition-colors text-slate-900 font-semibold"
          >
            <span>Simulasi: {roleTitle}</span>
            <span className="text-[11px] font-mono font-medium text-sky-700 bg-sky-100/70 px-1.5 py-0.5 rounded">
              {roleCode}
            </span>
          </button>
        </div>

        {/* Right: Progress and Status */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-between md:justify-end">
          {/* Progress */}
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-medium text-slate-700 whitespace-nowrap">
              Pertanyaan {questionNumber} dari {totalQuestions}
            </span>
            <span className="text-xs font-bold text-sky-600 font-mono">
              {percentCompleted}% Selesai
            </span>
            <div className="w-24 sm:w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 transition-all duration-500 rounded-full"
                style={{ width: `${percentCompleted}%` }}
              />
            </div>
          </div>

          {/* Live Audio indicator & Session Timer */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">Live Audio</span>
            </div>

            <div className="flex items-center gap-1 text-slate-600 font-mono text-xs sm:text-sm">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{sessionTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
