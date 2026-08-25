import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

// The stylesheet is processed by Next.js at runtime; the project currently
// does not provide TypeScript declarations for CSS side-effect imports.
// @ts-expect-error CSS side-effect import
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "For You — Happy Anniversary",
  description: "A little story about us.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-void-950 antialiased">{children}</body>
    </html>
  );
}
