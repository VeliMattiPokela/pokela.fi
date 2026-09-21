import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CaseText from './CaseText';

/**
 * Leipäteksti, jossa toisen casen maininta on linkki.
 */
const meta = {
  title: 'Komponentit/CaseText',
  component: CaseText,
  parameters: {
    docs: {
      description: {
        component: [
          'Maininnat luetellaan sisällön puolella taivutusmuotoineen, koska suomen taivutus',
          'estää johtamasta linkkitekstiä casen nimestä: "Colliersissa" ei ole',
          '"Colliers Asunnot".',
          '',
          'Pisin osuma voittaa, joten "Colliers Asunnot" linkittyy kokonaan eikä pelkkä',
          '"Colliers" siitä.',
          '',
          '`currentSlug` estää sivua linkittämästä itseensä.',
        ].join('\n'),
      },
    },
  },
  args: {
    locale: 'fi' as const,
    text: 'Näin tein Colliersissa ja Blokbookissa.',
  },
} satisfies Meta<typeof CaseText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Kaksi mainintaa, molemmat linkkeinä. */
export const Oletus: Story = {
  render: (args) => (
    <p className="body-l measure">
      <CaseText {...args} />
    </p>
  ),
};

/** Casen omalla sivulla sen oma maininta jää tekstiksi. */
export const OmallaSivulla: Story = {
  args: { currentSlug: 'colliers' },
  render: (args) => (
    <p className="body-l measure">
      <CaseText {...args} />
    </p>
  ),
};

/** Pisin osuma voittaa: koko nimi linkittyy, ei vain etuliite. */
export const PisinOsumaVoittaa: Story = {
  args: { text: 'Viimeisimmät kaksi projektia: Colliers Asunnot ja Blokbook.' },
  render: (args) => (
    <p className="body-l measure">
      <CaseText {...args} />
    </p>
  ),
};

/** Ilman mainintoja teksti menee läpi sellaisenaan. */
export const EiMainintoja: Story = {
  args: { text: 'Design system elää koodissa ja pysyy synkassa Figman kanssa.' },
  render: (args) => (
    <p className="body-l measure">
      <CaseText {...args} />
    </p>
  ),
};

export const Mobiili: Story = {
  globals: { viewport: { value: 'base' } },
  render: (args) => (
    <p className="body-l measure">
      <CaseText {...args} />
    </p>
  ),
};

export const Tumma: Story = {
  globals: { theme: 'dark' },
  render: (args) => (
    <p className="body-l measure">
      <CaseText {...args} />
    </p>
  ),
};
