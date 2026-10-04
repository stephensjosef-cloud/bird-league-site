import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import LocalKickoff from '@/components/LocalKickoff';
import { fetchLeagueInvitePreview, type LeagueInvitePreview } from '@/lib/supabase';

// The league invite landing page, birdleague.app/join/<CODE>.
//
// Built exactly like /d/[code] (the duel invite). On an iPhone with Bird
// League installed, iOS matches /join/* against the applinks entry served from
// app/.well-known/apple-app-site-association/route.ts and opens the app, so
// this page never renders there. It is for everyone ELSE: desktop, Android, a
// link preview pane, or an iPhone without the app. Joining needs a signed-in
// caller, and this page has no session, so it offers to open the app (custom
// scheme birdleague://join/<CODE>) or to get it.
//
// The data comes from get_league_invite_preview (JOIN-LINK-SERVER), called with
// the anon key. The kickoff time is formatted in the browser, in the viewer's
// own time zone, by components/LocalKickoff.tsx.
//
// Styling follows the duel page: inline CSSProperties, navy #2c4a7c, coral
// #e8632a, ink #1a1a2e, muted #6b7280.

// Same target as the duel page. The id is the ascAppId from eas.json.
const APP_STORE_URL = 'https://apps.apple.com/app/id6778868680';

export const dynamic = 'force-dynamic';

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
const sub: CSSProperties = {
  margin: '12px 0 0',
  fontSize: 17,
  lineHeight: 1.6,
  color: '#6b7280',
};
const count: CSSProperties = {
  margin: '20px 0 0',
  fontSize: 20,
  fontWeight: 700,
  color: '#2c4a7c',
};
const kickoff: CSSProperties = {
  margin: '8px 0 0',
  fontSize: 17,
  lineHeight: 1.6,
  color: '#1a1a2e',
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

/** Invite codes are eight letters and digits. Anything else cannot match. */
function normalizeCode(raw: string): string | null {
  let c: string;
  try {
    c = decodeURIComponent(raw);
  } catch {
    return null;
  }
  c = c.trim().toUpperCase();
  return /^[A-Z0-9]{4,16}$/.test(c) ? c : null;
}

async function load(raw: string): Promise<{ code: string | null; preview: LeagueInvitePreview | null }> {
  const code = normalizeCode(raw);
  if (!code) return { code: null, preview: { success: false, status: 'not_found' } };
  return { code, preview: await fetchLeagueInvitePreview(code) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const { preview } = await load(code);
  const name = preview?.success ? preview.league_name : null;

  const title = name ? `Join ${name} on Bird League` : 'A Bird League invite';
  const description = name
    ? `You have been invited to ${name}. Log the birds you see and play a season against friends.`
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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={wrap}>
      <div style={card}>{children}</div>
      <p style={footer}>
        <Link href="/">Bird League</Link>
      </p>
    </main>
  );
}

function Closed({ eyebrowText, title, body }: { eyebrowText: string; title: string; body?: string }) {
  return (
    <Shell>
      <p style={eyebrow}>{eyebrowText}</p>
      <h1 style={heading}>{title}</h1>
      {body && <p style={sub}>{body}</p>}
      <a style={cta} href={APP_STORE_URL}>
        Get Bird League
      </a>
    </Shell>
  );
}

export default async function LeagueInvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const { code, preview } = await load(raw);

  // The lookup itself failed, which is different from a code nobody knows.
  if (!preview) {
    return (
      <Closed
        eyebrowText="Bird League"
        title="We cannot load this invite"
        body="We could not reach Bird League just now. Try the link again in a moment."
      />
    );
  }

  if (!code || !preview.success || preview.status === 'not_found') {
    return (
      <Closed
        eyebrowText="Bird League"
        title="This link is not a league invite."
        body="Check the link you were sent. Codes are eight characters long."
      />
    );
  }

  const name = preview.league_name ?? 'A Bird League league';

  if (preview.status === 'started') {
    return <Closed eyebrowText={name} title="This league has already kicked off." />;
  }
  if (preview.status === 'finished') {
    return <Closed eyebrowText={name} title="This league has finished." />;
  }
  if (preview.status === 'full') {
    return <Closed eyebrowText={name} title="This league is full." />;
  }

  // signing_up or on_hold: the invite is open.
  const n = preview.member_count ?? 0;
  const max = preview.max_members;
  const birders = max != null ? `${n} of ${max} birders in` : `${n} ${n === 1 ? 'birder' : 'birders'} in`;

  return (
    <Shell>
      <p style={eyebrow}>League invite</p>
      <h1 style={heading}>{name}</h1>

      <p style={count}>{birders}</p>

      {preview.status === 'on_hold' ? (
        <p style={kickoff}>On hold</p>
      ) : preview.kickoff_at ? (
        <LocalKickoff iso={preview.kickoff_at} style={kickoff} />
      ) : null}

      {preview.commissioner_name && (
        <p style={sub}>Commissioner: {preview.commissioner_name}</p>
      )}

      <a style={cta} href={`birdleague://join/${encodeURIComponent(code)}`}>
        Open in Bird League
      </a>
      <a style={ctaSecondary} href={APP_STORE_URL}>
        Get Bird League
      </a>
    </Shell>
  );
}
