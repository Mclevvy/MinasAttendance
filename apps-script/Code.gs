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

// Lets the teacher confirm the deployed URL in a browser before pasting it in the app.
function doGet() {
  return ContentService.createTextOutput('Minas attendance ready').setMimeType(ContentService.MimeType.TEXT);
}
