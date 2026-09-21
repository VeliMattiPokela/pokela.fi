/**
 * Kuvapaikka. Raidoitus tokeneista + metateksti siitä mikä kuva
 * tulee. Ei kehyksiä, ei pyöristystä.
 *
 * Nimi on `Media` eikä `Placeholder`, koska tämä on se paikka johon
 * kuva tulee — raidoitus on sen nykyinen tila, ei sen tarkoitus. Kun
 * oikea kuva on olemassa, se tulee tähän samaan laatikkoon samassa
 * kuvasuhteessa, eikä layout liiku.
 *
 * Kuvasuhteista `hero` on ainoa rooli: se on ainoa jonka suhde
 * muuttuu breakpointeittain (4:5 → 16:9 → 21:9). Loput ovat
 * kiinteitä muotoja, joten ne on nimetty suhteellaan — muuten
 * listassa olisi kaksi eri logiikkaa.
 */
export type Ratio = 'hero' | '4:3' | '4:5' | '3:4' | '1:1';

export default function Media({
  ratio = '4:3',
  caption,
}: {
  ratio?: Ratio;
  caption?: string;
}) {
  return (
    <div
      className={`media media-${ratio.replace(':', '-')}`}
      role="img"
      aria-label={caption ?? ''}
    >
      {caption ? <span className="meta meta--s">{caption}</span> : null}
    </div>
  );
}
