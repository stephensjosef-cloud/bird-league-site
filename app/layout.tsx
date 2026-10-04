import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bird League",
  description: "Fantasy leagues for birders. Every bird you log scores points, and rarer birds score more.",
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
