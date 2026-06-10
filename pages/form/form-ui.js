/* ── form-ui.js : 폼 UI 인터랙션 (진행도 · 슬라이더 · 칩 버튼) ── */

const CHIP_GROUPS = ["time", "mood", "place", "social"];
const TOTAL_QUESTIONS = 1 + CHIP_GROUPS.length;

var stressCfg = {
  lowMax: 3,
  midMax: 6,
  labels: {
    low: "가볍게 즐길 수 있어요",
    mid: "적당히 피곤한 편이에요",
    high: "충전이 필요해요"
  }
};

function stressTier(value, cfg) {
  if (value <= cfg.lowMax) return "low";
  if (value <= cfg.midMax) return "mid";
  return "high";
}

function stressLabel(value, cfg) {
  var tier = stressTier(value, cfg);
  return (cfg.labels && cfg.labels[tier]) || "";
}

function syncStressDesc() {
  var stressInput = document.getElementById("stress");
  var desc = document.getElementById("stress-desc");
  if (!stressInput || !desc) return;
  desc.textContent = stressLabel(+stressInput.value, stressCfg);
}

export function setStressConfig(cfg) {
  if (!cfg) return;
  stressCfg = {
    lowMax: cfg.lowMax != null ? cfg.lowMax : stressCfg.lowMax,
    midMax: cfg.midMax != null ? cfg.midMax : stressCfg.midMax,
    labels: cfg.labels || stressCfg.labels
  };
  syncStressDesc();
}

/* 진행도 (Q1 스트레스 슬라이더 + Q2~Q5 칩) */
function countFilled() {
  var count = 0;
  var stress = document.getElementById("stress");
  if (stress && stress.value !== "") count += 1;

  count += CHIP_GROUPS.filter(function (n) {
    var el = document.getElementById(n + "-hidden");
    return el && el.value;
  }).length;

  return count;
}

function updateProgress() {
  var filled = countFilled();
  var pct = Math.round((filled / TOTAL_QUESTIONS) * 100);
  var fill = document.getElementById("progress-fill");
  var label = document.getElementById("progress-label");
  if (fill) fill.style.width = pct + "%";
  if (label) label.textContent = filled + " / " + TOTAL_QUESTIONS + " 완료";
}

/* 칩 버튼 이벤트 — 이벤트 위임 방식으로 변경 (동적 DOM에도 동작) */
function initChipBtns() {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".chip-btn");
    if (!btn) return;
    var name = btn.dataset.name;
    if (!name) return;
    var hidden = document.getElementById(name + "-hidden");
    var isSelected = btn.classList.contains("selected");

    document.querySelectorAll('.chip-btn[data-name="' + name + '"]').forEach(function (b) {
      b.classList.remove("selected");
    });

    if (isSelected) {
      if (hidden) hidden.value = "";
    } else {
      btn.classList.add("selected");
      if (hidden) hidden.value = btn.dataset.value;
    }
    updateProgress();
  });
}

/* 슬라이더 */
function initSlider() {
  var stressInput = document.getElementById("stress");
  if (!stressInput) return;

  syncStressDesc();

  stressInput.addEventListener("input", function () {
    var val = document.getElementById("stress-val");
    if (val) val.textContent = stressInput.value;
    syncStressDesc();
  });
}

/* 초기화 */
function init() {
  initSlider();
  initChipBtns();
  updateProgress();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
