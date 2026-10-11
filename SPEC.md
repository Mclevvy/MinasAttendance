# Spec: Minas Elementary Grade 6 Seminar Attendance

## Objective
For Minas Elementary School Grade 6 hands-on computer activity. Kids on 3-4 shared computers practice typing their own full name. Each submit adds them to one shared attendance list used later for seminar certificates (seminar date TBD, future).
Success = kid types name → sees fun confirmation → name appears in list → lands in one Google Sheet + local Excel backup. Teacher exports final Excel for certificates.

ASSUMPTIONS I'M MAKING:
1. Expo React Native (not bare CLI) — runs on school Windows computers via Web/Android, easiest to install.
2. Single spreadsheet = Google Sheet via Apps Script Web App URL teacher pastes once in Settings. No backend server to maintain.
3. Webinar title/date configurable in Settings (not hardcoded, since date TBD).
4. Fields = Full Name only + timestamp + device label. No login, no section (keeps typing practice simple).
5. Certificates made LATER by teacher from the sheet — app shows "Certificate Earned!" fun screen, not a printable cert.
→ Correct me now or I'll proceed with these.

## Tech Stack
- Expo SDK 51+, React Native, JavaScript (not TS — simplest for school maintenance)
- `xlsx` for local Excel export, `expo-file-system` + `expo-sharing` for save/share, `@react-native-async-storage/async-storage` for settings + offline queue
- Google Apps Script (doPost appends row) — no extra npm dep, plain fetch
- Pixel game UI: Press Start 2P font, dark blue `#0A1A3C / #12295E`, chunky 4px borders, no heavy game engine

## Commands
- Dev: `npx expo start`
- Android: `npx expo run:android`
- Web (school computers): `npx expo start --web`
- Install: `npm.cmd install`
- Test logic: `npm.cmd test` (node assert for name validate + row build, no device needed)

## Project Structure
```
App.js                 → entry, screens switch (SignIn / List / Settings / Success)
src/theme.js           → colors, pixel styles, font loader
src/lib/validate.js    → name trim, length 2-60, letters/spaces/.- only
src/lib/rows.js        → build row {name, timestamp, device, webinar}
src/lib/sheets.js      → append to Apps Script URL, queue offline in AsyncStorage
src/lib/excel.js       → build .xlsx from rows via xlsx
src/components/       → PixelButton, PixelInput, NameList, SuccessBadge
app.json               → Expo name: MinasAttendance
SPEC.md                → this file
```

## Code Style
- Small functions, no abstraction. Reuse theme.js, no duplicate styles.
- Example:
```js
export function cleanName(s){ return s.trim().replace(/\s+/g,' '); }
// validate → {ok, name} or {ok:false, reason}
```
- Names: `cleanName`, `appendRow`, `exportExcel`. Pixel components prefix `Pixel*`.

## Testing Strategy
- Framework: node built-in `node --test` (zero dep), tests in `tests/`
- `tests/validate.test.js` — empty, too short, duplicate names rejected
- `tests/rows.test.js` — row has name/date/device
- Coverage: just these 2 files. Manual check on Web: type name → appears → export opens .xlsx → row in Google Sheet.

## Boundaries
- Always: validate name at boundary, confirm before Clear list, queue offline and retry, no crash on no internet
- Ask first: adding any new npm dep, changing sheet columns, adding auth/login
- Never: commit Google Sheet URL / Apps Script URL, commit student names, edit expo vendor files, delete failing tests

## Success Criteria
1. Kid types "Juan Dela Cruz" → list shows it in <1s with pixel success animation
2. Duplicate same name same day blocked with friendly "Already signed in!"
3. All 3-4 computers append to same Google Sheet (same columns: Name, Time, Device, Webinar)
4. Teacher taps Export → `Minas-G6-Attendance.xlsx` opens/shares correctly in Excel
5. Works offline → queued, auto-syncs when internet returns
6. Dark-blue pixel theme, big input/button usable by Grade 6, Press Start 2P headings

## Open Questions
1. Webinar title to show? (e.g. "Grade 6 Webinar 2026" — or leave editable?)
2. Need Section field (e.g. 6-Rizal)? Or name only is fine?
3. Teacher provides Google account to create Sheet + Apps Script? I can give 5-min setup steps.
