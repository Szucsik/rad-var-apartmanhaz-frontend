import { Location } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

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
 *
 * Every language has its own URL (`/hu`, `/pl`, `/en`, `/de`) so search engines can index each one.
 * The URL decides the language; `/` (and unknown paths) is redirected to the saved or browser language.
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
  private readonly location = inject(Location);
  private latestRequest = 0;

  constructor() {
    // Browser back/forward between the language URLs.
    this.location.onUrlChange(url => {
      const code = languageFromPath(url);
      if (code && code !== this.language()) {
        void this.setLanguage(code);
      }
    });
  }

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
    await this.setLanguage(languageFromPath(this.location.path()) ?? this.detectInitialLanguage());
    // If that language could not be loaded, the URL still has to name the language that is shown.
    this.syncUrl(this.language());
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
    this.syncUrl(code);
  }

  /** Puts the language into the URL: `/` is replaced (a redirect), a language switch adds a history entry. */
  private syncUrl(code: LanguageCode): void {
    const current = this.location.path(true);
    if (languageFromPath(current) === code) {
      return;
    }
    const [, suffix = ''] = /^[^?#]*(.*)$/.exec(current) ?? [];
    const target = `/${code}${suffix}`;
    if (languageFromPath(current)) {
      this.location.go(target);
    } else {
      this.location.replaceState(target);
    }
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

/** The language of a path like `/en`, `/en/` or `/en?x=1#y`; `undefined` for `/` and unknown paths. */
export function languageFromPath(path: string): LanguageCode | undefined {
  const firstSegment = path.split(/[?#]/)[0].split('/').find(segment => segment.length > 0);
  return findLanguage(firstSegment?.toLowerCase());
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
