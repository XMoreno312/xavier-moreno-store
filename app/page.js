import Hero from "@/components/hero/Hero";
import FeaturedProductions from "@/components/featured/FeaturedProductions";
import AtmosphericBio from "@/components/portrait/AtmosphericBio";
import QuietMoment from "@/components/portrait/QuietMoment";
import SectionReveal from "@/components/SectionReveal";

export const metadata = {
  title: "Xavier Moreno",
  description:
    "Productions for artists who feel everything. Xavier Moreno — singer, songwriter, producer.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectionReveal>
        <FeaturedProductions />
      </SectionReveal>
      <SectionReveal>
        <AtmosphericBio />
      </SectionReveal>
      <SectionReveal>
        <QuietMoment />
      </SectionReveal>
    </>
  );
}
