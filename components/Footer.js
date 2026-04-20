export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-cream/10 bg-ink/60 px-4 py-10 text-sm text-cream/60 sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display tracking-[0.18em] text-cream">XAVIER MORENO</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/40">
            Beats / Instrumentals
          </p>
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-cream/50">
          <p>
            Booking & exclusive inquiries:{" "}
            <a
              href="mailto:bishopxavier20@gmail.com"
              className="text-gold transition-colors hover:text-cream"
            >
              bishopxavier20@gmail.com
            </a>
          </p>
          <p className="mt-2 text-cream/30">
            © {new Date().getFullYear()} Xavier Moreno. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
