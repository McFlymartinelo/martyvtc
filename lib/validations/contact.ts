import { z } from "zod";

export const contactSchema = z.object({
  nom: z.string().trim().min(2, "Le nom est requis."),
  email: z.string().trim().email("Adresse e-mail invalide."),
  telephone: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères."),
});

export type ContactInput = z.infer<typeof contactSchema>;
