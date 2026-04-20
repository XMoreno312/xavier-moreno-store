"use client";

export default function FilterPills({ genres, active, onChange }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {genres.map((g) => {
        const isActive = g === active;
        return (
          <button
            key={g}
            onClick={() => onChange(g)}
            className={[
              "whitespace-nowrap rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.18em] transition-all",
              isActive
                ? "border-gold bg-gold text-ink"
                : "border-cream/15 text-cream/60 hover:border-gold/50 hover:text-cream",
            ].join(" ")}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}
