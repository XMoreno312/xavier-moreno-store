"use client";

import { LICENSE_TIERS } from "@/config/beats";

/**
 * Expandable drawer that reveals the three licensing tiers for a beat.
 * Stripe integration: onSelect(tier) is the hook — wire it to a checkout
 * session creator later. For "exclusive", route to email/contact.
 */
export default function TierDrawer({ beat, open, onSelect }) {
  return (
    <div
      className={[
        "grid transition-all duration-300 ease-out",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div className="overflow-hidden">
        <div className="mt-3 grid gap-2 border-t border-cream/10 pt-4 sm:grid-cols-3 sm:gap-3">
          {LICENSE_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col justify-between rounded-lg border border-cream/10 bg-ink/40 p-4 transition-colors hover:border-gold/40"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50">
                  {tier.name}
                </p>
                <p className="mt-1 font-display text-xl text-cream">
                  {tier.priceLabel}
                </p>
                <p className="mt-1 text-xs text-cream/50">{tier.delivery}</p>
              </div>
              <button
                onClick={() => onSelect && onSelect(tier, beat)}
                className={[
                  "mt-4 w-full rounded-md px-3 py-2 text-xs uppercase tracking-[0.2em] transition-colors",
                  tier.id === "exclusive"
                    ? "border border-gold/60 text-gold hover:bg-gold hover:text-ink"
                    : "bg-gold text-ink hover:bg-cream",
                ].join(" ")}
              >
                {tier.id === "exclusive" ? "Contact" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
