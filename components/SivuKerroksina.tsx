import type { ReactNode } from 'react';
import ExplodedView, { type ExplodedTila } from './ExplodedView';
import ListRow from './ListRow';
import Media from './Media';
import Icon from './Icon';
import tokens from '@/lib/tokens';
import { getWork } from '@/content/work';
import { getDictionary } from '@/content/dictionaries';
import type { Locale } from '@/lib/i18n';

/**
 * Tämä sivusto räjäytyskuvana: tokenit, komponentit ja valmis sivu.
 *
 * Kerrokset eivät ole kuvitusta vaan sivuston omaa koodia: värit,
 * tyyppi ja välit luetaan tokens.json:sta, komponentit ovat samat
 * ListRow, Media ja Icon joita sivu käyttää, ja tekstit tulevat
 * sanakirjasta ja työlistasta. Kun token tai komponentti muuttuu,
 * kuva muuttuu mukana.
 *
 * Sama kuva on System-sivulla ja case 03:ssa (lohko `kerrokset`).
 * Sivustokohtainen kokoonpano, ei paketissa: yleinen osa on
 * ExplodedView.
 */

const VARIT = ['paper', 'ink', 'badge-surface', 'ink-muted', 'ink-faint', 'line'] as const;
const VALIT = ['4', '8', '12', '16', '24', '40', '72'] as const;

/** Linkkikomponentin paikalle: kuvassa ei ole linkkejä. */
function Staattinen({ href: _href, ...props }: { href?: string; className?: string; children?: ReactNode }) {
  return <div {...props} />;
}

export default function SivuKerroksina({ locale, tila = 'auki' }: { locale: Locale; tila?: ExplodedTila }) {
  const dict = getDictionary(locale);
  const leads = getWork(locale).leads.slice(0, 2);
  const display = tokens.type['display-xl'];
  const meta = tokens.type.meta;

  const tokenit = (
    <div className="kerrokset__tokenit">
      <ul className="kerrokset__varit">
        {VARIT.map((nimi) => (
          <li key={nimi} className="kerrokset__vari">
            <span className="kerrokset__siru" style={{ background: `var(--${nimi})` }} />
            <span className="meta meta--s ink">{nimi}</span>
            <span className="body-s faint">{tokens.color.light[nimi]}</span>
          </li>
        ))}
      </ul>
      <div className="kerrokset__tyyppi">
        <span className="display-xl">Aa</span>
        <span className="body-s faint">{`display-xl · ${display.size} / ${display.lineHeight}`}</span>
        <span className="body-s faint">{`meta · ${meta.size} / ${meta.lineHeight}`}</span>
        <span className="kerrokset__valit">
          {VALIT.map((v) => (
            <i key={v} style={{ height: `var(--space-${v})` }} />
          ))}
        </span>
        <span className="body-s faint">{`space ${VALIT.join(' · ')}`}</span>
      </div>
    </div>
  );

  const nav = (
    <span className="kerrokset__nav">
      <span className="meta ink">VMP</span>
      {/* Yksi tekstisolmu: Figman pohjan teksti verrataan tähän sellaisenaan. */}
      <span className="meta">{[dict.nav.work, dict.nav.about, dict.nav.system].join(' · ')}</span>
    </span>
  );
  const nappi = (
    <span className="btn btn--text">
      {dict.home.aboutLink} <Icon name="arrow-right" />
    </span>
  );

  const komponentit = (
    <div className="kerrokset__komponentit">
      <div className="kerrokset__komp" data-kohde="nav">
        <code className="kerrokset__tunnus">{'<Nav />'}</code>
        {nav}
      </div>
      <div className="kerrokset__komp" data-kohde="button">
        <code className="kerrokset__tunnus">{'<Button variant="text" />'}</code>
        {nappi}
      </div>
      <div className="kerrokset__komp kerrokset__komp--leveä" data-kohde="listrow">
        <code className="kerrokset__tunnus">{'<ListRow />'}</code>
        <ListRow as={Staattinen} href="" title={leads[0].title} description={leads[0].tagline} meta={leads[0].meta} />
      </div>
      <div className="kerrokset__komp kerrokset__komp--leveä" data-kohde="media">
        <code className="kerrokset__tunnus">{'<Media ratio="hero" />'}</code>
        <Media ratio="hero" />
      </div>
    </div>
  );

  const sivu = (
    <div className="kerrokset__sivu">
      <div data-kohde="nav">{nav}</div>
      <span className="display-l">{dict.home.name}</span>
      <span className="kerrokset__rivi">
        <span className="meta ink">{dict.home.role}</span>
        <span data-kohde="button">{nappi}</span>
      </span>
      <div data-kohde="media">
        <Media ratio="hero" />
      </div>
      <div>
        {leads.map((lead) => (
          <div key={lead.slug} data-kohde="listrow">
            <ListRow as={Staattinen} href="" title={lead.title} description={lead.tagline} meta={lead.meta} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ExplodedView
      tila={tila}
      label={dict.system.kerroksetLabel}
      layers={[
        { name: dict.system.kerrokset[0], source: 'tokens.json', content: tokenit },
        { name: dict.system.kerrokset[1], source: '@pokela/components', content: komponentit },
        { name: dict.system.kerrokset[2], source: 'pokela.fi', content: sivu },
      ]}
    />
  );
}
