import { z } from "zod";

export const disponibiliteSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide."),
  heureDebut: z.string().regex(/^\d{2}:\d{2}$/, "Heure de début invalide."),
  heureFin: z.string().regex(/^\d{2}:\d{2}$/, "Heure de fin invalide."),
  estDisponible: z.boolean().default(true),
});

export const disponibiliteJourSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ouvert: z.boolean(),
  creneaux: z
    .array(
      z.object({
        heureDebut: z.string().regex(/^\d{2}:\d{2}$/),
        heureFin: z.string().regex(/^\d{2}:\d{2}$/),
      }),
    )
    .optional(),
});

export type DisponibiliteInput = z.infer<typeof disponibiliteSchema>;
