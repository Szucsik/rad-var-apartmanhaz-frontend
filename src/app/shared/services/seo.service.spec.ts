import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { load } from 'js-yaml';
import { I18nService } from './i18n.service';
import { SeoService, buildStructuredData } from './seo.service';

const FILES: Record<string, string> = {
  'assets/i18n/hu.yaml': `
meta:
  title: Magyar cím
  description: Magyar leírás
  imageAlt: Magyar kép
`,
  'assets/i18n/en.yaml': `
meta:
  title: English title
  description: English description
  imageAlt: English image
`,
};

const head = () => document.head;
const attr = (selector: string, name = 'content') => head().querySelector(selector)?.getAttribute(name);

describe('SeoService', () => {
  let i18n: I18nService;

  beforeEach(async () => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      const body = FILES[url];
      return { ok: body !== undefined, status: body === undefined ? 404 : 200, url, text: async () => body ?? '' } as Response;
    }));
    TestBed.inject(Location).replaceState('/hu');
    i18n = TestBed.inject(I18nService);
    TestBed.inject(SeoService);
    await i18n.init();
    TestBed.tick();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('sets the title, description, canonical URL and social tags of the current language', async () => {
    expect(document.title).toBe('Magyar cím');
    expect(attr('meta[name="description"]')).toBe('Magyar leírás');
    expect(attr('link[rel="canonical"]', 'href')).toBe('https://rad-var-apartmanhaz.hu/hu');
    expect(attr('meta[property="og:locale"]')).toBe('hu_HU');

    await i18n.setLanguage('en');
    TestBed.tick();

    expect(document.title).toBe('English title');
    expect(attr('meta[name="description"]')).toBe('English description');
    expect(attr('link[rel="canonical"]', 'href')).toBe('https://rad-var-apartmanhaz.hu/en');
    expect(head().querySelectorAll('link[rel="canonical"]').length).toBe(1);
    expect(attr('meta[property="og:url"]')).toBe('https://rad-var-apartmanhaz.hu/en');
    expect(attr('meta[property="og:title"]')).toBe('English title');
    expect(attr('meta[property="og:image:alt"]')).toBe('English image');
    expect(attr('meta[property="og:locale"]')).toBe('en_GB');
    const alternateLocales = [...head().querySelectorAll('meta[property="og:locale:alternate"]')].map(tag => tag.getAttribute('content'));
    expect(alternateLocales).toEqual(['hu_HU', 'pl_PL', 'de_DE']);
  });

  it('links every language version with hreflang', () => {
    const alternates = [...head().querySelectorAll('link[rel="alternate"][hreflang]')]
      .map(link => `${link.getAttribute('hreflang')} ${link.getAttribute('href')}`);
    expect(alternates).toEqual([
      'hu https://rad-var-apartmanhaz.hu/hu',
      'pl https://rad-var-apartmanhaz.hu/pl',
      'en https://rad-var-apartmanhaz.hu/en',
      'de https://rad-var-apartmanhaz.hu/de',
      'x-default https://rad-var-apartmanhaz.hu/',
    ]);
  });

  it('describes the guesthouse with schema.org structured data', async () => {
    await i18n.setLanguage('en');
    TestBed.tick();

    const scripts = head().querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(1);
    const graph = JSON.parse(scripts[0].textContent!)['@graph'];
    const lodging = graph.find((node: any) => node['@type'] === 'LodgingBusiness');
    expect(lodging.name).toBe('Rád-Vár Apartmanház');
    expect(lodging.description).toBe('English description');
    expect(lodging.url).toBe('https://rad-var-apartmanhaz.hu/en');
    expect(lodging.address.addressLocality).toBe('Eger');
    expect(graph.find((node: any) => node['@type'] === 'WebPage').inLanguage).toBe('en');
  });
});

describe('static SEO defaults in index.html', () => {
  let hu: { meta: Record<string, string> };
  let parsed: Document;

  beforeAll(async () => {
    // Untyped on purpose: the project has no @types/node; Vitest runs in Node, so the module exists.
    const fsModule: string = 'node:fs';
    const { readFileSync } = await import(/* @vite-ignore */ fsModule);
    parsed = new DOMParser().parseFromString(readFileSync('src/index.html', 'utf8'), 'text/html');
    hu = load(readFileSync('src/assets/i18n/hu.yaml', 'utf8')) as typeof hu;
  });

  it('match the Hungarian texts', () => {
    expect(parsed.documentElement.lang).toBe('hu');
    expect(parsed.title).toBe(hu.meta.title);
    expect(parsed.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(hu.meta.description);
    expect(parsed.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(hu.meta.title);
    expect(parsed.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe(hu.meta.description);
    expect(parsed.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')).toBe(hu.meta.imageAlt);
  });

  it('contain the same structured data that SeoService generates for Hungarian', () => {
    const script = parsed.getElementById('structured-data');
    expect(JSON.parse(script!.textContent!)).toEqual(buildStructuredData('hu', hu.meta.title, hu.meta.description));
  });
});
