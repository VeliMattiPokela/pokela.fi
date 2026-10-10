import type { ReactNode } from 'react';

/**
 * Yksi välilehti ja sen paneeli. Käytetään vain `Tabs`in lapsena.
 *
 * Tab ei piirrä itse mitään: `Tabs` lukee sen propsit ja rakentaa
 * niistä välilehtirivin ja paneelit, jotta ARIA-kytkennät (id:t,
 * aria-controls, aria-labelledby) syntyvät yhdessä paikassa. Erillinen
 * komponentti on silti tarpeen, koska kirjoitettuna se on luettavampi
 * kuin taulukko, ja Figman Tabs / Tab -instanssi kääntyy tähän.
 */
export type TabProps = {
  /** Tunniste, jolla `Tabs` tietää valitun välilehden. */
  value: string;
  /** Välilehden teksti. */
  label: string;
  /** Lukumäärä tekstin perässä, esim. avoimet tehtävät. */
  count?: number;
  disabled?: boolean;
  /** Paneelin sisältö. */
  children?: ReactNode;
};

export default function Tab(props: TabProps) {
  /* Piirretään vain Tabsin kautta. Yksinään paneelin sisältö näkyy
     sellaisenaan, ettei mitään katoa hiljaa. */
  return <>{props.children}</>;
}
