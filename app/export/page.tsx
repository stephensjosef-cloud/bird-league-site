import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import EbirdExport from '@/components/EbirdExport';

// birdleague.app/export: a player signs in with their Bird League email and
// password and downloads their birds as eBird Record Format files, which they
// upload at ebird.org themselves (EBIRD-EXPORT-WEB, Josef's ruling of
// 2026-10-13). Bird League sends nothing to eBird.
//
// This server component only reads SUPABASE_URL and SUPABASE_ANON_KEY and
// hands them to the browser component, which signs in and makes the calls
// (see the headers of lib/supabase.ts and lib/supabase-browser.ts). Universal
// links claim only /d/* and /join/*, so this page opens in the browser even on
// a phone with the app.

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Send your birds to eBird | Bird League',
  description: 'Download your Bird League birds as a file eBird can import.',
  // A signed-in tool, not a page anyone should land on from search.
  robots: { index: false, follow: false },
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
const footer: CSSProperties = {
  margin: '24px 0 0',
  fontSize: 14,
  color: '#6b7280',
};

export default function ExportPage() {
  const url = process.env.SUPABASE_URL ?? '';
  const anonKey = process.env.SUPABASE_ANON_KEY ?? '';
  return (
    <main style={wrap}>
      <EbirdExport url={url} anonKey={anonKey} />
      <p style={footer}>
        <Link href="/">Bird League</Link>
      </p>
    </main>
  );
}
