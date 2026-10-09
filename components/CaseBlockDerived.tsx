import type { Block } from '@/content/cases';
import Reveal from './Reveal';
import ListRowShowcase from './ListRowShowcase';
import Icon from './Icon';
import { caseArtefacts } from '@/lib/artefacts';
import { checks, liveCheckCount } from '@/lib/checks';
import { ketju } from '@/content/prosessi';
import { kello, kesto, viimeisinAjo } from '@/lib/ajo';
import Timeline, { TimelineItem } from './Timeline';
import type { Locale } from '@/lib/i18n';
import Section from './Section';

/**
 * Casen johdetut lohkot: ne eivät piirrä annettua dataa vaan lukevat
 * totuuden tiedostojärjestelmästä build-aikana.
 *
 *   artefacts   artefaktien tila ja osoitteet (lib/artefacts.ts)
 *   checks      ajossa olevat synkkatarkistukset (lib/checks.ts)
 *   ketju       prosessin lenkit (content/prosessi.ts) ja niiden
 *               vartijat (lib/checks.ts)
 *   component   komponentin lähdekoodi (ListRowShowcase)
 *   ajo         buildin vaiheet, jotka scripts/ajo.mjs kirjasi
 *               (lib/ajo.ts)
 *
 * Juuri siksi ne eivät voi vanhentua — eikä niillä voi olla storya:
 * `node:fs` ei toimi selaimessa. Tämä on sama syy jolla
 * ListRowShowcase on kirjattu poikkeukseksi, ja se on kirjattu myös
 * tälle tiedostolle scripts/check-stories.mjs:ssä.
 */
export type DerivedBlock = Extract<Block, { kind: 'artefacts' | 'checks' | 'component' | 'ketju' | 'ajo' }>;

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
          <Section layout="aside" title={block.label}>
            <div className="case__section-body">
              {/* Luku johdetaan listasta: käsin kirjoitettuna se
                  vanhenisi heti kun artefakti lisätään tai poistetaan. */}
              <h3 className="display-m case__h">{artefacts.length} artefaktia</h3>
              <p className="body-l measure case__p">{block.note}</p>
              <div className="case__artefacts">
                {artefacts.map((item) =>
                  item.href ? (
                    <a
                      key={item.number}
                      href={item.href}
                      className="case__artefact"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ArtefactBody item={item} />
                    </a>
                  ) : (
                    <div
                      key={item.number}
                      className={[
                        'case__artefact',
                        item.state === 'olemassa'
                          ? 'case__artefact--ready'
                          : 'case__artefact--pending',
                      ].join(' ')}
                    >
                      <ArtefactBody item={item} />
                    </div>
                  ),
                )}
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
      const all = checks();
      const live = liveCheckCount();

      if (!block.title.includes('{n}')) {
        throw new Error(
          `Case-lohko 'checks': otsikosta puuttuu {n}. ` +
            `Tarkistusten määrä on johdettava, ei kirjoitettava. Nyt: "${block.title}"`,
        );
      }
      return (
        <Reveal>
          <Section layout="aside" title={block.label}>
            <div className="case__section-body">
              <h3 className="display-m case__h">{block.title.replace('{n}', String(live))}</h3>
              <p className="body-l measure case__p">{block.note}</p>
              <p className="body-l measure case__p">
                Ajossa {live} tarkistusta {all.length}:stä. Loput näkyvät tässä listassa
                vasta kun ne oikeasti ajetaan.
              </p>
              <div className="case__checks">
                {all.map((check) => (
                  <div
                    key={check.id}
                    className={[
                      'case__check',
                      check.runs ? 'case__check--live' : 'case__check--pending',
                    ].join(' ')}
                  >
                    <span className="case__check-main">
                      <span className="display-s case__check-name">{check.title}</span>
                      <span className="body-s muted">{check.proves}</span>
                      {check.blind ? (
                        <span className="body-s faint case__check-blind">
                          <strong>Ei näe:</strong> {check.blind}
                        </span>
                      ) : null}
                    </span>
                    <span className="meta case__check-state">
                      {check.runs ? 'Ajossa' : 'Ei vielä kytketty'}
                    </span>
                  </div>
                ))}
              </div>
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
          <Section layout="aside" title={block.label}>
            <div className="case__section-body">
              <h3 className="display-m case__h">{block.title}</h3>
              <p className="body-l measure case__p">{block.body}</p>
              <ol className="case__scope">
                {ketju.map((lenkki) => (
                  <li
                    key={lenkki.numero}
                    className={[
                      'case__scope-item case__scope-item--wide',
                      lenkki.tulossa ? 'case__scope-item--pending' : '',
                    ].join(' ')}
                  >
                    <span className="meta">{String(lenkki.numero).padStart(2, '0')}</span>
                    <span>
                      <span className="body-s">{lenkki.otsikko}</span>
                      <span className="body-s muted">{lenkki.teksti}</span>
                      <span className="meta faint">
                        {lenkki.tulossa
                          ? 'Tulossa'
                          : lenkki.vartijat.length
                            ? `${lenkki.vartijat.length > 1 ? 'Tarkistukset' : 'Tarkistus'}: ${lenkki.vartijat.map((id) => nimet.get(id) ?? id).join(' · ')}`
                            : 'Ei tarkistusta'}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Section>
        </Reveal>
      );
    }
    case 'ajo': {
      /* Sivu näyttää sen buildin, joka sen rakensi. Ilman kirjausta
         (next dev, pelkkä next build) aikajanaa ei keksitä. */
      const ajo = viimeisinAjo();
      return (
        <Reveal>
          <Section layout="aside" title={block.label}>
            <div className="case__section-body">
              <h3 className="display-m case__h">{block.title}</h3>
              <p className="body-l measure case__p">{block.body}</p>
              {ajo ? (
                <>
                  <dl className="case__ajo-tila">
                    <div>
                      <dt className="meta faint">Tulos</dt>
                      <dd className="display-s">Läpi</dd>
                    </div>
                    <div>
                      <dt className="meta faint">Kesto ennen sivua</dt>
                      <dd className="display-s">{kello(ajo.sivustoAlkoi)}</dd>
                    </div>
                    <div>
                      <dt className="meta faint">Vaiheita</dt>
                      <dd className="display-s">{ajo.vaiheet.length + 1}</dd>
                    </div>
                    <div>
                      <dt className="meta faint">Missä</dt>
                      <dd className="display-s">{ajo.ymparisto}</dd>
                    </div>
                  </dl>
                  <p className="body-s muted case__ajo-muutos">
                    {[
                      ajo.muutos,
                      new Date(ajo.alkoi).toLocaleString('fi-FI', {
                        timeZone: 'Europe/Helsinki',
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      }),
                      ajo.commit,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
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
                    <TimelineItem
                      label={kello(ajo.sivustoAlkoi)}
                      title="Sivusto rakennetaan"
                      description="Tämä sivu on sen tulos."
                      variant="end"
                    />
                  </Timeline>
                  <p className="display-s case__ajo-nosto">
                    Hitain vaihe: {ajo.hitain.nimi.toLowerCase()}, {kesto(ajo.hitain.kesto)}.
                  </p>
                </>
              ) : (
                <p className="body-s muted case__p">
                  Tämä build ei kirjannut vaiheitaan. Aikajana syntyy, kun sivu rakennetaan
                  komennolla npm run build.
                </p>
              )}
            </div>
          </Section>
        </Reveal>
      );
    }
    case 'component':
      return (
        <Section layout="aside" title={block.label}>
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

function ArtefactBody({
  item,
}: {
  item: { number: string; label: string; body: string; href: string | null; note: string };
}) {
  return (
    <>
      <span className="meta case__artefact-num">{item.number}</span>
      <span className="case__artefact-main">
        <span className="display-s case__artefact-name">{item.label}</span>
        <span className="body-s muted">{item.body}</span>
      </span>
      <span className="meta case__artefact-link">
        {item.href ? (
          <>
            Avaa <Icon name="arrow-up-right" size="s" />
          </>
        ) : (
          item.note
        )}
      </span>
    </>
  );
}
