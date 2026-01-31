// src/lib/analysis/languageDetector.ts
// Module de détection automatique de la langue du contrat

import { franc } from "franc-min";

/**
 * Codes de langue supportés (ISO 639-3 pour franc, ISO 639-1 pour notre usage)
 */
const LANGUAGE_MAP: Record<string, string> = {
  fra: "fr", // Français
  eng: "en", // Anglais
  spa: "es", // Espagnol
  por: "pt", // Portugais
  deu: "de", // Allemand
  ita: "it", // Italien
};

/**
 * Noms complets des langues
 */
const LANGUAGE_NAMES: Record<string, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
  it: "Italiano",
};

/**
 * Instructions système par langue pour le LLM
 */
const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  fr: `IMPORTANT: Vous DEVEZ répondre ENTIÈREMENT en FRANÇAIS.
- Toutes les descriptions, recommandations et explications doivent être en français
- Utilisez un langage professionnel et juridique français
- Les noms de champs JSON restent en anglais, mais les VALEURS sont en français
- Soyez explicatif et détaillé, pas seulement des titres ou réponses contractées`,

  en: `IMPORTANT: You MUST respond ENTIRELY in ENGLISH.
- All descriptions, recommendations and explanations must be in English
- Use professional and legal English language
- JSON field names remain in English, and VALUES are also in English
- Be explanatory and detailed, not just titles or abbreviated responses`,

  es: `IMPORTANTE: Debe responder COMPLETAMENTE en ESPAÑOL.
- Todas las descripciones, recomendaciones y explicaciones deben estar en español
- Utilice un lenguaje profesional y jurídico en español
- Los nombres de campos JSON permanecen en inglés, pero los VALORES están en español
- Sea explicativo y detallado, no solo títulos o respuestas abreviadas`,

  pt: `IMPORTANTE: Você DEVE responder INTEIRAMENTE em PORTUGUÊS.
- Todas as descrições, recomendações e explicações devem estar em português
- Use linguagem profissional e jurídica em português
- Os nomes dos campos JSON permanecem em inglês, mas os VALORES estão em português
- Seja explicativo e detalhado, não apenas títulos ou respostas abreviadas`,

  de: `WICHTIG: Sie MÜSSEN VOLLSTÄNDIG auf DEUTSCH antworten.
- Alle Beschreibungen, Empfehlungen und Erklärungen müssen auf Deutsch sein
- Verwenden Sie professionelle und juristische deutsche Sprache
- JSON-Feldnamen bleiben auf Englisch, aber die WERTE sind auf Deutsch
- Seien Sie erklärend und detailliert, nicht nur Titel oder abgekürzte Antworten`,

  it: `IMPORTANTE: Devi rispondere INTERAMENTE in ITALIANO.
- Tutte le descrizioni, raccomandazioni e spiegazioni devono essere in italiano
- Usa un linguaggio professionale e giuridico italiano
- I nomi dei campi JSON rimangono in inglese, ma i VALORI sono in italiano
- Sii esplicativo e dettagliato, non solo titoli o risposte abbreviate`,
};

export class LanguageDetector {
  /**
   * Détecte la langue d'un texte
   *
   * @param text - Texte à analyser
   * @param minLength - Longueur minimale pour une détection fiable (défaut: 200)
   * @returns Code ISO 639-1 de la langue détectée (fr, en, es, etc.)
   */
  static detectLanguage(text: string, minLength: number = 200): string {
    if (!text || text.length < minLength) {
      console.warn(
        `Texte trop court pour détection fiable (${text?.length || 0} caractères). Utilisation de l'anglais par défaut.`,
      );
      return "en"; // Fallback sur l'anglais
    }

    try {
      // Extraire un échantillon représentatif (premiers 2000 caractères)
      const sample = text.substring(0, 2000);

      // Détecter avec franc (retourne un code ISO 639-3)
      const detectedISO3 = franc(sample, { minLength: 10 });

      // Vérifier si franc a pu détecter la langue
      if (!detectedISO3 || detectedISO3 === "und") {
        console.warn(
          "Langue non détectable par franc. Utilisation de l'anglais par défaut.",
        );
        return "en";
      }

      // Convertir en ISO 639-1
      const detectedISO1 = LANGUAGE_MAP[detectedISO3];

      if (detectedISO1) {
        console.log(
          `Langue détectée: ${detectedISO1} (${LANGUAGE_NAMES[detectedISO1]})`,
        );
        return detectedISO1;
      }

      // Si la langue n'est pas dans notre map, fallback sur l'anglais
      console.warn(
        `Langue non supportée détectée: ${detectedISO3}. Utilisation de l'anglais par défaut.`,
      );
      return "en";
    } catch (error) {
      console.error("Erreur lors de la détection de langue:", error);
      return "en"; // Fallback sur l'anglais en cas d'erreur
    }
  }

  /**
   * Obtient le nom complet de la langue
   *
   * @param languageCode - Code ISO 639-1 (fr, en, es, etc.)
   * @returns Nom complet de la langue
   */
  static getLanguageName(languageCode: string): string {
    return LANGUAGE_NAMES[languageCode] || "English";
  }

  /**
   * Obtient les instructions système pour le LLM dans la langue appropriée
   *
   * @param languageCode - Code ISO 639-1 (fr, en, es, etc.)
   * @returns Instructions système pour le LLM
   */
  static getLanguageInstructions(languageCode: string): string {
    return LANGUAGE_INSTRUCTIONS[languageCode] || LANGUAGE_INSTRUCTIONS["en"];
  }

  /**
   * Vérifie si une langue est supportée
   *
   * @param languageCode - Code ISO 639-1 à vérifier
   * @returns true si la langue est supportée
   */
  static isLanguageSupported(languageCode: string): boolean {
    return languageCode in LANGUAGE_NAMES;
  }

  /**
   * Obtient la liste des langues supportées
   *
   * @returns Tableau des codes de langues supportées
   */
  static getSupportedLanguages(): string[] {
    return Object.keys(LANGUAGE_NAMES);
  }

  /**
   * Détecte la langue et retourne un objet complet avec toutes les informations
   *
   * @param text - Texte à analyser
   * @returns Objet contenant le code, le nom et les instructions
   */
  static detectLanguageWithDetails(text: string): {
    code: string;
    name: string;
    instructions: string;
    isSupported: boolean;
  } {
    const code = this.detectLanguage(text);
    return {
      code,
      name: this.getLanguageName(code),
      instructions: this.getLanguageInstructions(code),
      isSupported: this.isLanguageSupported(code),
    };
  }

  /**
   * Détecte si le texte contient principalement du français
   * Utile pour une vérification rapide
   *
   * @param text - Texte à analyser
   * @returns true si le texte est probablement en français
   */
  static isFrench(text: string): boolean {
    const frenchIndicators = [
      "le ",
      "la ",
      "les ",
      "de ",
      "du ",
      "des ",
      "un ",
      "une ",
      "est ",
      "sont ",
      "être ",
      "avoir ",
      "que ",
      "qui ",
      "article",
      "contrat",
      "partie",
      "entre",
      "conformément",
    ];

    const lowerText = text.toLowerCase();
    const matches = frenchIndicators.filter((indicator) =>
      lowerText.includes(indicator),
    ).length;

    return matches >= 5; // Au moins 5 indicateurs français trouvés
  }

  /**
   * Détecte si le texte contient principalement de l'anglais
   * Utile pour une vérification rapide
   *
   * @param text - Texte à analyser
   * @returns true si le texte est probablement en anglais
   */
  static isEnglish(text: string): boolean {
    const englishIndicators = [
      "the ",
      "and ",
      "of ",
      "to ",
      "in ",
      "is ",
      "are ",
      "that ",
      "this ",
      "contract",
      "party",
      "between",
      "shall ",
      "will ",
      "agreement",
      "pursuant",
    ];

    const lowerText = text.toLowerCase();
    const matches = englishIndicators.filter((indicator) =>
      lowerText.includes(indicator),
    ).length;

    return matches >= 5; // Au moins 5 indicateurs anglais trouvés
  }
}
