---
description: "Use when adding, changing or translating page texts, YAML language files, the language picker, or adding a new language (Hungarian, Polish, English, German). Covers t()/tList(), key structure and fallback."
applyTo: "src/assets/i18n/**"
---
# Texts and translations

All user-visible texts live in `src/assets/i18n/<code>.yaml`: `hu` (reference and fallback), `pl`, `en` and `de`. `I18nService` (`src/app/shared/services/i18n.service.ts`) loads them at runtime.

## Rules

- **Every file has exactly the same keys** as `hu.yaml`, and lists have the same length. Add, rename or remove a key in every `src/assets/i18n/*.yaml` file in the same change.
- Group keys by section: `meta`, `header`, `home`, `gallery`, `booking`, `history`, `contacts`, `nearby`. Use camelCase leaf names.
- Values are plain text or lists of text, never HTML. Keep markup in the template; for example, the gold dot after `history.subtitleLine2` is a `<span>` in the template.
- Use `>-` folded block scalars for long paragraphs, and quote values that contain `: ` or start with a special character (for example `quoteAuthor: "- Márai Sándor"`).
- `gallery.images` has one caption per photo, in the order of `Configuration.photoList` / `photoPreviewList` in `src/app/shared/config.ts`. Adding a photo means adding a caption in every file.
- Keep proper names unchanged across languages: Rád-Vár, Almagyar u. 7, booking.com/Szállás.hu, the film titles in the history text. The email address, phone numbers and Facebook/Instagram labels stay in `contacts.component.html` and aren't translated.
- The Hungarian text is the owner's original wording; don't "fix" it unless asked. The other languages are translations and may be improved.

## Using texts in components

```ts
protected readonly t = inject(I18nService).t;        // t('booking.title') → string (falls back to hu, then the key)
protected readonly tList = inject(I18nService).tList; // tList('history.pages.intro.paragraphs') → string[]
```

```html
<p class="booking-text-1">{{ t('booking.title') }}</p>
@for (paragraph of tList('history.pages.recent.paragraphs'); track $index) { <p>{{ paragraph }}</p> }
<div role="button" [attr.aria-label]="t('gallery.next')"></div>
```

Keys built at runtime (check them by hand): `'header.' + section` and `'history.pages.' + topic + '.timeline'`.

## Adding a language

1. Copy `hu.yaml` to `src/assets/i18n/<code>.yaml` and translate every value.
2. Add `{ code, name (in its own language), flagClass }` to `LANGUAGES` and extend the `LanguageCode` type in `i18n.service.ts`.
3. Add a flag image to `src/assets/site-images/country-flags/` and a `.lang-xxx-icon` class in `header.component.scss`.
4. Validate with `node .github/skills/manage-translations/scripts/check-i18n.mjs` (it also checks that `LANGUAGES`, `LanguageCode` and the YAML files match), then switch to the language in the browser at desktop and mobile sizes (longer texts can break layouts).
5. Update the language lists in `AGENTS.md`, `docs/ARCHITECTURE.md` and this file.

The [manage-translations skill](../skills/manage-translations/SKILL.md) describes the full workflow.
