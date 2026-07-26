'use client';

import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';

const BETA_EMAIL = 'hello@birdleague.app';
const SUN_GLOW = true;

const deskNavLinkStyle: CSSProperties = { fontSize: 15, fontWeight: 600, color: '#2c4a7c' };
const mobileNavLinkStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: '-0.5px',
  color: '#1a1a2e',
  padding: '12px 0',
};
const footerNavLinkStyle: CSSProperties = { fontSize: 14, fontWeight: 600, color: '#6b7280' };
const hamburgerBarStyle: CSSProperties = {
  display: 'block',
  width: 22,
  height: 2,
  borderRadius: 2,
  background: '#2c4a7c',
};
const sectionHeadingStyle: CSSProperties = {
  margin: 0,
  fontSize: 'clamp(28px,6vw,40px)',
  fontWeight: 800,
  letterSpacing: '-0.5px',
};
const sectionSubStyle: CSSProperties = { margin: 0, fontSize: 17, lineHeight: 1.6, color: '#6b7280' };
const howCardStyle: CSSProperties = {
  background: '#ffffff',
  border: '1px solid rgba(44,74,124,0.09)',
  borderRadius: 16,
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};
const howBadgeStyle: CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: 'rgba(240,180,41,0.12)',
  color: '#2c4a7c',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  fontWeight: 800,
};
const howTitleStyle: CSSProperties = { margin: 0, fontSize: 19, fontWeight: 700 };
const howDescStyle: CSSProperties = { margin: 0, fontSize: 15, lineHeight: 1.6, color: '#6b7280' };
const conservationCardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  background: '#ffffff',
  border: '1px solid rgba(44,74,124,0.09)',
  borderRadius: 12,
  padding: '22px 24px',
};

// Populate by adding screenshot files to public/app-images/ and listing them here.
// Shape: { src: string; alt: string }
const APP_IMAGES: { src: string; alt: string }[] = [];

export default function BirdLeagueLanding() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 880px)');
    const onMq = () => {
      setIsDesktop(mq.matches);
      setMenuOpen((prev) => (mq.matches ? false : prev));
    };
    onMq();
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'none';
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );
    const els = document.querySelectorAll<HTMLElement>('[data-fade]');
    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const isMobile = !isDesktop;
  const betaHref = `mailto:${BETA_EMAIL}?subject=Join%20the%20Bird%20League%20Beta`;
  const contactHref = `mailto:${BETA_EMAIL}`;
  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div style={{ background: '#fafaff', color: '#1a1a2e', overflowX: 'hidden' }}>
      {/* Sticky nav */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(250,250,255,0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(44,74,124,0.09)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 20px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1a1a2e' }}>
            <Image
              src="/bird-league-logo.png"
              alt="Bird League"
              width={44}
              height={48}
              style={{ height: 48, width: 'auto' }}
              priority
            />
          </a>
          {isDesktop && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              <a href="#how" style={deskNavLinkStyle}>How To Play</a>
              <a href="#about" style={deskNavLinkStyle}>About</a>
              <a href="#conservation" style={deskNavLinkStyle}>Conservation</a>
              <a href="#chucklefits" style={deskNavLinkStyle}>Chucklefits</a>
              <a href="#contact" style={deskNavLinkStyle}>Contact</a>
            </nav>
          )}
          {isMobile && (
            <button
              onClick={openMenu}
              aria-label="Open menu"
              style={{
                width: 44,
                height: 44,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: 0,
              }}
            >
              <span style={hamburgerBarStyle} />
              <span style={hamburgerBarStyle} />
              <span style={hamburgerBarStyle} />
            </button>
          )}
        </div>
      </header>

      {/* Full-screen mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: '#fafaff',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 24px 40px',
          }}
        >
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: '#2c4a7c',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                }}
              >
                BL
              </span>
              <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.5px' }}>Bird League</span>
            </span>
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              style={{
                width: 44,
                height: 44,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                position: 'relative',
                padding: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 11,
                  top: 21,
                  width: 22,
                  height: 2,
                  borderRadius: 2,
                  background: '#2c4a7c',
                  transform: 'rotate(45deg)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: 11,
                  top: 21,
                  width: 22,
                  height: 2,
                  borderRadius: 2,
                  background: '#2c4a7c',
                  transform: 'rotate(-45deg)',
                }}
              />
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 32 }}>
            <a href="#how" onClick={closeMenu} style={mobileNavLinkStyle}>How To Play</a>
            <a href="#about" onClick={closeMenu} style={mobileNavLinkStyle}>About</a>
            <a href="#conservation" onClick={closeMenu} style={mobileNavLinkStyle}>Conservation</a>
            <a href="#chucklefits" onClick={closeMenu} style={mobileNavLinkStyle}>Chucklefits</a>
            <a href="#contact" onClick={closeMenu} style={mobileNavLinkStyle}>Contact</a>
          </nav>
          <a
            href={betaHref}
            onClick={closeMenu}
            style={{
              marginTop: 'auto',
              display: 'block',
              textAlign: 'center',
              background: '#e8632a',
              color: '#ffffff',
              fontSize: 17,
              fontWeight: 700,
              padding: '16px 32px',
              borderRadius: 999,
            }}
          >
            Join the Beta
          </a>
        </div>
      )}

      {/* Hero */}
      <section id="top" style={{ position: 'relative', padding: 'clamp(72px,14vw,130px) 24px clamp(80px,14vw,140px)' }}>
        {SUN_GLOW && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -120,
              transform: 'translateX(-50%)',
              width: 640,
              height: 640,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(240,180,41,0.22) 0%, rgba(240,180,41,0.12) 35%, rgba(250,250,255,0) 70%)',
              pointerEvents: 'none',
            }}
          />
        )}
        <div
          style={{
            position: 'relative',
            maxWidth: 1100,
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#d4900a',
            }}
          >
            Now in beta
          </span>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(40px,9vw,64px)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: 1.05,
            }}
          >
            Bird League
          </h1>
          <p style={{ margin: 0, fontSize: 'clamp(18px,4.5vw,22px)', lineHeight: 1.5, color: '#6b7280', maxWidth: 480 }}>
            Fantasy birding. Real birds. Real bragging rights.
          </p>
          <a
            href={betaHref}
            className="btn-cta-orange"
            style={{
              marginTop: 12,
              display: 'inline-block',
              background: '#e8632a',
              color: '#ffffff',
              fontSize: 17,
              fontWeight: 700,
              padding: '16px 36px',
              borderRadius: 999,
              boxShadow: '0 8px 24px rgba(232,99,42,0.25)',
            }}
          >
            Join the Beta
          </a>
          <span style={{ fontSize: 14, color: '#6b7280' }}>Free while we test. iOS first.</span>
        </div>
      </section>

      {/* How To Play */}
      <section id="how" style={{ padding: 'clamp(64px,10vw,110px) 24px', background: '#f0f0f8' }}>
        <div
          data-fade="1"
          style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560 }}>
            <h2 style={sectionHeadingStyle}>How to play</h2>
            <p style={sectionSubStyle}>It works like fantasy football. Except the players have feathers.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={howCardStyle}>
              <span style={howBadgeStyle}>1</span>
              <h3 style={howTitleStyle}>Draft your birds</h3>
              <p style={howDescStyle}>Build a roster of real species. Pick safe bets or swing for the rare stuff.</p>
            </div>
            <div style={howCardStyle}>
              <span style={howBadgeStyle}>2</span>
              <h3 style={howTitleStyle}>Get outside</h3>
              <p style={howDescStyle}>Log real-world sightings. The park counts. So does your backyard.</p>
            </div>
            <div style={howCardStyle}>
              <span style={howBadgeStyle}>3</span>
              <h3 style={howTitleStyle}>Score points</h3>
              <p style={howDescStyle}>Rarer birds score bigger. A robin is nice. A rare warbler is a headline.</p>
            </div>
            <div style={howCardStyle}>
              <span style={howBadgeStyle}>4</span>
              <h3 style={howTitleStyle}>Win your week</h3>
              <p style={howDescStyle}>Head-to-head matchups against your league. Bragging rights are on the line.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Images from the App */}
      {APP_IMAGES.length > 0 && (
        <section
          id="app-images"
          style={{ padding: 'clamp(64px,10vw,110px) 24px', background: '#f0f0f8' }}
        >
          <div
            data-fade="1"
            style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}
          >
            <h2 style={sectionHeadingStyle}>Images from the App</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 200px))',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              {APP_IMAGES.map((image) => (
                <div
                  key={image.src}
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '9 / 19.5',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#ffffff',
                    border: '1px solid rgba(44,74,124,0.09)',
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={300}
                    height={650}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section id="about" style={{ padding: 'clamp(64px,10vw,110px) 24px' }}>
        <div
          data-fade="1"
          style={{
            maxWidth: 680,
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <h2 style={sectionHeadingStyle}>About us</h2>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, color: '#6b7280', textWrap: 'pretty' }}>
            Bird League is built by one birder who wanted fantasy football energy for the birding world. No big
            company. No investors. Just a person who thinks Sunday mornings are better with binoculars.
          </p>
        </div>
      </section>

      {/* Conservation */}
      <section id="conservation" style={{ padding: 'clamp(64px,10vw,110px) 24px', background: '#f0f0f8' }}>
        <div
          data-fade="1"
          style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560 }}>
            <h2 style={sectionHeadingStyle}>Conservation</h2>
            <p style={sectionSubStyle}>Birding starts with caring about birds. These groups do the real work. Please support them.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
            <a
              href="https://www.audubon.org"
              target="_blank"
              rel="noopener noreferrer"
              className="conservation-card"
              style={conservationCardStyle}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Audubon Society</span>
              <span style={{ fontSize: 14, color: '#6b7280' }}>audubon.org</span>
            </a>
            <a
              href="https://www.birds.cornell.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="conservation-card"
              style={conservationCardStyle}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Cornell Lab of Ornithology</span>
              <span style={{ fontSize: 14, color: '#6b7280' }}>birds.cornell.edu</span>
            </a>
            <a
              href="https://ebird.org"
              target="_blank"
              rel="noopener noreferrer"
              className="conservation-card"
              style={conservationCardStyle}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>eBird</span>
              <span style={{ fontSize: 14, color: '#6b7280' }}>ebird.org</span>
            </a>
            <a
              href="https://abcbirds.org"
              target="_blank"
              rel="noopener noreferrer"
              className="conservation-card"
              style={conservationCardStyle}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>American Bird Conservancy</span>
              <span style={{ fontSize: 14, color: '#6b7280' }}>abcbirds.org</span>
            </a>
          </div>
        </div>
      </section>

      {/* Chucklefits */}
      <section id="chucklefits" style={{ padding: 'clamp(64px,10vw,110px) 24px' }}>
        <div data-fade="1" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{
              background: '#2c4a7c',
              borderRadius: 24,
              padding: 'clamp(36px,7vw,64px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 20,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#f0b429',
              }}
            >
              Chucklefits
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: 'clamp(26px,5.5vw,36px)',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: '#ffffff',
                maxWidth: 520,
                textWrap: 'pretty',
              }}
            >
              From the same nest: check out Chucklefits.
            </h2>
            {/* TODO: replace href with the real Chucklefits URL */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta-orange"
              style={{
                display: 'inline-block',
                background: '#e8632a',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 700,
                padding: '15px 32px',
                borderRadius: 999,
              }}
            >
              Visit Chucklefits
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: 'clamp(64px,10vw,110px) 24px clamp(80px,12vw,130px)' }}>
        <div
          data-fade="1"
          style={{
            maxWidth: 680,
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <h2 style={sectionHeadingStyle}>Say hello</h2>
          <p style={sectionSubStyle}>Questions, bug reports, bird photos. All welcome.</p>
          <a
            href={contactHref}
            className="btn-cta-navy"
            style={{
              marginTop: 8,
              display: 'inline-block',
              background: '#2c4a7c',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 700,
              padding: '15px 32px',
              borderRadius: 999,
            }}
          >
            Email hello@birdleague.app
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(44,74,124,0.09)', padding: '40px 24px' }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
            <span style={{ fontSize: 14, color: '#6b7280' }}>Copyright 2026 Bird League</span>
          </span>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
            <a href="#how" style={footerNavLinkStyle}>How To Play</a>
            <a href="#about" style={footerNavLinkStyle}>About</a>
            <a href="#conservation" style={footerNavLinkStyle}>Conservation</a>
            <a href="#chucklefits" style={footerNavLinkStyle}>Chucklefits</a>
            <a href="#contact" style={footerNavLinkStyle}>Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
