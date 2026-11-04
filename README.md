# RadVarApartmanhaz

Website of the Rád-Vár Apartmanház guesthouse in Eger. Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Guide for AI coding agents (rules, commands, workflow): [AGENTS.md](AGENTS.md).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5 and has since been upgraded to Angular 22.

Requires Node.js `^22.22.3`, `^24.15.0` or `>=26.0.0` (see `engines` in `package.json`).

## Scripts

- `./build.sh` builds the project into `dist/rad-var-apartmanhaz/`: the browser app in `browser/` and the Node SSR server in `server/server.mjs` (extra arguments are passed to `ng build`, e.g. `./build.sh --configuration development`).
- `./run.sh` starts the dev server at `http://localhost:4200/` (extra arguments are passed to `ng serve`, e.g. `./run.sh --port 4300 --open`).
- `npm run serve:ssr:rad-var-apartmanhaz` runs the built SSR server (default `http://localhost:4000/`).

Both scripts run `npm ci` first if `node_modules` is missing.

## Texts and languages

Every translatable text of the page lives in one YAML file per language in `src/assets/i18n/`: `hu.yaml` (Hungarian, default), `pl.yaml`, `en.yaml` and `de.yaml`. All files use the same keys. Templates read them through the `t('section.key')` and `tList('section.key')` functions of `I18nService` (`src/app/shared/services/i18n.service.ts`). A key missing from a language falls back to the Hungarian text. Language-independent data (email address, phone numbers, the Facebook/Instagram brand labels) stays in the templates.

- To change a text, edit the YAML files. They are loaded at runtime, so on a deployed site you can update them without rebuilding.
- To add a language, create `src/assets/i18n/<code>.yaml` with the same keys, add it to the `LanguageCode` type and the `LANGUAGES` list in `i18n.service.ts`, and add a flag class in `header.component.scss`.

Every language has its own URL: `/hu`, `/pl`, `/en`, `/de`. Opening `/` redirects to the language picked earlier in the header flag menu (remembered in `localStorage`), otherwise to the browser language if it is supported, otherwise to Hungarian.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Server-side rendering and Docker

The app is server-side rendered with Angular SSR (`@angular/ssr`). `/hu`, `/pl`, `/en` and `/de` return fully rendered HTML with the language-specific `<title>`, canonical, hreflang and JSON-LD; `/` stays client-side because it redirects to the visitor's saved or browser language. The server reads the YAML translations from `browser/assets/i18n`, so the translated HTML is available on the first request.

`Dockerfile` builds the browser and server bundles, then runs `server/server.mjs` with Node on port 4000 (no nginx needed; Express serves the assets and the SSR pages). `.dockerignore` keeps `node_modules`, `dist`, `.git` and the 83 MB Photoshop sources out of the build.

- Build and run a local image: `./docker-local.sh` builds `rad-var-apartmanhaz:local-testing` and (re)starts it on `http://localhost:8080/` (rerun it after changing the source; `PORT` overrides the port).
- Build and push to GitHub Container Registry: `./docker-build-push.sh` (run `docker login ghcr.io` first, or set `GHCR_USER` and `GHCR_TOKEN` with the `write:packages` scope). Tags: `latest` and `sha-<commit>`.
- Pull and run the latest image: `docker compose pull && docker compose up -d`, then open `http://localhost:8080/`. `PORT` overrides the published port and `IMAGE` the image. `NG_ALLOWED_HOSTS` (comma-separated) sets the Host-header allowlist; add the server's public domain or IP if it differs from the defaults.
- `.github/workflows/docker-publish.yml` publishes the image to `ghcr.io/<owner>/<repo>` on every push to `main` (a merged PR) and on manual dispatch, using the built-in `GITHUB_TOKEN`.

The FTP and Azure Static Web Apps workflows still deploy the static `browser/` build (client-side rendering) because those hosts cannot run Node. The Docker/Ubuntu host is the SSR deployment.

The GHCR package is private by default: make it public in the package settings, or run `docker login ghcr.io` on the server before `docker compose pull`.

## Running unit tests

Run `ng test` to execute the unit tests via [Vitest](https://vitest.dev) (jsdom environment). Use `ng test --watch=false` for a single run.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
