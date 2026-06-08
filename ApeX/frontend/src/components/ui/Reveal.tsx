"use client";

import {
  createElement,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useReveal } from "@/hooks/useReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Stagger index — multiplies the base stagger delay. */
  delay?: number;
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
};

export function Reveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  once = true,
  rootMargin,
  threshold,
  style,
  ...props
}: RevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, isRevealed } = useReveal<HTMLElement>({
    once,
    rootMargin,
    threshold,
    disabled: reducedMotion,
  });

  const revealStyle = {
    ...style,
    "--reveal-index": delay,
  } as CSSProperties;

  return createElement(
    Tag,
    {
      ref,
      className: `reveal${isRevealed ? " is-revealed" : ""}${className ? ` ${className}` : ""}`,
      style: revealStyle,
      "data-revealed": isRevealed || undefined,
      ...props,
    },
    children,
  );
}
