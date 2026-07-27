import type { FrenchCategorySeoPage } from '@/data/locales/types';

export const frenchCategorySeoPages: Record<string, FrenchCategorySeoPage> = {
  'compteur-electricite-prepaye-sts': {
    slug: 'compteur-electricite-prepaye-sts',
    primaryKeyword: 'compteur électrique prépayé STS',
    title: 'Compteurs électriques prépayés STS pour projets',
    description:
      'Comparez des compteurs électriques prépayés STS monophasés, triphasés, sur rail DIN, GPRS et LoRaWAN pour vos projets.',
    eyebrow: 'Comptage électrique prépayé',
    h1: 'Compteurs électriques prépayés STS pour vos projets',
    directAnswer:
      "Un compteur électrique prépayé STS mesure l'énergie et déduit le crédit chargé au moyen d'un jeton sécurisé à 20 chiffres. Un projet peut utiliser un modèle autonome avec clavier lorsque la connexion permanente n'est pas nécessaire, ou une option GPRS ou LoRaWAN pour la relève à distance. Le choix dépend de la phase, du courant, de la pose, de l'accès par clavier ou CIU, du système de vente de crédit et des exigences de destination.",
    intro:
      "La gamme présentée comprend des compteurs monophasés, triphasés et sur rail DIN. Comparez uniquement les paramètres publiés, puis confirmez par écrit le raccordement, la communication, le périmètre du système de vente de crédit et les conditions du pilote avant la commande.",
    comparisonTitle: 'Monophasé, triphasé ou rail DIN : quel compteur choisir ?',
    comparisonAnswer:
      "Choisissez un modèle monophasé pour un raccordement monophasé dont la tension et le courant correspondent à la configuration proposée. Utilisez un modèle triphasé quatre fils pour les services triphasés pris en charge. Un compteur sur rail DIN avec CIU séparée peut convenir lorsque le compteur principal doit rester dans un coffret protégé et que le client saisit ses jetons à l'intérieur.",
    comparisonNote:
      'Les valeurs publiées sont traduites à partir des fiches techniques actuelles. Confirmez dans le devis et le pilote la phase, la tension, le courant ou le rapport de transformation, le câblage, la communication, les conditions de pose et les exigences de destination.',
    selectionTitle: 'Comment choisir un compteur électrique prépayé STS',
    selectionSteps: [
      {
        title: 'Définir le raccordement électrique',
        text: "Confirmez le service monophasé ou triphasé, la tension nominale, la fréquence, le courant maximal et l'éventuel besoin d'un transformateur de courant externe.",
      },
      {
        title: 'Choisir un accès direct ou séparé',
        text: "Utilisez un clavier intégré lorsque le client peut atteindre le compteur. Prévoyez une unité d'interface client lorsque le compteur principal est à l'extérieur, fermé ou installé sur un poteau.",
      },
      {
        title: "Définir l'architecture de communication",
        text: 'Le fonctionnement STS autonome permet la saisie locale du jeton. Les options GPRS ou LoRaWAN ajoutent une communication distante selon le modèle et le réseau du projet.',
      },
      {
        title: 'Décrire la vente de crédit et l’intégration',
        text: "Précisez la plateforme de vente de crédit, la répartition des responsabilités de gestion des clés, les canaux de paiement et l'éventuelle API avec les systèmes existants.",
      },
      {
        title: 'Confirmer les exigences et le pilote',
        text: 'Listez les spécifications du service public, les documents de test, les exigences de destination et les contrôles représentatifs à réaliser pendant le pilote.',
      },
    ],
    workflowTitle: "Comment fonctionne la recharge d'électricité par jeton STS",
    workflowIntro:
      "La Standard Transfer Specification fournit une méthode de transfert du crédit prépayé vers un compteur enregistré. La communication réseau peut ajouter des fonctions distantes, mais la saisie du jeton au clavier n'oblige pas chaque compteur à rester connecté.",
    workflowSteps: [
      {
        title: '1. Enregistrer le compteur',
        text: "L'opérateur enregistre l'identité du compteur et la configuration requise dans le système de vente de crédit.",
      },
      {
        title: "2. Acheter le crédit d'électricité",
        text: 'Le client achète un montant de crédit par un canal de vente ou de paiement approuvé par le projet.',
      },
      {
        title: '3. Générer le jeton',
        text: 'Le système de vente de crédit produit un jeton à 20 chiffres associé au compteur et à la transaction.',
      },
      {
        title: '4. Charger et consommer le crédit',
        text: "Le client saisit le jeton sur le compteur ou la CIU. Le compteur accepte le crédit valide et le déduit au fur et à mesure de la consommation d'électricité.",
      },
    ],
    quotationChecklist: [
      'Raccordement monophasé, triphasé ou avec transformateur de courant',
      'Tension nominale, fréquence et courant maximal ou rapport de transformation',
      "Câblage, coffret et emplacement d'installation",
      "Clavier intégré ou unité d'interface client séparée",
      'Fonctionnement STS autonome, GPRS, LoRaWAN, PLC ou autre communication requise',
      'Plateforme de vente de crédit, gestion des clés, canal de paiement et périmètre de l’API',
      "Quantité estimée, calendrier de déploiement et critères d'acceptation du pilote",
      'Spécifications du service public de destination et documents exigés',
    ],
    faqQuestions: [
      "Qu'est-ce qu'un compteur électrique prépayé STS ?",
      'Quand faut-il choisir un compteur électrique prépayé triphasé ?',
      'Quelle est la différence entre les modèles CA368 GPRS et STS autonome ?',
      'Quand faut-il choisir un compteur prépayé avec clavier séparé ?',
      'Un compteur prépayé doit-il utiliser une carte SIM ?',
      'Comment fonctionne un compteur prépayé à jeton ?',
    ],
    productIds: [
      'ca168-lorawan',
      'ca168-gprs',
      'ca168-sts',
      'ca368-gprs',
      'ca368-sts',
    ],
  },
  'compteur-eau-prepaye-sts': {
    slug: 'compteur-eau-prepaye-sts',
    primaryKeyword: "compteur d'eau prépayé STS",
    title: "Compteurs d'eau prépayés STS pour projets",
    description:
      "Comparez des compteurs d'eau prépayés STS multijets en plastique ou en laiton et un modèle ultrasonique pour vos projets.",
    eyebrow: "Comptage d'eau prépayé",
    h1: "Compteurs d'eau prépayés STS pour vos projets",
    directAnswer:
      "Un compteur d'eau prépayé STS gère le crédit d'eau au moyen d'un jeton à 20 chiffres saisi sur un clavier ou une unité d'interface client. La gamme présentée comprend des configurations multijets à corps en plastique ou en laiton et un modèle ultrasonique sans pièce mobile de mesure. Le choix dépend du diamètre, du débit, de la pression, de la température, du principe de mesure, de l'accès client, de la vanne, de la communication et des exigences du service public.",
    intro:
      "Comparez les dimensions et caractéristiques hydrauliques publiées pour les trois modèles, puis validez la qualité de l'eau, l'orientation de pose, le fonctionnement de la vanne, la couverture radio et les procédures d'exploitation au moyen d'un pilote représentatif.",
    comparisonTitle: 'Plastique, laiton ou ultrasonique : quel modèle choisir ?',
    comparisonAnswer:
      "Le modèle multijet en plastique couvre les diamètres publiés DN15 à DN25 et peut convenir aux installations sensibles au coût. Le multijet en laiton fournit un corps métallique et des diamètres publiés jusqu'au DN50. Le modèle ultrasonique utilise un principe de mesure sans pièce mobile et indique un rapport de plage R250. Le choix final doit suivre les conditions hydrauliques et les exigences du projet.",
    comparisonNote:
      'Les valeurs publiées sont traduites à partir des fiches techniques actuelles. Confirmez dans le devis et le pilote le diamètre final, la plage de débit, la fréquence de communication, les conditions de pose et les exigences de destination.',
    selectionTitle: "Comment choisir un compteur d'eau prépayé STS",
    selectionSteps: [
      {
        title: 'Définir les conditions hydrauliques',
        text: "Confirmez le diamètre nominal, les débits minimal et permanent prévus, la pression, la température et la qualité de l'eau ainsi que l'orientation de pose.",
      },
      {
        title: 'Choisir le principe de mesure',
        text: 'Les compteurs multijets utilisent un mécanisme de mesure mécanique. Le modèle ultrasonique ne comporte pas de pièce mobile de mesure et doit être évalué selon le profil de débit et le plan de maintenance.',
      },
      {
        title: 'Choisir le corps et l’accès client',
        text: "Précisez le corps en plastique ou en laiton, le clavier intégré ou la CIU, l'accès au regard de compteur et les besoins de vanne ou de retour d'eau.",
      },
      {
        title: 'Planifier la relève à distance',
        text: 'Définissez la fréquence LoRaWAN, la densité de compteurs, la position des passerelles, la liaison de collecte, les intervalles de relève et les fonctions distantes attendues, puis testez des sites représentatifs.',
      },
      {
        title: 'Confirmer les documents et le déploiement',
        text: "Listez les exigences de destination, la quantité, la formation à la pose, la mise en service et les critères d'acceptation du pilote avant le déploiement à grande échelle.",
      },
    ],
    workflowTitle: "Comment s'articulent le crédit STS et la relève à distance",
    workflowIntro:
      "Le prépaiement STS et la relève distante répondent à deux besoins distincts. Le jeton transfère le crédit au compteur enregistré ; LoRaWAN ou une autre couche de communication prise en charge peut transmettre les relevés et les commandes prévues au système de l'opérateur.",
    workflowSteps: [
      {
        title: '1. Configurer le compteur',
        text: "L'opérateur enregistre le compteur, les règles de tarification, le mode d'accès du client et les paramètres de communication retenus.",
      },
      {
        title: "2. Émettre le crédit d'eau",
        text: "Après l'achat du crédit, le système de vente génère un jeton à 20 chiffres pour le compteur enregistré.",
      },
      {
        title: '3. Saisir le jeton',
        text: "Le client charge le jeton sur le clavier du compteur ou sur la CIU selon l'installation.",
      },
      {
        title: '4. Relever et gérer à distance',
        text: 'Lorsque la configuration le prévoit, les passerelles et le système de gestion collectent les relevés et exécutent les fonctions distantes documentées.',
      },
    ],
    quotationChecklist: [
      'Diamètre et débits minimal, permanent et de surcharge attendus',
      "Pression, température et qualité de l'eau ainsi qu'orientation de pose",
      'Préférence pour un corps en plastique ou en laiton',
      'Principe de mesure multijet ou ultrasonique',
      'Vanne, retour d’eau et procédure de recharge du client',
      'Clavier intégré, CIU et accès au regard de compteur',
      'Fréquence LoRaWAN, densité de compteurs, passerelles et liaison de collecte',
      "Quantité, exigences de destination et critères d'acceptation du pilote",
    ],
    faqQuestions: [
      "Qu'est-ce qu'un compteur d'eau prépayé STS ?",
      "Quelle est la différence entre un compteur d'eau en laiton et en plastique ?",
      "Quelle est la différence entre un compteur d'eau multijet et ultrasonique ?",
      "Quelles informations fournir pour un devis de compteurs d'eau LoRaWAN ?",
      "Comment planifier la couverture LoRaWAN des compteurs d'eau ?",
      "Un compteur d'eau ultrasonique peut-il fonctionner sans CIU ?",
    ],
    productIds: [
      'water-multi-jet-plastic',
      'water-multi-jet-brass',
      'water-ultrasonic',
    ],
  },
};
