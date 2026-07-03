import { SITE_URL, canonicalUrl } from '../components/Seo';

/**
 * Riferimento all'Organization definita staticamente in index.html (@id).
 */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Riferimento leggero all'Organization (publisher/author). */
export const orgRef = { '@id': ORG_ID };

/**
 * Converte una data italiana tipo "10 Marzo 2026" nel formato ISO "2026-03-10".
 * Se non riesce a parsare, restituisce la stringa originale.
 */
const IT_MONTHS: Record<string, string> = {
  gennaio: '01',
  febbraio: '02',
  marzo: '03',
  aprile: '04',
  maggio: '05',
  giugno: '06',
  luglio: '07',
  agosto: '08',
  settembre: '09',
  ottobre: '10',
  novembre: '11',
  dicembre: '12',
};

export function italianDateToISO(input: string): string {
  const m = input.trim().match(/^(\d{1,2})\s+([A-Za-zàèéìòù]+)\s+(\d{4})$/);
  if (!m) return input;
  const day = m[1].padStart(2, '0');
  const month = IT_MONTHS[m[2].toLowerCase()];
  const year = m[3];
  if (!month) return input;
  return `${year}-${month}-${day}`;
}

/** Rende assoluto un percorso immagine (che potrebbe essere relativo). */
export function absoluteImage(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
}

export interface Crumb {
  name: string;
  path: string;
}

/** Costruisce un BreadcrumbList JSON-LD da una lista di crumb. */
export function breadcrumbList(crumbs: Crumb[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: canonicalUrl(c.path),
    })),
  };
}

/** Costruisce una FAQPage JSON-LD da coppie domanda/risposta. */
export function faqPage(faqs: Array<{ q: string; a: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}
