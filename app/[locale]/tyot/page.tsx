import WorkPage from '@/app/_sivut/tyot';
import { kansiolle } from '@/lib/kielireitti';

/* Sisältö on yhteinen kaikille kielille (app/_sivut/tyot.tsx); tämä kansio on osion osoite kielillä, joilla slug on 'tyot'. */
export { generateMetadata } from '@/app/_sivut/tyot';
export default kansiolle('work', 'tyot', WorkPage);
