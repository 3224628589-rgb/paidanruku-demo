import {Composition} from 'remotion';
import {ThreeTabSwitch} from './ThreeTabSwitch';

export const RemotionRoot = () => {
  return (
    <Composition
      id="ThreeTabSwitch"
      component={ThreeTabSwitch}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
