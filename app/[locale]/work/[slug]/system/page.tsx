import { systemParametrit } from '@/app/_sivut/system';
import { kansionKielet } from '@/lib/kielireitti';

/* Design system -sivu (app/_sivut/system.tsx) niillä kielillä, joilla töiden osoite on 'work'. */
export { default, generateMetadata } from '@/app/_sivut/system';
export const dynamicParams = false;
export function generateStaticParams() {
  return systemParametrit(kansionKielet('work', 'work'));
}
