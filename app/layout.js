import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LayoutMain from "@/components/LayoutMain";
import AudioPlayerProvider from "@/components/AudioPlayerProvider";
import AudioPlayerBar from "@/components/AudioPlayerBar";

// Canonical site URL — used by Next.js to resolve relative URLs in
// Open Graph, Twitter cards, and canonical tags. DNS + hosting still
// need to be configured separately at the registrar / Vercel.
const SITE_URL = "https://zaemoreno.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Zae Moreno",
    template: "%s · Zae Moreno",
  },
  description:
    "Productions for artists who feel everything. Zae Moreno — singer, songwriter, producer.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Zae Moreno",
    url: SITE_URL,
    title: "Zae Moreno",
    description:
      "Productions for artists who feel everything. Zae Moreno — singer, songwriter, producer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zae Moreno",
    description:
      "Productions for artists who feel everything. Zae Moreno — singer, songwriter, producer.",
  },
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
        className="relative min-h-screen bg-stage text-bone"
        suppressHydrationWarning
      >
        <AudioPlayerProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <LayoutMain>{children}</LayoutMain>
            <Footer />
          </div>
          <AudioPlayerBar />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
