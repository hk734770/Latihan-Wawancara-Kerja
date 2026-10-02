import React from 'react';
import { Target, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { StarProgress } from '../types/interview';

interface StarTrackerProps {
  star: StarProgress;
}

export const StarTracker: React.FC<StarTrackerProps> = ({ star }) => {
  const items = [
    {
      key: 'situation',
      number: '1',
      title: 'Situation (Konteks Masalah)',
      data: star.situation,
    },
    {
      key: 'task',
      number: '2',
      title: 'Task (Tanggung Jawab/Target)',
      data: star.task,
    },
    {
      key: 'action',
      number: '3',
      title: 'Action (Langkah Konkret)',
      data: star.action,
    },
    {
      key: 'result',
      number: '4',
      title: 'Result (Dampak & Metrik Hasil)',
      data: star.result,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
            <Target className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              STAR Framework Tracker
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-semibold border border-sky-100">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
          <span>Live AI Monitor</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-4">
        Evaluasi otomatis kelengkapan struktur jawaban secara simultan selama Anda berbicara.
      </p>

      {/* 4 STAR Components List */}
      <div className="space-y-3">
        {items.map((item) => {
          const isCompleted = item.data.status === 'completed';
          const isInProgress = item.data.status === 'in_progress';
          const isPending = item.data.status === 'pending';

          return (
            <div
              key={item.key}
              className={`p-3 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-emerald-50/50 border-emerald-200/70'
                  : isInProgress
                  ? 'bg-sky-50/50 border-sky-200/70'
                  : 'bg-slate-50/70 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isInProgress ? (
                    <Loader2 className="w-4 h-4 text-sky-600 shrink-0 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {item.number}
                    </div>
                  )}

                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {item.title}
                  </span>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-xs font-bold whitespace-nowrap ${
                    isCompleted
                      ? 'text-emerald-700'
                      : isInProgress
                      ? 'text-sky-700'
                      : 'text-amber-700'
                  }`}
                >
                  {item.data.label}
                </span>
              </div>

              {/* Progress Bar Line */}
              <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isInProgress
                      ? 'bg-sky-600'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.max(4, item.data.score)}%` }}
                />
              </div>

              {/* Details hint if available */}
              {item.data.details && (
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {item.data.details}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
