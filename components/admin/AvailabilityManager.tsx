"use client";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AvailabilityCalendar, type Creneau } from "@/components/reservation/AvailabilityCalendar";

const HEURES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

export function AvailabilityManager({ initial }: { initial: Creneau[] }) {
  const router = useRouter();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [heureDebut, setHeureDebut] = useState("08:00");
  const [heureFin, setHeureFin] = useState("10:00");
  const [error, setError] = useState<string>();

  const duJour = useMemo(() => initial.filter((c) => c.date === date), [initial, date]);

  const add = async () => {
    setError(undefined);
    const res = await fetch("/api/disponibilites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, heureDebut, heureFin, estDisponible: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Impossible d'ouvrir ce créneau.");
      return;
    }
    router.refresh();
  };

  const toggleDay = async (ouvert: boolean) => {
    await Promise.all(
      HEURES.slice(0, -1).map((h, i) =>
        fetch("/api/disponibilites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            heureDebut: h,
            heureFin: HEURES[i + 1],
            estDisponible: ouvert,
          }),
        }),
      ),
    );
    router.refresh();
  };

  const remove = async (id: string) => {
    await fetch(`/api/disponibilites?id=${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <AvailabilityCalendar value={`${date}T${heureDebut}:00`} onSelect={(iso) => setDate(format(parseISO(iso), "yyyy-MM-dd"))} />
      <div>
        <p className="label">Ouvrir un créneau</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="heureDebut">Début</label>
            <select id="heureDebut" className="field" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)}>
              {HEURES.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="heureFin">Fin</label>
            <select id="heureFin" className="field" value={heureFin} onChange={(e) => setHeureFin(e.target.value)}>
              {HEURES.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={add}>
            Ouvrir le créneau
          </button>
          <button type="button" className="btn-ghost" onClick={() => toggleDay(true)}>
            Ouvrir la journée
          </button>
          <button type="button" className="btn-ghost" onClick={() => toggleDay(false)}>
            Fermer la journée
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <ul className="mt-8 space-y-2">
          {duJour.map((c) => (
            <li key={c.id} className="flex items-center justify-between border border-line px-4 py-3 text-sm">
              <span>
                {c.heureDebut}–{c.heureFin} · {c.occupe ? "Réservé" : c.estDisponible ? "Ouvert" : "Fermé"}
              </span>
              <button type="button" className="text-muted hover:text-danger" onClick={() => remove(c.id)}>
                Retirer
              </button>
            </li>
          ))}
          {duJour.length === 0 && (
            <li className="text-sm text-muted">
              Aucun créneau le {format(parseISO(date), "d MMMM", { locale: fr })}.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
