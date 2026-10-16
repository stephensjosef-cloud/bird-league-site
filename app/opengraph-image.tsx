import { homeCard, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

// The home card. Every page without a picture of its own (/support, /privacy,
// /terms, /export) inherits it from here.

export const alt = 'Bird League. Fantasy birding. Real birds.';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return homeCard();
}
