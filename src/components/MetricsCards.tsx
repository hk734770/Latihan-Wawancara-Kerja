import React from 'react';
import { CheckCircle2, Gauge } from 'lucide-react';

interface MetricsCardsProps {
  fillerCount: number;
  fillerDetails: { word: string; count: number }[];
  wpm: number;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  fillerCount,
  fillerDetails,
  wpm,
}) => {
  const getFillerStatus = (count: number) => {
    if (count <= 2) return { text: 'Sangat Minim', color: 'text-emerald-600' };
    if (count <= 5) return { text: 'Cukup Baik', color: 'text-sky-600' };
    return { text: 'Perlu Dikurangi', color: 'text-amber-600' };
  };

  const fillerStatus = getFillerStatus(fillerCount);

  return (
    <div className="grid grid-cols-2 gap-3.5 mt-3.5">
      {/* Filler Words Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-xs font-semibold text-slate-700">Filler Words</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {fillerCount}
            </span>
            <span className={`text-xs font-semibold ${fillerStatus.color}`}>
              {fillerStatus.text}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 mt-2 truncate">
          {fillerDetails && fillerDetails.length > 0 ? (
            fillerDetails.map((f, i) => (
              <span key={f.word}>
                &ldquo;{f.word}&rdquo;: {f.count}
                {i < fillerDetails.length - 1 ? ' • ' : ''}
              </span>
            ))
          ) : (
            <span>&ldquo;ehmm&rdquo;: 1 • &ldquo;kayaknya&rdquo;: 0</span>
          )}
        </div>
      </div>

      {/* Kecepatan Bicara Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-xs font-semibold text-slate-700">Kecepatan Bicara</span>
            <Gauge className="w-4 h-4 text-sky-600" />
          </div>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {wpm}
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">WPM</span>
          </div>
        </div>

        <div className="text-[11px] text-emerald-700 font-medium mt-2">
          Rentang Ideal (120-150)
        </div>
      </div>
    </div>
  );
};
