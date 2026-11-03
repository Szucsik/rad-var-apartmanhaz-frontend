---
name: visual-check
description: 'Screenshot every section of the Rád-Vár site at 12 desktop, tablet and mobile resolutions with headless Chrome, and report horizontal overflow and page errors. Use when verifying UI, layout, responsive or CSS changes, debugging misplaced images or shapes, or checking how a language looks on screen.'
argument-hint: 'Optional: sizes (e.g. 1440x900,390x844) and language (hu|pl|en|de)'
---

# Visual check across resolutions

Layout bugs in this site are often invisible in a single desktop window: laptops at 1280×720, landscape phones and tablets broke before. Use this skill after any template or style change.

## What it does

[screenshot.mjs](./scripts/screenshot.mjs) opens the site in headless Google Chrome for each viewport size:

- It skips the intro animation by setting the `isLoaded` session flag, and can force a language.
- It scrolls through the page one viewport at a time, waiting about 2 s for the scroll animations to play, and saves a screenshot per step.
- It prints the top and height of each section, and flags **horizontal overflow** and **page or console errors**. If it flags anything, it exits with code 1.

Default sizes: `2560x1440 1920x1080 1536x864 1440x900 1366x768 1280x720 1024x768 768x1024 844x390 430x932 390x844 360x640`.

## Procedure

1. Start the site on a free port and leave it running (from the repo root):
   ```bash
   ./run.sh --port 4310
   ```
   Wait until `curl -s http://localhost:4310/ | grep -q '<app-root>'` succeeds.
2. Install `playwright-core` in a scratch folder **outside the repository**. The script resolves it from the current directory and uses the system Google Chrome; set `CHROME_PATH=/path/to/chrome` if Chrome isn't in the default location.
   ```bash
   mkdir -p /tmp/radvar-visual && cd /tmp/radvar-visual
   npm init -y >/dev/null && npm i playwright-core
   ```
3. Run the check from that scratch folder. Every option is optional:
   ```bash
   node <repo>/.github/skills/visual-check/scripts/screenshot.mjs \
     --url=http://localhost:4310/ --out=/tmp/radvar-visual/shots \
     [--sizes=1440x900,390x844] [--lang=en] [--settle=2200]
   ```
4. Optionally make one contact sheet per resolution (needs Pillow: `pip install pillow`):
   ```bash
   python3 <repo>/.github/skills/visual-check/scripts/contact-sheet.py /tmp/radvar-visual/shots 340
   ```
5. **Look at the images.** Open `sheet-<size>.png` (or the single screenshots) and check that:
   - no text or image overlaps another section;
   - nothing is hidden under the fixed header or the hanging logo;
   - gallery, booking and contacts fit their section;
   - the history images sit beside the text (≥ 1280 px) or below it;
   - the flag button and the menu are reachable.
6. For languages with longer texts (`de`, `pl`), repeat at a desktop size and a phone size with `--lang`.
7. Stop the dev server and delete the scratch folder when you're done.

## Reading the output

```
1440x900   7 shots  home@0+900 gallery@900+900 booking@1800+900 history@2700+2700 contacts@5400+900
390x844    9 shots  home@0+844 ... contacts@5771+1211
```

`section@top+height` is in CSS pixels. A section shorter than the viewport height is suspicious (each section is meant to be at least one viewport tall). `!! HORIZONTAL OVERFLOW` and `!! PAGE ERROR(S)` must be fixed.

## Notes

- The output, about 100 PNGs, is scratch data. Never commit it.
- Interactions (menus, language picker, booking arrows) aren't scripted. Click them with the browser tools, or extend a copy of the script in your scratch folder.
