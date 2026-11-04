import type { CSSProperties } from 'react';

// LOOK-EMAIL-FIX 7. The look shared by the email-link fallback pages,
// /league/[id] and /pecking-order. They are built like /clan/[key]: on an
// iPhone with Bird League installed iOS opens the app and the page never
// renders; everyone else gets "Open in Bird League" and the install button.
// Inline CSSProperties, navy #2c4a7c, coral #e8632a, ink #1a1a2e, muted
// #6b7280, as the invite pages.

export const wrap: CSSProperties = {
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 20px',
  background: '#f7f9fc',
};
export const card: CSSProperties = {
  width: '100%',
  maxWidth: 460,
  background: '#ffffff',
  border: '1px solid rgba(44,74,124,0.09)',
  borderRadius: 20,
  padding: '32px 28px',
  textAlign: 'center',
  boxShadow: '0 12px 40px rgba(44,74,124,0.08)',
};
export const eyebrow: CSSProperties = {
  margin: 0,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '1.4px',
  textTransform: 'uppercase',
  color: '#e8632a',
};
export const heading: CSSProperties = {
  margin: '14px 0 0',
  fontSize: 'clamp(26px,6vw,34px)',
  fontWeight: 800,
  letterSpacing: '-0.5px',
  color: '#1a1a2e',
  lineHeight: 1.2,
  overflowWrap: 'anywhere',
};
export const sub: CSSProperties = {
  margin: '12px 0 0',
  fontSize: 17,
  lineHeight: 1.6,
  color: '#6b7280',
};
export const cta: CSSProperties = {
  display: 'block',
  margin: '28px 0 0',
  padding: '15px 20px',
  borderRadius: 12,
  background: '#e8632a',
  color: '#ffffff',
  fontSize: 17,
  fontWeight: 700,
  textDecoration: 'none',
};
export const ctaSecondary: CSSProperties = {
  display: 'block',
  margin: '12px 0 0',
  padding: '14px 20px',
  borderRadius: 12,
  background: '#ffffff',
  border: '2px solid #2c4a7c',
  color: '#2c4a7c',
  fontSize: 17,
  fontWeight: 700,
  textDecoration: 'none',
};
export const footer: CSSProperties = {
  margin: '24px 0 0',
  fontSize: 14,
  color: '#6b7280',
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A league id from the path, lowercased, or null. The app reads the same shape. */
export function leagueIdFrom(raw: string): string | null {
  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    return null;
  }
  id = id.trim();
  return UUID.test(id) ? id.toLowerCase() : null;
}
