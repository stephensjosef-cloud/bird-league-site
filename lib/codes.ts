import { fetchLeagueInvitePreview, type LeagueInvitePreview } from '@/lib/supabase';

// Code checks and the league invite read, shared by the /join and /d pages and
// their link preview images, so a page and its picture read the same data.

/** League invite codes are letters and digits. Anything else cannot match. */
export function normalizeLeagueCode(raw: string): string | null {
  let c: string;
  try {
    c = decodeURIComponent(raw);
  } catch {
    return null;
  }
  c = c.trim().toUpperCase();
  return /^[A-Z0-9]{4,16}$/.test(c) ? c : null;
}

/** A duel code is eight characters, no 0, O, 1 or I. Anything else cannot match. */
export function normalizeDuelCode(raw: string): string | null {
  let c: string;
  try {
    c = decodeURIComponent(raw);
  } catch {
    return null;
  }
  c = c.trim().toUpperCase();
  return /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$/.test(c) ? c : null;
}

/** The league code from a /join path and its preview. A bad code never reaches the database. */
export async function loadLeagueInvite(
  raw: string,
): Promise<{ code: string | null; preview: LeagueInvitePreview | null }> {
  const code = normalizeLeagueCode(raw);
  if (!code) return { code: null, preview: { success: false, status: 'not_found' } };
  return { code, preview: await fetchLeagueInvitePreview(code) };
}
