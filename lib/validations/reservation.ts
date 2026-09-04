import { z } from "zod";
import { zones } from "@/config/tarifs";

const zoneId = z.enum(zones.map((z) => z.id) as [string, ...string[]]);

export const reservationSchema = z
  .object({
    typeCourse: z.enum(["ville", "aeroport", "disposition"]),
    zoneDepart: zoneId,
    zoneArrivee: zoneId,
    depart: z.string().trim().min(3, "Indiquez une adresse de départ."),
    arrivee: z.string().trim().min(3, "Indiquez une adresse d'arrivée."),
    dateHeure: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), "Date et heure invalides."),
    nombrePassagers: z.coerce.number().int().min(1, "Au moins 1 passager.").max(6, "Maximum 6 passagers."),
    commentaire: z.string().trim().max(500).optional().or(z.literal("")),
    heuresDisposition: z.coerce.number().int().min(3).max(16).optional(),
    numeroVol: z.string().trim().max(12).optional().or(z.literal("")),
    terminal: z.string().trim().max(20).optional().or(z.literal("")),
    heureAtterrissage: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure invalide.")
      .optional()
      .or(z.literal("")),
    attenteApresVol: z.boolean().optional(),
    siegeEnfant: z.boolean().optional(),
    pourAutrui: z.boolean().optional(),
    passagerNom: z.string().trim().max(80).optional().or(z.literal("")),
    passagerTelephone: z.string().trim().max(20).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.typeCourse === "aeroport" && !data.numeroVol) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Le numéro de vol est requis.", path: ["numeroVol"] });
    }
    if (data.pourAutrui && (!data.passagerNom || data.passagerNom.length < 2)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nom du passager requis.", path: ["passagerNom"] });
    }
    if (data.pourAutrui && (!data.passagerTelephone || data.passagerTelephone.length < 8)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Téléphone du passager requis.",
        path: ["passagerTelephone"],
      });
    }
  });

export type ReservationInput = z.infer<typeof reservationSchema>;
