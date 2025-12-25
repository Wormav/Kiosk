import type { Locale } from "~/.server/locale.server";

const translations = {
  // Common
  save: { fr: "Sauvegarder", en: "Save" },
  cancel: { fr: "Annuler", en: "Cancel" },
  delete: { fr: "Supprimer", en: "Delete" },
  edit: { fr: "Modifier", en: "Edit" },
  close: { fr: "Fermer", en: "Close" },
  loading: { fr: "Chargement...", en: "Loading..." },

  // Navigation
  navForm: { fr: "Formulaire", en: "Form" },
  navSessions: { fr: "Sessions", en: "Sessions" },

  // Home page
  formTitle: { fr: "Formulaire ESG/CSRD", en: "ESG/CSRD Form" },

  // Dynamic Form
  formSaved: { fr: "Formulaire enregistré", en: "Form saved" },
  formSavedMessage: {
    fr: "Vos réponses ont été sauvegardées avec succès.",
    en: "Your answers have been saved successfully.",
  },
  newForm: { fr: "Nouveau formulaire", en: "New form" },
  viewSessions: { fr: "Voir les sessions", en: "View sessions" },
  showTree: { fr: "Voir l'arbre des questions", en: "View question tree" },
  hideTree: { fr: "Fermer la visualisation", en: "Close visualization" },

  // Tree Visualization
  treeTitle: { fr: "Arbre des Questions (Récursif)", en: "Question Tree (Recursive)" },
  questions: { fr: "questions", en: "questions" },
  maxDepth: { fr: "profondeur max", en: "max depth" },
  legend: { fr: "Légende", en: "Legend" },
  group: { fr: "groupe", en: "group" },
  recursivityProof: { fr: "Preuve de récursivité", en: "Recursivity proof" },
  recursivityExplanation: {
    fr: "Ce composant utilise une fonction récursive qui s'appelle elle-même pour chaque enfant. La profondeur maximale atteinte est",
    en: "This component uses a recursive function that calls itself for each child. The maximum depth reached is",
  },
  recursivityConclusion: {
    fr: ", démontrant que l'arbre supporte une imbrication arbitraire.",
    en: ", demonstrating that the tree supports arbitrary nesting.",
  },
  child: { fr: "enfant", en: "child" },
  children: { fr: "enfants", en: "children" },

  // Table Field
  row: { fr: "Ligne", en: "Row" },
  label: { fr: "Libellé", en: "Label" },
  labelPlaceholder: { fr: "Ex: France, CDI Hommes...", en: "E.g.: France, Permanent Male..." },
  addRow: { fr: "+ Ajouter une ligne", en: "+ Add row" },

  // Sessions page
  sessionsTitle: { fr: "Sessions", en: "Sessions" },
  deleteAllSessions: { fr: "Supprimer toutes les sessions", en: "Delete all sessions" },
  noSessionsFound: { fr: "Aucune session trouvée.", en: "No sessions found." },
  confirmDeleteSession: { fr: "Supprimer cette session ?", en: "Delete this session?" },
  confirmDeleteAllSessions: {
    fr: "Êtes-vous sûr de vouloir supprimer TOUTES les sessions ?",
    en: "Are you sure you want to delete ALL sessions?",
  },
  createdAt: { fr: "Créée le", en: "Created at" },
  updatedAt: { fr: "Modifiée le", en: "Updated at" },
  created: { fr: "Créée", en: "Created" },
  updated: { fr: "Modifiée", en: "Updated" },
  answers: { fr: "Réponses", en: "Answers" },
  answer: { fr: "réponse", en: "answer" },
  answersPlural: { fr: "réponses", en: "answers" },
  actions: { fr: "Actions", en: "Actions" },
  id: { fr: "ID", en: "ID" },
} as const;

type TranslationKey = keyof typeof translations;

export const t = (key: TranslationKey, locale: Locale): string => {
  return translations[key][locale];
};

export const useTranslations = (locale: Locale) => {
  return (key: TranslationKey) => t(key, locale);
};
