/* ── form-ui.js : 폼 UI 인터랙션 (진행도 · 슬라이더 · 칩 버튼) ── */
 
const CHIP_GROUPS = ['time', 'mood', 'place', 'social'];
const TOTAL_QUESTIONS = 1 + CHIP_GROUPS.length;
 
const STRESS_DESCS = [
  '완전 여유로운 상태 🙌', '거의 안 지침', '살짝 피곤', '조금 지침', '약간 힘듦',
  '보통 수준의 피로도', '좀 지침', '꽤 힘든 상태', '많이 지침', '거의 한계', '완전 탈진 😵'
];
 
/* 진행도 (Q1 스트레스 슬라이더 + Q2~Q5 칩) */
function countFilled() {
  var count = 0;
  var stress = document.getElementById('stress');
  if (stress && stress.value !== '') count += 1;

  count += CHIP_GROUPS.filter(function (n) {
    var el = document.getElementById(n + '-hidden');
    return el && el.value;
  }).length;

  return count;
}

function updateProgress() {
  var filled = countFilled();
  var pct = Math.round((filled / TOTAL_QUESTIONS) * 100);
  var fill = document.getElementById('progress-fill');
  var label = document.getElementById('progress-label');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = filled + ' / ' + TOTAL_QUESTIONS + ' 완료';
}
 
/* 칩 버튼 이벤트 — 이벤트 위임 방식으로 변경 (동적 DOM에도 동작) */
function initChipBtns() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-btn');
    if (!btn) return;
    const name = btn.dataset.name;
    if (!name) return;
    const hidden = document.getElementById(name + '-hidden');
    const isSelected = btn.classList.contains('selected');

    document.querySelectorAll(`.chip-btn[data-name="${name}"]`).forEach(b => b.classList.remove('selected'));

    if (isSelected) {
      if (hidden) hidden.value = '';
    } else {
      btn.classList.add('selected');
      if (hidden) hidden.value = btn.dataset.value;
    }
    updateProgress();
  });
}
 
/* 슬라이더 */
function initSlider() {
  const stressInput = document.getElementById('stress');
  if (!stressInput) return;
  stressInput.addEventListener('input', () => {
    const val = document.getElementById('stress-val');
    const desc = document.getElementById('stress-desc');
    if (val) val.textContent = stressInput.value;
    if (desc) desc.textContent = STRESS_DESCS[+stressInput.value];
  });
}
 
/* 초기화 */
function init() {
  initSlider();
  initChipBtns();
  updateProgress();
}
 
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
