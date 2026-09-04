"use client";

import { motion } from "framer-motion";

export function SuccessCheck() {
  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
      <motion.span
        className="absolute inset-0 rounded-full bg-accent" style={{ opacity: 0.2 }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.15, 1], opacity: [0, 1, 0.7] }}
        transition={{ duration: 0.8 }}
      />
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d="M20 33.5 28.5 42 45 23"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.35 }}
        />
      </svg>
    </div>
  );
}
