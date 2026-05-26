// app/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "./LanguageContext";
import { useCart } from "../context/CartContext";
import { useFavoritos } from "../context/FavoritosContext";
import CartDrawer from "./CartDrawer";
import FavoritosDrawer from "./FavoritosDrawer";

function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-sans)", fontSize: "0.65rem", fontWeight: lang === l ? 600 : 400,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: lang === l ? "var(--charcoal)" : "var(--warm-gray)",
            padding: "4px 6px", transition: "color 0.2s ease",
            borderBottom: lang === l ? "1px solid var(--charcoal)" : "1px solid transparent",
          }}
        >{l}</button>
      ))}
    </div>
  );
}

function FavoritosIcon() {
  const { totalFavoritos, setFavoritosOpen } = useFavoritos();
  return (
    <button
      onClick={() => setFavoritosOpen(true)}
      style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--charcoal)", transition: "color 0.2s ease" }}
      aria-label="Favorites"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={totalFavoritos > 0 ? "var(--sage)" : "none"} stroke={totalFavoritos > 0 ? "var(--sage)" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {totalFavoritos > 0 && (
        <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "var(--sage)", color: "white", borderRadius: "50%", width: "16px", height: "16px", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>
          {totalFavoritos > 9 ? '9+' : totalFavoritos}
        </span>
      )}
    </button>
  );
}

function CartIcon() {
  const { totalItems, setCartOpen } = useCart();
  return (
    <button
      onClick={() => setCartOpen(true)}
      style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--charcoal)", transition: "color 0.2s ease" }}
      aria-label="Cart"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      {totalItems > 0 && (
        <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "#55624c", color: "white", borderRadius: "50%", width: "16px", height: "16px", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { href: "/Tienda", label: "Eyeglasses" },
    { href: "/sunglasses", label: "Sunglasses" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <CartDrawer />
      <FavoritosDrawer />

      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "background 0.4s ease, box-shadow 0.4s ease", background: scrolled ? "rgba(247, 244, 239, 0.92)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", boxShadow: scrolled ? "0 1px 0 var(--border)" : "none" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem", height: scrolled ? "60px" : "68px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "height 0.4s ease" }}>

          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <img src="/logo-trasparente.png" alt="Verly Optical" style={{ height: scrolled ? "32px" : "38px", width: "auto", transition: "height 0.4s ease", objectFit: "contain" }}/>
          </Link>

          <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="nav-link" style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: isActive(href) ? "var(--sage)" : "var(--charcoal)", textDecoration: "none", position: "relative", paddingBottom: "2px", transition: "color 0.2s ease" }}>
                {label}
                <span className="nav-underline" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "var(--sage)", transform: isActive(href) ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.3s ease" }}/>
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <LangSwitcher />
            <FavoritosIcon />
            <CartIcon />
            <Link href="/Tienda" className="cta-btn desktop-nav" style={{ fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cream)", background: "var(--charcoal)", padding: "0.55rem 1.25rem", borderRadius: "2px", textDecoration: "none", transition: "background 0.2s ease", whiteSpace: "nowrap" }}>
              Shop Now
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="hamburger" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-end" }}>
              <span style={{ display: "block", width: "22px", height: "1px", background: "var(--charcoal)", transition: "transform 0.3s ease, opacity 0.3s ease", transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }}/>
              <span style={{ display: "block", width: "16px", height: "1px", background: "var(--charcoal)", transition: "transform 0.3s ease, opacity 0.3s ease", opacity: menuOpen ? 0 : 1 }}/>
              <span style={{ display: "block", width: "22px", height: "1px", background: "var(--charcoal)", transition: "transform 0.3s ease, opacity 0.3s ease", transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}/>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "var(--cream)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "all" : "none", transition: "opacity 0.35s ease" }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {navLinks.map(({ href, label }, i) => (
            <Link key={href} href={href} style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 10vw, 4rem)", fontWeight: 300, color: isActive(href) ? "var(--sage)" : "var(--charcoal)", textDecoration: "none", borderBottom: "1px solid var(--border)", paddingBottom: "1rem", paddingTop: i === 0 ? 0 : "1rem", letterSpacing: "-0.01em", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(16px)", transition: `opacity 0.4s ease ${i * 0.08 + 0.1}s, transform 0.4s ease ${i * 0.08 + 0.1}s` }}>
              {label}
            </Link>
          ))}
          <Link href="/Tienda" style={{ marginTop: "2.5rem", fontFamily: "var(--font-sans)", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cream)", background: "var(--charcoal)", padding: "1rem 2rem", textDecoration: "none", textAlign: "center", borderRadius: "2px", opacity: menuOpen ? 1 : 0, transition: "opacity 0.4s ease 0.35s" }}>
            Shop Now
          </Link>
          <div style={{ marginTop: "2rem", opacity: menuOpen ? 1 : 0, transition: "opacity 0.4s ease 0.4s" }}>
            <LangSwitcher />
          </div>
        </nav>
        <p style={{ position: "absolute", bottom: "2.5rem", left: "2rem", fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--warm-gray)" }}>Verly Optical</p>
      </div>

      <style jsx global>{`
        .nav-link:hover span.nav-underline { transform: scaleX(1) !important; }
        .nav-link:hover { color: var(--sage) !important; }
        .cta-btn:hover { background: var(--sage) !important; }
        @media (min-width: 768px) {
          .hamburger { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}