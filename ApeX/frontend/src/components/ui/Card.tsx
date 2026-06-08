import { type HTMLAttributes, type ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "div" | "section";
  children: ReactNode;
  glass?: boolean;
};

export function Card({
  as: Tag = "div",
  glass = true,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      className={`rounded-2xl ${glass ? "glass-panel" : "border border-[rgba(0,245,255,0.12)] bg-bg-elevated"} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
