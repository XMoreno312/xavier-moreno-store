/**
 * Canonical Xavier Moreno brand mark — the crown + hand-lettered wordmark.
 * Single source of truth: Header + Hero both import from here so the lockup
 * stays identical across the site. Update /public/XM_TM5.png to refresh.
 */
export default function Logo({
  className = "",
  alt = "Xavier Moreno",
  blendOnBg = false,
  style,
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/XM_TM5.png"
      alt={alt}
      draggable={false}
      className={className}
      style={{
        // `screen` blends the logo's black bg away so the lockup reads
        // cleanly on any surface. Use on the hero (pure #0B0B0B) where
        // even a subtle bg rectangle would be visible.
        ...(blendOnBg ? { mixBlendMode: "screen" } : null),
        ...style,
      }}
    />
  );
}
