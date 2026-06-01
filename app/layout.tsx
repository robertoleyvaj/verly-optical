// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QSNNCVBD50"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QSNNCVBD50');
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}
            (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1001616152414051');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];

              ttq.methods=[
                "page","track","identify","instances","debug",
                "on","off","once","ready","alias","group",
                "enableCookie","disableCookie","holdConsent",
                "revokeConsent","grantConsent"
              ];

              ttq.setAndDefer=function(t,e){
                t[e]=function(){
                  t.push([e].concat(Array.prototype.slice.call(arguments,0)))
                }
              };

              for(var i=0;i<ttq.methods.length;i++){
                ttq.setAndDefer(ttq,ttq.methods[i]);
              }

              ttq.instance=function(t){
                for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++){
                  ttq.setAndDefer(e,ttq.methods[n]);
                }
                return e;
              };

              ttq.load=function(e,n){
                var r="https://analytics.tiktok.com/i18n/pixel/events.js",
                o=n&&n.partner;

                ttq._i=ttq._i||{};
                ttq._i[e]=[];
                ttq._i[e]._u=r;
                ttq._t=ttq._t||{};
                ttq._t[e]=+new Date;
                ttq._o=ttq._o||{};
                ttq._o[e]=n||{};

                n=document.createElement("script");
                n.type="text/javascript";
                n.async=!0;
                n.src=r+"?sdkid="+e+"&lib="+t;

                e=document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(n,e);
              };

              ttq.load('D8B31R3C77UAEKHUG78G');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1001616152414051&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

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