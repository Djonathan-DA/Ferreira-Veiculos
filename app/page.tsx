import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandStrip } from "@/components/BrandStrip";
import { Catalog } from "@/components/Catalog";
import { WhyUs } from "@/components/WhyUs";
import { Reviews } from "@/components/Reviews";
import { Location } from "@/components/Location";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BrandStrip />
        <Catalog />
        <WhyUs />
        <Reviews />
        <Location />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
