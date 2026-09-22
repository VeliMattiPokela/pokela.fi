import type { Metadata } from 'next';
import Image from 'next/image';
import { isLocale, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import { getCv } from '@/content/cv';
import PrintCv from '@/components/PrintCv';
import { Grid, Col } from '@/components/Grid';
import Reveal from '@/components/Reveal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).nav.about };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;

  const dict = getDictionary(locale as Locale);
  const cv = getCv(locale as Locale);
  const { about } = dict;

  return (
    <>
      {/* ---- otsikko + muotokuva -------------------------------- */}
      <section className="page section about__top">
        <Grid>
          <Col base={4} sm={8} md={7}>
            <h1 className="display-l about__title">
              {about.titleLines.map((line) => (
                <span key={line} className="about__title-line">
                  {line}
                </span>
              ))}
            </h1>
            {/* Vain paperilla. Painettu CV ilman yhteystietoja on
                hyödytön, ja ruudulla ne ovat napissa ja footerissa
                joista kumpikaan ei tulostu. */}
            <div className="cv-print-only">
              <p className="meta cv-print-only__role">
                {about.printRole} · {dict.footer.location}
              </p>
              <p className="cv-print-only__contact">
                <a href={`mailto:${dict.footer.email}`}>{dict.footer.email}</a>
                {' · '}
                <a href={dict.footer.linkedinUrl}>
                  {dict.footer.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              </p>
            </div>

            <p className="body-l measure about__lede">{about.lede}</p>
            <p className="measure about__body">{about.body}</p>

            <div className="about__actions">
              <a href={`mailto:${dict.footer.email}`} className="btn btn--primary btn--block">
                {about.contact}
              </a>
              <PrintCv label={about.printCv} />
            </div>
          </Col>

          <Col base={4} sm={8} md={4} startMd={9}>
            {/* Muotokuvan tausta on poistettu, joten se piirretään
                suoraan paperille ilman kehystä tai pintaa. */}
            <Image
              src="/assets/portrait.png"
              alt={about.portraitAlt}
              width={1667}
              height={1667}
              className="about__portrait"
              priority
            />
          </Col>
        </Grid>
      </section>

      {/* ---- mitä teen ------------------------------------------ */}
      <Reveal>
        <section className="page section" aria-labelledby="services">
          <h2 id="services" className="meta section-head">
            {about.servicesTitle}
          </h2>
          <div className="about__services">
            {cv.services.map((service) => (
              <div key={service.number} className="about__service">
                <span className="meta">{service.number}</span>
                <h3 className="about__service-title">{service.title}</h3>
                <p className="measure about__service-body">{service.body}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ---- työhistoria ---------------------------------------- */}
      <section className="page section" aria-labelledby="history">
        <div className="section-head">
          <h2 id="history" className="meta">
            {about.historyTitle}
          </h2>
          <span className="meta">{about.historySince}</span>
        </div>

        {cv.jobs.map((job) => (
          <article key={job.period} className="cv-job">
            <div className="cv-job__head">
              <span className="meta">{job.period}</span>
              <h3 className="cv-job__title">{job.title}</h3>
              <span className="body-s cv-job__company">{job.company}</span>
            </div>
            <dl className="cv-job__projects">
              {job.projects.map((project) => (
                <div key={project.name} className="cv-job__project">
                  <dt className="cv-job__project-name">{project.name}</dt>
                  <dd className="body-s cv-job__project-body">{project.body}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}

        <p className="body-s cv-footnote">{cv.jobsFootnote}</p>
      </section>

      {/* ---- työkalut + koulutus -------------------------------- */}
      <section className="page section">
        <Grid>
          <Col base={4} sm={8} md={6} as="div">
            <h2 className="meta section-head">{about.toolsTitle}</h2>
            <dl className="cv-list">
              {cv.tools.map((row) => (
                <div key={row.label} className="cv-list__row">
                  <dt className="cv-list__label">{row.label}</dt>
                  <dd className="cv-list__value">{row.items}</dd>
                </div>
              ))}
            </dl>
          </Col>

          <Col base={4} sm={8} md={6} as="div">
            <h2 className="meta section-head">{about.educationTitle}</h2>
            <dl className="cv-list">
              {cv.education.map((row) => (
                <div key={row.label} className="cv-list__row">
                  <dt className="cv-list__label">{row.label}</dt>
                  <dd className="cv-list__value">{row.items}</dd>
                </div>
              ))}
            </dl>
          </Col>
        </Grid>
      </section>
    </>
  );
}
