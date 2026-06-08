"use client";

import {
  createElement,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useEffectCapabilities } from "@/hooks/useEffectCapabilities";
import { usePointerGlow } from "@/hooks/usePointerGlow";

export type GlowTextProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

export function GlowText({
  as: Tag = "span",
  children,
  className = "",
  disabled = false,
  ...props
}: GlowTextProps) {
  const { reducedMotion, coarsePointer } = useEffectCapabilities();
  const glowDisabled = disabled || reducedMotion || coarsePointer;
  const { ref, isActive, handlers } = usePointerGlow({ disabled: glowDisabled });

  const rootClass = [
    "glow-text",
    isActive ? "is-active" : "",
    glowDisabled ? "glow-text--static" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const layers: ReactNode[] = [children];

  if (!glowDisabled) {
    layers.push(
      createElement(
        "span",
        { key: "shine", className: "glow-text__shine", "aria-hidden": true },
        children,
      ),
      createElement("span", {
        key: "halo",
        className: "glow-text__halo",
        "aria-hidden": true,
      }),
    );
  }

  return createElement(
    Tag,
    {
      ref,
      className: rootClass,
      ...handlers,
      ...props,
    },
    ...layers,
  );
}
