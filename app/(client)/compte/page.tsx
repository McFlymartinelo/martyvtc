import type { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { reservationsDuClient } from "@/lib/reservations";
import { formatEuros } from "@/lib/utils";

export const metadata: Metadata = { title: "Mon compte" };
export const dynamic = "force-dynamic";

const labels = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

export default async function ComptePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion?callbackUrl=/compte");

  const reservations = await reservationsDuClient(session.user.id);
  const aVenir = reservations.filter((r) => r.dateHeure >= new Date() && r.statut !== "ANNULEE");
  const passees = reservations.filter((r) => r.dateHeure < new Date() || r.statut === "TERMINEE");

  return (
    <section className="site-wrap py-16 sm:py-24">
      <p className="text-xs uppercase tracking-[0.22em] text-accent">Compte</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">
        {session.user.name ?? "Votre espace"}
      </h1>
      <p className="mt-3 text-muted">{session.user.email}</p>

      <h2 className="mt-16 font-display text-3xl font-semibold">À venir</h2>
      <Liste reservations={aVenir} empty="Aucun trajet à venir." />

      <h2 className="mt-16 font-display text-3xl font-semibold">Historique</h2>
      <Liste reservations={passees} empty="Pas encore d'historique." />
    </section>
  );
}

function Liste({
  reservations,
  empty,
}: {
  reservations: Awaited<ReturnType<typeof reservationsDuClient>>;
  empty: string;
}) {
  if (reservations.length === 0) {
    return <p className="mt-4 text-muted">{empty}</p>;
  }

  return (
    <ul className="mt-6 divide-y divide-line border border-line">
      {reservations.map((r) => (
        <li key={r.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="font-display text-xl">
              {r.depart} → {r.arrivee}
            </p>
            <p className="mt-1 text-sm text-muted">
              {format(r.dateHeure, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })} · {r.nombrePassagers} pax
              {r.pourAutrui && r.passagerNom ? ` · pour ${r.passagerNom}` : ""}
              {r.numeroVol ? ` · vol ${r.numeroVol}` : ""}
            </p>
          </div>
          <div className="text-sm text-right">
            <p className="text-accent">{labels[r.statut]}</p>
            {r.paiements[0] && <p className="text-muted">{formatEuros(r.paiements[0].montant)}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
