import type { Metadata } from "next";
import CollectionPage from "@/app/components/CollectionPage";

export const metadata: Metadata = {
  title: "Women's Prescription Glasses — Eyeglasses Online | Verly Optical",
  description:
    "Shop women's prescription glasses online. Timeless and editorial frames available with single vision, progressive, or bifocal lenses. Complete pairs from $28.",
  keywords: ["women's glasses", "women's prescription glasses", "women's eyeglasses online", "prescription glasses for women", "women's frames"],
  openGraph: {
    title: "Women's Glasses | Verly Optical",
    description: "Women's prescription eyeglasses from $28. Timeless frames with your choice of lenses.",
    url: "https://verlyoptical.com/womens-glasses",
    siteName: "Verly Optical",
    type: "website",
  },
  alternates: { canonical: "https://verlyoptical.com/womens-glasses" },
};

export default function WomensGlassesPage() {
  return (
    <CollectionPage
      title="Women's Glasses"
      subtitle="Timeless eyewear"
      heroKeyword="Women's Prescription Glasses"
      description="Prescription eyeglasses for women — designed with an editorial eye and built for everyday comfort. From cat-eye to minimalist round frames, every pair ships with your lenses included. From $28."
      filterTag="womens"
      lensHighlights={[
        { icon: "◎", label: "Editorial silhouettes", desc: "Cat-eye, round, oval, and geometric styles" },
        { icon: "◈", label: "Lightweight comfort", desc: "Slim acetate and wire-thin metal options" },
        { icon: "◉", label: "All vision types", desc: "Single vision, progressive, and bifocal available" },
        { icon: "◌", label: "From $28 complete", desc: "Frame $13 + Single Vision $15 included" },
      ]}
      faq={[
        {
          q: "What are the most popular women's frame styles?",
          a: "Cat-eye and oval frames are perennially popular. Round frames suit angular faces well. If you're unsure, our team can suggest styles based on your face shape — just ask in the order notes.",
        },
        {
          q: "Can I get women's progressive glasses?",
          a: "Yes. All frames in our women's collection are available with progressive, bifocal, or single vision lenses. Select your lens type in the frame configurator.",
        },
        {
          q: "Do you offer blue light glasses for women?",
          a: "All frames — including the women's collection — are available with our Blue Light filter coating. It's a popular addition for anyone who spends long hours on screens.",
        },
        {
          q: "How do I know my frame size?",
          a: "Each product page lists the frame measurements: lens width (mm), bridge width (mm), and temple length (mm). If you have a current pair of glasses, check the inner temple arm — the three numbers printed there are your current size.",
        },
      ]}
      relatedLinks={[
        { label: "Blue Light Glasses", href: "/blue-light-glasses" },
        { label: "Progressive Glasses", href: "/progressive-glasses" },
        { label: "Photochromic Lenses", href: "/photochromic-glasses" },
        { label: "Men's Glasses", href: "/mens-glasses" },
        { label: "All Frames", href: "/Tienda" },
      ]}
    />
  );
}