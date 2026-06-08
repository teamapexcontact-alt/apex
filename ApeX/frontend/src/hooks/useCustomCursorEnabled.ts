"use client";

import { useEffect, useState } from "react";

const FINE_POINTER = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function canUseCustomCursor(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(FINE_POINTER).matches &&
    !window.matchMedia(REDUCED_MOTION).matches
  );
}

function setCursorClass(active: boolean) {
  document.documentElement.classList.toggle("has-custom-cursor", active);
}

/**
 * Enables custom cursor only for fine pointers (mouse), after mount.
 * Disables on keyboard focus (Tab) and restores on mouse down.
 */
export function useCustomCursorEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fineMq = window.matchMedia(FINE_POINTER);
    const reducedMq = window.matchMedia(REDUCED_MOTION);

    const sync = () => {
      const ok = canUseCustomCursor();
      setEnabled(ok);
      setCursorClass(ok);
    };

    sync();
    fineMq.addEventListener("change", sync);
    reducedMq.addEventListener("change", sync);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setEnabled(false);
        setCursorClass(false);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && canUseCustomCursor()) {
        setEnabled(true);
        setCursorClass(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      fineMq.removeEventListener("change", sync);
      reducedMq.removeEventListener("change", sync);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
      setCursorClass(false);
    };
  }, []);

  return enabled;
}
