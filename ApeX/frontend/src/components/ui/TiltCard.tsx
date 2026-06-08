"use client";

import {
  createElement,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useEffectCapabilities } from "@/hooks/useEffectCapabilities";
import { useTiltCard } from "@/hooks/useTiltCard";

export type TiltCardProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  accent?: string;
  holo?: boolean;
  scan?: boolean;
  scanDelay?: number;
  disabled?: boolean;
};

export function TiltCard({
  as: Tag = "div",
  children,
  className = "",
  maxTilt = 10,
  accent = "#FFFFFF",
  holo = true,
  scan = false,
  scanDelay = 0,
  disabled = false,
  style,
  ...props
}: TiltCardProps) {
  const { reducedMotion, coarsePointer } = useEffectCapabilities();
  const tiltDisabled = disabled || reducedMotion || coarsePointer;
  const { ref, isActive, handlers } = useTiltCard({
    maxTilt,
    disabled: tiltDisabled,
  });

  const cardStyle = {
    ...style,
    "--tilt-accent": accent,
    "--tilt-scan-delay": `${scanDelay}s`,
  } as CSSProperties;

  const cardClass = [
    "tilt-card",
    isActive ? "is-active" : "",
    tiltDisabled ? "tilt-card--static" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const surfaceChildren: ReactNode[] = [];

  if (holo && !tiltDisabled) {
    surfaceChildren.push(
      createElement("div", { key: "holo", className: "tilt-card__holo", "aria-hidden": true }),
      createElement("div", { key: "sheen", className: "tilt-card__sheen", "aria-hidden": true }),
    );
  }

  if (!tiltDisabled) {
    surfaceChildren.push(
      createElement("div", {
        key: "border",
        className: "tilt-card__border-glow",
        "aria-hidden": true,
      }),
      createElement("div", { key: "depth", className: "tilt-card__depth", "aria-hidden": true }),
    );
  }

  if (scan && !tiltDisabled) {
    surfaceChildren.push(
      createElement(
        "div",
        { key: "scan", className: "tilt-card__scan", "aria-hidden": true },
        createElement("div", { className: "tilt-card__scan-beam" }),
      ),
    );
  }

  surfaceChildren.push(
    createElement("div", { key: "content", className: "tilt-card__content" }, children),
  );

  return createElement(
    "div",
    { className: `tilt-card-scene min-w-0 overflow-hidden${className.includes("h-full") ? " h-full" : ""}` },
    createElement(
      Tag,
      {
        ref,
        className: `${cardClass} w-full overflow-hidden`,
        style: cardStyle,
        "data-tilt-active": isActive || undefined,
        ...handlers,
        ...props,
      },
      createElement("div", { className: "tilt-card__surface" }, ...surfaceChildren),
    ),
  );
}

type FeatureCardProps = Omit<TiltCardProps, "children"> & {
  icon?: ReactNode;
  title: string;
  description: string;
  badge?: string;
};

export function FeatureCard({
  icon,
  title,
  description,
  badge,
  scan = true,
  className = "",
  ...props
}: FeatureCardProps) {
  return (
    <TiltCard scan={scan} className={`h-full min-w-0 ${className}`} {...props}>
      {badge && (
        <span
          className="absolute top-4 right-6 font-[family-name:var(--font-syne)] text-7xl md:text-8xl font-bold text-white/[0.03] select-none pointer-events-none"
          aria-hidden
        >
          {badge}
        </span>
      )}

      <div className="relative z-10 p-8 md:p-10 h-full min-w-0">
        {icon && (
          <div className="mb-6 p-3 w-fit rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm" style={{ color: '#ffffff' }}>
            {icon}
          </div>
        )}
        <h3 className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-bold mb-3 tracking-tight text-white break-words whitespace-normal">
          {title}
        </h3>
        <p className="text-sm md:text-base text-gray-300 leading-relaxed break-words whitespace-normal">
          {description}
        </p>
      </div>
    </TiltCard>
  );
}
