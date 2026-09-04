import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Paiement annulé" };

export default function PaiementAnnulePage() {
  return (
    <section className="site-wrap flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">Paiement interrompu.</h1>
      <p className="mt-4 max-w-md text-muted">Aucun débit. Vous pouvez reprendre la réservation quand vous voulez.</p>
      <Link href="/reservation" className="btn-primary mt-10">
        Revenir à la réservation
      </Link>
    </section>
  );
}
