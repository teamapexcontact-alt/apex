export const REVEAL_OBSERVER_OPTIONS = {
  rootMargin: "-80px 0px",
  threshold: 0.2,
} as const satisfies IntersectionObserverInit;

export const REVEAL_TIMING = {
  duration: 0.9,
  stagger: 0.12,
  staggerChildren: 0.1,
  delayChildren: 0.15,
  reducedDuration: 0.2,
} as const;
