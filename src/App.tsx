import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SubHeader } from './components/SubHeader';
import { RecruiterVideoBox } from './components/RecruiterVideoBox';
import { LiveAnswerRecording } from './components/LiveAnswerRecording';
import { InfoBanner } from './components/InfoBanner';
import { StarTracker } from './components/StarTracker';
import { MetricsCards } from './components/MetricsCards';
import { AiTipsCard } from './components/AiTipsCard';
import { QuickControls } from './components/QuickControls';
import { Footer } from './components/Footer';
import { IdealAnswerModal } from './components/IdealAnswerModal';
import { MicTestModal } from './components/MicTestModal';
import { RoleSelectorModal } from './components/RoleSelectorModal';
import { EvaluationReportModal } from './components/EvaluationReportModal';
import { INTERVIEW_QUESTIONS, AVAILABLE_ROLES } from './data/mockQuestions';
import { evaluateStarOnServer, generateFinalEvaluation } from './services/geminiService';
import { EvaluationResult, StarProgress } from './types/interview';

export default function App() {
  // Question & Session State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex] || INTERVIEW_QUESTIONS[0];

  const [transcript, setTranscript] = useState(currentQuestion.initialTranscript);
  const [starProgress, setStarProgress] = useState<StarProgress>(currentQuestion.initialStar);
  const [fillerCount, setFillerCount] = useState(currentQuestion.initialFillerCount);
  const [fillerDetails, setFillerDetails] = useState(currentQuestion.initialFillerDetails);
  const [wpm, setWpm] = useState(currentQuestion.initialWpm);
  const [spontaneousTip, setSpontaneousTip] = useState(currentQuestion.spontaneousTip);

  // Audio / Mic State
  const [isMicActive, setIsMicActive] = useState(true);
  const [sessionTime, setSessionTime] = useState('15:05');

  // Modals
  const [isIdealAnswerOpen, setIsIdealAnswerOpen] = useState(false);
  const [isMicTestOpen, setIsMicTestOpen] = useState(false);
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  // Increment session timer
  useEffect(() => {
    let sec = 15 * 60 + 5;
    const interval = setInterval(() => {
      sec += 1;
      const m = Math.floor(sec / 60)
        .toString()
        .padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      setSessionTime(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update question index
  const loadQuestion = (index: number) => {
    const q = INTERVIEW_QUESTIONS[index % INTERVIEW_QUESTIONS.length];
    setCurrentQuestionIndex(index % INTERVIEW_QUESTIONS.length);
    setTranscript(q.initialTranscript);
    setStarProgress(q.initialStar);
    setFillerCount(q.initialFillerCount);
    setFillerDetails(q.initialFillerDetails);
    setWpm(q.initialWpm);
    setSpontaneousTip(q.spontaneousTip);
  };

  // Debounced STAR evaluation when transcript changes
  const handleUpdateTranscript = useCallback(
    async (newText: string) => {
      setTranscript(newText);

      // Estimate WPM based on word count
      const words = newText.trim().split(/\s+/).filter(Boolean).length;
      const estimatedWpm = Math.min(165, Math.max(105, 120 + Math.round(words * 0.15)));
      setWpm(estimatedWpm);

      // Evaluate via service (Server Gemini or local heuristic)
      const res = await evaluateStarOnServer(
        currentQuestion.questionText,
        newText,
        currentQuestion.role
      );

      setStarProgress(res.star);
      setSpontaneousTip(res.tip);
      setFillerCount(res.totalFillers);
      setFillerDetails(res.fillers);
    },
    [currentQuestion]
  );

  // Submit answer and view AI report
  const handleSubmitAnswer = async () => {
    const report = await generateFinalEvaluation(
      currentQuestion.questionText,
      transcript,
      currentQuestion.role,
      60
    );
    setEvaluationResult(report);
    setIsReportOpen(true);
  };

  // Reset answer
  const handleResetAnswer = () => {
    setTranscript('');
    setStarProgress({
      situation: { status: 'pending', score: 0, label: 'Belum Disebutkan', details: 'Konteks masalah belum diuraikan.' },
      task: { status: 'pending', score: 0, label: 'Belum Disebutkan', details: 'Tanggung jawab belum diuraikan.' },
      action: { status: 'pending', score: 0, label: 'Belum Disebutkan', details: 'Langkah konkret belum disampaikan.' },
      result: { status: 'pending', score: 0, label: 'Belum Disebutkan', details: 'Metrik hasil akhir belum diuraikan.' },
    });
    setFillerCount(0);
    setFillerDetails([]);
    setSpontaneousTip('Mulailah dengan menjelaskan konteks situasi (Situation) secara ringkas dan terfokus.');
  };

  // Switch role
  const handleSelectRole = (role: typeof AVAILABLE_ROLES[0]) => {
    const matchingIdx = INTERVIEW_QUESTIONS.findIndex((q) =>
      q.role.toLowerCase().includes(role.title.toLowerCase().split(' ')[0])
    );
    if (matchingIdx !== -1) {
      loadQuestion(matchingIdx);
    } else {
      loadQuestion(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navbar */}
      <Navbar
        onOpenRoleSelector={() => setIsRoleSelectorOpen(true)}
        onNavigateSection={(sec) => {
          if (sec === 'home') loadQuestion(0);
          else if (sec === 'features' || sec === 'how-it-works' || sec === 'faq') {
            setIsRoleSelectorOpen(true);
          }
        }}
      />

      {/* SubHeader / Breadcrumbs & Progress */}
      <SubHeader
        roleTitle={currentQuestion.role}
        roleCode={currentQuestion.code}
        questionNumber={currentQuestion.number}
        totalQuestions={currentQuestion.totalQuestions}
        sessionTime={sessionTime}
        onBack={() => setIsRoleSelectorOpen(true)}
        onSelectRole={() => setIsRoleSelectorOpen(true)}
      />

      {/* Main Workspace Canvas (2 Columns) */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left Main Column: Video Stream & Recording Panel (lg:col-span-8) */}
          <section className="lg:col-span-8 flex flex-col">
            {/* Recruiter Video Stream Box */}
            <RecruiterVideoBox
              questionText={currentQuestion.questionText}
              interviewerName={currentQuestion.interviewerName}
              interviewerTitle={currentQuestion.interviewerTitle}
              isMicActive={isMicActive}
              onToggleMic={() => setIsMicActive(!isMicActive)}
              onOpenSettings={() => setIsMicTestOpen(true)}
            />

            {/* Live Audio / Answer Recording Panel */}
            <LiveAnswerRecording
              transcript={transcript}
              keywords={currentQuestion.keywords}
              isMicActive={isMicActive}
              onUpdateTranscript={handleUpdateTranscript}
              onSubmitAnswer={handleSubmitAnswer}
              onResetAnswer={handleResetAnswer}
            />

            {/* Bottom Info Banner */}
            <InfoBanner onOpenAudioHelp={() => setIsMicTestOpen(true)} />
          </section>

          {/* Right Column: AI Live Evaluation Monitor (lg:col-span-4) */}
          <aside className="lg:col-span-4 flex flex-col space-y-3.5">
            {/* 1. STAR Framework Tracker */}
            <StarTracker star={starProgress} />

            {/* 2. Filler Words & Speech Speed Metrics */}
            <MetricsCards
              fillerCount={fillerCount}
              fillerDetails={fillerDetails}
              wpm={wpm}
            />

            {/* 3. Spontaneous AI Tips Card */}
            <AiTipsCard tip={spontaneousTip} />

            {/* 4. Quick Session Controls */}
            <QuickControls
              onOpenMicTest={() => setIsMicTestOpen(true)}
              onOpenIdealAnswer={() => setIsIdealAnswerOpen(true)}
              onEndSession={handleSubmitAnswer}
            />
          </aside>
        </div>
      </main>

      {/* Comprehensive Footer */}
      <Footer
        onSelectRoleByName={(name) => {
          const match = AVAILABLE_ROLES.find((r) => r.title.toLowerCase().includes(name.toLowerCase()));
          if (match) handleSelectRole(match);
        }}
        onNavigateSection={(sec) => {
          if (sec === 'home') loadQuestion(0);
          else setIsRoleSelectorOpen(true);
        }}
      />

      {/* Modals */}
      <IdealAnswerModal
        isOpen={isIdealAnswerOpen}
        question={currentQuestion}
        onClose={() => setIsIdealAnswerOpen(false)}
      />

      <MicTestModal
        isOpen={isMicTestOpen}
        onClose={() => setIsMicTestOpen(false)}
      />

      <RoleSelectorModal
        isOpen={isRoleSelectorOpen}
        currentRoleTitle={currentQuestion.role}
        onSelectRole={handleSelectRole}
        onClose={() => setIsRoleSelectorOpen(false)}
      />

      <EvaluationReportModal
        isOpen={isReportOpen}
        question={currentQuestion}
        candidateTranscript={transcript}
        evaluation={evaluationResult}
        onClose={() => setIsReportOpen(false)}
        onRetake={() => {
          setIsReportOpen(false);
          handleResetAnswer();
        }}
        onNextQuestion={() => {
          setIsReportOpen(false);
          loadQuestion(currentQuestionIndex + 1);
        }}
      />
    </div>
  );
}
