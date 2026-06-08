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

type RevealGroupProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
};

export function RevealGroup({
  as: Tag = "div",
  children,
  className = "",
  once = true,
  rootMargin,
  threshold,
  ...props
}: RevealGroupProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, isRevealed } = useReveal<HTMLElement>({
    once,
    rootMargin,
    threshold,
    disabled: reducedMotion,
  });

  return createElement(
    Tag,
    {
      ref,
      className: `reveal-group${isRevealed ? " is-revealed" : ""}${className ? ` ${className}` : ""}`,
      "data-revealed": isRevealed || undefined,
      ...props,
    },
    children,
  );
}

type RevealItemProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  index?: number;
};

export function RevealItem({
  as: Tag = "div",
  children,
  className = "",
  index = 0,
  style,
  ...props
}: RevealItemProps) {
  const itemStyle = {
    ...style,
    "--reveal-index": index,
  } as CSSProperties;

  return createElement(
    Tag,
    {
      className: `reveal-item${className ? ` ${className}` : ""}`,
      style: itemStyle,
      ...props,
    },
    children,
  );
}
