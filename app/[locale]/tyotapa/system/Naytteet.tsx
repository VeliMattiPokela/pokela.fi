'use client';

import { useState } from 'react';
import TextField from '@/components/TextField';
import Select from '@/components/Select';
import Checkbox from '@/components/Checkbox';
import Radio from '@/components/Radio';
import Switch from '@/components/Switch';
import ChoiceGroup from '@/components/ChoiceGroup';
import Tabs from '@/components/Tabs';
import Tab from '@/components/Tab';
import Alert from '@/components/Alert';
import Dialog from '@/components/Dialog';
import Table, { type TableColumn } from '@/components/Table';
import Icon from '@/components/Icon';
import { Accordion, useAccordionGroup } from '@/components/Accordion';

/**
 * System-sivun elävät näytteet komponenteista, joilla on tilaa tai
 * funktioita propseina. Sivu itse on palvelinkomponentti, eikä se voi
 * antaa funktioita (Tablen solut, Dialogin onClose) asiakaskomponentille,
 * joten ne kootaan tänne. Näytteet ovat samoja komponentteja, joita
 * paketti vie; tyyliä tai rakennetta ei lisätä niiden ohi.
 */

export function LomakeNayte() {
  return (
    <div className="sys__stack">
      <TextField label="Nimi" defaultValue="Sara Niemi" />
      <TextField label="Sähköposti" type="email" defaultValue="sara@pokela" error="Tarkista osoite, esim. sara@pokela.fi." />
      <TextField label="Yritys" optional="(valinnainen)" hint="Näkyy vain laskulla." />
      <TextField label="Viesti" multiline rows={3} placeholder="Kerro lyhyesti, mitä tarvitset." />
    </div>
  );
}

export function ValintaNayte() {
  return (
    <div className="sys__stack">
      <Select
        label="Rooli"
        defaultValue="suunnittelija"
        options={[
          { value: 'suunnittelija', label: 'Suunnittelija' },
          { value: 'kehittaja', label: 'Kehittäjä' },
          { value: 'tuoteomistaja', label: 'Tuoteomistaja' },
        ]}
      />
      <ChoiceGroup legend="Laskutus">
        <Radio name="sys-laskutus" label="Kuukausittain" defaultChecked />
        <Radio name="sys-laskutus" label="Vuosittain" hint="Kaksi kuukautta ilmaiseksi." />
      </ChoiceGroup>
      <ChoiceGroup legend="Ilmoitukset">
        <Checkbox label="Uudet kommentit" defaultChecked />
        <Checkbox label="Viikkokooste" />
      </ChoiceGroup>
      <Switch label="Tumma teema työpöydällä" defaultChecked />
    </div>
  );
}

export function TabsNayte() {
  const Paneeli = ({ children }: { children: string }) => <p className="body-s muted sys__panel">{children}</p>;
  return (
    <Tabs label="Asetukset" defaultValue="tiimi">
      <Tab value="yleiset" label="Yleiset">
        <Paneeli>Nimi, kieli ja aikavyöhyke.</Paneeli>
      </Tab>
      <Tab value="tiimi" label="Tiimi" count={4}>
        <Paneeli>Neljä jäsentä. Kutsu lisää tai muuta rooleja.</Paneeli>
      </Tab>
      <Tab value="laskutus" label="Laskutus">
        <Paneeli>Tilaus, maksutapa ja laskut.</Paneeli>
      </Tab>
      <Tab value="arkisto" label="Arkisto" disabled>
        <Paneeli>Arkisto on tyhjä.</Paneeli>
      </Tab>
    </Tabs>
  );
}

export function AccordionNayte({ labels }: { labels: { open: string; close: string } }) {
  const ryhma = useAccordionGroup();
  const rivit = [
    { slug: 'tokenit', title: 'Tokenit', description: 'Yksi lähde: tokens.json.', meta: 'Vaihe 1' },
    { slug: 'kirjasto', title: 'Kirjasto', description: 'Komponentit koodiin ja Figmaan.', meta: 'Vaihe 2' },
  ];
  return (
    <div>
      {rivit.map((r, i) => (
        <Accordion
          key={r.slug}
          number={String(i + 1).padStart(2, '0')}
          title={r.title}
          description={r.description}
          meta={r.meta}
          open={ryhma.isOpen(r.slug)}
          onToggle={() => ryhma.toggle(r.slug)}
          labels={labels}
        >
          <p className="body-s muted sys__panel">Vain yksi rivi on auki kerrallaan.</p>
        </Accordion>
      ))}
    </div>
  );
}

export function AlertNayte() {
  const [auki, setAuki] = useState(true);
  return (
    <div className="sys__stack">
      {auki ? (
        <Alert title="Kutsu vanhenee 7 päivässä" onDismiss={() => setAuki(false)}>
          Kutsutut näkevät tiimin vasta, kun hyväksyvät kutsun.
        </Alert>
      ) : (
        <button type="button" className="btn btn--text" onClick={() => setAuki(true)}>
          Näytä ilmoitus uudelleen
        </button>
      )}
      <Alert tone="success" title="Asetukset tallennettu">
        Muutokset näkyvät tiimille heti.
      </Alert>
      <Alert
        tone="error"
        title="Laskua ei voitu veloittaa"
        action={
          <a className="btn btn--text" href="#palaute">
            Päivitä maksutapa
          </a>
        }
      >
        Kortti hylättiin 3.10. Päivitä maksutapa, ettei tilaus keskeydy.
      </Alert>
    </div>
  );
}

export function DialogNayte() {
  const [auki, setAuki] = useState(false);
  const sulje = () => setAuki(false);
  return (
    <>
      <button type="button" className="btn btn--ghost btn--s" onClick={() => setAuki(true)}>
        Poista jäsen
      </button>
      <Dialog
        open={auki}
        onClose={sulje}
        title="Poistetaanko Sara Niemi tiimistä?"
        description="Pääsy tiimin projekteihin päättyy heti. Voit kutsua jäsenen takaisin myöhemmin."
        actions={
          <>
            <button type="button" className="btn btn--ghost btn--s" onClick={sulje}>
              Peruuta
            </button>
            <button type="button" className="btn btn--primary btn--s" onClick={sulje}>
              Poista jäsen
            </button>
          </>
        }
      />
    </>
  );
}

type Jasen = { id: string; nimi: string; rooli: string; muutoksia: number; tila: 'ok' | 'virhe' | 'kutsu' };

const JASENET: Jasen[] = [
  { id: 'anna', nimi: 'Anna Virtanen', rooli: 'Suunnittelija', muutoksia: 14, tila: 'ok' },
  { id: 'juho', nimi: 'Juho Korhonen', rooli: 'Tutkija', muutoksia: 1024, tila: 'kutsu' },
  { id: 'mikko', nimi: 'Mikko Laine', rooli: 'Kehittäjä', muutoksia: 128, tila: 'ok' },
  { id: 'sara', nimi: 'Sara Niemi', rooli: 'Tuoteomistaja', muutoksia: 7, tila: 'virhe' },
];

const SARAKKEET: TableColumn<Jasen>[] = [
  { key: 'nimi', header: 'Nimi', sortable: true },
  { key: 'rooli', header: 'Rooli', muted: true, sortable: true },
  { key: 'muutoksia', header: 'Muutoksia', numeric: true, sortable: true, cell: (r) => r.muutoksia.toLocaleString('fi-FI') },
  {
    key: 'tila',
    header: 'Tila',
    cell: (r) =>
      r.tila === 'kutsu' ? (
        <span className="table__muted">Kutsuttu</span>
      ) : (
        <span className={['table__status', r.tila === 'virhe' && 'table__status--error'].filter(Boolean).join(' ')}>
          <Icon name={r.tila === 'ok' ? 'check' : 'alert'} />
          {r.tila === 'ok' ? 'Aktiivinen' : 'Maksu epäonnistui'}
        </span>
      ),
  },
];

export function TaulukkoNayte() {
  return (
    <Table
      caption="Tiimin jäsenet"
      columns={SARAKKEET}
      rows={JASENET}
      rowKey={(r) => r.id}
      defaultSort={{ key: 'nimi', direction: 'ascending' }}
    />
  );
}
