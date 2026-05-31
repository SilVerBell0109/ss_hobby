(function () {
  var roundNumEl = document.getElementById("round-num");
  if (!roundNumEl) return;

  var totalRoundsEl = document.getElementById("total-rounds");
  var scoreEl = document.getElementById("score");
  var emojiComboEl = document.getElementById("emoji-combo");
  var choicesEl = document.getElementById("choices");
  var feedbackEl = document.getElementById("feedback");
  var nextBtn = document.getElementById("next-btn");
  var gameSection = document.getElementById("game-section");
  var resultSection = document.getElementById("result-section");
  var finalScoreEl = document.getElementById("final-score");
  var maxScoreEl = document.getElementById("max-score");
  var gradeEl = document.getElementById("grade");

  SiteData.fetch()
    .then(function (data) {
      var game = data.game;
      var rounds = game.rounds;
      var scorePerRound = game.scorePerRound;
      var grades = game.grades.slice().sort(function (a, b) {
        return b.minRatio - a.minRatio;
      });

      var currentRound = 0;
      var score = 0;
      var answered = false;

      totalRoundsEl.textContent = rounds.length;
      maxScoreEl.textContent = rounds.length * scorePerRound;

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
          score += scorePerRound;
          scoreEl.textContent = score;
          btn.classList.add("correct");
          feedbackEl.textContent = "정답! 🎉 +" + scorePerRound + "점";
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
        var max = rounds.length * scorePerRound;
        var ratio = score / max;
        var grade = grades[grades.length - 1].label;
        for (var i = 0; i < grades.length; i++) {
          if (ratio >= grades[i].minRatio) {
            grade = grades[i].label;
            break;
          }
        }
        gradeEl.textContent = grade;
      }

      renderRound();
    })
    .catch(function () {
      alert("데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    });
})();
