import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { legalStyles as s } from '@/components/LegalPage';

// SOURCE OF RECORD: docs/support.html in the bird-league-app repo.
// This page mirrors it. It is the target of the App Store support URL, which
// Apple requires to be reachable without installing the app. Do not edit the
// copy here. Edit docs/support.html first, then mirror.

export const metadata: Metadata = {
  title: 'Support - Bird League',
  description:
    'How to get help with Bird League, answers to common questions, and how to report a problem.',
};

export default function SupportPage() {
  return (
    <LegalPage title="Support" meta="Get in, we're going birding" footer={
      <p style={{ margin: 0 }}>
        <Link href="/privacy">Privacy Policy</Link>
      </p>
    }>
      <h2 style={s.h2}>What Bird League is</h2>
      <p style={s.p}>
        Bird League is fantasy sports for birdwatching. You log the birds you actually see out in
        the real world, each species is worth points based on how rare it is, and you go head to
        head against someone else in your league every week.
      </p>
      <p style={s.p}>
        Log a sighting by photo, by sound, or by typing the species name. It lands on your lifetime
        Life List right away, and if you are in a league it scores for your week. Weeks close on a
        schedule, standings update, and a season runs all the way to a championship.
      </p>
      <p style={s.p}>
        Bird League is free to play. There are no ads and there is nothing to buy.
      </p>

      <h2 style={s.h2}>Getting help</h2>
      <p style={s.p}>
        Email us. A real person reads it, and most questions get answered within a couple of days.
      </p>

      <div style={s.panel}>
        <p style={{ margin: '0 0 10px', fontSize: 17, lineHeight: 1.6 }}>
          Support and general questions
        </p>
        <p style={s.panelEmail}>
          <a href="mailto:birdleaguehq@gmail.com">birdleaguehq@gmail.com</a>
        </p>
      </div>

      <p style={s.p}>It speeds things up a lot if you include:</p>
      <ul style={s.ul}>
        <li style={s.li}>The email address on your Bird League account</li>
        <li style={s.li}>What you were doing when the problem happened</li>
        <li style={s.li}>The name of your league, if the problem involves one</li>
        <li style={s.li}>Your device and iOS version</li>
        <li style={s.li}>A screenshot, if there is something to see</li>
      </ul>

      <h2 style={s.h2}>Common questions</h2>

      <h3 style={s.h3}>How do I delete my account?</h3>
      <p style={s.p}>
        Open the app, go to the Profile tab, scroll to the bottom, and tap Delete Account. You will
        be asked to confirm. This permanently deletes your account and you cannot undo it.
      </p>

      <h3 style={s.h3}>Do I need a league to use the app?</h3>
      <p style={s.p}>
        No. You can log sightings to your personal Life List without joining anything. Leagues add
        the weekly head to head competition on top.
      </p>

      <h3 style={s.h3}>How do I join a league?</h3>
      <p style={s.p}>
        Go to the Leagues tab. You can create your own league and invite friends, browse open
        leagues that are accepting members, or enter an invite code someone sent you.
      </p>

      <h3 style={s.h3}>My bird was identified wrong.</h3>
      <p style={s.p}>
        Photo and sound identification are best guesses from an AI model, not verdicts. You always
        confirm the species yourself before the sighting is logged. If none of the suggestions look
        right, use manual entry and type the species name.
      </p>

      <h3 style={s.h3}>Why does the app ask for my location?</h3>
      <p style={s.p}>
        So your sightings can be plotted on your personal map and so the app can suggest species
        that are actually around you. Location is optional. If you decline, everything else in the
        app still works.
      </p>

      <h3 style={s.h3}>Why is my sighting waiting for review?</h3>
      <p style={s.p}>
        Some leagues ask for photo proof on rarer birds. Your commissioner sets that when they
        create the league. A sighting in the review queue scores as soon as it is approved.
      </p>

      <h3 style={s.h3}>I did not get a notification.</h3>
      <p style={s.p}>
        Check Settings inside the app, where each notification type can be turned on or off
        individually, then check that Bird League is allowed to send notifications in your iOS
        Settings.
      </p>

      <h3 style={s.h3}>I forgot my password.</h3>
      <p style={s.p}>
        Tap Sign In on the welcome screen, then use the password reset link. A reset email goes to
        the address on your account.
      </p>

      <h2 style={s.h2}>Reporting a problem with another user</h2>
      <p style={s.p}>
        If someone in your league is behaving badly, email{' '}
        <a href="mailto:birdleaguehq@gmail.com">birdleaguehq@gmail.com</a> with the league name and
        what happened. We take it seriously and we will act on it.
      </p>

      <h2 style={s.h2}>Privacy</h2>
      <p style={s.p}>
        Our full privacy policy explains what data Bird League collects, how it is used, and what
        your rights are.
      </p>
      <p style={s.p}>
        <Link href="/privacy">Read the Bird League Privacy Policy</Link>
      </p>
      <p style={s.p}>
        Privacy-specific questions go to{' '}
        <a href="mailto:birdleaguehq@gmail.com">birdleaguehq@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
