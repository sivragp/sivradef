import { StrictMode } from 'react';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { prerenderToNodeStream } from 'react-dom/static';
import { AppRoutes } from './App';
import { blogPosts } from './data/blogPosts';

/**
 * Elenco completo delle route note da prerenderizzare a build-time.
 * Le route statiche + una pagina per ogni post del blog. La 404 è gestita
 * a parte (dist/404.html) come pagina non indicizzata.
 */
export const routesToPrerender: string[] = [
  '/',
  '/services',
  '/about',
  '/case-studies',
  '/contact',
  '/blog',
  '/privacy',
  '/cookies',
  '/terms',
  ...blogPosts.map((p) => `/blog/${p.slug}`),
];

/** Route servita per i path sconosciuti (404). Rende la pagina NotFound. */
export const notFoundRoute = '/__404__';

export interface RenderResult {
  /** Markup HTML dell'app (contenuto di #root), senza i tag hoistabili. */
  html: string;
  /**
   * Tag di metadata (<title>/<meta>/<link>) della route, da iniettare in
   * <head>. Con React 19 questi vengono emessi hoistati in testa al markup;
   * li estraiamo qui così finiscono nel <head> dell'HTML statico e sono
   * leggibili dai crawler senza JS.
   */
  head: string;
}

/**
 * Renderizza una singola route in HTML statico completo di <head>.
 * Usa react-dom/static.prerenderToNodeStream così le pagine caricate con
 * React.lazy() vengono attese (Suspense) e incluse nel markup, invece del
 * fallback vuoto.
 */
export async function render(url: string): Promise<RenderResult> {
  const helmetContext = {};

  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  );

  const rawHtml = await streamToString(prelude);
  const { head, html } = extractHoistedHead(rawHtml);

  return { html, head };
}

/**
 * React 19 hoista title/meta/link in testa al markup renderizzato. Li
 * estraiamo dal blocco iniziale e li spostiamo nel <head> del template.
 * I blocchi JSON-LD (<script type="application/ld+json">) restano nel body:
 * sono validi per i motori di ricerca anche fuori dal <head> e mantenerli
 * in posizione evita mismatch di hydration lato client.
 */
function extractHoistedHead(rawHtml: string): { head: string; html: string } {
  const heads: string[] = [];
  // Consuma la sequenza iniziale di <title>/<meta>/<link> hoistati.
  const leading = /^\s*(?:<title>[\s\S]*?<\/title>|<meta\b[^>]*\/?>|<link\b[^>]*\/?>)/i;
  let html = rawHtml;
  let m: RegExpMatchArray | null;
  while ((m = html.match(leading))) {
    heads.push(m[0].trim());
    html = html.slice(m[0].length);
  }
  return { head: heads.join('\n    '), html };
}

function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.setEncoding('utf8');
    stream.on('data', (chunk) => {
      data += chunk;
    });
    stream.on('end', () => resolve(data));
    stream.on('error', reject);
  });
}
