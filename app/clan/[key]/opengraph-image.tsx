import { clanFor } from '@/lib/clans';
import { neutralInviteCard, ogCard, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

// The picture a /clan/<key> link shows: the clan's name and tagline. An unknown
// clan gets the neutral invite card.

export const alt = 'A Bird League clan invite';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const clan = clanFor(key);
  if (!clan) return neutralInviteCard();
  return ogCard({ eyebrow: 'Clan invite', title: clan.name, lines: [clan.tagline], action: 'Bird for the clan' });
}
