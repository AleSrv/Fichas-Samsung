import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '..', 'src', 'data', 'specs');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

const results = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const catalogId = file.replace(/\.md$/, '');

  const tmMatch = content.match(/\b(TM\d{4}[A-Z]?)\b/i);

  if (tmMatch) {
    const model = tmMatch[1].toUpperCase();
    let description = null;

    const commaDesc = content.match(
      new RegExp(`\\b${model}\\s*,\\s*([^\\n\\|\\<]{3,})`, 'i')
    );
    if (commaDesc) {
      description = commaDesc[1].trim();
    }

    results[catalogId] = { remoteModel: model, description, category: 'specific' };
    continue;
  }

  if (content.match(/\|\s*Mando a distancia\s*\|\s*S[íi]\s*\|/i)) {
    results[catalogId] = { remoteModel: null, description: null, category: 'sí-sin-modelo' };
    continue;
  }

  if (content.match(/\|\s*One Remote Control\s*\|\s*S[íi]\s*\|/i)) {
    results[catalogId] = { remoteModel: null, description: null, category: 'one-remote' };
    continue;
  }

  results[catalogId] = { remoteModel: null, description: null, category: 'none' };
}

const byCat = {};
for (const [id, info] of Object.entries(results)) {
  (byCat[info.category] = byCat[info.category] || []).push({ id, info });
}

console.log('='.repeat(80));
console.log('MANDOS A DISTANCIA — EXTRACCIÓN DE ESPECIFICACIONES SAMSUNG');
console.log('='.repeat(80));

const printGroup = (title, items, formatFn) => {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`▸ ${title}`);
  console.log('─'.repeat(80));
  items.sort((a, b) => a.id.localeCompare(b.id));
  for (const item of items) {
    console.log(`  ${formatFn(item)}`);
  }
};

if (byCat.specific) {
  printGroup('MODELOS CON MANDO ESPECÍFICO:', byCat.specific,
    ({ id, info }) => {
      const pad = id.length > 28 ? '\n  ' + ' '.repeat(28) : ' '.repeat(28 - id.length);
      const desc = info.description ? `  │  ${info.description}` : '';
      return `${id}${pad}${info.remoteModel}${desc}`;
    });
}

if (byCat['sí-sin-modelo']) {
  printGroup('SOUNDBARS — MANDO A DISTANCIA: SÍ (sin modelo):', byCat['sí-sin-modelo'],
    ({ id }) => `${id.padEnd(28)}Sí — en tabla Accesorios`);
}

if (byCat['one-remote']) {
  printGroup('DISPOSITIVOS — ONE REMOTE CONTROL: SÍ (sin modelo):', byCat['one-remote'],
    ({ id }) => `${id.padEnd(28)}Sí — en tabla Conectividad`);
}

if (byCat.none) {
  printGroup('SIN MENCIÓN DE MANDO A DISTANCIA:', byCat.none,
    ({ id }) => `${id.padEnd(28)}—`);
}

console.log(`\n${'═'.repeat(80)}`);
console.log(`Resumen: ${files.length} archivos`);
console.log(`  Modelo específico         ${(byCat.specific || []).length}`);
console.log(`  Mando a distancia: Sí    ${(byCat['sí-sin-modelo'] || []).length}`);
console.log(`  One Remote Control: Sí   ${(byCat['one-remote'] || []).length}`);
console.log(`  Sin mención               ${(byCat.none || []).length}`);
console.log('═'.repeat(80));
