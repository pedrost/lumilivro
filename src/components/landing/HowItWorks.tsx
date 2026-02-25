"use client";

import { motion } from "framer-motion";
import { ShoppingCart, ShieldCheck, Package } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  "shopping-cart": ShoppingCart,
  "shield-check": ShieldCheck,
  package: Package,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-black py-20 sm:py-28 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            How It Works
          </h2>
          <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-amber-500" />
        </div>

        {/* Steps grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {HOW_IT_WORKS_STEPS.map((step, i) => {
            const Icon = iconMap[step.icon] ?? ShoppingCart;
            return (
              <motion.div
                key={step.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className="relative bg-neutral-900 border border-white/5 rounded-xl p-6 flex flex-col items-center text-center"
              >
                {/* Step number badge */}
                <div className="mb-5 flex items-center justify-center h-12 w-12 rounded-full bg-amber-500 text-black font-bold text-lg shadow-lg shadow-amber-500/20">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="mb-4 flex items-center justify-center h-14 w-14 rounded-2xl bg-amber-500/10">
                  <Icon className="h-7 w-7 text-amber-500" />
                </div>

                {/* Copy */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
