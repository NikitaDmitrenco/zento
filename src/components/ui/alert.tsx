import React from "react";

const tones = {
  error: "border-danger bg-danger-soft text-danger",
  success: "border-ok bg-ok-soft text-ok",
  info: "border-ink bg-surface text-ink-2",
};

export function Alert({
  children,
  tone = "info",
  className = "",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`border-l-2 rounded-r-sm px-4 py-3 text-small ${tones[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
