// Informations juridiques du site. Tous les champs marqués [À COMPLÉTER] doivent
// être renseignés avant l'ouverture du site au public — voir mentions-legales, cgv
// et confidentialite qui consomment ces valeurs.
export const legal = {
  exploitant: {
    // Nom de l'exploitant : personne physique (EI/auto-entrepreneur) ou raison sociale.
    nom: "[À COMPLÉTER — nom de l'exploitant ou raison sociale]",
    formeJuridique: "[À COMPLÉTER — ex. Entreprise Individuelle, auto-entrepreneur, SASU...]",
    siret: "[À COMPLÉTER — n° SIRET]",
    rcs: "[À COMPLÉTER — n° RCS et ville d'immatriculation, si applicable]",
    tvaIntracommunautaire: "[À COMPLÉTER — ou \"TVA non applicable, art. 293 B du CGI\" si en franchise en base]",
    adresse: "[À COMPLÉTER — adresse du siège / de l'exploitant]",
    directeurPublication: "[À COMPLÉTER — nom du responsable de la publication]",
  },
  activite: {
    carteVtc: "[À COMPLÉTER — n° de carte professionnelle VTC (registre des exploitants VTC)]",
    assurance: "[À COMPLÉTER — nom de l'assureur et n° de police RC professionnelle]",
    registreVtc: "[À COMPLÉTER — n° d'immatriculation au registre des VTC]",
  },
  hebergement: {
    nom: "[À COMPLÉTER — nom de l'hébergeur / du fournisseur VPS]",
    adresse: "[À COMPLÉTER — adresse de l'hébergeur]",
    telephone: "[À COMPLÉTER]",
  },
  mediateur: {
    // Médiateur de la consommation : obligatoire pour toute relation B2C en France.
    nom: "[À COMPLÉTER — nom du médiateur de la consommation]",
    url: "[À COMPLÉTER — URL du site du médiateur]",
  },
} as const;
