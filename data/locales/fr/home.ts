export const frenchHome = {
  title: 'Compteurs prépayés STS pour les projets d’électricité et d’eau',
  description:
    'Comparez des compteurs électriques et des compteurs d’eau prépayés STS pour les distributeurs, intégrateurs et projets de services publics.',
  eyebrow: 'Solutions de comptage prépayé',
  h1: 'Compteurs prépayés STS pour les projets d’électricité et d’eau',
  directAnswer:
    'CalinMeters fournit des compteurs prépayés STS pour l’électricité et l’eau, avec des modèles monophasés, triphasés, multijets et ultrasoniques. Nous aidons les distributeurs et intégrateurs à comparer le raccordement, le courant ou le débit, l’accès au clavier, la communication et les exigences du projet avant le devis.',
  primaryAction: 'Comparer les compteurs',
  secondaryAction: 'Demander un devis',
  productSection: {
    eyebrow: 'Gamme de produits',
    title: 'Choisissez la famille de compteurs adaptée au projet',
    description:
      'Comparez les caractéristiques publiées, puis confirmez les conditions de raccordement, de communication et d’exploitation avant de demander un devis.',
    electricity: {
      title: 'Compteurs électriques prépayés STS',
      description:
        'Modèles monophasés, triphasés et sur rail DIN, avec saisie locale du jeton ou options de communication selon le modèle.',
      href: '/fr/produits/compteur-electricite-prepaye-sts/',
    },
    water: {
      title: "Compteurs d'eau prépayés STS",
      description:
        'Modèles multijets en plastique ou en laiton et modèle ultrasonique, avec caractéristiques hydrauliques publiées à comparer.',
      href: '/fr/produits/compteur-eau-prepaye-sts/',
    },
  },
  selection: {
    eyebrow: 'Préparer votre projet',
    title: 'Les informations qui permettent de choisir un modèle',
    items: [
      {
        title: 'Définir le service',
        text: "Indiquez le type de raccordement électrique ou le diamètre, le débit, la pression et la température de l'eau.",
      },
      {
        title: 'Choisir l’accès client',
        text: "Précisez si le client saisit le jeton sur le compteur ou sur une unité d'interface client (CIU).",
      },
      {
        title: 'Planifier la communication',
        text: 'Décrivez le besoin de fonctionnement autonome, GPRS, LoRaWAN, PLC ou autre architecture prise en charge.',
      },
      {
        title: 'Confirmer le déploiement',
        text: "Fournissez la quantité, les conditions du pilote et les spécifications du service public ou du pays de destination.",
      },
    ],
  },
  trust: {
    eyebrow: 'Une sélection fondée sur les faits',
    title: 'Des pages produit reliées aux données techniques disponibles',
    description:
      'Les valeurs affichées en français sont contrôlées par rapport aux caractéristiques anglaises publiées. Les choix définitifs restent à confirmer par écrit pour la configuration proposée.',
  },
} as const;
