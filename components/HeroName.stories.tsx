import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HeroName from './HeroName';

/**
 * Etusivun nimi, joka rakentuu fontin ääriviivoista.
 */
const meta = {
  title: 'Komponentit/HeroName',
  component: HeroName,
  parameters: {
    docs: {
      description: {
        component: [
          'Saapuessa nimen päälle piirtyvät apuviivat, sitten kirjainten ääriviivat,',
          'käyräpisteet ja kahvat, ja lopuksi kirjaimet täyttyvät. Osoittimen kohdalla',
          'linssi näyttää rakenteen ja lähimmän pisteen koordinaatit fontin yksiköissä.',
          'Klikkaus avaa koko nimen rakenteen.',
          '',
          'Pisteet ovat Bodoni Modan oikeat ääriviivat (`npm run nimi`). Oikea otsikko on',
          'aina sivulla, ja vähemmän liikettä pyytäneelle saapuminen jätetään pois.',
        ].join('\n'),
      },
    },
  },
  args: { lines: ['Veli-', 'Matti', 'Pokela'] },
  decorators: [
    (Story) => (
      <div className="page">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeroName>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Saapuu ja jää lepoon. Vie osoitin nimen päälle. */
export const Levossa: Story = { args: { tila: 'levossa' } };

/** Koko nimen rakenne auki: apuviivat, ääriviivat, pisteet ja kahvat. */
export const Rakenne: Story = { args: { tila: 'rakenne' } };

/** Mobiilissa nimi katkeaa kolmelle riville, ja apuviivat piirtyvät jokaiselle. */
export const Mobiilissa: Story = {
  globals: { viewport: { value: 'base' } },
  args: { tila: 'rakenne' },
};

/** Pisteet ja viivat ovat tokenien värejä, joten ne kääntyvät teeman mukana. */
export const TummaTeema: Story = {
  globals: { theme: 'dark' },
  args: { tila: 'rakenne' },
};
