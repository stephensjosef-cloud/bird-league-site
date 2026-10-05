import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client for the public duel preview.
//
// This is the FIRST backend call this site has ever made. It exists for one
// thing: /d/[code] asking the database who sent a duel challenge, so a
// signed-out browser can render the invite.
//
// IT MAY CALL EXACTLY TWO FUNCTIONS: get_duel_preview (/d/[code]) and
// get_league_invite_preview (/join/[code], JOIN-LINK-SERVER 2026-10-03). They
// are the only two anon-executable functions in the database's `public`
// schema, and both are deliberately narrow: each takes a code and returns
// display fields with no id of any kind. Everything else requires an
// authenticated caller and is unreachable from here. If you find yourself
// wanting a third call from this site, that is a decision to make in the app
// repo first, not a line to add here.
//
// The variables are NOT prefixed NEXT_PUBLIC_. The anon key is public-safe by
// design and already ships inside the iOS binary, but this client only ever
// runs on the server, so there is no reason to inline it into the browser
// bundle as well. Set both in the Vercel project settings:
//
//   SUPABASE_URL       https://<project-ref>.supabase.co
//   SUPABASE_ANON_KEY  the anon / publishable key from the Supabase dashboard
//
// Never put the service_role key here. It is not needed and would be a real
// credential sitting behind a public page.

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

/**
 * Returns a client, or null when the environment is not configured.
 *
 * Null rather than a throw on purpose: a missing variable should render the
 * page's "we cannot load this right now" state, not a 500. The duel link is
 * something a person was sent by a friend, and a stack trace is a worse answer
 * than a sentence.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type DuelPreview = {
  challenger_name: string | null;
  avatar_key: string | null;
  species_count: number;
  points: number;
  expires_at: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'not_found';
};

/**
 * Reads a duel challenge by its code. Returns null when the lookup could not
 * be made at all, which the page renders differently from a code that is
 * genuinely unknown (the RPC answers that with status 'not_found').
 */
export async function fetchDuelPreview(code: string): Promise<DuelPreview | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc('get_duel_preview', { p_code: code });

  // The RPC returns jsonb {status: 'not_found'} for an unknown code rather
  // than an error, so `error` here means the call itself failed.
  if (error || !data) return null;
  return data as DuelPreview;
}

export type LeagueInviteStatus =
  | 'signing_up'
  | 'on_hold'
  | 'started'
  | 'finished'
  | 'full'
  // FC-SERVER-1 part 8: the code is a seat-replacement code, not an invite
  // code. Only league_name comes with it.
  | 'replacement'
  | 'not_found';

export type LeagueInvitePreview = {
  success: boolean;
  status: LeagueInviteStatus;
  league_name?: string | null;
  member_count?: number;
  /** Null means the league has no cap. */
  max_members?: number | null;
  /** A UTC instant, or null when there is no fixed kickoff (on hold, or a pod). */
  kickoff_at?: string | null;
  commissioner_name?: string | null;
  game?: 'open' | 'draft';
  weeks?: number | null;
};

/**
 * Reads a league by its invite code. Returns null when the lookup could not
 * be made at all; an unknown, inactive or duel code comes back as
 * {success: false, status: 'not_found'} rather than as an error.
 */
export async function fetchLeagueInvitePreview(code: string): Promise<LeagueInvitePreview | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc('get_league_invite_preview', { p_code: code });
  if (error || !data) return null;
  return data as LeagueInvitePreview;
}
