'use client';

import { useState, type CSSProperties } from 'react';

// The "Copy code" button on /join/<CODE> (BUGFIX-SERVER 8).
//
// A league link opened before the app is installed loses its code and its
// ?by= on the way through the App Store. This copies both, as
// "<league code> <recruit code>" (just the league code when the link had no
// ?by=), so the birder can paste them on the app's first screen after
// installing. The clipboard is written only when the button is tapped.

const button: CSSProperties = {
  display: 'block',
  width: '100%',
  margin: '16px 0 0',
  padding: '14px 20px',
  borderRadius: 12,
  background: '#ffffff',
  border: '2px solid #2c4a7c',
  color: '#2c4a7c',
  fontSize: 17,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

/** The legacy path, for browsers without the async clipboard API. */
function copyWithSelection(text: string): boolean {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}

export default function CopyCode({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function copy() {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) ok = copyWithSelection(text);
    setState(ok ? 'copied' : 'failed');
    if (ok) window.setTimeout(() => setState('idle'), 2500);
  }

  const label =
    state === 'copied' ? 'Copied' : state === 'failed' ? 'Could not copy. Type the code above instead.' : 'Copy code';

  return (
    <button type="button" style={button} onClick={copy} aria-live="polite">
      {label}
    </button>
  );
}
