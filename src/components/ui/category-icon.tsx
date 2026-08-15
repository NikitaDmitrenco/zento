import React from "react";

interface CategoryIconProps extends React.SVGProps<SVGSVGElement> {
  slug: string;
}

export function CategoryIcon({ slug, className = "w-6 h-6", ...props }: CategoryIconProps) {
  const normSlug = slug.toLowerCase();

  if (normSlug === "smartphones" || normSlug.includes("phone")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        {/* Smartphone icon */}
        <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 5h2" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="18" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (normSlug === "laptops" || normSlug.includes("laptop") || normSlug.includes("book")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        {/* Laptop icon */}
        <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9H4V6z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17a1 1 0 011-1h18a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 16h4" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (normSlug === "tablets" || normSlug.includes("tab") || normSlug.includes("pad")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        {/* Tablet icon */}
        <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="18" r="0.75" fill="currentColor" />
        <line x1="9" y1="6" x2="15" y2="6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (normSlug === "headphones" || normSlug.includes("audio") || normSlug.includes("sound")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        {/* Headphones icon */}
        <path d="M3 14v-3a9 9 0 0118 0v3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="14" width="4" height="6" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="14" width="4" height="6" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (normSlug === "smart-watches" || normSlug.includes("watch") || normSlug.includes("fit")) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        {/* Smartwatch icon */}
        <rect x="7" y="7" width="10" height="10" rx="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 7V3a1 1 0 011-1h4a1 1 0 011 1v4M9 17v4a1 1 0 001 1h4a1 1 0 001-1v-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 10v2l1 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Accessories / Charger / Power Bank
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      {/* Battery / Charger icon */}
      <rect x="6" y="7" width="12" height="14" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9" y1="3" x2="9" y2="7" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="3" x2="15" y2="7" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 11l-3 3h4l-2 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
