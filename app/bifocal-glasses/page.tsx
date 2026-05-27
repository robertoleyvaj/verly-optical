import type { Metadata } from "next";
import CollectionPage from "@/app/components/CollectionPage";

export const metadata: Metadata = {
  title: "Bifocal Glasses — Prescription Eyewear Online | Verly Optical",
  description:
    "Affordable bifocal glasses with prescription lenses. Classic dual-focus design for near and distance vision. Complete pairs from $62 including frame and lenses.",
  keywords: ["bifocal glasses", "bifocal lenses online", "prescription bifocals", "affordable bifocal eyeglasses"],
  openGraph: {
    title: "Bifocal Glasses | Verly Optical",
    description: "Prescription bifocal glasses from $62 complete. Near and distance vision in one pair.",
    url: "https://verlyoptical.com/bifocal-glasses",
    siteName: "Verly Optical",
    type: "website",
  },
  alternates: { canonical: "https://verlyoptical.com/bifocal-glasses" },
};

export default function BifocalGlassesPage() {
  return (
    <CollectionPage
      title="Bifocal Glasses"
      subtitle="Near & far"
      heroKeyword="Bifocal Glasses"
      description="Classic dual-focus lenses that correct both near and distance vision in one frame. A trusted solution for presbyopia — affordable, reliable, and available in every frame in our collection."
      filterTag="bifocal"
      lensHighlights={[
        { icon: "◎", label: "Dual focal zones", desc: "Clear distance vision above, sharp near vision below" },
        { icon: "◈", label: "Flat-top or round segment", desc: "Classic bifocal styles to suit your preference" },
        { icon: "◉", label: "All frame styles", desc: "Compatible with every frame in our catalog" },
        { icon: "◌", label: "From $62 complete", desc: "Frame $13 + Bifocal lens $49" },
      ]}
      faq={[
        {
          q: "What is the difference between bifocal and progressive glasses?",
          a: "Bifocal lenses have two distinct optical zones — distance on top and near at the bottom — with a visible line separating them. Progressive lenses offer the same correction but with a seamless gradient and no visible line. Bifocals are often preferred for their clear, defined zones and lower cost.",
        },
        {
          q: "Are bifocal glasses right for me?",
          a: "If you're experiencing difficulty focusing between distances (a condition called presbyopia, common after age 40), bifocals are an excellent option. We recommend consulting your eye doctor to confirm the right prescription.",
        },
        {
          q: "Can I add coatings to bifocal lenses?",
          a: "Yes. You can add Essential AR, Blue Light, Anti-Fog, and other coatings to bifocal lenses. Essential AR is especially recommended as it reduces glare from the lens segment line.",
        },
        {
          q: "Do I need a special prescription for bifocals?",
          a: "Your prescription needs to include an 'Add' value (also written as ADD power), which specifies the near vision correction. If you're unsure, share your prescription with us and we'll verify it before producing your glasses.",
        },
      ]}
      relatedLinks={[
        { label: "Progressive Glasses", href: "/progressive-glasses" },
        { label: "Blue Light Glasses", href: "/blue-light-glasses" },
        { label: "Men's Glasses", href: "/mens-glasses" },
        { label: "Women's Glasses", href: "/womens-glasses" },
        { label: "All Frames", href: "/Tienda" },
      ]}
    />
  );
}