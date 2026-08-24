# bird-league-site

Marketing site and legal pages for Bird League. Next.js App Router, deployed on
Vercel.

## Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` -> `components/BirdLeagueLanding.tsx` | Landing page. Doubles as the App Store marketing URL. |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy. **App Store privacy policy URL.** Apple requires this to be reachable without installing the app. |
| `/support` | `app/support/page.tsx` | Support page. **App Store support URL.** Same requirement. |

`/privacy` and `/support` share the presentation shell in
`components/LegalPage.tsx`.

## The docs/ mirror rule

**`docs/privacy.html` and `docs/support.html` in the `bird-league-app` repo are
the source of record for the legal copy on `/privacy` and `/support`. This site
mirrors them.**

The app repo needs its own copies because the same policy text is also compiled
into the app itself (`constants/legal-content.ts`, shown during signup), and
because the App Store submission checklist lives there. This site needs rendered
routes because Apple requires public URLs. Both have to say the same thing, and
Apple compares the hosted policy against the App Privacy answers.

So: a policy or support edit is a **two-repo change, in this order**.

1. Edit `docs/privacy.html` or `docs/support.html` in `bird-league-app`. That is
   the edit of record.
2. Mirror the same wording into `app/privacy/page.tsx` or
   `app/support/page.tsx` here. Adapt markup only. Do not reword.
3. Check whether `constants/legal-content.ts` in the app also needs the change.
   It carries the in-app copy of the same text.

Never edit the copy on this side first. The pages here carry a comment saying
the same thing at the top of each file.

### Verifying parity

The app repo has `scripts/check-legal-parity.mjs`, which is the automated
backstop this rule went without until 2026-08-24. It compares the privacy policy
section by section across all three copies, after stripping markup, unescaping
entities, dropping bullet glyphs, and collapsing whitespace, so only the prose is
compared and this side's JSX formatting is ignored by design. Exit 0 means
parity; exit 1 names the section and shows the first differing text.

Run it from the app repo checkout, after step 2 above and before committing
either side:

```bash
node ../bird-league/scripts/check-legal-parity.mjs
```

It assumes this repo is a sibling checkout and defaults to `../bird-league-site`.
Pass a path as the first argument if yours lives elsewhere. It currently covers
the privacy policy only, not `/support`.

## Development

```bash
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
npm run lint
```
