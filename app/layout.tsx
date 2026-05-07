import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import VerlyBot from "./components/verlybot";
import { LangProvider } from "./components/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verly Optical — Lentes accesibles para California",
  description: "Lentes graduados a tu medida, entrega rápida a California. Sin aseguranza.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LangProvider>
          {children}
          <VerlyBot />
        </LangProvider>
      </body>
    </html>
  );
}