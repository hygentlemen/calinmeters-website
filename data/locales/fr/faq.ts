import type { FaqItem } from '@/data/faq';

export interface FrenchFaqTranslation extends FaqItem {
  sourceQuestion: string;
}

export const frenchFaqTranslations = [
  {
    sourceQuestion: 'What is an STS prepaid electricity meter?',
    question: "Qu'est-ce qu'un compteur électrique prépayé STS ?",
    answer:
      "Un compteur électrique prépayé STS utilise la spécification Standard Transfer Specification pour accepter des jetons sécurisés de recharge à 20 chiffres. Ce fonctionnement convient notamment aux services publics, bailleurs et gestionnaires immobiliers qui souhaitent contrôler le crédit par jeton sans maintenir chaque compteur connecté en permanence.",
  },
  {
    sourceQuestion: 'When should a project use a three-phase prepaid electricity meter?',
    question: 'Quand faut-il choisir un compteur électrique prépayé triphasé ?',
    answer:
      "Un compteur électrique prépayé triphasé est normalement utilisé pour un raccordement commercial, industriel ou de service public alimenté en triphasé. Avant de choisir un modèle, il faut confirmer la tension nominale, le courant maximal ou le rapport de transformateur de courant, le mode de pose, la classe de précision, la couverture de communication et les exigences du marché de destination.",
  },
  {
    sourceQuestion: 'What is the difference between the CA368 GPRS and standalone STS models?',
    question: 'Quelle est la différence entre les modèles CA368 GPRS et STS autonome ?',
    answer:
      "Les deux modèles CA368 prennent en charge le prépaiement STS par jeton à 20 chiffres pour les raccordements triphasés. Le modèle CA368 GPRS ajoute une communication cellulaire directe pour la relève, le suivi et la gestion à distance. Le CA368 STS autonome utilise la saisie du jeton au clavier sans exiger de communication distante permanente.",
  },
  {
    sourceQuestion: 'When should a utility choose a split keypad prepaid meter?',
    question: 'Quand faut-il choisir un compteur prépayé avec clavier séparé ?',
    answer:
      "Une configuration avec clavier séparé est utile lorsque le compteur principal est installé à l'extérieur, dans un coffret fermé, sur un poteau ou dans un emplacement où le client ne doit pas accéder au câblage. L'unité d'interface client (CIU) fournit alors un clavier intérieur pour saisir les jetons et consulter les informations disponibles.",
  },
  {
    sourceQuestion: 'Does a prepaid meter have to come with a SIM card?',
    question: 'Un compteur prépayé doit-il utiliser une carte SIM ?',
    answer:
      "Non. Le fonctionnement prépayé STS repose sur un système sécurisé de messages qui ne nécessite pas Internet : le système de vente de crédit chiffre les informations pour produire un jeton à 20 chiffres, que l'utilisateur saisit au clavier. Une carte SIM n'est nécessaire que si la configuration choisie utilise un réseau cellulaire pour la relève ou la gestion à distance.",
  },
  {
    sourceQuestion: 'How does a token based prepaid meter work?',
    question: 'Comment fonctionne un compteur prépayé à jeton ?',
    answer:
      "L'opérateur enregistre le compteur dans un système de vente de crédit. Après l'achat du crédit, le système génère un jeton STS sécurisé à 20 chiffres que le client saisit sur le compteur ou sur la CIU. Une architecture GPRS, LoRaWAN ou AMI peut ajouter des fonctions distantes lorsque le projet les prévoit.",
  },
  {
    sourceQuestion: 'What is an STS prepaid water meter?',
    question: "Qu'est-ce qu'un compteur d'eau prépayé STS ?",
    answer:
      "Un compteur d'eau prépayé STS utilise un jeton enregistré à 20 chiffres pour charger le crédit d'eau acheté. Le client saisit le jeton sur le clavier du compteur ou sur une unité d'interface client, puis le compteur applique ce crédit selon les règles configurées de vanne et de tarification. LoRaWAN ou une autre option prise en charge peut ajouter la relève à distance, mais le jeton STS et le réseau de communication remplissent des rôles distincts.",
  },
  {
    sourceQuestion: 'What is the difference between brass and plastic water meters?',
    question: "Quelle est la différence entre un compteur d'eau en laiton et en plastique ?",
    answer:
      "Le laiton offre un corps métallique et peut être retenu lorsque le projet privilégie une meilleure résistance aux chocs. Le plastique réduit le poids du corps et peut convenir aux installations standard sensibles au coût. Le choix dépend aussi des conditions de l'eau, du diamètre, du lieu de pose, des spécifications du service public, du plan de maintenance et de la configuration proposée.",
  },
  {
    sourceQuestion: 'What is the difference between multi-jet and ultrasonic prepaid water meters?',
    question: "Quelle est la différence entre un compteur d'eau multijet et ultrasonique ?",
    answer:
      "Un compteur multijet utilise un mécanisme de mesure mécanique et est souvent retenu pour son principe connu et son coût initial plus faible. Un corps en plastique convient aux installations standard sensibles au coût, tandis qu'un corps en laiton fournit une enveloppe métallique. Un compteur ultrasonique ne comporte pas de pièce mobile de mesure. Dans tous les cas, il faut confirmer le débit, la qualité de l'eau, la pose, la communication, la batterie et les exigences de destination.",
  },
  {
    sourceQuestion: 'What information is needed for a LoRaWAN smart water meter quotation?',
    question: "Quelles informations fournir pour un devis de compteurs d'eau LoRaWAN ?",
    answer:
      "Indiquez le diamètre, la plage de débit, la qualité et la température de l'eau, l'orientation de pose, le matériau du corps, le principe multijet ou ultrasonique, les besoins de vanne et de prépaiement STS, l'accès par clavier ou CIU, la communication, la densité de compteurs, le plan de passerelles et de liaison de collecte, la quantité et les exigences du service public de destination.",
  },
  {
    sourceQuestion: 'How should a utility plan LoRaWAN coverage for smart water meters?',
    question: "Comment planifier la couverture LoRaWAN des compteurs d'eau ?",
    answer:
      "Commencez par une étude de site et un pilote au lieu de vous fier uniquement à une distance maximale annoncée. Les matériaux des bâtiments, le relief, les regards de compteur, la hauteur de pose, les emplacements enterrés, les interférences, la position des passerelles et la liaison de collecte influencent la couverture réelle. Testez des emplacements représentatifs avant de fixer le nombre de passerelles et le plan de déploiement.",
  },
  {
    sourceQuestion: 'Can ultrasonic meters work without a CIU?',
    question: "Un compteur d'eau ultrasonique peut-il fonctionner sans CIU ?",
    answer:
      "Le modèle ultrasonique peut fonctionner sans CIU puisqu'il possède un clavier intégré. Une CIU peut toutefois faciliter l'accès lorsque le compteur est installé à l'extérieur ou dans un coffret protégé. La configuration finale doit préciser le lieu de pose et le mode d'accès du client.",
  },
] satisfies FrenchFaqTranslation[];

export const frenchFaqItems: FaqItem[] = frenchFaqTranslations.map(
  (translation) => ({
    question: translation.question,
    answer: translation.answer,
  }),
);

export function getFrenchFaqItemsByQuestions(questions: string[]) {
  return questions.flatMap((question) => {
    const item = frenchFaqItems.find((candidate) => candidate.question === question);
    return item ? [item] : [];
  });
}
