"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function FinalCTA() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-24 lg:py-36 bg-gradient-to-b from-black via-neutral-950 to-black overflow-hidden">
      {/* Ambient amber radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-amber-500 font-semibold tracking-wider uppercase text-sm">
            Limited Time Offer
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            Transform Your Nights{" "}
            <span className="text-amber-500">of Reading</span>
          </h2>

          <p className="text-neutral-400 text-lg max-w-xl leading-relaxed">
            Don&apos;t wait to have the best nighttime reading experience.
            Limited stock &mdash; get yours while supplies last.
          </p>

          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-10 py-7 rounded-full shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40 hover:scale-105 group"
            onClick={() => scrollTo("buy")}
          >
            GET MY LUMIREAD
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="text-neutral-500 text-sm">
            Free Shipping &bull; Secure Payment &bull; 30-Day Guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}
