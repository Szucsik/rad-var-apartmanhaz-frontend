# SEO

Search engine optimisation of the Rád-Vár Apartmanház site (`https://rad-var-apartmanhaz.hu`) for all supported languages: Hungarian, Polish, English and German. Start with [../AGENTS.md](../AGENTS.md) for commands and rules, and [ARCHITECTURE.md](ARCHITECTURE.md#seo) for the short technical summary.

## Goals

The site should rank for searches by people planning a trip to Eger or Hungary, in their own language:

| Language | Example search terms |
|----------|----------------------|
| Hungarian | Eger apartmanok, szállás Eger, egri szállás, apartman Eger belváros, szállás az egri vár mellett |
| English | Eger apartments, accommodation in Eger, where to stay in Eger, Eger Hungary apartment |
| German | Ferienwohnung Eger, Unterkunft Eger, Eger (Erlau) Ungarn Unterkunft |
| Polish | apartamenty Eger, noclegi Eger, noclegi w Egerze, Eger Węgry nocleg |

## Summary of the changes

| Area | Before | After |
|------|--------|-------|
| URLs | One URL for every language. Googlebot (browses as en-US) only ever saw English. | One URL per language: `/hu`, `/pl`, `/en`, `/de`. `/` redirects to the saved or browser language. |
| `<title>` | `Rád-Vár Apartmanház` in every language | A keyword title per language (see [Texts](#texts)) |
| Meta description | none | One per language, ≤ 155 characters |
| Canonical / hreflang | none | Canonical per language, hreflang for all four languages plus `x-default` |
| Social previews | none | Open Graph and Twitter tags, a 1200×630 share image |
| Structured data | none | schema.org JSON-LD: `LodgingBusiness`, `WebSite`, `WebPage` |
| Crawler files | none | `robots.txt`, `sitemap.xml` with language alternates and photos |
| Headings | none (only `div`/`p`) | One `h1` (home), an `h2` per section, `h3` for subtopics |
| Image `alt` | the history photos had none | Translated `alt` text for every content image |
| Content | no text about the location or amenities | A new "Apartments in the heart of Eger" section with amenities and nearby sights |
| Without JavaScript | an empty page | Hungarian meta tags, JSON-LD and a `<noscript>` summary in `index.html` |
| Phone links | `tel:06…` (works only in Hungary) | `tel:+36…` |
| Fonts | no `font-display` | `font-display: swap` (text is visible while fonts load) |

## Language URLs

- Every language has its own URL: `https://rad-var-apartmanhaz.hu/hu`, `/pl`, `/en`, `/de`. Search engines index each language separately and can show the right one to each user.
- **The URL decides the language** (`I18nService`). On `/` or an unknown path, the language comes from `localStorage['language']`, then the browser language, then Hungarian. The URL is then replaced with `/<code>`; the query string and hash are kept (e.g. `?fbclid=…`).
- A language switch in the header pushes `/<code>` as a new history entry. Back/forward switch the language back.
- The flag menu items are real links (`<a href="/de" hreflang="de">`) so crawlers can follow them. Clicks are intercepted and switch the language without reloading.
- `/` is the hreflang `x-default`, the right choice for a page that redirects by language.
- The router has a single wildcard route (`app-routing.module.ts`), so it accepts the language paths. There are no routed views.

### Hosting

The static hosts must serve `index.html` for the language paths:

| Host | File | Rules |
|------|------|-------|
| FTP hosts (Apache/LiteSpeed) | `src/.htaccess` | `/hu`, `/pl`, `/en`, `/de` → `index.html`; `/en/` → `/en` (301); `http`/`www` → `https://rad-var-apartmanhaz.hu` **on the production domain only** (the dev/staging hosts have no https); gzip and cache headers |
| Azure Static Web Apps | `src/staticwebapp.config.json` | `routes` rewriting the four paths to `/index.html`; `.yaml` MIME type |

Other paths return 404 on purpose, so search engines don't index error pages that look like real pages (soft 404s). All of these files and `robots.txt`/`sitemap.xml` are copied to the build root through the `assets` list in `angular.json`.

## Head tags

`SeoService` (`src/app/shared/services/seo.service.ts`) runs an effect on the current language and sets:

- `<title>` and `<meta name="description">` from `meta.title` / `meta.description`;
- `<link rel="canonical">` to the language URL;
- `<link rel="alternate" hreflang="…">` for `hu`, `pl`, `en`, `de` and `x-default` (→ `/`);
- Open Graph: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:locale` (+ `og:locale:alternate` for the other languages), `og:image` with size and `og:image:alt`;
- Twitter: `summary_large_image` card with title, description and image;
- the JSON-LD in `<script id="structured-data">`.

It only uses Angular's `Meta`, `Title` and `DOCUMENT`, so the same code renders the tags on the server once SSR is added.

### Static defaults in `index.html`

Crawlers that don't run JavaScript (Facebook, WhatsApp, LinkedIn previews, some search engines) only see `src/index.html`. It contains the Hungarian title, description, hreflang links, Open Graph tags, the full JSON-LD and a `<noscript>` block with the name, amenities, address, phone, email, booking links and links to the other languages.

There is deliberately **no static canonical**: the same file is served for every language, so a fixed canonical would point the English page at the Hungarian one. `SeoService` adds the correct one.

`seo.service.spec.ts` fails if the static defaults drift from `hu.yaml` or from the JSON-LD that `SeoService` generates for Hungarian.

## Structured data

`buildStructuredData()` in `seo.service.ts` produces a schema.org `@graph`:

- **`LodgingBusiness`** (`#lodging`): name, alternate names, description (per language), URL, images, logo, email, telephone, postal address, geo coordinates, map link, `containedInPlace` Eger, amenities (Wi-Fi, parking, air conditioning, kitchen) and `sameAs` links (Facebook, Instagram, booking.com, Szallas.hu).
- **`WebSite`** (`#website`): name, URL, languages, publisher.
- **`WebPage`** (`<language URL>#webpage`): title, description, language, primary image.

The language-independent data lives in `src/app/shared/seo.ts`:

| Field | Value |
|-------|-------|
| Site URL | `https://rad-var-apartmanhaz.hu` |
| Email | `rad-var-apartmanhaz@gmail.com` (the contacts section still shows `info@rad-var-apartmanhaz.hu`) |
| Phones | `+36302289284`, `+36306103196` |
| Address | Almagyar u. 7, 3300 Eger, Heves, HU |
| Coordinates | 47.9019629, 20.3815486 (OpenStreetMap) |

Keep these identical to the Google Business Profile, booking.com and Szallas.hu: consistent name, address and phone are a local ranking factor.

Validate after deployment with the [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/).

## Texts

All texts are in `src/assets/i18n/*.yaml` (same keys in every file).

| Key | Purpose |
|-----|---------|
| `meta.title` | Tab title, search result title, `og:title` (≤ 60 characters) |
| `meta.description` | Search snippet, `og:description`, JSON-LD description (≤ 155 characters) |
| `meta.imageAlt` | `alt` of the share image |
| `home.tagline` | Second line of the `h1` on the home screen |
| `history.pages.*.imageAlts` | `alt` of the two photos of each history page (left, right) |
| `nearby.*` | The new section: title, intro, amenities, sights, note, outro, photo `alt` |

Titles and descriptions:

| Language | Title | Description |
|----------|-------|-------------|
| hu | Rád-Vár Apartmanház – Apartmanok, szállás Eger belvárosában | Családias apartmanok Eger belvárosában, a vár szomszédságában. Wifi, parkolás, klíma és felszerelt konyha. Foglald le egri szállásodat most! |
| en | Rád-Vár Apartmanház – Apartments in Eger, Hungary | Family-run apartments in the heart of Eger, Hungary, next to Eger Castle. Wi-Fi, parking, air conditioning and a fully equipped kitchen. Book your stay! |
| de | Rád-Vár Apartmanház – Ferienwohnungen in Eger, Ungarn | Familiäre Ferienwohnungen im Zentrum von Eger (Erlau), direkt neben der Burg. WLAN, Parkplatz, Klimaanlage und voll ausgestattete Küche. Jetzt buchen! |
| pl | Rád-Vár Apartmanház – Apartamenty i noclegi w Egerze | Rodzinne apartamenty w centrum Egeru na Węgrzech, tuż obok zamku. Wi-Fi, parking, klimatyzacja i w pełni wyposażona kuchnia. Zarezerwuj nocleg! |

The brand name stays "Rád-Vár Apartmanház" in every title, so all languages build the same brand. The existing Hungarian texts of the owner were not changed.

## Page content

- **Headings:** the home welcome text is the `h1`, with `home.tagline` as its second line ("Apartmanok Eger szívében, a vár szomszédságában"). Section titles (gallery, booking, nearby, history, contacts) are `h2`; history subtopics and the nearby lists are `h3`. A global reset in `src/styles.css` (`h1, h2, h3 { margin: 0; font-size: inherit; font-weight: inherit; }`) keeps them looking exactly like the old `div`/`p` elements. Before/after screenshots of the gallery and booking sections are pixel-identical.
- **Nearby section** (`<app-nearby>`, between booking and history, not in the header menu): describes the apartments, the amenities and the sights within walking distance, with a photo of Eger's old town (`assets/site-images/eger-old-town.jpg`, 144 kB, lazy-loaded).

  | Sight | Distance (straight line) |
  |-------|--------------------------|
  | Eger Castle | ~300 m |
  | Dobó István Square | ~350 m |
  | Minaret | ~500 m |
  | Eger Thermal Bath | ~550 m |
  | Lyceum and Basilica | ~700 m |
  | Railway station | ~1.1 km |
  | Valley of the Beautiful Women (wine cellars) | ~2 km |

  The distances were calculated from OpenStreetMap (Nominatim) coordinates. The German text also uses the German name of Eger, "Erlau".
- **Images:** every content image has translated `alt` text; decorative images (arrows, icons, quote marks) keep `alt=""`.
- **Short landscape phones:** the home `h1` is smaller below 500 px height so the welcome line and the tagline fit the bottom bar (the welcome line was already cut off there before).

## Crawler files

- `src/robots.txt`: allows everything except the Photoshop sources and the spreadsheet in `assets`, and points to the sitemap.
- `src/sitemap.xml`: the four language URLs, each with `xhtml:link` alternates for all languages and `x-default`, plus the gallery photos and the old-town photo as `image:image`. **Update `<lastmod>` when the texts change.**

## Tests and checks

| Check | What it covers |
|-------|----------------|
| `i18n.service.spec.ts` | `/` redirect keeps query/hash; the URL wins over the saved and browser language; a switch pushes a history entry; back/forward follow the URL; `languageFromPath()`; the URL still names the shown language if a file fails to load |
| `seo.service.spec.ts` | Title, description, canonical, Open Graph and alternate locales per language; hreflang links; JSON-LD content; static `index.html` defaults equal `hu.yaml` and the generated JSON-LD |
| `node .github/skills/manage-translations/scripts/check-i18n.mjs` | Same keys and list lengths in every language file |
| Visual check skill | Layout at 12 resolutions; `app-nearby` was added to its section list |

These were also checked manually in headless Chrome: redirects from `/` for German, Hungarian and Polish browsers; `/en` opened with a Hungarian browser; `/pl/`; exactly one canonical and one JSON-LD block; five hreflang links; no images without `alt`; no console errors; language switch and Back.

## Maintenance

- **Changing `meta` texts:** edit every YAML file; for Hungarian also update the static copy in `src/index.html` (the unit test tells you).
- **Changing business data** (phone, email, address, social links): edit `src/app/shared/seo.ts` and the JSON-LD in `src/index.html`, and the contacts template if it is visible there.
- **Adding a language:** follow the [manage-translations skill](../.github/skills/manage-translations/SKILL.md). Besides the usual steps, add it to `OG_LOCALES` in `seo.ts`, the hreflang links in `index.html`, `sitemap.xml`, the rewrite in `.htaccess` and the `routes` in `staticwebapp.config.json`.
- **Links:** the global `a:link, a:visited` style in `src/styles/light-blue-style.scss` (gold text sweep, `display: inline-block`, background clipped to text) applies to every `<a>` with an `href`. When you turn a clickable element into a real link for SEO, override it with a more specific selector, as `.lang-dial .lang-dial-action` does in `header.component.scss`.
- **Adding a section:** use one `h2` for its title, translated `alt` texts and real text (not text inside images).
- **SSR (planned):** keep `SeoService` free of `window`/`localStorage`. With SSR the tags are rendered on the server and the per-language routes can replace the wildcard route. `I18nService` and `Configuration` still use `document`, `localStorage`, `sessionStorage` and `navigator` directly and will need platform checks.

## After deployment (outside the code)

1. Add `https://rad-var-apartmanhaz.hu` to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters), and submit `https://rad-var-apartmanhaz.hu/sitemap.xml`.
2. In Search Console, inspect `/hu`, `/en`, `/de` and `/pl` and request indexing.
3. Create or claim the **Google Business Profile** (category: apartment building / holiday apartment rental) with exactly the name, address and phone from `seo.ts`, the website URL, photos and amenities, and ask guests for reviews. For "Eger apartments" the map results are often above the normal results.
4. Link the website from the booking.com, Szallas.hu, Facebook and Instagram profiles, and from local directories (e.g. the Eger tourism site).
5. Check the share preview with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) for each language URL.
6. Have native speakers proofread the Polish, English and German texts (they were machine-written).
7. Make sure the deployed host serves the language URLs: `curl -I https://rad-var-apartmanhaz.hu/en` must return `200`.

## Known limitations and next steps

- Until SSR is live, search engines see the per-language titles only after running JavaScript (Google and Bing do). Social previews always show the Hungarian defaults until then.
- Page speed affects ranking: the intro animation and loading screen delay the first content, and `src/assets` contains multi-MB JPEGs and TTF fonts. Converting photos to WebP/AVIF at web sizes and fonts to WOFF2 would improve Core Web Vitals.
- `priceRange`, check-in/check-out times and the number of guests are not in the structured data because they weren't known. Add them to `buildStructuredData()` and the static JSON-LD when available.
- The nearby section is not in the header menu; add `header.nearby` texts and a menu entry if wanted (check the header width in German at 1024 px).
