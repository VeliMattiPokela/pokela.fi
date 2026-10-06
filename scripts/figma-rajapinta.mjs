#!/usr/bin/env node
/**
 * Figman rajapinta — yhteinen lukukerros.
 * ---------------------------------------------------------------
 * Tunnus, tiedoston avain ja haku olivat check-figma.mjs:n sisällä.
 * Nyt niitä tarvitaan kahdessa paikassa: tarkistus vahtii synkassa
 * pysymistä, inventaario kertoo lähtötilanteen. Kumpikin lukee saman
 * tiedoston samalla tavalla, joten lukeminen on yksi paikka.
 *
 * Tiedoston avainta ei kirjoiteta tähän: se luetaan sieltä missä
 * osoite muutenkin asuu (content/artefacts.ts). Toinen kopio
 * vanhenisi juuri silloin kun tiedosto vaihtuu.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Tunnus ympäristöstä tai .env.localista. Arvoa ei koskaan tulosteta. */
export function tunnus() {
  if (process.env.FIGMA_ACCESS_TOKEN) return process.env.FIGMA_ACCESS_TOKEN.trim();
  const envFile = join(root, '.env.local');
  if (existsSync(envFile)) {
    const match = /^FIGMA_ACCESS_TOKEN=(.+)$/m.exec(readFileSync(envFile, 'utf8'));
    if (match) return match[1].trim();
  }
  return null;
}

/** Tiedoston avain luetaan artefaktien osoitteesta. */
export function tiedostonAvain() {
  const artefacts = readFileSync(join(root, 'content/artefacts.ts'), 'utf8');
  const url = /figma:\s*'([^']+)'/.exec(artefacts)?.[1] ?? null;
  return url ? (/\/design\/([0-9a-zA-Z]+)/.exec(url)?.[1] ?? null) : null;
}

/**
 * Lukija joka pysäyttää ajon selkeään virheeseen jos tunnus tai avain
 * puuttuu. Molemmat ovat ehtoja joiden puuttuminen ei ole poikkeus
 * vaan väärin konfiguroitu ympäristö.
 */
export function lukija() {
  const avain = tiedostonAvain();
  if (!avain) {
    console.error('\n✗ Figma-tiedoston avainta ei löydy content/artefacts.ts:stä.\n');
    process.exit(1);
  }

  const token = tunnus();
  if (!token) {
    console.error('\n✗ FIGMA_ACCESS_TOKEN puuttuu.\n');
    console.error('  Paikallisesti:  .env.local → FIGMA_ACCESS_TOKEN=…');
    console.error('  CI:ssä:         gh secret set FIGMA_ACCESS_TOKEN\n');
    console.error('  Tarvittava oikeus: Files → "Read the contents of … files".\n');
    process.exit(1);
  }

  return {
    avain,
    async hae(polku) {
      const vastaus = await fetch(`https://api.figma.com/v1/files/${avain}${polku}`, {
        headers: { 'X-Figma-Token': token },
      });
      if (!vastaus.ok) {
        const body = await vastaus.text();
        console.error(`\n✗ Figma vastasi ${vastaus.status} ${vastaus.statusText}`);
        console.error(`  ${body.slice(0, 200)}\n`);
        process.exit(1);
      }
      return vastaus.json();
    },
  };
}
