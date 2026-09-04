import type { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { SuccessCheck } from "@/components/reservation/SuccessCheck";
import { prisma } from "@/lib/prisma";
import { formatEuros } from "@/lib/utils";

export const metadata: Metadata = { title: "Paiement reçu" };
export const dynamic = "force-dynamic";

export default async function PaiementSuccesPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const paiement = searchParams.session_id
    ? await prisma.paiement.findUnique({
        where: { stripeCheckoutId: searchParams.session_id },
        include: { reservation: true },
      })
    : null;

  return (
    <section className="site-wrap flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <SuccessCheck />
      <h1 className="mt-10 font-display text-4xl font-semibold tracking-tight sm:text-6xl">Paiement reçu.</h1>
      {paiement ? (
        <p className="mt-4 max-w-md text-muted">
          {formatEuros(paiement.montant)} · {paiement.reservation.depart} → {paiement.reservation.arrivee}
          <br />
          {format(paiement.reservation.dateHeure, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
        </p>
      ) : (
        <p className="mt-4 text-muted">Un reçu vous a été envoyé par e-mail.</p>
      )}
      <Link href="/compte" className="btn-primary mt-10">
        Mon compte
      </Link>
    </section>
  );
}
