import { Locale } from "../../i18n/config";

/** Formats integer minor units for display. Money is never stored as a float. */
export function formatPrice(minor: number, locale: Locale) {
  return (minor / 100).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

const sizes = {
  sm: "text-[15px]",
  md: "text-[17px]",
  lg: "text-[22px]",
  xl: "text-[32px]",
};

export function Price({
  amount,
  currency,
  locale,
  size = "md",
  className = "",
}: {
  amount: number;
  currency: string;
  locale: Locale;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span className={`data inline-flex items-baseline gap-1.5 text-ink ${className}`}>
      <span className={`${sizes[size]} font-medium`}>{formatPrice(amount, locale)}</span>
      <span className="text-[11px] uppercase tracking-[0.08em] text-ink-3">{currency}</span>
    </span>
  );
}
