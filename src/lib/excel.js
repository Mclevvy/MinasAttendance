// Local .xlsx backup for the teacher (certificates). Same 4 columns as the Sheet.
import * as XLSX from 'xlsx';
import { Platform } from 'react-native';

export const EXPORT_NAME = 'Minas-G6-Attendance.xlsx';
const HEADERS = ['Name', 'Time', 'Device', 'Seminar'];
const MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export function buildWorkbook(rows = []) {
  const data = rows.map((r) => ({
    Name: r.name,
    Time: r.time,
    Device: r.device,
    Seminar: r.webinar,
  }));
  const sheet = XLSX.utils.json_to_sheet(data, { header: HEADERS });
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Attendance');
  return book;
}

export const workbookBase64 = (rows) => XLSX.write(buildWorkbook(rows), { bookType: 'xlsx', type: 'base64' });

function downloadInBrowser(base64, name) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: MIME }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Native modules are required lazily so the web build never loads them.
// { ok, method: 'download'|'share'|'none', file } — never throws to the UI.
export async function exportExcel(rows = []) {
  try {
    const base64 = workbookBase64(rows);
    if (Platform.OS === 'web') {
      downloadInBrowser(base64, EXPORT_NAME);
      return { ok: true, method: 'download', file: EXPORT_NAME };
    }
    const FileSystem = require('expo-file-system');
    const Sharing = require('expo-sharing');
    const uri = FileSystem.cacheDirectory + EXPORT_NAME;
    await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
    await Sharing.shareAsync(uri, { mimeType: MIME, dialogTitle: 'Save attendance' });
    return { ok: true, method: 'share', file: EXPORT_NAME };
  } catch {
    return { ok: false, method: 'none', file: EXPORT_NAME };
  }
}
