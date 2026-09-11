import React from "react";

/**
 * A bounded surface. Used sparingly, for objects (a product plate, an order summary),
 * not as the default wrapper for content. Tone "paper" sits flush with the page;
 * "surface" is raised white.
 */
export function Card({
  children,
  className = "",
  hoverable = false,
  tone = "surface",
}: {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  tone?: "surface" | "paper";
}) {
  return (
    <div
      className={`rounded-md border border-line ${tone === "surface" ? "bg-surface" : "bg-paper"} ${
        hoverable ? "transition-colors duration-180 hover:border-ink" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
