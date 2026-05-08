/**
 * Canonical Xavier Moreno brand mark — the crown + hand-lettered wordmark.
 * Single source of truth: Header + Hero both import from here so the lockup
 * stays identical across the site. Update /public/XM_TM5.png to refresh.
 */
export default function Logo({
  className = "",
  alt = "Xavier Moreno",
  style,
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/XM_TM5.png"
      alt={alt}
      draggable={false}
      className={className}
      style={style}
    />
  );
}
