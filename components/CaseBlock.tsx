import type { Block } from '@/content/cases';
import Media from './Media';

/**
 * Kuinka leveänä kuva piirtyy kussakin lohkossa. Lohko tietää sen,
 * kuva ei — siksi `sizes` annetaan täältä eikä oleteta Mediassa.
 *
 * Luvut seuraavat case.css:n gridejä ja --page-paddingia. Liian suuri
 * arvo lataisi turhan ison tiedoston, liian pieni pehmeän kuvan.
 */
const SIZES = {
  /* Koko sisältöleveys: sivu on enintään 1440 ja reunat 36+36. */
  taysi: '(min-width: 1440px) 1368px, (min-width: 900px) calc(100vw - 72px), (min-width: 600px) calc(100vw - 48px), calc(100vw - 40px)',
  /* Kaksi saraketta 600:sta ylöspäin. */
  pari: '(min-width: 1440px) 672px, (min-width: 600px) calc(50vw - 48px), calc(100vw - 40px)',
  /* Kolme saraketta 900:sta, kaksi 600:sta. */
  kolmikko:
    '(min-width: 1440px) 440px, (min-width: 900px) calc(33vw - 48px), (min-width: 600px) calc(50vw - 48px), calc(100vw - 40px)',
};
import Reveal from './Reveal';
import CaseText from './CaseText';
import type { Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';

/**
 * Casen puhtaat lohkot: ne piirtävät sen mitä niille annetaan.
 *
 * Erillään johdetuista lohkoista (CaseBlockDerived) yhdestä syystä:
 * ne lukevat tiedostojärjestelmää build-aikana, eikä `node:fs` toimi
 * selaimessa. Yhdessä tiedostossa koko moduuli kaatuisi storyssä —
 * todennettu, ei arvattu.
 *
 * Jako on samalla rehellinen: lohko joka piirtää annetun datan ja
 * lohko joka lukee totuuden tiedostoista ovat eri asioita. Nyt sen
 * näkee tiedostorakenteesta.
 *
 * Yhdeksän lohkoa, ja niillä kaikilla on story.
 */
export type PureBlock = Extract<
  Block,
  { kind: 'text' | 'media' | 'pair' | 'band' | 'trio' | 'scope' | 'steps' | 'choices' | 'todo' }
>;

export default function CaseBlock({
  block,
  locale,
  slug,
}: {
  block: PureBlock;
  locale: Locale;
  slug: string;
}) {
  const dict = getDictionary(locale);
  switch (block.kind) {
    case 'text':
      return (
        <Reveal>
          <section className="page case__section">
            <h2 className="meta">{block.label}</h2>
            <div className="case__section-body">
              {block.lead ? <h3 className="display-m case__h">{block.lead}</h3> : null}
              {block.items.map((item, i) => {
                /* Otsikkotaso seuraa rakennetta: ilman leadia kappaleen
                   otsikko on h3, sen kanssa h4. Kiinteä h4 hyppäisi
                   tason yli kun leadia ei ole. */
                const Heading = block.lead ? 'h4' : 'h3';
                return (
                  <div key={i} className="case__item">
                    {item.h ? <Heading className="case__item-h">{item.h}</Heading> : null}
                    {item.p ? <p className="body-l measure case__p">{item.p}</p> : null}
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>
      );

    case 'media':
      return (
        <div className="page">
          <Media
            id={block.media.id}
            ratio={block.media.ratio}
            caption={block.media.caption}
            sizes={SIZES.taysi}
            priority={block.media.ratio === 'hero'}
          />
        </div>
      );

    case 'pair':
      return (
        <Reveal>
          <section className="page case__section">
            <h2 className="meta">{block.label ?? ''}</h2>
            <div className="case__pair">
              {block.items.map((media) => (
                <figure key={media.caption} style={{ margin: 0 }}>
                  <Media
                    id={media.id}
                    ratio={media.ratio}
                    caption={media.caption}
                    sizes={SIZES.pari}
                  />
                  {media.label ? (
                    <figcaption className="meta">{media.label}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        </Reveal>
      );

    case 'band':
      return (
        <Reveal>
          <section className="invert bleed case__band">
            <div className="case__band-inner">
              <p className="display-m case__band-title">{block.title}</p>
              <p className="body-l case__band-body">{block.body}</p>
            </div>
          </section>
        </Reveal>
      );

    case 'trio':
      return (
        <Reveal>
          <section className="page case__section">
            <h2 className="meta">{block.label}</h2>
            <div className="case__section-body">
              <h3 className="display-m case__h">{block.title}</h3>
              <div className="case__trio">
                {block.items.map((item) => (
                  <div key={item.h}>
                    <Media
                      id={item.media.id}
                      ratio={item.media.ratio}
                      caption={item.media.caption}
                      sizes={SIZES.kolmikko}
                    />
                    <h4>{item.h}</h4>
                    <p>
                      <CaseText text={item.p} locale={locale} currentSlug={slug} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      );

    case 'scope':
      return (
        <Reveal>
          <section className="page case__section">
            <h2 className="meta">{block.label}</h2>
            <div className="case__section-body">
              <h3 className="display-m case__h">{block.title}</h3>
              <p className="body-l measure case__p">{block.body}</p>
              <ol className="case__scope">
                {block.items.map((item, i) => (
                  <li key={item} className="case__scope-item">
                    <span className="meta">{String(i + 1).padStart(2, '0')}</span>
                    <span className="case__scope-name">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </Reveal>
      );

    case 'steps':
      return (
        <Reveal>
          <section className="page case__section">
            <h2 className="meta">{block.label}</h2>
            <div className="case__section-body">
              <h3 className="display-m case__h">{block.title}</h3>
              <p className="body-l measure case__p">{block.body}</p>
              <ol className="case__scope">
                {block.items.map((item, i) => (
                  <li key={item.h} className="case__scope-item case__scope-item--wide">
                    <span className="meta">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="case__scope-name">{item.h}</span>
                      <span className="case__scope-note">{item.p}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </Reveal>
      );
    case 'choices':
      return (
        <Reveal>
          <section className="page case__section">
            <h2 className="meta">{block.label}</h2>
            <div className="case__section-body">
              <h3 className="display-m case__h">{block.title}</h3>
              <div className="case__pair">
                {block.items.map((item) => (
                  <div key={item.h} className="case__choice">
                    <h4 className="case__choice-title">{item.h}</h4>
                    <p className="case__choice-body">{item.p}</p>
                    <p className="meta case__choice-note">
                      <CaseText text={item.note} locale={locale} currentSlug={slug} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      );
    case 'todo':
      /* Näytetään vain kehityksessä — tuotannossa keskeneräinen
         kohta jätetään pois, ei esitetä paikkamerkkinä. */
      if (process.env.NODE_ENV === 'production') return null;
      return (
        <div className="page case__section">
          <span className="meta">{dict.common.todo}</span>
          <span className="todo">{block.text}</span>
        </div>
      );
  }
}
