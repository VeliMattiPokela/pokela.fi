'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Reveal: 12px nousu + häivytys kerran, kun lohko tulee näkyviin.
 *
 * prefers-reduced-motion hoidetaan CSS:ssä (.reveal-säännöt ovat
 * no-preference-median sisällä), joten tämä ei tarvitse omaa
 * haaraa — luokka vain ei tee mitään jos liikettä ei haluta.
 */
export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;
    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [shown]);

  return (
    <div ref={ref} className={shown ? 'reveal is-in' : 'reveal'}>
      {children}
    </div>
  );
}
