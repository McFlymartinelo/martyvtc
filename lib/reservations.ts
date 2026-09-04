import { StatutReservation } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { creneauEstLibre } from "@/lib/disponibilites";
import { estimerDevis, type TypeCourse } from "@/lib/quote";
import type { ZoneId } from "@/config/tarifs";
import type { ReservationInput } from "@/lib/validations/reservation";

export class ReservationError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export async function creerReservation(userId: string, input: ReservationInput) {
  const dateHeure = new Date(input.dateHeure);

  if (dateHeure.getTime() < Date.now()) {
    throw new ReservationError("Impossible de réserver dans le passé.");
  }

  const libre = await creneauEstLibre(dateHeure);
  if (!libre) {
    throw new ReservationError("Ce créneau n'est plus disponible.");
  }

  const devis = estimerDevis({
    typeCourse: input.typeCourse,
    zoneDepart: input.zoneDepart as ZoneId,
    zoneArrivee: input.zoneArrivee as ZoneId,
    dateHeure,
    heuresDisposition: input.heuresDisposition,
    siegeEnfant: input.siegeEnfant,
  });

  return prisma.reservation.create({
    data: {
      userId,
      depart: input.depart,
      arrivee: input.arrivee,
      dateHeure,
      nombrePassagers: input.nombrePassagers,
      commentaire: input.commentaire || null,
      typeCourse: input.typeCourse,
      zoneDepart: input.zoneDepart,
      zoneArrivee: input.zoneArrivee,
      montantEstime: devis.aReglerCents,
      numeroVol: input.numeroVol || null,
      terminal: input.terminal || null,
      heureAtterrissage: input.heureAtterrissage || null,
      attenteApresVol: Boolean(input.attenteApresVol),
      siegeEnfant: Boolean(input.siegeEnfant),
      heuresDisposition: input.typeCourse === "disposition" ? input.heuresDisposition ?? 3 : null,
      pourAutrui: Boolean(input.pourAutrui),
      passagerNom: input.pourAutrui ? input.passagerNom || null : null,
      passagerTelephone: input.pourAutrui ? input.passagerTelephone || null : null,
      statut: StatutReservation.EN_ATTENTE,
    },
    include: { user: true },
  });
}

export async function reservationsDuClient(userId: string) {
  return prisma.reservation.findMany({
    where: { userId },
    include: { paiements: true },
    orderBy: { dateHeure: "desc" },
  });
}

export async function toutesLesReservations() {
  return prisma.reservation.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, telephone: true } },
      paiements: true,
    },
    orderBy: { dateHeure: "desc" },
  });
}

export async function mettreAJourStatut(id: string, statut: StatutReservation) {
  return prisma.reservation.update({ where: { id }, data: { statut } });
}

export type { TypeCourse };
