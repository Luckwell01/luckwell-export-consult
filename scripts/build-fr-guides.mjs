// Generates fr/<guide>.html from the English guide pages using scripts/fr-t*.json (index -> French).
// Segment order comes from fr-guides-segments.json (produced by fr-guides-extract.mjs).
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { FILES, segmentsOf } from './fr-guides-extract.mjs';

const dir = new URL('./', import.meta.url);
const segs = JSON.parse(readFileSync(new URL('fr-guides-segments.json', dir), 'utf-8')).map(s => s.en);
const T = {};
for (const f of readdirSync(dir).filter(n => /^fr-t\d+\.json$/.test(n))) Object.assign(T, JSON.parse(readFileSync(new URL(f, dir), 'utf-8')));
const DICT = new Map();
segs.forEach((en, i) => { if (T[i] === undefined) throw new Error('missing translation #' + i + ': ' + en.slice(0, 50)); DICT.set(en, T[i]); });

const strip = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const PLAIN = new Map();
for (const [en, fr] of DICT) PLAIN.set(strip(en), strip(fr));
// JSON-LD strings that are not visible text segments
const EXTRA = {
  'Home': 'Accueil', 'Guides': 'Guides',
  'Taiwan-based exporter of used motorcycles (KYMCO, Yamaha, SYM, AEON, PGO) and used cars (Hyundai, Nissan, Suzuki, Toyota). Export only, wholesale, container-load orders. 15+ years of export experience, shipping 120+ containers (1,250+ vehicles) every year to buyers in Ghana, Madagascar, Ivory Coast, Iraq, Pakistan, Yemen, Oman, and Nigeria.':
    "Exportateur taïwanais de motos d'occasion (KYMCO, Yamaha, SYM, AEON, PGO) et de voitures d'occasion (Hyundai, Nissan, Suzuki, Toyota). Export uniquement, vente en gros, commandes par conteneur. Plus de 15 ans d'expérience à l'export, plus de 120 conteneurs (plus de 1 250 véhicules) expédiés chaque année vers des acheteurs au Ghana, à Madagascar, en Côte d'Ivoire, en Irak, au Pakistan, au Yémen, à Oman et au Nigeria.",
};
for (const [k, v] of Object.entries(EXTRA)) PLAIN.set(k, v);
for (const [k, v] of Object.entries(JSON.parse(readFileSync(new URL('fr-extra.json', dir), 'utf-8')))) PLAIN.set(k, v);

const LEAF = /<(h1|h2|h3|h4|p|li|td|th|a|span|summary|strong|figcaption|label|button)\b([^>]*)>((?:(?!<(?:h1|h2|h3|h4|p|li|td|th|ul|ol|table|tr|div|section|main|nav|footer)\b)[\s\S])*?)<\/\1>/g;
const BASE = 'https://catalog.luckwell.com/';
const unmatched = [];

function walk(node, file) {
  if (typeof node === 'string') {
    if (node.startsWith(BASE) && /\.html$/.test(node) && !node.includes('/fr/')) return node.replace(BASE, BASE + 'fr/');
    if (PLAIN.has(node)) return PLAIN.get(node);
    if (/[A-Za-z]{4}/.test(node) && !/^https?:|^[A-Z]{2}$|^Luckwell/.test(node)) unmatched.push(node);
    return node;
  }
  if (Array.isArray(node)) return node.map(n => walk(n, file));
  if (node && typeof node === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(node)) o[k] = /^@|^(url|item|sameAs|telephone|email|addressCountry|addressLocality|priceCurrency)$/.test(k) && k !== 'item' ? v : walk(v, file);
    return o;
  }
  return node;
}

mkdirSync(new URL('../fr/', dir), { recursive: true });
for (const f of FILES) {
  let h = readFileSync(new URL(`../${f}.html`, dir), 'utf-8').replace(/\r\n/g, '\n');
  const EN = `${BASE}${f}.html`, FR = `${BASE}fr/${f}.html`;
  const cut = h.indexOf('</style>');
  let head = h.slice(0, cut), body = h.slice(cut);

  head = head.replace('<html lang="en">', '<html lang="fr">')
    .replace(/<title>([^<]*)<\/title>/, (m, t) => `<title>${DICT.get(t) ?? t}</title>`)
    .replace(/<meta name="description" content="([^"]*)"/, (m, t) => `<meta name="description" content="${(DICT.get(t) ?? t).replace(/"/g, '&quot;')}"`)
    .replace(`<link rel="canonical" href="${EN}">`, `<link rel="canonical" href="${FR}">\n<link rel="alternate" hreflang="en" href="${EN}">\n<link rel="alternate" hreflang="fr" href="${FR}">\n<link rel="alternate" hreflang="x-default" href="${EN}">`);
  if (!head.includes('hreflang="fr"')) throw new Error('canonical not found in ' + f);
  head = head.replace(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g, (m, json) => {
    const o = walk(JSON.parse(json), f);
    return `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`;
  });

  body = body.replace(LEAF, (m, tag, attrs, inner) => {
    const key = inner.trim();
    if (!DICT.has(key)) return m;
    const lead = inner.match(/^\s*/)[0], trail = inner.match(/\s*$/)[0];
    return `<${tag}${attrs}>${lead}${DICT.get(key)}${trail}</${tag}>`;
  });
  body = body.replace(/\n\s*<a href="fr\/[^"]+">Français<\/a>/, '');
  body = body.replace(/href="index\.html/g, 'href="../index.html');
  body = body.replace(/(<div class="nav-links">[\s\S]*?)(\n\s*<\/div>)/, (m, a, b) => `${a}\n    <a href="../${f === 'guides' ? 'guides' : f}.html">English</a>${b}`);
  writeFileSync(new URL(`../fr/${f}.html`, dir), head + body);
}
console.log('fr guide pages written:', FILES.length);
if (unmatched.length) console.log('UNMATCHED JSON-LD strings:\n' + [...new Set(unmatched)].join('\n'));
