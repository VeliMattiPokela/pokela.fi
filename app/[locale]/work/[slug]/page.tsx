import { caseParametrit } from '@/app/_sivut/case';
import { kansionKielet } from '@/lib/kielireitti';

/* Casesivu (app/_sivut/case.tsx) niillä kielillä, joilla töiden osoite on 'work'. */
export { default, generateMetadata } from '@/app/_sivut/case';
export const dynamicParams = false;
export function generateStaticParams() {
  return caseParametrit(kansionKielet('work', 'work'));
}
