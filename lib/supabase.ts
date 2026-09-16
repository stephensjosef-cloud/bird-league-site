import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client for the public duel preview.
//
// This is the FIRST backend call this site has ever made. It exists for one
// thing: /d/[code] asking the database who sent a duel challenge, so a
// signed-out browser can render the invite.
//
// THE ONLY FUNCTION IT MAY CALL IS get_duel_preview. That RPC is the single
// anon-executable function in the database's `public` schema (CLAUDE.md
// DUEL-1), and it is deliberately narrow: it takes a code and returns six
// display fields with no id of any kind. Every other duel RPC requires an
// authenticated caller and is unreachable from here. If you find yourself
// wanting a second call from this site, that is a decision to make in the app
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
