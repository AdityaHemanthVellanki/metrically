"use client";
import { NavbarWaitlist } from "@/components/navbar-waitlist";
import { HeroWaitlist } from "@/components/hero-waitlist";
import { FeaturesWaitlist } from "@/components/features-waitlist";
import { FaqWaitlist } from "@/components/faq-waitlist";

import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWaitlist />
      <div id="waitlist">
        <HeroWaitlist />
      </div>
      <FeaturesWaitlist />
      <FaqWaitlist />
      
    </div>
  );
}
