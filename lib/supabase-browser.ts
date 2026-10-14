import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The browser Supabase client for /export, and only /export (EBIRD-EXPORT-WEB,
// Josef's ruling of 2026-10-13). Read the header of lib/supabase.ts first: the
// server client there stays anon-only. This one runs in the player's browser,
// signed in as that player.
//
// IT MAY MAKE EXACTLY FOUR CALLS:
//   auth.signInWithPassword   the player's own Bird League email and password
//   auth.signOut              scope 'local' ONLY: the default 'global' would
//                             also sign the player out of the app on the phone
//   get_ebird_export          their own birds as eBird Record Format lines
//   confirm_ebird_export      marks a batch they downloaded as sent
// Both RPCs answer {success, error} and never raise; read them with the strict
// !data?.success test.
//
// No session is saved anywhere: persistSession false keeps it in this page's
// memory, so closing the tab signs the player out. No cookies, no
// @supabase/ssr, no NEXT_PUBLIC_ variable. The URL and anon key come from
// app/export/page.tsx, which reads SUPABASE_URL and SUPABASE_ANON_KEY on the
// server and passes them down. The anon key is public by design.

export function createExportClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      // Refreshing happens in memory, so a page left open past the hour keeps
      // working. Nothing is written to storage either way.
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}

export type EbirdExport = {
  success: true;
  batch_id: string | null;
  birds: number;
  checklists: number;
  files: number;
  file_starts: number[];
  lines: string[];
  outside_us: number;
  no_location: number;
  unplaced: number;
};
