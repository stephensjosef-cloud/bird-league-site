// The five clans, for the /clan page and its link preview image.
//
// NO DATABASE CALL. The clans are fixed, so their names and taglines are
// written here, copied from constants/clans.ts in the app repo (the one copy
// of each tagline; change both together).

export const CLANS: Record<string, { name: string; tagline: string }> = {
  raptors: { name: 'Skycrown', tagline: 'Rare birds, big points' },
  backyard: { name: 'The Perch', tagline: 'Common birds, every week' },
  waterfowl: { name: 'Shorebound', tagline: 'Lakes, rivers and wetlands' },
  urban: { name: 'Neonest', tagline: 'Birds of the city' },
  wildlands: { name: 'Mossborne', tagline: 'Trails and long drives' },
};

/** The clan a /clan path names, or null. */
export function clanFor(raw: string): { key: string; name: string; tagline: string } | null {
  let k: string;
  try {
    k = decodeURIComponent(raw);
  } catch {
    return null;
  }
  k = k.trim().toLowerCase();
  const c = CLANS[k];
  return c ? { key: k, ...c } : null;
}
