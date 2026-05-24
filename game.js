(function () {
  var rounds = [
    { emoji: "☕ 📖 🪴", answer: "카페에서 독서", choices: ["카페에서 식물 키우기", "카페에서 독서", "홈카페 만들기", "식물 사진 찍기"] },
    { emoji: "🧘 💪 🏠", answer: "홈 스트레칭", choices: ["헬스장 등록하기", "홈 스트레칭", "다이어트 식단 짜기", "요가 학원 다니기"] },
    { emoji: "📚 🧑‍🎨 🗯️", answer: "만화책 읽기", choices: ["다이어리 꾸미기", "공부 노트 정리", "만화책 읽기", "그림일기 쓰기"] },
    { emoji: "🎵 🎧 🌙", answer: "플레이리스트 만들기", choices: ["음악 감상회 가기", "플레이리스트 만들기", "악기 배우기", "노래방 가기"] },
    { emoji: "👟 🌳 ☁️", answer: "동네 산책", choices: ["등산하기", "자전거 타기", "동네 산책", "마라톤 준비"] },
    { emoji: "🎸 🎹 🎵", answer: "악기 연주", choices: ["콘서트 보러가기", "플레이리스트 만들기", "악기 연주", "공연하기"] },
    { emoji: "🎬 🍿 📺", answer: "영화 시청", choices: ["연극보러 다니기", "영화 시청", "티비 시청하기", "팝콘 만들기"] }
  ];

  var currentRound = 0;
  var score = 0;
  var answered = false;

  var roundNumEl   = document.getElementById("round-num");
  var totalRoundsEl = document.getElementById("total-rounds");
  var scoreEl      = document.getElementById("score");
  var emojiComboEl = document.getElementById("emoji-combo");
  var choicesEl    = document.getElementById("choices");
  var feedbackEl   = document.getElementById("feedback");
  var nextBtn      = document.getElementById("next-btn");
  var gameSection  = document.getElementById("game-section");
  var resultSection = document.getElementById("result-section");
  var finalScoreEl = document.getElementById("final-score");
  var maxScoreEl   = document.getElementById("max-score");
  var gradeEl      = document.getElementById("grade");

  totalRoundsEl.textContent = rounds.length;
  maxScoreEl.textContent = rounds.length * 10;

  function renderRound() {
    var r = rounds[currentRound];
    roundNumEl.textContent = currentRound + 1;
    emojiComboEl.textContent = r.emoji;
    feedbackEl.textContent = "보기를 선택하면 정답·오답 피드백이 표시됩니다";
    feedbackEl.className = "feedback";
    nextBtn.style.display = "none";
    answered = false;

    choicesEl.innerHTML = "";
    r.choices.forEach(function (choice) {
      var btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice;
      btn.addEventListener("click", function () { handleAnswer(btn, choice); });
      choicesEl.appendChild(btn);
    });
  }

  function handleAnswer(btn, choice) {
    if (answered) return;
    answered = true;
    var correct = rounds[currentRound].answer;

    document.querySelectorAll(".choice-btn").forEach(function (b) { b.disabled = true; });

    if (choice === correct) {
      score += 10;
      scoreEl.textContent = score;
      btn.classList.add("correct");
      feedbackEl.textContent = "정답! 🎉 +10점";
      feedbackEl.classList.add("correct");
    } else {
      btn.classList.add("wrong");
      feedbackEl.textContent = "오답 😢 정답은 \"" + correct + "\"";
      feedbackEl.classList.add("wrong");
      document.querySelectorAll(".choice-btn").forEach(function (b) {
        if (b.textContent === correct) b.classList.add("correct");
      });
    }
    nextBtn.style.display = "inline-block";
  }

  nextBtn.addEventListener("click", function () {
    currentRound++;
    if (currentRound >= rounds.length) {
      showResult();
    } else {
      renderRound();
    }
  });

  function showResult() {
    gameSection.style.display = "none";
    resultSection.style.display = "block";
    finalScoreEl.textContent = score;
    var max = rounds.length * 10;
    var grade;
    if (score >= max * 0.8)      grade = "학기중 취미 박사 🏆";
    else if (score >= max * 0.5) grade = "취미 관심러 👍";
    else                         grade = "학기에 너무 바빴군요 😅";
    gradeEl.textContent = grade;
  }

  renderRound();
})();
