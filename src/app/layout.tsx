import type { Metadata } from "next";
import { Solway, Nunito } from "next/font/google";
import "./globals.css";

const solway = Solway({
  variable: "--font-solway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Little Image Photography",
  description: "Cozy & Comfort photography for the modern family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${solway.variable} ${nunito.variable} antialiased font-sans bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
