"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { formatEuros } from "@/lib/utils";

type StatutReservation = "EN_ATTENTE" | "CONFIRMEE" | "TERMINEE" | "ANNULEE";

type Row = {
  id: string;
  depart: string;
  arrivee: string;
  dateHeure: string | Date;
  nombrePassagers: number;
  statut: StatutReservation;
  numeroVol?: string | null;
  pourAutrui?: boolean;
  passagerNom?: string | null;
  passagerTelephone?: string | null;
  siegeEnfant?: boolean;
  user: { name: string | null; email: string; telephone: string | null };
  paiements: { montant: number; statut: string }[];
};

const labels: Record<StatutReservation, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

export function ReservationTable({ reservations }: { reservations: Row[] }) {
  const router = useRouter();

  const update = async (id: string, statut: StatutReservation) => {
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    router.refresh();
  };

  if (reservations.length === 0) {
    return <p className="text-muted">Aucune réservation pour le moment.</p>;
  }

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
          <tr>
            <th className="px-4 py-3">Quand</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Trajet</th>
            <th className="px-4 py-3">Paiement</th>
            <th className="px-4 py-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} className="border-b border-line last:border-0">
              <td className="px-4 py-4">
                {format(new Date(r.dateHeure), "d MMM, HH:mm", { locale: fr })}
                <div className="text-xs text-muted">{r.nombrePassagers} pax</div>
              </td>
              <td className="px-4 py-4">
                {r.user.name}
                <div className="text-xs text-muted">{r.user.email}</div>
              </td>
              <td className="px-4 py-4">
                {r.depart} → {r.arrivee}
                <div className="text-xs text-muted">
                  {r.numeroVol ? `Vol ${r.numeroVol}` : ""}
                  {r.pourAutrui && r.passagerNom ? ` · ${r.passagerNom} ${r.passagerTelephone ?? ""}` : ""}
                  {r.siegeEnfant ? " · siège enfant" : ""}
                </div>
              </td>
              <td className="px-4 py-4">
                {r.paiements[0] ? `${formatEuros(r.paiements[0].montant)} · ${r.paiements[0].statut}` : "—"}
              </td>
              <td className="px-4 py-4">
                <select
                  className="field !py-2"
                  value={r.statut}
                  onChange={(e) => update(r.id, e.target.value as StatutReservation)}
                >
                  {Object.entries(labels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
