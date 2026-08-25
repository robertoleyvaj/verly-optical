import type { Metadata } from "next";
import CollectionPage from "@/app/components/CollectionPage";

// Leer en vivo (no estático) para reflejar el catálogo actual.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prescription Glasses from $28 | Verly Optical",
  description:
    "Prescription glasses from $28 complete — quality frames with prescription lenses included. Shop our best value styles.",
  keywords: ["prescription glasses", "cheap prescription glasses", "glasses from $28", "affordable eyewear"],
  openGraph: {
    title: "Prescription Glasses from $28 | Verly Optical",
    description: "Quality frames + prescription lenses from $28 complete.",
    url: "https://verlyoptical.com/collections/glasses-from-28",
    siteName: "Verly Optical",
    type: "website",
  },
  alternates: { canonical: "https://verlyoptical.com/collections/glasses-from-28" },
};

export default function GlassesFrom28Page() {
  return (
    <CollectionPage
      title="Prescription Glasses from $28"
      subtitle="Best value"
      heroKeyword="Prescription Glasses from $28"
      description="Quality frames with prescription lenses included — complete pairs starting at just $28. Handpicked styles, fair prices, no surprises at checkout."
      nombres={["NATURA", "MAXCO", "OFEN", "SMART", "LIGHTEM", "ARRY"]}
      lensHighlights={[
        { icon: "◌", label: "From $28 complete", desc: "Frame + prescription lenses included" },
        { icon: "◈", label: "Anti-reflective coating", desc: "Essential AR available on every pair" },
        { icon: "◉", label: "All prescriptions", desc: "Single vision, progressive, and bifocal" },
        { icon: "◎", label: "5-7 day shipping", desc: "Made for your prescription and shipped fast" },
      ]}
      faq={[
        {
          q: "What does $28 include?",
          a: "A complete pair: the frame plus prescription lenses. You enter your prescription in the frame configurator, and there are no surprise fees at checkout.",
        },
        {
          q: "Can I add coatings or filters?",
          a: "Yes. You can upgrade to blue light, photochromic, anti-fog, premium AR, and more when you configure your lenses.",
        },
        {
          q: "How do I enter my prescription?",
          a: "You can type the numbers manually or upload a photo of your prescription during checkout.",
        },
      ]}
      relatedLinks={[
        { label: "Men's Glasses", href: "/mens-glasses" },
        { label: "Women's Glasses", href: "/womens-glasses" },
        { label: "All Frames", href: "/Tienda" },
      ]}
    />
  );
}
