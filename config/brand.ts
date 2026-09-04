export const brand = {
  name: "Marty",
  legalName: "Marty VTC",
  tagline: "Le trajet, sans le théâtre.",
  headline: "Vous n'avez pas besoin d'une app.",
  headlineAccent: "Vous avez besoin d'un chauffeur.",
  description:
    "Chauffeur VTC indépendant. Ponctuel, discret, véhicule premium. Réservation en quelques secondes — sans plateforme, sans surprise.",
  logo: "/logo.svg",
  colors: {
    accent: "#C6FF3D",
    accentForeground: "#0A0A0A",
    secondary: "#F4F1EA",
    background: "#070707",
    surface: "#101010",
    surfaceRaised: "#161616",
    border: "#242424",
    muted: "#8A8A86",
    danger: "#FF4D4D",
  },
  fonts: {
    display: "Space Grotesk",
    body: "DM Sans",
  },
  contact: {
    email: "contact@example.com",
    telephone: "+33 6 00 00 00 00",
    whatsapp: "+33600000000",
    ville: "Paris",
    zone: "Île-de-France & aéroports",
  },
  social: {
    instagram: "https://instagram.com",
    linkedin: "",
  },
  paiementAvantCourse: true,
  acomptePourcent: 30,
  stats: {
    trajets: 128,
    note: 4.9,
    ponctualite: 99,
  },
} as const;

export type Brand = typeof brand;
