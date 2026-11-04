import type { Metadata } from 'next';
import Link from 'next/link';
import { installLink } from '@/lib/install';
import { card, cta, ctaSecondary, eyebrow, footer, heading, wrap } from '@/lib/open-in-app';

// The Pecking Order email's "Read the whole issue" button,
// birdleague.app/pecking-order (LOOK-EMAIL-FIX 7 and 8). On an iPhone with
// Bird League installed iOS matches /pecking-order against
// app/.well-known/apple-app-site-association/route.ts and opens the current
// issue in the app, so this page never renders there. It is for everyone
// else: open in the app, or get it.

export const metadata: Metadata = {
  title: 'Pecking Order | Bird League',
  robots: { index: false, follow: false },
};

export default function PeckingOrderLinkPage() {
  const install = installLink({ type: 'home' });
  return (
    <main style={wrap}>
      <div style={card}>
        <p style={eyebrow}>Pecking Order</p>
        <h1 style={heading}>The whole issue is in the app</h1>
        <a style={cta} href="birdleague://pecking-order">
          Open in Bird League
        </a>
        <a style={ctaSecondary} href={install.href}>
          {install.label}
        </a>
      </div>
      <p style={footer}>
        <Link href="/">Bird League</Link>
      </p>
    </main>
  );
}
