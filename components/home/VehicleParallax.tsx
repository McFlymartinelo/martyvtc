"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function VehicleParallax() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 20 });
  const y = useSpring(my, { stiffness: 60, damping: 20 });
  const rotate = useTransform(x, [-20, 20], [-3, 3]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onMove = (event: MouseEvent) => {
      mx.set((event.clientX / window.innerWidth - 0.5) * 28);
      my.set((event.clientY / window.innerHeight - 0.5) * 16);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <motion.div style={{ x, y, rotate }} className="relative mx-auto w-full max-w-xl">
      <div className="absolute inset-x-10 top-1/2 h-24 -translate-y-1/2 rounded-full bg-accent blur-3xl" style={{ opacity: 0.22 }} />
      <svg viewBox="0 0 640 220" className="relative w-full" aria-hidden>
        <path
          d="M72 148h28l22-46h86l54-28h148l86 28h72l24 46h18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          className="text-paper"
        />
        <path
          d="M122 102h78l42-22h132l64 22h70"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.6"
        />
        <circle cx="188" cy="156" r="28" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="188" cy="156" r="12" fill="var(--accent)" />
        <circle cx="468" cy="156" r="28" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="468" cy="156" r="12" fill="var(--accent)" />
        <path d="M214 148h228" stroke="var(--border)" strokeWidth="1.2" />
      </svg>
    </motion.div>
  );
}
