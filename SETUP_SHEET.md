# Set up the shared Google Sheet (5 minutes, once)

The app always works without this — names stay on the tablet/PC and the teacher exports Excel.
This is only needed so **all computers write to one shared list**.

1. Open the attendance sheet: <https://docs.google.com/spreadsheets/d/1yKBumyrb_3grSD5siw7iJmZJV57KRuHYgpQS5S3ICD4>
   (Menu → File → Make a copy if you want your own copy. Do not edit the original.)
2. Menu → **Extensions → Apps Script**. Paste the code from `apps-script/Code.gs` into the editor, then Save (💾).
3. Click **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone** (required — the app is not signed in)
   - Click **Deploy**, then **Authorize access** (Google warns it is unverified → *Advanced → Go to … (unsafe)*).
4. Copy the **Web app URL**. It ends in `/exec`.
5. In the app: **Settings → Sheet URL**, paste the URL, Save.

Done. A check: paste the `/exec` URL into a browser tab — you should see `Minas attendance ready`.

Rules
- Change the sheet layout and you break the columns. Keep the order: **Name | Time | Device | Seminar**.
- Redeploy after any code change (Deploy → Manage deployments → edit ✏️ → Version: New version → Deploy).
- Two students may share a name; the app blocks same-day duplicates on that PC only. The Sheet keeps every row.
