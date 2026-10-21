import Nosto from '@/components/Nosto';
import Reveal from '@/components/Reveal';
import { getDictionary } from '@/content/dictionaries';

export default function Luonnos() {
  const { home } = getDictionary('fi');
  return (
    <>
      <div style={{ height: 200 }} />
      {(['paneeli', 'jattikoko', 'nauha'] as const).map((t) => (
        <div key={t} id={t}>
          <Nosto tyyli={t} title={home.bandTitle} body={home.bandBody} label={home.heroArt} />
          <div style={{ height: 200 }} />
        </div>
      ))}
    </>
  );
}
