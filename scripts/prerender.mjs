// Prerender statico a build-time.
// Presuppone che siano già stati eseguiti:
//   1) vite build            -> dist/index.html + dist/assets/*  (client)
//   2) vite build --ssr ...  -> dist/server/entry-server.js      (SSR bundle)
// Per ogni route nota renderizza l'HTML completo (contenuto + <head> con
// title/description/canonical/OG/JSON-LD) e scrive dist/<route>/index.html.
// Produce inoltre dist/404.html per i path sconosciuti.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const serverEntry = path.join(distDir, 'server', 'entry-server.js');

function fail(msg) {
  console.error(`[prerender] ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  fail('dist/index.html mancante: esegui prima "vite build".');
}
if (!fs.existsSync(serverEntry)) {
  fail('dist/server/entry-server.js mancante: esegui prima la build SSR.');
}

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const { render, routesToPrerender, notFoundRoute } = await import(
  pathToFileURL(serverEntry).href
);

/**
 * Inietta il markup dell'app dentro <div id="root">…</div> e le stringhe
 * <head> generate da helmet-async prima di </head>. Rimuove dal template
 * eventuali tag statici duplicati (title/description/canonical/og/twitter/
 * JSON-LD "per-route") che verrebbero sovrascritti da quelli della route.
 */
function buildHtml(appHtml, headHtml) {
  let html = template;

  // Rimuove title, meta description/robots/og/twitter e canonical statici:
  // vengono rimpiazzati dalle versioni per-route emesse da helmet.
  html = html.replace(/\s*<title>[\s\S]*?<\/title>/i, '');
  html = html.replace(
    /\s*<meta\s+name="description"[^>]*>/i,
    '',
  );
  html = html.replace(
    /\s*<link\s+rel="canonical"[^>]*>/gi,
    '',
  );
  html = html.replace(
    /\s*<meta\s+property="og:(?:title|description|url|type|image)"[^>]*>/gi,
    '',
  );
  html = html.replace(
    /\s*<meta\s+name="twitter:(?:card|title|description|image)"[^>]*>/gi,
    '',
  );

  // Inietta l'head della route prima di </head>.
  if (headHtml) {
    html = html.replace('</head>', `${headHtml}\n  </head>`);
  }

  // Inietta il markup dell'app dentro il div root.
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${appHtml}</div>`,
  );

  return html;
}

function outPathForRoute(route) {
  if (route === '/') return path.join(distDir, 'index.html');
  const clean = route.replace(/^\/+/, '').replace(/\/+$/, '');
  return path.join(distDir, clean, 'index.html');
}

let count = 0;
for (const route of routesToPrerender) {
  const { html: appHtml, head } = await render(route);
  const full = buildHtml(appHtml, head);
  const outFile = outPathForRoute(route);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, full, 'utf8');
  count++;
  console.log(`[prerender] ${route} -> ${path.relative(root, outFile)}`);
}

// Pagina 404 reale (noindex) per path sconosciuti.
{
  const { html: appHtml, head } = await render(notFoundRoute);
  const full = buildHtml(appHtml, head);
  const outFile = path.join(distDir, '404.html');
  fs.writeFileSync(outFile, full, 'utf8');
  count++;
  console.log(`[prerender] 404 -> ${path.relative(root, outFile)}`);
}

// Rimuove il bundle SSR intermedio: serve solo al prerender, non va
// pubblicato tra gli asset statici.
fs.rmSync(path.join(distDir, 'server'), { recursive: true, force: true });

console.log(`[prerender] Completato: ${count} pagine generate.`);
