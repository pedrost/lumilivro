"use client";

import { motion } from "framer-motion";
import {
  Sun,
  BatteryCharging,
  Move3D,
  Moon,
  Feather,
} from "lucide-react";
import { FEATURES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  sun: Sun,
  "battery-charging": BatteryCharging,
  "move-3d": Move3D,
  moon: Moon,
  feather: Feather,
};

const fadeVariant = (direction: "left" | "right") => ({
  hidden: { opacity: 0, x: direction === "left" ? -40 : 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
});

export default function FeaturesSection() {
  return (
    <section id="recursos" className="bg-black py-20 sm:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Why Choose{" "}
            <span className="text-amber-500">LumiRead</span>?
          </h2>
          <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-amber-500" />
        </div>

        {/* Feature blocks */}
        <div className="flex flex-col gap-20 max-w-5xl mx-auto">
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon] ?? Sun;
            const isEven = i % 2 === 1;

            return (
              <motion.div
                key={feature.title}
                variants={fadeVariant(isEven ? "right" : "left")}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className={`flex flex-col items-center gap-8 md:flex-row md:items-center ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Icon area */}
                <div className="shrink-0 flex items-center justify-center h-28 w-28 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                  <Icon className="h-12 w-12 text-amber-500" />
                </div>

                {/* Text */}
                <div
                  className={`text-center md:text-left ${
                    isEven ? "md:text-right" : ""
                  }`}
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed max-w-md">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
