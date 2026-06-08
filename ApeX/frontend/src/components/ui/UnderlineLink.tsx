import Link from "next/link";
import { type ComponentProps } from "react";

type UnderlineLinkProps = ComponentProps<typeof Link>;

export function UnderlineLink({
  className = "",
  children,
  href,
  ...props
}: UnderlineLinkProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-block ${className}`}
      {...props}
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.28)]" />
    </Link>
  );
}
