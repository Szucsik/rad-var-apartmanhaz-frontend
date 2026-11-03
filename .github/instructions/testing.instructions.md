---
description: "Use when writing or fixing unit tests (*.spec.ts), Vitest/jsdom setup, test failures about missing browser APIs, or TestBed configuration in this repo."
applyTo: "src/**/*.spec.ts, src/test-setup.ts"
---
# Unit tests

- **Runner:** Vitest with jsdom, through the Angular `@angular/build:unit-test` builder. There is no Karma.
- **Run:** `npx ng test --watch=false`. Plain `npx ng test` stays in watch mode.
- **Globals:** `describe`, `it`, `expect`, `vi`, `beforeEach` and friends are global (`vitest/globals` in `tsconfig.spec.json`). Use `vi.fn()`, `vi.spyOn()` and `vi.stubGlobal()`, not Jasmine APIs.

## TestBed

The app is NgModule-based, so specs import the whole `AppModule` instead of declaring single components (a lone component can't resolve its child selectors):

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { BookingComponent } from './booking.component';

beforeEach(async () => {
  await TestBed.configureTestingModule({ imports: [ AppModule ] }).compileComponents();
});
```

`AppModule` runs the `I18nService.init()` app initializer. In jsdom the YAML fetch fails and is caught, so `t()` returns the keys. Don't assert on translated texts in component specs; use `i18n.service.spec.ts`, which mocks `fetch` with `vi.stubGlobal('fetch', ...)`.

## Browser APIs missing in jsdom

`src/test-setup.ts` stubs `IntersectionObserver` (history pages) and `window.matchMedia` (header, booking, contacts; it always returns `matches: false`, so the desktop layout). If new code uses another missing API, add a minimal stub there rather than in individual specs.

## Expectations

- New services or logic get a focused spec next to the file (`*.spec.ts`).
- The production build excludes specs and `src/test-setup.ts` (`tsconfig.app.json`).
- Visual and layout behaviour can't be tested in jsdom; use the [visual-check skill](../skills/visual-check/SKILL.md).
