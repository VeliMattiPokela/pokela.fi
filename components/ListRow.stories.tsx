import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ListRow from './ListRow';

/**
 * Story ei ole dokumentaatiota komponentista. Se on komponentti —
 * sama tiedosto jota sivusto importoi, eri tiloissa.
 */
const meta = {
  title: 'Komponentit/ListRow',
  component: ListRow,
  parameters: {
    /* Täysleveä: hoitaa oman sivupaddinginsa .bleed-utilitylla. */
    bleed: true,
    docs: {
      description: {
        component: [
          'Sivuston tunnuskomponentti. Hover kääntää pinnan mustaksi — se korvaa kortit,',
          'varjot ja aksenttivärin yhdellä eleellä.',
          '',
          'Kosketuslaitteella hoveria ei ole, joten käännös tulee `:active`-tilassa.',
          'Logiikka on kokonaan CSS:ssä (`styles/components/list-row.css`); komponentti',
          'ei tiedä tiloista mitään.',
          '',
          'Rivi ulottuu reunaan `.bleed`-utilitylla, mutta teksti pysyy `.page`:n linjassa.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    title: { description: 'Työn nimi.' },
    number: { description: 'Järjestysnumero vasempaan laitaan. Valinnainen.' },
    size: { description: "'m' on isompi otsikko ja väljempi rytmi — työlistan kärkirivit." },
    description: { description: 'Yhden lauseen kuvaus. Valinnainen.' },
    meta: { description: 'Rooli tai vuosi, oikeaan laitaan metana.' },
    href: { description: 'Kohdepolku.' },
  },
  args: {
    title: 'Colliers Asunnot',
    description: 'Vuokra-asuntopalvelu, joka suunniteltiin koodissa',
    meta: 'Design, front end, CMS',
    href: '#',
  },
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Perustila: nimi, kuvaus ja rooli yhdellä rivillä. */
export const Oletus: Story = {};

/** Ilman kuvausta — käytetään tiiviissä listassa. */
export const VainNimi: Story = {
  args: { description: undefined },
};

/**
 * Rivit listana: viivat jakavat ne, ja osoittimen alla oleva rivi
 * kääntyy mustaksi muiden vaimentuessa.
 */
export const Lista: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Vie osoitin rivin päälle: se kääntyy ja muut vaimenevat. Vaimennus on `.list-rows:hover .list-row:not(:hover)` — se tekee valinnasta yksiselitteisen ilman aksenttiväriä.',
      },
    },
  },
  render: () => (
    <div className="list-rows">
      <ListRow
        title="Colliers Asunnot"
        description="Vuokra-asuntopalvelu, joka suunniteltiin koodissa"
        meta="Design, front end, CMS"
        href="#"
      />
      <ListRow
        title="Blokbook"
        description="Oman taloyhtiön ongelmasta myytäväksi palveluksi"
        meta="Perustaja — tuote, design, toteutus"
        href="#"
      />
      <ListRow
        title="Tämä sivusto"
        description="Yksi lähde, kaksi suuntaa — design system koodissa ja Figmassa"
        meta="Design system, Storybook, Code Connect"
        href="#"
      />
    </div>
  ),
};

/**
 * Alle 600 px: rivi pinoutuu nimeksi, kuvaukseksi ja rooliksi
 * allekkain. Tämä on perustila, ei kavennettu työpöytärivi.
 */
export const Mobiili: Story = {
  ...meta,
  globals: { viewport: { value: 'base' } },
  render: () => (
    <div className="list-rows">
      <ListRow
        title="Colliers Asunnot"
        description="Vuokra-asuntopalvelu, joka suunniteltiin koodissa"
        meta="Design, front end, CMS"
        href="#"
      />
      <ListRow
        title="Blokbook"
        description="Oman taloyhtiön ongelmasta myytäväksi palveluksi"
        meta="Perustaja — tuote, design, toteutus"
        href="#"
      />
    </div>
  ),
};

/** Sama komponentti, sama token-nimi, käännetty pinta. */
export const Tumma: Story = {
  globals: { theme: 'dark' },
  render: () => (
    <div className="list-rows">
      <ListRow
        title="Colliers Asunnot"
        description="Vuokra-asuntopalvelu, joka suunniteltiin koodissa"
        meta="Design, front end, CMS"
        href="#"
      />
      <ListRow
        title="Blokbook"
        description="Oman taloyhtiön ongelmasta myytäväksi palveluksi"
        meta="Perustaja — tuote, design, toteutus"
        href="#"
      />
    </div>
  ),
};

/**
 * Pitkä nimi ja pitkä rooli samalla rivillä: rooli ei kutistu, joten
 * nimi katkeaa ensin.
 */
export const PitkaSisalto: Story = {
  args: {
    title: 'OP Pohjola — ajotapaan perustuva vakuutus',
    description: 'Pilotin kampanjasivusto, käyttäjäpolku ja infografiikka yhdessä näkymässä',
    meta: 'Service design · UX/UI · Front end · Konsepti',
  },
};


/**
 * Sama rivi isona ja numerolla — työlistan kärkirivi. Ennen tämä oli
 * oma toteutuksensa (`.lead-row`), joka oli listarivin kopio isommalla
 * otsikolla. Nyt ero on kaksi modifioijaa.
 */
export const Karkirivi: Story = {
  render: () => (
    <div className="list-rows">
      <ListRow
        size="m"
        number="01"
        title="Colliers Asunnot"
        description="Vuokra-asuntopalvelu kuudessa kuukaudessa: asuntohaku, verkkovuokraus ja sisällönhallinta. Design ja toteutus samoissa käsissä."
        meta="Design, front end, CMS"
        href="#"
      />
      <ListRow
        size="m"
        number="02"
        title="Blokbook"
        description="Taloyhtiöiden tilojen varaus ja maksut webissä, iOS:llä ja Androidilla. Oma tuote ja yritys."
        meta="Perustaja — tuote, design, toteutus"
        href="#"
      />
    </div>
  ),
};

/**
 * Kolme kokoonpanoa allekkain: perusrivi, numerollinen ja iso.
 * Runko on sama, erot ovat modifioijissa.
 */
export const Kokoonpanot: Story = {
  render: () => (
    <div className="list-rows">
      <ListRow title="Perusrivi" description="Nimi ja kuvaus" meta="Rooli" href="#" />
      <ListRow number="02" title="Numerollinen" description="Numero vasemmalla" meta="Rooli" href="#" />
      <ListRow size="m" number="03" title="Iso rivi" description="Isompi otsikko, väljempi rytmi" meta="Rooli" href="#" />
    </div>
  ),
};
