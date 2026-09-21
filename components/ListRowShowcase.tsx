import { readCodeConnect, readSource, readStories, readTokenGroups } from '@/lib/source';
import { componentArtefacts } from '@/lib/artefacts';
import { highlight } from '@/lib/highlight';
import ComponentView, { CodeBlock, FactList } from './ComponentView';
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

export default async function ListRowShowcase() {
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

  const { groups: tokenGroups, total: tokenCount } = readTokenGroups(SOURCES.style);
  /* Tila johdetaan tiedostoista: Storybook on olemassa vaikkei sitä
     ole vielä julkaistu, eikä sitä saa esittää samana kuin Figmaa,
     jota ei ole. */
  const artefacts = componentArtefacts(SOURCES.story);
  /* Varianttien ja propsien nimet luetaan kytkennästä, koska siellä
     ne ovat siinä muodossa jota Figma oikeasti käyttää. */
  const connect = readCodeConnect(SOURCES.connect);
  const stories = readStories(SOURCES.story);

  return (
    <ComponentView
      label="Listarivi neljästä suunnasta"
      tabs={[
        {
          id: 'nakyma',
          label: 'Näkymä',
          content: (
            <>
              <div className="list-rows cview__demo">
                <ListRow
                  title="Colliers Asunnot"
                  description="Vuokra-asuntopalvelu, joka suunniteltiin koodissa"
                  meta="Design, front end, CMS"
                  href="/fi/tyot/colliers/"
                />
                {/* Keskimmäinen rivi näyttää käännetyn tilan staattisena
                    `invert`-utilitylla — samat tokenit kuin hoverissa,
                    ei omaa sääntöä. Kosketuslaitteella hoveria ei ole. */}
                <ListRow
                  title="Blokbook"
                  description="Oman taloyhtiön ongelmasta myytäväksi palveluksi"
                  meta="Hover / :active — käännetty"
                  href="/fi/tyot/blokbook/"
                  className="invert"
                />
                <ListRow
                  title="Tämä sivusto"
                  description="Yksi lähde, kaksi suuntaa"
                  meta="Design system, Storybook, Figma"
                  href="/fi/tyot/tama-sivusto/"
                />
              </div>

              <FactList
                items={[
                  {
                    label: 'Tilat',
                    value:
                      'Perustila · osoitin rivin päällä · näppäimistöfokus · painallus kosketusnäytöllä',
                  },
                  {
                    label: 'Koot',
                    value: 'Alle 600 px pinottu, siitä ylöspäin yksi rivi',
                  },
                  {
                    label: 'Käytössä',
                    value: 'Etusivu · työlistaus · aiempi työ · tämä näkymä',
                  },
                ]}
              />

              {/* Ryhmittely tulee token-nimien etuliitteistä: paljas
                  22 nimen lista ei kertoisi lukijalle mitään. */}
              <div className="cview__states">
                <h4 className="meta">
                  Mitä komponentti säätää — {tokenCount} tokenia, ei yhtään kovakoodattua arvoa
                </h4>
                <dl className="cview__facts">
                  {tokenGroups.map((group) => (
                    <div key={group.label} className="cview__fact">
                      <dt className="meta">
                        {group.label} ({group.tokens.length})
                      </dt>
                      <dd className="cview__fact-value cview__tokens">
                        {group.tokens.map((token) => (
                          <code key={token} className="cview__token">
                            {token}
                          </code>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="body-s cview__note">
                Lista luetaan komponentin omasta tyylitiedostosta aina kun sivusto käännetään. Jos
                komponentti alkaa käyttää uutta tokenia, se ilmestyy tähän itsestään — eikä tätä
                sivua tarvitse muistaa päivittää.
              </p>
            </>
          ),
        },

        {
          id: 'koodi',
          label: 'Koodi',
          content: (
            <>
              <CodeBlock
                path={componentSrc.path}
                html={componentHtml}
                lines={componentSrc.lines}
              />
              <CodeBlock
                path={styleSrc.path}
                html={styleHtml}
                lines={styleSrc.lines}
                note="Ei kovakoodattuja arvoja: jokainen väri, väli ja viiva tulee tokenista — siksi tumma teema ei vaadi omaa sääntöä. Kosketuslohko on tiedoston lopussa, jotta se voittaa hover-säännöt kaskadissa."
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
                path={storySrc.path}
                html={storyHtml}
                lines={storySrc.lines}
                note="Story ei ole dokumentaatiota komponentista. Se on komponentti — sama tiedosto jota tämä sivu importoi, eri tiloissa."
              />

              {/* Kuvaukset luetaan storyjen omista kommenteista, ei
                  muuttujanimistä: `VainNimi` ei kerro lukijalle mitään. */}
              <div className="cview__states">
                <h4 className="meta">Tilat joita ylläpidetään ({stories.length})</h4>
                <ol className="cview__state-list">
                  {stories.map((story, i) => (
                    <li key={story.name} className="cview__state">
                      <span className="meta meta--s cview__state-num">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="cview__state-text">{story.description}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="body-s cview__note">
                Jokainen tila avataan oikeassa selaimessa ja tarkistetaan koneellisesti aina kun
                sivustoa julkaistaan. Jos kontrasti, kosketuskohteen koko tai ruudunlukijan näkemä
                nimi rikkoutuu yhdessäkin tilassa, julkaisu pysähtyy siihen.
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
                  <h4 className="meta">Komponentti Figmassa</h4>
                  <FactList
                    items={[
                      { label: 'Nimi', value: <code>ListRow</code> },
                      ...connect.variants.map((variant) => ({
                        label: `Variantti: ${variant.name}`,
                        value: variant.values.join(' · '),
                      })),
                      {
                        label: 'Variantti: Breakpoint',
                        value:
                          'base · sm+ — @media-katko, ei propsi, joten sitä ei kartoiteta koodiin.',
                      },
                      {
                        /* Enumit ovat variantteja, eivät propseja — ne on listattu jo yllä. */
                        label: 'Propsit',
                        value: connect.props
                          .filter((prop) => prop.kind !== 'enum')
                          .map((prop) => prop.figma)
                          .join(' · '),
                      },
                      {
                        label: `Tokenit tässä komponentissa (${tokenCount})`,
                        value: 'Samat nimet Figmassa kuin koodissa — ei käännöstaulukkoa.',
                      },
                    ]}
                  />
                  <p className="body-s cview__note">
                    Variantit ja propsit luetaan kytkentätiedostosta, ei kirjoiteta tähän: siellä
                    ne ovat siinä muodossa jota Figma oikeasti käyttää. Jos kytkentä muuttuu, tämä
                    lista muuttuu mukana.
                  </p>
                </div>

                <div>
                  <h4 className="meta">Code Connect -kytkentä</h4>
                  <CodeBlock
                    path={SOURCES.connect}
                    html={connectHtml}
                    lines={connectSrc.lines}
                  />
                  <p className="body-s cview__note">
                    Tämä on repon tiedosto sellaisenaan, ei esimerkki. Se kertoo Figmalle mikä
                    koodikomponentti vastaa mitä, jolloin Dev Mode näyttää suunnittelijalle oikean
                    käyttötavan arvatun rakenteen sijaan. Kytkennän eheyden tarkistaa{' '}
                    <code>check:code-connect</code> jokaisessa buildissa.
                  </p>
                </div>
              </div>
            </>
          ),
        },
      ]}
      links={artefacts}
    />
  );
}
