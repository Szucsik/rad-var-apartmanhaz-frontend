import { Injectable, signal } from '@angular/core';

export type LanguageCode = 'hu' | 'pl' | 'en' | 'de';

export interface Language {
  code: LanguageCode;
  /** Name of the language in the language itself (not translated on purpose). */
  name: string;
  /** CSS class of the flag icon (header.component.scss). */
  flagClass: string;
}

export const LANGUAGES: readonly Language[] = [
  { code: 'hu', name: 'Magyar', flagClass: 'lang-hun-icon' },
  { code: 'pl', name: 'Polski', flagClass: 'lang-pol-icon' },
  { code: 'en', name: 'English', flagClass: 'lang-eng-icon' },
  { code: 'de', name: 'Deutsch', flagClass: 'lang-ger-icon' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'hu';

const STORAGE_KEY = 'language';
const TRANSLATIONS_URL = (code: LanguageCode) => `assets/i18n/${code}.yaml`;

type TranslationValue = string | string[] | Translations;
interface Translations {
  [key: string]: TranslationValue;
}

/**
 * Loads the page texts from `src/assets/i18n/<language>.yaml` and resolves them by dotted key,
 * e.g. `t('header.gallery')`. Keys missing from the selected language fall back to Hungarian.
 */
@Injectable({
  providedIn: 'root',
})
export class I18nService {
  readonly languages = LANGUAGES;
  readonly language = signal<LanguageCode>(DEFAULT_LANGUAGE);

  private readonly translations = signal<Translations>({});
  private readonly fallbackTranslations = signal<Translations>({});
  private readonly cache = new Map<LanguageCode, Promise<Translations | null>>();
  private latestRequest = 0;

  /** Returns the text for `key` in the current language (the key itself if it does not exist). */
  readonly t = (key: string): string => {
    const value = this.lookup(key);
    return typeof value === 'string' ? value : key;
  };

  /** Returns the list of texts for `key` in the current language (empty if it does not exist). */
  readonly tList = (key: string): string[] => {
    const value = this.lookup(key);
    return Array.isArray(value) ? value : [];
  };

  /** Loads the fallback and the initial language; runs once before the app renders. */
  async init(): Promise<void> {
    this.fallbackTranslations.set((await this.load(DEFAULT_LANGUAGE)) ?? {});
    await this.setLanguage(this.detectInitialLanguage());
  }

  async setLanguage(code: LanguageCode): Promise<void> {
    const request = ++this.latestRequest;
    const translations = await this.load(code);
    // Ignore failed loads and responses that arrive after a newer language was selected.
    if (!translations || request !== this.latestRequest) {
      return;
    }

    this.translations.set(translations);
    this.language.set(code);
    this.persist(code);
    document.documentElement.lang = code;
    document.title = this.t('meta.title');
  }

  private lookup(key: string): TranslationValue | undefined {
    return resolve(this.translations(), key) ?? resolve(this.fallbackTranslations(), key);
  }

  private load(code: LanguageCode): Promise<Translations | null> {
    let request = this.cache.get(code);
    if (!request) {
      request = this.fetchTranslations(code).catch(error => {
        console.warn(`Could not load the "${code}" texts`, error);
        this.cache.delete(code);
        return null;
      });
      this.cache.set(code, request);
    }
    return request;
  }

  private async fetchTranslations(code: LanguageCode): Promise<Translations> {
    // js-yaml is loaded on demand so it is not part of the initial bundle.
    const [response, yaml] = await Promise.all([fetch(TRANSLATIONS_URL(code)), import('js-yaml')]);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${response.url}`);
    }

    const data = yaml.load(await response.text());
    if (!isTranslations(data)) {
      throw new Error(`${TRANSLATIONS_URL(code)} does not contain a YAML mapping`);
    }
    return data;
  }

  private detectInitialLanguage(): LanguageCode {
    const saved = this.readSaved();
    if (saved) {
      return saved;
    }

    const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const browserLanguage of browserLanguages) {
      const match = findLanguage(browserLanguage?.slice(0, 2).toLowerCase());
      if (match) {
        return match;
      }
    }
    return DEFAULT_LANGUAGE;
  }

  private readSaved(): LanguageCode | undefined {
    try {
      return findLanguage(localStorage.getItem(STORAGE_KEY));
    } catch {
      return undefined;
    }
  }

  private persist(code: LanguageCode): void {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Storage can be unavailable (e.g. private mode); the choice then only lasts for this visit.
    }
  }
}

function findLanguage(code: string | null | undefined): LanguageCode | undefined {
  return LANGUAGES.find(language => language.code === code)?.code;
}

function isTranslations(value: unknown): value is Translations {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolve(translations: Translations, key: string): TranslationValue | undefined {
  let value: TranslationValue | undefined = translations;
  for (const part of key.split('.')) {
    if (!isTranslations(value)) {
      return undefined;
    }
    value = value[part];
  }
  return value;
}
