import type { Block } from '@/content/cases';
import Reveal from './Reveal';
import ListRowShowcase from './ListRowShowcase';
import Ikkuna from './Ikkuna';
import { caseArtefacts } from '@/lib/artefacts';
import { checks, liveCheckCount } from '@/lib/checks';
import { ketju } from '@/content/prosessi';
import { kello, kesto, viimeisinAjo } from '@/lib/ajo';
import Timeline, { TimelineItem } from './Timeline';
import type { Locale } from '@/lib/i18n';
import Section from './Section';
import CheckList from './CheckList';
import Piirros from './Piirros';

/**
 * Casen johdetut lohkot: ne eivät piirrä annettua dataa vaan lukevat
 * totuuden tiedostojärjestelmästä build-aikana.
 *
 *   artefacts   artefaktien tila ja osoitteet (lib/artefacts.ts)
 *   checks      ajossa olevat synkkatarkistukset (lib/checks.ts)
 *   ketju       prosessin lenkit (content/prosessi.ts) ja niiden
 *               vartijat (lib/checks.ts)
 *   component   komponentin lähdekoodi (ListRowShowcase)
 *               ja viimeisin build, jonka scripts/ajo.mjs kirjasi
 *               (lib/ajo.ts)
 *
 * Juuri siksi ne eivät voi vanhentua — eikä niillä voi olla storya:
 * `node:fs` ei toimi selaimessa. Tämä on sama syy jolla
 * ListRowShowcase on kirjattu poikkeukseksi, ja se on kirjattu myös
 * tälle tiedostolle scripts/check-stories.mjs:ssä.
 */
export type DerivedBlock = Extract<Block, { kind: 'artefacts' | 'checks' | 'component' | 'ketju' }>;

export default function CaseBlockDerived({
  block,
  locale,
}: {
  block: DerivedBlock;
  locale: Locale;
}) {
  switch (block.kind) {
    case 'artefacts': {
      /* Tila luetaan tiedostoista build-aikana, ei casedatasta.
         Storybook on olemassa vaikkei julkaistu — sitä ei saa
         esittää samana kuin Figmaa, jota ei ole. */
      const artefacts = caseArtefacts();
      return (
        <Reveal>
          <Section layout="aside" title={block.label} surface={block.surface}>
            <div className="case__section-body">
              {/* Luku johdetaan listasta: käsin kirjoitettuna se
                  vanhenisi heti kun artefakti lisätään tai poistetaan. */}
              <h3 className="display-m case__h">{artefacts.length} paikkaa, joissa työn voi tarkistaa</h3>
              <p className="body-l measure case__p">{block.note}</p>
              <div className="ikkunat">
                {artefacts.map((item) => (
                  <Ikkuna
                    key={item.number}
                    aihe={item.aihe}
                    number={item.number}
                    title={item.label}
                    body={item.body}
                    host={item.host}
                    note={item.note}
                    state={item.state}
                    href={item.href}
                  />
                ))}
              </div>
            </div>
          </Section>
        </Reveal>
      );
    }

    case 'checks': {
      /* Lista johdetaan package.jsonista. Casetekstissä on vain
         otsikko ja johdanto — se mitä tarkistetaan, luetaan sieltä
         missä tarkistukset asuvat.

         Myös otsikon luku on johdettu. Käsin kirjoitettuna se vanheni
         heti: otsikko lupasi neljä tarkistusta kun niitä oli
         seitsemän — täsmälleen se virhe jota tämä lohko käsittelee,
         tällä sivulla itsellään. Placeholder on pakollinen, joten
         lukua ei voi kirjoittaa takaisin: puuttuva {n} kaataa buildin
         eikä muutos pääse läpi. Luku jää numeroksi eikä sanaksi,
         koska taivutus olisi taas käsin kirjoitettua kieltä
         komponentissa. */
      /* Listassa vain design systemin tarkistukset; sivuston omat
         näkyvät viimeisimmän ajon aikajanalla omana ryhmänään
         (päätös 50). Ajamaton tarkistus siirtyy Tulossa-ryhmään. */
      const all = checks().filter((c) => c.group === 'ydin');
      const lista = [...all.filter((c) => c.runs), ...all.filter((c) => !c.runs)];
      const live = liveCheckCount();
      const ajo = viimeisinAjo();

      if (!block.title.includes('{n}')) {
        throw new Error(
          `Case-lohko 'checks': otsikosta puuttuu {n}. ` +
            `Tarkistusten määrä on johdettava, ei kirjoitettava. Nyt: "${block.title}"`,
        );
      }
      return (
        <Reveal>
          <Section layout="aside" title={block.label} surface={block.surface}>
            <div className="case__section-body">
              <h3 className="display-m case__h">{block.title.replace('{n}', String(live))}</h3>
              <p className="body-l measure case__p">{block.note}</p>
              <CheckList
                items={lista.map(({ id, title, huomaa, proves, items, blind, runs }) => ({ id, title, huomaa, proves, items, blind: blind || null, runs, group: runs ? undefined : 'tulossa' }))}
                groups={[block.pending]}
                build={ajo ? {
                  group: block.paivitys,
                  title: block.paivitys.row,
                  description: ['Läpi', new Date(ajo.alkoi).toLocaleDateString('fi-FI', { timeZone: 'Europe/Helsinki' }), ajo.commit].filter(Boolean).join(' · '),
                  children: (
                    <Timeline>
                      {ajo.vaiheet.map((vaihe, i) => (
                        <TimelineItem
                          key={vaihe.id}
                          label={kello(vaihe.alku)}
                          group={i === 0 || ajo.vaiheet[i - 1].ryhma !== vaihe.ryhma ? vaihe.ryhma : null}
                          title={vaihe.nimi}
                          meta={kesto(vaihe.kesto)}
                          description={vaihe.tulos}
                          variant={vaihe === ajo.hitain ? 'emphasis' : 'default'}
                          weight={vaihe.kesto / ajo.sivustoAlkoi}
                        />
                      ))}
                      <TimelineItem label={kello(ajo.sivustoAlkoi)} title="Sivusto rakennetaan" description="Tämä sivu on sen tulos." variant="end" />
                    </Timeline>
                  ),
                } : undefined}
              />
            </div>
          </Section>
        </Reveal>
      );
    }
    case 'ketju': {
      /* Tarkistuksen nimi luetaan rekisteristä, jotta se on sama kuin
         tarkistuslistassa. Tuntematon tunniste näkyy sellaisenaan. */
      const nimet = new Map(checks().map((c) => [c.id, c.title]));
      return (
        <Reveal>
          <Section layout="aside" title={block.label} surface={block.surface}>
            <div className="case__section-body">
              <h3 className="display-m case__h">{block.title}</h3>
              <p className="body-l measure case__p">{block.body}</p>
              {/* Sama vaiherakenne kuin Työtapa-sivulla: kuva, numero,
                  otsikko ja teksti. Vartijat kulkevat viimeisenä rivinä. */}
              <ol className="tyotapa__vaiheet case__ketju">
                {ketju.map((lenkki) => (
                  <li
                    key={lenkki.numero}
                    className={['tyotapa__vaihe', lenkki.tulossa ? 'case__ketju-tulossa' : ''].join(' ')}
                  >
                    <Piirros aihe={lenkki.aihe} />
                    <span className="meta meta--s">{String(lenkki.numero).padStart(2, '0')}</span>
                    <h4 className="title">{lenkki.otsikko}</h4>
                    <p className="body-s muted">{lenkki.teksti}</p>
                    <span className="meta faint case__ketju-vartijat">
                      {lenkki.tulossa
                        ? 'Tulossa'
                        : lenkki.vartijat.length
                          ? `${lenkki.vartijat.length > 1 ? 'Tarkistukset' : 'Tarkistus'}: ${lenkki.vartijat.map((id) => nimet.get(id) ?? id).join(' · ')}`
                          : 'Ei tarkistusta'}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Section>
        </Reveal>
      );
    }
    case 'component':
      return (
        <Section layout="aside" title={block.label} surface={block.surface}>
          <div className="case__section-body">
            <h3 className="display-m case__h">{block.title}</h3>
            <p className="body-l measure case__p">{block.body}</p>
            {/* Palvelinkomponentti: lukee lähdekoodin build-aikana. */}
            <ListRowShowcase locale={locale} />
          </div>
        </Section>
      );
  }
}
