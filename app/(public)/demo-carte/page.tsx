import type { Metadata } from "next";
import { AnimatedCardPayment } from "@/components/payment/AnimatedCardPayment";

export const metadata: Metadata = {
  title: "Démo — Carte de paiement",
  robots: { index: false, follow: false },
};

export default function DemoCartePage() {
  return (
    <section className="site-wrap flex min-h-[80vh] flex-col items-center justify-center gap-6 py-24">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">Aperçu — composant visuel uniquement</p>
      <AnimatedCardPayment amountCents={20000} description="Acompte à régler" />
    </section>
  );
}
