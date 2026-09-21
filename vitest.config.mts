import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

/**
 * Storyt testeinä.
 * ---------------------------------------------------------------
 * Jokainen story renderöidään oikeassa selaimessa ja tarkistetaan
 * axella. `a11y: { test: 'error' }` (.storybook/preview.tsx) tekee
 * saavutettavuusvirheestä kaatavan — ilman tätä ajajaa se asetus ei
 * tekisi mitään, ja valvonta olisi pelkkä väite.
 *
 * Ajo kattaa myös renderöintivirheet: `build-storybook` menee läpi
 * vaikka story heittäisi ajonaikaisen poikkeuksen, tämä ei.
 *
 * Dekoraattorit ja globaalit tulevat .storybook/preview.tsx:stä —
 * addon-vitest ottaa ne automaattisesti käyttöön (Storybook 10.3+),
 * joten testi mittaa samaa mitä katsoja näkee.
 */
export default defineConfig({
  resolve: {
    alias: { '@': root },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: resolve(root, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
