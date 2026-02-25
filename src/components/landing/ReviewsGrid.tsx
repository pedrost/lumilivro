"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import { REVIEWS } from "@/lib/constants";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function ReviewsGrid() {
  return (
    <section id="avaliacoes" className="relative py-20 lg:py-28 bg-black">
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <div className="text-center mb-14">
          <p className="text-amber-500 font-semibold tracking-wider uppercase text-sm mb-3">
            Reviews
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            What Our Customers{" "}
            <span className="text-amber-500">Say</span>
          </h2>
        </div>

        {/* Reviews grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {REVIEWS.map((review, index) => (
            <motion.div
              key={index}
              variants={cardVariant}
              className="bg-neutral-900 rounded-xl border border-white/5 flex flex-col gap-4 overflow-hidden"
            >
              {/* Review photo */}
              {review.image && (
                <div className="relative w-full aspect-[4/3] bg-neutral-800">
                  <Image
                    src={review.image}
                    alt={`Product photo by ${review.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="px-6 pb-6 pt-2 flex flex-col gap-4 flex-1">
              {/* Star rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-600"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-neutral-300 leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author info */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div>
                  <p className="text-white font-bold text-sm">{review.name}</p>
                  <p className="text-neutral-500 text-xs">{review.city}</p>
                </div>

                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full px-2.5 py-1">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified Purchase
                  </span>
                )}
              </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
