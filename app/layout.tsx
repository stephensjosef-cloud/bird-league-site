import type { Metadata } from "next";
import "./globals.css";

const description = "Fantasy leagues for birders. Every bird you log scores points, and rarer birds score more.";

// The link preview picture is app/opengraph-image.tsx; Next adds it to both
// openGraph and twitter below. metadataBase makes its URL absolute in
// production. A Vercel preview deployment uses its own URL instead.
export const metadata: Metadata = {
  metadataBase: new URL("https://birdleague.app"),
  title: "Bird League",
  description,
  openGraph: {
    title: "Bird League",
    description: "Fantasy birding. Real birds.",
    siteName: "Bird League",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bird League",
    description: "Fantasy birding. Real birds.",
  },
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
