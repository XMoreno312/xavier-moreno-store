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
                ? "border-iris bg-iris text-bone shadow-[0_0_14px_rgba(124,91,216,0.30)]"
                : "border-cream/15 text-cream/60 hover:border-iris/55 hover:text-iris-mist",
            ].join(" ")}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}
