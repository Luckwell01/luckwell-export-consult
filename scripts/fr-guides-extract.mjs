// Extracts translatable segments from the guide pages into fr-guides-segments.json (en -> "")
import { readFileSync, writeFileSync, existsSync } from 'fs';
export const FILES = ['guides','used-scooter-exporter-taiwan','taiwan-motorcycle-wholesale-moq','taiwan-motorcycle-container-loading','taiwan-used-motorcycle-grading-standard','how-to-inspect-used-scooters-before-export','taiwan-used-car-wholesale-moq','taiwan-kymco-yamaha-wholesale-exporter','used-motorcycle-supplier-africa','taiwan-vs-japan-used-motorcycle-export'];
const LEAF = /<(h1|h2|h3|h4|p|li|td|th|a|span|summary|strong|figcaption|label|button)\b([^>]*)>((?:(?!<(?:h1|h2|h3|h4|p|li|td|th|ul|ol|table|tr|div|section|main|nav|footer)\b)[\s\S])*?)<\/\1>/g;
export function segmentsOf(html) {
  const segs = new Set();
  const body = html.slice(html.indexOf('</style>'));
  const bodyNoScript = body.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const m of bodyNoScript.matchAll(LEAF)) {
    const inner = m[3].trim();
    if (/[A-Za-z]{3}/.test(inner.replace(/<[^>]+>/g, '')) && !/^<a [^>]*>[^<]*<\/a>$/.test(inner)) segs.add(inner);
  }
  const t = html.match(/<title>([^<]*)<\/title>/); if (t) segs.add(t[1]);
  const d = html.match(/<meta name="description" content="([^"]*)"/); if (d) segs.add(d[1]);
  return segs;
}
if (process.argv[1].endsWith('fr-guides-extract.mjs')) {
  const all = {};
  for (const f of FILES) {
    const html = readFileSync(new URL(`../${f}.html`, import.meta.url), 'utf-8').replace(/\r\n/g, '\n');
    for (const s of segmentsOf(html)) all[s] = all[s] || [];
    for (const s of segmentsOf(html)) all[s].push(f);
  }
  writeFileSync(new URL('./fr-guides-segments.json', import.meta.url), JSON.stringify(Object.keys(all).map(k => ({ en: k, files: all[k].length })), null, 1));
  console.log('unique segments:', Object.keys(all).length, 'chars:', Object.keys(all).join('').length);
}
