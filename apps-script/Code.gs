/**
 * 봄날의 햇살 (Bomnal Sunshine Hub) - Google Apps Script Backend
 * 
 * 구글 스프레드시트를 데이터베이스로 활용하여 여러 기기/브라우저 간 실시간 동기화를 지원합니다.
 * 관리자 비밀번호 기본값: 0809 (스크립트 속성 ADMIN_PASSWORD로 변경 가능)
 */

var DEFAULT_PASSWORD = "0809";

var INITIAL_CATEGORIES = [
  { id: "teaching", label: "수업 도구", description: "수업 준비와 진행에 필요한 도구 모음", colorClass: "strip-sunbeam", bgClass: "bg-amber-500/10", textClass: "text-amber-700", icon: "BookOpen" },
  { id: "management", label: "학급 관리", description: "학급 운영 및 학생 관리를 위한 도구", colorClass: "strip-sage", bgClass: "bg-emerald-500/10", textClass: "text-emerald-700", icon: "ClipboardList" },
  { id: "curriculum", label: "교육과정", description: "교육과정 편성 및 교과 진도 운영 도구", colorClass: "strip-sky", bgClass: "bg-sky-500/10", textClass: "text-sky-700", icon: "GraduationCap" },
  { id: "behavior", label: "행동지원", description: "학생 행동 관찰 및 긍정적 행동지원 도구", colorClass: "strip-coral", bgClass: "bg-rose-500/10", textClass: "text-rose-700", icon: "HeartHandshake" },
  { id: "etc", label: "기타", description: "기타 유용한 링크 및 편의 도구", colorClass: "strip-lavender", bgClass: "bg-purple-500/10", textClass: "text-purple-700", icon: "Sparkles" }
];

function getAdminPassword() {
  var props = PropertiesService.getScriptProperties();
  var pass = props.getProperty("ADMIN_PASSWORD");
  return pass ? pass.trim() : DEFAULT_PASSWORD;
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function initSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var catSheet = getOrCreateSheet(ss, "categories", ["id", "label", "description", "colorClass", "bgClass", "textClass", "icon", "order"]);
  var linkSheet = getOrCreateSheet(ss, "links", ["id", "title", "description", "url", "category", "icon", "order", "updatedAt"]);

  // 기본 카테고리가 없으면 초기 5개 추가
  if (catSheet.getLastRow() <= 1) {
    INITIAL_CATEGORIES.forEach(function(cat, index) {
      catSheet.appendRow([cat.id, cat.label, cat.description, cat.colorClass, cat.bgClass, cat.textClass, cat.icon, index + 1]);
    });
  }

  // 기본 시트(Sheet1 / 시트1)가 비어있다면 정리
  var defaultSheet = ss.getSheetByName("Sheet1") || ss.getSheetByName("시트1");
  if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    initSpreadsheet();
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. 카테고리 읽기
    var catSheet = ss.getSheetByName("categories");
    var catData = catSheet.getDataRange().getValues();
    var categories = [];
    for (var i = 1; i < catData.length; i++) {
      var row = catData[i];
      if (row[0]) {
        categories.push({
          id: String(row[0]),
          label: String(row[1] || ""),
          description: String(row[2] || ""),
          colorClass: String(row[3] || "strip-sunbeam"),
          bgClass: String(row[4] || "bg-amber-500/10"),
          textClass: String(row[5] || "text-amber-700"),
          icon: String(row[6] || "BookOpen"),
          order: Number(row[7] || i)
        });
      }
    }
    categories.sort(function(a, b) { return a.order - b.order; });

    // 2. 링크 읽기
    var linkSheet = ss.getSheetByName("links");
    var linkData = linkSheet.getDataRange().getValues();
    var links = [];
    for (var j = 1; j < linkData.length; j++) {
      var lRow = linkData[j];
      if (lRow[0] && lRow[3]) { // id와 url이 존재할 때
        links.push({
          id: String(lRow[0]),
          title: String(lRow[1] || ""),
          description: String(lRow[2] || ""),
          url: String(lRow[3] || ""),
          category: String(lRow[4] || "teaching"),
          icon: String(lRow[5] || "🔗"),
          order: Number(lRow[6] || j),
          updatedAt: String(lRow[7] || "")
        });
      }
    }
    links.sort(function(a, b) { return a.order - b.order; });

    return jsonResponse({
      success: true,
      categories: categories,
      links: links,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return jsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // 동시 쓰기 방지 (최대 10초 대기)
    lock.waitLock(10000);

    initSpreadsheet();
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    var action = payload.action;
    var password = payload.password;
    var expectedPassword = getAdminPassword();

    // 비밀번호 검증
    if (password !== expectedPassword) {
      return jsonResponse({
        success: false,
        error: "비밀번호가 일치하지 않습니다."
      });
    }

    if (action === "verify") {
      return jsonResponse({ success: true, message: "관리자 인증 완료" });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 링크 전체 교체 저장
    if (action === "save_links") {
      var links = payload.links || [];
      var linkSheet = ss.getSheetByName("links");
      linkSheet.clearContents();
      linkSheet.appendRow(["id", "title", "description", "url", "category", "icon", "order", "updatedAt"]);
      linkSheet.setFrozenRows(1);

      links.forEach(function(l, idx) {
        // http/https 안전 검증
        var cleanUrl = (l.url || "").trim();
        if (!/^https?:\/\//i.test(cleanUrl)) {
          cleanUrl = "https://" + cleanUrl;
        }
        linkSheet.appendRow([
          l.id || ("link-" + (idx + 1)),
          l.title || "",
          l.description || "",
          cleanUrl,
          l.category || "etc",
          l.icon || "🔗",
          idx + 1,
          new Date().toISOString()
        ]);
      });

      return jsonResponse({ success: true, count: links.length });
    }

    // 카테고리 전체 교체 저장
    if (action === "save_categories") {
      var categories = payload.categories || [];
      var catSheet = ss.getSheetByName("categories");
      catSheet.clearContents();
      catSheet.appendRow(["id", "label", "description", "colorClass", "bgClass", "textClass", "icon", "order"]);
      catSheet.setFrozenRows(1);

      categories.forEach(function(c, idx) {
        catSheet.appendRow([
          c.id,
          c.label || "",
          c.description || "",
          c.colorClass || "strip-sunbeam",
          c.bgClass || "bg-amber-500/10",
          c.textClass || "text-amber-700",
          c.icon || "BookOpen",
          idx + 1
        ]);
      });

      return jsonResponse({ success: true, count: categories.length });
    }

    return jsonResponse({ success: false, error: "알 수 없는 요청입니다." });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}
