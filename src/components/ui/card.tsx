import React from "react";

export function Card({
  children,
  className = "",
  hoverable = false,
}: {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${
        hoverable ? "transition-all duration-300 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
