import { describe, expect, it } from 'vitest';
import { LANGUAGES } from './i18n.service';
import { FileTranslationsLoader } from './translations-loader.server';

describe('FileTranslationsLoader', () => {
  it('reads every language file from the repository assets', async () => {
    const loader = new FileTranslationsLoader();

    for (const language of LANGUAGES) {
      const text = await loader.load(language.code);
      expect(text).toContain('meta:');
    }
  });
});
