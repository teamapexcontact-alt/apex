import type { ComponentType } from "react";

export type EffectContext = {
  reducedMotion: boolean;
  coarsePointer: boolean;
  lowPower: boolean;
};

export type EffectDefinition = {
  id: string;
  /** When false, the effect is not loaded or rendered */
  enabled: (ctx: EffectContext) => boolean;
  /** Dynamic import — keeps optional effects out of the main bundle */
  load: () => Promise<{ default: ComponentType }>;
};
