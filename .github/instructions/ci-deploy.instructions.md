---
description: "Use when editing GitHub Actions workflows, deployment, FTP/Azure Static Web Apps configuration, Node versions in CI, or anything about branches that deploy (develop, staging, main)."
applyTo: ".github/workflows/**, src/staticwebapp.config.json, src/.htaccess, build.sh, run.sh"
---
# CI and deployment

Every deploy branch publishes the site **on push**:

| Workflow | Trigger | Target |
|----------|---------|--------|
| `development.yml` | push `develop` | FTP `ftp.atw.hu` → `./public_html/` |
| `staging.yml` | push `staging` | FTP `files.000webhost.com` → `./public_html/` |
| `production.yml` | push `main` | FTP `wh23.rackhost.hu` → `./` |
| `main.yml` | push `main` | FTP `wh24.rackhost.hu` → `./` |
| `azure-static-web-apps-delightful-plant-0e6866a03.yml` | push `main`, PRs to `main` | Azure Static Web Apps (PRs create public preview environments) |
| `docker-publish.yml` | push `main`, manual | GitHub Container Registry `ghcr.io/<owner>/rad-var-apartmanhaz-frontend` (`latest`, `sha-<commit>`) |

## Rules

- **Never push to `develop`, `staging` or `main`, and never open PRs against `main`, unless the owner explicitly asks.** Each of these deploys a live site.
- **Secrets:** always use `${{ secrets.NAME }}`; never write credentials into a workflow, script or doc.
  - `staging.yml` currently contains a plaintext FTP password; this is a known issue. Don't copy or print it.
  - When editing that workflow, replace the password with a secret (for example `secrets.FTP_PW_STAGING`). Tell the owner the secret must be created and the old password rotated.
- **Node version:** Angular 22 needs Node `^22.22.3 || ^24.15.0 || >=26`. The workflows use `node-version: [24.x]`; keep them in line with `engines` in `package.json`.
- **Build output:** `npm run ng build` writes to `dist/rad-var-apartmanhaz/`:
  - `browser/`: the client app and static assets.
  - `server/server.mjs`: the Node/Express SSR server.
  - The FTP actions upload `./dist/rad-var-apartmanhaz/browser/` (static CSR).
  - The Azure workflow uses `output_location: "dist/rad-var-apartmanhaz/browser"` (static CSR).
  - If you change `outputPath`, update all of them.
- **Azure MIME types and routes:** `src/staticwebapp.config.json` is copied to the build root so Azure Static Web Apps serves the `.yaml` translation files and rewrites the language URLs (`/hu`, `/pl`, `/en`, `/de`) to `index.html`. Keep it in the `assets` list of `angular.json`.
- **Docker image:** `Dockerfile` builds the browser and server bundles and runs `dist/rad-var-apartmanhaz/server/server.mjs` with Node on port 4000 (Express serves assets and SSR pages; no nginx). The container needs `NG_ALLOWED_HOSTS` to include the public Host header. `.dockerignore` excludes `src/assets/photoshop-files` (83 MB of sources) — keep that exclusion. `docker-build-push.sh`, `docker-compose.yml` and `docker-publish.yml` use the same GHCR image name.
- **FTP hosts (Apache/LiteSpeed):** `src/.htaccess` is copied to the build root and does the same rewrites, plus the `https`/non-`www` redirect on the production domain only. `robots.txt` and `sitemap.xml` are copied to the root too. If a host ignores `.htaccess`, the language URLs return 404.
- **Local scripts:** `build.sh` and `run.sh` run `npm ci` when `node_modules` is missing, then `ng build` / `ng serve` with any extra arguments. Keep them POSIX-bash compatible and executable (`chmod +x`).
- **Verify before changing a workflow:** run `./build.sh` and `npx ng test --watch=false` locally. The workflows don't run tests today; consider adding `npx ng test --watch=false` before the build step when touching them.
