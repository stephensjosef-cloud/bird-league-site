'use client';

import { useSyncExternalStore, type CSSProperties } from 'react';

// Renders a kickoff instant in the VIEWER's own time zone, e.g.
// "Kicks off Fri, Oct 9 at 5 PM". It has to run in the browser: the server
// renders in UTC and has no idea where the reader is. The server prints a
// blank line of the same height, and the browser fills in the local text.

function formatKickoff(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(d);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? '';
  const minute = get('minute');
  const time = minute && minute !== '00' ? `${get('hour')}:${minute}` : get('hour');
  return `Kicks off ${get('weekday')}, ${get('month')} ${get('day')} at ${time} ${get('dayPeriod')}`;
}

// Nothing to subscribe to: the viewer's time zone does not change under us.
const subscribe = () => () => {};

export default function LocalKickoff({ iso, style }: { iso: string; style?: CSSProperties }) {
  // The server snapshot is null, so server HTML and hydration agree; the
  // client snapshot is the local text.
  const text = useSyncExternalStore(
    subscribe,
    () => formatKickoff(iso),
    () => null,
  );

  return <p style={{ minHeight: '1.6em', ...style }}>{text ?? ' '}</p>;
}
