export default function CrownLogo({ className = "" }) {
  return (
    <svg
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 20 L6 6 L14 16 L24 4 L34 16 L42 6 L46 20 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="6" cy="6" r="1.4" fill="currentColor" />
      <circle cx="24" cy="4" r="1.6" fill="currentColor" />
      <circle cx="42" cy="6" r="1.4" fill="currentColor" />
    </svg>
  );
}
