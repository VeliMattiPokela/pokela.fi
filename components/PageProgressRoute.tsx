'use client';

import { usePathname } from 'next/navigation';
import PageProgress from './PageProgress';

/** Kytkee sivunvaihdon viivan Next.js:n reitittimeen. */
export default function PageProgressRoute() {
  return <PageProgress path={usePathname()} />;
}
