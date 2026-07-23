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

  function reveal(cards) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      cards.forEach(function (c) { c.classList.add("in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    cards.forEach(function (c) { observer.observe(c); });
  }

  fetch("slides.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) { throw new Error("HTTP " + res.status); }
      return res.json();
    })
    .then(function (list) {
      if (!Array.isArray(list) || list.length === 0) {
        showStatus("아직 기록된 발표가 없습니다.");
        return;
      }
      /* LOG 번호는 시간순(오래된 발표가 001), 표시는 최신순 */
      var chrono = list.slice().sort(function (a, b) {
        return a.date < b.date ? -1 : 1;
      });
      var numberOf = new Map();
      chrono.forEach(function (item, i) { numberOf.set(item, i + 1); });

      var newestFirst = chrono.slice().reverse();
      var cards = newestFirst.map(function (item, order) {
        return buildCard(item, numberOf.get(item), order);
      });
      grid.append.apply(grid, cards);
      count.textContent = String(list.length).padStart(2, "0") + " ENTRIES";
      reveal(cards);
    })
    .catch(function () {
      showStatus("목록을 불러오지 못했습니다. 새로고침해 주세요.");
    });
})();
