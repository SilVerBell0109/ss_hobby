import { SiteData } from "/shared/data/data.js";
import { bindModal } from "/shared/modal.js";
import {
  createHobbyPreviewCard,
  fillHobbyDetailModal
} from "./hobby-ui.js";

var grid = document.getElementById("hobbies-grid");
if (!grid) {
  // 취미도감 페이지가 아닐 때 조용히 종료
} else {
  var filterEl = document.getElementById("hobbies-filter");
  var countEl = document.getElementById("hobbies-count");
  var emptyEl = document.getElementById("hobbies-empty");
  var mobileFilter = document.getElementById("mobile-filter");
  var modalOverlay = document.getElementById("hobby-modal");
  var hobbyModal = bindModal(modalOverlay);

  var allHobbies = [];
  var teamByHobbyId = {};
  var minSemesterScore = 4;
  var activeFilter = "all";
  var fadeTimer = null;
  var FADE_MS = 220;

  function isSemesterRecommended(hobby) {
    return hobby.semester && hobby.semester.score >= minSemesterScore;
  }

  function isTeamRecommended(hobby) {
    var teamNames = teamByHobbyId[hobby.id];
    return teamNames && teamNames.length > 0;
  }

  function getFilteredHobbies() {
    if (activeFilter === "semester") {
      return allHobbies.filter(isSemesterRecommended);
    }
    if (activeFilter === "team") {
      return allHobbies.filter(isTeamRecommended);
    }
    return allHobbies;
  }

  function openModal(hobby) {
    hobbyModal.open(function () {
      fillHobbyDetailModal(
        modalOverlay,
        hobby,
        teamByHobbyId,
        minSemesterScore
      );
    });
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function syncFilterUI() {
    if (mobileFilter) {
      mobileFilter.value = activeFilter;
    }
    if (filterEl) {
      filterEl.querySelectorAll(".chip-btn").forEach(function (chip) {
        chip.classList.toggle(
          "selected",
          chip.getAttribute("data-filter") === activeFilter
        );
      });
    }
  }

  function paintGrid(list, options) {
    options = options || {};
    grid.innerHTML = "";

    if (countEl) {
      countEl.textContent = list.length + "개 취미";
    }

    if (!list.length) {
      if (emptyEl) emptyEl.style.display = "block";
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";

    list.forEach(function (hobby) {
      grid.appendChild(
        createHobbyPreviewCard(hobby, {
          teamByHobbyId: teamByHobbyId,
          minSemesterScore: minSemesterScore,
          enter: options.cardEnter,
          onClick: openModal
        })
      );
    });
  }

  function renderGrid(animate) {
    syncFilterUI();
    var list = getFilteredHobbies();
    var paintOptions = animate && !prefersReducedMotion()
      ? { cardEnter: true }
      : {};

    if (fadeTimer) {
      clearTimeout(fadeTimer);
      fadeTimer = null;
    }

    if (!animate || prefersReducedMotion()) {
      grid.classList.remove("is-fading");
      paintGrid(list, paintOptions);
      return;
    }

    grid.classList.add("is-fading");
    fadeTimer = setTimeout(function () {
      paintGrid(list, paintOptions);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          grid.classList.remove("is-fading");
        });
      });
      fadeTimer = null;
    }, FADE_MS);
  }

  if (filterEl) {
    filterEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn || !filterEl.contains(btn)) return;

      var nextFilter = btn.getAttribute("data-filter") || "all";
      if (nextFilter === activeFilter) return;

      activeFilter = nextFilter;
      renderGrid(true);
    });
  }
  if (mobileFilter) {
    mobileFilter.addEventListener("change", function () {
      if (this.value === activeFilter) return;

      activeFilter = this.value;
      renderGrid(true);
    });
  }

  SiteData.fetchCatalog()
    .then(function (data) {
      minSemesterScore = data.minSemesterScore;
      teamByHobbyId = SiteData.buildTeamHobbyRecommenders(data.members);
      allHobbies = SiteData.sortHobbiesForCatalog(data.hobbies);
      renderGrid(false);
    })
    .catch(function () {
      grid.innerHTML =
        '<p class="hobbies-empty">취미 목록을 불러오지 못했습니다.</p>';
    });
}
