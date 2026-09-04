"use client";

import { motion } from "framer-motion";
import { brand } from "@/config/brand";
import type { HomeStats } from "@/lib/stats";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { VehicleParallax } from "@/components/home/VehicleParallax";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero({ stats }: { stats: HomeStats }) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_52%)]" />
      <div className="site-wrap relative flex min-h-[calc(100svh-6rem)] flex-col justify-center py-12">
        <motion.p
          custom={0}
          variants={fade}
          initial="hidden"
          animate="show"
          className="text-xs uppercase tracking-[0.28em] text-accent"
        >
          {brand.contact.zone}
        </motion.p>
        <motion.h1
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-5xl font-display text-[12vw] font-semibold leading-[0.86] tracking-tighterx sm:text-7xl lg:text-8xl"
        >
          {brand.headline}
          <span className="mt-2 block text-accent">{brand.headlineAccent}</span>
        </motion.h1>
        <motion.p
          custom={2}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-xl text-base text-muted sm:text-lg"
        >
          {brand.description}
        </motion.p>
        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <MagneticButton href="/reservation">Réserver un trajet</MagneticButton>
          <MagneticButton href="/reservation?type=aeroport" className="!bg-transparent !text-paper hairline">
            Course aéroport
          </MagneticButton>
          <WhatsAppButton />
        </motion.div>
        <motion.div custom={4} variants={fade} initial="hidden" animate="show" className="mt-16">
          <VehicleParallax />
        </motion.div>
        <motion.dl
          custom={5}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8"
        >
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-muted">Trajets</dt>
            <dd className="font-display text-3xl font-semibold">
              <AnimatedCounter value={stats.trajets} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-muted">Note</dt>
            <dd className="font-display text-3xl font-semibold">
              <AnimatedCounter value={stats.note} decimals={1} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-muted">Ponctualité</dt>
            <dd className="font-display text-3xl font-semibold">
              <AnimatedCounter value={stats.ponctualite} suffix="%" />
            </dd>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
