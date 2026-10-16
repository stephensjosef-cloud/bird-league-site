// Where every "Get Bird League" and install button on this site goes.
//
// Bird League is not on the App Store yet, so the App Store link answers 404
// until release. This module is the one place that decides what an install
// button does instead, from two environment variables set in Vercel:
//
//   NEXT_PUBLIC_APP_STORE_LIVE  "1" once the app is on the App Store. Then
//                               every button goes to the App Store.
//   NEXT_PUBLIC_TESTFLIGHT_URL  A public TestFlight link. Used while the
//                               App Store is not live, labelled "Join the beta
//                               on TestFlight".
//
// With neither set, a button opens an email to birdleaguehq@gmail.com asking
// for an invite, with the league or duel code already in the body so the
// person can be added by hand.
//
// Both are NEXT_PUBLIC_ because the landing page is a client component and
// needs the same answer the server pages get. Next inlines them at build time,
// so changing either needs a redeploy. Each is read by its literal name below,
// which is what lets Next inline it.

export const APP_STORE_URL = 'https://apps.apple.com/app/id6778868680';
export const INVITE_EMAIL = 'birdleaguehq@gmail.com';

export type InstallKind = 'app_store' | 'testflight' | 'invite';

export type InstallLink = {
  kind: InstallKind;
  href: string;
  label: string;
  /** True when the link opens a page on another site rather than an email. */
  external: boolean;
};

export type InstallContext =
  | { type: 'home' }
  | { type: 'support' }
  | { type: 'league'; code: string | null; leagueName?: string | null }
  | { type: 'seat'; code: string | null; leagueName?: string | null }
  | { type: 'duel'; code: string | null; challengerName?: string | null }
  | { type: 'clan'; clanName: string | null };

/** The settings, read once. Exported so a test can pass its own. */
export type InstallEnv = { appStoreLive: boolean; testflightUrl: string | null };

export function readInstallEnv(): InstallEnv {
  const live = process.env.NEXT_PUBLIC_APP_STORE_LIVE;
  const tf = process.env.NEXT_PUBLIC_TESTFLIGHT_URL;
  return {
    appStoreLive: live === '1',
    testflightUrl: tf && /^https:\/\//.test(tf.trim()) ? tf.trim() : null,
  };
}

function inviteBody(ctx: InstallContext): string {
  const lines = ['Hi, please add me to the Bird League beta.'];
  switch (ctx.type) {
    case 'league':
      if (ctx.code) {
        lines.push(
          ctx.leagueName
            ? `I was invited to ${ctx.leagueName}. The league code is ${ctx.code}.`
            : `I was invited to a league. The league code is ${ctx.code}.`,
        );
      }
      break;
    case 'seat':
      if (ctx.code) {
        lines.push(
          ctx.leagueName
            ? `I was asked to take over a seat in ${ctx.leagueName}. The code is ${ctx.code}.`
            : `I was asked to take over a seat in a league. The code is ${ctx.code}.`,
        );
      }
      break;
    case 'duel':
      if (ctx.code) {
        lines.push(
          ctx.challengerName
            ? `${ctx.challengerName} challenged me to a duel. The duel code is ${ctx.code}.`
            : `I was challenged to a duel. The duel code is ${ctx.code}.`,
        );
      }
      break;
    case 'clan':
      if (ctx.clanName) lines.push(`I was invited to join ${ctx.clanName}.`);
      break;
    default:
      break;
  }
  lines.push('', 'The email for my TestFlight invite (the one on my Apple ID): ');
  return lines.join('\n');
}

/**
 * The install link for a page. `appStoreLabel` is the wording used once the
 * app is live ("Get Bird League to accept" on a duel, say); before that the
 * label always says what the button really does.
 */
export function installLink(
  ctx: InstallContext,
  appStoreLabel = 'Get Bird League',
  env: InstallEnv = readInstallEnv(),
): InstallLink {
  if (env.appStoreLive) {
    return { kind: 'app_store', href: APP_STORE_URL, label: appStoreLabel, external: true };
  }
  if (env.testflightUrl) {
    return {
      kind: 'testflight',
      href: env.testflightUrl,
      label: 'Join the beta on TestFlight',
      external: true,
    };
  }
  const subject = encodeURIComponent('Bird League beta');
  const body = encodeURIComponent(inviteBody(ctx));
  return {
    kind: 'invite',
    href: `mailto:${INVITE_EMAIL}?subject=${subject}&body=${body}`,
    label: 'Ask for an invite',
    external: false,
  };
}
