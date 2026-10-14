// EBIRD-EXPORT-WEB. Turns the lines get_ebird_export returns into the files
// /export saves. Pure, no imports, so scripts/test-ebird-export-files.mjs can
// run it under plain Node.
//
// The rules:
// - Each line ends in CRLF, the last one included.
// - A file holds at most MAX_FILE_BYTES (900 KB, under eBird's 1 MB per
//   file), counted in UTF-8 bytes with the CRLFs.
// - A checklist is never split across files. The server sends the lines
//   checklist by checklist, so a checklist is a run of consecutive lines that
//   share fields F to J: location name, latitude, longitude, date and start
//   time (the columns that define an eBird checklist in Record Format).
// - Files are named bird-league-ebird-YYYY-MM-DD-1.csv, -2.csv and so on, the
//   date being the day the player downloads them.
//
// One checklist larger than MAX_FILE_BYTES would sit alone in a file over the
// limit, because splitting it is worse. It cannot happen in practice: a
// checklist holds one line per species, about 150 bytes each, so it would
// need some 6,000 species on one checklist.

export const MAX_FILE_BYTES = 900 * 1024;

export type ExportFile = { name: string; text: string; bytes: number; lines: number };

const encoder = new TextEncoder();

/** UTF-8 byte length of a string. */
export function utf8Bytes(s: string): number {
  return encoder.encode(s).length;
}

/** Fields F to J of a Record Format line, the part that names its checklist. */
export function checklistKey(line: string): string {
  return line.split(',').slice(5, 10).join(',');
}

/** Consecutive lines that share a checklist key, in order. */
export function groupChecklists(lines: string[]): string[][] {
  const groups: string[][] = [];
  let lastKey: string | null = null;
  for (const line of lines) {
    const key = checklistKey(line);
    if (groups.length === 0 || key !== lastKey) groups.push([]);
    groups[groups.length - 1].push(line);
    lastKey = key;
  }
  return groups;
}

/** The lines joined with CRLF, a CRLF after the last line too. */
export function joinCrlf(lines: string[]): string {
  return lines.length === 0 ? '' : lines.join('\r\n') + '\r\n';
}

/** bird-league-ebird-YYYY-MM-DD-N.csv, the date read in the browser's own day. */
export function exportFileName(day: Date, index: number): string {
  const y = day.getFullYear();
  const m = String(day.getMonth() + 1).padStart(2, '0');
  const d = String(day.getDate()).padStart(2, '0');
  return `bird-league-ebird-${y}-${m}-${d}-${index}.csv`;
}

/** Splits the lines into files, whole checklists only, each under the limit. */
export function splitExport(lines: string[], day: Date, maxBytes: number = MAX_FILE_BYTES): ExportFile[] {
  const files: string[][] = [];
  let current: string[] = [];
  let currentBytes = 0;
  for (const group of groupChecklists(lines)) {
    const groupBytes = group.reduce((n, line) => n + utf8Bytes(line) + 2, 0);
    if (current.length > 0 && currentBytes + groupBytes > maxBytes) {
      files.push(current);
      current = [];
      currentBytes = 0;
    }
    current.push(...group);
    currentBytes += groupBytes;
  }
  if (current.length > 0) files.push(current);
  return files.map((fileLines, i) => {
    const text = joinCrlf(fileLines);
    return { name: exportFileName(day, i + 1), text, bytes: utf8Bytes(text), lines: fileLines.length };
  });
}
