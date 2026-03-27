import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Criticast: Pitch. Review. Discover.",
  description:
    "A place to pitch creative ideas, get honest reviews, and discover what's worth making.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 text-gray-900 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Criticast. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
