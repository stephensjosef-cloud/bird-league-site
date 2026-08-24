import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { legalStyles as s } from '@/components/LegalPage';

// SOURCE OF RECORD: docs/privacy.html in the bird-league-app repo.
// This page mirrors it. The wording below is legal text that is also shown
// in the app during signup and is the target of the App Store privacy policy
// URL. Do not edit the copy here. Edit docs/privacy.html first, then mirror.

export const metadata: Metadata = {
  title: 'Privacy Policy - Bird League',
  description:
    'What data Bird League collects, how it is used, who receives it, and what your rights are.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" meta="Last updated: August 2026" footer={<>
      <p style={{ margin: '0 0 8px' }}>
        This policy is also shown in the Bird League app during signup.
      </p>
      <p style={{ margin: 0 }}>
        <Link href="/support">Support</Link>
      </p>
    </>}>
      <h2 style={s.h2}>1. Information We Collect</h2>
      <p style={s.p}>We collect the following types of information:</p>
      <p style={s.p}>
        Account Information: Email address, display name, date of birth, and password (stored
        securely via our authentication provider).
      </p>
      <p style={s.p}>
        Sighting Data: Species identified, GPS coordinates of sightings, date and time, and
        associated photos or audio recordings you choose to upload.
      </p>
      <p style={s.p}>
        Device Information: Device type, operating system version, and app version for debugging
        and compatibility purposes. If you turn on notifications, we also store a push notification
        token for your device so that we can send them. We do not store your device&apos;s name.
      </p>
      <p style={s.p}>
        Location Data: GPS coordinates are collected when you log a sighting. Location data is
        stored with your sighting records. If you identify a bird by sound, your coordinates are
        also sent to our identification server, described in section 3. We never share location
        data with advertisers.
      </p>

      <h2 style={s.h2}>2. How We Use Your Information</h2>
      <p style={s.p}>We use your information to:</p>
      <ul style={s.ul}>
        <li style={s.li}>Operate and improve the App</li>
        <li style={s.li}>Process and display your sightings, scores, and league standings</li>
        <li style={s.li}>
          Identify birds from audio recordings (processed via our BirdNET integration)
        </li>
        <li style={s.li}>Send you notifications about leagues, matchups, and App updates</li>
        <li style={s.li}>Enforce our Terms of Service</li>
        <li style={s.li}>Respond to support requests</li>
      </ul>

      <h2 style={s.h2}>3. Third-Party Services</h2>
      <p style={s.p}>We use the following third-party services to operate the App:</p>
      <p style={s.p}>
        Supabase: Database hosting, authentication, and file storage (supabase.com). Your account
        data, sightings, and uploaded photos are stored on Supabase infrastructure.
      </p>
      <p style={s.p}>
        Google (Gemini): When you identify a bird by photo, the photo is sent to Google&apos;s
        Gemini API for identification. Nothing is sent when you take or choose a photo. The photo
        stays on your device until you tap Identify this photo, and if you cancel instead, it is
        never sent. Only the image is sent. No user id, no location, and no account information goes
        with it. Google returns candidate species names, confidence scores, and a short description
        of the field marks visible in the photo.
      </p>
      <p style={s.p}>
        BirdNET / Railway: Audio recordings you submit for bird identification are transmitted to
        our BirdNET analysis server hosted on Railway. If you have granted location access, your
        precise GPS coordinates are sent along with the recording to improve identification
        accuracy. No user id or account information is sent.
      </p>
      <p style={s.p}>
        Expo: We use Expo to build the App and to deliver over-the-air updates. When the App checks
        for an update, Expo receives your device platform, the App version, and your IP address.
      </p>
      <p style={s.p}>
        We do not sell your personal data to third parties. We do not use your data for targeted
        advertising.
      </p>

      <h2 style={s.h2}>4. Data Retention</h2>
      <p style={s.p}>
        We retain your account information and sighting data for as long as your account is active.
      </p>
      <p style={s.p}>
        You can delete your account at any time from the Profile tab. Deletion happens immediately
        and cannot be undone.
      </p>
      <p style={s.p}>
        Permanently deleted: your email address and password, every sighting you have logged
        including its GPS coordinates and notes, every photo you have uploaded, your date of birth,
        your badges, your saved birds, your push notification tokens, your notification settings,
        your clan membership, your league memberships, and your league standings, matchups and
        rosters.
      </p>
      <p style={s.p}>
        Anonymized and kept: your profile record is kept as an anonymous placeholder so that other
        members&apos; league history does not break. Your display name is replaced with &quot;Former
        Member&quot; and your avatar, bio, clan and date of birth are erased. The placeholder holds
        no personal information about you.
      </p>
      <p style={s.p}>
        Kept: messages you posted in league chat stay visible to that league, shown as sent by
        &quot;Former Member&quot;.
      </p>
      <p style={s.p}>
        Legally required records: if the law requires us to retain a specific record relating to
        your account, such as a record of a legal request we have received, we keep only that
        record, only for as long as the law requires, and then delete it. This does not apply to
        anything listed above as permanently deleted.
      </p>

      <h2 style={s.h2}>5. Your Rights</h2>
      <p style={s.p}>Depending on your location, you may have the following rights:</p>
      <p style={s.p}>
        Access: Request a copy of the personal data we hold about you.
        <br />
        Correction: Request correction of inaccurate data.
        <br />
        Deletion: Request deletion of your account and personal data.
        <br />
        Portability: Request your data in a portable format.
        <br />
        Opt-Out: Opt out of non-essential communications.
      </p>
      <p style={s.p}>
        California residents have additional rights under the CCPA, including the right to know
        what personal information is collected and the right to request deletion. To exercise any
        of these rights, contact us at{' '}
        <a href="mailto:birdleaguehq@gmail.com">birdleaguehq@gmail.com</a>.
      </p>

      <h2 style={s.h2}>6. Children&apos;s Privacy</h2>
      <p style={s.p}>
        The App is not directed at children under 13. We do not knowingly collect personal
        information from children under 13. If we become aware that a user is under 13, we will
        promptly delete their account and associated data. Users aged 13&ndash;17 may use the App
        with parental consent.
      </p>

      <h2 style={s.h2}>7. Security</h2>
      <p style={s.p}>
        We implement reasonable technical and organizational security measures to protect your
        data, including encrypted data transmission (TLS), secure authentication, and access
        controls. However, no method of transmission over the internet is 100% secure, and we
        cannot guarantee absolute security.
      </p>

      <h2 style={s.h2}>8. Changes to This Policy</h2>
      <p style={s.p}>
        We may update this Privacy Policy from time to time. We will notify you of material changes
        through the App or by email. Continued use of the App after changes take effect constitutes
        acceptance.
      </p>

      <h2 style={s.h2}>9. Contact</h2>
      <p style={s.p}>
        Questions about this Privacy Policy? Contact us at{' '}
        <a href="mailto:birdleaguehq@gmail.com">birdleaguehq@gmail.com</a>.
      </p>
    </LegalPage>
  );
}
