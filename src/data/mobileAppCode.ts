// ============================================================================
// Official Mobile App Google Apps Script (Code.gs) Source of Truth
// Provided by User: Target Spreadsheet ID: 1fCKKSgYo6LphZs39JURZIDZtAYBiH9JPgjOyS3Xu-PU
// Target Sheet Name: BATHUARY ALL
// ============================================================================

export const MOBILE_APP_APPS_SCRIPT_CODE = `// ============================================================================
// Bathuary Gram Panchayat MGNREGA Master Engine (Code.gs)
// Target Spreadsheet ID: 1fCKKSgYo6LphZs39JURZIDZtAYBiH9JPgjOyS3Xu-PU
// Target Sheet Name: BATHUARY ALL
// ============================================================================

function getMainBeneficiarySheet(ss) {
  var sheet = ss.getSheetByName("BATHUARY ALL");
  if (sheet) return sheet;
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var name = sheets[i].getName().trim().toUpperCase();
    if (name === "BATHUARY ALL" || name.indexOf("BATHUARY") !== -1 || name === "ALL" || name === "DATA" || name === "MAIN") {
      return sheets[i];
    }
  }
  for (var j = 0; j < sheets.length; j++) {
    var sName = sheets[j].getName().trim().toUpperCase();
    if (sName !== "USERS" && sName !== "USER" && sName !== "AUDIT_LOGS" && sName !== "AUDIT" && sName !== "INDEX" && sName !== "LOGS") {
      return sheets[j];
    }
  }
  return sheets[0];
}

function norm(str) {
  return (str || "").toString().toUpperCase().replace(/[\\s\\-_/\\\\#\\.]/g, "");
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var params = (e && e.parameter) ? e.parameter : {};
  var action = (params.action || "").toString().trim();
  
  // 1. LIVE READ ALL DATA from Google Sheet (Mobile App Sync & External Portal)
  if (action === "read" || action === "getData" || action === "getBeneficiaries" || action === "exportCsv" || action === "readAll" || action === "readSheet") {
    return handleReadSheet(ss, params);
  }

  // 2. LIVE WRITE via GET (Fallback for HTTP GET / Webhook redirects)
  if (action === "updateBeneficiary" || action === "saveBeneficiary" || action === "write" || action === "saveRecord") {
    return handleBeneficiaryUpdate(ss, params);
  }

  // 3. User Accounts Management
  if (action === "getUsers" || action === "syncUsers") {
    return handleGetUsers(ss);
  }
  if (action === "saveUser") {
    return handleSaveUser(ss, params);
  }
  if (action === "deleteUser") {
    return handleDeleteUser(ss, params);
  }

  // 4. Audit Trail Management
  if (action === "getAuditLogs" || action === "syncAuditLogs") {
    return handleGetAuditLogs(ss);
  }
  if (action === "clearAuditLogs" || action === "deleteAuditLogs") {
    return handleClearAuditLogs(ss);
  }

  // 5. Ping / Health Check
  if (params.api === "ping" || action === "ping" || params.format === "json") {
    var usersSheet = ss.getSheetByName("USERS");
    var auditSheet = ss.getSheetByName("AUDIT_LOGS");
    var mainSheet = getMainBeneficiarySheet(ss);
    return ContentService.createTextOutput(JSON.stringify({
      status: "CONNECTED",
      sheetName: mainSheet ? mainSheet.getName() : "BATHUARY ALL",
      totalRows: mainSheet ? mainSheet.getLastRow() : 0,
      usersCount: usersSheet ? Math.max(0, usersSheet.getLastRow() - 1) : 0,
      auditLogsCount: auditSheet ? Math.max(0, auditSheet.getLastRow() - 1) : 0,
      message: "Bathuary GP Cloud Engine (Code.gs) is Active & Ready!"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 6. Web Portal (Index.html) Render or Status Dashboard fallback
  try {
    return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('Bathuary Gram Panchayat Job Card Portal')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    var mainSheet = getMainBeneficiarySheet(ss);
    var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bathuary GP Cloud Engine</title>' +
      '<style>body{font-family:sans-serif;background:#0F172A;color:#F8FAFC;padding:30px;text-align:center;}' +
      '.card{background:#1E293B;max-width:560px;margin:40px auto;padding:28px;border-radius:18px;border:1px solid #38BDF8;box-shadow:0 10px 25px rgba(0,0,0,0.5);}' +
      'h2{color:#38BDF8;margin-bottom:8px;}p{color:#94A3B8;line-height:1.6;}.badge{display:inline-block;background:#10B981;color:#fff;padding:4px 12px;border-radius:20px;font-weight:bold;font-size:12px;margin-top:10px;}' +
      '</style></head><body><div class="card">' +
      '<h2>বাথুয়াড়ি গ্রাম পঞ্চায়েত</h2>' +
      '<p><strong>Bathuary GP Cloud Engine (Code.gs) is Active!</strong></p>' +
      '<p>গুগল শিট: <strong>' + (mainSheet ? mainSheet.getName() : "BATHUARY ALL") + '</strong> (' + (mainSheet ? mainSheet.getLastRow() : 0) + ' Rows)</p>' +
      '<span class="badge">ONLINE & READY FOR 2-WAY SYNC</span>' +
      '<p style="margin-top:20px;font-size:12px;color:#64748B;">মোবাইল অ্যাপ লাইভ ২-ওয়ে সিঙ্ক (Read & Write) এবং Index.html পোর্টালের জন্য সফলভাবে চালু রয়েছে।</p>' +
      '</div></body></html>';
    return HtmlService.createHtmlOutput(html)
      .setTitle('Bathuary GP Cloud Engine')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

// ----------------------------------------------------------------------------
// 1. Android App Live HTTP POST Handler (Instant Beneficiary, Multi-Device User, Bank & Audit Sync)
// ----------------------------------------------------------------------------
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};
    
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var action = (data.action || "").toString().trim();

    // --- USER MANAGEMENT SYNC ---
    if (action === "saveUser" || action === "createUser" || action === "updateUser") {
      return handleSaveUser(ss, data);
    }
    if (action === "deleteUser") {
      return handleDeleteUser(ss, data);
    }
    if (action === "getUsers" || action === "syncUsers") {
      return handleGetUsers(ss);
    }

    // --- AUDIT LOGS SYNC ---
    if (action === "getAuditLogs" || action === "syncAuditLogs") {
      return handleGetAuditLogs(ss);
    }
    if (action === "clearAuditLogs" || action === "deleteAuditLogs") {
      return handleClearAuditLogs(ss);
    }

    // --- READ VIA POST ---
    if (action === "read" || action === "getData" || action === "getBeneficiaries" || action === "exportCsv") {
      return handleReadSheet(ss, data);
    }

    // --- BENEFICIARY LIVE UPDATE ---
    return handleBeneficiaryUpdate(ss, data);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "ERROR",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ----------------------------------------------------------------------------
// READ: Return RFC-4180 CSV or JSON of BATHUARY ALL sheet
// ----------------------------------------------------------------------------
function handleReadSheet(ss, params) {
  var sheet = getMainBeneficiarySheet(ss);
  if (!sheet) {
    return ContentService.createTextOutput("Error: Sheet BATHUARY ALL not found").setMimeType(ContentService.MimeType.TEXT);
  }
  var values = sheet.getDataRange().getValues();
  var format = (params && params.format) ? params.format.toString().toLowerCase() : "csv";

  if (format === "json") {
    var headers = values[0] || [];
    var records = [];
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var item = {};
      for (var j = 0; j < row.length; j++) {
        var h = headers[j] ? headers[j].toString() : "col_" + j;
        item[h] = row[j];
      }
      records.push(item);
    }
    return ContentService.createTextOutput(JSON.stringify({
      status: "SUCCESS",
      sheet: sheet.getName(),
      count: records.length,
      data: records
    })).setMimeType(ContentService.MimeType.JSON);
  } else {
    var csvRows = [];
    for (var r = 0; r < values.length; r++) {
      var row = values[r];
      var cells = [];
      for (var c = 0; c < row.length; c++) {
        var val = (row[c] === null || row[c] === undefined) ? "" : row[c].toString();
        if (val.indexOf('"') !== -1 || val.indexOf(',') !== -1 || val.indexOf('\\n') !== -1 || val.indexOf('\\r') !== -1) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        cells.push(val);
      }
      csvRows.push(cells.join(","));
    }
    return ContentService.createTextOutput(csvRows.join("\\r\\n"))
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// ----------------------------------------------------------------------------
// WRITE: Unified Beneficiary Update (Used by Mobile App & Web Portal)
// ----------------------------------------------------------------------------
function handleBeneficiaryUpdate(ss, data) {
  try {
    var sheet = getMainBeneficiarySheet(ss);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "ERROR",
        message: "Sheet BATHUARY ALL not found in spreadsheet!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "ERROR",
        message: "Sheet is empty or has no data rows!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var jobCard = (data.jobCardNumber || data.colH || "").toString().trim().toUpperCase();
    var appNo = (data.applicantNo || data.colI || "1").toString().trim();
    var sheetSlNo = parseInt(data.sheetSlNo || data.slNo || "-1");
    var rowIndex = parseInt(data.rowIndex || "-1");
    var targetRow = -1;

    // Detect Job Card column from header row (1 row read for instant speed)
    var headerRow = sheet.getRange(1, 1, 1, Math.min(26, sheet.getLastColumn())).getValues()[0];
    var jcCol = 7;
    var appCol = 8;
    for (var c = 0; c < headerRow.length; c++) {
      var head = (headerRow[c] || "").toString().trim().toLowerCase();
      if ((head.indexOf("job card") !== -1 || head.indexOf("jobcard") !== -1 || head.indexOf("জব কার্ড") !== -1) && c <= 15) {
        jcCol = c;
        break;
      }
    }
    for (var c2 = 0; c2 < headerRow.length; c2++) {
      var head2 = (headerRow[c2] || "").toString().trim().toLowerCase();
      if ((head2.indexOf("applicant no") !== -1 || head2.indexOf("app no") !== -1 || head2.indexOf("আবেদনকারী") !== -1) && c2 <= 15) {
        appCol = c2;
        break;
      }
    }

    var normJc = norm(jobCard);
    var baseJc = norm(jobCard.split("/")[0]);
    var suffixApp = jobCard.indexOf("/") !== -1 ? jobCard.split("/")[1].trim() : appNo;

    // 1. Direct row match via rowIndex if provided (Instant ~0.02s)
    if (rowIndex >= 2 && rowIndex <= lastRow) {
      var rRow = sheet.getRange(rowIndex, 1, 1, Math.max(jcCol + 1, 10)).getValues()[0];
      var rJc = (rRow[jcCol] || "").toString();
      if (!jobCard || norm(rJc) === normJc || norm(rJc).indexOf(baseJc) !== -1 || (baseJc && baseJc.indexOf(norm(rJc)) !== -1)) {
        targetRow = rowIndex;
      }
    }

    // 2. Direct row match via sheetSlNo (Row = sheetSlNo + 1)
    if (targetRow === -1 && sheetSlNo >= 1 && (sheetSlNo + 1) <= lastRow) {
      var candidateRow = sheetSlNo + 1;
      var cRow = sheet.getRange(candidateRow, 1, 1, Math.max(jcCol + 1, 10)).getValues()[0];
      var cJc = (cRow[jcCol] || "").toString();
      if (!jobCard || norm(cJc) === normJc || norm(cJc).indexOf(baseJc) !== -1 || (baseJc && baseJc.indexOf(norm(cJc)) !== -1)) {
        targetRow = candidateRow;
      }
    }

    // 3. Fast column scan on Job Card column only (~0.15s)
    if (targetRow === -1 && normJc && lastRow > 1) {
      var jcVals = sheet.getRange(1, jcCol + 1, lastRow, 1).getValues();
      for (var j = 1; j < jcVals.length; j++) {
        var rowValJc = (jcVals[j][0] || "").toString();
        var rowNormJc = norm(rowValJc);
        if (rowNormJc === normJc) {
          targetRow = j + 1;
          break;
        }
        var rowBaseJc = norm(rowValJc.split("/")[0]);
        if (rowBaseJc === baseJc) {
          targetRow = j + 1;
          break;
        }
      }
    }

    // 4. Fallback to full sheet scan ONLY if not matched above
    if (targetRow === -1) {
      var values = sheet.getDataRange().getValues();
      for (var r = 1; r < values.length; r++) {
        for (var col = 0; col < values[r].length; col++) {
          var cellVal = (values[r][col] || "").toString();
          if (norm(cellVal) === normJc || (baseJc && norm(cellVal) === baseJc)) {
            targetRow = r + 1;
            break;
          }
        }
        if (targetRow !== -1) break;
      }

      // 5. Fallback: Search by Aadhaar Number (Col P / 15)
      var aadhaar = (data.aadhaarNumber || data.colP || "").toString().replace(/^'+/, "").trim();
      if (targetRow === -1 && aadhaar.length >= 12) {
        for (var a = 1; a < values.length; a++) {
          var rowAadh = (values[a][15] || "").toString().replace(/^'+/, "").trim();
          if (rowAadh === aadhaar) {
            targetRow = a + 1;
            break;
          }
        }
      }

      // 6. Fallback: Search by Bank Account Number (Col AR / 43)
      var acct = (data.accountNumber || data.colAR || "").toString().replace(/^'+/, "").trim();
      if (targetRow === -1 && acct.length >= 9) {
        for (var b = 1; b < values.length; b++) {
          var rowAcct = (values[b][43] || "").toString().replace(/^'+/, "").trim();
          if (rowAcct === acct) {
            targetRow = b + 1;
            break;
          }
        }
      }
    }

    if (targetRow !== -1) {
      var changedFields = data.changedFields || null;
      var hasFilter = Array.isArray(changedFields) && changedFields.length > 0;

      function shouldUpdate(fieldKey, colKey) {
        if (hasFilter) {
          return changedFields.indexOf(fieldKey) !== -1 || changedFields.indexOf(colKey) !== -1;
        }
        return (data[fieldKey] !== undefined && data[fieldKey] !== null) ||
               (data[colKey] !== undefined && data[colKey] !== null);
      }

      function writeCell(row, col, value, asText) {
        try {
          var val = (value === null || value === undefined) ? "" : value.toString().replace(/^'+/, "").trim();
          var range = sheet.getRange(row, col);
          if (asText) {
            try { range.setNumberFormat('@'); } catch(e0) {}
          }
          range.setValue(val);
        } catch(e) {
          try { sheet.getRange(row, col).setValue(value); } catch(e2) {}
        }
      }

      // Col P (16): Aadhaar Number (Text format @)
      if (shouldUpdate("aadhaarNumber", "colP")) {
        var rawP = data.colP !== undefined ? data.colP : data.aadhaarNumber;
        writeCell(targetRow, 16, rawP, true);
      }

      // Col Q (17): Worker Phone Number (Text format @)
      if (shouldUpdate("workerPhone", "colQ")) {
        var rawQ = data.colQ !== undefined ? data.colQ : data.workerPhone;
        writeCell(targetRow, 17, rawQ, true);
      }

      // Col R (18): E-KYC Done ("Yes" / "No")
      if (shouldUpdate("eKycDone", "colR")) {
        var rawR = (data.colR !== undefined ? data.colR : (data.eKycDone || "")).toString().trim();
        var colR = (rawR.toUpperCase() === "Y" || rawR.toUpperCase() === "YES" || rawR === "হ্যাঁ" || rawR.toUpperCase() === "DONE") ? "Yes" : (rawR.toUpperCase() === "N" || rawR.toUpperCase() === "NO" || rawR === "না" || rawR.toUpperCase() === "PENDING") ? "No" : rawR;
        writeCell(targetRow, 18, colR, false);
      }

      // Col S (19): Date of e-KYC
      if (shouldUpdate("eKycDate", "colS")) {
        var colS = (data.colS !== undefined ? data.colS : (data.eKycDate || "")).toString().trim();
        writeCell(targetRow, 19, colS, false);
      }

      // Col T (20): Error code
      if (shouldUpdate("eKycError", "colT")) {
        var colT = (data.colT !== undefined ? data.colT : (data.eKycError || "")).toString().trim();
        writeCell(targetRow, 20, colT, false);
      }

      // Col U (21): E-KYC Done By
      if (shouldUpdate("eKycDoneBy", "colU")) {
        var colU = (data.colU !== undefined ? data.colU : (data.eKycDoneBy || "")).toString().trim();
        writeCell(targetRow, 21, colU, false);
      }

      // Col V (22): Village Name
      if (shouldUpdate("villageName", "colV")) {
        var colV = (data.colV !== undefined ? data.colV : (data.villageName || "")).toString().trim();
        writeCell(targetRow, 22, colV, false);
      }

      // Col W (23): Job Card Submitted
      if (shouldUpdate("jobCardSubmitted", "colW")) {
        var rawW = (data.colW !== undefined ? data.colW : (data.jobCardSubmitted || "")).toString().trim();
        var colW = (rawW.toUpperCase() === "Y" || rawW.toUpperCase() === "YES" || rawW === "হ্যাঁ" || rawW.toUpperCase() === "SUBMITTED") ? "Yes" : (rawW.toUpperCase() === "N" || rawW.toUpperCase() === "NO" || rawW === "না") ? "No" : rawW;
        writeCell(targetRow, 23, colW, false);
      }

      // Col X (24): Remark
      if (shouldUpdate("remark", "colX")) {
        var colX = (data.colX !== undefined ? data.colX : (data.remark || "")).toString().trim();
        writeCell(targetRow, 24, colX, false);
      }

      // Col Y (25): Job Card Book Delivered (Yes/No)
      if (shouldUpdate("jobCardBookDelivered", "colY")) {
        var rawY = (data.colY !== undefined ? data.colY : (data.jobCardBookDelivered || "")).toString().trim();
        var colY = (rawY.toUpperCase() === "Y" || rawY.toUpperCase() === "YES" || rawY === "হ্যাঁ" || rawY.toUpperCase() === "DELIVERED") ? "Yes" : (rawY.toUpperCase() === "N" || rawY.toUpperCase() === "NO" || rawY === "না") ? "No" : rawY;
        writeCell(targetRow, 25, colY, false);
      }

      // Col AO (41): Bank Name
      if (shouldUpdate("bankName", "colAO")) {
        var colAO = (data.colAO !== undefined ? data.colAO : (data.bankName || "")).toString().trim();
        writeCell(targetRow, 41, colAO, false);
      }

      // Col AP (42): IFSC Code
      if (shouldUpdate("ifscCode", "colAP")) {
        var colAP = (data.colAP !== undefined ? data.colAP : (data.ifscCode || "")).toString().toUpperCase().trim();
        writeCell(targetRow, 42, colAP, false);
      }

      // Col AQ (43): Branch Name
      if (shouldUpdate("branchName", "colAQ")) {
        var colAQ = (data.colAQ !== undefined ? data.colAQ : (data.branchName || "")).toString().trim();
        writeCell(targetRow, 43, colAQ, false);
      }

      // Col AR (44): Account Number (Text format @)
      if (shouldUpdate("accountNumber", "colAR")) {
        var rawAR = data.colAR !== undefined ? data.colAR : data.accountNumber;
        writeCell(targetRow, 44, rawAR, true);
      }

      // Record Audit Log and increment user update count across all mobile devices
      recordAuditLogAndIncrementCount(ss, data, jobCard);

      SpreadsheetApp.flush(); // Immediate commit to Google Sheet

      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        row: targetRow,
        sheet: sheet.getName(),
        jobCard: jobCard,
        message: "Google Sheet (" + sheet.getName() + ") Row " + targetRow + "-এ ডাটা সফলভাবে সেভ হয়েছে!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "NOT_FOUND",
      jobCard: jobCard,
      sheetSlNo: sheetSlNo,
      message: "Job Card row not found in sheet BATHUARY ALL (" + jobCard + ")"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "ERROR",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ----------------------------------------------------------------------------
// Multi-Device User Account Management in 'USERS' Sheet Tab
// ----------------------------------------------------------------------------
function getIndianTimestamp(dateObj) {
  var d = dateObj || new Date();
  try {
    return Utilities.formatDate(d, "Asia/Kolkata", "dd/MM/yyyy hh:mm:ss a");
  } catch(e) {
    try {
      return Utilities.formatDate(d, "GMT+05:30", "dd/MM/yyyy hh:mm:ss a");
    } catch(e2) {
      return d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    }
  }
}

function getOrCreateUsersSheet(ss) {
  var sheet = ss.getSheetByName("USERS");
  if (!sheet) {
    sheet = ss.insertSheet("USERS");
    var headers = ["Mobile", "Name", "Role", "Designation", "Password", "Gender", "FatherName", "HusbandName", "Email", "SupervisorId", "AssignedVillages", "TotalUpdates", "UpdatedAt"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#E8F5E9");
    
    var istNow = getIndianTimestamp(new Date());
    var defaultUsers = [
      ["9002736997", "Bathuary Gram Panchayat", "ADMIN", "Admin", "Madan#&2580", "NA", "", "", "bathuarygp@gmail.com", "", "", 0, istNow],
      ["9932353332", "MANIK DAS", "OFFICER", "GRS", "Manik#1234", "Male", "NIRMAL KUMAR DAS", "", "manikdas964747@gmail.com", "", "", 2, istNow],
      ["8900491145", "SK DAVID", "OFFICER", "VLE", "User@12345", "Male", "Sk. Hossain", "", "skdavidoffice@gmail.com", "", "", 7, istNow],
      ["6294986755", "PRASUN MANDAL", "OFFICER", "Nirman Sahayak", "Prasun#1234", "Male", "", "", "prasun.ns@wb.gov.in", "", "", 0, istNow],
      ["8436375622", "BULU DALAI", "SUPERVISOR", "Supervisor", "User@1234", "Female", "CHITTARANJAN DALAI", "ANANTA DALAI", "", "S-WB-11-028-002-006/1265390", "JAGANNATHKARBAR", 10, istNow],
      ["9593248683", "HAREKRISHNA BAR", "SUPERVISOR", "Supervisor", "User@1234", "Male", "BALAI CHARAN BAR", "", "barharekrishna8@gmail.com", "S-WB-11-028-002-002/1263491", "KANTHGANJ, GAGNA, PAIKBAR", 2, istNow]
    ];
    sheet.getRange(2, 1, defaultUsers.length, headers.length).setValues(defaultUsers);
    SpreadsheetApp.flush();
  }
  return sheet;
}

function handleSaveUser(ss, data) {
  var sheet = getOrCreateUsersSheet(ss);
  var mobile = (data.mobile || data.mobileNumber || "").toString().trim();
  if (!mobile) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", message: "Mobile number is required" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  var values = sheet.getDataRange().getValues();
  var targetRow = -1;
  for (var i = 1; i < values.length; i++) {
    if ((values[i][0] || "").toString().trim() === mobile) {
      targetRow = i + 1;
      break;
    }
  }
  
  var istTime = (data.updatedAtIST || data.updatedAtFormatted || getIndianTimestamp(new Date())).toString().trim();
  var rowData = [
    mobile,
    (data.name || "").toString().trim(),
    (data.role || "OFFICER").toString().trim(),
    (data.designation || "GRS").toString().trim(),
    (data.password || "User@1234").toString().trim(),
    (data.gender || "Male").toString().trim(),
    (data.fatherName || "").toString().trim(),
    (data.husbandName || "").toString().trim(),
    (data.email || "").toString().trim(),
    (data.supervisorId || "").toString().trim(),
    (data.assignedVillage || data.assignedVillages || "").toString().trim(),
    parseInt(data.totalUpdatesCount || 0) || 0,
    istTime
  ];
  
  if (targetRow !== -1) {
    sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  SpreadsheetApp.flush();
  
  return ContentService.createTextOutput(JSON.stringify({
    status: "SUCCESS",
    action: "saveUser",
    mobile: mobile,
    message: "User saved & synced to Google Sheet USERS tab!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleDeleteUser(ss, data) {
  var sheet = getOrCreateUsersSheet(ss);
  var mobile = (data.mobile || data.mobileNumber || "").toString().trim();
  if (!mobile) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", message: "Mobile number is required" })).setMimeType(ContentService.MimeType.JSON);
  }
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if ((values[i][0] || "").toString().trim() === mobile) {
      sheet.deleteRow(i + 1);
      SpreadsheetApp.flush();
      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        action: "deleteUser",
        mobile: mobile,
        message: "User deleted from Google Sheet USERS tab!"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: "NOT_FOUND",
    message: "User not found in USERS sheet"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetUsers(ss) {
  var sheet = getOrCreateUsersSheet(ss);
  var values = sheet.getDataRange().getValues();

  // Cross-reference update counts directly from AUDIT_LOGS sheet
  var auditCountsMap = {};
  var auditSheet = ss.getSheetByName("AUDIT_LOGS");
  if (auditSheet) {
    var aValues = auditSheet.getDataRange().getValues();
    for (var k = 1; k < aValues.length; k++) {
      var aMob = (aValues[k][3] || "").toString().trim();
      if (aMob) {
        auditCountsMap[aMob] = (auditCountsMap[aMob] || 0) + 1;
      }
    }
  }

  var users = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var mob = (row[0] || "").toString().trim();
    if (mob) {
      var sheetCount = parseInt(row[11] || 0) || 0;
      var auditCount = auditCountsMap[mob] || 0;
      var finalCount = Math.max(sheetCount, auditCount);

      users.push({
        mobileNumber: mob,
        name: (row[1] || "").toString().trim(),
        role: (row[2] || "OFFICER").toString().trim(),
        designation: (row[3] || "GRS").toString().trim(),
        password: (row[4] || "User@1234").toString().trim(),
        gender: (row[5] || "Male").toString().trim(),
        fatherName: (row[6] || "").toString().trim(),
        husbandName: (row[7] || "").toString().trim(),
        email: (row[8] || "").toString().trim(),
        supervisorId: (row[9] || "").toString().trim(),
        assignedVillage: (row[10] || "").toString().trim(),
        totalUpdatesCount: finalCount
      });
    }
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: "SUCCESS",
    count: users.length,
    users: users
  })).setMimeType(ContentService.MimeType.JSON);
}

// ----------------------------------------------------------------------------
// Multi-Device Audit Logs Management in 'AUDIT_LOGS' Sheet Tab
// ----------------------------------------------------------------------------
function getOrCreateAuditLogsSheet(ss) {
  var sheet = ss.getSheetByName("AUDIT_LOGS");
  var headers = ["Timestamp", "JobCard", "ApplicantName", "UserMobile", "UserName", "UserRole", "UserTotalUpdates", "ChangesSummary", "EpochMillis"];
  if (!sheet) {
    sheet = ss.insertSheet("AUDIT_LOGS");
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#E0F2FE");
    SpreadsheetApp.flush();
  } else {
    // Check if headers need 9th column alignment
    var currentHeaderColCount = sheet.getLastColumn();
    if (currentHeaderColCount < 9 && sheet.getLastRow() >= 1) {
      var currentHeaders = sheet.getRange(1, 1, 1, currentHeaderColCount).getValues()[0];
      if (currentHeaders.length >= 7 && currentHeaders[6] === "ChangesSummary") {
        sheet.insertColumnAfter(6);
        sheet.getRange(1, 7).setValue("UserTotalUpdates").setFontWeight("bold").setBackground("#E0F2FE");
      }
    }
  }
  return sheet;
}

function handleGetAuditLogs(ss) {
  var sheet = getOrCreateAuditLogsSheet(ss);
  var values = sheet.getDataRange().getValues();
  var logs = [];
  var userCountsMap = {};

  // First pass: Calculate total updates per user directly from AUDIT_LOGS sheet
  for (var k = 1; k < values.length; k++) {
    var mobKey = (values[k][3] || "").toString().trim();
    if (mobKey) {
      userCountsMap[mobKey] = (userCountsMap[mobKey] || 0) + 1;
    }
  }

  // Return last 250 logs in reverse order (newest first)
  for (var i = values.length - 1; i >= 1; i--) {
    var row = values[i];
    var jc = (row[1] || "").toString().trim();
    var mob = (row[3] || "").toString().trim();
    if (jc || mob) {
      var is9Col = row.length >= 9;
      var totalUpdates = is9Col ? (parseInt(row[6] || 0) || (userCountsMap[mob] || 0)) : (userCountsMap[mob] || 0);
      var summaryText = is9Col ? (row[7] || "").toString().trim() : (row[6] || "").toString().trim();
      var epochVal = is9Col ? row[8] : row[7];

      logs.push({
        jobCard: jc,
        jobCardNumber: jc,
        applicantName: (row[2] || "").toString().trim(),
        beneficiaryName: (row[2] || "").toString().trim(),
        userId: mob,
        updatedBy: mob,
        userMobile: mob,
        userName: (row[4] || "").toString().trim(),
        userRole: (row[5] || "OFFICER").toString().trim(),
        userTotalUpdates: totalUpdates,
        changesSummary: summaryText,
        epochMillis: parseInt(epochVal || (row[0] ? new Date(row[0]).getTime() : Date.now())) || Date.now(),
        timestamp: parseInt(epochVal || (row[0] ? new Date(row[0]).getTime() : Date.now())) || Date.now()
      });
    }
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: "SUCCESS",
    count: logs.length,
    userUpdateCounts: userCountsMap,
    logs: logs
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleClearAuditLogs(ss) {
  var sheet = ss.getSheetByName("AUDIT_LOGS");
  var deletedCount = 0;
  if (sheet) {
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      deletedCount = lastRow - 1;
      sheet.deleteRows(2, lastRow - 1);
    }
  }
  SpreadsheetApp.flush();
  return ContentService.createTextOutput(JSON.stringify({
    status: "SUCCESS",
    action: "clearAuditLogs",
    clearedCount: deletedCount,
    message: "AUDIT_LOGS cleared successfully!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function recordAuditLogAndIncrementCount(ss, data, jobCard) {
  var userMobile = (data.userId || data.updaterMobile || "").toString().trim();
  if (!userMobile && !jobCard) return;

  var now = new Date();
  var epoch = now.getTime();
  var istFormattedTime = (data.updatedAtIST || data.updatedAtFormatted || getIndianTimestamp(now)).toString().trim();
  var applicantName = (data.applicantName || "").toString().trim();
  var userName = (data.userName || "").toString().trim();
  var userRole = (data.userRole || "OFFICER").toString().trim();
  var summary = (data.changesSummary || "Updated worker details").toString().trim();

  // 1. Calculate & increment user totalUpdates in USERS tab in Indian Standard Time (IST)
  var updatedCount = 1;
  if (userMobile) {
    try {
      var userSheet = getOrCreateUsersSheet(ss);
      var uValues = userSheet.getDataRange().getValues();
      var userFound = false;
      for (var i = 1; i < uValues.length; i++) {
        if ((uValues[i][0] || "").toString().trim() === userMobile) {
          var currentCount = parseInt(uValues[i][11] || 0) || 0;
          updatedCount = currentCount + 1;
          userSheet.getRange(i + 1, 12).setValue(updatedCount);
          userSheet.getRange(i + 1, 13).setValue(istFormattedTime);
          userFound = true;
          break;
        }
      }
      if (!userFound && userMobile) {
        userSheet.appendRow([userMobile, userName, userRole, "GRS", "User@1234", "Male", "", "", "", "", "", 1, istFormattedTime]);
      }
    } catch(e) {}
  }

  // 2. Append to AUDIT_LOGS with user's total update count (Column 7: UserTotalUpdates)
  try {
    var logSheet = getOrCreateAuditLogsSheet(ss);
    logSheet.appendRow([istFormattedTime, jobCard, applicantName, userMobile, userName, userRole, updatedCount, summary, epoch]);
  } catch(e) {}
}

// ----------------------------------------------------------------------------
// 2. Web Portal (Index.html) Support Functions
// ----------------------------------------------------------------------------
function getInitialData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("BATHUARY ALL") || ss.getActiveSheet();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return { sheetData: [], jobCards: [] };
    var lastCol = Math.max(sheet.getLastColumn(), 44);
    var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getDisplayValues();
    var jobCardsSet = {};
    for (var i = 0; i < data.length; i++) {
      var jc = data[i][7] ? data[i][7].toString().trim() : "";
      if (jc) jobCardsSet[jc] = true;
    }
    return { sheetData: data, jobCards: Object.keys(jobCardsSet).sort() };
  } catch (err) {
    return { sheetData: [], jobCards: [], error: err.toString() };
  }
}

function getBankMasterData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("BANK_DATA") || ss.getSheetByName("BANKS") || ss.getSheetByName("BANK MASTER");
    if (sheet && sheet.getLastRow() >= 2) {
      var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, Math.min(sheet.getLastColumn(), 5)).getDisplayValues();
      var list = [];
      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        var ifsc = "";
        var bank = "";
        var branch = "";
        for (var c = 0; c < row.length; c++) {
          var val = (row[c] || "").toString().trim();
          if (/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(val)) {
            ifsc = val.toUpperCase();
          }
        }
        if (ifsc) {
          for (var c = 0; c < row.length; c++) {
            var val = (row[c] || "").toString().trim();
            if (val !== ifsc && val) {
              if (!bank) bank = val;
              else if (!branch) branch = val;
            }
          }
        } else {
          bank = (row[0] || "").toString().trim();
          branch = (row[1] || "").toString().trim();
          ifsc = (row[2] || "").toString().trim().toUpperCase();
        }
        if (bank || ifsc) {
          list.push({ bank: bank, branch: branch, ifsc: ifsc });
        }
      }
      if (list.length > 0) return list;
    }
  } catch(e) {}

  return [
    { bank: "PUNJAB NATIONAL BANK", branch: "BATHUARY", ifsc: "PUNB0778800" },
    { bank: "PUNJAB NATIONAL BANK", branch: "EGRA", ifsc: "PUNB0021600" },
    { bank: "PUNJAB NATIONAL BANK", branch: "LABANYA BAZAR", ifsc: "PUNB0118620" },
    { bank: "PUNJAB NATIONAL BANK", branch: "CONTAI", ifsc: "PUNB0021500" },
    { bank: "PUNJAB NATIONAL BANK", branch: "PATASHPUR", ifsc: "PUNB0243400" },
    { bank: "PUNJAB NATIONAL BANK", branch: "MUGBERIA", ifsc: "PUNB0099400" },
    { bank: "PUNJAB NATIONAL BANK", branch: "TAMLUK", ifsc: "PUNB0330500" },
    { bank: "PUNJAB NATIONAL BANK", branch: "HALDIA", ifsc: "PUNB0231400" },
    { bank: "STATE BANK OF INDIA", branch: "BATHUARY ADB", ifsc: "SBIN0006734" },
    { bank: "STATE BANK OF INDIA", branch: "EGRA", ifsc: "SBIN0000069" },
    { bank: "STATE BANK OF INDIA", branch: "CONTAI", ifsc: "SBIN0000057" },
    { bank: "STATE BANK OF INDIA", branch: "RAMNAGAR", ifsc: "SBIN0000166" },
    { bank: "STATE BANK OF INDIA", branch: "TAMLUK", ifsc: "SBIN0000193" },
    { bank: "STATE BANK OF INDIA", branch: "HALDIA", ifsc: "SBIN0001360" },
    { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "BATHUARY", ifsc: "PUNB0RRBBGB" },
    { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "EGRA", ifsc: "PUNB0RRBBGB" },
    { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "ERASHAL", ifsc: "PUNB0RRBBGB" },
    { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "PANCHROL", ifsc: "PUNB0RRBBGB" },
    { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "PANIPARUL", ifsc: "UTBI0RRBBGB" },
    { bank: "BANGIYA GRAMIN VIKASH BANK", branch: "TAMLUK", ifsc: "UTBI0RRBBGB" },
    { bank: "PASCHIM BANGA GRAMIN BANK", branch: "EGRA-II BLOCK", ifsc: "UCBA0RRBPBG" },
    { bank: "PASCHIM BANGA GRAMIN BANK", branch: "HOWRAH HO", ifsc: "UCBA0RRBPBG" },
    { bank: "PASCHIM BANGA GRAMIN BANK", branch: "BURDWAN", ifsc: "UCBA0RRBPBG" },
    { bank: "UTTAR BANGA KSHETRIYA GRAMIN BANK", branch: "COOCH BEHAR HO", ifsc: "CBIN0R40012" },
    { bank: "UTTAR BANGA KSHETRIYA GRAMIN BANK", branch: "SILIGURI", ifsc: "CBIN0R40012" },
    { bank: "INDIA POST PAYMENTS BANK", branch: "BATHUARY BO (EGRA-II)", ifsc: "IPOS0000001" },
    { bank: "INDIA POST PAYMENTS BANK", branch: "EGRA SO (EAST MEDINIPUR)", ifsc: "IPOS0000001" },
    { bank: "INDIA POST PAYMENTS BANK", branch: "CONTAI HO", ifsc: "IPOS0000001" },
    { bank: "INDIA POST PAYMENTS BANK", branch: "TAMLUK HO", ifsc: "IPOS0000001" },
    { bank: "INDIA POST PAYMENTS BANK", branch: "KOLKATA GPO", ifsc: "IPOS0000001" },
    { bank: "UCO BANK", branch: "EGRA", ifsc: "UCBA0002195" },
    { bank: "UCO BANK", branch: "CONTAI", ifsc: "UCBA0000249" },
    { bank: "INDIAN BANK", branch: "EGRA", ifsc: "IDIB000E006" },
    { bank: "CENTRAL BANK OF INDIA", branch: "EGRA", ifsc: "CBIN0283044" },
    { bank: "UNION BANK OF INDIA", branch: "EGRA", ifsc: "UBIN0568066" },
    { bank: "BANK OF INDIA", branch: "EGRA", ifsc: "BKID0004381" },
    { bank: "BANK OF BARODA", branch: "EGRA", ifsc: "BARB0EGRAXX" },
    { bank: "BANK OF BARODA", branch: "CONTAI", ifsc: "BARB0CONTAI" },
    { bank: "CANARA BANK", branch: "EGRA", ifsc: "CNRB0002150" },
    { bank: "CANARA BANK", branch: "CONTAI", ifsc: "CNRB0001234" },
    { bank: "BANDHAN BANK", branch: "EGRA", ifsc: "BDBL0001614" },
    { bank: "BANDHAN BANK", branch: "CONTAI", ifsc: "BDBL0001201" },
    { bank: "BALAGERIA CENTRAL COOPERATIVE BANK LTD.", branch: "BALAGERIA", ifsc: "IBKL0752BCB" },
    { bank: "BALAGERIA CENTRAL COOPERATIVE BANK LTD.", branch: "EGRA EVENING", ifsc: "IBKL0752BCB" },
    { bank: "VIDYASAGAR CENTRAL CO-OPERATIVE BANK", branch: "EGRA", ifsc: "WBSC0VCCB05" },
    { bank: "MUGBERIA CENTRAL CO-OPERATIVE BANK", branch: "EGRA", ifsc: "WBSC0MCCB01" },
    { bank: "CONTAI CO-OPERATIVE BANK", branch: "EGRA", ifsc: "WBSC0CCB002" },
    { bank: "WEST BENGAL STATE COOPERATIVE BANK / DCCB", branch: "KOLKATA", ifsc: "WBSC0000001" },
    { bank: "AXIS BANK", branch: "EGRA", ifsc: "UTIB0002521" },
    { bank: "HDFC BANK", branch: "EGRA", ifsc: "HDFC0004746" },
    { bank: "ICICI BANK", branch: "EGRA", ifsc: "ICIC0003738" },
    { bank: "IDBI BANK", branch: "CONTAI", ifsc: "IBKL0000555" },
    { bank: "KOTAK MAHINDRA BANK", branch: "KHARAGPUR", ifsc: "KKBK0000123" },
    { bank: "INDUSIND BANK", branch: "MIDNAPORE", ifsc: "INDB0000456" },
    { bank: "YES BANK", branch: "KOLKATA", ifsc: "YESB0000789" },
    { bank: "FEDERAL BANK", branch: "HOWRAH", ifsc: "FDRL0001234" },
    { bank: "BANK OF MAHARASHTRA", branch: "KOLKATA", ifsc: "MAHB0000123" },
    { bank: "INDIAN OVERSEAS BANK", branch: "KOLKATA", ifsc: "IOBA0000123" },
    { bank: "PUNJAB AND SIND BANK", branch: "KOLKATA", ifsc: "PSIB0000123" },
    { bank: "AIRTEL PAYMENTS BANK", branch: "HEAD OFFICE", ifsc: "AIRP0000001" },
    { bank: "FINO PAYMENTS BANK", branch: "HEAD OFFICE", ifsc: "FINO0000001" },
    { bank: "PAYTM PAYMENTS BANK", branch: "HEAD OFFICE", ifsc: "PYTM0123456" },
    { bank: "AU SMALL FINANCE BANK", branch: "KOLKATA", ifsc: "AUBL0000123" },
    { bank: "UJJIVAN SMALL FINANCE BANK", branch: "EGRA", ifsc: "UJVN0001234" }
  ];
}

function updateData(formData) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var res = handleBeneficiaryUpdate(ss, formData);
    var resObj = JSON.parse(res.getContent());
    if (resObj.status === "SUCCESS") {
      return { status: "success", message: resObj.message || "ডাটা সফলভাবে সেভ করা হয়েছে!" };
    } else {
      return { status: "error", message: resObj.message || "সংরক্ষণ করা যায়নি।" };
    }
  } catch (err) {
    return { status: "error", message: err.toString() };
  }
}
`;
