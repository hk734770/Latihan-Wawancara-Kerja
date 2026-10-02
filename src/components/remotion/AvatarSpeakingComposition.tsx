import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  AbsoluteFill,
} from 'remotion';

export interface AvatarSpeakingProps {
  imageSrc: string;
  name: string;
  title: string;
  isSpeaking: boolean;
  questionText: string;
}

export const AvatarSpeakingComposition: React.FC<AvatarSpeakingProps> = ({
  imageSrc,
  isSpeaking,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ==========================================================================
  // 1. NATURAL BREATHING & HEAD MOTION (ANCHORED AT SARAH'S NECK: 61.5%, 38%)
  // ==========================================================================
  const idleBreathingY = Math.sin(frame * 0.055) * 2.2;
  const idleBreathingScale = 1 + Math.sin(frame * 0.055) * 0.003;

  // Conversational head nod, tilt, and sway when speaking
  const speakNodY = Math.sin(frame * 0.26) * 3.4 + Math.sin(frame * 0.13) * 1.6;
  const speakSwayX = Math.cos(frame * 0.09) * 2.0;
  const speakTilt = Math.sin(frame * 0.12) * 0.85;
  const speakScale = 1.015 + Math.abs(Math.sin(frame * 0.16)) * 0.008;

  const currentY = isSpeaking ? idleBreathingY + speakNodY : idleBreathingY;
  const currentX = isSpeaking ? speakSwayX : 0;
  const currentScale = isSpeaking ? speakScale : idleBreathingScale;
  const currentTilt = isSpeaking ? speakTilt : 0;

  // ==========================================================================
  // 2. REALISTIC EYE BLINKING (ANCHORED EXACTLY AT SARAH'S EYES: 61.0%, 26.8%)
  // ==========================================================================
  const blinkCycle = frame % 105;
  const isBlinking = blinkCycle >= 100 && blinkCycle <= 103;
  const blinkOpacity = isBlinking ? 0.85 : 0;

  // ==========================================================================
  // 3. MULTI-SYLLABLE VISEME MOUTH CADENCE (ANCHORED AT SARAH'S LIPS: 62.0%, 37.1%)
  // ==========================================================================
  // Cadence simulating natural Indonesian/English conversational speech phonemes
  const phonemeHarmonics =
    Math.sin(frame * 0.44) * 0.45 +
    Math.sin(frame * 0.92) * 0.35 +
    Math.sin(frame * 1.65) * 0.22 +
    Math.sin(frame * 2.7) * 0.12;

  // Natural phrasing & micro-breathing pauses (every ~2.5 - 3 seconds)
  const phraseCycle = frame % 84;
  const isPause = phraseCycle >= 70 && phraseCycle <= 82;
  const pauseFactor = isPause ? 0.08 : 1.0;

  // Normalized mouth openness: 0 = closed (M, B, P), 1 = wide open vowel (A, O)
  const rawOpen = Math.max(0, Math.min(1, (phonemeHarmonics + 0.38) * pauseFactor));
  const mouthOpen = isSpeaking ? rawOpen : 0;

  // Phoneme horizontal spread (e.g. wide for E/I vs rounded for O/U)
  const lipSpread = isSpeaking
    ? Math.sin(frame * 0.32 + 0.4) * 0.25 + Math.sin(frame * 0.85) * 0.15
    : 0;

  // Computed dimensions in composition pixels (for Sarah's 1280x800 frame)
  // Mouth center in composition: X = 62.0%, Y = 37.1%
  const mouthWidthPx = interpolate(lipSpread, [-0.5, 0.5], [78, 92]);
  const mouthOpenPx = interpolate(mouthOpen, [0, 1], [2, 22]); // Height of oral cavity opening
  const jawDropPx = interpolate(mouthOpen, [0, 1], [0, 3.8]); // Lower jaw drop
  const tongueMoveY = interpolate(Math.sin(frame * 1.15), [-1, 1], [-2, 4]); // Tongue motion

  // ==========================================================================
  // 4. ACOUSTIC SOUNDWAVE RINGS (EXPANDING FROM SARAH'S MOUTH CENTER)
  // ==========================================================================
  const wave1Progress = (frame % 36) / 36;
  const wave1Scale = 1 + wave1Progress * 0.85;
  const wave1Opacity = (1 - wave1Progress) * 0.6;

  const wave2Progress = ((frame + 18) % 36) / 36;
  const wave2Scale = 1 + wave2Progress * 0.85;
  const wave2Opacity = (1 - wave2Progress) * 0.45;

  return (
    <AbsoluteFill className="bg-slate-950 overflow-hidden font-sans select-none">
      {/* Background Studio Ambient Lighting */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, #1e293b 0%, #0f172a 50%, #020617 100%)',
        }}
      />

      {/* Dynamic Backlight Halo behind Avatar (Aligned behind Sarah at 61.5%) */}
      <div
        className="absolute transition-opacity duration-300 pointer-events-none"
        style={{
          top: '25%',
          left: '61.5%',
          width: '520px',
          height: '520px',
          transform: 'translate(-50%, -20%)',
          borderRadius: '50%',
          background: isSpeaking
            ? 'radial-gradient(circle, rgba(14, 165, 233, 0.28) 0%, rgba(56, 189, 248, 0.10) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Main Avatar Character Container with Head Dynamics Anchored to Sarah's Neck */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate3d(${currentX}px, ${currentY}px, 0px) scale(${currentScale}) rotate(${currentTilt}deg)`,
          transformOrigin: '61.5% 38%',
          willChange: 'transform',
        }}
      >
        {/* Avatar Image */}
        <Img
          src={imageSrc}
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center 32%',
            filter: isSpeaking ? 'contrast(1.02) saturate(1.04)' : 'none',
          }}
        />

        {/* Dynamic Acoustic Soundwave Rings (Anchored precisely to Sarah's vocal mouth center) */}
        {isSpeaking && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: '37.1%',
              left: '62.0%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="rounded-full border-2 border-sky-400"
              style={{
                width: '120px',
                height: '120px',
                transform: `scale(${wave1Scale})`,
                opacity: wave1Opacity,
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.45)',
              }}
            />
            <div
              className="rounded-full border border-sky-300 absolute top-0 left-0"
              style={{
                width: '120px',
                height: '120px',
                transform: `scale(${wave2Scale})`,
                opacity: wave2Opacity,
                boxShadow: '0 0 12px rgba(125, 211, 252, 0.35)',
              }}
            />
          </div>
        )}

        {/* Eye Blink Shadow Overlay (Anchored precisely on Sarah's eyes at 61.0%, 26.8%) */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '26.8%',
            left: '61.0%',
            transform: 'translate(-50%, -50%)',
            width: '98px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: 'rgba(38, 24, 18, 0.88)',
            opacity: blinkOpacity,
            filter: 'blur(2.2px)',
            transition: 'opacity 0.05s ease-out',
          }}
        />

        {/* ================================================================== */}
        {/* HIGH-PRECISION REALISTIC SPEAKING MOUTH ANIMATION LAYER            */}
        {/* Placed at Sarah's exact mouth coordinates: X: 62.0%, Y: 37.1%     */}
        {/* ================================================================== */}
        {isSpeaking && (
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              top: `calc(37.1% + ${jawDropPx * 0.4}px)`,
              left: '62.0%',
              transform: 'translate(-50%, -50%)',
              width: `${mouthWidthPx}px`,
              height: `${38 + jawDropPx}px`,
              filter: 'drop-shadow(0 2px 4px rgba(40, 15, 12, 0.35))',
            }}
          >
            {/* SVG Anatomical Viseme Mouth Model */}
            <svg
              viewBox="0 0 100 50"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Oral Cavity Dark Interior Gradient */}
                <radialGradient id="oralCavityGrad" cx="50%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#140406" />
                  <stop offset="65%" stopColor="#22070a" />
                  <stop offset="100%" stopColor="#350e12" />
                </radialGradient>

                {/* Upper Teeth Gradient */}
                <linearGradient id="upperTeethGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fdf9f4" />
                  <stop offset="80%" stopColor="#ede3d5" />
                  <stop offset="100%" stopColor="#c5b39f" />
                </linearGradient>

                {/* Lower Teeth Gradient */}
                <linearGradient id="lowerTeethGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#faf3ec" />
                  <stop offset="85%" stopColor="#e3d6c6" />
                  <stop offset="100%" stopColor="#a8927e" />
                </linearGradient>

                {/* Tongue Gradient */}
                <radialGradient id="tongueGrad" cx="50%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="#d3626c" />
                  <stop offset="60%" stopColor="#ba4a53" />
                  <stop offset="100%" stopColor="#8d2e35" />
                </radialGradient>

                {/* Upper Lip Gradient (Matches Sarah's natural lipstick tone) */}
                <linearGradient id="upperLipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a94e4d" />
                  <stop offset="45%" stopColor="#be5d5c" />
                  <stop offset="100%" stopColor="#853637" />
                </linearGradient>

                {/* Lower Lip Gradient */}
                <linearGradient id="lowerLipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#943b3c" />
                  <stop offset="35%" stopColor="#c76564" />
                  <stop offset="80%" stopColor="#ad504f" />
                  <stop offset="100%" stopColor="#672123" />
                </linearGradient>

                {/* Soft Lip Highlight (Satin Sheen) */}
                <linearGradient id="lipShineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                  <stop offset="50%" stopColor="rgba(255, 245, 245, 0.45)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                </linearGradient>

                {/* Soft Edge Blending Filter */}
                <filter id="softLipEdge" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="0.45" />
                </filter>
              </defs>

              {/* 1. DARK ORAL CAVITY (INSIDE MOUTH) */}
              {mouthOpenPx > 2 && (
                <path
                  d={`M 14,23 Q 50,${18 + mouthOpenPx * 0.15} 86,23 Q 50,${
                    24 + mouthOpenPx
                  } 14,23 Z`}
                  fill="url(#oralCavityGrad)"
                />
              )}

              {/* 2. TONGUE (MOVING DYNAMICALLY INSIDE CAVITY) */}
              {mouthOpenPx > 6 && (
                <path
                  d={`M 30,${24 + mouthOpenPx * 0.75} Q 50,${
                    18 + mouthOpenPx * 0.45 + tongueMoveY
                  } 70,${24 + mouthOpenPx * 0.75} Q 50,${25 + mouthOpenPx} 30,${
                    24 + mouthOpenPx * 0.75
                  } Z`}
                  fill="url(#tongueGrad)"
                />
              )}

              {/* 3. UPPER TEETH ROW (NATURAL CURVED INCISORS) */}
              {mouthOpenPx > 3 && (
                <path
                  d={`M 22,23 Q 50,${22.5 + Math.min(mouthOpenPx * 0.4, 5.5)} 78,23 Q 75,21 50,21 Q 25,21 22,23 Z`}
                  fill="url(#upperTeethGrad)"
                  filter="drop-shadow(0 1px 1px rgba(0,0,0,0.45))"
                />
              )}

              {/* 4. LOWER TEETH ROW (RISES AND LOWERS WITH JAW CADENCE) */}
              {mouthOpenPx > 11 && (
                <path
                  d={`M 32,${23 + mouthOpenPx * 0.78} Q 50,${
                    22.5 + mouthOpenPx * 0.65
                  } 68,${23 + mouthOpenPx * 0.78} Q 50,${24 + mouthOpenPx * 0.85} 32,${
                    23 + mouthOpenPx * 0.78
                  } Z`}
                  fill="url(#lowerTeethGrad)"
                />
              )}

              {/* 5. UPPER LIP WITH CUPID'S BOW */}
              <path
                d="M 12,23 Q 32,15 45,18 Q 50,20 55,18 Q 68,15 88,23 Q 70,18.5 50,22 Q 30,18.5 12,23 Z"
                fill="url(#upperLipGrad)"
                filter="url(#softLipEdge)"
              />

              {/* Upper Lip Subtle Specular Highlight */}
              <path
                d="M 36,17.5 Q 45,18.5 50,19.5 Q 55,18.5 64,17.5"
                stroke="rgba(255, 230, 230, 0.4)"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
              />

              {/* 6. LOWER LIP (FLESHY, DYNAMICALLY DROPS AND CLOSES) */}
              <path
                d={`M 12,23 Q 32,${20 + mouthOpenPx * 0.55} 50,${
                  22 + mouthOpenPx * 0.65
                } Q 68,${20 + mouthOpenPx * 0.55} 88,23 Q 70,${
                  30 + mouthOpenPx * 0.95
                } 50,${32 + mouthOpenPx * 0.95} Q 30,${30 + mouthOpenPx * 0.95} 12,23 Z`}
                fill="url(#lowerLipGrad)"
                filter="url(#softLipEdge)"
              />

              {/* Lower Lip Satin Highlight Gloss */}
              <ellipse
                cx="50"
                cy={25 + mouthOpenPx * 0.75}
                rx="18"
                ry={2.5 + mouthOpenPx * 0.08}
                fill="url(#lipShineGrad)"
                filter="blur(0.8px)"
              />

              {/* Lip Commissures (Corner Crease Shadows) */}
              <circle cx="13" cy="23" r="2.2" fill="#581a1c" filter="blur(0.8px)" />
              <circle cx="87" cy="23" r="2.2" fill="#581a1c" filter="blur(0.8px)" />
            </svg>
          </div>
        )}

        {/* Subtle Chin Muscle Movement (Depression shadow under lower lip when talking) */}
        {isSpeaking && mouthOpenPx > 7 && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: `calc(40.6% + ${jawDropPx * 0.7}px)`,
              left: '62.0%',
              transform: 'translateX(-50%)',
              width: '54px',
              height: '8px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(70, 30, 25, 0.22) 0%, transparent 75%)',
              filter: 'blur(2px)',
            }}
          />
        )}

        {/* Warm Facial Speaking Glow */}
        {isSpeaking && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 45% 50% at 61.5% 36%, rgba(254, 215, 170, 0.12) 0%, rgba(253, 186, 116, 0.03) 50%, transparent 75%)',
            }}
          />
        )}
      </div>

      {/* Cinematic Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(2, 6, 23, 0.65) 0%, transparent 22%, transparent 70%, rgba(2, 6, 23, 0.85) 100%)',
        }}
      />

      {/* Remotion Live Engine Indicator */}
      <div className="absolute top-14 left-4 z-10 pointer-events-none opacity-85">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-sky-400/30 text-[10px] font-mono text-sky-300">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-sky-400'
            }`}
          />
          <span>
            {isSpeaking ? 'AI RECRUITER SPEAKING • LIP-SYNC ACTIVE' : `REMOTION AVATAR • ${fps}FPS`}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
