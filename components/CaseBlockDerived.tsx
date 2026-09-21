import type { Block } from '@/content/cases';
import Reveal from './Reveal';
import ListRowShowcase from './ListRowShowcase';
import Icon from './Icon';
import { caseArtefacts } from '@/lib/artefacts';
import { checks } from '@/lib/checks';

/**
 * Casen johdetut lohkot: ne eivät piirrä annettua dataa vaan lukevat
 * totuuden tiedostojärjestelmästä build-aikana.
 *
 *   artefacts   artefaktien tila ja osoitteet (lib/artefacts.ts)
 *   checks      ajossa olevat synkkatarkistukset (lib/checks.ts)
 *   component   komponentin lähdekoodi (ListRowShowcase)
 *
 * Juuri siksi ne eivät voi vanhentua — eikä niillä voi olla storya:
 * `node:fs` ei toimi selaimessa. Tämä on sama syy jolla
 * ListRowShowcase on kirjattu poikkeukseksi, ja se on kirjattu myös
 * tälle tiedostolle scripts/check-stories.mjs:ssä.
 */
export type DerivedBlock = Extract<Block, { kind: 'artefacts' | 'checks' | 'component' }>;

export default function CaseBlockDerived({ block }: { block: DerivedBlock }) {
  switch (block.kind) {
    case 'artefacts': {
      /* Tila luetaan tiedostoista build-aikana, ei casedatasta.
         Storybook on olemassa vaikkei julkaistu — sitä ei saa
         esittää samana kuin Figmaa, jota ei ole. */
      const artefacts = caseArtefacts();
      return (
        <Reveal>
          <section className="page case__section">
            <h2 className="meta">{block.label}</h2>
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
          </section>
        </Reveal>
      );
    }

    case 'checks': {
      /* Lista johdetaan package.jsonista. Casetekstissä on vain
         otsikko ja johdanto — se mitä tarkistetaan, luetaan sieltä
         missä tarkistukset asuvat. */
      const all = checks();
      const live = all.filter((c) => c.runs).length;
      return (
        <Reveal>
          <section className="page case__section">
            <h2 className="meta">{block.label}</h2>
            <div className="case__section-body">
              <h3 className="display-m case__h">{block.title}</h3>
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
                      <span className="case__check-name">{check.title}</span>
                      <span className="case__check-body">{check.proves}</span>
                      {check.blind ? (
                        <span className="case__check-blind">
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
          </section>
        </Reveal>
      );
    }
    case 'component':
      return (
        <section className="page case__section">
          <h2 className="meta">{block.label}</h2>
          <div className="case__section-body">
            <h3 className="display-m case__h">{block.title}</h3>
            <p className="body-l measure case__p">{block.body}</p>
            {/* Palvelinkomponentti: lukee lähdekoodin build-aikana. */}
            <ListRowShowcase />
          </div>
        </section>
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
        <span className="case__artefact-name">{item.label}</span>
        <span className="case__artefact-body">{item.body}</span>
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
