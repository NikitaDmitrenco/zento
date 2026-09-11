import React from "react";

/** Editorial section header: mono index, rule on top, title plus optional meta on the right. */
export function SectionHead({
  index,
  title,
  subtitle,
  aside,
  as: Heading = "h2",
  className = "",
}: {
  index?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  aside?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={`section-head ${className}`}>
      <span className="label pt-1 min-w-8">{index}</span>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <Heading className={Heading === "h1" ? "text-h2 sm:text-h1 text-ink" : "text-h3 sm:text-h2 text-ink"}>{title}</Heading>
          {subtitle && <p className="text-small text-ink-3 mt-1.5 max-w-xl">{subtitle}</p>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </div>
  );
}
