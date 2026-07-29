/* 발표 기록 — 목록 읽기, 카드 그리기, 등장 효과 */
(function () {
  "use strict";

  var grid = document.getElementById("cards");
  var status = document.getElementById("status");
  var count = document.getElementById("log-count");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showStatus(message) {
    status.textContent = message;
    status.hidden = false;
  }

  function formatDate(iso) {
    return iso.replaceAll("-", ".");
  }

  function buildCard(item, logNumber, order) {
    var li = document.createElement("li");
    li.className = "card";
    li.style.setProperty("--i", String(order % 6));

    var top = document.createElement("div");
    top.className = "card-top mono";
    var num = document.createElement("span");
    num.textContent = "LOG " + String(logNumber).padStart(3, "0");
    var date = document.createElement("span");
    date.textContent = formatDate(item.date);
    top.append(num, date);

    var title = document.createElement("h3");
    title.className = "card-title";
    var link = document.createElement("a");
    link.href = "slides/" + encodeURIComponent(item.dir) + "/";
    link.textContent = item.title;
    title.append(link);

    var desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = item.description || "";

    var open = document.createElement("span");
    open.className = "card-open mono";
    open.setAttribute("aria-hidden", "true");
    open.textContent = "OPEN →";

    li.append(top, title, desc, open);
    return li;
  }



  fetch("slides.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) { throw new Error("HTTP " + res.status); }
      return res.json();
    })
    .then(function (list) {
      if (!Array.isArray(list)) {
        showStatus("목록 파일 형식이 올바르지 않습니다. slides.json을 확인해 주세요.");
        return;
      }
      /* 잘못된 항목은 목록 전체를 죽이지 않고 그 항목만 건너뛴다 */
      var valid = list.filter(function (item) {
        var ok = item &&
          typeof item.title === "string" && item.title.trim() !== "" &&
          typeof item.dir === "string" && item.dir.trim() !== "" &&
          /^\d{4}-\d{2}-\d{2}$/.test(item.date || "");
        if (!ok) { console.warn("slides.json 항목 건너뜀(필수: title, date=YYYY-MM-DD, dir):", item); }
        return ok;
      });
      if (valid.length === 0) {
        showStatus("아직 기록된 발표가 없습니다.");
        return;
      }
      /* LOG 번호는 시간순(오래된 발표가 001), 표시는 최신순 */
      var chrono = valid.slice().sort(function (a, b) {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      });
      var numberOf = new Map();
      chrono.forEach(function (item, i) { numberOf.set(item, i + 1); });

      var newestFirst = chrono.slice().reverse();
      var cards = newestFirst.map(function (item, order) {
        return buildCard(item, numberOf.get(item), order);
      });
      grid.append.apply(grid, cards);
      count.textContent = String(valid.length).padStart(2, "0") + " ENTRIES";
      
      // 알림: 카드 렌더링이 끝났음을 galaxy3d.js 등에 알림
      document.dispatchEvent(new Event('cards-rendered'));
    })
    .catch(function (err) {
      showStatus("데이터를 불러오지 못했습니다. 네트워크 상태를 확인해 주세요. (" + err.message + ")");
    });

  // 스크롤 시 scrolled 클래스 추가 (도입부 애니메이션 및 카드 등장)
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  });

})();
