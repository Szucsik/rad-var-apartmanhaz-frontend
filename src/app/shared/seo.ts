import type { LanguageCode } from './services/i18n.service';

/**
 * Language-independent business data for search engines (meta tags and schema.org JSON-LD).
 * Keep it in sync with the static copy in `src/index.html`, `src/sitemap.xml` and the contacts page.
 */
export const SITE_URL = 'https://rad-var-apartmanhaz.hu';
export const SITE_NAME = 'Rád-Vár Apartmanház';

/** Open Graph locale per language. */
export const OG_LOCALES: Record<LanguageCode, string> = {
  hu: 'hu_HU',
  pl: 'pl_PL',
  en: 'en_GB',
  de: 'de_DE',
};

export const BUSINESS = {
  email: 'rad-var-apartmanhaz@gmail.com',
  telephones: ['+36302289284', '+36306103196'],
  address: {
    streetAddress: 'Almagyar u. 7',
    addressLocality: 'Eger',
    postalCode: '3300',
    addressRegion: 'Heves',
    addressCountry: 'HU',
  },
  geo: { latitude: 47.9019629, longitude: 20.3815486 },
  mapUrl: 'https://goo.gl/maps/m9mMU29RR27igdeP8',
  sameAs: [
    'https://www.facebook.com/rad.var.apartmanhaz',
    'https://www.instagram.com/radvarapartmanhaz',
    'https://www.booking.com/hotel/hu/rad-var-apartmanhaz.hu.html',
    'https://szallas.hu/rad-var-apartmanhaz-eger',
  ],
  shareImage: { path: 'assets/seo/og-image.jpg', width: 1200, height: 630 },
  photos: ['assets/photos/1.jpeg', 'assets/photos/3.jpeg', 'assets/photos/5.jpeg', 'assets/photos/21.jpeg'],
  logo: 'assets/site-images/castle-logo.png',
} as const;

/** Absolute URL of a language version, e.g. `https://rad-var-apartmanhaz.hu/en`. */
export function languageUrl(code: LanguageCode): string {
  return `${SITE_URL}/${code}`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}/${path.replace(/^\//, '')}`;
}
