import AboutPage from '@/app/_sivut/tietoa';
import { kansiolle } from '@/lib/kielireitti';

/* Sisältö on yhteinen kaikille kielille (app/_sivut/tietoa.tsx); tämä kansio on osion osoite kielillä, joilla slug on 'about'. */
export { generateMetadata } from '@/app/_sivut/tietoa';
export default kansiolle('about', 'about', AboutPage);
