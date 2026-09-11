import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label block mb-2 text-ink-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={`field ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-[12px] text-danger">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-[12px] text-ink-3">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
