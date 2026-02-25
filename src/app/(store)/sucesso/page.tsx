"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const TIMELINE_STEPS = [
  {
    icon: Mail,
    title: "Email confirmation",
    description:
      "You will receive an email with your order details",
  },
  {
    icon: Package,
    title: "Processing",
    description:
      "Your order will be prepared and shipped within 3 business days",
  },
  {
    icon: Truck,
    title: "Delivery",
    description:
      "Estimated delivery in 5-8 business days. Tracking number sent by email",
  },
];

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <section className="min-h-screen bg-[#0a0a0a] pb-16 pt-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Animated Checkmark */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3,
              }}
            >
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-8 font-serif text-3xl font-bold text-white sm:text-4xl"
          >
            Order Confirmed!
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-3 text-lg text-muted-foreground"
          >
            Thank you for your purchase
          </motion.p>

          {/* Order ID Badge */}
          {orderId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="mt-4"
            >
              <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm tracking-wider text-white">
                Order #{orderId.slice(-8).toUpperCase()}
              </span>
            </motion.div>
          )}
        </div>

        {/* "What happens next?" Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
        >
          <h2 className="mb-8 text-lg font-semibold text-white">
            What happens next?
          </h2>

          <div className="relative space-y-0">
            {TIMELINE_STEPS.map((step, index) => (
              <div key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Vertical connecting line */}
                {index < TIMELINE_STEPS.length - 1 && (
                  <div className="absolute left-[9px] top-5 h-full w-px bg-amber-500/30" />
                )}

                {/* Amber dot */}
                <div className="relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                </div>

                {/* Content */}
                <div className="pb-2">
                  <p className="font-semibold text-white">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Button
            asChild
            className="h-12 bg-amber-500 px-8 text-base font-semibold text-black hover:bg-amber-400"
          >
            <Link href="/">Back to Store</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-12 border-white/20 px-8 text-base hover:bg-white/5"
          >
            <Link href="/contato">Contact Us</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
