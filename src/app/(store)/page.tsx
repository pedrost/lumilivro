import HeroSection from "@/components/landing/HeroSection";
import SocialProofTicker from "@/components/landing/SocialProofTicker";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PurchaseBox from "@/components/landing/PurchaseBox";
import ReviewsGrid from "@/components/landing/ReviewsGrid";
import VideoShowcase from "@/components/landing/VideoShowcase";
import FaqAccordion from "@/components/landing/FaqAccordion";
import FinalCTA from "@/components/landing/FinalCTA";
import MobileStickyBar from "@/components/landing/MobileStickyBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofTicker />
      <HowItWorks />
      <FeaturesSection />
      <PurchaseBox />
      <ReviewsGrid />
      <VideoShowcase />
      <FaqAccordion />
      <FinalCTA />
      <MobileStickyBar />
    </>
  );
}
