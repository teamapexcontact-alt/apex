import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "gradient" | "glass" | "ghost" | "primary";
type ButtonSize = "sm" | "md" | "lg" | "pill";

const variantClass: Record<ButtonVariant, string> = {
  gradient: "btn-gradient text-[#0A0F14]",
  glass: "btn-glass text-[#FFFFFF]",
  ghost:
    "bg-transparent border border-[rgba(255,255,255,0.08)] text-[#FFFFFF] hover:border-[rgba(255,255,255,0.22)] hover:bg-[rgba(255,255,255,0.04)]",
  primary:
    "bg-[#d4f000] text-[#111111] hover:bg-[#c8e800] transition-[background] duration-[0.2s] ease",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-xs",
  md: "px-8 py-4 text-sm",
  lg: "px-10 py-5 text-base",
  pill: "px-[40px] py-[14px] text-[16px]",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center rounded-[50px] font-medium cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 disabled:pointer-events-none disabled:cursor-not-allowed";

export function Button({
  variant = "gradient",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variantClass[variant]} ${sizeClass[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
