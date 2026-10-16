import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { normalizeDuelCode as normalizeCode } from '@/lib/codes';
import { installLink, type InstallLink } from '@/lib/install';
import { recruiterFrom, withRecruiter } from '@/lib/recruiter';
import { fetchDuelPreview, type DuelPreview } from '@/lib/supabase';

// The duel invite landing page.
//
// WHO ACTUALLY SEES THIS. On an iPhone with Bird League installed, iOS matches
// /d/* against the applinks entry served from
// app/.well-known/apple-app-site-association/route.ts and opens the app
// directly, so this page never renders. It is what everyone ELSE gets: desktop,
// Android, a browser preview pane, or an iPhone without the app. That is the
// whole design brief for it, and it is why the primary action is "get the app"
// rather than "accept", which cannot be done here: accept_duel requires an
// authenticated caller and this page has no session and no login.
//
// The second button opens the app by its custom scheme, birdleague://d/<CODE>,
// for an iPhone where the universal link did not fire (an in-app browser, say).
// It carries the link's ?by= on (lib/recruiter.ts). The server names the
// challenger as recruiter on accept anyway (RECRUIT-2, accept_duel), so the
// `by` here matters only when someone other than the challenger shared it.
//
// Styling follows the landing page idiom: inline CSSProperties, navy #2c4a7c,
// coral #e8632a, ink #1a1a2e, muted #6b7280.

// Every install button goes where lib/install.ts says: the App Store once it is
// live, else TestFlight, else an email asking for an invite with the code in it.

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
};
const sub: CSSProperties = {
  margin: '12px 0 0',
  fontSize: 17,
  lineHeight: 1.6,
  color: '#6b7280',
};
const monogram: CSSProperties = {
  width: 84,
  height: 84,
  borderRadius: '50%',
  margin: '0 auto',
  background: 'rgba(44,74,124,0.08)',
  border: '2px solid rgba(44,74,124,0.14)',
  color: '#2c4a7c',
  fontSize: 34,
  fontWeight: 800,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const statRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 14,
  margin: '24px 0 0',
};
const stat: CSSProperties = {
  flex: '1 1 0',
  background: '#f7f9fc',
  border: '1px solid rgba(44,74,124,0.07)',
  borderRadius: 12,
  padding: '14px 8px',
};
const statNum: CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 800,
  color: '#2c4a7c',
  lineHeight: 1.1,
};
const statLabel: CSSProperties = {
  margin: '4px 0 0',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
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
const fine: CSSProperties = {
  margin: '18px 0 0',
  fontSize: 14,
  lineHeight: 1.5,
  color: '#6b7280',
};
const footer: CSSProperties = {
  margin: '24px 0 0',
  fontSize: 14,
  color: '#6b7280',
};

function initial(name: string | null): string {
  const t = (name ?? '').trim();
  return t ? t[0].toUpperCase() : '?';
}

/** Whole days remaining, floored at zero. Null when there is no deadline. */
function daysLeft(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const preview = await fetchDuelPreview(code);
  const who = preview?.challenger_name;

  const title = who ? `${who} challenged you to a duel` : 'A Bird League duel';
  const description = who
    ? `Seven days, bird for bird. Open the challenge from ${who} in Bird League.`
    : 'Seven days, bird for bird. Open the challenge in Bird League.';

  return {
    title: `${title} | Bird League`,
    description,
    // The picture is app/d/[code]/opengraph-image.tsx, which Next adds to both
    // of these on its own.
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    // A challenge link is private to whoever was sent it. Keep it out of search.
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

function Closed({
  eyebrowText,
  title,
  body,
  install,
}: {
  eyebrowText: string;
  title: string;
  body: string;
  install: InstallLink;
}) {
  return (
    <Shell>
      <p style={eyebrow}>{eyebrowText}</p>
      <h1 style={heading}>{title}</h1>
      <p style={sub}>{body}</p>
      <a style={cta} href={install.href}>
        {install.label}
      </a>
    </Shell>
  );
}

export default async function DuelInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { code } = await params;
  const by = recruiterFrom(await searchParams);
  const preview: DuelPreview | null = await fetchDuelPreview(code);
  const openCode = normalizeCode(code);
  const install = installLink(
    { type: 'duel', code: openCode, challengerName: preview?.challenger_name ?? null },
    'Get Bird League to accept',
  );
  // A closed or unknown challenge has nothing to accept, so its button says
  // plain "Get Bird League" once the App Store is live. An unknown code is not
  // carried into the invite email.
  const plainInstall = installLink(
    { type: 'duel', code: preview?.status === 'not_found' ? null : openCode },
    'Get Bird League',
  );

  // The lookup itself failed, which is different from a code nobody knows.
  if (!preview) {
    return (
      <Closed
        eyebrowText="Bird League"
        title="We cannot load this challenge"
        body="We could not reach Bird League just now. Try the link again in a moment."
        install={plainInstall}
      />
    );
  }

  if (preview.status === 'not_found') {
    return (
      <Closed
        eyebrowText="Bird League"
        title="This link is not a duel"
        body="Check the link you were sent. Codes are eight characters long."
        install={plainInstall}
      />
    );
  }

  if (preview.status === 'expired') {
    return (
      <Closed
        eyebrowText="Expired"
        title="This challenge has run out"
        body="A duel invite is good for three days. Ask for a fresh one."
        install={plainInstall}
      />
    );
  }

  if (preview.status === 'accepted') {
    return (
      <Closed
        eyebrowText="Taken"
        title="This duel is already under way"
        body="Someone has accepted this challenge. Only one opponent per duel."
        install={plainInstall}
      />
    );
  }

  if (preview.status === 'declined') {
    return (
      <Closed
        eyebrowText="Closed"
        title="This challenge was turned down"
        body="Nothing more to do here."
        install={plainInstall}
      />
    );
  }

  const name = preview.challenger_name ?? 'A birder';
  const left = daysLeft(preview.expires_at);

  return (
    <Shell>
      <div style={monogram} aria-hidden="true">
        {initial(preview.challenger_name)}
      </div>
      <p style={{ ...eyebrow, marginTop: 18 }}>You have been challenged</p>
      <h1 style={heading}>{name} wants a duel</h1>
      <p style={sub}>
        Seven days, bird for bird. Every bird you log counts. Most points wins.
      </p>

      <div style={statRow}>
        <div style={stat}>
          <p style={statNum}>{preview.species_count}</p>
          <p style={statLabel}>Species</p>
        </div>
        <div style={stat}>
          <p style={statNum}>{preview.points}</p>
          <p style={statLabel}>Points</p>
        </div>
      </div>

      <a style={cta} href={install.href}>
        {install.label}
      </a>
      {openCode && (
        <a style={ctaSecondary} href={withRecruiter(`birdleague://d/${openCode}`, by)}>
          Open in Bird League
        </a>
      )}

      <p style={fine}>
        Already have the app? Open this link on your iPhone and it will take you
        straight to the challenge.
      </p>

      {left !== null && (
        <p style={fine}>
          {left === 0
            ? 'This challenge expires today.'
            : left === 1
              ? 'This challenge expires in 1 day.'
              : `This challenge expires in ${left} days.`}
        </p>
      )}
    </Shell>
  );
}
