import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import { IntegrationsSection } from "@/components/integrations-section";
import { AiTechSection } from "@/components/ai-tech-section";
import { PricingSection } from "@/components/pricing-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <IntegrationsSection />
      <AiTechSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
