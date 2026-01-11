import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const font = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deepanshu Ventures | Strategic Social Media & Growth Consulting",
  description:
    "Strategic social media marketing, performance advertising, personal branding, and growth consulting for ambitious businesses across India."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
