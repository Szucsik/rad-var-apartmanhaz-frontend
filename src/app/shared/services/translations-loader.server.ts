import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { LanguageCode } from './i18n.service';
import type { TranslationsLoader } from './translations-loader';

/** Directory of the built `server.mjs` at runtime (also works while compiling and in tests). */
const serverDir = dirname(fileURLToPath(import.meta.url));

/**
 * Server implementation: reads the same YAML files from disk, because relative `fetch` URLs
 * cannot be resolved while rendering on the server (`REQUEST` is also null during prerendering).
 */
export class FileTranslationsLoader implements TranslationsLoader {
  async load(code: LanguageCode): Promise<string> {
    const file = `${code}.yaml`;
    // During `ng build`/`ng serve` the sources are in the project; in the built server they sit next to the browser bundle.
    const candidates = [
      join(process.cwd(), 'src', 'assets', 'i18n', file),
      join(serverDir, '..', 'browser', 'assets', 'i18n', file),
      join(serverDir, 'assets', 'i18n', file),
    ];

    let lastError: unknown;
    for (const path of candidates) {
      try {
        return await readFile(path, 'utf8');
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }
}
