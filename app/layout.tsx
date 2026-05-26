// app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import VerlyBot from "./components/verlybot";
import { LangProvider } from "./components/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { FavoritosProvider } from "./context/FavoritosContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://verlyoptical.com"),
  title: {
    default: "Verly Optical — Affordable Prescription Glasses Online",
    template: "%s | Verly Optical",
  },
  description:
    "Shop prescription eyeglasses and sunglasses online starting at $13. Free shipping to the US. No insurance needed. Configure your lenses in minutes.",
  keywords: [
    "prescription glasses online",
    "affordable eyeglasses USA",
    "buy glasses online no insurance",
    "prescription sunglasses online",
    "progressive lenses online",
    "blue light glasses prescription",
    "prescription glasses under 100",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://verlyoptical.com",
    siteName: "Verly Optical",
    title: "Verly Optical — Affordable Prescription Glasses Online",
    description:
      "Prescription eyeglasses starting at $13. Free shipping to the US. No insurance needed.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Verly Optical — Affordable Prescription Glasses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verly Optical — Affordable Prescription Glasses Online",
    description:
      "Prescription eyeglasses starting at $13. Free US shipping. No insurance needed.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://verlyoptical.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-sans), sans-serif" }}
      >
        <LangProvider>
          <CartProvider>
  <FavoritosProvider>
    {children}
    <VerlyBot />
  </FavoritosProvider>
</CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}