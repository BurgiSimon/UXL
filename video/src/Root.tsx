import { Composition } from "remotion";
import { DURATION, VoxmereCase } from "./VoxmereCase";

export const RemotionRoot: React.FC = () => (
  <Composition id="VoxmereCase" component={VoxmereCase} durationInFrames={DURATION} fps={30} width={1920} height={1080} />
);
