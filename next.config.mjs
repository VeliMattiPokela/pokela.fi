/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  /* Next kirjoittaa muuten juureen AGENTS.md- ja CLAUDE.md-tiedostot
     omista konventioistaan. Ne ovat työkalun ohjeita, eivät tämän
     projektin dokumentaatiota, eivätkä kuulu repoon jonka tarkoitus
     on olla luettava. */
  agentRules: false,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
