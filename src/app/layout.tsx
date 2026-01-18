import type { Metadata } from "next";
import { Quicksand, Playfair_Display, Dancing_Script } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Little Image Photography | Newborn & Childhood Photography",
  description: "Capturing life's most precious beginnings. Professional newborn and childhood photography for families who cherish timeless memories.",
  keywords: ["newborn photography", "baby photos", "childhood photography", "family portraits", "professional photographer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${playfair.variable} ${dancingScript.variable} antialiased`}
        style={{ fontFamily: "var(--font-quicksand), system-ui, sans-serif" }}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
