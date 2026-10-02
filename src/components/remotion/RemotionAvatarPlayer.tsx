import React from 'react';
import { Player } from '@remotion/player';
import {
  AvatarSpeakingComposition,
  AvatarSpeakingProps,
} from './AvatarSpeakingComposition';

interface RemotionAvatarPlayerProps {
  imageSrc: string;
  name: string;
  title: string;
  isSpeaking: boolean;
  questionText: string;
  className?: string;
}

export const RemotionAvatarPlayer: React.FC<RemotionAvatarPlayerProps> = ({
  imageSrc,
  name,
  title,
  isSpeaking,
  questionText,
  className = 'w-full h-full',
}) => {
  const inputProps: AvatarSpeakingProps = {
    imageSrc,
    name,
    title,
    isSpeaking,
    questionText,
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <Player
        component={AvatarSpeakingComposition}
        inputProps={inputProps}
        durationInFrames={360}
        compositionWidth={1280}
        compositionHeight={800}
        fps={30}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        autoPlay
        loop
        controls={false}
        acknowledgeRemotionLicense
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
      />
    </div>
  );
};
