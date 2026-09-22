'use client';

/**
 * Tulostusnappi.
 *
 * Sivustolla ei ole CV-PDF:ää eikä sellaista tehdä: se olisi toinen
 * kopio samasta sisällöstä ja eriytyisi sivusta heti kun jompaakumpaa
 * muokataan. Sen sijaan tämä sivu tulostuu CV:ksi, ja selain tekee
 * PDF:n jos lukija haluaa tiedoston.
 *
 * Nappi on `<button>` eikä linkki, koska se ei vie mihinkään.
 * Asiakaskomponentti vain siksi että `window.print()` tarvitsee
 * selaimen — kaikki muu tietoa-sivulla renderöityy palvelimella.
 */
export default function PrintCv({ label }: { label: string }) {
  return (
    <button type="button" className="btn btn--ghost btn--block" onClick={() => window.print()}>
      {label}
    </button>
  );
}
