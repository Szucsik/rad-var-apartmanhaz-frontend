# Architecture

Reference for how the Rád-Vár Apartmanház site is put together. Start with [../AGENTS.md](../AGENTS.md) for commands and rules.

## Overview

A single Angular 22 page with six stacked sections and no backend. The router only has a wildcard route: the first path segment selects the language (`/hu`, `/pl`, `/en`, `/de`, see [SEO](#seo)). The header menu scrolls the window to a section. All translatable texts come from YAML files at runtime, and the visuals rely heavily on GSAP animations. Only language-independent data stays in templates: the email address, phone numbers and the Facebook/Instagram labels in `contacts.component.html`.

```
<app-root>                         AppComponent
  <app-loading>                    shown until the preload images are loaded
  <app-header>                     fixed header: logo, menu, burger (mobile), language picker
  <app-start>                      intro curtain + logo animation (first visit of the browser session only)
  <app-main>                       MainComponent: the sections, in this order
    <app-home>                     hero: parallax background, quote, welcome text
    <app-gallery>                  Swiper "cards" carousel + caption + arrows
      <gallery-swiper>
    <app-booking>                  intro text + 3 booking cards (booking.com, Szallas.hu, Facebook → contacts)
    <app-nearby>                   SEO text: the apartments, amenities, sights with distances + Eger photo (not in the menu)
    <app-history>                  sticky timeline + 3 pages
      <app-history-page-one|two|three>
    <app-contacts>                 address, email, phones, social links over a map image
  <app-fullscreen>                 HD photo viewer (see Known issues: nothing opens it)
```

## Bootstrapping and startup sequence

1. `src/main.ts` bootstraps `AppModule` with `platformBrowser().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()] })`. Zone-based change detection is enabled explicitly; Angular 22 is zoneless by default.
2. **App initializer** (`AppModule.providers`): `I18nService.init()` loads `hu.yaml` (the fallback) and the initial language before the first render, so no translation keys flash.
3. `AppComponent.ngOnInit`:
   - `Configuration.setStartComponentNeeded()`: the intro plays only if `sessionStorage['isLoaded'] !== 'testval'`, and the flag is then set.
   - `PreloadService.preloadImages()` loads 12 site images. When all have loaded, `loadComplated` fires. There is no `onerror` handling, so one failed image keeps the loading screen up.
4. `AppComponent.waitLoadinScreen()` sets `loaded = true` and emits **`AnimationService.contentLoaded`**. Everything subscribes to this event:
   - `AppComponent` registers the GSAP plugins and the ScrollTriggers (`ScrollAnimationService`).
   - `HeaderComponent` fades the header in after `Configuration.getHeaderDelay()`.
   - `StartComponent` / `LogoStartComponent` play the intro curtain and logo.
   - `MainComponent` fades in the content after `getContentDelay()`.
5. The timings live in `src/app/shared/config.ts`: start 3.2 s, header 4.6 s, content 5.6 s. Without the intro, the content delay is 1 s and the header delay 0.

## Components

| Component | Notes |
|-----------|-------|
| `HeaderComponent` | Uses `ViewEncapsulation.None`. Below 1024 px it shows a burger that toggles `isMobileMenuActive`; scrolling closes the menu. The language picker (`.lang-dial*`) is a custom speed dial: the button shows the current flag and the items list `LANGUAGES`. Changing the language calls `ScrollAnimationService.refresh()`. |
| `HomeComponent` | Uses fixed-position parallax layers (`.layer-bg`, `.layer-overlay`, `data-depth`). The parallax ScrollTrigger exists but is commented out. |
| `GalleryComponent` / `GallerySwiperComponent` | `new Swiper(el, { modules: [Autoplay, EffectCards], effect: 'cards', autoHeight, autoplay })`. The swiper component uses `ViewEncapsulation.None` and its Swiper CSS comes from `@use "swiper/css"`. `slideChange` → `GalleryService.SetCurrentImageID`, which drives the caption. |
| `BookingComponent` | Below 1024 px (`mobileMod`) only one card is visible, with swap arrows. Clicking a card opens booking.com or Szallas.hu, or navigates to contacts. |
| `HistoryComponent` + pages | Each page has an `IntersectionObserver` (`rootMargin: '-50% 0px -50% 0px'`) that emits its index when it crosses the viewport middle. `changeFocus` then highlights the timeline. The timeline is sticky and only shown from 1280 px. |
| `ContactsComponent` | Switches to the portrait map image (`contacts-map-mobile-small-hun.png`) below 1024 px in portrait. |
| `StartComponent`, `LogoStartComponent`, `LogoComponent`, `LoadingComponent` | Intro and branding. The logo texts are images (not translatable). |
| `FullscreenComponent` | Shows the HD version of the current photo and closes on ESC. |

All components are declared in `AppModule` with `standalone: false` and `changeDetection: ChangeDetectionStrategy.Eager`.

## Services and shared code (`src/app/shared`)

| File | Responsibility |
|------|----------------|
| `services/i18n.service.ts` | `LANGUAGES` (hu, pl, en, de + flag class), `t(key)`, `tList(key)` and `setLanguage(code)`. Fetches `assets/i18n/<code>.yaml` and parses it with a lazily imported `js-yaml`. Falls back to Hungarian, then to the key. The language comes from the URL (`/en`); on `/` or an unknown path it uses `localStorage['language']`, then the browser language, then Hungarian, and replaces the URL with `/<code>` (query and hash are kept). A language switch pushes `/<code>` with Angular's `Location`; back/forward switch the language back. Updates `<html lang>` and remembers the choice. Texts are held in signals. |
| `services/seo.service.ts` | Effect on the language: sets `<title>`, meta description, canonical, hreflang alternates (+ `x-default` → `/`), Open Graph/Twitter tags and the schema.org JSON-LD (`LodgingBusiness`, `WebSite`, `WebPage`) in `script#structured-data`. Uses only `Meta`, `Title` and `DOCUMENT`, so it works under SSR. Business data comes from `shared/seo.ts`. |
| `services/animation.service.ts` | GSAP intro tweens (`startAnimations`, `logoAnimations`, `homeAnimations`, `headerAnimations`) and the `contentLoaded` event. |
| `services/scrollAnimation.service.ts` | Registers the `ScrollTrigger`/`ScrollToPlugin` plugins. `navigate(section)` scrolls to `<app-section>`; `refresh()` recalculates trigger positions. The ScrollTriggers select elements **by CSS class**: `.gallery-header`, `.images`, `.gallery-next-button`, `.gallery-previous-button`, `.gallery-image-descriptor-container`, `.contacts-menu`, `.booking-container`, `.booking-text-1`…`4`, `.booking-options-background-container`, `.timeline-container`, `.topic-1`…`3`. |
| `services/gallery.service.ts` | Current photo index, preview/HD photo lists (from `Configuration`), captions (`tList('gallery.images')`) and the fullscreen state (`fullscreenEvent`). |
| `services/preload.service.ts` | Preloads the site images listed in the service. |
| `config.ts` (`Configuration`) | Animation delays, photo lists (`assets/photos/*.jpeg` for HD, `assets/photos/preview/*.png` for previews) and the intro-once-per-session logic. |
| `directives/ripple.directive.ts` | `appRipple`: a click ink effect (a replacement for the PrimeNG ripple). Its styles are in `src/styles.css`. |
| `scss/sizes.scss` | Header sizes, `$desktop-breakpoint` (1024px), `$wide-breakpoint` (1280px), header clearances, and the mixins `desktop`, `wide`, `mobile`, `full-screen-height`. |

Components communicate through `EventEmitter`s on root services, and through signals (`I18nService`).

## Internationalisation

- There is one file per language in `src/assets/i18n/`: `hu.yaml` (reference and fallback), `pl.yaml`, `en.yaml`, `de.yaml`. All have the same nested keys, grouped by section (`meta`, `header`, `home`, `gallery`, `booking`, `history`, `contacts`, `nearby`).
- Components expose `protected readonly t = inject(I18nService).t;` (and `tList`). Templates call `{{ t('booking.title') }}` or `@for (p of tList('history.pages.intro.paragraphs'); track $index)`.
- Keys are built at runtime in two places: `'header.' + section` (header menu) and `'history.pages.' + topic + '.timeline'` (history timeline). Gallery captions are a list whose order must match `Configuration.photoList`.
- The YAML files are served as static assets. `src/staticwebapp.config.json` declares the `.yaml` MIME type for Azure Static Web Apps.

## Layout and styling

- Each section is at least one viewport tall (`min-height: 100svh`) and grows with its content. Avoid fixed heights and negative `vw` margins. The exception is the home hero, which is exactly one viewport tall (`height: 100svh` in `home.component.scss`) because its parallax layers are `position: fixed`; keep its content short.
- The header is fixed. Section content starts below `$header-clearance-mobile` (96px) or `$header-clearance` (130px), because the logo hangs below the header bar.
- Below 1024 px the layout is mobile (burger menu, stacked sections, single booking card). From 1024 px it is desktop. From 1280 px the history timeline appears and the history images move beside the text. Short landscape phones (`max-height: 500px`) get compact rules in several components.
- Font sizes use `clamp(min, vw, max)`.
- **Global styles:**
  - `src/styles.css`: `@font-face` for the fonts in `src/assets/fonts`, the global `box-sizing: border-box` reset (the layout relies on it) and the ripple styles.
  - `src/styles/light-blue-style.scss`: colours, fonts and decorative effects per section.
  - `src/styles/dark-style.css` and `light-style.css` are **not used** by the build.
- Component styles are SCSS/CSS and use `@use` (not `@import`). The component style budget is 20 kB (a build error above that).

## Build, tests and deployment

- **Builder:** `@angular/build:application` (esbuild). With Angular SSR enabled, output goes to `dist/rad-var-apartmanhaz/`:
  - `browser/`: the client app and all static assets (used by the FTP and Azure static deployments).
  - `server/server.mjs`: the Node/Express SSR server (used by the Docker/Ubuntu deployment).
  - Assets: `src/assets/**` (including `.psd` sources), `castle-logo.ico`, and `staticwebapp.config.json`, `robots.txt`, `sitemap.xml`, `.htaccess` at the root.
  - Budgets: initial bundle warning at 550 kB, error at 1 MB; the current size is about 625 kB, so a warning is expected.
- **Tests:** `@angular/build:unit-test` with Vitest and jsdom. The setup file is `src/test-setup.ts`; specs import `AppModule`.
- **Deployment:** GitHub Actions in `.github/workflows/`:

| Workflow | Trigger | Target |
|----------|---------|--------|
| `development.yml` | push `develop` | FTP `ftp.atw.hu` → `public_html/` |
| `staging.yml` | push `staging` | FTP `files.000webhost.com` → `public_html/` |
| `production.yml` | push `main` | FTP `wh23.rackhost.hu` |
| `main.yml` ("Production deploy etst 1") | push `main` | FTP `wh24.rackhost.hu` |
| `azure-static-web-apps-*.yml` | push `main`, PRs to `main` | Azure Static Web Apps (PRs get preview environments) |
| `docker-publish.yml` | push `main`, manual | GHCR image `ghcr.io/<owner>/rad-var-apartmanhaz-frontend` → Ubuntu server via `docker compose` (SSR) |

  The FTP workflows run `npm ci` and `npm run ng build` on Node 24.x.
- **Branch flow:** feature branches → `develop` → `staging` → `main`.

## SEO

Full details, the texts and the post-deployment checklist: [SEO.md](SEO.md).

- **One URL per language** (`https://rad-var-apartmanhaz.hu/hu`, `/pl`, `/en`, `/de`), so search engines index every language. `/` is the `x-default`: it redirects to the saved or browser language. Header language items are real links (`href="/de"`); clicks switch without reloading.
- **Hosting must serve `index.html` for the language paths:** `src/.htaccess` (Apache/LiteSpeed FTP hosts; it also redirects `/en/` → `/en`, and `http`/`www` → `https://rad-var-apartmanhaz.hu` on the production host only) and the `routes` of `src/staticwebapp.config.json` (Azure). Other paths return 404 on purpose (no soft 404s).
- **Head tags:** `src/index.html` holds static Hungarian defaults (title, description, hreflang, Open Graph, JSON-LD, a `<noscript>` summary) for crawlers that don't run JavaScript. `SeoService` replaces them per language at runtime. `seo.service.spec.ts` fails if the static defaults drift from `hu.yaml` or from the generated JSON-LD. There is no static `canonical` on purpose: the same file is served for every language.
- **Texts:** `meta.title` (≤ 60 chars) and `meta.description` (≤ 155 chars) in every YAML file, `meta.imageAlt` for the share image (`assets/seo/og-image.jpg`, 1200×630). `home.tagline` is part of the `h1`. The `nearby` section carries the keyword-rich text (accommodation, amenities, sights). Its distances are straight-line distances from OpenStreetMap coordinates.
- **Crawlers:** `src/robots.txt` points to `src/sitemap.xml`, which lists the four language URLs with `xhtml:link` alternates and the photos. Update `<lastmod>` when texts change.
- **SSR:** the app is rendered on the server for `/hu`, `/pl`, `/en`, `/de` (`app.routes.server.ts`, `RenderMode.Server`); `/` stays client-side because it redirects to the saved/browser language. `AppServerModule` provides a disk-based `TranslationsLoader` so the YAML is available before rendering. `AppComponent` keeps the real content in the SSR HTML and only plays the intro overlay after hydration. Docker/Ubuntu is the SSR target; the FTP and Azure workflows keep deploying the static `browser/` build.
- **After deployment:** add the domain to Google Search Console and Bing Webmaster Tools, submit `sitemap.xml`, and keep the Google Business Profile name, address and phone identical to `shared/seo.ts`.

## Known issues and technical debt

- `staging.yml` contains a plaintext FTP password (committed in history). It should be rotated and moved to a secret.
- Three workflows deploy every push to `main` (two FTP servers and Azure).
- `FullscreenComponent` is unreachable: nothing calls `GalleryService.FullScreen(true)` (`GalleryComponent.TurnFullscreen` is empty).
- `PreloadService` has no error handling, so a missing image means an endless loading screen.
- `src/assets` is about 170 MB: 83 MB of Photoshop sources, a spreadsheet and full-size JPEGs, all copied into every build.
- Leftover code:
  - `AnimationService.galleryAnimationCompleted` is never emitted.
  - `headerButtonsAnimationsMobile` and `Configuration.getStartAnimationsCompleted` are unused.
  - The `uuid` and `serve` dependencies are unused.
- Subscriptions to `contentLoaded` and other emitters are never unsubscribed. This is harmless today because the components live for the whole page lifetime.
- `strict` TypeScript is off (`tsconfig.json`), while `strictTemplates` is on.
- The booking text says the portals are "on the right", which isn't true on mobile (the text is unchanged from the original site).
- The Polish, English and German translations were machine-written and should be proofread by native speakers.
