import Link from "next/link";
import Navbar from "./Navbar";
import { createClient } from "@supabase/supabase-js";

// Componente de SERVIDOR (nunca se envía al navegador): usa la service key para
// leer el catálogo sin depender de las políticas RLS. La llave no se expone.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface CollectionPageProps {
  title: string;
  subtitle: string;
  description: string;
  heroKeyword: string;
  lensHighlights: { icon: string; label: string; desc: string }[];
  faq: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
  filterTag?: string;
  nombres?: string[];
}

async function getFrames(filterTag?: string, nombres?: string[]) {
  let query = supabase
    .from("armazones")
    .select("id, nombre, precio, imagen_url, genero")
    .eq("activo", true).eq("publicar_verly", true);
  if (nombres && nombres.length) {
    query = query.in("nombre", nombres);
  } else {
    query = query.limit(8);
  }
  const { data } = await query;
  let frames = data ?? [];
  // Respeta el orden exacto pedido cuando se filtró por nombres.
  if (nombres && nombres.length) {
    frames = [...frames].sort((a, b) => nombres.indexOf(a.nombre) - nombres.indexOf(b.nombre));
  }
  return frames;
}

export default async function CollectionPage({
  title,
  subtitle,
  description,
  heroKeyword,
  lensHighlights,
  faq,
  relatedLinks,
  filterTag,
  nombres,
}: CollectionPageProps) {
  const frames = await getFrames(filterTag, nombres);
  const displayFrames = frames.length > 0
    ? frames
    : Array.from({ length: 4 }, (_, i) => ({ id: i, nombre: "Browse styles", precio: 13, imagen_url: null }));

  // Imagen de portada según la colección (estilo editorial de la portada principal)
  const t = title.toLowerCase();
  const hero = t.includes("blue") ? { img: "/promo/luz-azul.jpg", oscuro: true, pos: "78% center" }
    : t.includes("progressive") ? { img: "/promo/progresivos.jpg", oscuro: false, pos: "80% center" }
    : t.includes("bifocal") ? { img: "/promo/progresivos.jpg", oscuro: false, pos: "80% center" }
    : t.includes("photochromic") ? { img: "/home/hero.jpg", oscuro: false, pos: "right center" }
    : t.includes("women") ? { img: "/home/forma-cateye.jpg", oscuro: false, pos: "center" }
    : t.includes("men") ? { img: "/home/forma-rectangulares.jpg", oscuro: false, pos: "center" }
    : { img: "/home/hero.jpg", oscuro: false, pos: "right center" };

  return (
    <main className="vc">
      <Navbar />

      {/* PORTADA */}
      <section className={`vc-hero ${hero.oscuro ? "oscuro" : ""}`}>
        <img src={hero.img} alt="" style={{ objectPosition: hero.pos }} />
        <div className="vc-hero-tx">
          <p className="vc-eye">{subtitle}</p>
          <h1>{heroKeyword}</h1>
          <p>{description}</p>
          <Link href="/Tienda" className="vc-btn">Shop all frames →</Link>
        </div>
      </section>

      {/* PUNTOS CLAVE (sin íconos) */}
      <section className="vc-wrap vc-high">
        {lensHighlights.map((h) => (
          <div key={h.label}><b>{h.label}</b><span>{h.desc}</span></div>
        ))}
      </section>

      {/* ARMAZONES */}
      <section className="vc-wrap vc-sec">
        <div className="vc-head">
          <div>
            <p className="vc-eye">Featured frames</p>
            <h2>{frames.length > 0 ? `${frames.length} styles available` : "All frames"}</h2>
          </div>
          <Link href="/Tienda" className="vc-link">View all frames →</Link>
        </div>
        <div className="vc-grid">
          {displayFrames.map((frame: any) => (
            <Link key={frame.id} href={frame.nombre === "Browse styles" ? "/Tienda" : `/armazon/${frame.id}`} className="vc-prod">
              <div className="vc-prod-img">
                {frame.imagen_url
                  ? <img src={frame.imagen_url} alt={frame.nombre} />
                  : <span style={{ opacity: .25, fontSize: 13 }}>Verly</span>}
              </div>
              <b>{frame.nombre}</b>
              <span>${frame.precio}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="vc-wrap vc-sec">
        <p className="vc-eye">How it works</p>
        <h2>From frame to your door</h2>
        <div className="vc-pasos">
          {[
            { step: "01", title: "Choose your frame", desc: "Browse our collection and pick the shape that suits you." },
            { step: "02", title: "Choose your lenses", desc: "Vision type, material and coatings like blue light or photochromic." },
            { step: "03", title: "Send your prescription", desc: "Upload a photo or type the numbers. Our opticians check everything." },
          ].map((s) => (
            <div key={s.step}><span>{s.step}</span><b>{s.title}</b><p>{s.desc}</p></div>
          ))}
        </div>
      </section>

      {/* PREGUNTAS */}
      {faq.length > 0 && (
        <section className="vc-wrap vc-sec vc-faq">
          <p className="vc-eye">Questions</p>
          <h2>Frequently asked</h2>
          <div>
            {faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}<span>+</span></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* RELACIONADOS */}
      <section className="vc-wrap vc-rel">
        <p className="vc-eye">Also explore</p>
        <div>
          {relatedLinks.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
        </div>
      </section>

      <style>{`
        .vc{background:var(--cream);min-height:100vh;color:var(--charcoal);padding-top:72px}
        .vc-wrap{max-width:1280px;margin:0 auto;padding-left:2.5rem;padding-right:2.5rem}
        .vc-eye{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--warm-gray);margin:0 0 10px}
        .vc h2{font-size:clamp(1.8rem,3vw,2.6rem);font-weight:500;letter-spacing:-.03em;line-height:1.05;margin:0}
        .vc-hero{position:relative;overflow:hidden;background:var(--cream-dark)}
        .vc-hero img{display:block;width:100%;height:clamp(380px,36vw,560px);object-fit:cover}
        .vc-hero-tx{position:absolute;top:50%;transform:translateY(-50%);left:max(2.5rem,calc((100vw - 1280px)/2 + 2.5rem));max-width:460px}
        .vc-hero h1{font-size:clamp(2.4rem,4.4vw,4rem);font-weight:500;letter-spacing:-.035em;line-height:1.02;margin:0 0 14px}
        .vc-hero-tx > p:not(.vc-eye){font-size:15px;line-height:1.65;color:#4a463f;margin:0 0 24px}
        .vc-hero.oscuro{color:#fff}
        .vc-hero.oscuro .vc-eye,.vc-hero.oscuro .vc-hero-tx > p{color:rgba(255,255,255,.8)}
        .vc-btn{display:inline-block;background:var(--sage);color:#fff;padding:14px 26px;border-radius:999px;font-size:14px;font-weight:500;text-decoration:none}
        .vc-hero.oscuro .vc-btn{background:#fff;color:var(--charcoal)}
        .vc-high{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px;padding-top:36px;padding-bottom:36px;border-bottom:1px solid var(--border)}
        .vc-high div{display:flex;flex-direction:column;gap:4px}
        .vc-high b{font-size:14.5px;font-weight:600}
        .vc-high span{font-size:13px;line-height:1.55;color:var(--warm-gray)}
        .vc-sec{padding-top:80px}
        .vc-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:28px}
        .vc-link{font-size:13px;font-weight:500;color:var(--charcoal);text-decoration:none;border-bottom:1px solid currentColor;padding-bottom:2px;white-space:nowrap}
        .vc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .vc-prod{text-decoration:none;color:var(--charcoal);display:flex;flex-direction:column;gap:4px}
        .vc-prod-img{aspect-ratio:4/3;background:var(--foto-bg);border-radius:4px;overflow:hidden;margin-bottom:10px;display:flex;align-items:center;justify-content:center}
        .vc-prod-img img{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;transform:scale(1.08);transition:transform .5s ease}
        .vc-prod:hover .vc-prod-img img{transform:scale(1.13)}
        .vc-prod b{font-size:15px;font-weight:500}
        .vc-prod > span{font-size:13px;color:var(--warm-gray)}
        .vc-pasos{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:32px}
        .vc-pasos div{border-top:1px solid var(--border);padding-top:20px}
        .vc-pasos span{font-size:12px;font-weight:600;letter-spacing:.12em;color:var(--sage)}
        .vc-pasos b{display:block;font-size:16px;font-weight:600;margin:8px 0 6px}
        .vc-pasos p{font-size:13.5px;line-height:1.6;color:var(--warm-gray);margin:0}
        .vc-faq > div{margin-top:24px;border-top:1px solid var(--border)}
        .vc-faq details{border-bottom:1px solid var(--border)}
        .vc-faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:16px;padding:18px 0;font-size:15px;font-weight:500}
        .vc-faq summary::-webkit-details-marker{display:none}
        .vc-faq summary span{color:var(--sage);font-size:20px;font-weight:300}
        .vc-faq details p{margin:0 0 18px;font-size:14px;line-height:1.7;color:var(--warm-gray)}
        .vc-rel{padding-top:72px;padding-bottom:100px;text-align:center}
        .vc-rel > div{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:8px}
        .vc-rel a{font-size:13px;color:var(--charcoal);border:1px solid var(--border);padding:10px 18px;border-radius:999px;text-decoration:none;transition:border-color .2s}
        .vc-rel a:hover{border-color:var(--charcoal)}
        @media (max-width:900px){
          .vc-wrap{padding-left:1.25rem;padding-right:1.25rem}
          .vc-hero img{height:460px}
          .vc-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(253,252,250,.95),rgba(253,252,250,.75) 50%,rgba(253,252,250,0) 85%)}
          .vc-hero.oscuro::after{background:linear-gradient(to bottom,rgba(6,28,70,.9),rgba(6,28,70,.6) 55%,rgba(6,28,70,0) 85%)}
          .vc-hero-tx{top:28px;transform:none;left:1.25rem;right:1.25rem;z-index:1}
          .vc-grid{grid-template-columns:1fr 1fr;gap:12px}
          .vc-pasos{grid-template-columns:1fr;gap:20px}
          .vc-sec{padding-top:56px}
          .vc-head{flex-direction:column;align-items:flex-start}
        }
      `}</style>
    </main>
  );
}
