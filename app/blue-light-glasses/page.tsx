import type { Metadata } from "next";
import CollectionPage from "@/app/components/CollectionPage";

export const metadata: Metadata = {
  title: "Blue Light Glasses — Prescription Eyewear | Verly Optical",
  description:
    "Shop blue light blocking glasses with prescription lenses. Protect your eyes from screen fatigue. Complete pairs from $28 with Essential AR or Blue Light filter.",
  keywords: ["blue light glasses", "blue light blocking glasses", "prescription blue light glasses", "computer glasses"],
  openGraph: {
    title: "Blue Light Glasses | Verly Optical",
    description: "Prescription blue light glasses from $28. Reduce eye strain from screens.",
    url: "https://verlyoptical.com/blue-light-glasses",
    siteName: "Verly Optical",
    type: "website",
  },
  alternates: { canonical: "https://verlyoptical.com/blue-light-glasses" },
};

export default function BlueLightGlassesPage() {
  return (
    <CollectionPage
      title="Blue Light Glasses"
      subtitle="Screen protection"
      heroKeyword="Blue Light Glasses"
      description="Prescription eyewear with blue light filtering for people who spend long hours in front of screens. Reduce eye strain, headaches, and sleep disruption — starting at $28 complete."
      filterTag="blue-light"
      lensHighlights={[
        { icon: "◎", label: "Blocks harmful blue light", desc: "Up to 40% blue light reduction with our Blue Light filter" },
        { icon: "◈", label: "Anti-reflective coating", desc: "Essential AR included, Premium AR upgrade available" },
        { icon: "◉", label: "All prescriptions", desc: "Single vision, progressive, and bifocal options" },
        { icon: "◌", label: "From $28 complete", desc: "Frame + lens included, no surprises at checkout" },
      ]}
      faq={[
        {
          q: "Do blue light glasses actually work?",
          a: "Yes. Our blue light filter coating blocks a significant portion of high-energy visible (HEV) light emitted by screens. Many customers report reduced eye strain and improved sleep quality, especially with evening use.",
        },
        {
          q: "Can I get my prescription in blue light glasses?",
          a: "Absolutely. All our frames are available with prescription lenses. You can choose single vision, bifocal, or progressive lenses — all compatible with the blue light filter coating.",
        },
        {
          q: "What's the difference between Essential AR and the Blue Light filter?",
          a: "Essential AR ($11) reduces glare from artificial lighting and screens. The Blue Light filter ($18) adds a specific coating that targets the blue light wavelength range (380–500nm). Many customers choose both.",
        },
        {
          q: "How long does delivery take?",
          a: "Most orders ship within 5–7 business days after prescription verification. You'll receive a tracking number as soon as your glasses are on their way.",
        },
      ]}
      relatedLinks={[
        { label: "Progressive Glasses", href: "/progressive-glasses" },
        { label: "Photochromic Lenses", href: "/photochromic-glasses" },
        { label: "Men's Glasses", href: "/mens-glasses" },
        { label: "Women's Glasses", href: "/womens-glasses" },
        { label: "All Frames", href: "/Tienda" },
      ]}
    />
  );
}