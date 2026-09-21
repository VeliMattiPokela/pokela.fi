import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LogoRow from './LogoRow';
import { blockedLogos, visibleLogos } from '@/content/logos';

/**
 * Asiakaslogorivi. Kaksi ongelmaa ratkaistuna: tumma teema ja
 * optinen koko.
 */
const meta = {
  title: 'Komponentit/LogoRow',
  component: LogoRow,
  parameters: {
    /* Täysleveä: hoitaa oman sivupaddinginsa .bleed-utilitylla. */
    bleed: true,
    docs: {
      description: {
        component: [
          'Logot ovat mustaa läpinäkyvällä taustalla, joten ne katoaisivat tummalla',
          'pinnalla. Ratkaisu on CSS-mask: kuva toimii maskina ja väri tulee',
          '`currentColor`ista, jolloin logo seuraa `--ink`:iä molempiin suuntiin.',
          '`filter: invert()` olisi nopeampi mutta pehmentää reunat.',
          '',
          '**Optinen koko annetaan per logo.** Leveä ohut sanamerkki (Sanoma, 1356×128) ja',
          'lähes neliömäinen merkki (OP, 504×336) eivät näytä samankokoisilta samalla',
          'pikselikorkeudella. Leveys lasketaan tiedoston kuvasuhteesta.',
          '',
          '**Osa logoista on estetty** `blocked`-lipulla `content/logos.ts`:ssä. Syy on aina',
          'kirjattu. Estetyn logon nimi näkyy "Lisäksi"-rivillä, joka ei vaadi käyttölupaa.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Asiakkaita' },
} satisfies Meta<typeof LogoRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {
  render: (args) => (
    <div className="page">
      <LogoRow {...args} />
    </div>
  ),
};

export const Tumma: Story = {
  globals: { theme: 'dark' },
  render: (args) => (
    <div className="page">
      <LogoRow {...args} />
    </div>
  ),
};

export const Mobiili: Story = {
  globals: { viewport: { value: 'base' } },
  render: (args) => (
    <div className="page">
      <LogoRow {...args} />
    </div>
  ),
};

/** Mikä on estetty ja miksi. */
export const Estetyt: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Nämä tiedostot ovat repossa mutta eivät renderöidy. Lista tulee samasta datasta kuin rivi itse, joten se ei voi jäädä jälkeen.',
      },
    },
  },
  render: () => (
    <div className="page sb-unstyled">
      <p className="meta sb-specimen__label">
        Näkyvissä {visibleLogos.length} · estetty {blockedLogos.length}
      </p>
      <ul className="spec-list">
        {blockedLogos.map((logo) => (
          <li key={logo.file}>
            <strong>{logo.name}</strong> — {logo.blocked}
          </li>
        ))}
      </ul>
    </div>
  ),
};
