import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Subtitles,
  Volume2,
  Settings,
  Grid,
  Zap,
  User as UserIcon,
} from 'lucide-react';
import recruiterImage from '../assets/images/recruiter_sarah_1790844101068.jpg';

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
  const [recTime, setRecTime] = useState('08:46');
  const candidateVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Increment recording timer
  useEffect(() => {
    let seconds = 8 * 60 + 46;
    const interval = setInterval(() => {
      seconds += 1;
      const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
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
          // Camera permission denied or not available; fallback to avatar preview gracefully
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

  // Read question using Web Speech Synthesis
  const handleReplayVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(questionText);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      setIsSpeakingQuestion(true);
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeakingQuestion(true);
      setTimeout(() => setIsSpeakingQuestion(false), 3000);
    }
  };

  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-md border border-slate-800 flex flex-col">
      {/* Video Canvas Container */}
      <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden select-none">
        {/* Recruiter Background Video Feed Image */}
        <img
          src={recruiterImage}
          alt={interviewerName}
          className={`w-full h-full object-cover transition-transform duration-1000 ${
            isSpeakingQuestion ? 'scale-[1.015]' : 'scale-100'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Ambient Top Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />

        {/* Top Overlay Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          {/* Recruiter Identity Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold">{interviewerName}</span>
            <span className="text-[10px] font-medium text-slate-300 px-1.5 py-0.5 rounded bg-white/10">
              {interviewerTitle}
            </span>

            {/* Speaking animated waveform indicator */}
            <div className="flex items-end gap-0.5 h-3 ml-1">
              <span className={`w-0.5 bg-sky-400 rounded-full transition-all duration-300 ${isSpeakingQuestion ? 'h-3 animate-pulse' : 'h-1.5'}`} />
              <span className={`w-0.5 bg-sky-400 rounded-full transition-all duration-300 ${isSpeakingQuestion ? 'h-2 animate-bounce' : 'h-2.5'}`} />
              <span className={`w-0.5 bg-sky-400 rounded-full transition-all duration-300 ${isSpeakingQuestion ? 'h-3 animate-pulse' : 'h-1'}`} />
            </div>
          </div>

          {/* Top Right Status (REC, HD, Speaker View) */}
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

        {/* Live Teleprompter (Bottom Left Overlay) */}
        {isCaptionsActive && (
          <div className="absolute bottom-3 left-3 right-44 sm:right-52 pointer-events-auto">
            <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/60 rounded-xl p-3.5 sm:p-4 text-white shadow-xl">
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

        {/* Candidate PiP Box (Bottom Right Overlay) */}
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

          {/* PiP Overlay Top */}
          <div className="relative z-10 flex justify-end">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isMicActive ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'
              }`}
            >
              {isMicActive ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
            </div>
          </div>

          {/* PiP Overlay Bottom */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-medium text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
            <span>Anda (Kandidat)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>

      {/* Video Toolbar Controls */}
      <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-slate-300 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mute/Unmute */}
          <button
            onClick={onToggleMic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              isMicActive
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}
          >
            {isMicActive ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
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
            {isVideoActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5 text-rose-400" />}
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

          {/* Replay Voice Button */}
          <button
            onClick={handleReplayVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              isSpeakingQuestion
                ? 'bg-sky-600 text-white border-sky-500'
                : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
            }`}
            title="Dengarkan kembali pertanyaan pewawancara"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeakingQuestion ? 'animate-pulse' : ''}`} />
            <span>{isSpeakingQuestion ? 'Memutar...' : 'Ulangi Suara'}</span>
          </button>

          {/* Audio/Video Settings */}
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
