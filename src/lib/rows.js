// Attendance row build/sort. Pure functions, no deps — see tests/rows.test.js.
import { cleanName } from './validate.js';

// Local calendar day — a UTC key would let a 07:00 and 08:00 Manila sign-in count as two days.
const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// name/time/device/webinar — `time` is the ISO string stored in AsyncStorage and the Sheet.
export function makeRow(name, device, webinar) {
  return {
    name: cleanName(name),
    time: new Date().toISOString(),
    device: device ?? '',
    webinar: webinar ?? '',
  };
}

// Same name, same calendar day → blocked (case/space insensitive).
export function isDuplicate(rows = [], name, now = new Date()) {
  const today = dayKey(now);
  const target = cleanName(name).toLowerCase();
  return rows.some((r) => dayKey(new Date(r.time)) === today && cleanName(r.name).toLowerCase() === target);
}

// Newest first, without mutating the caller's array.
export function sortNewest(rows = []) {
  return [...rows].sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
}

// Merges this device's rows with rows polled from the shared Sheet.
// Same name+time on both sides counts once; the local copy wins so the
// QUEUED badge survives until the row is confirmed in the Sheet.
const rowKey = (r) => `${cleanName(r.name).toLowerCase()}|${r.time}`;

export function mergeRows(local = [], remote = []) {
  const seen = new Set(local.map(rowKey));
  const merged = [...local];
  for (const r of remote) {
    if (!r || !r.name || !r.time) continue;
    if (!seen.has(rowKey(r))) {
      seen.add(rowKey(r));
      merged.push({ name: cleanName(r.name), time: r.time, device: r.device ?? '', webinar: r.webinar ?? '' });
    }
  }
  return merged;
}
