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

  // 1. Natural Breathing & Head Movement Dynamics
  const idleBreathingY = Math.sin(frame * 0.06) * 3;
  const idleBreathingScale = 1 + Math.sin(frame * 0.06) * 0.005;

  // Speaking head dynamics (natural conversational head tilt, nod, & sway)
  const speakNodY = Math.sin(frame * 0.28) * 4.2 + Math.sin(frame * 0.14) * 2;
  const speakSwayX = Math.cos(frame * 0.1) * 2.8;
  const speakTilt = Math.sin(frame * 0.14) * 1.1;
  const speakScale = 1.02 + Math.abs(Math.sin(frame * 0.18)) * 0.012;

  const currentY = isSpeaking ? idleBreathingY + speakNodY : idleBreathingY;
  const currentX = isSpeaking ? speakSwayX : 0;
  const currentScale = isSpeaking ? speakScale : idleBreathingScale;
  const currentTilt = isSpeaking ? speakTilt : 0;

  // 2. Realistic Eye Blinking Cycle (every ~3.5 seconds = ~105 frames at 30fps)
  const blinkCycle = frame % 110;
  const isBlinking = blinkCycle >= 104 && blinkCycle <= 107;
  const blinkOpacity = isBlinking ? 0.8 : 0;

  // 3. Mouth & Jaw Speaking Movement (Phoneme oscillation)
  const phonemeHarmonic =
    Math.sin(frame * 0.65) * 0.45 +
    Math.sin(frame * 1.35) * 0.35 +
    Math.sin(frame * 2.1) * 0.2;
  const rawMouthOpen = Math.max(0, phonemeHarmonic + 0.35);
  const mouthOpen = isSpeaking ? rawMouthOpen : 0;
  const mouthHeight = interpolate(mouthOpen, [0, 1], [0, 9.5]);
  const mouthWidth = interpolate(mouthOpen, [0, 1], [18, 25]);
  const jawShiftY = interpolate(mouthOpen, [0, 1], [0, 2.5]);

  // 4. Acoustic Energy Wave expansion (when speaking)
  const wave1Progress = (frame % 36) / 36;
  const wave1Scale = 1 + wave1Progress * 0.75;
  const wave1Opacity = (1 - wave1Progress) * 0.55;

  const wave2Progress = ((frame + 18) % 36) / 36;
  const wave2Scale = 1 + wave2Progress * 0.75;
  const wave2Opacity = (1 - wave2Progress) * 0.4;

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

      {/* Dynamic Backlight Halo behind Avatar */}
      <div
        className="absolute transition-opacity duration-300 pointer-events-none"
        style={{
          top: '12%',
          left: '50%',
          width: '480px',
          height: '480px',
          transform: 'translate(-50%, -20%)',
          borderRadius: '50%',
          background: isSpeaking
            ? 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.10) 0%, transparent 60%)',
          filter: 'blur(35px)',
        }}
      />

      {/* Main Avatar Character Container with Remotion Transform Matrix */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate3d(${currentX}px, ${currentY}px, 0px) scale(${currentScale}) rotate(${currentTilt}deg)`,
          transformOrigin: 'center 42%',
          willChange: 'transform',
        }}
      >
        {/* Avatar Image */}
        <Img
          src={imageSrc}
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center 32%',
            filter: isSpeaking ? 'contrast(1.02) saturate(1.05)' : 'none',
          }}
        />

        {/* Dynamic Acoustic Soundwave Rings anchored to speaker vocal center */}
        {isSpeaking && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: '46%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="rounded-full border-2 border-sky-400"
              style={{
                width: '110px',
                height: '110px',
                transform: `scale(${wave1Scale})`,
                opacity: wave1Opacity,
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.45)',
              }}
            />
            <div
              className="rounded-full border border-sky-300 absolute top-0 left-0"
              style={{
                width: '110px',
                height: '110px',
                transform: `scale(${wave2Scale})`,
                opacity: wave2Opacity,
                boxShadow: '0 0 12px rgba(125, 211, 252, 0.35)',
              }}
            />
          </div>
        )}

        {/* Eye Blink Shadow Overlay (subtle, seamless eyelid movement) */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '34.2%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '96px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: 'rgba(38, 24, 18, 0.85)',
            opacity: blinkOpacity,
            filter: 'blur(2px)',
          }}
        />

        {/* AI Realistic Speaking Mouth / Lip Animation Overlay */}
        {isSpeaking && mouthHeight > 0.8 && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: `calc(47.2% + ${jawShiftY}px)`,
              left: '50.1%',
              transform: 'translateX(-50%)',
              width: `${mouthWidth}px`,
              height: `${mouthHeight}px`,
              borderRadius: '50%',
              backgroundColor: 'rgba(36, 15, 18, 0.75)',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.85), 0 0 4px rgba(220, 130, 130, 0.25)',
              borderTop: '1px solid rgba(160, 60, 60, 0.35)',
              filter: 'blur(0.5px)',
            }}
          >
            {/* Subtle inner teeth highlight */}
            {mouthHeight > 4 && (
              <div
                style={{
                  position: 'absolute',
                  top: '1px',
                  left: '25%',
                  width: '50%',
                  height: '2px',
                  backgroundColor: 'rgba(255, 250, 245, 0.7)',
                  borderRadius: '1px',
                  filter: 'blur(0.3px)',
                }}
              />
            )}
          </div>
        )}

        {/* Warm Facial Speaking Glow */}
        {isSpeaking && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 50% 55% at 50% 40%, rgba(254, 215, 170, 0.13) 0%, rgba(253, 186, 116, 0.04) 55%, transparent 75%)',
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

      {/* Remotion Live Engine Indicator (Discrete watermark) */}
      <div className="absolute top-14 left-4 z-10 pointer-events-none opacity-85">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-sky-400/30 text-[10px] font-mono text-sky-300">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>REMOTION VIDEO ANIMATOR • {fps}FPS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
