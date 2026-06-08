"use client";

import { useEffect, useRef, useState } from "react";
import { REVEAL_OBSERVER_OPTIONS } from "@/lib/reveal/constants";
import { subscribeReveal } from "@/lib/reveal/observer";

type UseRevealOptions = {
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
  disabled?: boolean;
};

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  once = true,
  rootMargin = REVEAL_OBSERVER_OPTIONS.rootMargin,
  threshold = REVEAL_OBSERVER_OPTIONS.threshold,
  disabled = false,
}: UseRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isRevealed, setIsRevealed] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setIsRevealed(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const cleanup = { unsubscribe: undefined as (() => void) | undefined };

    cleanup.unsubscribe = subscribeReveal(
      element,
      (isIntersecting) => {
        if (isIntersecting) {
          setIsRevealed(true);
          if (once) cleanup.unsubscribe?.();
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      { rootMargin, threshold },
    );

    return () => {
      cleanup.unsubscribe?.();
    };
  }, [disabled, once, rootMargin, threshold]);

  return { ref, isRevealed };
}
