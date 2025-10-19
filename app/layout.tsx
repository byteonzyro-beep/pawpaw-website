import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Pacifico } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

/* === 🌸 Font Setup === */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
});

/* === 💖 Metadata SEO + OpenGraph === */
export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: " PAWPAW | The Cutest ",
  description:
    "The cutest coin in the Solana universe 💖 Join the Cutest Community and Discover Candy Land!",
  icons: {
    icon: [
      { url: "/images/emas.png", type: "image/png", sizes: "32x32" },
    ],
  },
  openGraph: {
    title: " PAWPAW ",
    description:
      "Join the cutest community in Candy Land — powered by love, creativity, and fun! 🍭✨",
    url: "https://pawpaw.fun",
    siteName: "PAWPAW ",
    images: [
      {
        url: "/images/bannerpaw1.png",
        width: 1200,
        height: 630,
        alt: "PAWPAW Banner — The Cutest Coin in the Solana Universe",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "🐾 PAWPAW Coin — The Cutest Coin in the Solana Universe 💖",
    description:
      "Join the cutest community in Candy Land — powered by love, creativity, and fun! 🍭✨",
    images: ["/images/bannerpaw1.png"],
  },
};

/* === 🧩 Root Layout === */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 🩷 Favicon pink candy */}
        <link rel="icon" href="/images/emas.png" type="image/png" sizes="32x32" />
        <meta name="theme-color" content="#ffb6d9" />
        <meta
          name="keywords"
          content="pawpaw, meme coin, solana, crypto, candy land, cutest coin, pawpaw token, pawpaw community"
        />
        <meta name="author" content="PAWPAW Project Team" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased bg-[#fff1fa] text-[#3a2b33] overflow-x-hidden`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
