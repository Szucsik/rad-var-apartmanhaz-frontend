# AGENTS.md

Guide for AI coding agents working in this repository. Several agents may work here in parallel; read this file fully before changing anything.

## Project

Marketing website of **Rád-Vár Apartmanház**, a guesthouse in Eger, Hungary (Almagyar u. 7). It is a single-page, animation-heavy Angular app with no backend: home (hero), gallery, booking links (booking.com, Szallas.hu, Facebook), house history and contacts. Texts are available in Hungarian (default), Polish, English and German.

- Angular 22 (NgModule-based, **not** standalone), TypeScript 6, zone.js change detection
- GSAP 3 (intro animations, `ScrollTrigger`, `ScrollToPlugin`), Swiper 14 (core API, no Angular wrapper)
- Runtime translations from YAML files (`js-yaml`, lazy-loaded)
- Unit tests: Vitest + jsdom through `@angular/build:unit-test`
- No UI library: PrimeNG was removed (its v22 needs a paid/registered license key). Do not add a UI library without asking the owner.

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), SEO: [docs/SEO.md](docs/SEO.md).

## Commands

Node `^22.22.3 || ^24.15.0 || >=26` (see `engines` in `package.json`; CI uses Node 24).

| Task | Command |
|------|---------|
| Install | `npm ci` |
| Dev server (http://localhost:4200) | `./run.sh` (= `ng serve`; extra args are passed on, e.g. `./run.sh --port 4300`) |
| Production build → `dist/rad-var-apartmanhaz/` | `./build.sh` (= `ng build`) |
| Unit tests (single run) | `npx ng test --watch=false` |
| Translation consistency check | `node .github/skills/manage-translations/scripts/check-i18n.mjs` |
| Screenshots at 12 resolutions | see the [visual-check skill](.github/skills/visual-check/SKILL.md) |

The production build prints a warning that the initial bundle exceeds the 550 kB budget (it is ~575 kB). That warning is expected; a build **error** is not.

## Definition of done

Before you report a task as finished:

1. `./build.sh` succeeds without errors.
2. `npx ng test --watch=false` passes.
3. If you touched texts or translation files: the i18n check passes.
4. If you touched templates, styles or layout: run the visual check for desktop and mobile sizes and look at the screenshots (layouts have broken silently before).
5. Docs in this file, `docs/` or `.github/instructions/` are updated when you change a convention they describe.

## Rules that are easy to get wrong

1. **New components**: declare them in `AppModule` (`src/app/app.module.ts`) and set `standalone: false` **and** `changeDetection: ChangeDetectionStrategy.Eager`. Angular 22 defaults to OnPush; without `Eager`, state changed from timers, image loads, GSAP callbacks or service events never re-renders (this bug once left the loading screen up forever). See [angular-components instructions](.github/instructions/angular-components.instructions.md).
2. **Do not remove zone.js** or `provideZoneChangeDetection()` in `src/main.ts`; the app relies on zone-based change detection.
3. **No hard-coded user-visible text.** Every translatable text (including `aria-label`/`alt`) goes into every `src/assets/i18n/*.yaml` file and is rendered with `t('key')` / `tList('key')`. The only exceptions are language-independent data: the email address, phone numbers and the Facebook/Instagram brand labels. See [translations instructions](.github/instructions/translations.instructions.md).
4. **Breakpoints** live in `src/app/shared/scss/sizes.scss` (`$desktop-breakpoint: 1024px`, `$wide-breakpoint: 1280px`). The same `1024px` is duplicated in TypeScript `matchMedia` queries (`header`, `booking`, `contacts` components); keep them in sync. See [styles instructions](.github/instructions/styles.instructions.md).
5. **CSS class names are API for animations.** `ScrollAnimationService` selects elements by class (`.gallery-header`, `.booking-text-1`, `.topic-2`, `.timeline-container`, …). Renaming or removing such a class silently breaks the scroll animations; search `scrollAnimation.service.ts` before renaming.
6. **Header navigation** scrolls to the section element `app-<name>` (`ScrollAnimationService.navigate('gallery')` → `<app-gallery>`). Keep section components named and ordered accordingly.
7. **GSAP targets must be elements.** Use `element.children`, never `childNodes`: Angular control flow (`@for`, `@if`) inserts comment nodes, and GSAP throws on them every frame.
8. **Tests import `AppModule`** instead of declaring single components; jsdom lacks `IntersectionObserver` and `matchMedia`, which are stubbed in `src/test-setup.ts`. See [testing instructions](.github/instructions/testing.instructions.md).
9. **SEO: every language has its own URL** (`/hu`, `/pl`, `/en`, `/de`; `/` redirects by saved/browser language). The URL wins over `localStorage`. `SeoService` sets title, description, canonical, hreflang, Open Graph and JSON-LD per language. Keep `src/index.html` (Hungarian defaults, checked by `seo.service.spec.ts`), `src/sitemap.xml`, `src/.htaccess` and `src/staticwebapp.config.json` in sync when you change languages, texts in `meta`, or business data in `shared/seo.ts`. Use real headings (`h1` only in home, `h2` per section, `h3` below); a global reset in `styles.css` keeps them looking like the old `div`/`p`. See [docs/SEO.md](docs/SEO.md).
10. **Assets are huge** (`src/assets` ≈ 170 MB, incl. 83 MB of `.psd` source files that are copied into every build). Do not add large binaries; prefer compressed web formats.

## Working in parallel with other agents

- Work on your own branch (`feat/…`, `fix/…`, `chore/…`); never commit directly to `main`, `staging` or `develop`.
- **Pushing to `develop`, `staging` or `main` deploys the site** (FTP / Azure, see [ci-deploy instructions](.github/instructions/ci-deploy.instructions.md)). Never push to these branches, and never open a PR against `main`, unless the owner explicitly asks: a PR to `main` also creates a public Azure preview environment.
- Commit messages follow Conventional Commits with a short lowercase summary, e.g. `feat: language support added`, `fix: …`, `chore: …`.
- Keep changes scoped to the task; do not reformat or refactor unrelated files (merge conflicts with other agents).
- If you start a dev server, use a non-default port when another one may be running (`./run.sh --port 4310`), and stop it when you are done.
- Never commit `dist/`, `.angular/`, `node_modules/`, screenshots or other scratch output; put scratch files in a temp folder outside the repo.

## Security

- Never put credentials in code or workflows; use GitHub secrets (`${{ secrets.NAME }}`).
- **Known issue**: `.github/workflows/staging.yml` contains a plaintext FTP password committed in history. Do not copy, reuse or print it. The owner should rotate it and switch the workflow to a secret; mention it if you work on CI.

## Where things are

```
src/app/
  app.module.ts               all declarations + app initializer (loads texts before first render)
  app.component.*             loading screen → intro → main content orchestration
  components/mains/           header (menu, language picker), loading, start (intro), logo, logo-start
  components/pages/           main (section list), home, gallery (+swiper, fullscreen), booking,
                              nearby (location, amenities, sights), history (+page-one/two/three), contacts
  shared/config.ts            timing constants, photo lists, "intro once per session" flag
  shared/seo.ts               site URL, business data (address, geo, phones, email) for meta tags/JSON-LD
  shared/services/            i18n (+ language URLs), seo (head tags, JSON-LD), animation (GSAP intro),
                              scrollAnimation (ScrollTrigger + navigation), gallery, preload
  shared/directives/          ripple.directive.ts (appRipple)
  shared/scss/sizes.scss      breakpoints, header sizes, mixins
src/assets/i18n/*.yaml        all page texts, one file per language (incl. meta.title/description)
src/index.html                static Hungarian SEO defaults (meta, hreflang, OG, JSON-LD, noscript)
src/robots.txt, sitemap.xml   crawler files; src/.htaccess + staticwebapp.config.json serve /hu /pl /en /de
src/styles.css                fonts (@font-face), global reset, ripple styles
src/styles/light-blue-style.scss  site colours and fonts (theme)
```
