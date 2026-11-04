import type { Metadata } from 'next';
import Link from 'next/link';
import { installLink } from '@/lib/install';
import { card, cta, ctaSecondary, eyebrow, footer, heading, leagueIdFrom, sub, wrap } from '@/lib/open-in-app';

// The lineup email's button, birdleague.app/league/<league id> (LOOK-EMAIL-FIX
// 7). On an iPhone with Bird League installed iOS matches /league/* against
// app/.well-known/apple-app-site-association/route.ts and opens the league's
// roster in the app, so this page never renders there. It is for a desktop,
// Android or an iPhone without the app: open in the app, or get it.
//
// NO DATABASE CALL. The league's name is not looked up; the id is only
// checked for its shape before it goes into the app link.

export const metadata: Metadata = {
  title: 'Set your starters | Bird League',
  // A league link is private to whoever was sent it. Keep it out of search.
  robots: { index: false, follow: false },
};

export default async function LeagueLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leagueId = leagueIdFrom(id);
  const install = installLink({ type: 'home' });

  return (
    <main style={wrap}>
      <div style={card}>
        <p style={eyebrow}>Bird League</p>
        {leagueId ? (
          <>
            <h1 style={heading}>Set your starters in the app</h1>
            <a style={cta} href={`birdleague://league/${leagueId}`}>
              Open in Bird League
            </a>
          </>
        ) : (
          <>
            <h1 style={heading}>This link is not a league link.</h1>
            <p style={sub}>Check the link you were sent.</p>
          </>
        )}
        <a style={leagueId ? ctaSecondary : cta} href={install.href}>
          {install.label}
        </a>
      </div>
      <p style={footer}>
        <Link href="/">Bird League</Link>
      </p>
    </main>
  );
}
