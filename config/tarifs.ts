export const zones = [
  { id: "paris", label: "Paris", hint: "Intra-muros" },
  { id: "banlieue", label: "Banlieue", hint: "Petite couronne" },
  { id: "cdg", label: "CDG", hint: "Roissy" },
  { id: "orly", label: "Orly", hint: "ORY" },
  { id: "beauvais", label: "Beauvais", hint: "BVA" },
] as const;

export type ZoneId = (typeof zones)[number]["id"];

export const aeroports = ["cdg", "orly", "beauvais"] as const;
export type AeroportId = (typeof aeroports)[number];

export const tarifs = {
  devise: "EUR",
  mention:
    "Tarifs indicatifs. Le prix définitif est confirmé à la réservation selon le trajet, l'horaire et le nombre de passagers.",
  prixReservationDefautCents: 4500,
  supplementNuitPourcent: 15,
  nuitDebutHeure: 22,
  nuitFinHeure: 6,
  siegeEnfantCents: 0,
  dispositionHeureCents: 7000,
  dispositionMinimumHeures: 3,
  // Clé = zones triées alphabétiquement, montant en centimes.
  grille: {
    "banlieue-banlieue": 3800,
    "banlieue-beauvais": 13000,
    "banlieue-cdg": 7500,
    "banlieue-orly": 6500,
    "banlieue-paris": 4200,
    "beauvais-beauvais": 4000,
    "beauvais-cdg": 14000,
    "beauvais-orly": 13000,
    "beauvais-paris": 12000,
    "cdg-cdg": 4000,
    "cdg-orly": 8500,
    "cdg-paris": 6500,
    "orly-orly": 4000,
    "orly-paris": 5500,
    "paris-paris": 3500,
  } satisfies Record<string, number>,
  courses: [
    {
      id: "ville",
      nom: "Course ville",
      description: "Trajets intra-muros, gares, rendez-vous.",
      aPartirDe: 35,
      unite: "à partir de",
      details: ["Prise en charge 10 min", "Jusqu'à 3 passagers", "Eau & chargeurs"],
    },
    {
      id: "aeroport",
      nom: "Aéroport",
      description: "CDG, Orly, Beauvais — suivi de vol inclus.",
      aPartirDe: 55,
      unite: "à partir de",
      details: ["Suivi de vol", "45 min après atterrissage", "Aide aux bagages"],
    },
    {
      id: "disposition",
      nom: "Mise à disposition",
      description: "La journée ou la soirée, à votre rythme.",
      aPartirDe: 70,
      unite: "/ heure",
      details: ["Minimum 3 heures", "Itinéraire libre", "Discrétion totale"],
    },
  ],
  extras: [
    { nom: "Supplément nuit (22h–6h)", valeur: "+15%" },
    { nom: "Siège enfant", valeur: "Sur demande" },
    { nom: "Annulation", valeur: "Gratuite jusqu'à 4h avant" },
  ],
} as const;
