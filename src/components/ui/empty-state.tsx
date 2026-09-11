import React from "react";

/** Quiet empty state: a dashed ruled frame and a mono index, no illustration. */
export function EmptyState({
  index = "—",
  title,
  text,
  action,
  className = "",
}: {
  index?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-dashed border-line rounded-md px-6 py-16 text-center ${className}`}>
      <span className="label block mb-4">{index}</span>
      <h3 className="text-h3 text-ink">{title}</h3>
      {text && <p className="text-small text-ink-3 mt-2 max-w-sm mx-auto">{text}</p>}
      {action && <div className="mt-6 inline-flex">{action}</div>}
    </div>
  );
}
