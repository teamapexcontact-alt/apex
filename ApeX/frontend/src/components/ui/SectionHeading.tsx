"use client";

import { RevealGroup, RevealItem } from "@/components/ui/RevealGroup";

type SectionHeadingProps = {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const widthClass = className.includes("max-w-") ? "" : "max-w-3xl";
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <RevealGroup className={`${widthClass} mb-16 md:mb-20 ${alignClass} ${className}`.trim()}>
      {label && (
        <RevealItem
          as="p"
          index={0}
          className="text-xs md:text-sm uppercase tracking-[0.35em] text-text-muted mb-4"
        >
          {label}
        </RevealItem>
      )}
      <RevealItem
        as="h2"
        index={1}
        className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
      >
        <span className="gradient-text-subtle">{title}</span>
      </RevealItem>
      {subtitle && (
        <RevealItem
          as="p"
          index={2}
          className={`mt-5 text-base md:text-lg text-text-muted leading-relaxed max-w-2xl ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </RevealItem>
      )}
    </RevealGroup>
  );
}
