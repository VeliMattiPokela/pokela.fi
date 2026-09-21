import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Accordion } from './Accordion';

/**
 * Avautuva rivi. Pelkkä kuori — sisältö annetaan lapsina.
 * <PreviousWork> käyttää tätä oikealla sisällöllä.
 */
const meta = {
  title: 'Komponentit/Accordion',
  component: Accordion,
  parameters: {
    /* Täysleveä: hoitaa oman sivupaddinginsa .bleed-utilitylla. */
    bleed: true,
    docs: {
      description: {
        component:
          'Avoin tila merkitään kahdella tavalla yhtä aikaa: käännetty pinta ja − -merkki. Pelkkä merkki ei riitä, koska se on pieni; pelkkä käännös ei riitä, koska se on sama kuin hover.',
      },
    },
  },
  args: {
    number: '04',
    title: 'Pivo',
    description: 'Maksusovellus 1,2 milj. käyttäjälle',
    meta: 'Service design · UX/UI',
    open: false,
    onToggle: () => {},
    labels: { open: 'Avaa', close: 'Sulje' },
    children: null,
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Suljettu: Story = {};

export const Avattu: Story = {
  args: {
    open: true,
    children: (
      <div className="detail">
        <div className="detail__head">
          <h3 className="display-m">Maksusovellus, jota käyttää yli miljoona ihmistä</h3>
          <p className="body-l measure detail__intro">
            Pivo on mobiilimaksamisen sovellus, jolla lähetetään rahaa, jaetaan yhteisiä
            kuluja ja maksetaan verkossa.
          </p>
        </div>
      </div>
    ),
  },
};

/** Toimiva tila — klikkaa riviä. */
export const Interaktiivinen: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="list-rows">
        <Accordion {...args} open={open} onToggle={() => setOpen((v) => !v)}>
          <div className="detail">
            <div className="detail__head">
              <h3 className="display-m">Maksusovellus, jota käyttää yli miljoona ihmistä</h3>
              <p className="body-l measure detail__intro">
                Haastattelut, kyselyt, analytiikka ja käytettävyystestit. Näiden pohjalta
                rakennettiin uusien ominaisuuksien konseptit.
              </p>
            </div>
          </div>
        </Accordion>
      </div>
    );
  },
};

export const Tumma: Story = { ...Avattu, globals: { theme: 'dark' } };

/** Mobiilissa meta-sarake piilotetaan; numero, nimi ja merkki jäävät. */
export const Mobiili: Story = {
  ...Avattu,
  globals: { viewport: { value: 'base' } },
};
