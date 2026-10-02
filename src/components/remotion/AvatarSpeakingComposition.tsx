import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  AbsoluteFill,
} from 'remotion';
import mouthUpperImg from '../../assets/images/avatar_mouth_upper.png';
import mouthLowerImg from '../../assets/images/avatar_mouth_lower.png';
import mouthInteriorImg from '../../assets/images/avatar_mouth_interior.png';

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
  // 1. NATURAL BREATHING & HEAD MOTION (CENTERED AT AVATAR NECK: 49.0%, 48.0%)
  // ==========================================================================
  const idleBreathingY = Math.sin(frame * 0.055) * 2.2;
  const idleBreathingScale = 1 + Math.sin(frame * 0.055) * 0.003;

  // Conversational head nod, tilt, and sway when speaking
  const speakNodY = Math.sin(frame * 0.26) * 3.0 + Math.sin(frame * 0.13) * 1.4;
  const speakSwayX = Math.cos(frame * 0.09) * 1.8;
  const speakTilt = Math.sin(frame * 0.12) * 0.75;
  const speakScale = 1.012 + Math.abs(Math.sin(frame * 0.16)) * 0.007;

  const currentY = isSpeaking ? idleBreathingY + speakNodY : idleBreathingY;
  const currentX = isSpeaking ? speakSwayX : 0;
  const currentScale = isSpeaking ? speakScale : idleBreathingScale;
  const currentTilt = isSpeaking ? speakTilt : 0;

  // ==========================================================================
  // 2. REALISTIC EYE BLINKING (CENTERED AT AVATAR EYES: 48.8%, 30.3%)
  // ==========================================================================
  const blinkCycle = frame % 105;
  const isBlinking = blinkCycle >= 100 && blinkCycle <= 103;
  const blinkOpacity = isBlinking ? 0.88 : 0;

  // ==========================================================================
  // 3. NATURAL DUAL-LIP CADENCE (UPPER & LOWER LIP ARTICULATION)
  // ==========================================================================
  // Multi-frequency rhythm simulating real Indonesian/English speech syllables
  // Alternating between vowels (open mouth) and consonants (closed/narrow mouth)
  const syl1 = Math.sin(frame * 0.44); // ~4.2 syllables per second
  const syl2 = Math.sin(frame * 0.88);
  const syl3 = Math.sin(frame * 1.55);
  const cadenceWave = syl1 * 0.5 + syl2 * 0.35 + syl3 * 0.15;

  // Conversational breathing pauses (every ~2.5 - 3 seconds, mouth rests briefly)
  const breathCycle = frame % 85;
  const isPause = breathCycle >= 70 && breathCycle <= 82;
  const pauseFactor = isPause ? 0.12 : 1.0;

  // Normalized mouth openness:
  // 0 = tightly closed (bilabials M, B, P)
  // 0.35 = partially open (consonants S, T, D, N, L)
  // 0.7 - 1.0 = wide open vowels (A, O, E, I, U)
  const rawOpen = Math.max(0, Math.min(1, (cadenceWave + 0.38) * pauseFactor));
  const mouthOpen = isSpeaking ? rawOpen : 0.65;

  // Lateral spread/pucker (O/U vs E/I)
  const lipSpread = isSpeaking
    ? Math.sin(frame * 0.3 + 0.3) * 0.25 + Math.sin(frame * 0.8) * 0.15
    : 0;
  const lipWidthScale = 1 + lipSpread * 0.04;

  // --------------------------------------------------------------------------
  // BIBIR ATAS (UPPER LIP) DYNAMICS:
  // Subtly elevates on open vowels and depresses on closed consonants (M, B, P)
  // --------------------------------------------------------------------------
  const upperLipY = isSpeaking
    ? interpolate(mouthOpen, [0, 0.4, 1], [1.8, 0.3, -2.2]) + Math.sin(frame * 0.9) * 0.3
    : 0;

  // --------------------------------------------------------------------------
  // BIBIR BAWAH (LOWER LIP) DYNAMICS:
  // Primary articulator: moves UP (-10px) to meet upper lip on closures (M, P, B),
  // and moves DOWN (+5px) to open the oral cavity on open vowels (A, O, U)
  // --------------------------------------------------------------------------
  const lowerLipY = isSpeaking
    ? interpolate(mouthOpen, [0, 0.35, 1], [-11.0, -3.5, 4.8])
    : 0;

  // Teeth micro-shift
  const teethY = isSpeaking ? interpolate(mouthOpen, [0, 1], [-0.4, 0.6]) : 0;

  // ==========================================================================
  // 4. ACOUSTIC SOUNDWAVE RINGS
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

      {/* Dynamic Backlight Halo behind Avatar (Aligned centered behind Sarah at 50%) */}
      <div
        className="absolute transition-opacity duration-300 pointer-events-none"
        style={{
          top: '25%',
          left: '50.0%',
          width: '540px',
          height: '540px',
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
          transformOrigin: '49.0% 48.0%',
          willChange: 'transform',
        }}
      >
        {/* Base Avatar Image (Centered AI Recruiter Portrait) */}
        <Img
          src={imageSrc}
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center 32%',
            filter: isSpeaking ? 'contrast(1.02) saturate(1.04)' : 'none',
          }}
        />

        {/* Acoustic Soundwave Rings (Anchored to Sarah's mouth) */}
        {isSpeaking && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: '45.0%',
              left: '49.4%',
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

        {/* Eye Blink Shadow Overlay (Anchored on Sarah's eyes at 48.8%, 30.3%) */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '30.3%',
            left: '48.8%',
            transform: 'translate(-50%, -50%)',
            width: '108px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: 'rgba(38, 24, 18, 0.90)',
            opacity: blinkOpacity,
            filter: 'blur(2.2px)',
            transition: 'opacity 0.05s ease-out',
          }}
        />

        {/* ================================================================== */}
        {/* REALISTIC DUAL-LIP SPEAKING ARTICULATOR (UPPER & LOWER LIPS)       */}
        {/* Perfectly aligned over centered Sarah avatar lips                  */}
        {/* ================================================================== */}
        {isSpeaking && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: '42.84%',
              top: '40.36%',
              width: '166.67px',
              height: '104.16px',
              transformOrigin: '50% 36%',
              transform: `scaleX(${lipWidthScale})`,
              willChange: 'transform',
            }}
          >
            {/* 1. Interior Teeth & Oral Cavity Layer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `translateY(${teethY}px)`,
              }}
            >
              {/* Deep Oral Depth Shadow when mouth opens wide */}
              {mouthOpen > 0.4 && (
                <div
                  className="absolute"
                  style={{
                    left: '26%',
                    top: '32%',
                    width: '48%',
                    height: '24%',
                    borderRadius: '50%',
                    backgroundColor: '#1b0709',
                    filter: 'blur(1.5px)',
                    opacity: interpolate(mouthOpen, [0.4, 1], [0, 0.85]),
                  }}
                />
              )}
              {/* Teeth Texture */}
              <Img
                src={mouthInteriorImg}
                className="w-full h-full object-contain pointer-events-none"
                style={{
                  filter: 'contrast(1.02)',
                }}
              />
            </div>

            {/* 2. BIBIR BAWAH & DAGU (LOWER LIP & CHIN) LAYER                     */}
            {/* Moves UP to close against upper lip, DOWN to open oral cavity      */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `translateY(${lowerLipY}px)`,
                transformOrigin: '50% 65%',
                willChange: 'transform',
                transition: 'transform 0.03s linear',
              }}
            >
              <Img
                src={mouthLowerImg}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            {/* 3. BIBIR ATAS & PHILTRUM (UPPER LIP) LAYER                         */}
            {/* Moves naturally: depresses on M/P/B closures, lifts on vowels       */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `translateY(${upperLipY}px)`,
                transformOrigin: '50% 25%',
                willChange: 'transform',
                transition: 'transform 0.03s linear',
              }}
            >
              <Img
                src={mouthUpperImg}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          </div>
        )}

        {/* Warm Facial Speaking Glow */}
        {isSpeaking && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 45% 50% at 49.4% 44%, rgba(254, 215, 170, 0.10) 0%, rgba(253, 186, 116, 0.02) 50%, transparent 75%)',
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
            {isSpeaking ? 'AI DUAL-LIP AVATAR • SPEAKING' : `REMOTION AVATAR • ${fps}FPS`}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
