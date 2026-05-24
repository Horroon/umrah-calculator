export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Umrah Calculator logo"
    >
      {/* Kaaba body */}
      <rect x="10" y="20" width="28" height="22" rx="1" fill="#065f46" />
      {/* Kaaba roof edge */}
      <rect x="8" y="18" width="32" height="4" rx="1" fill="#047857" />
      {/* Kiswah gold band */}
      <rect x="10" y="24" width="28" height="4" fill="#d97706" opacity="0.85" />
      {/* Door */}
      <rect x="20" y="30" width="8" height="12" rx="1" fill="#d97706" opacity="0.9" />
      {/* Crescent moon */}
      <path
        d="M34 4a7 7 0 1 0 0 12 5 5 0 1 1 0-12z"
        fill="#d97706"
      />
      {/* Star */}
      <polygon
        points="37,0 37.53,1.47 39.09,1.52 37.86,2.48 38.29,3.98 37,3.1 35.71,3.98 36.14,2.48 34.91,1.52 36.47,1.47"
        fill="#d97706"
      />
    </svg>
  );
}
