import Link from 'next/link';
import type { Block } from '@/content/cases';
import Media from './Media';
import Reveal from './Reveal';
import ListRowShowcase from './ListRowShowcase';
import { caseArtefacts } from '@/lib/artefacts';
import CaseText from './CaseText';
import type { Locale } from '@/lib/i18n';
import Icon from './Icon';

/**
 * Casen lohkot. Yksi lohkotyyppi = yksi Design Systemin komponentti,
 * joten uusi case ei tuo mukanaan uutta layoutia.
 *
 * `todo` näkyy vain kehityksessä: tuotannossa täydentämätön kohta
 * jätetään mieluummin pois kuin näytetään keskeneräisenä.
 */
export default function CaseBlocks({
  blocks,
  locale,
  slug,
}: {
  blocks: Block[];
  locale: Locale;
  /** Nykyinen case: sen omiin mainintoihin ei linkitetä. */
  slug: string;
}) {
  return (
    <>
      {blocks.map((block, index) => (
        <CaseBlock key={index} block={block} locale={locale} slug={slug} />
      ))}
    </>
  );
}

function CaseBlock({ block, locale, slug }: { block: Block; locale: Locale; slug: string }) {
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
          <Media ratio={block.media.ratio} caption={block.media.caption} />
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
                  <Media ratio={media.ratio} caption={media.caption} />
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
                    <Media ratio={item.media.ratio} caption={item.media.caption} />
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

    case 'todo':
      /* Näytetään vain kehityksessä — tuotannossa keskeneräinen
         kohta jätetään pois, ei esitetä paikkamerkkinä. */
      if (process.env.NODE_ENV === 'production') return null;
      return (
        <div className="page case__section">
          <span className="meta">Täydennettävä</span>
          <span className="todo">{block.text}</span>
        </div>
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

export function CaseNext({
  href,
  label,
  title,
}: {
  href: string;
  label: string;
  title: string;
}) {
  return (
    <div className="page">
      <Link href={href} className="case__next">
        <span className="meta">{label}</span>
        <span className="case__next-title">{title} →</span>
      </Link>
    </div>
  );
}
