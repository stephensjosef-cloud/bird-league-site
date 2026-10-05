import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { recruiterFrom, withRecruiter } from '@/lib/recruiter';

// The clan invite landing page, birdleague.app/clan/<clan_key>?by=<user id>.
//
// Built like /join/[code]. On an iPhone with Bird League installed, iOS
// matches /clan/* against the applinks entry in
// app/.well-known/apple-app-site-association/route.ts and opens the app, so
// this page never renders there. It is for everyone ELSE: desktop, Android, a
// link preview pane, or an iPhone without the app. It names the clan, offers
// to open the app (birdleague://clan/<key>, carrying the link's ?by= on, see
// lib/recruiter.ts) and links to the App Store.
//
// NO DATABASE CALL. The five clans are fixed, so their names and taglines are
// written here, copied from constants/clans.ts in the app repo (the one copy
// of each tagline; change both together). lib/supabase.ts allows exactly two
// calls from this site and this page needs neither.
//
// Styling follows the join page: inline CSSProperties, navy #2c4a7c, coral
// #e8632a, ink #1a1a2e, muted #6b7280.

// Same target as the join and duel pages. The id is the ascAppId from eas.json.
const APP_STORE_URL = 'https://apps.apple.com/app/id6778868680';

const CLANS: Record<string, { name: string; tagline: string }> = {
  raptors: { name: 'Skycrown', tagline: 'Rare birds, big points' },
  backyard: { name: 'The Perch', tagline: 'Common birds, every week' },
  waterfowl: { name: 'Shorebound', tagline: 'Lakes, rivers and wetlands' },
  urban: { name: 'Neonest', tagline: 'Birds of the city' },
  wildlands: { name: 'Mossborne', tagline: 'Trails and long drives' },
};

const wrap: CSSProperties = {
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 20px',
  background: '#f7f9fc',
};
const card: CSSProperties = {
  width: '100%',
  maxWidth: 460,
  background: '#ffffff',
  border: '1px solid rgba(44,74,124,0.09)',
  borderRadius: 20,
  padding: '32px 28px',
  textAlign: 'center',
  boxShadow: '0 12px 40px rgba(44,74,124,0.08)',
};
const eyebrow: CSSProperties = {
  margin: 0,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '1.4px',
  textTransform: 'uppercase',
  color: '#e8632a',
};
const heading: CSSProperties = {
  margin: '14px 0 0',
  fontSize: 'clamp(26px,6vw,34px)',
  fontWeight: 800,
  letterSpacing: '-0.5px',
  color: '#1a1a2e',
  lineHeight: 1.2,
  overflowWrap: 'anywhere',
};
const tagline: CSSProperties = {
  margin: '12px 0 0',
  fontSize: 20,
  fontWeight: 700,
  color: '#2c4a7c',
};
const sub: CSSProperties = {
  margin: '12px 0 0',
  fontSize: 17,
  lineHeight: 1.6,
  color: '#6b7280',
};
const cta: CSSProperties = {
  display: 'block',
  margin: '28px 0 0',
  padding: '15px 20px',
  borderRadius: 12,
  background: '#e8632a',
  color: '#ffffff',
  fontSize: 17,
  fontWeight: 700,
  textDecoration: 'none',
};
const ctaSecondary: CSSProperties = {
  display: 'block',
  margin: '12px 0 0',
  padding: '14px 20px',
  borderRadius: 12,
  background: '#ffffff',
  border: '2px solid #2c4a7c',
  color: '#2c4a7c',
  fontSize: 17,
  fontWeight: 700,
  textDecoration: 'none',
};
const footer: CSSProperties = {
  margin: '24px 0 0',
  fontSize: 14,
  color: '#6b7280',
};

function clanFor(raw: string): { key: string; name: string; tagline: string } | null {
  let k: string;
  try {
    k = decodeURIComponent(raw);
  } catch {
    return null;
  }
  k = k.trim().toLowerCase();
  const c = CLANS[k];
  return c ? { key: k, ...c } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const clan = clanFor(key);

  const title = clan ? `Join ${clan.name} on Bird League` : 'A Bird League invite';
  const description = clan
    ? `${clan.name}: ${clan.tagline}. Log the birds you see and play for your clan.`
    : 'Log the birds you see and play a season against friends.';

  return {
    title: `${title} | Bird League`,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
    // An invite link is private to whoever was sent it. Keep it out of search.
    robots: { index: false, follow: false },
  };
}

export default async function ClanInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { key } = await params;
  const by = recruiterFrom(await searchParams);
  const clan = clanFor(key);

  if (!clan) {
    return (
      <main style={wrap}>
        <div style={card}>
          <p style={eyebrow}>Bird League</p>
          <h1 style={heading}>This link is not a clan invite.</h1>
          <p style={sub}>Check the link you were sent.</p>
          <a style={cta} href={APP_STORE_URL}>
            Get Bird League
          </a>
        </div>
        <p style={footer}>
          <Link href="/">Bird League</Link>
        </p>
      </main>
    );
  }

  return (
    <main style={wrap}>
      <div style={card}>
        <p style={eyebrow}>Clan invite</p>
        <h1 style={heading}>{clan.name}</h1>
        <p style={tagline}>{clan.tagline}</p>
        <p style={sub}>Get Bird League and bird for {clan.name}.</p>

        <a style={cta} href={withRecruiter(`birdleague://clan/${encodeURIComponent(clan.key)}`, by)}>
          Open in Bird League
        </a>
        <a style={ctaSecondary} href={APP_STORE_URL}>
          Get Bird League
        </a>
      </div>
      <p style={footer}>
        <Link href="/">Bird League</Link>
      </p>
    </main>
  );
}
