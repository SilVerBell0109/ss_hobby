/* ── form-ui.js : 폼 UI 인터랙션 (진행도 · 슬라이더 · 칩 버튼) ── */

const CHIP_GROUPS = ['time', 'mood', 'place', 'social'];

const STRESS_DESCS = [
  '완전 여유로운 상태 🙌', '거의 안 지침', '살짝 피곤', '조금 지침', '약간 힘듦',
  '보통 수준의 피로도', '좀 지침', '꽤 힘든 상태', '많이 지침', '거의 한계', '완전 탈진 😵'
];

/* 진행도 */
function countFilled() {
  return CHIP_GROUPS.filter(n => document.getElementById(n + '-hidden').value).length;
}

function updateProgress() {
  const filled = countFilled();
  const pct = Math.round(filled / 4 * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent = filled + ' / 4 완료';
}

/* 슬라이더 */
const stressInput = document.getElementById('stress');
stressInput.addEventListener('input', () => {
  document.getElementById('stress-val').textContent = stressInput.value;
  document.getElementById('stress-desc').textContent = STRESS_DESCS[+stressInput.value];
});

/* 칩 버튼 */
document.querySelectorAll('.chip-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const name = btn.dataset.name;
    document.querySelectorAll(`.chip-btn[data-name="${name}"]`).forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById(name + '-hidden').value = btn.dataset.value;
    updateProgress();
  });
});

/* 초기화 */
updateProgress();
