/**
 * Canonical Zae Moreno wordmark lockup.
 *
 * Until the new hand-lettered logo is finalized, this renders a typeset
 * editorial wordmark in the brand vocabulary — bone serif type stacked
 * "ZAE / MORENO," topped by a small iris-tinted three-peak crown that
 * echoes the existing CrownLogo asset. Pure SVG, so it scales perfectly
 * with whatever `className` (Tailwind h-N) or inline `style.height` the
 * parent passes — exactly the way the previous PNG behaved, no other
 * consumer code needs to change.
 *
 * To swap in the real logo: drop the artwork at `/public/XM_TM5.png`
 * (or a new path) and replace this component's body with an <img> that
 * points at it. Header + BeatsMasthead + LogoAnimation all import from
 * here so the swap propagates everywhere in one edit.
 */
export default function Logo({
  className = "",
  alt = "Zae Moreno",
  style,
}) {
  return (
    <svg
      viewBox="0 0 140 96"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label={alt}
    >
      {/* Small iris-tinted crown — three peaks with dot tips. Same
          gesture as the CrownLogo asset, scaled to sit above the
          wordmark. */}
      <g transform="translate(70, 16)">
        <path
          d="M-22 6 L-19 -3 L-12 4 L-2 -7 L8 4 L15 -3 L18 6"
          stroke="#7C5BD8"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="-19" cy="-3" r="1.5" fill="#7C5BD8" />
        <circle cx="-2" cy="-7" r="1.8" fill="#7C5BD8" />
        <circle cx="15" cy="-3" r="1.5" fill="#7C5BD8" />
      </g>

      {/* ZAE — the prominent line, display serif, letter-spaced. */}
      <text
        x="70"
        y="56"
        textAnchor="middle"
        fontFamily="ui-serif, Georgia, Cambria, 'Times New Roman', serif"
        fontSize="26"
        letterSpacing="5"
        fill="#EFE9DD"
        fontWeight="400"
        style={{ letterSpacing: "5px" }}
      >
        ZAE
      </text>

      {/* MORENO — quieter line, wider tracking, smaller. */}
      <text
        x="70"
        y="82"
        textAnchor="middle"
        fontFamily="ui-serif, Georgia, Cambria, 'Times New Roman', serif"
        fontSize="12"
        letterSpacing="4.5"
        fill="#EFE9DD"
        fontWeight="400"
        style={{ letterSpacing: "4.5px" }}
      >
        MORENO
      </text>

      {/* Quiet bone hairline between the two — same divider grammar
          the rest of the editorial system uses (eyebrow dashes,
          metadata separators). */}
      <line
        x1="56"
        y1="62"
        x2="84"
        y2="62"
        stroke="#A8A39A"
        strokeWidth="0.5"
        strokeOpacity="0.55"
      />
    </svg>
  );
}
