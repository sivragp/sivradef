import { Helmet } from 'react-helmet-async';

/**
 * Base canonica del sito: apex SENZA www (www fa 301 verso l'apex).
 */
export const SITE_URL = 'https://sivragp.com';
export const SITE_NAME = 'SIVRA';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/media/og-default.png`;

export interface SeoProps {
  /** Titolo completo del documento (usato per <title>, og:title, twitter:title). */
  title: string;
  /** Meta description ottimizzata per la pagina. */
  description: string;
  /** Path assoluto della route, es. "/services". Deve iniziare con "/". */
  path: string;
  /** URL assoluto dell'immagine OG. Default: og-default. */
  ogImage?: string;
  /** og:type. Default "website"; "article" per i post del blog. */
  type?: 'website' | 'article';
  /** Se true, meta robots = noindex,follow (es. NotFound). */
  noindex?: boolean;
  /**
   * Blocchi JSON-LD aggiuntivi da iniettare per-route
   * (BlogPosting, FAQPage, BreadcrumbList, ItemList, ...).
   */
  jsonLd?: Array<Record<string, unknown>>;
}

/** Costruisce un URL canonico self-referenziale non-www. */
export function canonicalUrl(path: string): string {
  const normalized = path === '/' ? '/' : `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * Componente SEO per-route. Renderizza <title>, meta description,
 * canonical self-referenziale (apex non-www), Open Graph completi,
 * Twitter card, meta robots ed eventuali blocchi JSON-LD.
 */
export function Seo({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  const url = canonicalUrl(path);
  const robots = noindex ? 'noindex, follow' : 'index, follow';

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="it_IT" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD per-route */}
      {jsonLd?.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
