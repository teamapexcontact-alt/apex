import type { EffectDefinition } from "./types";

/**
 * Optional visual effects registry — lazy-loadable, capability-gated.
 *
 * Usage (future):
 * ```ts
 * const ctx = useEffectCapabilities();
 * const defs = effectRegistry.filter((e) => e.enabled(ctx));
 * const { default: Effect } = await defs[0].load();
 * ```
 *
 * Do not register full-page WebGL canvases here.
 */
export const effectRegistry: EffectDefinition[] = [
  // Example: hero floating orbs are inlined in Hero.tsx with useEffectCapabilities.
  // Add new entries when extracting section-specific effects.
];
