import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ChoiceGroup from './ChoiceGroup';
import Checkbox from './Checkbox';
import Radio from './Radio';
import Switch from './Switch';

/**
 * Valintojen ryhmä. Sivusto ei käytä tätä; se on sovellusnäkymiä ja
 * Makea varten (päätös 22).
 */
const meta = {
  title: 'Komponentit/ChoiceGroup',
  component: ChoiceGroup,
  parameters: {
    docs: {
      description: {
        component: [
          'Otsikko, valinnat, ohje ja virhe yhtenä `<fieldset>`inä. Ruudunlukija sanoo otsikon ennen jokaista valintaa.',
          'Virhe kuuluu ryhmälle: `error` merkitsee kaikki valinnat ja näyttää viestin ikonin kanssa kuten `TextField`.',
        ].join('\n\n'),
      },
    },
  },
  args: {
    legend: 'Mitä haluat seurata',
    children: (
      <>
        <Checkbox label="Uudet työt" defaultChecked />
        <Checkbox label="Kirjoitukset" hint="Noin kerran kuussa." />
        <Checkbox label="Puhetilaisuudet" hint="Ei vielä saatavilla." disabled />
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 'var(--measure)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChoiceGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Valintaruudut: Story = {};

export const Radiot: Story = {
  args: {
    legend: 'Yhteydenottotapa',
    children: (
      <>
        <Radio name="tapa" value="sahkoposti" label="Sähköposti" defaultChecked />
        <Radio name="tapa" value="puhelin" label="Puhelin" />
        <Radio name="tapa" value="ei" label="Ei yhteydenottoja" />
      </>
    ),
  },
};

export const Virhe: Story = {
  args: {
    legend: 'Hyväksy ehdot',
    error: 'Hyväksy ehdot ennen lähettämistä.',
    children: <Checkbox label="Olen lukenut tietosuojaselosteen" />,
  },
};

/** Asetusnäkymä, kuten Makessa: kytkimet toimivat heti, muut tallennetaan. */
export const Asetuksissa: Story = {
  render: () => (
    <form style={{ display: 'grid', gap: 'var(--space-32)' }} onSubmit={(e) => e.preventDefault()}>
      <ChoiceGroup legend="Ilmoitukset">
        <Switch label="Sähköposti-ilmoitukset" hint="Kun joku kommentoi työtäsi." defaultChecked />
        <Switch label="Viikkokooste" hint="Maanantaisin klo 9." />
      </ChoiceGroup>
      <ChoiceGroup legend="Näkyvyys">
        <Radio name="nakyvyys" value="julkinen" label="Julkinen" hint="Kuka tahansa linkin saanut." defaultChecked />
        <Radio name="nakyvyys" value="tiimi" label="Vain tiimi" />
      </ChoiceGroup>
      <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
        <button type="submit" className="btn btn--primary">Tallenna</button>
        <button type="button" className="btn btn--ghost">Peruuta</button>
      </div>
    </form>
  ),
};

export const Tumma: Story = { ...Virhe, globals: { theme: 'dark' } };

export const Mobiili: Story = { ...Valintaruudut, globals: { viewport: { value: 'base' } } };
