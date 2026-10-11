// Local-first persistence: attendance rows, teacher settings, offline outbox.
import AsyncStorage from '@react-native-async-storage/async-storage';

const K = { rows: 'minas.rows', settings: 'minas.settings', outbox: 'minas.outbox' };

export const DEFAULT_SETTINGS = {
  webinarTitle: 'PROJECT BYTE: BASIC YOUTH TECHNOLOGY EDUCATION',
  webinarDate: '',
  device: 'PC-1',
  execUrl: 'https://script.google.com/macros/s/AKfycbysts0M1RheH_dzwFvhD9gEcPmEX15CfG7uhwvqPM7_hWoSmMORdjvRec0NO2A_DHYp/exec',
  sheetId: '1yKBumyrb_3grSD5siw7iJmZJV57KRuHYgpQS5S3ICD4',
};

// Reads never throw: corrupt or missing data must not crash the app on launch.
async function readJson(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const loadRows = () => readJson(K.rows, []);
export const saveRows = (rows) => writeJson(K.rows, rows);

// Defaults always win over missing keys, so new settings appear for old installs.
// An empty saved URL also falls back to the default (teacher never pasted one).
export const loadSettings = async () => {
  const stored = await readJson(K.settings, {});
  if (!stored.execUrl) delete stored.execUrl;
  return { ...DEFAULT_SETTINGS, ...stored };
};
export const saveSettings = (settings) => writeJson(K.settings, { ...DEFAULT_SETTINGS, ...settings });

export const loadOutbox = () => readJson(K.outbox, []);
export const saveOutbox = (rows) => writeJson(K.outbox, rows);
export const pushOutbox = async (row) => saveOutbox([...(await loadOutbox()), row]);

// Teacher "Clear list": wipes local rows + pending sync only. Never the Sheet.
export const clearLocal = () => AsyncStorage.multiRemove([K.rows, K.outbox]);
