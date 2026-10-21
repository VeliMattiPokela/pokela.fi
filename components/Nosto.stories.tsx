import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Nosto from './Nosto';

/**
 * Sivun tai casen pääväite viivateoksen päällä.
 */
const meta = {
  title: 'Komponentit/Nosto',
  component: Nosto,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Reunasta reunaan taustana on etusivun viivateos (Korkeuskayrat), ja keskellä on',
          'paperinen paneeli. Väite, leipäteksti ja valinnainen linkki ovat keskitettyinä.',
          'Etusivu ja casejen väitteet käyttävät tätä.',
        ].join('\n'),
      },
    },
  },
  args: {
    title: 'Suunnittelu ja toteutus samoissa käsissä',
    body: 'Design system, tuotesuunnittelu ja front end. Projektista riippuen yksi näistä tai kaikki kolme.',
  },
} satisfies Meta<typeof Nosto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Perus: Story = {};

export const Linkilla: Story = {
  name: 'Linkillä',
  args: {
    title: 'Yksi design system koodissa, Figmassa ja AI-työkaluissa',
    body: 'Tokenit, komponentit ja sivut ovat samaa koodia.',
    action: (
      <a href="#" className="btn btn--text">
        Design system elävänä
      </a>
    ),
  },
};

export const Tumma: Story = { globals: { theme: 'dark' } };

export const Mobiili: Story = { globals: { viewport: { value: 'base' } } };
