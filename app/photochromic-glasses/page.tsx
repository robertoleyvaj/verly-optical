import type { Metadata } from "next";
import CollectionPage from "@/app/components/CollectionPage";

export const metadata: Metadata = {
  title: "Photochromic Glasses — Prescription Lenses That Adapt | Verly Optical",
  description:
    "Prescription photochromic glasses that automatically darken in sunlight and clear indoors. One pair for every environment. Complete from $62 with single vision lenses.",
  keywords: ["photochromic glasses", "photochromic lenses", "transition lenses", "light-adaptive glasses", "prescription photochromic"],
  openGraph: {
    title: "Photochromic Glasses | Verly Optical",
    description: "Lenses that darken in sunlight and clear indoors. Complete pairs from $62.",
    url: "https://verlyoptical.com/photochromic-glasses",
    siteName: "Verly Optical",
    type: "website",
  },
  alternates: { canonical: "https://verlyoptical.com/photochromic-glasses" },
};

export default function PhotochromicGlassesPage() {
  return (
    <CollectionPage
      title="Photochromic Glasses"
      subtitle="One pair, every light"
      heroKeyword="Photochromic Lenses"
      description="Lenses that automatically adapt to changing light conditions — clear indoors, dark outdoors. The ideal prescription glasses for people who move between environments throughout the day."
      filterTag="photochromic"
      lensHighlights={[
        { icon: "◎", label: "Light-responsive lenses", desc: "Darken automatically in UV light, clear within seconds indoors" },
        { icon: "◈", label: "UV 400 protection", desc: "Full ultraviolet protection when activated outdoors" },
        { icon: "◉", label: "All prescriptions", desc: "Single vision, bifocal, and progressive compatible" },
        { icon: "◌", label: "From $62 complete", desc: "Frame $13 + Single Vision $15 + Photochromic $49 filter" },
      ]}
      faq={[
        {
          q: "How fast do photochromic lenses change?",
          a: "Photochromic lenses activate (darken) in under 30 seconds when exposed to UV light. They return to clear indoors typically within 2–5 minutes. Temperature affects speed — they respond faster in warm conditions.",
        },
        {
          q: "Do photochromic lenses work inside a car?",
          a: "Standard photochromic lenses are activated by UV light, which is filtered by most car windshields. They may not darken fully while driving. If you need tinted vision while driving, we recommend adding a Polarized or Fashion Tint coating instead.",
        },
        {
          q: "Can I combine photochromic with blue light filter?",
          a: "Yes. Many of our customers combine photochromic lenses with Essential AR for comprehensive protection — light-adaptive outdoors and anti-reflective indoors.",
        },
        {
          q: "Are photochromic lenses the same as Transitions lenses?",
          a: "Transitions® is a brand name for photochromic lens technology. Our photochromic lenses use the same light-reactive mechanism and offer comparable performance.",
        },
      ]}
      relatedLinks={[
        { label: "Blue Light Glasses", href: "/blue-light-glasses" },
        { label: "Progressive Glasses", href: "/progressive-glasses" },
        { label: "Men's Glasses", href: "/mens-glasses" },
        { label: "Women's Glasses", href: "/womens-glasses" },
        { label: "All Frames", href: "/Tienda" },
      ]}
    />
  );
}