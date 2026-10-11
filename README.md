# Minas G6 Attendance — PROJECT BYTE

Hands-on sign-in for Minas Elementary Grade 6. Kids type their name on 3-4 shared computers, see ★ CERTIFICATE EARNED! ★, feed one Google Sheet for certificates.

Seminar: **PROJECT BYTE: BASIC YOUTH TECHNOLOGY EDUCATION** (date TBD — edit in Settings).

## Teacher run (daily)
1. `npm.cmd install` once, then `npx expo start --web` — open on each PC (or `expo start` + Expo Go on tablets).
2. Settings on each PC: Device = PC-1..PC-4, paste Apps Script `/exec` URL once (see SETUP_SHEET.md). Seminar title/date editable.
3. Kids: Sign In tab → type Full Name → ADD ★. Duplicate same day blocked. The count and List tab update live from all PCs every 10 seconds.
4. List tab → Export Excel → `Minas-G6-Attendance.xlsx` (all PCs combined, for certificates). Clear asks twice, wipes device only — never the Sheet.
5. Offline ok: rows show QUEUED, auto-sync when online.

## Dev
- `npm.cmd test` — 14 tests (validate + rows), must stay green.
- Stack: Expo 51 JS, `xlsx`, `expo-file-system/sharing`, AsyncStorage. No backend — Apps Script `apps-script/Code.gs` appends Name|Time|Device|Seminar.
- Never commit the `/exec` URL or student names. Columns fixed — don't reorder the Sheet.
