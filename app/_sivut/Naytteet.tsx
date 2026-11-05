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
import type { System } from '@/content/system/fi';

/** Näytteiden tekstit tulevat sivulta kielen mukaan (content/system/). */
type T = { t: System['naytteet'] };

const tayta = (teksti: string, n: number) => teksti.replace('{n}', String(n));

/**
 * System-sivun elävät näytteet komponenteista, joilla on tilaa tai
 * funktioita propseina. Sivu itse on palvelinkomponentti, eikä se voi
 * antaa funktioita (Tablen solut, Dialogin onClose) asiakaskomponentille,
 * joten ne kootaan tänne. Näytteet ovat samoja komponentteja, joita
 * paketti vie; tyyliä tai rakennetta ei lisätä niiden ohi.
 */

export function LomakeNayte({ t }: T) {
  return (
    <div className="sys__stack">
      <TextField label={t.nimi} defaultValue="Sara Niemi" />
      <TextField label={t.sahkoposti} type="email" defaultValue="sara@pokela" error={t.sahkopostiVirhe} />
      <TextField label={t.yritys} optional={t.valinnainen} hint={t.yritysVihje} />
      <TextField label={t.viesti} multiline rows={3} placeholder={t.viestiPaikka} />
    </div>
  );
}

export function ValintaNayte({ t }: T) {
  return (
    <div className="sys__stack">
      <Select
        label={t.rooli}
        defaultValue="suunnittelija"
        options={[
          { value: 'suunnittelija', label: t.roolit.suunnittelija },
          { value: 'kehittaja', label: t.roolit.kehittaja },
          { value: 'tuoteomistaja', label: t.roolit.tuoteomistaja },
        ]}
      />
      <ChoiceGroup legend={t.laskutus}>
        <Radio name="sys-laskutus" label={t.kuukausittain} defaultChecked />
        <Radio name="sys-laskutus" label={t.vuosittain} hint={t.vuosittainVihje} />
      </ChoiceGroup>
      <ChoiceGroup legend={t.ilmoitukset}>
        <Checkbox label={t.kommentit} defaultChecked />
        <Checkbox label={t.kooste} />
      </ChoiceGroup>
      <Switch label={t.tumma} defaultChecked />
    </div>
  );
}

export function TabsNayte({ t }: T) {
  const Paneeli = ({ children }: { children: string }) => <p className="body-s muted sys__panel">{children}</p>;
  return (
    <Tabs label={t.asetukset} defaultValue="tiimi">
      <Tab value="yleiset" label={t.tabs.yleiset}>
        <Paneeli>{t.tabs.yleisetPaneeli}</Paneeli>
      </Tab>
      <Tab value="tiimi" label={t.tabs.tiimi} count={4}>
        <Paneeli>{t.tabs.tiimiPaneeli}</Paneeli>
      </Tab>
      <Tab value="laskutus" label={t.laskutus}>
        <Paneeli>{t.tabs.laskutusPaneeli}</Paneeli>
      </Tab>
      <Tab value="arkisto" label={t.tabs.arkisto} disabled>
        <Paneeli>{t.tabs.arkistoPaneeli}</Paneeli>
      </Tab>
    </Tabs>
  );
}

export function AccordionNayte({ t, labels }: T & { labels: { open: string; close: string } }) {
  const ryhma = useAccordionGroup();
  const rivit = [
    { slug: 'tokenit', title: t.accordion.tokenit, description: t.accordion.tokenitKuvaus, meta: tayta(t.accordion.vaihe, 1) },
    { slug: 'kirjasto', title: t.accordion.kirjasto, description: t.accordion.kirjastoKuvaus, meta: tayta(t.accordion.vaihe, 2) },
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
          <p className="body-s muted sys__panel">{t.accordion.paneeli}</p>
        </Accordion>
      ))}
    </div>
  );
}

export function AlertNayte({ t }: T) {
  const [auki, setAuki] = useState(true);
  return (
    <div className="sys__stack">
      {auki ? (
        <Alert title={t.alert.kutsu} onDismiss={() => setAuki(false)}>
          {t.alert.kutsuTeksti}
        </Alert>
      ) : (
        <button type="button" className="btn btn--text" onClick={() => setAuki(true)}>
          {t.alert.uudelleen}
        </button>
      )}
      <Alert tone="success" title={t.alert.tallennettu}>
        {t.alert.tallennettuTeksti}
      </Alert>
      <Alert
        tone="error"
        title={t.alert.virhe}
        action={
          <a className="btn btn--text" href="#palaute">
            {t.alert.virheToiminto}
          </a>
        }
      >
        {t.alert.virheTeksti}
      </Alert>
    </div>
  );
}

export function DialogNayte({ t }: T) {
  const [auki, setAuki] = useState(false);
  const sulje = () => setAuki(false);
  return (
    <>
      <button type="button" className="btn btn--ghost btn--s" onClick={() => setAuki(true)}>
        {t.dialog.avaa}
      </button>
      <Dialog
        open={auki}
        onClose={sulje}
        title={t.dialog.title}
        description={t.dialog.description}
        actions={
          <>
            <button type="button" className="btn btn--ghost btn--s" onClick={sulje}>
              {t.dialog.peruuta}
            </button>
            <button type="button" className="btn btn--primary btn--s" onClick={sulje}>
              {t.dialog.avaa}
            </button>
          </>
        }
      />
    </>
  );
}

type Rooli = keyof System['naytteet']['roolit'];
type Jasen = { id: string; nimi: string; rooli: Rooli; muutoksia: number; tila: 'ok' | 'virhe' | 'kutsu' };

const JASENET: Jasen[] = [
  { id: 'anna', nimi: 'Anna Virtanen', rooli: 'suunnittelija', muutoksia: 14, tila: 'ok' },
  { id: 'juho', nimi: 'Juho Korhonen', rooli: 'tutkija', muutoksia: 1024, tila: 'kutsu' },
  { id: 'mikko', nimi: 'Mikko Laine', rooli: 'kehittaja', muutoksia: 128, tila: 'ok' },
  { id: 'sara', nimi: 'Sara Niemi', rooli: 'tuoteomistaja', muutoksia: 7, tila: 'virhe' },
];

const sarakkeet = (t: System['naytteet']): TableColumn<Jasen>[] => [
  { key: 'nimi', header: t.nimi, sortable: true },
  { key: 'rooli', header: t.rooli, muted: true, sortable: true, cell: (r) => t.roolit[r.rooli] },
  { key: 'muutoksia', header: t.taulukko.muutoksia, numeric: true, sortable: true, cell: (r) => r.muutoksia.toLocaleString(t.taulukko.numerot) },
  {
    key: 'tila',
    header: t.taulukko.tila,
    cell: (r) =>
      r.tila === 'kutsu' ? (
        <span className="table__muted">{t.taulukko.kutsuttu}</span>
      ) : (
        <span className={['table__status', r.tila === 'virhe' && 'table__status--error'].filter(Boolean).join(' ')}>
          <Icon name={r.tila === 'ok' ? 'check' : 'alert'} />
          {r.tila === 'ok' ? t.taulukko.aktiivinen : t.taulukko.maksuEpaonnistui}
        </span>
      ),
  },
];

export function TaulukkoNayte({ t }: T) {
  return (
    <Table
      caption={t.taulukko.caption}
      columns={sarakkeet(t)}
      rows={JASENET}
      rowKey={(r) => r.id}
      defaultSort={{ key: 'nimi', direction: 'ascending' }}
    />
  );
}
