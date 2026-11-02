// Generates fr/catalog.html (French) from catalog.html (English source of truth).
// Run after editing catalog.html: node scripts/build-static-list.mjs && node scripts/build-fr.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const src = new URL('../catalog.html', import.meta.url);
const outDir = new URL('../fr/', import.meta.url);
let h = readFileSync(src, 'utf-8').replace(/\r\n/g, '\n');

const EN_URL = 'https://catalog.luckwell.com/catalog.html';
const FR_URL = 'https://catalog.luckwell.com/fr/catalog.html';

function rep(en, fr, { all = true } = {}) {
  if (!h.includes(en)) throw new Error('missing string: ' + en.slice(0, 70));
  h = all ? h.split(en).join(fr) : h.replace(en, () => fr);
}

// ---- head / SEO
rep('<html lang="en">', '<html lang="fr">');
rep('Motorcycle &amp; Car Catalog — Luckwell CO., LTD', 'Catalogue motos &amp; voitures d\'occasion — Luckwell CO., LTD');
rep(/<meta name="description" content="[^"]*">/.exec(h)[0],
  '<meta name="description" content="Découvrez le catalogue complet de 51 véhicules d\'occasion de Luckwell CO., LTD, exportés en gros depuis Kaohsiung (Taïwan) : 41 modèles de motos (Yamaha, KYMCO, SYM, AEON, PGO) et 10 modèles de voitures (Hyundai, Nissan, Suzuki, Toyota). Choisissez vos modèles et quantités, puis demandez un devis de gros via WhatsApp. MOQ : 50 unités/20FT ou 125 unités/40HQ (motos), 5 unités/40HQ (voitures).">');
rep(/<meta property="og:description" content="[^"]*">/.exec(h)[0],
  '<meta property="og:description" content="51 véhicules d\'occasion disponibles à l\'export en gros depuis Kaohsiung (Taïwan). Choisissez vos modèles et quantités, puis demandez un devis via WhatsApp.">');
rep(`<link rel="canonical" href="${EN_URL}">`,
  `<link rel="canonical" href="${FR_URL}">\n  <link rel="alternate" hreflang="en" href="${EN_URL}">\n  <link rel="alternate" hreflang="fr" href="${FR_URL}">\n  <link rel="alternate" hreflang="x-default" href="${EN_URL}">`);
rep(`<meta property="og:url" content="${EN_URL}">`, `<meta property="og:url" content="${FR_URL}">`);
rep(/"description": "Taiwan-based exporter[^"]*"/.exec(h)[0],
  '"description": "Exportateur taïwanais de motos d\'occasion (KYMCO, Yamaha, SYM, AEON, PGO) et de voitures d\'occasion (Hyundai, Nissan, Suzuki, Toyota). Export uniquement, vente en gros, commandes par conteneur. Plus de 15 ans d\'expérience à l\'export, plus de 120 conteneurs (plus de 1 250 véhicules) expédiés chaque année vers des acheteurs au Ghana, à Madagascar, en Côte d\'Ivoire, en Irak, au Pakistan, au Yémen, à Oman et au Nigeria."');
rep('"name": "Motorcycle & Car Catalog", "item": "' + EN_URL + '"', '"name": "Catalogue motos & voitures d\'occasion", "item": "' + FR_URL + '"');

// ---- paths (page lives in /fr/)
rep('href="index.html', 'href="../index.html');
rep("img:'photos/", "img:'../photos/");

// ---- nav
rep('<a href="../index.html">Home</a>', '<a href="../index.html">Accueil</a>');
rep('<a href="../index.html#about">About</a>', '<a href="../index.html#about">À propos</a>');
h = h.replace(/\n\s*<a href="fr\/catalog\.html">Français<\/a>/, '');
rep('<a href="guides.html">Guides</a>', '<a href="guides.html">Guides</a>\n    <a href="../catalog.html">English</a>');
rep('🛒 Cart <span', '🛒 Panier <span');

// ---- hero
rep('<h1>Motorcycle &amp; Car Catalog</h1>', '<h1>Catalogue de motos &amp; voitures d\'occasion</h1>');
rep('Select models and quantities, then send a WhatsApp inquiry', 'Choisissez les modèles et les quantités, puis envoyez votre demande par WhatsApp');
rep('Export Only · Kaohsiung, Taiwan · MOQ 50 units/20FT or 125 units/40HQ (Motorcycles) · MOQ 5 units/40HQ (Cars)',
  'Export uniquement · Kaohsiung, Taïwan · MOQ 50 unités/20FT ou 125 unités/40HQ (motos) · MOQ 5 unités/40HQ (voitures)');
rep('Indicative FOB Kaohsiung · Motorcycles US$185–900/unit · Cars US$1,880–4,680/unit · depends on model, year and grade',
  'FOB Kaohsiung indicatif · Motos 185–900 US$/unité · Voitures 1 880–4 680 US$/unité · selon le modèle, l\'année et l\'état');
rep(/<p class="hero-summary">[^<]*<\/p>/.exec(h)[0],
  '<p class="hero-summary">Luckwell CO., LTD est un exportateur taïwanais, basé à Kaohsiung, de motos d\'occasion (Yamaha, KYMCO, SYM, AEON, PGO) et de voitures d\'occasion (Hyundai, Nissan, Suzuki, Toyota). Commandes en gros par conteneur uniquement : motos à partir de 50 unités par 20FT ou 125 unités par 40HQ, voitures à partir de 5 unités par 40HQ. Les devis et la liste de stock actuelle sont envoyés par WhatsApp.</p>');

// ---- filters / cart UI
rep('🏍 Motorcycles (41)', '🏍 Motos (41)');
rep('🚗 Cars (10)', '🚗 Voitures (10)');
rep("label:'All'", "label:'Tous'");
rep('🛒 Inquiry List', '🛒 Liste de demande');
rep('No items yet.<br>Add motorcycles or cars above.', 'Aucun article.<br>Ajoutez des motos ou des voitures ci-dessus.');
rep('Total: <strong id="total-units">0</strong> units', 'Total : <strong id="total-units">0</strong> unités');
rep('Send WhatsApp Inquiry', 'Envoyer la demande sur WhatsApp');
rep('Add units to send inquiry (min ${INQUIRY_MIN.moto} motorcycles or ${INQUIRY_MIN.car} cars)', 'Ajoutez des unités pour envoyer la demande (min. ${INQUIRY_MIN.moto} motos ou ${INQUIRY_MIN.car} voitures)');
rep('Add units to send inquiry', 'Ajoutez des unités pour envoyer la demande');
rep('Below the minimum? Ask us for a suitable mix', 'Sous le minimum ? Demandez-nous une combinaison adaptée');
rep('🛒 View Cart ', '🛒 Voir le panier ');
rep('Chat on WhatsApp', 'Discuter sur WhatsApp');

// ---- JS strings
rep('PHOTO COMING SOON', 'PHOTO BIENTÔT DISPONIBLE');
rep('Ref. FOB from US$', 'Réf. FOB à partir de US$');
rep('Qty:', 'Qté :');
rep("'✓ Added'", "'✓ Ajouté'");
rep("'Add to Inquiry'", "'Ajouter à la demande'");
rep('>Add to Inquiry</button>', '>Ajouter à la demande</button>');
rep('<div class="cart-item-qty">${i.qty} units</div>', '<div class="cart-item-qty">${i.qty} unités</div>');
rep('Total: <strong>${total}</strong> units', 'Total : <strong>${total}</strong> unités');
rep('✓ ${motoTotal} motorcycle units, ${carTotal} car units — tap to send inquiry!', '✓ ${motoTotal} motos, ${carTotal} voitures — appuyez pour envoyer la demande !');
rep('Motorcycles: ${motoTotal}/${INQUIRY_MIN.moto} · Cars: ${carTotal}/${INQUIRY_MIN.car} — reach either minimum to unlock',
  'Motos : ${motoTotal}/${INQUIRY_MIN.moto} · Voitures : ${carTotal}/${INQUIRY_MIN.car} — atteignez l\'un des deux minimums pour débloquer');
// WhatsApp text stays English for the sales team; flag the page language so they reply in French
rep('${SOURCE ? `%0A%0ASource: ${SOURCE}` : \'\'}', '${SOURCE ? `%0A%0ASource: ${SOURCE}` : \'\'}%0A%0APage language: French (please reply in French)');

// ---- spec tokens
const TOKENS = {
  'Disc Brake': 'Frein à disque', 'Carb/FI': 'Carbu/Injection', 'Step-through': 'Cadre bas', 'Retro Style': 'Style rétro',
  'Sport Style': 'Style sportif', 'Wide Tyre': 'Pneu large', 'Full Fairing': 'Carénage intégral', 'Maxi-Scooter': 'Maxi-scooter',
  '4-stroke': '4 temps', 'Sport Fairing': 'Carénage sport', 'Lightweight': 'Léger', 'Manual': 'Manuelle',
  'Retro Classic': 'Rétro classique', 'Naked Sport': 'Roadster sport', 'Used': 'Occasion',
  'Pre-shipment Inspected': 'Inspecté avant expédition',
};
const BODY = { Hatchback: 'Compacte', MPV: 'Monospace', 'Sedan/Hatchback': 'Berline/Compacte', 'Pickup Truck': 'Pick-up', Sedan: 'Berline' };
h = h.replace(/spec:'([^']*)'/g, (_, s) => `spec:'${s.split('·').map(t => TOKENS[t.trim()] || t.trim()).join(' · ')}'`);
h = h.replace(/(\bcc:')([^']*)(')/g, (_, a, v, b) => a + (BODY[v] || v) + b);
h = h.replace(/popular:'([^']*)'/g, (_, v) => `popular:'${v.replace('Ivory Coast', 'Côte d\\\'Ivoire')}'`);

// ---- order guide (replace block)
const guide = `<!-- ORDER-GUIDE:START -->
<section class="order-guide" id="how-to-order">
<style>
.order-guide{max-width:1100px;margin:40px auto 0;padding:0 20px;color:var(--gray-text,#444);font-size:.92rem}
.order-guide h2{font-size:1.3rem;margin-bottom:6px;color:var(--navy,#1A1A2E)}
.order-guide ol{margin:12px 0 0 1.2em;padding:0;line-height:1.7}
.order-guide li{margin-bottom:6px}
</style>
<h2>Comment commander des motos d'occasion</h2>
<p>Déroulement habituel d'une commande en gros de motos auprès de Luckwell CO., LTD (Kaohsiung, Taïwan) :</p>
<ol>
<li>Envoyez-nous votre demande avec la quantité souhaitée pour chaque modèle de moto, ainsi que les moteurs d'occasion ou les pneus d'occasion dont vous avez besoin. Indiquez-nous aussi le mode d'emballage souhaité.</li>
<li>Versez l'acompte : 50 % du montant total.</li>
<li>Dès réception de l'acompte, nous commençons à rassembler toute la marchandise. Cela prend 4 à 6 semaines.</li>
<li>Une fois la collecte terminée, nous vous envoyons des photos et des vidéos pour confirmation.</li>
<li>Après votre confirmation, nous prenons rendez-vous avec la police et réservons l'expédition.</li>
<li>Lorsque nous vous informons de la date de chargement, vous payez le solde et les frais d'expédition.</li>
<li>Nous vous envoyons des photos et des vidéos du chargement.</li>
<li>Nous vous remettons le connaissement (BL) et la liste de colisage avant l'arrivée de la marchandise.</li>
</ol>
<p><strong>Voitures d'occasion :</strong> l'acompte pour démarrer une commande de voitures est de 10 000 USD.</p>
</section>
<!-- ORDER-GUIDE:END -->`;
h = h.replace(/<!-- ORDER-GUIDE:START -->[\s\S]*?<!-- ORDER-GUIDE:END -->/, () => guide);

// ---- static model list (replace block), built from the translated PRODUCTS
const PRODUCTS = new Function(`return ${h.match(/const PRODUCTS = (\[[\s\S]*?\n\]);/)[1]}`)();
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const table = (title, items, bodyLabel) => `<h3>${esc(title)} (${items.length} modèles)</h3>
<div class="static-list-wrap">
<table class="static-list">
<thead><tr><th>Marque</th><th>Modèle</th><th>${bodyLabel}</th><th>Spécifications</th><th>Populaire en</th></tr></thead>
<tbody>
${items.map(p => `<tr><td>${esc(p.brand)}</td><td>${esc(p.name)}</td><td>${esc(p.cc)}</td><td>${esc(p.spec)}</td><td>${esc(p.popular || '')}</td></tr>`).join('\n')}
</tbody>
</table>
</div>`;
const moto = PRODUCTS.filter(p => p.category === 'moto');
const car = PRODUCTS.filter(p => p.category === 'car');
const css = /<!-- STATIC-LIST:START[^>]*>\n<section class="static-list-section" id="model-list">\n(<style>[\s\S]*?<\/style>)/.exec(h)[1];
const list = `<!-- STATIC-LIST:START (generated by scripts/build-fr.mjs, do not edit by hand) -->
<section class="static-list-section" id="model-list">
${css}
<h2>Liste complète des modèles : ${moto.length} motos et ${car.length} voitures d'occasion à l'export</h2>
<p>Luckwell CO., LTD (Kaohsiung, Taïwan) exporte en gros des motos et des voitures d'occasion. MOQ motos : 50 unités par conteneur 20FT ou 125 unités par conteneur 40HQ. MOQ voitures : 5 unités par conteneur 40HQ. Prix FOB Kaohsiung indicatif : motos 185 à 900 US$ par unité, voitures 1 880 à 4 680 US$ par unité, selon le modèle, l'année et l'état. Demandez un devis et la liste de stock actuelle par WhatsApp à l'aide de la liste de demande ci-dessus.</p>
${table('Motos d\'occasion', moto, 'Moteur')}
${table('Voitures d\'occasion', car, 'Carrosserie')}
</section>
<!-- STATIC-LIST:END -->`;
h = h.replace(/<!-- STATIC-LIST:START[\s\S]*?<!-- STATIC-LIST:END -->/, () => list);

mkdirSync(outDir, { recursive: true });
writeFileSync(new URL('catalog.html', outDir), h);
console.log(`fr/catalog.html written (${moto.length} motos, ${car.length} voitures)`);
