'use client';

import type { Previous } from '@/content/work';
import type { Dictionary } from '@/content/dictionaries';
import { Accordion, useAccordionGroup } from './Accordion';
import Media, { type Ratio } from './Media';
import BeforeAfter from './BeforeAfter';

/**
 * Aiempi työ. Rivit avautuvat paikallaan — vanhat projektit eivät saa
 * omia sivuja, jotta kaksi kärkicasea pitävät huomion.
 *
 * Vastuut on eroteltu: "Vastuullani" vs. "Osallistuin". Yksi lista
 * olisi lyhyempi mutta epärehellisempi.
 */
export default function PreviousWork({
  items,
  dict,
}: {
  items: Previous[];
  dict: Dictionary;
}) {
  const group = useAccordionGroup();

  return (
    <div className="list-rows">
      {items.map((item) => (
        <Accordion
          key={item.slug}
          number={item.number}
          title={item.title}
          description={item.tagline}
          meta={item.meta}
          open={group.isOpen(item.slug)}
          onToggle={() => group.toggle(item.slug)}
          labels={{ open: dict.work.open, close: dict.work.close }}
        >
          <Detail item={item} dict={dict} />
        </Accordion>
      ))}
    </div>
  );
}

function Detail({ item, dict }: { item: Previous; dict: Dictionary }) {
  const d = item.detail;

  return (
    <div className="detail">
      <div className="detail__head">
        <h3 className="display-m detail__heading">{d.heading}</h3>
        <p className="body-l measure detail__intro">{d.intro}</p>
      </div>

      <div className="detail__role">
        <div className="detail__role-col">
          <h4 className="meta">{dict.common.role}</h4>
          <p className="detail__role-title">{d.roleTitle}</p>
          <p className="body-s detail__role-note">{d.roleNote}</p>
        </div>
        <div className="detail__role-col">
          <h4 className="meta">Vastuullani</h4>
          <ul className="detail__list">
            {d.responsible.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="detail__role-col">
          <h4 className="meta">Osallistuin</h4>
          <ul className="detail__list detail__list--muted">
            {d.contributed.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      <section className="detail__sections">
        <h4 className="meta detail__sections-label">{d.sectionsTitle}</h4>
        <div className="detail__sections-body">
          {d.sections.map((section) => (
            <div key={section.title} className="detail__section">
              <h5 className="detail__section-title">{section.title}</h5>
              <p className="measure detail__section-body">{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      {d.media.length > 0 ? (
        <div className="detail__media">
          {d.media.map((media) =>
            media.kind === 'compare' ? (
              <BeforeAfter
                key={media.caption}
                before="/assets/screen/pivo-ennen.png"
                after="/assets/screen/pivo-jalkeen.png"
                beforeLabel="Ennen"
                afterLabel="Jälkeen"
                alt={media.caption}
                caption={media.caption}
                width={742}
                height={1502}
              />
            ) : (
              <Media
                key={media.caption}
                ratio={media.ratio as Ratio}
                caption={media.caption}
              />
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
