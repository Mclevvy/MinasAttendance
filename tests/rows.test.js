import test from 'node:test';
import assert from 'node:assert/strict';
import { makeRow, isDuplicate, mergeRows, sortNewest } from '../src/lib/rows.js';

test('makeRow builds name/time/device/webinar', () => {
  const r = makeRow('  Juan   Dela Cruz ', 'PC-2', 'PROJECT BYTE');
  assert.equal(r.name, 'Juan Dela Cruz');
  assert.equal(r.device, 'PC-2');
  assert.equal(r.webinar, 'PROJECT BYTE');
  assert.equal(Object.keys(r).sort().join(','), 'device,name,time,webinar');
  assert.equal(new Date(r.time).toISOString(), r.time);
});

test('makeRow defaults missing device and webinar to empty string', () => {
  const r = makeRow('Ana');
  assert.equal(r.device, '');
  assert.equal(r.webinar, '');
});

test('isDuplicate blocks the same name today, any case', () => {
  const rows = [makeRow('Juan Dela Cruz', 'PC-1', 'W')];
  assert.equal(isDuplicate(rows, '  juan DELA cruz '), true);
});

test('isDuplicate ignores names from a previous day', () => {
  const rows = [{ name: 'Juan Dela Cruz', time: '2020-01-01T08:00:00.000Z', device: 'PC-1', webinar: 'W' }];
  assert.equal(isDuplicate(rows, 'Juan Dela Cruz'), false);
});

test('isDuplicate is false on an empty list', () => {
  assert.equal(isDuplicate([], 'Ana'), false);
  assert.equal(isDuplicate(undefined, 'Ana'), false);
});

test('mergeRows combines devices and dedupes confirmed rows', () => {
  const mine = [{ ...makeRow('Juan', 'PC-1', 'W'), queued: true }];
  const remote = [
    { name: 'Juan', time: mine[0].time, device: 'PC-1', webinar: 'W' },
    { name: '  ANA  ', time: '2026-05-05T08:00:00.000Z', device: 'PC-2' },
    { name: '', time: '2026-05-05T08:00:00.000Z' },
  ];
  const merged = mergeRows(mine, remote);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].queued, true);
  assert.equal(merged[1].name, 'ANA');
  assert.equal(merged[1].webinar, '');
});

test('sortNewest puts the latest row first and leaves input untouched', () => {
  const rows = [
    { name: 'Old', time: '2020-01-01T08:00:00.000Z' },
    { name: 'New', time: '2026-05-05T08:00:00.000Z' },
    { name: 'Mid', time: '2022-01-01T08:00:00.000Z' },
  ];
  const input = [...rows];
  assert.deepEqual(sortNewest(rows).map((r) => r.name), ['New', 'Mid', 'Old']);
  assert.deepEqual(rows, input);
});
