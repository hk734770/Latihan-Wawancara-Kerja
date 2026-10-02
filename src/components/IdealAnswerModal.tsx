import React, { useState } from 'react';
import { X, Volume2, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';
import { InterviewQuestion } from '../types/interview';

interface IdealAnswerModalProps {
  isOpen: boolean;
  question: InterviewQuestion;
  onClose: () => void;
}

export const IdealAnswerModal: React.FC<IdealAnswerModalProps> = ({
  isOpen,
  question,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePlayVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(question.idealAnswer.fullText);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(question.idealAnswer.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
              <Sparkles className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Contoh Jawaban Ideal STAR
              </h3>
              <p className="text-xs text-slate-500">
                Standar jawaban benchmark kandidat tier-1 Unicorn & FAANG
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Question Reminder */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
            <span className="font-semibold text-slate-900 block text-xs mb-1">
              Pertanyaan ({question.role}):
            </span>
            &ldquo;{question.questionText}&rdquo;
          </div>

          {/* STAR 4 Pillar Breakdown */}
          <div className="space-y-3">
            {/* Situation */}
            <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/70">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Situation (Konteks & Masalah):</span>
              </div>
              <p className="text-slate-700 leading-relaxed pl-5">
                {question.idealAnswer.situation}
              </p>
            </div>

            {/* Task */}
            <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/70">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Task (Tanggung Jawab/Sasaran):</span>
              </div>
              <p className="text-slate-700 leading-relaxed pl-5">
                {question.idealAnswer.task}
              </p>
            </div>

            {/* Action */}
            <div className="p-3.5 rounded-xl bg-sky-50/40 border border-sky-200/70">
              <div className="flex items-center gap-1.5 font-bold text-sky-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>Action (Langkah Konkret & Framework):</span>
              </div>
              <p className="text-slate-700 leading-relaxed pl-5">
                {question.idealAnswer.action}
              </p>
            </div>

            {/* Result */}
            <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/70">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Result (Metrik Dampak Bisnis):</span>
              </div>
              <p className="text-slate-700 leading-relaxed pl-5">
                {question.idealAnswer.result}
              </p>
            </div>
          </div>

          {/* Key Takeaway */}
          <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 flex items-start gap-2.5">
            <Bookmark className="w-4 h-4 text-sky-700 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-sky-950 block text-xs">Poin Kunci Evaluasi Rekruter:</span>
              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                {question.idealAnswer.keyTakeaway}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePlayVoice}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              isPlaying
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span>{isPlaying ? 'Memutar Audio...' : 'Dengarkan Contoh Audio'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              {copied ? 'Tersalin!' : 'Salin Teks'}
            </button>
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-[#006194] text-white text-xs font-semibold hover:bg-[#004f7b] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
