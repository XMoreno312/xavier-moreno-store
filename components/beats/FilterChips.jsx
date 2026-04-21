"use client";

/**
 * Editorial filter — not pills. Thin underline on active, small caps,
 * wide tracking, no backgrounds. Subdued. Easing matches the rest of the
 * /beats vocabulary so transitions feel like part of the same breath.
 */
export default function FilterChips({ genres, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filter productions by genre"
      className="-mx-4 flex items-center gap-9 overflow-x-auto px-4 sm:mx-0 sm:gap-11 sm:px-0"
    >
      {genres.map((g) => {
        const isActive = g === active;
        return (
          <button
            key={g}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(g)}
            className="group relative flex-shrink-0 py-2 text-[10.5px] text-bone"
            style={{
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: isActive ? "#EFE9DD" : "rgba(239, 233, 221, 0.38)",
              transition: "color 700ms cubic-bezier(0.22, 0.6, 0.24, 1)",
            }}
          >
            {g}
            {/* active underline */}
            <span
              aria-hidden
              className="absolute -bottom-[2px] left-0 h-px"
              style={{
                width: isActive ? "100%" : "0%",
                backgroundColor: "#A8A39A",
                transition: "width 800ms cubic-bezier(0.22, 0.6, 0.24, 1)",
              }}
            />
            {/* hover hint underline */}
            <span
              aria-hidden
              className="absolute -bottom-[2px] left-0 h-px bg-bone/15 opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100"
              style={{ width: "100%" }}
            />
          </button>
        );
      })}
    </div>
  );
}
