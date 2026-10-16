import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { DuelPreview, LeagueInvitePreview } from '@/lib/supabase';

// The link preview picture every page shares (Open Graph and Twitter, 1200 by
// 630). It is the horizon the app is known for: a dusk sky in the site's navy,
// coral and gold over a dark ridge line, with the logo rising behind the ridge
// like the sun. Each page's opengraph-image.tsx passes its own words.
//
// Only Geist Regular ships with next/og, so the heavy lines are drawn with a
// thin stroke of their own colour rather than a second font file.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const NAVY_DEEP = '#1f3557';
const NAVY = '#2c4a7c';
const CORAL = '#e8632a';
const GOLD = '#f0b429';
const INK = '#1a1a2e';

let logoData: Promise<string> | null = null;

/** The logo as a data URL, read once per server instance. */
function logo(): Promise<string> {
  if (!logoData) {
    logoData = readFile(join(process.cwd(), 'public', 'bird-league-logo.png')).then(
      (b) => `data:image/png;base64,${b.toString('base64')}`,
    );
  }
  return logoData;
}

export type OgCardProps = {
  /** Small gold line above the title, in capitals. */
  eyebrow?: string;
  title: string;
  /** Up to three short lines under the title. */
  lines?: string[];
  /** The pill at the bottom of the words, such as "Join the league". */
  action?: string;
};

/** Shortens a name that would run off the card. */
export function clip(text: string, max: number): string {
  const t = text.trim().replace(/\s+/g, ' ');
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}...` : t;
}

function titleSize(title: string): number {
  const n = title.length;
  if (n <= 14) return 80;
  if (n <= 19) return 66;
  if (n <= 30) return 56;
  return 46;
}

export async function ogCard({ eyebrow, title, lines = [], action }: OgCardProps): Promise<ImageResponse> {
  const src = await logo();
  const size = titleSize(title);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: `linear-gradient(180deg, ${NAVY_DEEP} 0%, ${NAVY} 42%, ${CORAL} 77%, ${GOLD} 88%)`,
          fontFamily: 'Geist',
        }}
      >
        {/* Sun glow behind the logo */}
        <div
          style={{
            position: 'absolute',
            left: 700,
            top: 80,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(240,180,41,0.55) 0%, rgba(240,180,41,0.18) 45%, rgba(240,180,41,0) 70%)',
          }}
        />

        {/* The logo, rising behind the ridge. The frame stops above the
            wordmark at the foot of the image, so only the sun and bird show. */}
        <div
          style={{
            position: 'absolute',
            left: 767,
            top: 150,
            width: 346,
            height: 336,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={346} height={374} alt="" />
        </div>

        {/* The ridge line and the dark ground under it */}
        <svg
          width="1200"
          height="200"
          viewBox="0 0 1200 200"
          style={{ position: 'absolute', left: 0, top: 430 }}
        >
          <path
            d="M0 74 C 120 52, 230 46, 340 62 C 450 78, 540 92, 660 80 C 780 68, 860 40, 980 50 C 1080 58, 1150 72, 1200 66 L 1200 200 L 0 200 Z"
            fill={INK}
          />
        </svg>

        {/* The words */}
        <div
          style={{
            position: 'absolute',
            left: 72,
            top: 64,
            width: 660,
            height: 420,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {eyebrow ? (
            <div
              style={{
                fontSize: 24,
                letterSpacing: 4,
                color: GOLD,
                textTransform: 'uppercase',
                WebkitTextStroke: `0.6px ${GOLD}`,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              marginTop: eyebrow ? 14 : 0,
              fontSize: size,
              lineHeight: 1.08,
              color: '#ffffff',
              letterSpacing: -1,
              WebkitTextStroke: `${Math.max(1.2, size / 40)}px #ffffff`,
              display: 'flex',
            }}
          >
            {title}
          </div>
          {lines.map((line) => (
            <div key={line} style={{ marginTop: 14, fontSize: 30, lineHeight: 1.3, color: 'rgba(255,255,255,0.9)' }}>
              {line}
            </div>
          ))}
          {action ? (
            <div style={{ display: 'flex', marginTop: 26 }}>
              <div
                style={{
                  display: 'flex',
                  padding: '14px 30px',
                  borderRadius: 9999,
                  background: '#ffffff',
                  color: NAVY,
                  fontSize: 28,
                  WebkitTextStroke: `0.8px ${NAVY}`,
                }}
              >
                {action}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer on the dark ground */}
        <div
          style={{
            position: 'absolute',
            left: 72,
            bottom: 34,
            display: 'flex',
            fontSize: 24,
            color: 'rgba(255,255,255,0.72)',
            letterSpacing: 1,
          }}
        >
          birdleague.app
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

/** The card the home page, /support and /privacy share. */
export function homeCard(): Promise<ImageResponse> {
  return ogCard({ title: 'Bird League', lines: ['Fantasy birding. Real birds.'] });
}

/** An open league invite (signing up or on hold), or a seat to take over. Anything else is the neutral card. */
export function leagueInviteCard(preview: LeagueInvitePreview | null): Promise<ImageResponse> {
  if (!preview?.success || !preview.league_name) return neutralInviteCard();

  const name = clip(preview.league_name, 48);

  if (preview.status === 'replacement') {
    return ogCard({ eyebrow: 'Seat in a league', title: name, action: 'Take over the seat' });
  }
  if (preview.status !== 'signing_up' && preview.status !== 'on_hold') {
    return neutralInviteCard();
  }

  const n = preview.member_count ?? 0;
  const max = preview.max_members;
  const lines = [max != null ? `${n} of ${max} birders in` : `${n} ${n === 1 ? 'birder' : 'birders'} in`];
  if (preview.commissioner_name) lines.push(`Commissioner: ${clip(preview.commissioner_name, 32)}`);

  return ogCard({ eyebrow: 'League invite', title: name, lines, action: 'Join the league' });
}

/** An open duel challenge. Accepted, declined, expired or unknown is the neutral card. */
export function duelCard(preview: DuelPreview | null): Promise<ImageResponse> {
  if (!preview || preview.status !== 'pending') return neutralInviteCard();

  const who = clip(preview.challenger_name ?? 'A birder', 22);
  const points = `${preview.points} ${preview.points === 1 ? 'point' : 'points'}`;

  return ogCard({
    eyebrow: 'Duel challenge',
    title: `${who} wants a duel`,
    lines: ['One week. Every bird counts. Most points wins.', `${who}: ${preview.species_count} species, ${points}`],
    action: 'Take the challenge',
  });
}

/** What a dead, unknown or finished invite or duel link shows. Never an error. */
export function neutralInviteCard(): Promise<ImageResponse> {
  return ogCard({ title: 'Bird League invite', lines: ['Fantasy birding. Real birds.'] });
}
