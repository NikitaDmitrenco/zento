import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "outline" | "signal" | "ink";
  className?: string;
}

const styles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-paper-2 text-ink-2",
  success: "bg-ok-soft text-ok",
  warning: "bg-warn-soft text-warn",
  danger: "bg-danger-soft text-danger",
  outline: "border border-line text-ink-2 bg-surface",
  signal: "bg-signal-soft text-signal-strong",
  ink: "bg-ink text-ink-inverse",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 h-5.5 px-1.5 rounded-xs font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] whitespace-nowrap ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
