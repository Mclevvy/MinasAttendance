# Set up the shared Google Sheet (5 minutes, once)

The app always works without this — names stay on the PC and the teacher exports Excel.
This is what makes **all computers share one live list**.

1. Open the attendance sheet: <https://docs.google.com/spreadsheets/d/1yKBumyrb_3grSD5siw7iJmZJV57KRuHYgpQS5S3ICD4>
   (Menu → File → Make a copy if you want your own copy. Do not edit the original.)
2. Menu → **Extensions → Apps Script**. Replace ALL the code in the editor with `apps-script/Code.gs` from the project, then Save (💾).
3. Click **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone** (required — the app is not signed in)
   - Click **Deploy**, then **Authorize access** (Google warns it is unverified → *Advanced → Go to … (unsafe)*).
4. Copy the **Web app URL**. It ends in `/exec`.
5. In the app: **Settings → Sheet URL** is already filled in — just open Settings once to confirm, then Save.

Already deployed before? The live list needs the NEW script: paste the new code, then **Deploy → Manage deployments → edit ✏️ → Version: New version → Deploy**. Same URL, no need to re-paste it in the app.

Done. A check: paste the `/exec` URL into a browser tab — you should see the rows as `[{"name":"...","time":"..."}]` (or `[]` while empty).

Rules
- Change the sheet layout and you break the columns. Keep the order: **Name | Time | Device | Seminar**.
- Redeploy as a new version after ANY script change, or the app keeps the old one.
- The app's Clear button now wipes the WHOLE sheet on purpose (all PCs go empty). Always Export Excel first.
- Two students may share a name; the app blocks same-day duplicates on that PC only. The Sheet keeps every row.
