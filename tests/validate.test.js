import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanName, checkName } from '../src/lib/validate.js';

test('cleanName trims and collapses inner spaces', () => {
  assert.equal(cleanName('  Juan   Dela  Cruz '), 'Juan Dela Cruz');
  assert.equal(cleanName('Ana\t\nMaria'), 'Ana Maria');
  assert.equal(cleanName(''), '');
});

test('cleanName survives non-string input', () => {
  assert.equal(cleanName(null), '');
  assert.equal(cleanName(undefined), '');
});

test('checkName accepts a normal full name and returns cleaned name', () => {
  const r = checkName('  juan   dela cruz ');
  assert.equal(r.ok, true);
  assert.equal(r.name, 'juan dela cruz');
});

test('checkName accepts letters, spaces, dot, dash and apostrophe', () => {
  assert.equal(checkName("Ana-Maria D'Souza Jr.").ok, true);
});

test('checkName rejects empty, too short and too long', () => {
  assert.equal(checkName('   ').ok, false);
  assert.equal(checkName('J').ok, false);
  assert.equal(checkName('a'.repeat(60)).ok, true);
  assert.equal(checkName('a'.repeat(61)).ok, false);
});

test('checkName rejects digits and symbols', () => {
  assert.equal(checkName('J3an').ok, false);
  assert.equal(checkName('Juan <b>').ok, false);
  assert.equal(checkName('<script>x</script>').ok, false);
});

test('checkName blocks a duplicate name case-insensitively', () => {
  const existing = ['Juan Dela Cruz', 'Ana-Maria'];
  const r = checkName('  JUAN   dela cruz ', existing);
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'Already signed in!');
});

test('checkName allows a different name against the same list', () => {
  assert.equal(checkName('Pedro Santos', ['Juan Dela Cruz']).ok, true);
});
