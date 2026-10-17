// Vista de una guía (servidor). Mismo diseño para inglés y español; el texto viene de app/lib/guias.
import Link from 'next/link';
import Navbar from './Navbar';
import { CATS, relacionadas, type Guia } from '../lib/guias';

const BASE = 'https://verlyoptical.com';

export function urlGuia(g: Guia, es: boolean) {
  return es ? `/es/guias/${g.slugEs}` : `/guides/${g.slug}`;
}

export default function GuiaVista({ g, es }: { g: Guia; es: boolean }) {
  const d = es ? g.es : g.en;
  const url = BASE + urlGuia(g, es);
  const rel = relacionadas(g);
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', headline: d.t, description: d.d, inLanguage: es ? 'es-US' : 'en-US', mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'Verly Optical' },
        publisher: { '@type': 'Organization', name: 'Verly Optical', logo: { '@type': 'ImageObject', url: `${BASE}/apple-touch-icon.png` } },
      },
      {
        '@type': 'FAQPage',
        mainEntity: d.f.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: es ? 'Inicio' : 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: es ? 'Guías' : 'Guides', item: BASE + (es ? '/es/guias' : '/guides') },
          { '@type': 'ListItem', position: 3, name: d.t, item: url },
        ],
      },
    ],
  };

  const parrafo = (txt: string, k: number) => {
    const lineas = txt.split('\n');
    const lista = lineas.every(l => /^\d+\.\s/.test(l)) && lineas.length > 1;
    if (lista) return <ol key={k}>{lineas.map((l, i) => <li key={i}>{l.replace(/^\d+\.\s/, '')}</li>)}</ol>;
    return <p key={k}>{lineas.map((l, i) => <span key={i}>{l}{i < lineas.length - 1 && <br />}</span>)}</p>;
  };

  return (
    <main className="gv" lang={es ? 'es' : 'en'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <Navbar />
      <article className="gv-wrap">
        <nav className="gv-crumb">
          <Link href={es ? '/es/guias' : '/guides'}>{es ? 'Guías' : 'Guides'}</Link><span>/</span>
          <span>{es ? CATS[g.cat].es : CATS[g.cat].en}</span>
          <Link href={urlGuia(g, !es)} className="gv-lang">{es ? 'Read in English' : 'Leer en español'}</Link>
        </nav>
        <h1>{d.t}</h1>
        <p className="gv-intro">{d.i}</p>

        {d.s.map(([h, txt], i) => (
          <section key={i}>
            <h2>{h}</h2>
            {txt.split('\n\n').map(parrafo)}
          </section>
        ))}

        <section className="gv-faq">
          <h2>{es ? 'Preguntas frecuentes' : 'Frequently asked questions'}</h2>
          {d.f.map(([q, a], i) => (
            <details key={i} open={i === 0}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </section>

        <div className="gv-cta">
          <div>
            <b>{es ? 'Lentes graduados en línea, sin aseguranza' : 'Prescription glasses online, no insurance needed'}</b>
            <span>{es ? 'Armazón y micas con tu graduación, estuche y paño incluidos.' : 'Frame and prescription lenses, with a case and cleaning cloth.'}</span>
          </div>
          <Link href={g.cta}>{es ? 'Ver armazones' : 'Shop frames'} →</Link>
        </div>

        {rel.length > 0 && (
          <section className="gv-rel">
            <h2>{es ? 'También te puede servir' : 'Related guides'}</h2>
            <div>
              {rel.map(r => (
                <Link key={r.slug} href={urlGuia(r, es)}>{es ? r.es.t : r.en.t}</Link>
              ))}
            </div>
          </section>
        )}
        <p className="gv-nota">{es
          ? 'Esta guía es informativa y no sustituye un examen de la vista. Si tienes dolor, pérdida repentina de visión o destellos de luz, acude con un doctor de inmediato.'
          : 'This guide is for information only and does not replace an eye exam. If you have eye pain, sudden vision loss or flashes of light, see a doctor right away.'}</p>
      </article>

      <style>{`
        .gv{background:var(--cream);color:var(--charcoal);min-height:100vh;padding-top:72px}
        .gv-wrap{max-width:760px;margin:0 auto;padding:36px 1.5rem 100px}
        .gv-crumb{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12.5px;color:var(--warm-gray);margin-bottom:18px}
        .gv-crumb a{color:var(--warm-gray);text-decoration:none}
        .gv-crumb .gv-lang{margin-left:auto;color:var(--sage);font-weight:500}
        .gv h1{font-size:clamp(2rem,4vw,2.8rem);font-weight:500;letter-spacing:-.035em;line-height:1.08;margin:0 0 16px}
        .gv-intro{font-size:17px;line-height:1.7;color:#4a463f;margin:0 0 12px}
        .gv h2{font-size:1.35rem;font-weight:600;letter-spacing:-.02em;margin:34px 0 10px}
        .gv p,.gv li{font-size:16px;line-height:1.75;color:#3a3732}
        .gv p{margin:0 0 12px}
        .gv ol{margin:0 0 12px;padding-left:22px}
        .gv li{margin-bottom:6px}
        .gv-faq details{border-bottom:1px solid var(--border);padding:4px 0}
        .gv-faq summary{cursor:pointer;font-weight:500;padding:12px 0;font-size:15.5px}
        .gv-faq details p{margin:0 0 14px}
        .gv-cta{display:flex;align-items:center;justify-content:space-between;gap:18px;background:var(--cream-dark);border-radius:8px;padding:22px 24px;margin:40px 0 0}
        .gv-cta div{display:flex;flex-direction:column;gap:4px}
        .gv-cta b{font-size:16px}
        .gv-cta span{font-size:13.5px;color:var(--warm-gray)}
        .gv-cta a{background:var(--sage);color:#fff;text-decoration:none;border-radius:999px;padding:13px 22px;font-size:14px;font-weight:500;white-space:nowrap}
        .gv-rel > div{display:flex;flex-direction:column;gap:8px}
        .gv-rel a{color:var(--charcoal);text-decoration:none;border-bottom:1px solid var(--border);padding:10px 0;font-size:15px}
        .gv-rel a:hover{color:var(--sage)}
        .gv-nota{font-size:12.5px !important;color:var(--warm-gray) !important;margin-top:32px !important}
        @media (max-width:640px){.gv-cta{flex-direction:column;align-items:flex-start}}
      `}</style>
    </main>
  );
}

export function IndiceGuias({ es, guias }: { es: boolean; guias: Guia[] }) {
  const cats = Object.keys(CATS) as (keyof typeof CATS)[];
  return (
    <main className="gi" lang={es ? 'es' : 'en'}>
      <Navbar />
      <div className="gi-wrap">
        <p className="gi-eye">{es ? 'Guías' : 'Guides'}</p>
        <h1>{es ? 'Todo sobre tus lentes, explicado fácil' : 'Everything about your glasses, made simple'}</h1>
        <p className="gi-sub">{es
          ? 'Cómo leer tu receta, qué micas elegir, cómo medir tu distancia pupilar y más.'
          : 'How to read your prescription, which lenses to choose, how to measure your PD and more.'}
          {' '}<Link href={es ? '/guides' : '/es/guias'}>{es ? 'Read in English' : 'Leer en español'}</Link></p>
        {cats.map(c => {
          const lista = guias.filter(g => g.cat === c);
          if (!lista.length) return null;
          return (
            <section key={c}>
              <h2>{es ? CATS[c].es : CATS[c].en}</h2>
              <div className="gi-grid">
                {lista.map(g => (
                  <Link key={g.slug} href={urlGuia(g, es)}>
                    <b>{es ? g.es.t : g.en.t}</b>
                    <span>{es ? g.es.d : g.en.d}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <style>{`
        .gi{background:var(--cream);color:var(--charcoal);min-height:100vh;padding-top:72px}
        .gi-wrap{max-width:1100px;margin:0 auto;padding:48px 2rem 100px}
        .gi-eye{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--warm-gray);margin:0 0 10px}
        .gi h1{font-size:clamp(2.1rem,4vw,3rem);font-weight:500;letter-spacing:-.035em;margin:0 0 12px}
        .gi-sub{font-size:16px;color:var(--warm-gray);margin:0 0 20px}
        .gi-sub a{color:var(--sage)}
        .gi h2{font-size:1.3rem;font-weight:600;margin:38px 0 14px}
        .gi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}
        .gi-grid a{display:flex;flex-direction:column;gap:6px;text-decoration:none;color:var(--charcoal);background:var(--cream-dark);border-radius:8px;padding:18px 18px 20px;transition:background .2s}
        .gi-grid a:hover{background:#ece7de}
        .gi-grid b{font-size:15.5px;font-weight:600;line-height:1.3}
        .gi-grid span{font-size:13.5px;line-height:1.5;color:var(--warm-gray)}
        @media (max-width:700px){.gi-wrap{padding:32px 1.25rem 80px}}
      `}</style>
    </main>
  );
}
