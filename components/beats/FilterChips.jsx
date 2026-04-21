"use client";

/**
 * Editorial filter — not pills. Thin underline on active, small caps,
 * wide tracking, no backgrounds. Subdued.
 */
export default function FilterChips({ genres, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filter productions by genre"
      className="-mx-4 flex items-center gap-8 overflow-x-auto px-4 sm:mx-0 sm:gap-10 sm:px-0"
    >
      {genres.map((g) => {
        const isActive = g === active;
        return (
          <button
            key={g}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(g)}
            className="group relative flex-shrink-0 py-2 text-[11px] text-bone transition-colors duration-500"
            style={{
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: isActive ? "#EFE9DD" : "rgba(239, 233, 221, 0.45)",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {g}
            {/* active underline */}
            <span
              aria-hidden
              className="absolute -bottom-[2px] left-0 h-px transition-all duration-700"
              style={{
                width: isActive ? "100%" : "0%",
                backgroundColor: "#A8A39A",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
            {/* hover hint underline */}
            <span
              aria-hidden
              className="absolute -bottom-[2px] left-0 h-px bg-bone/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ width: "100%" }}
            />
          </button>
        );
      })}
    </div>
  );
}
