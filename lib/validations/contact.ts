import { z } from "zod";

export const contactSchema = z.object({
  nom: z.string().trim().min(2, "Le nom est requis."),
  email: z.string().trim().email("Adresse e-mail invalide."),
  telephone: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères."),
  consentement: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter l'utilisation de vos données pour envoyer ce message." }),
  }),
  societe: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
