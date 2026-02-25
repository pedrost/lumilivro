import type { Metadata } from "next";
import { Playfair_Display, Inter, DM_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LumiRead — Rechargeable Book Light",
    template: "%s | LumiRead",
  },
  description:
    "The reading light that protects your eyes and transforms your nighttime reading. Adjustable LED, USB-C rechargeable, flexible clip.",
  keywords: [
    "book light",
    "reading light",
    "rechargeable LED light",
    "clip on book light",
    "night reading light",
    "LumiRead",
  ],
  openGraph: {
    title: "LumiRead — Rechargeable Book Light",
    description:
      "Read in the dark without straining your eyes. Adjustable LED, USB-C rechargeable, flexible clip. Free shipping across the US.",
    type: "website",
    locale: "en_US",
    siteName: "LumiRead",
  },
  icons: {
    icon: "/images/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/images/review-1.png" as="image" />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} ${dmMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
