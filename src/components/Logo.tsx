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
        points="41,6 41.9,8.8 44.8,8.8 42.5,10.5 43.4,13.3 41,11.6 38.6,13.3 39.5,10.5 37.2,8.8 40.1,8.8"
        fill="#d97706"
      />
    </svg>
  );
}
