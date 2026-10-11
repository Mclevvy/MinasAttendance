## Task 1: Scaffold + theme + validate + tests

**Description:** Scaffold Expo app in place, add pixel dark-blue theme, name validation + row builder, node tests.

**Acceptance criteria:**
- [ ] `npx expo start --web` boots with dark-blue pixel home
- [ ] `cleanName` trims/collapses spaces; rejects empty, <2, >60, bad chars
- [ ] Duplicate same-day (case-insensitive) detected

**Verification:**
- [ ] Tests pass: `npm.cmd test`
- [ ] Build succeeds: `npx expo export --dry-run` or web boot
- [ ] Manual check: type "  juan   " → "Juan"? (we keep case, just clean spaces)

**Dependencies:** None

**Files likely touched:**
- `App.js`
- `src/theme.js`
- `src/lib/validate.js`
- `src/lib/rows.js`
- `tests/validate.test.js`

**Estimated scope:** M (3-5 files)

## Task 2: Apps Script bridge

**Description:** 10-line Code.gs bound to the Sheet + sheets.js append + offline outbox + 5-min setup doc.

**Acceptance criteria:**
- [ ] Code.gs appends [Name, Time, Device, Webinar] to first sheet
- [ ] App POSTs JSON, queues on fail in AsyncStorage, retries on launch/online
- [ ] SETUP_SHEET.md lets teacher go from Sheet ID to /exec URL in 5 min

**Verification:**
- [ ] Tests pass: queue round-trip (mock fetch fail → queued → flush)
- [ ] Manual check: airplane mode submit → queued badge → online → appears in Sheet

**Dependencies:** Task 1

**Files likely touched:**
- `apps-script/Code.gs`
- `src/lib/sheets.js`
- `SETUP_SHEET.md`

**Estimated scope:** S (2-3 files)

## Checkpoint: Foundation
- [ ] All tests pass
- [ ] Application builds without errors
- [ ] Core user flow works end-to-end (local add + queue)
- [ ] Review with human before proceeding

## Task 3: Sign-in screen (kid flow)

**Description:** One-screen kid flow: PROJECT BYTE header, big Name input, ADD button, pixel success badge, duplicate guard.

**Acceptance criteria:**
- [ ] Big input + ADD, Enter submits, clears + focuses next kid
- [ ] Success shows "CERTIFICATE EARNED!" + name + webinar title
- [ ] Duplicate same day → friendly "Already signed in!"

**Verification:**
- [ ] Manual check: 3 names in a row on shared PC, <1s each, no nav lost

**Dependencies:** Tasks 1-2

**Files likely touched:**
- `App.js`
- `src/components/PixelButton.js`
- `src/components/PixelInput.js`
- `src/components/SuccessBadge.js`

**Estimated scope:** M

## Task 4: List + teacher export + clear

**Description:** Live list below input, count, teacher Export .xlsx via xlsx+sharing, Clear with confirm, offline badge.

**Acceptance criteria:**
- [ ] List newest-first, count, timestamp
- [ ] Export creates `Minas-G6-Attendance.xlsx` and opens/shares
- [ ] Clear asks confirm, wipes local + outbox only (never Sheet)

**Verification:**
- [ ] Manual check: export opens in Excel with 4 columns; clear needs double-tap confirm

**Dependencies:** Task 3

**Files likely touched:**
- `src/components/NameList.js`
- `src/lib/excel.js`
- `App.js`

**Estimated scope:** M

## Checkpoint: Core Features
- [ ] End-to-end flow works (type → list → Sheet → Excel)
- [ ] Review with human before proceeding

## Task 5: Settings + README + verify

**Description:** Settings (webinar title default PROJECT BYTE..., date TBD editable, device label PC-1..4, /exec URL, Sheet ID default), README for teacher, full verify.

**Acceptance criteria:**
- [ ] Webinar title/date + device + URLs persist via AsyncStorage
- [ ] README has run + export + cert steps for non-technical teacher
- [ ] No console.log/TODO, ponytail pass

**Verification:**
- [ ] `npm.cmd test` + web boot + export dry-run all green

**Dependencies:** Task 4

**Files likely touched:**
- `src/screens/Settings.js` (or inline in App.js if smaller — prefer inline)
- `README.md`
- `app.json`

**Estimated scope:** S

## Checkpoint: Complete
- [ ] All acceptance criteria met
- [ ] Ready for thor + review
