#!/usr/bin/env python3
"""Combines the screenshots of screenshot.mjs into one contact sheet per resolution.

Usage: python3 contact-sheet.py <screenshot-folder> [thumbnail-width]
Writes <folder>/sheet-<resolution>.png. Requires Pillow (pip install pillow).
"""
import glob
import os
import sys

from PIL import Image

folder = sys.argv[1]
width = int(sys.argv[2]) if len(sys.argv) > 2 else 340
names = sorted({os.path.basename(f).rsplit('-', 1)[0] for f in glob.glob(os.path.join(folder, '*-??.png'))})

for name in names:
    images = [Image.open(f).convert('RGB') for f in sorted(glob.glob(os.path.join(folder, f'{name}-??.png')))]
    scale = width / images[0].width
    heights = [int(image.height * scale) for image in images]
    columns = min(len(images), max(1, 1400 // width))
    rows = (len(images) + columns - 1) // columns
    sheet = Image.new('RGB', (columns * (width + 8), rows * (max(heights) + 8)), 'red')
    for index, image in enumerate(images):
        sheet.paste(image.resize((width, heights[index])), ((index % columns) * (width + 8), (index // columns) * (max(heights) + 8)))
    target = os.path.join(folder, f'sheet-{name}.png')
    sheet.save(target)
    print(target)
