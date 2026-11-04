import { InjectionToken } from '@angular/core';
import type { LanguageCode } from './i18n.service';

/** Loads the raw YAML text of a language. Browser fetches it, server/prerender reads it from disk. */
export interface TranslationsLoader {
  load(code: LanguageCode): Promise<string>;
}

export const TRANSLATIONS_LOADER = new InjectionToken<TranslationsLoader>('TranslationsLoader');

/** Browser implementation: the YAML files are served as static assets. */
export class FetchTranslationsLoader implements TranslationsLoader {
  async load(code: LanguageCode): Promise<string> {
    const url = `assets/i18n/${code}.yaml`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${response.url}`);
    }
    return response.text();
  }
}
