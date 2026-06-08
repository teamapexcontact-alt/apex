"use client";

import { useSyncExternalStore } from "react";
import type { EffectContext } from "@/lib/effects/types";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeCoarsePointer(callback: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function subscribeLowPower(callback: () => void) {
  const mq = window.matchMedia("(max-width: 768px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getLowPower() {
  return window.matchMedia("(max-width: 768px)").matches;
}

/** SSR-safe capability flags for gating optional effects */
export function useEffectCapabilities(): EffectContext {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => true
  );
  const coarsePointer = useSyncExternalStore(
    subscribeCoarsePointer,
    getCoarsePointer,
    () => true
  );
  const lowPower = useSyncExternalStore(
    subscribeLowPower,
    getLowPower,
    () => true
  );

  return { reducedMotion, coarsePointer, lowPower };
}
