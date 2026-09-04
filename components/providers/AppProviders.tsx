"use client";

import { SessionProvider } from "next-auth/react";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { CustomCursor } from "@/components/ui/CustomCursor";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MotionConfig reducedMotion="user">
        <CustomCursor />
        {children}
      </MotionConfig>
    </SessionProvider>
  );
}
