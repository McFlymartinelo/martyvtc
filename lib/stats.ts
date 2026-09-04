import { StatutReservation } from "@prisma/client";
import { brand } from "@/config/brand";
import { prisma } from "@/lib/prisma";

export type HomeStats = {
  trajets: number;
  note: number;
  ponctualite: number;
};

// Le nombre de trajets vient de la vraie base (réservations terminées). Tant que
// l'activité démarre, on retombe sur la valeur de config/brand.ts pour ne pas
// afficher un "0" décourageant sur une page publique.
// Note et ponctualité restent pilotées à la main (config/brand.ts) : rien dans le
// modèle Prisma ne mesure aujourd'hui la satisfaction client ou la ponctualité —
// il faudrait un système d'avis/notation pour les rendre réels à leur tour.
export async function getHomeStats(): Promise<HomeStats> {
  let trajetsReels = 0;
  try {
    trajetsReels = await prisma.reservation.count({
      where: { statut: StatutReservation.TERMINEE },
    });
  } catch (error) {
    console.error("[getHomeStats] base injoignable, repli sur config/brand.ts", error);
  }

  return {
    trajets: trajetsReels > 0 ? trajetsReels : brand.stats.trajets,
    note: brand.stats.note,
    ponctualite: brand.stats.ponctualite,
  };
}
