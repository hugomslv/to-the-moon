import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "To The Moon",
  description: "CTF spatial – module ICT-306",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
