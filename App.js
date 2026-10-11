import { useEffect, useMemo, useRef, useState } from 'react';
import { ImageBackground, ScrollView, Text, TextInput, View } from 'react-native';
import { loadPixelFont, styles } from './src/theme';
import PixelButton from './src/components/PixelButton';
import PixelInput from './src/components/PixelInput';
import NameList from './src/components/NameList';
import SuccessBadge from './src/components/SuccessBadge';
import { checkName } from './src/lib/validate';
import { isDuplicate, makeRow, mergeRows, sortNewest } from './src/lib/rows';
import { appendToSheet, clearSheet, fetchRemoteRows, flushOutbox } from './src/lib/sheets';
import { exportExcel } from './src/lib/excel';
import { DEFAULT_SETTINGS, clearLocal, loadOutbox, loadRows, loadSettings, saveRows, saveSettings } from './src/lib/store';

const POLL_MS = 10000; // live shared list refresh — cheap GET, Sheet stays the source of truth

export default function App() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [tab, setTab] = useState('Sign In');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [confirmClear, setConfirmClear] = useState(false);
  const [queued, setQueued] = useState(0);
  const [lastAdded, setLastAdded] = useState(null);
  const [shared, setShared] = useState([]); // rows from the other PCs, polled from the Sheet
  const [syncedAt, setSyncedAt] = useState(null);
  const [sending, setSending] = useState(false); // blocks double-tap double submits
  const [clearing, setClearing] = useState(false);
  const sendingRef = useRef(false);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  async function refreshShared() {
    const execUrl = settingsRef.current.execUrl;
    if (!execUrl) return;
    const res = await fetchRemoteRows(execUrl).catch(() => null);
    if (res && res.ok) {
      setShared(res.rows);
      setSyncedAt(Date.now());
    }
  }

  useEffect(() => {
    loadPixelFont().catch(() => {});
    (async () => {
      const [r, s, o] = await Promise.all([loadRows(), loadSettings(), loadOutbox()]);
      setRows(r);
      setSettings(s);
      setQueued(o.length);
      if (s.execUrl) {
        const res = await flushOutbox(s.execUrl).catch(() => null);
        if (res) setQueued(res.queued ? (await loadOutbox()).length : 0);
        refreshShared();
      }
    })();
    const timer = setInterval(refreshShared, POLL_MS);
    return () => clearInterval(timer);
  }, []);

  const merged = useMemo(() => mergeRows(rows, shared), [rows, shared]);
  const live = !!settings.execUrl;

  function setField(key, value) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next).catch(() => {});
    if (key === 'execUrl' && value) setTimeout(refreshShared, 0); // connect the live list right away
  }

  async function handleAdd() {
    if (sendingRef.current) return; // kids tap fast — one submit at a time
    sendingRef.current = true;
    setSending(true);
    setError('');
    try {
      const v = checkName(name, rows.map((r) => r.name));
      if (!v.ok) { setError(v.reason); return; }
      if (isDuplicate(rows, v.name)) { setError('Already signed in!'); return; }
      const row = makeRow(v.name, settings.device, settings.webinarTitle);
      const res = await appendToSheet(settings.execUrl, row).catch(() => ({ ok: false, queued: true }));
      const saved = { ...row, queued: res.queued };
      const next = [...rows, saved];
      setRows(next);
      saveRows(next).catch(() => {});
      setQueued((await loadOutbox().catch(() => [])).length);
      setName('');
      setLastAdded(`${saved.name}|${saved.time}`);
      setSuccess(saved);
      refreshShared(); // show the new name (and others') without waiting for the next poll
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  async function handleExport() {
    setError('');
    const res = await exportExcel(sortNewest(merged)).catch(() => ({ ok: false }));
    if (!res.ok) setError('Export failed — try again.');
  }

  async function handleClear() {
    if (!confirmClear) { setConfirmClear(true); return; }
    // Full reset: this PC + the shared Sheet, or names return on the next poll.
    setClearing(true);
    setError('');
    try {
      await clearLocal().catch(() => {});
      const res = await clearSheet(settingsRef.current.execUrl).catch(() => ({ ok: false }));
      setRows([]);
      setShared([]);
      setQueued(0);
      setLastAdded(null);
      if (!res.ok && settingsRef.current.execUrl) {
        setError('This PC is clear, but the shared sheet did not clear — check internet, or names will return.');
      }
    } finally {
      setConfirmClear(false);
      setClearing(false);
    }
  }

  const tabs = ['Sign In', 'List', 'Settings'];

  return (
    <ImageBackground source={require('./assets/pixel-night-bg.png')} style={styles.screen} resizeMode="cover">
    <View style={styles.bgDim}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PROJECT BYTE: BASIC YOUTH TECHNOLOGY EDUCATION</Text>
        </View>
        <Text style={styles.heading}>MINAS G6 SIGN-IN</Text>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }} accessibilityRole="tablist">
          {tabs.map((t) => (
            <View key={t} style={{ flex: 1 }}>
              <PixelButton title={t} variant={tab === t ? 'primary' : 'secondary'} onPress={() => setTab(t)} accessibilityLabel={`Show ${t}`} />
            </View>
          ))}
        </View>

        {tab === 'Sign In' && (
          <View style={styles.card}>
            <PixelInput label="TYPE YOUR NAME" value={name} onChange={setName} onSubmit={handleAdd} />
            {error ? <Text role="alert" style={styles.errorText}>{error}</Text> : null}
            <PixelButton title="ADD ★" onPress={handleAdd} disabled={sending} accessibilityLabel="Add my name" />
            <Text style={styles.rowMeta}>{merged.length} SIGNED IN{live ? ' · LIVE' : ''}{queued ? ` · ${queued} QUEUED` : ''}</Text>
          </View>
        )}

        {tab === 'List' && (
          <View style={styles.card}>
            <Text style={styles.sub}>{merged.length} SIGNED IN</Text>
            <Text style={styles.rowMeta}>{live ? (syncedAt ? `LIVE · all PCs · synced ${new Date(syncedAt).toLocaleTimeString()}` : 'LIVE · connecting…') : 'THIS PC ONLY · paste the Sheet link in Settings for the shared list'}</Text>
            <NameList rows={sortNewest(merged)} loading={false} highlight={lastAdded} />
            {error ? <Text role="alert" style={styles.errorText}>{error}</Text> : null}
            <PixelButton title="Export Excel" variant="secondary" onPress={handleExport} accessibilityLabel="Export attendance to Excel" />
            <PixelButton title={clearing ? 'Clearing…' : confirmClear ? 'Tap again to Clear ALL' : 'Clear'} variant="secondary" onPress={handleClear} disabled={clearing} accessibilityLabel={confirmClear ? 'Confirm clear all names everywhere' : 'Clear list'} />
          </View>
        )}

        {tab === 'Settings' && (
          <View style={styles.card}>
            <Text style={styles.label}>Seminar title</Text>
            <TextInput value={settings.webinarTitle} onChangeText={(v) => setField('webinarTitle', v)} style={styles.input} accessibilityLabel="Seminar title" />
            <Text style={[styles.label, { marginTop: 12 }]}>Seminar date (TBD ok)</Text>
            <TextInput value={settings.webinarDate} onChangeText={(v) => setField('webinarDate', v)} placeholder="TBD" style={styles.input} accessibilityLabel="Seminar date" />
            <Text style={[styles.label, { marginTop: 12 }]}>Device (PC-1 to PC-4)</Text>
            <TextInput value={settings.device} onChangeText={(v) => setField('device', v)} maxLength={8} style={styles.input} accessibilityLabel="Device label" />
            <Text style={[styles.label, { marginTop: 12 }]}>Apps Script URL (/exec)</Text>
            <TextInput value={settings.execUrl} onChangeText={(v) => setField('execUrl', v)} autoCapitalize="none" autoCorrect={false} placeholder="https://script.google.com/.../exec" style={styles.input} accessibilityLabel="Apps Script URL" />
            <Text style={styles.rowMeta}>Sheet: {settings.sheetId}</Text>
          </View>
        )}
      </ScrollView>
      {success ? <SuccessBadge name={success.name} webinar={settings.webinarTitle} onClose={() => setSuccess(null)} /> : null}
    </View>
    </ImageBackground>
  );
}
