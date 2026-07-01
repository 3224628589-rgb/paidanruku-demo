import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

type ScreenName = 'photo' | 'scan' | 'approve';

type ScreenSpec = {
  name: ScreenName;
  src: string;
  width: number;
  height: number;
  left: number;
  top: number;
  scale: number;
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const screens: Record<ScreenName, ScreenSpec> = {
  photo: {
    name: 'photo',
    src: 'screens/photo-tight.png',
    width: 706,
    height: 938,
    left: 607,
    top: 71,
    scale: 1,
  },
  scan: {
    name: 'scan',
    src: 'screens/scan-tight.png',
    width: 720,
    height: 960,
    left: 607,
    top: 71,
    scale: 0.981,
  },
  approve: {
    name: 'approve',
    src: 'screens/approve-tight.png',
    width: 720,
    height: 926,
    left: 607,
    top: 71,
    scale: 0.981,
  },
};

const fade = (frame: number, enterStart: number, enterEnd: number, exitStart: number, exitEnd: number) => {
  const enter = interpolate(frame, [enterStart, enterEnd], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const exit = interpolate(frame, [exitStart, exitEnd], [0, 1], {
    ...clamp,
    easing: ease,
  });
  return enter - exit;
};

export const ThreeTabSwitch = () => {
  const frame = useCurrentFrame();
  const photoOpacity = fade(frame, 0, 12, 34, 56);
  const scanOpacity = fade(frame, 34, 56, 86, 110);
  const approveOpacity = fade(frame, 86, 110, 160, 170);

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(135deg, #e8eefc 0%, #eff5ff 42%, #dceff0 100%)',
        overflow: 'hidden',
      }}
    >
      <ScreenLayer spec={screens.photo} opacity={photoOpacity} frame={frame} phaseStart={0} />
      <ScreenLayer spec={screens.scan} opacity={scanOpacity} frame={frame} phaseStart={34} />
      <ScreenLayer spec={screens.approve} opacity={approveOpacity} frame={frame} phaseStart={86} />

      <TapGesture x={960} y={123} start={24} end={48} />
      <TapGesture x={1184} y={123} start={78} end={102} />
    </AbsoluteFill>
  );
};

const ScreenLayer: React.FC<{
  spec: ScreenSpec;
  opacity: number;
  frame: number;
  phaseStart: number;
}> = ({spec, opacity, frame, phaseStart}) => {
  const local = frame - phaseStart;
  const settle = interpolate(local, [0, 24], [18, 0], {
    ...clamp,
    easing: ease,
  });
  const blur = interpolate(opacity, [0, 1], [3, 0], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left: spec.left,
        top: spec.top,
        width: spec.width,
        height: spec.height,
        opacity,
        overflow: 'hidden',
        borderRadius: 28,
        transform: `translateX(${settle}px) scale(${spec.scale})`,
        transformOrigin: 'top left',
        filter: `blur(${blur}px)`,
      }}
    >
      <Img
        src={staticFile(spec.src)}
        style={{
          width: spec.width,
          height: spec.height,
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
};

const TapGesture: React.FC<{
  x: number;
  y: number;
  start: number;
  end: number;
}> = ({x, y, start, end}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const active = progress > 0 && progress < 1;
  const press = interpolate(progress, [0, 0.35, 1], [0, 1, 0], clamp);
  const ripple = interpolate(progress, [0.15, 1], [0, 1], clamp);

  if (!active) {
    return null;
  }

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - 12,
          top: y - 12,
          width: 24,
          height: 24,
          borderRadius: 999,
          background: 'rgba(72, 101, 244, .95)',
          boxShadow: '0 8px 22px rgba(72, 101, 244, .32)',
          transform: `scale(${1 + press * 0.25})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - 38,
          top: y - 38,
          width: 76,
          height: 76,
          borderRadius: 999,
          border: '4px solid rgba(72, 101, 244, .42)',
          opacity: 1 - ripple,
          transform: `scale(${0.4 + ripple * 1.1})`,
        }}
      />
    </>
  );
};
