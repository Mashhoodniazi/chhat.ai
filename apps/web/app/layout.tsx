import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXTAUTH_URL ?? "https://chaat.ai";

export const metadata: Metadata = {
  title: "Chaat.ai — Build AI Chatbots for Your Website",
  description:
    "Create custom AI chatbots powered by your knowledge base. Upload documents, create bots, and embed on any website in seconds.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Chaat.ai",
    title: "Chaat.ai — Build AI Chatbots for Your Website",
    description:
      "Create custom AI chatbots powered by your knowledge base. Upload documents, create bots, and embed on any website in seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chaat.ai — Build AI Chatbots for Your Website",
    description:
      "Create custom AI chatbots powered by your knowledge base. Upload documents, create bots, and embed on any website in seconds.",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
