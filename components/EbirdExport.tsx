'use client';

import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import type { AuthError, SupabaseClient } from '@supabase/supabase-js';
import { splitExport } from '@/lib/ebird-export-files';
import { createExportClient, type EbirdExport as ExportData } from '@/lib/supabase-browser';

// The body of /export (EBIRD-EXPORT-WEB). Sign in, read the player's own
// birds with get_ebird_export, save them as eBird Record Format files on this
// device, then mark the batch sent with confirm_ebird_export. Every call it
// makes is listed in lib/supabase-browser.ts; add none here.
//
// Styling follows /join and /d: inline CSSProperties, navy #2c4a7c, coral
// #e8632a, ink #1a1a2e, muted #6b7280.

const card: CSSProperties = {
  width: '100%',
  maxWidth: 460,
  background: '#ffffff',
  border: '1px solid rgba(44,74,124,0.09)',
  borderRadius: 20,
  padding: '32px 28px',
  boxShadow: '0 12px 40px rgba(44,74,124,0.08)',
};
const eyebrow: CSSProperties = {
  margin: 0,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '1.4px',
  textTransform: 'uppercase',
  color: '#e8632a',
  textAlign: 'center',
};
const heading: CSSProperties = {
  margin: '14px 0 0',
  fontSize: 'clamp(26px,6vw,32px)',
  fontWeight: 800,
  letterSpacing: '-0.5px',
  color: '#1a1a2e',
  lineHeight: 1.2,
  textAlign: 'center',
};
const sub: CSSProperties = {
  margin: '12px 0 0',
  fontSize: 16,
  lineHeight: 1.6,
  color: '#6b7280',
  textAlign: 'center',
};
const label: CSSProperties = {
  display: 'block',
  margin: '20px 0 6px',
  fontSize: 15,
  fontWeight: 700,
  color: '#1a1a2e',
};
const input: CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '13px 14px',
  borderRadius: 12,
  border: '1.5px solid rgba(44,74,124,0.25)',
  fontSize: 17,
  fontFamily: 'inherit',
  color: '#1a1a2e',
  background: '#ffffff',
};
const cta: CSSProperties = {
  display: 'block',
  width: '100%',
  margin: '24px 0 0',
  padding: '15px 20px',
  borderRadius: 12,
  border: 'none',
  background: '#e8632a',
  color: '#ffffff',
  fontSize: 17,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
};
const ctaSecondary: CSSProperties = {
  ...cta,
  margin: '12px 0 0',
  background: '#ffffff',
  border: '2px solid #2c4a7c',
  color: '#2c4a7c',
};
const errorLine: CSSProperties = {
  margin: '16px 0 0',
  fontSize: 15,
  lineHeight: 1.5,
  color: '#b42318',
  textAlign: 'center',
};
const note: CSSProperties = {
  margin: '14px 0 0',
  fontSize: 14,
  lineHeight: 1.5,
  color: '#6b7280',
  textAlign: 'center',
};
const summary: CSSProperties = {
  margin: '20px 0 0',
  fontSize: 20,
  fontWeight: 700,
  lineHeight: 1.4,
  color: '#2c4a7c',
  textAlign: 'center',
};
const checkRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  margin: '20px 0 0',
  fontSize: 16,
  color: '#1a1a2e',
  cursor: 'pointer',
};
const steps: CSSProperties = {
  margin: '20px 0 0',
  paddingLeft: 22,
  fontSize: 16,
  lineHeight: 1.6,
  color: '#1a1a2e',
};
const linkButton: CSSProperties = {
  display: 'block',
  margin: '24px auto 0',
  padding: 4,
  border: 'none',
  background: 'none',
  color: '#2c4a7c',
  fontSize: 15,
  fontWeight: 600,
  fontFamily: 'inherit',
  cursor: 'pointer',
};

type Phase = 'signed_out' | 'loading' | 'ready' | 'done';

function plural(n: number, one: string, many: string): string {
  return `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`;
}

/** One plain line for a sign-in failure. Never the raw error text. */
function signInMessage(error: AuthError): string {
  if (error.code === 'invalid_credentials') return 'That email and password do not match a Bird League account.';
  if (error.code === 'email_not_confirmed') return 'Confirm your email first, using the link Bird League sent you.';
  if (error.status === 429) return 'Too many tries. Wait a minute, then try again.';
  if (!error.status) return 'Could not reach Bird League. Try again in a moment.';
  return 'Could not sign in. Try again.';
}

/** Saves one text file through the browser's own download. */
function saveFile(name: string, text: string) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(href), 10_000);
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function EbirdExport({ url, anonKey }: { url: string; anonKey: string }) {
  const client: SupabaseClient | null = useMemo(
    () => (url && anonKey ? createExportClient(url, anonKey) : null),
    [url, anonKey],
  );

  const [phase, setPhase] = useState<Phase>('signed_out');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [includeSent, setIncludeSent] = useState(false);
  const [data, setData] = useState<ExportData | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [confirmFailed, setConfirmFailed] = useState(false);

  if (!client) {
    return (
      <div style={card}>
        <p style={eyebrow}>Bird League</p>
        <h1 style={heading}>We cannot load this page right now</h1>
        <p style={sub}>Try again in a moment.</p>
      </div>
    );
  }

  async function signOutLocal(message: string | null) {
    // 'local' signs out this page only. The default would also sign the
    // player out of the app on their phone.
    try {
      await client!.auth.signOut({ scope: 'local' });
    } catch {
      // The session is in memory only; dropping it below is enough.
    }
    setData(null);
    setSaved([]);
    setConfirmFailed(false);
    setIncludeSent(false);
    setPassword('');
    setError(message);
    setPhase('signed_out');
  }

  async function loadExport(include: boolean) {
    setPhase('loading');
    setError(null);
    setData(null);
    let result: { data: unknown; error: unknown };
    try {
      result = await client!.rpc('get_ebird_export', { p_include_exported: include });
    } catch {
      result = { data: null, error: true };
    }
    const payload = result.data as (Partial<ExportData> & { success?: boolean; error?: string }) | null;
    if (result.error || !payload) {
      setError('Could not reach Bird League. Try again in a moment.');
      setPhase('ready');
      return;
    }
    if (!payload?.success) {
      if (payload.error === 'Not authenticated') {
        await signOutLocal('Your sign-in ended. Sign in again.');
        return;
      }
      setError(payload.error || 'Could not build the export. Try again.');
      setPhase('ready');
      return;
    }
    setData({
      success: true,
      batch_id: payload.batch_id ?? null,
      birds: payload.birds ?? 0,
      checklists: payload.checklists ?? 0,
      files: payload.files ?? 0,
      file_starts: payload.file_starts ?? [],
      lines: Array.isArray(payload.lines) ? payload.lines : [],
      outside_us: payload.outside_us ?? 0,
      no_location: payload.no_location ?? 0,
      unplaced: payload.unplaced ?? 0,
    });
    setPhase('ready');
  }

  async function onSignIn(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error: authError } = await client!.auth.signInWithPassword({ email: cleanEmail, password });
      if (authError) {
        setError(signInMessage(authError));
        return;
      }
      setPassword('');
      await loadExport(includeSent);
    } catch {
      setError('Could not reach Bird League. Try again in a moment.');
    } finally {
      setBusy(false);
    }
  }

  async function onToggleInclude(next: boolean) {
    setIncludeSent(next);
    await loadExport(next);
  }

  async function onDownload() {
    if (!data || !data.batch_id || data.lines.length === 0 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const files = splitExport(data.lines, new Date());
      for (let i = 0; i < files.length; i++) {
        if (i > 0) await wait(400);
        saveFile(files[i].name, files[i].text);
      }
      setSaved(files.map((f) => f.name));

      let marked = false;
      try {
        const { data: confirm, error: confirmError } = await client!.rpc('confirm_ebird_export', {
          p_batch_id: data.batch_id,
        });
        marked = !confirmError && !!(confirm as { success?: boolean } | null)?.success;
      } catch {
        marked = false;
      }
      setConfirmFailed(!marked);
      setPhase('done');
    } catch {
      setError('Could not save the file. Try again.');
    } finally {
      setBusy(false);
    }
  }

  if (phase === 'signed_out') {
    return (
      <div style={card}>
        <p style={eyebrow}>eBird export</p>
        <h1 style={heading}>Send your birds to eBird</h1>
        <p style={sub}>
          Sign in with your Bird League email and password to download your birds as a file eBird can import. You
          upload it at ebird.org yourself. Bird League sends nothing to eBird.
        </p>
        <form onSubmit={onSignIn} noValidate>
          <label style={label} htmlFor="export-email">
            Email
          </label>
          <input
            id="export-email"
            style={input}
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label style={label} htmlFor="export-password">
            Password
          </label>
          <input
            id="export-password"
            style={input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p style={errorLine} role="alert">
              {error}
            </p>
          )}
          <button type="submit" style={{ ...cta, opacity: busy ? 0.7 : 1 }} disabled={busy}>
            {busy ? 'Signing in' : 'Sign in'}
          </button>
        </form>
        <p style={note}>Forgot your password? Reset it in the Bird League app.</p>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div style={card}>
        <p style={eyebrow}>eBird export</p>
        <h1 style={heading}>{saved.length === 1 ? 'Your file is saved' : 'Your files are saved'}</h1>
        <p style={sub}>{saved.join(', ')}</p>
        {confirmFailed && (
          <p style={errorLine} role="alert">
            Your files are saved, but we could not mark these birds as sent, so the next export will include them
            again.
          </p>
        )}
        <ol style={steps}>
          <li>
            On{' '}
            <a href="https://ebird.org" target="_blank" rel="noreferrer">
              ebird.org
            </a>
            , go to Submit, then Import Data. Choose eBird Record Format and upload{' '}
            {saved.length === 1 ? 'the file' : 'each file'}.
          </li>
          <li>Check that each location matches where you saw the birds.</li>
          <li>Submit.</li>
        </ol>
        <button type="button" style={ctaSecondary} onClick={() => loadExport(includeSent)}>
          Back to my export
        </button>
        <button type="button" style={linkButton} onClick={() => signOutLocal(null)}>
          Sign out
        </button>
      </div>
    );
  }

  // loading or ready
  const birds = data?.birds ?? 0;
  return (
    <div style={card}>
      <p style={eyebrow}>eBird export</p>
      <h1 style={heading}>Send your birds to eBird</h1>

      {phase === 'loading' && <p style={sub}>Getting your birds</p>}

      {phase === 'ready' && data && birds > 0 && (
        <>
          <p style={summary}>
            {plural(birds, 'bird', 'birds')} on {plural(data.checklists, 'checklist', 'checklists')} ready to send to
            eBird
          </p>
          {data.no_location > 0 && (
            <p style={note}>
              {plural(data.no_location, 'bird has', 'birds have')} no location, so eBird will ask where you saw{' '}
              {data.no_location === 1 ? 'it' : 'them'}.
            </p>
          )}
          {data.outside_us > 0 && (
            <p style={note}>
              {plural(data.outside_us, 'bird was', 'birds were')} seen outside the United States, so eBird will ask
              you to confirm the place.
            </p>
          )}
          {data.unplaced > 0 && (
            <p style={note}>
              {plural(data.unplaced, 'bird', 'birds')} could not be matched to an eBird name, so{' '}
              {data.unplaced === 1 ? 'it is' : 'they are'} left out.
            </p>
          )}
        </>
      )}

      {phase === 'ready' && data && birds === 0 && (
        <p style={sub}>Nothing new to send. Tick Include birds I already sent to download everything again.</p>
      )}

      {error && (
        <p style={errorLine} role="alert">
          {error}
        </p>
      )}

      <label style={checkRow}>
        <input
          type="checkbox"
          checked={includeSent}
          disabled={phase === 'loading' || busy}
          onChange={(e) => onToggleInclude(e.target.checked)}
          style={{ width: 20, height: 20, accentColor: '#2c4a7c' }}
        />
        Include birds I already sent
      </label>

      {phase === 'ready' && !data && (
        <button type="button" style={ctaSecondary} onClick={() => loadExport(includeSent)}>
          Try again
        </button>
      )}

      <button
        type="button"
        style={{ ...cta, opacity: !data || birds === 0 || busy || phase === 'loading' ? 0.5 : 1 }}
        disabled={!data || birds === 0 || busy || phase === 'loading'}
        onClick={onDownload}
      >
        Download
      </button>

      <button type="button" style={linkButton} onClick={() => signOutLocal(null)}>
        Sign out
      </button>
    </div>
  );
}
