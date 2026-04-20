import Link from "next/link";
import { LICENSE_TIERS } from "@/config/beats";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Licensing — Xavier Moreno",
  description:
    "Understand the MP3 lease, WAV lease, and exclusive rights terms for beats by Xavier Moreno.",
};

const faqs = [
  {
    q: "Do I have to credit you?",
    a: "Yes. All leases require producer credit in the song metadata and anywhere the song appears — something like “prod. Xavier Moreno.” Exclusive deals can be negotiated.",
  },
  {
    q: "Can multiple artists license the same beat?",
    a: "Yes, leases are non-exclusive. The same beat may be licensed by several artists until someone purchases an exclusive, at which point the beat is removed from the store.",
  },
  {
    q: "What happens when I hit my stream cap?",
    a: "You can upgrade your license at any time — reach out and we’ll credit what you’ve already paid toward the next tier.",
  },
  {
    q: "How do I buy an exclusive?",
    a: "Use the contact form below and select the beat title. Exclusive pricing varies per beat based on production depth and current interest.",
  },
];

export default function LicensingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs uppercase tracking-[0.25em] text-gold">Licensing</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
        Clear terms, <br className="hidden sm:block" />
        no small print games.
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/60 sm:text-base">
        Every beat is offered under three straightforward licenses. Pick the one
        that matches how you plan to release. Upgrade any time.
      </p>

      {/* Tiers */}
      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {LICENSE_TIERS.map((tier) => (
          <div
            key={tier.id}
            className="flex h-full flex-col rounded-xl border border-cream/10 bg-ink/40 p-5"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50">
                {tier.name}
              </p>
              <p className="mt-2 font-display text-3xl text-cream">
                {tier.priceLabel}
              </p>
              <p className="mt-1 text-xs text-cream/50">{tier.delivery}</p>
            </div>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-cream/80">
              {tier.rights.map((r) => (
                <li key={r} className="flex gap-3">
                  <span className="mt-[7px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-gold" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className={[
                "mt-6 block rounded-md px-4 py-3 text-center text-xs uppercase tracking-[0.2em] transition-colors",
                tier.id === "exclusive"
                  ? "border border-gold/60 text-gold hover:bg-gold hover:text-ink"
                  : "bg-gold text-ink hover:bg-cream",
              ].join(" ")}
            >
              {tier.id === "exclusive" ? "Browse beats" : "Shop beats"}
            </Link>
          </div>
        ))}
      </section>

      {/* Language restriction notice */}
      <section className="mt-8 flex items-start gap-4 rounded-xl border border-gold/40 bg-gold/[0.04] p-5 sm:p-6">
        <span
          aria-hidden="true"
          className="mt-[2px] flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gold/60 text-xs font-medium text-gold"
        >
          !
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold">
            Language restriction
          </p>
          <p className="mt-2 text-sm leading-relaxed text-cream/80 sm:text-base">
            All leases are restricted to Spanish-language and regional Mexican
            music releases only. English-language use is not permitted under
            any lease tier. For exceptions contact us directly.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="mt-16">
        <h2 className="font-display text-2xl text-cream">At a glance</h2>
        <div className="mt-5 overflow-hidden rounded-xl border border-cream/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink/60 text-[11px] uppercase tracking-[0.2em] text-cream/50">
              <tr>
                <th className="px-4 py-3 font-normal">Right</th>
                <th className="px-4 py-3 font-normal">MP3</th>
                <th className="px-4 py-3 font-normal">WAV</th>
                <th className="px-4 py-3 font-normal">Exclusive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/10 text-cream/80">
              {[
                ["File delivery", "MP3 320", "WAV + MP3", "WAV + Stems"],
                ["Stream cap", "10k", "50k", "Unlimited"],
                ["YouTube monetization", "—", "✓", "✓"],
                ["Beat stays in store", "✓", "✓", "—"],
                ["Producer credit required", "✓", "✓", "✓"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={
                        i === 0
                          ? "px-4 py-3 text-cream/60"
                          : "px-4 py-3 text-cream"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="font-display text-2xl text-cream">FAQ</h2>
        <div className="mt-5 space-y-4">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="rounded-lg border border-cream/10 bg-ink/40 p-5"
            >
              <p className="font-display text-base text-cream">{f.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <ContactForm />
      </section>
    </div>
  );
}
