import { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, Text, TextInput, View } from 'react-native';
import { loadPixelFont, styles } from './src/theme';
import PixelButton from './src/components/PixelButton';
import PixelInput from './src/components/PixelInput';
import NameList from './src/components/NameList';
import SuccessBadge from './src/components/SuccessBadge';
import { checkName } from './src/lib/validate';
import { isDuplicate, makeRow, sortNewest } from './src/lib/rows';
import { appendToSheet, flushOutbox } from './src/lib/sheets';
import { exportExcel } from './src/lib/excel';
import { DEFAULT_SETTINGS, clearLocal, loadOutbox, loadRows, loadSettings, saveRows, saveSettings } from './src/lib/store';

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
      }
    })();
  }, []);

  function setField(key, value) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next).catch(() => {});
  }

  async function handleAdd() {
    setError('');
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
  }

  async function handleExport() {
    setError('');
    const res = await exportExcel(rows).catch(() => ({ ok: false }));
    if (!res.ok) setError('Export failed — try again.');
  }

  async function handleClear() {
    if (!confirmClear) { setConfirmClear(true); return; }
    await clearLocal().catch(() => {});
    setRows([]);
    setQueued(0);
    setConfirmClear(false);
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
            <PixelButton title="ADD ★" onPress={handleAdd} accessibilityLabel="Add my name" />
            <Text style={styles.rowMeta}>{rows.length} SIGNED IN{queued ? ` · ${queued} QUEUED` : ''}</Text>
          </View>
        )}

        {tab === 'List' && (
          <View style={styles.card}>
            <Text style={styles.sub}>{rows.length} SIGNED IN</Text>
            <NameList rows={sortNewest(rows)} loading={false} highlight={lastAdded} />
            <PixelButton title="Export Excel" variant="secondary" onPress={handleExport} accessibilityLabel="Export attendance to Excel" />
            <PixelButton title={confirmClear ? 'Tap again to Clear' : 'Clear'} variant="secondary" onPress={handleClear} accessibilityLabel={confirmClear ? 'Confirm clear list' : 'Clear list'} />
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
