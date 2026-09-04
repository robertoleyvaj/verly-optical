import type { Metadata } from "next";
import CollectionPage from "@/app/components/CollectionPage";

export const metadata: Metadata = {
  title: "Men's Prescription Glasses — Eyeglasses Online | Verly Optical",
  description:
    "Shop men's prescription glasses online. Classic, modern, and minimalist frames available with single vision, progressive, or bifocal lenses. Complete pairs from $28.",
  keywords: ["men's glasses", "men's prescription glasses", "men's eyeglasses online", "prescription glasses for men", "men's frames"],
  openGraph: {
    title: "Men's Glasses | Verly Optical",
    description: "Men's prescription eyeglasses from $28. Classic and modern frames with your choice of lenses.",
    url: "https://verlyoptical.com/mens-glasses",
    siteName: "Verly Optical",
    type: "website",
  },
  alternates: { canonical: "https://verlyoptical.com/mens-glasses" },
};

export default function MensGlassesPage() {
  return (
    <CollectionPage
      title="Men's Glasses"
      subtitle="Built for every day"
      heroKeyword="Men's Prescription Glasses"
      description="Prescription eyeglasses for men — from classic rectangular frames to modern slim silhouettes. Every pair built with your prescription and ready to ship. Starting at $28 complete."
      filterTag="mens"
      lensHighlights={[
        { icon: "◎", label: "Classic & modern shapes", desc: "Rectangular, round, wayfarer, and aviator styles available" },
        { icon: "◈", label: "Acetate & metal options", desc: "Lightweight titanium to bold acetate — built to last" },
        { icon: "◉", label: "All vision types", desc: "Single vision, progressive, and bifocal prescriptions" },
        { icon: "◌", label: "From $28 complete", desc: "Frame $13 + Single Vision $15 included" },
      ]}
      faq={[
        {
          q: "What frame shapes work best for men?",
          a: "Rectangular and square frames tend to complement round and oval face shapes. Round and oval frames work well with angular faces. Our team is happy to advise — just describe your face shape in the order notes.",
        },
        {
          q: "Can I get men's progressive glasses?",
          a: "Yes. All frames in our men's collection are available with progressive, bifocal, or single vision lenses. Simply select your lens type in the configurator after choosing your frame.",
        },
        {
          q: "Do you offer wide-fit frames for men?",
          a: "We carry frames in multiple widths. Frame measurements (lens width, bridge width, temple length) are listed on each product page to help you find the right fit.",
        },
        {
          q: "How do I submit my prescription?",
          a: "You can upload a photo or PDF of your prescription at checkout, email it to us after ordering, or enter the values manually in the configurator. Our opticians verify every prescription before production.",
        },
      ]}
      relatedLinks={[
        { label: "Blue Light Glasses", href: "/blue-light-glasses" },
        { label: "Progressive Glasses", href: "/progressive-glasses" },
        { label: "Photochromic Lenses", href: "/photochromic-glasses" },
        { label: "Women's Glasses", href: "/womens-glasses" },
        { label: "All Frames", href: "/Tienda" },
      ]}
    />
  );
}