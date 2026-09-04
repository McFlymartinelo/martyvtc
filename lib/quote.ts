import { brand } from "@/config/brand";
import { tarifs, zones, type ZoneId } from "@/config/tarifs";

export type TypeCourse = "ville" | "aeroport" | "disposition";

export type QuoteInput = {
  typeCourse: TypeCourse;
  zoneDepart: ZoneId;
  zoneArrivee: ZoneId;
  dateHeure?: Date | string | null;
  heuresDisposition?: number;
  siegeEnfant?: boolean;
};

export type Quote = {
  baseCents: number;
  supplementNuitCents: number;
  siegeEnfantCents: number;
  totalCents: number;
  aReglerCents: number;
  estNuit: boolean;
  label: string;
};

function grilleKey(a: ZoneId, b: ZoneId) {
  return [a, b].sort().join("-");
}

export function estNuit(date?: Date | string | null) {
  if (!date) return false;
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return false;
  const h = d.getHours();
  return h >= tarifs.nuitDebutHeure || h < tarifs.nuitFinHeure;
}

export function estimerDevis(input: QuoteInput): Quote {
  let baseCents: number = tarifs.prixReservationDefautCents;
  let label = "Course";

  if (input.typeCourse === "disposition") {
    const heures = Math.max(tarifs.dispositionMinimumHeures, input.heuresDisposition ?? tarifs.dispositionMinimumHeures);
    baseCents = tarifs.dispositionHeureCents * heures;
    label = `Mise à disposition · ${heures} h`;
  } else {
    const key = grilleKey(input.zoneDepart, input.zoneArrivee);
    baseCents = tarifs.grille[key as keyof typeof tarifs.grille] ?? tarifs.prixReservationDefautCents;
    const from = zones.find((z) => z.id === input.zoneDepart)?.label ?? input.zoneDepart;
    const to = zones.find((z) => z.id === input.zoneArrivee)?.label ?? input.zoneArrivee;
    label = input.typeCourse === "aeroport" ? `Aéroport · ${from} → ${to}` : `${from} → ${to}`;
  }

  const nuit = estNuit(input.dateHeure);
  const supplementNuitCents = nuit ? Math.round((baseCents * tarifs.supplementNuitPourcent) / 100) : 0;
  const siegeEnfantCents = input.siegeEnfant ? tarifs.siegeEnfantCents : 0;
  const totalCents = baseCents + supplementNuitCents + siegeEnfantCents;
  const aReglerCents = Math.round((totalCents * brand.acomptePourcent) / 100);

  return {
    baseCents,
    supplementNuitCents,
    siegeEnfantCents,
    totalCents,
    aReglerCents,
    estNuit: nuit,
    label,
  };
}

export function labelZone(id: ZoneId) {
  return zones.find((z) => z.id === id)?.label ?? id;
}
