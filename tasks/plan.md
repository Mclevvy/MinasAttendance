# Implementation Plan: PROJECT BYTE Attendance

## Overview
Expo app for Minas Elementary G6 hands-on activity. Kids type full name on 3-4 computers, see pixel success, feed one Google Sheet (ID 1yKBum...ICD4) for PROJECT BYTE: BASIC YOUTH TECHNOLOGY EDUCATION (date TBD, editable). Each PC also exports local .xlsx backup. Dark-blue pixel game theme, Press Start 2P headings.

## Architecture Decisions
- Expo SDK 51 JS (not bare RN, not TS) — runs on school PCs via `expo start --web` + Android, zero native config.
- Single sheet via Apps Script Web App URL (teacher deploys 10-line Code.gs bound to sheet, pastes /exec URL in Settings). Rationale: direct Sheets API needs OAuth — too heavy; Apps Script = plain fetch POST, works offline-queue.
- Columns fixed: Name | Time | Device | Webinar. Sheet ID baked as default, /exec URL configurable.
- Local first: AsyncStorage rows + outbox queue; sync retries when online. Excel via `xlsx` lib (no native dep).
- Theme in one file `src/theme.js`; validation in `src/lib/validate.js` — ponytail: reuse, no new utils.

## Task List (index — details in tasks/todo.md)
### Phase 1: Foundation
- [ ] Task 1: Scaffold + theme + validate + tests
- [ ] Task 2: Apps Script bridge (Code.gs + sheets.js + setup doc)

### Checkpoint: Foundation — `npm.cmd test` green, Expo web boots

### Phase 2: Core flow
- [ ] Task 3: Sign-in screen (Pixel input+button, duplicate guard, success badge)
- [ ] Task 4: List + teacher export Excel + clear + offline queue UI

### Checkpoint: Core — type name → appears → .xlsx opens → queued icon when offline

### Phase 3: Polish + ship
- [ ] Task 5: Settings (webinar title/date editable, device label, Sheet URL, default Sheet ID) + README + verify
- [ ] Task 6: thor audit + dead-code/vault pass

## Risks and Mitigations
| Risk | Impact | Mitigation |
| Apps Script not deployed by teacher | High — no shared sheet | Ship local Excel first; app works offline; SETUP_SHEET.md 5-min steps, default Sheet ID prefilled |
| Kids type gibberish/duplicates | Med | validate 2-60 chars, trim+collapse spaces, same-day duplicate block with friendly msg |
| Expo web font offline | Low | System monospace fallback, font load try/catch |
| Parallel edits clash | Low | Append-only rows, no edit/delete sync — last-write-wins not needed |

## Open Questions — all resolved
- Title: PROJECT BYTE: BASIC YOUTH TECHNOLOGY EDUCATION ✓
- Fields: name only ✓
- Sheet: ID 1yKBumyrb_3grSD5siw7iJmZJV57KRuHYgpQS5S3ICD4 ✓ (needs /exec URL after teacher deploys Code.gs)

Tasks tracked in tasks/todo.md.
