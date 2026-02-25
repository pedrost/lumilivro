"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Shield, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT, PRODUCT_BASIC } from "@/lib/constants";
import { formatUSD } from "@/lib/format";
import Image from "next/image";

const STOCK_LEFT = 17;

const COLOR_MAP: Record<string, { bg: string; label: string; image: string }> = {
  Pink: { bg: "bg-pink-400", label: "Pink", image: "/images/product-pink.png" },
  White: { bg: "bg-white", label: "White", image: "/images/product-white.png" },
  Black: { bg: "bg-neutral-900", label: "Black", image: "/images/product-black.png" },
};

function useCountdown() {
  const getMsUntilMidnightET = useCallback(() => {
    const now = new Date();
    const etNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/New_York" })
    );
    const hoursLeft = 23 - etNow.getHours();
    const minutesLeft = 59 - etNow.getMinutes();
    const secondsLeft = 59 - etNow.getSeconds();
    return Math.max(hoursLeft * 3600 + minutesLeft * 60 + secondsLeft, 0);
  }, []);

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    setSecondsLeft(getMsUntilMidnightET());
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null || prev <= 1) return getMsUntilMidnightET();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [getMsUntilMidnightET]);

  if (secondsLeft === null) return null;

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

const trustItems = [
  { icon: Shield, label: "Secure Checkout" },
  { icon: Truck, label: "Free Shipping" },
  { icon: RotateCcw, label: "30-Day Guarantee" },
];

export default function PurchaseBox() {
  const [tier, setTier] = useState<"premium" | "basic">("premium");
  const [color, setColor] = useState("Pink");
  const [quantity, setQuantity] = useState(1);
  const countdown = useCountdown();

  const activeProduct = tier === "premium" ? PRODUCT : PRODUCT_BASIC;
  const subtotal = activeProduct.price * quantity;
  const availableColors = activeProduct.colors;

  // When tier changes to basic, auto-set color to Black
  useEffect(() => {
    if (tier === "basic") {
      setColor("Black");
    }
  }, [tier]);

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () =>
    setQuantity((q) => Math.min(activeProduct.maxQuantity, q + 1));

  return (
    <section id="buy" className="bg-black py-20 sm:py-28">
      <div className="container mx-auto px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="w-full max-w-lg rounded-2xl border border-amber-500/20 bg-neutral-900 p-8 sm:p-10 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
        >
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/30 px-4 py-1 text-sm font-semibold text-amber-500 tracking-wide">
              Special Offer
            </span>
          </div>

          {/* Product image */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-full aspect-[4/3] max-w-sm rounded-xl overflow-hidden bg-neutral-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={COLOR_MAP[color]?.image ?? COLOR_MAP.Black.image}
                    alt={`LumiRead in ${color}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 480px) 100vw, 400px"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Tier toggle */}
          <div className="mb-6">
            <div className="flex rounded-full bg-neutral-800 p-1">
              <button
                onClick={() => setTier("basic")}
                className={`flex-1 rounded-full py-2.5 px-4 text-sm font-semibold transition-all ${
                  tier === "basic"
                    ? "bg-amber-500 text-black shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Basic {formatUSD(PRODUCT_BASIC.price)}
              </button>
              <button
                onClick={() => setTier("premium")}
                className={`flex-1 rounded-full py-2.5 px-4 text-sm font-semibold transition-all ${
                  tier === "premium"
                    ? "bg-amber-500 text-black shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Premium {formatUSD(PRODUCT.price)}
              </button>
            </div>
            <p className="text-center text-xs text-neutral-500 mt-2">
              {tier === "basic"
                ? "Blue LED · Black only"
                : "3 colors · 2 light modes"}
            </p>
          </div>

          {/* Color swatches */}
          <div className="mb-6">
            <p className="text-xs text-neutral-500 text-center mb-3">Color</p>
            <div className="flex items-center justify-center gap-3">
              {availableColors.map((c) => {
                const colorInfo = COLOR_MAP[c];
                if (!colorInfo) return null;
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={colorInfo.label}
                    className={`w-8 h-8 rounded-full ${colorInfo.bg} transition-all ${
                      c === "Black" ? "border border-neutral-600" : ""
                    } ${
                      isSelected
                        ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900"
                        : "hover:ring-1 hover:ring-white/30 hover:ring-offset-1 hover:ring-offset-neutral-900"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center mb-8">
            <p className="text-neutral-500 line-through text-lg">
              {formatUSD(activeProduct.originalPrice)}
            </p>
            <p className="text-amber-500 text-5xl font-bold font-serif mt-1">
              {formatUSD(activeProduct.price)}
            </p>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              className="flex items-center justify-center h-10 w-10 rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="w-12 text-center text-xl font-semibold text-white tabular-nums">
              {quantity}
            </span>

            <button
              onClick={increment}
              disabled={quantity >= activeProduct.maxQuantity}
              className="flex items-center justify-center h-10 w-10 rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Dynamic price calculations */}
          <div className="space-y-3 mb-8 text-sm">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal ({quantity}x)</span>
              <span className="text-white font-medium">
                {formatUSD(subtotal)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Shipping</span>
              <span className="rounded-md bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-green-400 font-semibold">
                FREE
              </span>
            </div>
          </div>

          {/* Stock urgency */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-sm text-red-400 font-medium">
              Only {STOCK_LEFT} units left!
            </span>
          </div>

          {/* Countdown */}
          <p className="text-center text-sm text-neutral-500 mb-8">
            Offer expires in{" "}
            <span className="text-white font-mono font-semibold">
              {countdown ?? "--:--:--"}
            </span>
          </p>

          {/* CTA - links to Stripe Payment Link */}
          <Button
            asChild
            size="lg"
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg py-6 rounded-full shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40"
          >
            <a href={`${activeProduct.paymentLink}?client_reference_id=${tier}_${color}`} target="_blank" rel="noopener noreferrer">
              BUY NOW
            </a>
          </Button>

          {/* Trust badges */}
          <div className="mt-8 flex justify-center gap-6 flex-wrap">
            {trustItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-neutral-500 text-xs"
              >
                <Icon className="h-4 w-4 text-neutral-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
