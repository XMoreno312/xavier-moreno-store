import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AudioPlayerProvider from "@/components/AudioPlayerProvider";
import AudioPlayerBar from "@/components/AudioPlayerBar";

export const metadata = {
  title: "Xavier Moreno — Beat Store",
  description:
    "Beats and instrumentals by Xavier Moreno. Sierreño, Indie, and R&B — lease or exclusive.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning on <body> silences mismatches caused by
        browser extensions (LastPass, Dark Reader, Grammarly, etc.) that
        inject attributes/elements before React hydrates. It does NOT hide
        real hydration bugs in our own components — those still log.
      */}
      <body
        className="relative min-h-screen bg-ink text-cream"
        suppressHydrationWarning
      >
        <AudioPlayerProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-32">{children}</main>
            <Footer />
          </div>
          <AudioPlayerBar />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
