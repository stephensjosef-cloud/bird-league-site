import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

// Shared shell for the long-form document pages, /privacy and /support.
//
// The body copy on those pages is legal text. It is mirrored from
// docs/privacy.html and docs/support.html in the bird-league-app repo, which is
// the source of record. See README.md. This component owns presentation only.
// Never edit wording here without editing docs/ in the app repo first.
//
// Styling follows the landing page's idiom: inline CSSProperties, brand navy
// #2c4a7c, coral #e8632a, ink #1a1a2e, muted #6b7280. Links inherit the global
// `a` rule in app/globals.css (navy, coral on hover).

export const legalStyles = {
  h2: {
    fontSize: 20,
    fontWeight: 700,
    margin: '36px 0 10px',
    color: '#2c4a7c',
    lineHeight: 1.3,
  } as CSSProperties,
  h3: {
    fontSize: 17,
    fontWeight: 700,
    margin: '22px 0 6px',
    color: '#1a1a2e',
    lineHeight: 1.3,
  } as CSSProperties,
  p: {
    margin: '0 0 14px',
    fontSize: 17,
    lineHeight: 1.6,
  } as CSSProperties,
  ul: {
    margin: '0 0 14px',
    paddingLeft: 22,
    fontSize: 17,
    lineHeight: 1.6,
  } as CSSProperties,
  li: { margin: '0 0 6px' } as CSSProperties,
  panel: {
    background: '#ffffff',
    border: '1px solid rgba(44,74,124,0.09)',
    borderRadius: 12,
    padding: '20px 22px',
    margin: '24px 0',
  } as CSSProperties,
  panelEmail: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
  } as CSSProperties,
};

export default function LegalPage({
  title,
  meta,
  children,
  footer,
}: {
  title: string;
  meta: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div style={{ background: '#fafaff', color: '#1a1a2e', minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 20px 64px' }}>
        <header
          style={{
            padding: '40px 0 24px',
            borderBottom: '3px solid #e8632a',
            marginBottom: 32,
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 18,
              color: '#2c4a7c',
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: '#2c4a7c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '-0.5px',
              }}
            >
              BL
            </span>
            <span
              style={{
                fontSize: 13,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              Bird League
            </span>
          </Link>
          <h1
            style={{
              fontSize: 'clamp(25px,6vw,30px)',
              lineHeight: 1.2,
              margin: '0 0 8px',
              color: '#2c4a7c',
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: 0 }}>{meta}</p>
        </header>

        <main>{children}</main>

        <footer
          style={{
            marginTop: 48,
            paddingTop: 20,
            borderTop: '1px solid rgba(44,74,124,0.09)',
            fontSize: 14,
            color: '#6b7280',
          }}
        >
          {footer}
        </footer>
      </div>
    </div>
  );
}
