<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


## Legal copy is mirrored, not authored here

`app/privacy/page.tsx`, `app/support/page.tsx`, and `app/terms/page.tsx` render
text whose source of record is `docs/privacy.html`, `docs/support.html`, and
`docs/terms.html` in the **bird-league-app** repo. `/privacy` and `/support` are
the App Store privacy policy URL and support URL, and Apple compares the hosted
policy against the submitted App Privacy answers.

Do not reword anything inside those three pages. If a change is needed, edit
`docs/` in bird-league-app first, then mirror it here, adapting markup only.
See README.md for the full three-step order.

After mirroring, verify with the parity checker in the app repo. It compares all
three copies of the privacy policy and of the terms of service, section by
section, ignoring markup and whitespace, and exits non-zero on drift. Run it
before committing either repo:

```bash
node ../bird-league/scripts/check-legal-parity.mjs
```

The contact address in that copy is `birdleaguehq@gmail.com`. It is the only
working inbound address. `birdleague.app` is registered and sends outbound mail,
but it has no root MX record, so `legal@`, `privacy@`, and `support@` at that
domain receive nothing and must never be reintroduced into user-facing copy.
