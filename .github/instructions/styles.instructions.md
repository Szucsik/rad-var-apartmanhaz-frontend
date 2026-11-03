---
description: "Use when editing SCSS/CSS, layout, responsive design, breakpoints, fonts or colours of the site. Covers sizes.scss mixins, header clearance, section heights and the theme file."
applyTo: "src/**/*.scss, src/**/*.css"
---
# Styles and responsive layout

The site must work on every desktop size (1024–2560 px wide) and on phones in both orientations (360 px wide and up, 390 px tall landscape). Check changes with the [visual-check skill](../skills/visual-check/SKILL.md).

## Shared values: `src/app/shared/scss/sizes.scss`

```scss
@use 'src/app/shared/scss/sizes' as *;

.my-section {
    @include full-screen-height;            // min-height: 100vh / 100svh
    padding-top: $header-clearance-mobile;  // 96px: fixed header + hanging logo

    @include desktop {                      // >= 1024px ($desktop-breakpoint)
        padding-top: $header-clearance;     // 130px
    }
    @include wide { … }                     // >= 1280px ($wide-breakpoint)
}
```

- Use these mixins and variables. Don't introduce new ad-hoc breakpoints, and especially not orientation-only switches for the mobile/desktop decision: they broke laptops and landscape phones before.
- If you change `$desktop-breakpoint`, also update the `matchMedia('(max-width: 1023.98px)')` queries in the header, booking and contacts components.
- Short landscape phones are handled with `@media only screen and (max-height: 500px)` blocks where needed.

## Layout rules

- A section is at least one viewport tall and **grows with its content** (`full-screen-height` mixin). The only exception is the home hero, which is exactly `100svh` tall because of its fixed parallax layers. Don't set fixed heights or place content with large negative margins or `vw` offsets; that's what broke the original layout.
- Use flexbox or grid, and `clamp(min, preferred-vw, max)` for font sizes.
- Images: `width: 100%`/`max-width` with `height: auto`; use `object-fit` where an aspect ratio must be kept (gallery photos are 887×665, 4:3).
- No horizontal overflow at any size.
- `* { box-sizing: border-box }` is global (in `src/styles.css`), and the layout depends on it.

## Where styles live

| File | Content |
|------|---------|
| Component `.scss`/`.css` | Layout of that component. The budget is **20 kB per component style** (a build error above that). |
| `src/styles/light-blue-style.scss` | Site theme: colours, fonts and decorative effects per section (global). |
| `src/styles.css` | `@font-face` declarations (fonts in `src/assets/fonts/`), the global reset and the `appRipple` styles. |
| `src/styles/dark-style.css`, `light-style.css` | Not used by the build. |

- Use Sass `@use`, not `@import` (`@import` is deprecated and the build warns about it).
- `header.component.scss` and `swiper.component.scss` are **unencapsulated** (`ViewEncapsulation.None`), so their selectors are global. Keep them specific.
- The language flags come from the classes `lang-hun-icon`, `lang-pol-icon`, `lang-eng-icon` and `lang-ger-icon` in `header.component.scss`. The language button gets the current one through `I18nService` / `LANGUAGES`.
- Class names used by `ScrollAnimationService` (`.gallery-header`, `.booking-text-1`, `.topic-2` …) must not be renamed without updating that service.
