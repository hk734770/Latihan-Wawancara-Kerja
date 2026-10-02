import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import { EvaluationResult, InterviewQuestion } from '../types/interview';

interface EvaluationReportModalProps {
  isOpen: boolean;
  question: InterviewQuestion;
  candidateTranscript: string;
  evaluation: EvaluationResult | null;
  onClose: () => void;
  onRetake: () => void;
  onNextQuestion: () => void;
}

export const EvaluationReportModal: React.FC<EvaluationReportModalProps> = ({
  isOpen,
  question,
  candidateTranscript,
  evaluation,
  onClose,
  onRetake,
  onNextQuestion,
}) => {
  const [expandedSection, setExpandedSection] = useState<'q1' | 'tips' | 'grammar'>('q1');

  if (!isOpen) return null;

  const evalData: EvaluationResult = evaluation || {
    overallScore: 88,
    verdict: 'Strong Hire',
    starScore: 92,
    articulationScore: 88,
    depthScore: 85,
    impactScore: 86,
    strengths: [
      'Penyampaian STAR sangat terstruktur dengan pemisahan konteks yang jelas antara sales & tech constraints.',
      'Penggunaan framework objektif (RICE Scoring Matrix) menunjukkan kedewasaan dalam kepemimpinan produk.',
      'Kecepatan bicara (WPM) berada pada rentang ideal dengan filler words yang sangat minim.',
    ],
    improvements: [
      'Tambahkan metrik leading indicator jangka panjang (misal: technical debt velocity recovery rate) selain dampak revenue.',
      'Sertakan refleksi retrospektif singkat tentang apa yang dapat dioptimalkan jika menghadapi skenario serupa di masa depan.',
    ],
    fillerWordTotal: 1,
    averageWpm: 130,
    feedbackSummary:
      'Jawaban Anda merefleksikan standar Lead Product Manager kelas dunia. Anda mampu mengartikulasikan kompromi sulit antara pertumbuhan komersial dan arsitektur teknis dengan tenang, terstruktur, dan berbasis data terukur.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-[#faf8ff] rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Top Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#006194] text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Laporan Hasil Evaluasi AI
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {evalData.verdict}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Sesi: {question.role} {question.code} · Pertanyaan {question.number} dari {question.totalQuestions}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Pane Layout Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Pane: Fixed Score Summary (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Overall Score Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Skor Performa Keseluruhan
              </span>

              <div className="flex items-baseline justify-center gap-1 my-2">
                <span className="text-5xl font-extrabold font-mono text-slate-900 tabular-nums">
                  {evalData.overallScore}
                </span>
                <span className="text-lg font-bold text-slate-400 font-mono">/100</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rekomendasi: {evalData.verdict}</span>
              </div>

              <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed text-left">
                {evalData.feedbackSummary}
              </p>
            </div>

            {/* Score Breakdown Bars */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                Komposisi Penilaian
              </span>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">STAR Structure</span>
                  <span className="font-mono text-emerald-600 font-bold">{evalData.starScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${evalData.starScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Artikulasi & WPM</span>
                  <span className="font-mono text-sky-600 font-bold">{evalData.articulationScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${evalData.articulationScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Kedalaman Teknis & Strategi</span>
                  <span className="font-mono text-sky-600 font-bold">{evalData.depthScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${evalData.depthScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Dampak Bisnis (Result)</span>
                  <span className="font-mono text-amber-600 font-bold">{evalData.impactScore}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${evalData.impactScore}%` }} />
                </div>
              </div>
            </div>

            {/* Quick Metrics Capsule */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white rounded-xl border border-slate-200 p-3">
                <span className="text-[11px] font-medium text-slate-500 block">Filler Words</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {evalData.fillerWordTotal}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Sangat Rendah</span>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3">
                <span className="text-[11px] font-medium text-slate-500 block">Kecepatan Bicara</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {evalData.averageWpm}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold block">WPM Ideal</span>
              </div>
            </div>
          </div>

          {/* Right Pane: Question-by-Question Accordion (col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Accordion Item: Pertanyaan & Transkrip Jawaban */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setExpandedSection(expandedSection === 'q1' ? 'tips' : 'q1')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-[#006194] text-white text-xs font-bold flex items-center justify-center font-mono">
                    {question.number}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Ulasan Pertanyaan & Transkrip Jawaban Anda
                    </h4>
                    <span className="text-[11px] text-slate-500">{question.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Skor: {evalData.overallScore}/100
                  </span>
                  {expandedSection === 'q1' ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedSection === 'q1' && (
                <div className="p-5 border-t border-slate-100 space-y-4 text-xs sm:text-sm">
                  {/* Prompt */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">
                      Pertanyaan Sarah Wicaksono:
                    </span>
                    <p className="text-slate-700 italic">&ldquo;{question.questionText}&rdquo;</p>
                  </div>

                  {/* Candidate Answer */}
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">
                      Transkrip Rekaman Anda:
                    </span>
                    <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-normal">
                      &ldquo;{candidateTranscript || question.initialTranscript}&rdquo;
                    </div>
                  </div>

                  {/* AI Strengths & Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span>Kekuatan Utama (Strengths):</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {evalData.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Saran Peningkatan (Improvements):</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {evalData.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommended Ideal Answer Snippet */}
                  <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl">
                    <div className="flex items-center gap-1.5 font-bold text-sky-950 mb-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span>Rekomendasi Jawaban Ideal dari Gemini AI:</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed italic">
                      &ldquo;{question.idealAnswer.fullText}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item: Analisis Tata Bahasa & Filler Words */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setExpandedSection(expandedSection === 'grammar' ? 'q1' : 'grammar')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-sky-600" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Analisis Diksi, Tata Bahasa & Filler Words
                  </h4>
                </div>
                {expandedSection === 'grammar' ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedSection === 'grammar' && (
                <div className="p-5 border-t border-slate-100 space-y-3 text-xs leading-relaxed">
                  <p className="text-slate-600">
                    AI mendeteksi pola komunikasi Anda sangat profesional dengan jeda alami yang matang.
                    Berikut contoh perbaikan diksi untuk dampak yang lebih tajam:
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="line-through text-rose-500 font-semibold">&ldquo;ehmm kayaknya tim sales minta...&rdquo;</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-emerald-700 font-semibold">&ldquo;tim sales memprioritaskan integrasi kustom...&rdquo;</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="line-through text-rose-500 font-semibold">&ldquo;saya bikin matrix buat nentuin...&rdquo;</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-emerald-700 font-semibold">&ldquo;saya menerapkan RICE prioritization matrix...&rdquo;</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onRetake}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Ulangi Pertanyaan Ini</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => alert('Laporan performa simulasi telah berhasil diunduh sebagai PDF.')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Unduh Ringkasan PDF
            </button>
            <button
              onClick={onNextQuestion}
              className="flex-1 sm:flex-initial bg-[#006194] hover:bg-[#004f7b] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Lanjut ke Pertanyaan Berikutnya →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
