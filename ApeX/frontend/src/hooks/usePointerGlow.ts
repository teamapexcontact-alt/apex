"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UsePointerGlowOptions = {
  smoothing?: number;
  disabled?: boolean;
};

export function usePointerGlow({
  smoothing = 0.18,
  disabled = false,
}: UsePointerGlowOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const rafId = useRef(0);
  const target = useRef({ x: 50, y: 50, active: false });
  const current = useRef({ x: 50, y: 50, strength: 0 });
  const [isActive, setIsActive] = useState(false);

  const tick = useCallback(() => {
    const element = ref.current;
    if (!element || disabled) return;

    const t = target.current;
    const c = current.current;

    c.x += (t.x - c.x) * smoothing;
    c.y += (t.y - c.y) * smoothing;

    const destStrength = t.active ? 1 : 0;
    c.strength += (destStrength - c.strength) * smoothing;

    element.style.setProperty("--pointer-x", `${c.x}%`);
    element.style.setProperty("--pointer-y", `${c.y}%`);
    element.style.setProperty("--glow-strength", c.strength.toFixed(3));

    const settled =
      !t.active &&
      c.strength < 0.01 &&
      Math.abs(c.x - 50) < 0.15 &&
      Math.abs(c.y - 50) < 0.15;

    if (!settled) {
      rafId.current = requestAnimationFrame(tick);
    } else {
      rafId.current = 0;
      c.x = 50;
      c.y = 50;
      c.strength = 0;
      element.style.setProperty("--pointer-x", "50%");
      element.style.setProperty("--pointer-y", "50%");
      element.style.setProperty("--glow-strength", "0");
    }
  }, [disabled, smoothing]);

  const startLoop = useCallback(() => {
    if (disabled || rafId.current) return;
    rafId.current = requestAnimationFrame(tick);
  }, [disabled, tick]);

  const onPointerEnter = useCallback(() => {
    if (disabled) return;
    target.current.active = true;
    setIsActive(true);
    startLoop();
  }, [disabled, startLoop]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (disabled || !ref.current || event.pointerType === "touch") return;

      const rect = ref.current.getBoundingClientRect();
      target.current.x = ((event.clientX - rect.left) / rect.width) * 100;
      target.current.y = ((event.clientY - rect.top) / rect.height) * 100;
      target.current.active = true;
      startLoop();
    },
    [disabled, startLoop],
  );

  const onPointerLeave = useCallback(() => {
    if (disabled) return;
    target.current.active = false;
    setIsActive(false);
    startLoop();
  }, [disabled, startLoop]);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return {
    ref,
    isActive,
    handlers: disabled
      ? {}
      : {
          onPointerEnter,
          onPointerMove,
          onPointerLeave,
        },
  };
}
