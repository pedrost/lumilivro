"use client";

import { SOCIAL_PROOF_SNIPPETS } from "@/lib/constants";

export default function SocialProofTicker() {
  // Duplicate the snippets so the marquee loops seamlessly
  const doubled = [...SOCIAL_PROOF_SNIPPETS, ...SOCIAL_PROOF_SNIPPETS];

  return (
    <section className="relative bg-neutral-950 border-y border-amber-500/20 py-4 overflow-hidden select-none">
      {/* Amber accent lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((snippet, i) => (
          <span key={i} className="flex items-center gap-4 px-4">
            <span className="text-neutral-300 text-sm font-medium">
              {snippet}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          </span>
        ))}
      </div>
    </section>
  );
}
