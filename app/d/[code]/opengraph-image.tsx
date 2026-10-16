import { normalizeDuelCode } from '@/lib/codes';
import { duelCard, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';
import { fetchDuelPreview } from '@/lib/supabase';

// The picture a /d/<CODE> link shows when it is pasted into a message: who
// sent the challenge, the rules in one line, and the challenger's species and
// points, from the same get_duel_preview read the page makes. A challenge that
// is not open (accepted, declined, expired, unknown, or a failed read) gets the
// neutral invite card instead, never an error. The words are duelCard in
// lib/og.tsx.

export const alt = 'A Bird League duel challenge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const dynamic = 'force-dynamic';

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const clean = normalizeDuelCode(code);
  return duelCard(clean ? await fetchDuelPreview(clean) : null);
}
