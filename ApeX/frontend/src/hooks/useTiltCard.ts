"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TiltState = {
  pointerX: number;
  pointerY: number;
  rotateX: number;
  rotateY: number;
};

export type UseTiltCardOptions = {
  maxTilt?: number;
  smoothing?: number;
  disabled?: boolean;
};

export function useTiltCard({
  maxTilt = 10,
  smoothing = 0.12,
  disabled = false,
}: UseTiltCardOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const rafId = useRef(0);
  const target = useRef({ pointerX: 0.5, pointerY: 0.5, active: false });
  const state = useRef<TiltState>({
    pointerX: 0.5,
    pointerY: 0.5,
    rotateX: 0,
    rotateY: 0,
  });
  const [isActive, setIsActive] = useState(false);

  const applyTransform = useCallback(() => {
    const element = ref.current;
    if (!element || disabled) return;

    const t = target.current;
    const s = state.current;

    s.pointerX += (t.pointerX - s.pointerX) * smoothing;
    s.pointerY += (t.pointerY - s.pointerY) * smoothing;

    const destRotateX = t.active ? (s.pointerY - 0.5) * -maxTilt * 2 : 0;
    const destRotateY = t.active ? (s.pointerX - 0.5) * maxTilt * 2 : 0;

    s.rotateX += (destRotateX - s.rotateX) * smoothing;
    s.rotateY += (destRotateY - s.rotateY) * smoothing;

    element.style.setProperty("--pointer-x", `${s.pointerX * 100}%`);
    element.style.setProperty("--pointer-y", `${s.pointerY * 100}%`);
    element.style.setProperty("--rotate-x", `${s.rotateX.toFixed(3)}deg`);
    element.style.setProperty("--rotate-y", `${s.rotateY.toFixed(3)}deg`);

    const settled =
      !t.active &&
      Math.abs(s.rotateX) < 0.04 &&
      Math.abs(s.rotateY) < 0.04 &&
      Math.abs(s.pointerX - 0.5) < 0.002 &&
      Math.abs(s.pointerY - 0.5) < 0.002;

    if (!settled) {
      rafId.current = requestAnimationFrame(applyTransform);
    } else {
      rafId.current = 0;
      s.rotateX = 0;
      s.rotateY = 0;
      s.pointerX = 0.5;
      s.pointerY = 0.5;
      element.style.setProperty("--rotate-x", "0deg");
      element.style.setProperty("--rotate-y", "0deg");
      element.style.setProperty("--pointer-x", "50%");
      element.style.setProperty("--pointer-y", "50%");
    }
  }, [disabled, maxTilt, smoothing]);

  const startLoop = useCallback(() => {
    if (disabled || rafId.current) return;
    rafId.current = requestAnimationFrame(applyTransform);
  }, [applyTransform, disabled]);

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
      target.current.pointerX = (event.clientX - rect.left) / rect.width;
      target.current.pointerY = (event.clientY - rect.top) / rect.height;
      target.current.active = true;
      startLoop();
    },
    [disabled, startLoop],
  );

  const onPointerLeave = useCallback(() => {
    if (disabled) return;
    target.current.active = false;
    target.current.pointerX = 0.5;
    target.current.pointerY = 0.5;
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
