(function () {
  SiteData.fetchGame()
    .then(function (cfg) {
      var rounds = cfg.rounds.slice();
      var roundCount = cfg.roundCount || 10;

      rounds.sort(function () {
        return Math.random() - 0.5;
      });
      rounds = rounds.slice(0, roundCount);

      var currentRound = 0;
      var score = 0;
      var answered = false;
      var streak = 0;

      var timerSeconds = cfg.timerSeconds || 10;
      var baseScore = cfg.baseScore || 10;
      var streakBonus = cfg.streakBonus || 5;
      var streakMin = cfg.streakMin || 3;

      var timer;
      var timeLeft = timerSeconds;

      var roundNumEl = document.getElementById("round-num");
      var totalRoundsEl = document.getElementById("total-rounds");
      var scoreEl = document.getElementById("score");
      var emojiComboEl = document.getElementById("emoji-combo");
      var choicesEl = document.getElementById("choices");
      var feedbackEl = document.getElementById("feedback");
      var nextBtn = document.getElementById("next-btn");
      var gameSection = document.getElementById("game-section");
      var resultSection = document.getElementById("result-section");
      var coverSection = document.getElementById("cover-section");
      var startBtn = document.getElementById("start-btn");
      var gameTitleSection = document.getElementById("game-title-section");
      var finalScoreEl = document.getElementById("final-score");
      var maxScoreEl = document.getElementById("max-score");
      var gradeEl = document.getElementById("grade");
      var timerEl = document.getElementById("timer");

      totalRoundsEl.textContent = rounds.length;
      maxScoreEl.textContent = cfg.maxScoreLabel || "100+";

      function scrollToGameHeader() {
        var header = document.querySelector(".game-header");
        if (!header) return;
        var nav = document.querySelector(".nav");
        var offset = (nav ? nav.offsetHeight : 0) + 12;
        var top =
          window.scrollY + header.getBoundingClientRect().top - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }

      function renderRound() {
        var r = rounds[currentRound];

        roundNumEl.textContent = currentRound + 1;
        emojiComboEl.textContent = r.emoji;

        feedbackEl.textContent =
          cfg.feedbackDefault ||
          "보기를 선택하면 정답·오답 피드백이 표시됩니다";
        feedbackEl.className = "feedback";
        nextBtn.style.display = "none";
        answered = false;

        timeLeft = timerSeconds;
        timerEl.textContent = "⏰ " + timeLeft + "초";
        clearInterval(timer);

        timer = setInterval(function () {
          timeLeft--;
          timerEl.textContent = "⏰ " + timeLeft + "초";

          if (timeLeft <= 0) {
            clearInterval(timer);

            if (!answered) {
              answered = true;
              streak = 0;
              feedbackEl.textContent = "⏰ 시간 초과!";
              feedbackEl.className = "feedback wrong";

              document.querySelectorAll(".choice-btn").forEach(function (b) {
                b.disabled = true;
              });

              nextBtn.style.display = "inline-block";
            }
          }
        }, 1000);

        choicesEl.innerHTML = "";

        r.choices.forEach(function (choice) {
          var btn = document.createElement("button");
          btn.className = "choice-btn";
          btn.textContent = choice;
          btn.addEventListener("click", function () {
            handleAnswer(btn, choice);
          });
          choicesEl.appendChild(btn);
        });
      }

      function handleAnswer(btn, choice) {
        if (answered) return;

        clearInterval(timer);
        answered = true;

        var correct = rounds[currentRound].answer;

        document.querySelectorAll(".choice-btn").forEach(function (b) {
          b.disabled = true;
        });

        if (choice === correct) {
          streak++;
          var gained = baseScore;
          if (streak >= streakMin) {
            gained += streakBonus;
          }

          score += gained;
          scoreEl.textContent = score;

          btn.classList.add("correct");
          feedbackEl.classList.add("correct");

          if (streak >= streakMin) {
            feedbackEl.textContent =
              "🔥 정답! +" + gained + "점 (연속 보너스!)";
          } else {
            feedbackEl.textContent = "🎉 정답! +" + gained + "점";
          }
        } else {
          streak = 0;
          btn.classList.add("wrong");
          feedbackEl.classList.add("wrong");
          feedbackEl.textContent =
            '❌ 오답! 정답은 "' + correct + '"';

          document.querySelectorAll(".choice-btn").forEach(function (b) {
            if (b.textContent === correct) {
              b.classList.add("correct");
            }
          });
        }

        nextBtn.style.display = "inline-block";
      }
      startBtn.addEventListener("click", function () {
        startGame();
      });
      nextBtn.addEventListener("click", function () {
        currentRound++;

        if (currentRound >= rounds.length) {
          showResult();
        } else {
          renderRound();
          scrollToGameHeader();
        }
      });
      function startGame() {

        gameTitleSection.style.display = "none";
        coverSection.style.display = "none";
        gameSection.style.display = "block";
        resultSection.style.display = "none";

        currentRound = 0;
        score = 0;
        streak = 0;
        answered = false;

        scoreEl.textContent = "0";

      renderRound();

      gameSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      }
      function showResult() {
        clearInterval(timer);

        gameSection.style.display = "none";
        resultSection.style.display = "block";
        finalScoreEl.textContent = score;

        var grades = cfg.resultGrades || [];
        var picked = grades[grades.length - 1];

        for (var i = 0; i < grades.length; i++) {
          if (score >= grades[i].minScore) {
            picked = grades[i];
            break;
          }
        }

        var grade = picked ? picked.grade : "";
        var comment = picked ? picked.comment : "";

        gradeEl.innerHTML =
          grade + "<br><small>" + comment + "</small>";
      }

      
    })
    .catch(function (err) {
      console.error(err);
      alert("게임 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    });
})();
