import test from 'node:test';
import assert from 'node:assert/strict';
import { clearSheet, fetchRemoteRows } from '../src/lib/sheets.js';

const realFetch = globalThis.fetch;

function stubFetch(fn) {
  globalThis.fetch = fn;
}

test.afterEach(() => {
  globalThis.fetch = realFetch;
});

test('fetchRemoteRows returns clean rows with ok:true', async () => {
  stubFetch(async () => ({ ok: true, json: async () => ([
    { name: '  Juan  ', time: '2026-05-05T08:00:00.000Z', device: 'PC-1' },
    { name: '', time: '2026-05-05T08:00:00.000Z' },
    { name: 'NoTime' },
  ]) }));
  const res = await fetchRemoteRows('https://x/exec');
  assert.equal(res.ok, true);
  assert.deepEqual(res.rows, [{ name: '  Juan  ', time: '2026-05-05T08:00:00.000Z', device: 'PC-1', webinar: '' }]);
});

test('fetchRemoteRows never throws and reports ok:false offline', async () => {
  stubFetch(async () => { throw new Error('offline'); });
  assert.deepEqual(await fetchRemoteRows('https://x/exec'), { rows: [], ok: false });
  assert.deepEqual(await fetchRemoteRows(''), { rows: [], ok: false });
});

test('clearSheet calls ?action=clear and reads the cleared flag', async () => {
  let url = '';
  stubFetch(async (u) => {
    url = u;
    return { ok: true, json: async () => ({ cleared: true }) };
  });
  assert.deepEqual(await clearSheet('https://x/exec'), { ok: true });
  assert.match(url, /action=clear/);
});

test('clearSheet reports ok:false when the sheet refuses', async () => {
  stubFetch(async () => ({ ok: true, json: async () => ({}) }));
  assert.deepEqual(await clearSheet('https://x/exec'), { ok: false });
  stubFetch(async () => { throw new Error('offline'); });
  assert.deepEqual(await clearSheet('https://x/exec'), { ok: false });
});
