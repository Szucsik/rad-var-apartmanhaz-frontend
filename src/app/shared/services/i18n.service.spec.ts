import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { I18nService, languageFromPath } from './i18n.service';

const FILES: Record<string, string> = {
  'assets/i18n/hu.yaml': `
meta:
  title: Magyar cím
header:
  gallery: Galéria
  contacts: Elérhetőségek
gallery:
  images:
    - Háló
    - Konyha
`,
  'assets/i18n/en.yaml': `
meta:
  title: English title
header:
  gallery: Gallery
gallery:
  images:
    - Bedroom
    - Kitchen
`,
};

describe('I18nService', () => {
  let service: I18nService;
  let fetchMock: ReturnType<typeof vi.fn>;
  // TestBed uses a mock platform location, so URLs are checked through Angular's Location.
  let location: Location;

  beforeEach(() => {
    localStorage.clear();
    fetchMock = vi.fn(async (url: string) => {
      const body = FILES[url];
      return { ok: body !== undefined, status: body === undefined ? 404 : 200, url, text: async () => body ?? '' } as Response;
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => { });
    service = TestBed.inject(I18nService);
    location = TestBed.inject(Location);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('reads the texts of the selected language from its YAML file', async () => {
    await service.init();
    await service.setLanguage('en');

    expect(fetchMock).toHaveBeenCalledWith('assets/i18n/en.yaml');
    expect(service.language()).toBe('en');
    expect(service.t('header.gallery')).toBe('Gallery');
    expect(service.tList('gallery.images')).toEqual(['Bedroom', 'Kitchen']);
    expect(document.documentElement.lang).toBe('en');
  });

  it('falls back to Hungarian, then to the key itself', async () => {
    await service.init();
    await service.setLanguage('en');

    expect(service.t('header.contacts')).toBe('Elérhetőségek');
    expect(service.t('header.unknown')).toBe('header.unknown');
    expect(service.tList('header.gallery')).toEqual([]);
  });

  it('remembers the chosen language and uses it on the next visit', async () => {
    await service.init();
    await service.setLanguage('en');
    expect(localStorage.getItem('language')).toBe('en');

    TestBed.resetTestingModule();
    const nextVisit = TestBed.inject(I18nService);
    await nextVisit.init();
    expect(nextVisit.language()).toBe('en');
  });

  it('picks the browser language on the first visit', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-GB', 'hu']);
    await service.init();
    expect(service.language()).toBe('en');
  });

  it('keeps the current language when a language file cannot be loaded', async () => {
    await service.init();
    await service.setLanguage('hu');
    await service.setLanguage('de');

    expect(service.language()).toBe('hu');
    expect(service.t('header.gallery')).toBe('Galéria');
    expect(console.warn).toHaveBeenCalled();
  });

  it('redirects / to the language URL, keeping the query and hash', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-GB']);
    location.replaceState('/', 'utm_source=test');
    const replaceState = vi.spyOn(location, 'replaceState');
    await service.init();

    expect(location.path()).toBe('/en?utm_source=test');
    expect(replaceState).toHaveBeenCalledWith('/en?utm_source=test');
  });

  it('still names the shown language in the URL when the detected language cannot be loaded', async () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['de']);
    await service.init();

    expect(service.language()).toBe('hu');
    expect(location.path()).toBe('/hu');
  });

  it('takes the language from the URL before the saved and the browser language', async () => {
    localStorage.setItem('language', 'hu');
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['hu']);
    location.replaceState('/en');
    await service.init();

    expect(service.language()).toBe('en');
    expect(location.path()).toBe('/en');
  });

  it('puts a language switch into the URL as a new history entry', async () => {
    location.replaceState('/hu');
    await service.init();
    const go = vi.spyOn(location, 'go');
    await service.setLanguage('en');

    expect(go).toHaveBeenCalledWith('/en');
    expect(location.path()).toBe('/en');
  });

  it('follows the URL on browser back/forward', async () => {
    location.replaceState('/en');
    await service.init();
    location.replaceState('/hu');
    await vi.waitFor(() => expect(service.language()).toBe('hu'));
  });

  it('reads the language from a path', () => {
    expect(languageFromPath('/en')).toBe('en');
    expect(languageFromPath('/de/')).toBe('de');
    expect(languageFromPath('/PL?x=1#y')).toBe('pl');
    expect(languageFromPath('/')).toBeUndefined();
    expect(languageFromPath('/fr')).toBeUndefined();
    expect(languageFromPath('/english')).toBeUndefined();
  });
});
