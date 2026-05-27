import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
}

async function getFrames(filterTag?: string) {
  let query = supabase
    .from("armazones")
    .select("id, nombre, precio, imagen_url, tags, genero")
    .eq("activo", true)
    .limit(8);
  if (filterTag) {
    query = query.contains("tags", [filterTag]);
  }
  const { data } = await query;
  return data ?? [];
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
}: CollectionPageProps) {
  const frames = await getFrames(filterTag);

  return (
    <main style={{ background: "var(--cream)", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>

      {/* HERO */}
      <section style={{ background: "var(--charcoal)", position: "relative", overflow: "hidden", paddingTop: "120px", paddingBottom: "80px" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, #F7F4EF 1px, transparent 0)", backgroundSize: "32px 32px" }}/>
        <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 2rem", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ height: "1px", width: "32px", background: "var(--sage)" }}/>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--sage-light)", margin: 0 }}>{subtitle}</p>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 400, color: "var(--cream)", lineHeight: 0.95, letterSpacing: "-0.02em", margin: "0 0 1.5rem" }}>{heroKeyword}</h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: "var(--warm-gray)", lineHeight: 1.8, maxWidth: "520px", margin: "0 0 2.5rem" }}>{description}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            <Link href="/Tienda" style={{ display: "inline-block", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cream)", background: "var(--sage)", padding: "14px 32px", borderRadius: "2px", textDecoration: "none" }}>
              Shop all frames
            </Link>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--warm-gray)", margin: 0 }}>
              Complete pairs from <strong style={{ color: "var(--cream)" }}>$28</strong>
            </p>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, var(--sage), rgba(74,89,64,0.3), transparent)" }}/>
      </section>

      {/* HIGHLIGHTS */}
      <section style={{ background: "var(--cream-dark)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
          {lensHighlights.map((h) => (
            <div key={h.label} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "22px", color: "var(--sage)" }}>{h.icon}</span>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--charcoal)", margin: 0 }}>{h.label}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--warm-gray)", margin: 0, lineHeight: 1.6 }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FRAMES */}
      <section style={{ maxWidth: "1180px", margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--warm-gray)", margin: "0 0 6px" }}>Featured frames</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 400, color: "var(--charcoal)", margin: 0 }}>
              {frames.length > 0 ? `${frames.length} styles available` : "All frames"}
            </h2>
          </div>
          <Link href="/Tienda" style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--warm-gray)", textDecoration: "none", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px" }}>
            View all
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
          {(frames.length > 0 ? frames : Array.from({ length: 4 }, (_, i) => ({ id: i, nombre: "Browse styles", precio: 28, imagen_url: null }))).map((frame: any) => (
            <Link key={frame.id} href={frame.nombre === "Browse styles" ? "/Tienda" : `/armazon/${frame.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.04)", transition: "all 0.3s ease", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
              >
                <div style={{ aspectRatio: "1", background: "#f5f2ed", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {frame.imagen_url
                    ? <img src={frame.imagen_url} alt={frame.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                    : (
                      <svg width="56" height="32" viewBox="0 0 160 90" fill="none" style={{ opacity: 0.15 }}>
                        <rect x="4" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/>
                        <rect x="92" y="12" width="64" height="66" rx="14" stroke="#1d1d1d" strokeWidth="3"/>
                        <path d="M68 38 C72 32, 88 32, 92 38" stroke="#1d1d1d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                      </svg>
                    )}
                </div>
                <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 400, color: "var(--charcoal)", margin: "0 0 4px" }}>{frame.nombre}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--warm-gray)", margin: 0 }}>From ${frame.precio + 15} complete</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "var(--cream-dark)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--warm-gray)", margin: "0 0 0.75rem", textAlign: "center" }}>Simple process</p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: "var(--charcoal)", textAlign: "center", margin: "0 0 4rem", lineHeight: 1.1 }}>From frame to your door</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "3rem" }}>
            {[
              { step: "01", title: "Choose your frame", desc: "Browse our collection and pick the shape that suits you." },
              { step: "02", title: "Configure your lenses", desc: "Select your vision type, material, and any coatings or filters." },
              { step: "03", title: "Send your prescription", desc: "Upload it at checkout or email it to us. Our opticians verify everything." },
            ].map((s) => (
              <div key={s.step}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--sage)", letterSpacing: "0.15em", margin: "0 0 0.75rem" }}>{s.step}</p>
                <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.25rem" }}/>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 400, color: "var(--charcoal)", margin: "0 0 0.5rem" }}>{s.title}</h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--warm-gray)", lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section style={{ maxWidth: "700px", margin: "0 auto", padding: "5rem 2rem" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--warm-gray)", margin: "0 0 0.75rem" }}>Questions</p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 400, color: "var(--charcoal)", margin: "0 0 2.5rem" }}>Frequently asked</h2>
          <div>
            {faq.map((item) => (
              <details key={item.q} style={{ borderBottom: "1px solid var(--border)" }}>
                <summary style={{ padding: "1.25rem 0", fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 500, color: "var(--charcoal)", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {item.q}
                  <span style={{ color: "var(--sage)", fontSize: "20px", fontWeight: 300, flexShrink: 0, marginLeft: "1rem" }}>+</span>
                </summary>
                <div style={{ padding: "0 0 1.25rem", fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--warm-gray)", lineHeight: 1.8 }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* RELATED */}
      <section style={{ background: "var(--cream-dark)", borderTop: "1px solid var(--border)", padding: "3rem 2rem" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--warm-gray)", margin: "0 0 1.5rem", textAlign: "center" }}>Also explore</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
            {relatedLinks.map((l) => (
              <Link key={l.href} href={l.href} style={{ fontFamily: "var(--font-sans)", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--charcoal)", border: "1px solid var(--border)", padding: "10px 20px", borderRadius: "2px", textDecoration: "none", background: "var(--cream)", transition: "border-color 0.2s ease, color 0.2s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--sage)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--sage)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--charcoal)"; }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--sage)", padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, color: "var(--cream)", margin: "0 0 1rem", lineHeight: 1.1 }}>Complete pair from $28</h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: "rgba(247,244,239,0.7)", margin: "0 0 2.5rem", maxWidth: "400px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
          Frame + lenses included. No hidden fees. Prescription verified by our opticians.
        </p>
        <Link href="/Tienda" style={{ display: "inline-block", fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sage)", background: "var(--cream)", padding: "16px 40px", borderRadius: "2px", textDecoration: "none" }}>
          Find your frames
        </Link>
      </section>

    </main>
  );
}