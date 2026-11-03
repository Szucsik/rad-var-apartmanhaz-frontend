---
description: "Use when creating or editing Angular components, directives, services or templates in this repo: NgModule declarations, standalone: false, Eager change detection, translations in templates, GSAP/animation hooks."
applyTo: "src/app/**/*.ts, src/app/**/*.html"
---
# Angular components and services

This app is **NgModule-based** on Angular 22. It is not standalone.

## New component checklist

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from 'src/app/shared/services/i18n.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  protected readonly t = inject(I18nService).t;
}
```

- Add the component to `declarations` in `src/app/app.module.ts`.
- `ChangeDetectionStrategy.Eager` is required. Angular 22 defaults to OnPush, and this code base updates state from timers, image `onload`, GSAP callbacks and `EventEmitter`s. Under OnPush those changes never render.
- Import shared code with the `src/app/...` path (mapped in `tsconfig.json`), as the existing files do.
- If the component is a new page section:
  - add it to `src/app/components/pages/main.component.html` and keep the `app-<name>` selector; `ScrollAnimationService.navigate('<name>')` scrolls to that element;
  - to show it in the header menu, add `'<name>'` to `menuSections` in `header.component.ts` (the order there is the menu order) and add a `header.<name>` label to every language file.

## Templates

- Put no literal user-visible text in templates, including `alt`, `title` and `aria-label`. Use `{{ t('section.key') }}` and `tList('section.key')`, and add the key to every `src/assets/i18n/*.yaml` file (see `translations.instructions.md`).
- Prefer the built-in control flow (`@if`, `@for (x of list; track ...)`) for new code. Existing `*ngIf`/`[ngClass]` usage is fine; don't rewrite it without a reason.
- Clickable `div`s need `role="button"`, `tabindex="0"` and a `(keydown.enter)` handler, as in the header, gallery and booking templates.

## Animations and the DOM

- `ScrollAnimationService` finds elements by CSS class. Check `src/app/shared/services/scrollAnimation.service.ts` before renaming or removing classes such as `.gallery-header`, `.images`, `.booking-text-1`, `.topic-1` or `.timeline-container`.
- Pass GSAP **elements** only. Use `nativeElement.children`, never `childNodes`; Angular control flow adds comment nodes, and GSAP throws on them every frame.
- Start intro animations from the `AnimationService.contentLoaded` event (see the header, start and main components). Timings are in `src/app/shared/config.ts`.
- After a change that alters page height (for example new content or a language switch), call `ScrollAnimationService.refresh()`.

## Responsive logic in TypeScript

The mobile/desktop switch in code uses `window.matchMedia('(max-width: 1023.98px)')` (header, booking, contacts). It must match `$desktop-breakpoint` in `src/app/shared/scss/sizes.scss`. Update both together, and prefer CSS-only solutions where possible.
