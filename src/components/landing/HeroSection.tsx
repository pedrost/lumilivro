"use client";

import { Truck, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustBadges = [
  { icon: Truck, label: "Free Shipping" },
  { icon: CreditCard, label: "Secure Payment" },
  { icon: ShieldCheck, label: "30-Day Guarantee" },
];

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-black via-neutral-950 to-black">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-amber-500/5 blur-3xl" />

      <div className="container mx-auto px-4 py-20 lg:py-0">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* ---------- Left: copy ---------- */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <p
              className="animate-fade-in-up text-amber-500 font-semibold tracking-wider uppercase text-sm"
            >
              Rechargeable LED Book Light
            </p>

            <h1
              className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white font-serif"
              style={{ animationDelay: "0.15s" }}
            >
              Read in the Dark{" "}
              <span className="text-amber-500">Without Straining Your Eyes</span>
            </h1>

            <p
              className="animate-fade-in-up text-neutral-400 text-lg max-w-lg mx-auto lg:mx-0"
              style={{ animationDelay: "0.3s" }}
            >
              Tired of straining your eyes in the dark or turning on the light
              and disturbing your partner?{" "}
              <span className="text-white font-medium">LumiRead</span> is the
              reading light that protects your eyes and transforms your
              nighttime reading.
            </p>

            <div
              className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              style={{ animationDelay: "0.45s" }}
            >
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-base px-8 py-6 rounded-full shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40"
                onClick={() => scrollTo("buy")}
              >
                Get My LumiRead
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-neutral-300 hover:text-white hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-full px-8 py-6 text-base"
                onClick={() => scrollTo("how-it-works")}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* ---------- Right: product video ---------- */}
          <div
            className="animate-fade-in-up relative flex items-center justify-center"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Amber glow behind video */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-amber-500/20 blur-3xl animate-pulse_glow" />
            </div>

            {/* Product video */}
            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-amber-500/10">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-auto"
                poster="/images/review-1.png"
              >
                <source src="/images/hero-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        {/* ---------- Trust badges ---------- */}
        <div
          className="animate-fade-in-up mt-16 lg:mt-20 flex flex-wrap justify-center gap-8 lg:gap-16"
          style={{ animationDelay: "0.8s" }}
        >
          {trustBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-neutral-400"
            >
              <Icon className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
