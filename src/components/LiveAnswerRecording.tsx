import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  FileText,
  RotateCcw,
  Pause,
  Play,
  ArrowRight,
  CloudCheck,
  Activity,
} from 'lucide-react';

interface LiveAnswerRecordingProps {
  transcript: string;
  keywords: string[];
  isMicActive: boolean;
  onUpdateTranscript: (newText: string) => void;
  onSubmitAnswer: () => void;
  onResetAnswer: () => void;
}

export const LiveAnswerRecording: React.FC<LiveAnswerRecordingProps> = ({
  transcript,
  keywords,
  isMicActive,
  onUpdateTranscript,
  onSubmitAnswer,
  onResetAnswer,
}) => {
  const [inputMode, setInputMode] = useState<'mic' | 'text'>('mic');
  const [isPaused, setIsPaused] = useState(false);
  const [recTimer, setRecTimer] = useState('07:47');
  const [dbLevel, setDbLevel] = useState('-12 dB');
  const recognitionRef = useRef<any>(null);

  // Recording timer countdown/countup
  useEffect(() => {
    let seconds = 7 * 60 + 47;
    const interval = setInterval(() => {
      if (!isPaused && isMicActive) {
        seconds += 1;
        const m = Math.floor(seconds / 60)
          .toString()
          .padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        setRecTimer(`${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isMicActive]);

  // Dynamic audio dB fluctuation simulation
  useEffect(() => {
    if (isMicActive && !isPaused) {
      const interval = setInterval(() => {
        const rand = Math.floor(Math.random() * 6) - 14; // -14 to -9 dB
        setDbLevel(`${rand} dB`);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isMicActive, isPaused]);

  // Speech Recognition integration
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition && isMicActive && !isPaused) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          if (currentTranscript.trim()) {
            onUpdateTranscript(currentTranscript.trim());
          }
        };

        recognition.onerror = () => {
          // Keep tranquil on silence or aborted
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        // Ignored if already started
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // clean
        }
      }
    };
  }, [isMicActive, isPaused, onUpdateTranscript]);

  // Spacebar toggle pause/play when not focusing an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Highlight detected keywords inside transcript text
  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    let parts: (string | React.ReactNode)[] = [text];

    keywords.forEach((keyword) => {
      const nextParts: (string | React.ReactNode)[] = [];
      const regex = new RegExp(`(${keyword})`, 'gi');

      parts.forEach((part) => {
        if (typeof part === 'string') {
          const split = part.split(regex);
          split.forEach((sub, i) => {
            if (sub.toLowerCase() === keyword.toLowerCase()) {
              const isTech = /tech lead|backend|refactoring|latency/i.test(sub);
              const isRice = /rice|scoring|matrix|hybrid/i.test(sub);
              nextParts.push(
                <span
                  key={`${keyword}-${i}`}
                  className={`px-1 py-0.5 rounded font-semibold text-xs transition-colors ${
                    isRice
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      : isTech
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-sky-100 text-sky-900 border border-sky-200'
                  }`}
                >
                  {sub}
                </span>
              );
            } else if (sub) {
              nextParts.push(sub);
            }
          });
        } else {
          nextParts.push(part);
        }
      });
      parts = nextParts;
    });

    return parts;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mt-4">
      {/* Header Row */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Perekaman Suara Langsung
          </h2>
          <span className="font-mono text-sm sm:text-base font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
            {recTimer}
          </span>
        </div>

        {/* Input Mode Toggle: Mikrofon vs Teks */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
          <button
            onClick={() => setInputMode('mic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              inputMode === 'mic'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Mikrofon</span>
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              inputMode === 'text'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Teks</span>
          </button>
        </div>
      </div>

      {/* Audio Sensitivity & Waveform Banner */}
      <div className="bg-[#f0f7ff] border border-sky-100 rounded-xl p-3 sm:p-4 my-3.5">
        <div className="flex items-center justify-between text-xs mb-2 text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Activity className="w-4 h-4 text-sky-600" />
            <span>
              Sensitivitas Audio Mikrofon: <strong className="text-slate-900 font-semibold">Stabil ({dbLevel})</strong>
            </span>
          </div>
          <span className="text-slate-500 hidden sm:inline">Bicara dengan artikulasi tenang</span>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="h-10 flex items-center justify-center gap-1 sm:gap-1.5 py-1">
          {Array.from({ length: 28 }).map((_, i) => {
            // Symmetrical rhythmic wave heights
            const waveHeight = isPaused || !isMicActive
              ? 4
              : Math.max(
                  6,
                  Math.sin((i / 27) * Math.PI) * 28 + (Math.sin(i * 1.5) * 6 + 4)
                );
            return (
              <span
                key={i}
                className="w-1 sm:w-1.5 bg-[#0284c7] rounded-full transition-all duration-150"
                style={{
                  height: `${waveHeight}px`,
                  opacity: isPaused ? 0.3 : 0.85 + (i % 3) * 0.05,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Live Speech-to-Text Transcript Section */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Transkrip Suara Otomatis (Live Speech-to-Text)
          </span>
          <span className="text-sky-600 font-medium">Kata kunci terdeteksi otomatis</span>
        </div>

        {inputMode === 'mic' ? (
          <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-4 min-h-[110px] max-h-[220px] overflow-y-auto text-slate-800 text-sm leading-relaxed relative">
            {transcript ? (
              <p className="whitespace-pre-wrap">
                &ldquo;{renderHighlightedText(transcript)}&rdquo;
                <span className="inline-block w-1.5 h-4 bg-sky-600 ml-1 translate-y-0.5 animate-pulse" />
              </p>
            ) : (
              <p className="text-slate-400 italic">
                Mulai berbicara, transkrip suara akan muncul secara otomatis di sini...
              </p>
            )}
          </div>
        ) : (
          <textarea
            value={transcript}
            onChange={(e) => onUpdateTranscript(e.target.value)}
            rows={4}
            className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-4 text-slate-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
            placeholder="Ketik atau edit jawaban Anda secara manual di sini..."
          />
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* Reset Answer */}
          <button
            onClick={onResetAnswer}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Ulangi Jawaban</span>
          </button>

          {/* Pause / Resume Recording */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-sky-600" />
                <span>Lanjutkan</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Jeda Rekaman</span>
              </>
            )}
          </button>
        </div>

        {/* Submit & Finish Answer Button */}
        <button
          onClick={onSubmitAnswer}
          className="bg-[#006194] hover:bg-[#004f7b] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm shadow-sky-900/10 active:scale-95 transition-all"
        >
          <span>Selesaikan & Kirim Jawaban</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Notes */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-0.5">
        <span>Spasi untuk jeda / mulai suara</span>
        <div className="flex items-center gap-1 text-slate-500">
          <CloudCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Sesi otomatis disimpan di cloud</span>
        </div>
      </div>
    </div>
  );
};
