(function () {
  var LOGO = {
    href: "/main/main.html",
    text: "🍀숨쉴 취미.zip"
  };

  var NAV_ITEMS = [
    { id: "main", href: "/main/main.html", label: "메인" },
    { id: "team", href: "/team/team.html", label: "팀원소개" },
    { id: "game", href: "/game/game.html", label: "게임" },
    { id: "form", href: "/form/form.html", label: "폼" }
  ];

  var FOOTER_TEXT =
    "© 2026 학기 중 취미 추천 · 웹클라이언트컴퓨팅 01분반 · 숨쉴 취미.zip";

  function getActivePage() {
    return document.body.getAttribute("data-page") || "";
  }

  function renderNav(activeId) {
    var items = NAV_ITEMS.map(function (item) {
      var activeAttr = item.id === activeId ? ' class="active"' : "";
      return (
        "<li><a href=\"" +
        item.href +
        "\"" +
        activeAttr +
        ">" +
        item.label +
        "</a></li>"
      );
    }).join("");

    return (
      '<nav class="nav">' +
      '<div class="nav-container">' +
      '<a href="' +
      LOGO.href +
      '" class="nav-logo">' +
      LOGO.text +
      "</a>" +
      '<ul class="nav-menu">' +
      items +
      "</ul>" +
      "</div>" +
      "</nav>"
    );
  }

  function renderFooter() {
    return '<footer class="footer"><p>' + FOOTER_TEXT + "</p></footer>";
  }

  function initLayout() {
    var activeId = getActivePage();
    var navSlot = document.getElementById("site-nav");
    var footerSlot = document.getElementById("site-footer");

    if (navSlot) navSlot.outerHTML = renderNav(activeId);
    if (footerSlot) footerSlot.outerHTML = renderFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLayout);
  } else {
    initLayout();
  }

  window.SiteLayout = {
    init: initLayout,
    navItems: NAV_ITEMS
  };
})();
