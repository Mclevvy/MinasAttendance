// Google Sheets bridge via Apps Script /exec URL. Offline-first: never throws to the UI.
import { loadOutbox, pushOutbox, saveOutbox } from './store.js';

// /exec rejects CORS preflight for application/json, so the JSON body must be sent as text/plain.
const HEADERS = { 'Content-Type': 'text/plain;charset=utf-8' };

async function post(execUrl, row) {
  const res = await fetch(execUrl, { method: 'POST', headers: HEADERS, body: JSON.stringify(row) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
}

// { ok, queued } — queued:true means the row is safe on this device, awaiting sync.
export async function appendToSheet(execUrl, row) {
  if (!execUrl) {
    await pushOutbox(row);
    return { ok: false, queued: true };
  }
  try {
    await post(execUrl, row);
    return { ok: true, queued: false };
  } catch {
    await pushOutbox(row);
    return { ok: false, queued: true };
  }
}

// Sends queued rows oldest-first; rows that fail stay queued for the next attempt.
// shortcut: a permanently broken URL retries forever — teacher clears the queue via Clear list.
export async function flushOutbox(execUrl) {
  const queued = await loadOutbox();
  if (queued.length === 0) return { ok: true, queued: false, sent: 0 };
  if (!execUrl) return { ok: false, queued: true, sent: 0 };
  const left = [];
  for (const row of queued) {
    try {
      await post(execUrl, row);
    } catch {
      left.push(row);
    }
  }
  await saveOutbox(left);
  return { ok: left.length === 0, queued: left.length > 0, sent: queued.length - left.length };
}
