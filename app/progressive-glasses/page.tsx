import type { Metadata } from "next";
import CollectionPage from "@/app/components/CollectionPage";

export const metadata: Metadata = {
  title: "Progressive Glasses — No-Line Multifocal Lenses | Verly Optical",
  description:
    "Affordable progressive glasses online. See clearly at every distance — near, intermediate, and far — with no visible line. Complete pairs from $102 with prescription.",
  keywords: ["progressive glasses", "progressive lenses online", "no-line bifocals", "multifocal glasses", "affordable progressive eyeglasses"],
  openGraph: {
    title: "Progressive Glasses | Verly Optical",
    description: "Affordable progressive lenses from $102 complete. All-distance clarity, no visible line.",
    url: "https://verlyoptical.com/progressive-glasses",
    siteName: "Verly Optical",
    type: "website",
  },
  alternates: { canonical: "https://verlyoptical.com/progressive-glasses" },
};

export default function ProgressiveGlassesPage() {
  return (
    <CollectionPage
      title="Progressive Glasses"
      subtitle="All-distance clarity"
      heroKeyword="Progressive Glasses"
      description="The most natural vision correction available. Progressive lenses offer seamless transitions between near, intermediate, and distance vision — no lines, no compromise. From $102 complete."
      filterTag="progressive"
      lensHighlights={[
        { icon: "◎", label: "No visible line", desc: "Smooth optical gradient from near to far vision" },
        { icon: "◈", label: "Three focal zones", desc: "Near, intermediate (screens), and distance in one lens" },
        { icon: "◉", label: "Premium materials available", desc: "Standard to Ultra Thin Pro — choose your lifestyle" },
        { icon: "◌", label: "From $102 complete", desc: "Frame $13 + Progressive lens $89" },
      ]}
      faq={[
        {
          q: "What are progressive glasses?",
          a: "Progressive glasses (also called no-line multifocals) use a gradual lens design to correct vision at multiple distances — near, intermediate, and far — in a single pair. Unlike bifocals, there's no visible line on the lens.",
        },
        {
          q: "How long does it take to adjust to progressive lenses?",
          a: "Most people adapt within 1–2 weeks. During this period, it's normal to experience slight distortion at the lens periphery. We recommend wearing them full-time during the adjustment period.",
        },
        {
          q: "Are your progressive lenses digital or traditional?",
          a: "We offer digitally surfaced (free-form) progressive lenses, which provide wider clear zones and a shorter adaptation period compared to traditional progressives.",
        },
        {
          q: "Can I add blue light or anti-reflective coating to progressives?",
          a: "Yes. All lens coatings — Essential AR, Blue Light, Photochromic, and more — are compatible with progressive lenses. We recommend at least the Essential AR coating for comfort.",
        },
      ]}
      relatedLinks={[
        { label: "Blue Light Glasses", href: "/blue-light-glasses" },
        { label: "Bifocal Glasses", href: "/bifocal-glasses" },
        { label: "Photochromic Lenses", href: "/photochromic-glasses" },
        { label: "Women's Glasses", href: "/womens-glasses" },
        { label: "All Frames", href: "/Tienda" },
      ]}
    />
  );
}