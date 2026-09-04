import type { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { SuccessCheck } from "@/components/reservation/SuccessCheck";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Réservation confirmée" };
export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const session = await auth();
  if (!searchParams.id || !session?.user) notFound();

  const reservation = await prisma.reservation.findFirst({
    where: { id: searchParams.id, userId: session.user.id },
  });
  if (!reservation) notFound();

  return (
    <section className="site-wrap flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <SuccessCheck />
      <h1 className="mt-10 font-display text-4xl font-semibold tracking-tight sm:text-6xl">C&apos;est noté.</h1>
      <p className="mt-4 max-w-md text-muted">
        {reservation.depart} → {reservation.arrivee}
        <br />
        {format(reservation.dateHeure, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
        {reservation.numeroVol ? ` · vol ${reservation.numeroVol}` : ""}
        {reservation.pourAutrui && reservation.passagerNom ? ` · passager ${reservation.passagerNom}` : ""}
      </p>
      <Link href="/compte" className="btn-primary mt-10">
        Voir mes réservations
      </Link>
    </section>
  );
}
