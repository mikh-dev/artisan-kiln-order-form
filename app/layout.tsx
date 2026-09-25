import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Artisan Kiln | Ceramic Tile Order Form",
  description: "Interactive ceramic tile order and pattern design experience.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
