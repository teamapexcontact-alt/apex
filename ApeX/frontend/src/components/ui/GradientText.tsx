import { type HTMLAttributes } from "react";

type GradientTextProps = HTMLAttributes<HTMLSpanElement> & {
  as?: "span" | "h1" | "h2" | "h3" | "p";
  variant?: "primary" | "subtle";
};

const variantClass = {
  primary: "gradient-text",
  subtle: "gradient-text-subtle",
} as const;

export function GradientText({
  as: Tag = "span",
  variant = "primary",
  className = "",
  children,
  ...props
}: GradientTextProps) {
  return (
    <Tag className={`${variantClass[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
