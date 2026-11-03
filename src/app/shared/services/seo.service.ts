import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BUSINESS, OG_LOCALES, SITE_NAME, SITE_URL, absoluteUrl, languageUrl } from '../seo';
import { I18nService, LANGUAGES, LanguageCode } from './i18n.service';

const STRUCTURED_DATA_ID = 'structured-data';

/**
 * Keeps the search engine and social media tags of `<head>` in sync with the current language:
 * title, description, canonical URL, hreflang alternates, Open Graph / Twitter tags and schema.org JSON-LD.
 * Only uses Angular's `Meta`, `Title` and `DOCUMENT`, so it also works with server-side rendering.
 */
@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly i18n = inject(I18nService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  constructor() {
    effect(() => this.update(this.i18n.language()));
  }

  update(code: LanguageCode): void {
    const t = this.i18n.t;
    const title = t('meta.title');
    const description = t('meta.description');
    const url = languageUrl(code);
    const image = absoluteUrl(BUSINESS.shareImage.path);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });

    this.setLink('canonical', url);
    for (const language of LANGUAGES) {
      this.setLink('alternate', languageUrl(language.code), language.code);
    }
    this.setLink('alternate', `${SITE_URL}/`, 'x-default');

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALES[code] });
    this.meta.getTags('property="og:locale:alternate"').forEach(tag => this.meta.removeTagElement(tag));
    this.meta.addTags(LANGUAGES.filter(language => language.code !== code)
      .map(language => ({ property: 'og:locale:alternate', content: OG_LOCALES[language.code] })));
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: String(BUSINESS.shareImage.width) });
    this.meta.updateTag({ property: 'og:image:height', content: String(BUSINESS.shareImage.height) });
    this.meta.updateTag({ property: 'og:image:alt', content: t('meta.imageAlt') });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: t('meta.imageAlt') });

    this.setStructuredData(buildStructuredData(code, title, description));
  }

  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) {
        link.setAttribute('hreflang', hreflang);
      }
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setStructuredData(data: object): void {
    let script = this.document.getElementById(STRUCTURED_DATA_ID);
    if (!script) {
      script = this.document.createElement('script');
      script.id = STRUCTURED_DATA_ID;
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}

/** schema.org data of the guesthouse (https://schema.org/LodgingBusiness) for the given language. */
export function buildStructuredData(code: LanguageCode, title: string, description: string): object {
  const url = languageUrl(code);
  const lodgingId = `${SITE_URL}/#lodging`;
  const websiteId = `${SITE_URL}/#website`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LodgingBusiness',
        '@id': lodgingId,
        name: SITE_NAME,
        alternateName: ['Rad-Var Apartmanhaz', 'Rád-Vár Apartments Eger'],
        description,
        url,
        image: [absoluteUrl(BUSINESS.shareImage.path), ...BUSINESS.photos.map(absoluteUrl)],
        logo: absoluteUrl(BUSINESS.logo),
        email: BUSINESS.email,
        telephone: BUSINESS.telephones[0],
        address: { '@type': 'PostalAddress', ...BUSINESS.address },
        geo: { '@type': 'GeoCoordinates', ...BUSINESS.geo },
        hasMap: BUSINESS.mapUrl,
        containedInPlace: { '@type': 'City', name: 'Eger', address: { '@type': 'PostalAddress', addressCountry: 'HU' } },
        amenityFeature: ['Wi-Fi', 'Parking', 'Air conditioning', 'Kitchen'].map(name => ({
          '@type': 'LocationFeatureSpecification',
          name,
          value: true,
        })),
        sameAs: [...BUSINESS.sameAs],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: LANGUAGES.map(language => language.code),
        publisher: { '@id': lodgingId },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: code,
        isPartOf: { '@id': websiteId },
        about: { '@id': lodgingId },
        primaryImageOfPage: absoluteUrl(BUSINESS.shareImage.path),
      },
    ],
  };
}
