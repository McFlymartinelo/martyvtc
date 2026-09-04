import { z } from "zod";

export const inscriptionSchema = z
  .object({
    nom: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
    email: z.string().trim().email("Adresse e-mail invalide."),
    telephone: z
      .string()
      .trim()
      .min(8, "Numéro trop court.")
      .max(20, "Numéro trop long.")
      .optional()
      .or(z.literal("")),
    motDePasse: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmation: z.string(),
  })
  .refine((data) => data.motDePasse === data.confirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmation"],
  });

export const connexionSchema = z.object({
  email: z.string().trim().email("Adresse e-mail invalide."),
  motDePasse: z.string().min(1, "Mot de passe requis."),
});

export type InscriptionInput = z.infer<typeof inscriptionSchema>;
export type ConnexionInput = z.infer<typeof connexionSchema>;
