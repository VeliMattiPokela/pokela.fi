'use client';

import { useEffect, useState } from 'react';
import { THEME_STORAGE_KEY } from './ThemeScript';

type Theme = 'system' | 'light' | 'dark';

/**
 * Teemanvaihto tekstinappina — ei ikonia, ei väriä.
 * Kierto: järjestelmä → vaalea → tumma → järjestelmä.
 *
 * `data-theme` puuttuu kun valinta on "järjestelmä", jolloin
 * tokens.css:n light-dark() seuraa prefers-color-schemeä.
 */
export default function ThemeToggle({
  labels,
}: {
  labels: { theme: string; light: string; dark: string; system: string };
}) {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') setTheme(stored);
    } catch {
      /* private mode — pidetään järjestelmän teema */
    }
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    const root = document.documentElement;
    if (next === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', next);
    try {
      if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* valinta jää tälle sivulataukselle */
    }
  }

  const order: Theme[] = ['system', 'light', 'dark'];
  const label = { system: labels.system, light: labels.light, dark: labels.dark }[theme];

  return (
    <button
      type="button"
      className="meta meta--s nav__toggle"
      onClick={() => apply(order[(order.indexOf(theme) + 1) % order.length])}
      aria-label={`${labels.theme}: ${label}`}
      /* Ennen hydraatiota näytetään neutraali merkintä, jottei
         palvelimen ja selaimen tila eroa toisistaan. */
      suppressHydrationWarning
    >
      {mounted ? label : labels.theme}
    </button>
  );
}
