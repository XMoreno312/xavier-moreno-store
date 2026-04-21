import Hero from "@/components/hero/Hero";
import PortraitBio from "@/components/portrait/PortraitBio";
import InTheWork from "@/components/portrait/InTheWork";

export const metadata = {
  title: "Xavier Moreno",
  description:
    "Productions for artists who feel everything. Xavier Moreno — singer, songwriter, producer.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PortraitBio />
      <InTheWork />
    </>
  );
}
