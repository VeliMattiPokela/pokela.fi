import MethodPage from '@/app/_sivut/tyotapa';
import { kansiolle } from '@/lib/kielireitti';

/* Sisältö on yhteinen kaikille kielille (app/_sivut/tyotapa.tsx); tämä kansio on osion osoite kielillä, joilla slug on 'tyotapa'. */
export { generateMetadata } from '@/app/_sivut/tyotapa';
export default kansiolle('method', 'tyotapa', MethodPage);
