import { addMinutes, format, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { jourUtc } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

export function slotKey(date: Date, heureDebut: string) {
  return `${format(date, "yyyy-MM-dd")}-${heureDebut}`;
}

export async function getDisponibilitesMois(annee: number, mois: number) {
  const debut = new Date(Date.UTC(annee, mois - 1, 1));
  const fin = new Date(Date.UTC(annee, mois, 1));

  const [creneaux, reservations] = await Promise.all([
    prisma.disponibilite.findMany({
      where: { date: { gte: debut, lt: fin } },
      orderBy: [{ date: "asc" }, { heureDebut: "asc" }],
    }),
    prisma.reservation.findMany({
      where: {
        dateHeure: { gte: debut, lt: fin },
        statut: { in: ["EN_ATTENTE", "CONFIRMEE"] },
      },
      select: { dateHeure: true },
    }),
  ]);

  const reserves = new Set(
    reservations.map((r) => format(r.dateHeure, "yyyy-MM-dd'T'HH:mm")),
  );

  return creneaux.map((c) => {
    const jour = c.date.toISOString().slice(0, 10);
    const occupe = reserves.has(`${jour}T${c.heureDebut}`);
    return {
      id: c.id,
      date: jour,
      heureDebut: c.heureDebut,
      heureFin: c.heureFin,
      estDisponible: c.estDisponible && !occupe,
      occupe,
    };
  });
}

export async function creneauEstLibre(dateHeure: Date) {
  const jour = jourUtc(dateHeure);
  const heure = format(dateHeure, "HH:mm");

  const creneau = await prisma.disponibilite.findFirst({
    where: {
      date: jour,
      heureDebut: heure,
      estDisponible: true,
    },
  });

  if (!creneau) return false;

  const existante = await prisma.reservation.findFirst({
    where: {
      dateHeure,
      statut: { in: ["EN_ATTENTE", "CONFIRMEE"] },
    },
  });

  return !existante;
}

export async function getApercuDisponibilites(jours = 14) {
  const debut = startOfDay(new Date());
  const fin = addMinutes(debut, jours * 24 * 60);

  return getDisponibilitesMois(debut.getFullYear(), debut.getMonth() + 1).then((all) =>
    all.filter((c) => {
      const d = parseISO(`${c.date}T${c.heureDebut}:00`);
      return d >= debut && d < fin && c.estDisponible;
    }),
  );
}

export function labelJour(date: string) {
  return format(parseISO(date), "EEEE d MMMM", { locale: fr });
}
