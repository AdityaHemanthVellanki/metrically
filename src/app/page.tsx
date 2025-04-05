import { NavbarWaitlist } from "@/components/navbar-waitlist";
import { HeroWaitlist } from "@/components/hero-waitlist";
import { FeaturesWaitlist } from "@/components/features-waitlist";
import { FaqWaitlist } from "@/components/faq-waitlist";
import { FooterWaitlist } from "@/components/footer-waitlist";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWaitlist />
      <div id="waitlist">
        <HeroWaitlist />
      </div>
      <FeaturesWaitlist />
      <FaqWaitlist />
      <FooterWaitlist />
    </div>
  );
}
