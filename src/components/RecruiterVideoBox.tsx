import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Subtitles,
  Volume2,
  VolumeX,
  Settings,
  Grid,
  Zap,
  User as UserIcon,
} from 'lucide-react';
import recruiterImage from '../assets/images/recruiter_sarah_1790844101068.jpg';
import { RemotionAvatarPlayer } from './remotion/RemotionAvatarPlayer';

interface RecruiterVideoBoxProps {
  questionText: string;
  interviewerName: string;
  interviewerTitle: string;
  isMicActive: boolean;
  onToggleMic: () => void;
  onOpenSettings: () => void;
}

export const RecruiterVideoBox: React.FC<RecruiterVideoBoxProps> = ({
  questionText,
  interviewerName,
  interviewerTitle,
  isMicActive,
  onToggleMic,
  onOpenSettings,
}) => {
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [isCaptionsActive, setIsCaptionsActive] = useState(true);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recTime, setRecTime] = useState('08:46');
  const candidateVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Increment recording timer
  useEffect(() => {
    let seconds = 8 * 60 + 46;
    const interval = setInterval(() => {
      seconds += 1;
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      setRecTime(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web camera handle for candidate PiP
  useEffect(() => {
    if (isVideoActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (candidateVideoRef.current) {
            candidateVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera permission denied — graceful fallback
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    }
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isVideoActive]);

  // Core speak function
  const speakQuestion = useCallback((text: string, muted: boolean) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeakingQuestion(true);
      const wordCount = text.trim().split(/\s+/).length;
      setTimeout(() => setIsSpeakingQuestion(false), Math.max(3000, wordCount * 380));
      return;
    }
    window.speechSynthesis.cancel();
    if (muted) {
      // Animation only, no audio
      setIsSpeakingQuestion(true);
      const wordCount = text.trim().split(/\s+/).length;
      const durationMs = Math.max(3000, wordCount * 380);
      setTimeout(() => setIsSpeakingQuestion(false), durationMs);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;
    utteranceRef.current = utterance;
    setIsSpeakingQuestion(true);
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Auto-speak when question text changes
  useEffect(() => {
    if (!questionText) return;
    const timer = setTimeout(() => {
      speakQuestion(questionText, isMuted);
    }, 900);
    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
    };
  }, [questionText]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleSpeaking = useCallback(() => {
    if (isSpeakingQuestion) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
    } else {
      speakQuestion(questionText, isMuted);
    }
  }, [isSpeakingQuestion, questionText, isMuted, speakQuestion]);

  const handleReplayVoice = () => {
    speakQuestion(questionText, isMuted);
  };

  const handleToggleMute = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeakingQuestion(false);
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-md border border-slate-800 flex flex-col">
      {/* Video Canvas Container */}
      <div 
        onClick={handleToggleSpeaking}
        className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden select-none cursor-pointer group"
        title="Klik video untuk memutar / menghentikan suara & animasi mulut pewawancara"
      >
        {/* Remotion AI Video Animator Player */}
        <RemotionAvatarPlayer
          imageSrc={recruiterImage}
          name={interviewerName}
          title={interviewerTitle}
          isSpeaking={isSpeakingQuestion}
          questionText={questionText}
        />

        {/* Top Overlay Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          {/* Recruiter Identity Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-sm">
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isSpeakingQuestion ? 'bg-sky-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="text-xs font-semibold">{interviewerName}</span>
            <span className="text-[10px] font-medium text-slate-300 px-1.5 py-0.5 rounded bg-white/10">
              {interviewerTitle}
            </span>

            {/* 5-bar voice waveform visualiser */}
            <div className="flex items-end gap-[2px] h-6 ml-1">
              {isSpeakingQuestion ? (
                <>
                  <span className="speaking-bar1 w-[3px] bg-sky-400 rounded-full" />
                  <span className="speaking-bar2 w-[3px] bg-sky-400 rounded-full" />
                  <span className="speaking-bar3 w-[3px] bg-sky-300 rounded-full" />
                  <span className="speaking-bar4 w-[3px] bg-sky-400 rounded-full" />
                  <span className="speaking-bar5 w-[3px] bg-sky-400 rounded-full" />
                </>
              ) : (
                <>
                  <span className="w-[3px] h-[4px] bg-slate-500 rounded-full" />
                  <span className="w-[3px] h-[6px] bg-slate-500 rounded-full" />
                  <span className="w-[3px] h-[4px] bg-slate-500 rounded-full" />
                  <span className="w-[3px] h-[5px] bg-slate-500 rounded-full" />
                  <span className="w-[3px] h-[3px] bg-slate-500 rounded-full" />
                </>
              )}
            </div>
          </div>

          {/* Top Right Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-white">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              <span className="font-semibold tracking-wide">REC {recTime}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-black/50 border border-white/15 text-[10px] font-bold font-mono text-slate-200">
              HD
            </span>
            <button
              onClick={() => alert('Mode Tampilan: Speaker View aktif')}
              className="flex items-center gap-1 px-2 py-1 rounded bg-black/50 border border-white/15 text-[11px] font-medium text-slate-200 hover:bg-black/70 transition-colors"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Speaker View</span>
            </button>
          </div>
        </div>

        {/* "Sedang Bertanya..." badge while speaking */}
        {isSpeakingQuestion && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-600/80 backdrop-blur-sm border border-sky-400/50 text-white text-[11px] font-semibold shadow-lg pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            Sedang Bertanya...
          </div>
        )}

        {/* Live Teleprompter */}
        {isCaptionsActive && (
          <div className="absolute bottom-3 left-3 right-44 sm:right-52 pointer-events-auto">
            <div
              className={`bg-slate-950/85 backdrop-blur-md border rounded-xl p-3.5 sm:p-4 text-white shadow-xl transition-all duration-300 ${
                isSpeakingQuestion ? 'border-sky-500/50' : 'border-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-400 uppercase tracking-wider mb-1.5">
                <Subtitles className="w-3.5 h-3.5" />
                <span>PERTANYAAN BERJALAN (LIVE TELEPROMPTER)</span>
              </div>
              <p className="text-xs sm:text-sm font-normal text-slate-100 leading-relaxed">
                &ldquo;{questionText}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Candidate PiP Box */}
        <div className="absolute bottom-3 right-3 w-36 sm:w-44 h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-900/90 backdrop-blur border border-slate-700/80 shadow-2xl flex flex-col justify-between p-2 pointer-events-auto">
          {isVideoActive ? (
            <video
              ref={candidateVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover -scale-x-100"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <UserIcon className="w-5 h-5" />
              </div>
            </div>
          )}
          <div className="relative z-10 flex justify-end">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isMicActive ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'
              }`}
            >
              {isMicActive ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between text-[11px] font-medium text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
            <span>Anda (Kandidat)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>

      {/* Video Toolbar Controls */}
      <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-slate-300 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mute/Unmute Mic */}
          <button
            onClick={onToggleMic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              isMicActive
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}
          >
            {isMicActive ? (
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <MicOff className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>{isMicActive ? 'Mute' : 'Unmute'}</span>
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoActive(!isVideoActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              isVideoActive
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}
          >
            {isVideoActive ? (
              <Video className="w-3.5 h-3.5" />
            ) : (
              <VideoOff className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>{isVideoActive ? 'Stop Video' : 'Start Video'}</span>
          </button>

          {/* Captions Toggle */}
          <button
            onClick={() => setIsCaptionsActive(!isCaptionsActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              isCaptionsActive
                ? 'bg-sky-950/80 border-sky-800 text-sky-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>{isCaptionsActive ? 'CC Aktif' : 'CC Nonaktif'}</span>
          </button>

          {/* Replay Voice & Mouth Lip-Sync Toggle */}
          <button
            onClick={handleToggleSpeaking}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all shadow-sm ${
              isSpeakingQuestion
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white border-sky-400 ring-2 ring-sky-500/30'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white'
            }`}
            title="Dengarkan suara & lihat animasi gerakan mulut pewawancara"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeakingQuestion ? 'animate-bounce text-sky-200' : 'text-sky-400'}`} />
            <span>{isSpeakingQuestion ? 'Sedang Bicara...' : 'Mulai Bicara (Tes Mulut)'}</span>
          </button>

          {/* Mute Interviewer Audio */}
          <button
            onClick={handleToggleMute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
            title={isMuted ? 'Aktifkan suara pewawancara' : 'Matikan suara pewawancara'}
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>{isMuted ? 'Suara Mati' : 'Senyap'}</span>
          </button>

          {/* A/V Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Pengaturan Perangkat Audio & Video"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Gemini Latency Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
          <Zap className="w-3 h-3 text-sky-400" />
          <span>2.1s Gemini Latency</span>
        </div>
      </div>
    </div>
  );
};
