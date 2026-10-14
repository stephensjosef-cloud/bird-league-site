// EBIRD-EXPORT-WEB. Proves lib/ebird-export-files.ts: CRLF joins, the file
// names, every file at or under 900 KB, and no checklist split across files.
// Runs under plain Node 22.18+ (it imports the .ts file with type stripping):
//
//   node scripts/test-ebird-export-files.mjs
//
// Exit 0 is a pass; exit 1 prints each failure.

import {
  MAX_FILE_BYTES,
  checklistKey,
  exportFileName,
  groupChecklists,
  joinCrlf,
  splitExport,
  utf8Bytes,
} from '../lib/ebird-export-files.ts';

let failures = 0;
let passes = 0;
function check(name, ok, detail = '') {
  if (ok) {
    passes++;
  } else {
    failures++;
    console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`);
  }
}

// A real-shaped line, the server's 19 fields.
function line(bird, cl) {
  return [
    bird, 'Genus', 'species', 'X', 'Logged in Bird League', cl.name,
    cl.lat, cl.lng, cl.date, cl.time, 'CA', 'US', 'Incidental', '1', '', 'N', '', '',
    'Exported from Bird League',
  ].join(',');
}

function checklist(i, n, pad = '') {
  const cl = {
    name: `Place ${i}${pad}`,
    lat: (38 + i / 1000).toFixed(5),
    lng: (-122 - i / 1000).toFixed(5),
    date: `10/${String((i % 28) + 1).padStart(2, '0')}/2026`,
    time: `${String(i % 24).padStart(2, '0')}:15`,
  };
  return Array.from({ length: n }, (_, b) => line(`Bird ${i}-${b}`, cl));
}

// Every file: at or under the limit, ends in CRLF, no bare LF, and every
// checklist key appears in exactly one file.
function checkFiles(name, lines, files, maxBytes = MAX_FILE_BYTES) {
  check(`${name}: same lines in order`, files.flatMap((f) => f.text.split('\r\n').slice(0, -1)).join('\n') === lines.join('\n'));
  const seen = new Map();
  files.forEach((f, i) => {
    check(`${name}: file ${i + 1} under limit`, f.bytes <= maxBytes, `${f.bytes} bytes`);
    check(`${name}: file ${i + 1} bytes counted`, f.bytes === utf8Bytes(f.text));
    check(`${name}: file ${i + 1} ends in CRLF`, f.text.endsWith('\r\n'));
    check(`${name}: file ${i + 1} no bare LF`, !/(^|[^\r])\n/.test(f.text));
    for (const l of f.text.split('\r\n').slice(0, -1)) {
      const k = checklistKey(l);
      if (seen.has(k) && seen.get(k) !== i) check(`${name}: checklist ${k} split`, false);
      seen.set(k, i);
    }
  });
}

// 1. CRLF joins
check('join empty', joinCrlf([]) === '');
check('join one', joinCrlf(['a,b']) === 'a,b\r\n');
check('join three', joinCrlf(['a', 'b', 'c']) === 'a\r\nb\r\nc\r\n');

// 2. File names, from the browser's local day
check('name 1', exportFileName(new Date(2026, 9, 14), 1) === 'bird-league-ebird-2026-10-14-1.csv');
check('name 2, padded', exportFileName(new Date(2026, 0, 5), 2) === 'bird-league-ebird-2026-01-05-2.csv');
check('name late at night stays local', exportFileName(new Date(2026, 11, 31, 23, 59), 3) === 'bird-league-ebird-2026-12-31-3.csv');

// 3. Grouping: consecutive lines by fields F to J
const g = groupChecklists([...checklist(1, 3), ...checklist(2, 2), ...checklist(3, 1)]);
check('groups', g.length === 3 && g[0].length === 3 && g[1].length === 2 && g[2].length === 1);
check('key is F to J', checklistKey(line('Bird', { name: 'Home', lat: '1', lng: '2', date: '10/14/2026', time: '07:00' })) === 'Home,1,2,10/14/2026,07:00');

// 4. El Concle's size: one file
const small = Array.from({ length: 70 }, (_, i) => checklist(i, (i % 5) + 1)).flat();
const smallFiles = splitExport(small, new Date(2026, 9, 14));
check('small export is one file', smallFiles.length === 1);
check('small file named -1', smallFiles[0].name === 'bird-league-ebird-2026-10-14-1.csv');
checkFiles('small', small, smallFiles);

// 5. A big export splits into several files, whole checklists only
const big = Array.from({ length: 4000 }, (_, i) => checklist(i, (i % 7) + 1)).flat();
const bigFiles = splitExport(big, new Date(2026, 9, 14));
check('big export is several files', bigFiles.length >= 3, `${bigFiles.length} files`);
check('big names run 1..n', bigFiles.every((f, i) => f.name === `bird-league-ebird-2026-10-14-${i + 1}.csv`));
checkFiles('big', big, bigFiles);
check('big files are full', bigFiles.slice(0, -1).every((f) => f.bytes > MAX_FILE_BYTES - 2000));

// 6. A small limit, so the boundary is exact: a checklist that would cross it
// starts the next file, and a file never splits one
const tiny = Array.from({ length: 60 }, (_, i) => checklist(i, (i % 4) + 1)).flat();
for (const limit of [1000, 1500, 2048, 3000]) {
  const files = splitExport(tiny, new Date(2026, 9, 14), limit);
  checkFiles(`limit ${limit}`, tiny, files, limit);
}

// 7. Exactly at the limit fits; one byte over does not
const exact = checklist(1, 2);
const exactBytes = utf8Bytes(joinCrlf(exact));
check('exactly at limit is one file', splitExport(exact, new Date(), exactBytes).length === 1);
const two = [...checklist(1, 2), ...checklist(2, 2)];
const firstBytes = utf8Bytes(joinCrlf(checklist(1, 2)));
check('one byte short splits', splitExport(two, new Date(), utf8Bytes(joinCrlf(two)) - 1).length === 2);
check('first file holds exactly its checklist', splitExport(two, new Date(), firstBytes).every((f) => f.lines === 2));

// 8. Bytes are UTF-8, not characters: a non-ASCII place name counts double
const accented = checklist(1, 3, ' Ñandú Café');
const accentedFiles = splitExport(accented, new Date());
// Each line holds Ñ, ú and é, two bytes each in UTF-8: 3 extra bytes a line.
check('utf8 counted', accentedFiles[0].bytes === accentedFiles[0].text.length + 3 * 3);

// 9. Nothing in, nothing out
check('empty export', splitExport([], new Date()).length === 0);

console.log(`${passes} passed, ${failures} failed`);
process.exit(failures === 0 ? 0 : 1);
