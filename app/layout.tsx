import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { brand } from "@/config/brand";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cssVars = {
    "--background": brand.colors.background,
    "--foreground": brand.colors.secondary,
    "--accent": brand.colors.accent,
    "--accent-foreground": brand.colors.accentForeground,
    "--secondary": brand.colors.secondary,
    "--surface": brand.colors.surface,
    "--surface-raised": brand.colors.surfaceRaised,
    "--border": brand.colors.border,
    "--muted": brand.colors.muted,
    "--danger": brand.colors.danger,
  } as CSSProperties;

  return (
    <html lang="fr">
      <body className={`${display.variable} ${body.variable} bg-ink font-sans text-paper antialiased`} style={cssVars}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
