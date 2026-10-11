// Name validation at the app boundary. Pure functions, no deps — see tests/validate.test.js.
export function cleanName(s) {
  return String(s ?? '').trim().replace(/\s+/g, ' ');
}

// Only letters, spaces and the punctuation a real Filipino/English name uses.
const BAD_CHARS = /[^a-zA-Z .'-]/;

// { ok: true, name } | { ok: false, reason }
export function checkName(s, existingNames = []) {
  const name = cleanName(s);
  if (!name) return { ok: false, reason: 'Type your full name first!' };
  if (name.length < 2) return { ok: false, reason: 'Name is too short!' };
  if (name.length > 60) return { ok: false, reason: 'Name is too long (60 letters max)!' };
  if (BAD_CHARS.test(name)) return { ok: false, reason: "Use letters, spaces, . - and ' only!" };
  const taken = existingNames.some((n) => cleanName(n).toLowerCase() === name.toLowerCase());
  if (taken) return { ok: false, reason: 'Already signed in!' };
  return { ok: true, name };
}
