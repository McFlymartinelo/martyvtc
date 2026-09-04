import type { Metadata } from "next";
import { Suspense } from "react";
import { ReservationWizard } from "@/components/reservation/ReservationWizard";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { brand } from "@/config/brand";

export const metadata: Metadata = { title: "Réserver" };

export default function ReservationPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="site-wrap grid gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Réservation</p>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            Dites-moi où.
            <br />
            Je m&apos;occupe du reste.
          </h1>
          <p className="mt-6 max-w-md text-muted">
            Devis immédiat. Aéroport en 30 secondes. Ou un message WhatsApp.
          </p>
          <div className="mt-8">
            <WhatsAppButton message={`Bonjour ${brand.name}, je voudrais un trajet.`} />
          </div>
        </div>
        <Suspense fallback={<p className="text-muted">Chargement du formulaire…</p>}>
          <ReservationWizard />
        </Suspense>
      </div>
    </section>
  );
}
