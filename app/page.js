import Hero from "@/components/hero/Hero";
import AtmosphericBio from "@/components/portrait/AtmosphericBio";
import QuietMoment from "@/components/portrait/QuietMoment";

export const metadata = {
  title: "Xavier Moreno",
  description:
    "Productions for artists who feel everything. Xavier Moreno — singer, songwriter, producer.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AtmosphericBio />
      <QuietMoment />
    </>
  );
}
