"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function FaqAccordion() {
  return (
    <section id="faq" className="relative py-20 lg:py-28 bg-black">
      <div className="container mx-auto px-4">
        {/* Section heading */}
        <motion.div
          className="text-center mb-14"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-amber-500 font-semibold tracking-wider uppercase text-sm mb-3">
            Got Questions?
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Frequently Asked <span className="text-amber-500">Questions</span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          className="max-w-3xl mx-auto"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-white/5 rounded-xl bg-neutral-900/50 px-6 hover:border-white/10 transition-colors data-[state=open]:border-amber-500/20"
              >
                <AccordionTrigger className="text-left text-white font-medium py-5 hover:no-underline hover:text-amber-500 transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-400 leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact trust line */}
        <motion.p
          className="text-center mt-10 text-neutral-400 text-sm"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          Still have questions?{" "}
          <Link
            href="/contato"
            className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            hello@lumi-read.com
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
