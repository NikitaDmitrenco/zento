import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium rounded-sm select-none " +
  "transition-[background-color,color,border-color,transform] duration-180 " +
  "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer active:translate-y-px";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-ink text-ink-inverse hover:bg-signal",
  secondary: "bg-surface text-ink border border-line hover:border-ink",
  outline: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-ink-inverse",
  ghost: "bg-transparent text-ink-2 hover:text-ink hover:bg-paper-2",
  danger: "bg-danger text-white hover:bg-[#961f18]",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V1.5C6.2 1.5 1.5 6.2 1.5 12H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
