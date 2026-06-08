/** Page-load animations (Hero). Scroll reveals use `@/components/ui/Reveal`. */
import type { Variants } from "framer-motion";
import { EASE } from "./constants";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: i * 0.12,
      ease: EASE,
    },
  }),
};

export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

export const revealViewport = {
  once: true,
  margin: "-80px" as const,
  amount: 0.2 as const,
};

export function pickFadeVariant(reducedMotion: boolean): Variants {
  return reducedMotion ? fadeUpReduced : fadeUp;
}
