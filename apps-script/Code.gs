// Minas G6 attendance — bound to the sheet below (same ID as the app default).
// Columns: Name | Time | Device | Seminar
var SHEET_ID = '1yKBumyrb_3grSD5siw7iJmZJV57KRuHYgpQS5S3ICD4';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var row = JSON.parse(e.postData.contents);
    SpreadsheetApp.openById(SHEET_ID).getSheets()[0].appendRow([row.name, row.time, row.device, row.webinar]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('{"ok":true}').setMimeType(ContentService.MimeType.JSON);
}

// Lets every device show one live list: returns the newest 500 rows as JSON.
// After pasting this, redeploy as a NEW version or the app keeps the old script.
// ?action=clear wipes the whole sheet (teacher runs Clear in the app after exporting Excel).
function doGet(e) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (e && e.parameter && e.parameter.action === 'clear') {
    sheet.clearContents();
    return ContentService.createTextOutput('{"cleared":true}').setMimeType(ContentService.MimeType.JSON);
  }
  var values = sheet.getDataRange().getValues();
  var rows = [];
  for (var i = 0; i < values.length && rows.length < 500; i++) {
    var name = String(values[i][0] || '').trim();
    var time = values[i][1] instanceof Date ? values[i][1].toISOString() : String(values[i][1] || '');
    // Date.parse skips a header row ("Name | Time | ...") and any half-typed row.
    if (name && time && !isNaN(Date.parse(time))) rows.push({ name: name, time: time, device: String(values[i][2] || ''), webinar: String(values[i][3] || '') });
  }
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}
