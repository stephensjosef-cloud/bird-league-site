import { loadLeagueInvite } from '@/lib/codes';
import { leagueInviteCard, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

// The picture a /join/<CODE> link shows when it is pasted into a message: the
// league's name, how full it is and who runs it, from the same
// get_league_invite_preview read the page makes. Anything that is not an open
// invite (an unknown code, a failed read, a league that started, finished or
// filled) gets the neutral invite card instead, never an error. The words are
// leagueInviteCard in lib/og.tsx.

export const alt = 'A Bird League league invite';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const dynamic = 'force-dynamic';

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { preview } = await loadLeagueInvite(code);
  return leagueInviteCard(preview);
}
