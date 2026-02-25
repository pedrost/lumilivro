"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { PRODUCT } from "@/lib/constants";
import { formatUSD } from "@/lib/format";

export default function MobileStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 backdrop-blur-md border-t border-white/10 px-4 py-3 safe-area-pb"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-neutral-400 text-xs line-through">
                  {formatUSD(PRODUCT.originalPrice)}
                </span>
                <span className="text-white font-bold text-lg leading-tight">
                  {formatUSD(PRODUCT.price)}
                </span>
              </div>

              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-full px-6 py-3 shadow-lg shadow-amber-500/20 flex-1 max-w-[200px]"
                onClick={() => scrollTo("buy")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
