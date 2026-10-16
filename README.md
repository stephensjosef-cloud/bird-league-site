# bird-league-site

Marketing site and legal pages for Bird League. Next.js App Router, deployed on
Vercel.

## Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` -> `components/BirdLeagueLanding.tsx` | Landing page. Doubles as the App Store marketing URL. |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy. **App Store privacy policy URL.** Apple requires this to be reachable without installing the app. |
| `/support` | `app/support/page.tsx` | Support page. **App Store support URL.** Same requirement. |
| `/terms` | `app/terms/page.tsx` | Terms of service. The app renders this text in full during signup; this route is the public copy. |
| `/d/[code]` | `app/d/[code]/page.tsx` | Duel invite landing page. Reads the challenge from Supabase and renders who is challenging you. |
| `/.well-known/apple-app-site-association` | `app/.well-known/apple-app-site-association/route.ts` | Apple App Site Association. Makes `/d/*` open the iOS app directly. |

`/privacy`, `/support`, and `/terms` share the presentation shell in
`components/LegalPage.tsx`.

## Duel invites and universal links

A duel is a seven day head to head between two birders. `create_duel` in the app
returns a URL of the form `https://birdleague.app/d/<CODE>`, and the person is
expected to send that to whoever they want to play.

**On an iPhone with Bird League installed, `/d/<CODE>` never renders.** iOS reads
the association file above, matches the path, and opens the app straight to the
accept screen. The page exists for everyone else: desktop, Android, link preview
panes, and iPhones without the app. That is why its primary action is "get the
app" and not "accept" - accepting requires an authenticated caller, and this site
has no login and no session.

This is the only page on the site that talks to a backend. It calls exactly one
database function, `get_duel_preview`, which is the single anon-executable
function in the database and returns six display fields with no identifiers of
any kind. See the header comment in `lib/supabase.ts` before adding a second
call from here.

## Environment variables

All of these are set in the Vercel project settings. None of them belong in the
repo, and `.env*` is gitignored.

| Variable | Needed by | Notes |
|---|---|---|
| `SUPABASE_URL` | `/d/[code]` | `https://<project-ref>.supabase.co` |
| `SUPABASE_ANON_KEY` | `/d/[code]` | The anon / publishable key. **Never the service_role key.** |
| `APPLE_TEAM_ID` | the association file | Ten characters, from developer.apple.com -> Membership details. |
| `NEXT_PUBLIC_APP_STORE_LIVE` | every install button | `1` once Bird League is on the App Store. Anything else, or unset, means not yet. |
| `NEXT_PUBLIC_TESTFLIGHT_URL` | every install button | A public TestFlight link (`https://testflight.apple.com/join/...`). Optional. |

### Where the install buttons go

Every "Get Bird League" and install button on the site (home, `/support`,
`/join/<CODE>`, `/d/<CODE>`, `/clan/<key>`) takes its link from one module,
`lib/install.ts`:

1. `NEXT_PUBLIC_APP_STORE_LIVE` is `1`: the App Store page, with the page's own
   label ("Get Bird League", or "Get Bird League to accept" on a duel).
2. Otherwise, `NEXT_PUBLIC_TESTFLIGHT_URL` is set: that link, labelled "Join
   the beta on TestFlight".
3. Otherwise: an email to birdleaguehq@gmail.com, subject "Bird League beta",
   labelled "Ask for an invite". The body already carries the league, seat or
   duel code from the page, so the person can be added by hand.

The App Store link is a 404 until release, which is why it is never the default.
Both variables are `NEXT_PUBLIC_` because the home page is a client component.
Next inlines them at build time, so **changing either needs a redeploy**.

## Link previews

Every page has an Open Graph and Twitter large image card, 1200 by 630, drawn by
`lib/og.tsx` (the horizon: a dusk sky over a dark ridge, with the logo rising
behind it). The routes are `opengraph-image.tsx` files: `app/` (the home card,
which `/support`, `/privacy`, `/terms` and `/export` inherit), `app/join/[code]/`,
`app/d/[code]/` and `app/clan/[key]/`. A dead, unknown or closed invite or duel
gets a neutral "Bird League invite" card, never an error. Rendered copies are in
`docs/og/`.

They are deliberately not prefixed `NEXT_PUBLIC_`: both Supabase values are
public-safe and already ship inside the iOS binary, but this code only runs on
the server, so there is no reason to inline them into the browser bundle too.

**Without `SUPABASE_URL` / `SUPABASE_ANON_KEY`, `/d/<CODE>` renders a "we cannot
load this challenge" card** rather than throwing. A duel link is something a
person was sent by a friend; a stack trace is a worse answer than a sentence.

**Without `APPLE_TEAM_ID`, the association file answers 503 on purpose.**
Serving a syntactically valid file with a placeholder Team ID is worse than
serving nothing, because Apple's CDN caches what it fetches and a device that
cached a wrong association will not retry on the timetable you want. The 503
carries `Cache-Control: no-store` and leaves nothing to invalidate.

After setting `APPLE_TEAM_ID` for the first time, check the file is live and is
being served as JSON over HTTPS with no redirect:

```bash
curl -sD - https://birdleague.app/.well-known/apple-app-site-association
```

The response must be `200`, `content-type: application/json`, and the `appIDs`
entry must read `<TEAM_ID>.com.josef.birdleague`.

## The docs/ mirror rule

**`docs/privacy.html`, `docs/support.html`, and `docs/terms.html` in the
`bird-league-app` repo are the source of record for the legal copy on
`/privacy`, `/support`, and `/terms`. This site mirrors them.**

The app repo needs its own copies because the same policy text is also compiled
into the app itself (`constants/legal-content.ts`, shown during signup), and
because the App Store submission checklist lives there. This site needs rendered
routes because Apple requires public URLs. Both have to say the same thing, and
Apple compares the hosted policy against the App Privacy answers.

So: a policy or support edit is a **two-repo change, in this order**.

1. Edit `docs/privacy.html`, `docs/support.html`, or `docs/terms.html` in
   `bird-league-app`. That is the edit of record.
2. Mirror the same wording into `app/privacy/page.tsx`, `app/support/page.tsx`,
   or `app/terms/page.tsx` here. Adapt markup only. Do not reword.
3. Check whether `constants/legal-content.ts` in the app also needs the change.
   It carries the in-app copy of the same text.

Never edit the copy on this side first. The pages here carry a comment saying
the same thing at the top of each file.

### Verifying parity

The app repo has `scripts/check-legal-parity.mjs`, which is the automated
backstop this rule went without until 2026-08-24. It compares the privacy policy
and the terms of service section by section across all three copies of each,
after stripping markup, unescaping
entities, dropping bullet glyphs, and collapsing whitespace, so only the prose is
compared and this side's JSX formatting is ignored by design. Exit 0 means
parity; exit 1 names the section and shows the first differing text.

Run it from the app repo checkout, after step 2 above and before committing
either side:

```bash
node ../bird-league/scripts/check-legal-parity.mjs
```

It assumes this repo is a sibling checkout and defaults to `../bird-league-site`.
Pass a path as the first argument if yours lives elsewhere. It covers `/privacy`
and `/terms`. `/support` is still unguarded, because its text has no counterpart
in `constants/legal-content.ts`.

## Development

```bash
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
npm run lint
```
