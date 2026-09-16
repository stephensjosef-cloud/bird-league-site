// Apple App Site Association, served at
//   https://birdleague.app/.well-known/apple-app-site-association
//
// This is a Route Handler rather than a file in public/ for one reason: Apple
// requires the response to be served as application/json, and the path has NO
// file extension, so a static file would go out as octet-stream and iOS would
// reject it. Next's own guide lists `.well-known` as a supported custom
// endpoint (node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md).
//
// It must be served over HTTPS with no redirects. Vercel does that already.
//
// ============================================================================
// THE TEAM ID IS NOT IN THIS REPO AND MUST BE SET ON VERCEL.
// ============================================================================
// An appID is "<TeamID>.<BundleID>". The bundle id is com.josef.birdleague
// (app.json). The ten character Team ID lives only in the Apple Developer
// account: developer.apple.com -> Membership details -> Team ID. The app uses
// EAS managed builds, so there is no ios/ directory and no .xcodeproj in the
// app repo to read it from.
//
// Set it in the Vercel project settings:
//
//   APPLE_TEAM_ID   e.g. ABCDE12345
//
// UNTIL IT IS SET THIS ROUTE ANSWERS 503, DELIBERATELY. Serving a syntactically
// valid file containing a wrong or placeholder Team ID is worse than serving
// nothing: Apple's CDN fetches this file and caches it, and a device that has
// cached a bad association will not retry on the timetable you want. A 503 with
// no-store is the honest "not ready yet" and leaves nothing to invalidate.

export const dynamic = 'force-dynamic';

const BUNDLE_ID = 'com.josef.birdleague';

// Paths the app claims. /d/* is a duel invite (DUEL-1). /join/* is reserved for
// league invite links, which do not exist yet on either side; claiming it now
// costs nothing and means the AASA does not need a second Apple CDN refresh
// when it ships.
const PATHS = ['/d/*', '/join/*'];

export async function GET() {
  const teamId = process.env.APPLE_TEAM_ID?.trim();

  if (!teamId) {
    return new Response(
      JSON.stringify({
        error: 'APPLE_TEAM_ID is not configured for this deployment.',
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  const appID = `${teamId}.${BUNDLE_ID}`;

  const body = {
    applinks: {
      // Kept for iOS versions that predate the `details`-only form. Apple
      // ignores it on modern iOS; omitting it breaks nothing current but
      // costs nothing to include.
      apps: [],
      details: [
        {
          // Modern form (iOS 13+).
          appIDs: [appID],
          components: PATHS.map((p) => ({
            '/': p,
            comment: p === '/d/*' ? 'Duel invite' : 'League invite',
          })),
          // Legacy form, read by older iOS. Same claim, older spelling.
          appID,
          paths: PATHS,
        },
      ],
    },
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Apple's CDN caches this. An hour is short enough to recover from a
      // mistake in a morning and long enough not to be hit on every install.
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
