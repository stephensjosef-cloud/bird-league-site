// The `?by=` on an invite or challenge link (RECRUIT-2).
//
// The app adds `?by=<the sender's user id>` to every /join and /d link it
// shares (lib/recruit.ts in the app repo). When the link opens a browser
// instead of the app, this page is the only thing holding it, so the "Open in
// Bird League" button carries it on into birdleague://... and the app names the
// sender as the recruiter. Only a user id passes: usernames are not unique, and
// nothing else belongs in a deep link we build.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type SearchParams = { [key: string]: string | string[] | undefined };

/** The `by` user id from a page's search params, lowercased, or null. */
export function recruiterFrom(searchParams: SearchParams | undefined): string | null {
  const raw = searchParams?.by;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return UUID.test(t) ? t.toLowerCase() : null;
}

/** A deep link with `?by=` added, or the link unchanged without an id. */
export function withRecruiter(url: string, by: string | null): string {
  if (!by) return url;
  return `${url}${url.includes('?') ? '&' : '?'}by=${by}`;
}
