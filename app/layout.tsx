import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bird League",
  description: "Fantasy birding. Real birds. Real bragging rights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
