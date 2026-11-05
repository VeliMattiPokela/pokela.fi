import Link from 'next/link';
import { readCodeConnect, readSource, readStories, readTokenGroups } from '@/lib/source';
import { highlight } from '@/lib/highlight';
import ComponentView, { CodeBlock, FactList } from './ComponentView';
import { getDictionary } from '@/content/dictionaries';
import { path, type Locale } from '@/lib/i18n';
import { getWork } from '@/content/work';
import ListRow from './ListRow';

/**
 * Listarivi neljästä suunnasta: näkymä, koodi, story, Figma.
 *
 * Palvelinkomponentti — koodi luetaan ja korostetaan build-aikana,
 * joten selaimeen menee valmista HTML:ää eikä koodi voi erota siitä
 * mitä sivusto oikeasti ajaa.
 *
 * Kaikki listat (tokenit, tilat, storyt) johdetaan lähdetiedostoista.
 * Yhtäkään niistä ei ole kirjoitettu käsin.
 */

const SOURCES = {
  component: 'components/ListRow.tsx',
  style: 'styles/components/list-row.css',
  story: 'components/ListRow.stories.tsx',
  connect: 'components/ListRow.figma.ts',
} as const;

export default async function ListRowShowcase({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  /* Näyterivit luetaan sisällöstä eikä kirjoiteta tähän: muuten sama
     teksti eläisi kahdessa paikassa ja osoitteet olisivat lukossa
     yhteen kieleen. */
  const leads = getWork(locale).leads;
  /* Koko tiedosto, ei otetta: paneeli vierittää. Piilotettu pätkä
     herättäisi kysymyksen siitä mitä muuta siellä on — ja tämän
     casen argumentti on nimenomaan että kaiken voi tarkistaa. */
  const componentSrc = readSource(SOURCES.component, 'tsx');
  const styleSrc = readSource(SOURCES.style, 'css');
  const storySrc = readSource(SOURCES.story, 'tsx');
  const connectSrc = readSource(SOURCES.connect, 'ts');

  const [componentHtml, styleHtml, storyHtml, connectHtml] = await Promise.all([
    highlight(componentSrc.code, 'tsx'),
    highlight(styleSrc.code, 'css'),
    highlight(storySrc.code, 'tsx'),
    highlight(connectSrc.code, 'ts'),
  ]);

  const { total: tokenCount } = readTokenGroups(SOURCES.style);
  /* Varianttien ja propsien nimet luetaan kytkennästä, koska siellä
     ne ovat siinä muodossa jota Figma oikeasti käyttää. */
  const connect = readCodeConnect(SOURCES.connect);
  const stories = readStories(SOURCES.story);

  return (
    <ComponentView
      label={dict.showcase.label}
      tabs={[
        {
          id: 'nakyma',
          label: dict.showcase.tabView,
          content: (
            <>
              <div className="list-rows cview__demo">
                <ListRow
                  as={Link}
                  title={leads[0].title}
                  description={leads[0].tagline}
                  meta={leads[0].meta}
                  href={path(locale, 'work', leads[0].slug)}
                />
                {/* Keskimmäinen rivi näyttää avatun rivin käännetyn tilan
                    staattisena `invert`-utilitylla. Hover on hillitympi
                    (badge-surface), joten sitä ei näytetä tässä. */}
                <ListRow
                  as={Link}
                  title={leads[1].title}
                  description={leads[1].tagline}
                  meta={dict.showcase.hoverDemo}
                  href={path(locale, 'work', leads[1].slug)}
                  className="invert"
                />
                <ListRow
                  as={Link}
                  title={leads[2].title}
                  description={leads[2].tagline}
                  meta={leads[2].meta}
                  href={path(locale, 'work', leads[2].slug)}
                />
              </div>

              <FactList
                items={[
                  {
                    label: dict.showcase.states,
                    value: dict.showcase.statesValue,
                  },
                  {
                    label: dict.showcase.sizes,
                    value: dict.showcase.sizesValue,
                  },
                  {
                    label: dict.showcase.usedIn,
                    value: dict.showcase.usedInValue,
                  },
                ]}
              />

              <p className="meta cview__states">
                {dict.showcase.tokenNote.replace('{n}', String(tokenCount))}
              </p>
            </>
          ),
        },

        {
          id: 'koodi',
          label: dict.showcase.tabCode,
          content: (
            <>
              <CodeBlock
                linesLabel={dict.showcase.lines}
                path={componentSrc.path}
                html={componentHtml}
                lines={componentSrc.lines}
              />
              <CodeBlock
                linesLabel={dict.showcase.lines}
                path={styleSrc.path}
                html={styleHtml}
                lines={styleSrc.lines}
                note={dict.showcase.styleNote}
              />
            </>
          ),
        },

        {
          id: 'storybook',
          label: 'Storybook',
          content: (
            <>
              <CodeBlock
                linesLabel={dict.showcase.lines}
                path={storySrc.path}
                html={storyHtml}
                lines={storySrc.lines}
                note={dict.showcase.storyNote}
              />

              {/* Kuvaukset luetaan storyjen omista kommenteista, ei
                  muuttujanimistä: `VainNimi` ei kerro lukijalle mitään. */}
              <div className="cview__states">
                <h4 className="meta">{dict.showcase.storiesTitle.replace('{n}', String(stories.length))}</h4>
                <ol className="cview__state-list">
                  {stories.map((story, i) => (
                    <li key={story.name} className="cview__state">
                      <span className="meta meta--s cview__state-num">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="body-s ink cview__state-text">{story.description}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="body-s cview__note">
                {dict.showcase.storiesNote}
              </p>
            </>
          ),
        },

        {
          id: 'figma',
          label: 'Figma',
          content: (
            <>
              <div className="cview__split">
                <div>
                  <h4 className="meta">{dict.showcase.figmaHeading}</h4>
                  <FactList
                    items={[
                      { label: dict.showcase.name, value: <code>ListRow</code> },
                      ...connect.variants.map((variant) => ({
                        label: `${dict.showcase.variant}: ${variant.name}`,
                        value: variant.values.join(' · '),
                      })),
                      {
                        label: `${dict.showcase.variant}: Breakpoint`,
                        value: dict.showcase.breakpointValue,
                      },
                      {
                        /* Enumit ovat variantteja, eivät propseja — ne on listattu jo yllä. */
                        label: dict.showcase.props,
                        value: connect.props
                          .filter((prop) => prop.kind !== 'enum')
                          .map((prop) => prop.figma)
                          .join(' · '),
                      },
                      {
                        label: dict.showcase.tokensLabel.replace('{n}', String(tokenCount)),
                        value: dict.showcase.tokensValue,
                      },
                    ]}
                  />
                  <p className="body-s cview__note">
                    {dict.showcase.variantsNote}
                  </p>
                </div>

                <div>
                  <h4 className="meta">{dict.showcase.codeConnectHeading}</h4>
                  <CodeBlock
                    linesLabel={dict.showcase.lines}
                    path={SOURCES.connect}
                    html={connectHtml}
                    lines={connectSrc.lines}
                  />
                  <p className="body-s cview__note">
                    {dict.showcase.connectNote}{' '}
                    <code>check:code-connect</code> {dict.showcase.connectNoteEnd}
                  </p>
                </div>
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
