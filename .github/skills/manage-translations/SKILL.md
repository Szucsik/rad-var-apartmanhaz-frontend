---
name: manage-translations
description: 'Add, change or remove page texts and translation keys in the YAML language files (hu, pl, en, de), add a new language to the language picker, and validate that all language files and t()/tList() keys are consistent. Use for any text, wording, translation or i18n change on the Rád-Vár site.'
argument-hint: 'What text to add or change, or which language to add'
---

# Manage translations

Page texts live in `src/assets/i18n/{hu,pl,en,de}.yaml`. `hu.yaml` is the reference and fallback. Templates read texts with `t('key')` and lists with `tList('key')` from `I18nService`. The rules are in [translations.instructions.md](../../instructions/translations.instructions.md).

## Change or add a text

1. Find the key: search the template for `t('…')` or search `hu.yaml`. New keys go under the section they appear in (`header`, `home`, `gallery`, `booking`, `history`, `contacts`, …).
2. Edit **every** `src/assets/i18n/*.yaml` file in the same change. Keep the YAML structure identical and lists the same length.
3. In the template, use the key: `{{ t('section.key') }}`, `[attr.aria-label]="t('section.key')"` or `@for (x of tList('section.list'); track $index)`. The component needs `protected readonly t = inject(I18nService).t;` (and `tList` if used).
4. Validate:
   ```bash
   node .github/skills/manage-translations/scripts/check-i18n.mjs
   ```
   [check-i18n.mjs](./scripts/check-i18n.mjs) checks:
   - every language file parses;
   - the YAML files, the `LanguageCode` type and the `LANGUAGES` list in `i18n.service.ts` name the same languages;
   - every file has the same keys, value kinds and list lengths as `hu.yaml`;
   - there are no empty texts, including list items, and list items are plain text;
   - every literal `t('…')`/`tList('…')` key in `src/app` exists and has the right kind.

   It lists runtime-built keys (`'header.' + …`, `'history.pages.' + …`) for you to check by hand. It exits with code 1 on any problem.
5. Run `npx ng test --watch=false`. If the text is visible, check it on screen in each language with the [visual-check skill](../visual-check/SKILL.md) (`--lang=de` and `--lang=pl` produce the longest texts).

## Add a language

1. `cp src/assets/i18n/hu.yaml src/assets/i18n/<code>.yaml`, translate every value and update the header comment.
2. In `src/app/shared/services/i18n.service.ts`:
   - extend `LanguageCode`;
   - add `{ code: '<code>', name: '<name in that language>', flagClass: 'lang-<xxx>-icon' }` to `LANGUAGES`.

   The order of `LANGUAGES` is the order in the flag menu.
3. Add a round flag PNG to `src/assets/site-images/country-flags/`, and add the class in `src/app/components/mains/header/header.component.scss`:
   ```scss
   .lang-xxx-icon {
       background-image: url('/assets/site-images/country-flags/flag-xx.png');
   }
   ```
4. Run the check script and the unit tests. Then switch to the language in the browser through the flag button: the flag should change, all texts should change, and `<html lang>` and the tab title should update.
5. Update the language lists in `AGENTS.md`, `docs/ARCHITECTURE.md` and `.github/instructions/translations.instructions.md`.

## Behaviour to keep in mind

- **Missing keys:** a key missing from a language falls back to Hungarian; a key missing everywhere renders as the key itself (for example `booking.title`).
- **Initial language:** the language from `localStorage['language']`, otherwise the browser language if supported, otherwise `hu`.
- **Editing without a rebuild:** the YAML files are fetched at runtime, so editing them on a deployed server works without a rebuild. Browsers may cache them.
- **Untranslatable text:** text inside images (logo, map) can't be translated.
