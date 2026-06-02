(function () {

var rounds = [
  { emoji: "☕ 📖 🪟", answer: "카페에서 독서", choices: ["카페에서 독서", "공부하기", "블로그 작성", "일기 쓰기"] },
  { emoji: "🧘 🏠 💪", answer: "홈 스트레칭", choices: ["홈 스트레칭", "헬스장 운동", "러닝", "요가 학원"] },
  { emoji: "📚 😂 📕", answer: "만화책 읽기", choices: ["웹툰 보기", "소설 읽기", "만화책 읽기", "신문 읽기"] },
  { emoji: "🎵 ➕ 🎶 📱", answer: "플레이리스트 만들기", choices: ["음악 감상", "플레이리스트 만들기", "노래 부르기", "작곡하기"] },
  { emoji: "👟 🌳 ☁️", answer: "동네 산책", choices: ["등산", "자전거 타기", "동네 산책", "러닝"] },
  { emoji: "🎸 🎹 🎵", answer: "악기 연주", choices: ["콘서트 관람", "악기 연주", "노래 부르기", "작곡하기"] },
  { emoji: "🎬 🍿 🛋️", answer: "영화 시청", choices: ["드라마 정주행", "영화 시청", "유튜브 보기", "연극 관람"] },
  { emoji: "📷 🌅 ❤️", answer: "사진 촬영", choices: ["사진 촬영", "여행", "영상 편집", "그림 그리기"] },
  { emoji: "🎨 🖌️ 🖼️", answer: "그림 그리기", choices: ["색칠 공부", "공예 만들기", "그림 그리기", "사진 보정"] },
  { emoji: "🧩 🧠 🤔", answer: "퍼즐 맞추기", choices: ["보드게임", "퍼즐 맞추기", "독서", "퀴즈"] },
  { emoji: "🎮 🕹️ 👾", answer: "게임하기", choices: ["게임하기", "코딩", "애니 보기", "보드게임"] },
  { emoji: "🏕️ 🔥 🌌", answer: "캠핑", choices: ["캠핑", "낚시", "드라이브", "등산"] },
  { emoji: "🎣 🌊 🐟", answer: "낚시", choices: ["서핑", "낚시", "수영", "캠핑"] },
  { emoji: "🍳 🥘 👨‍🍳", answer: "요리하기", choices: ["요리하기", "베이킹", "맛집 탐방", "도시락 만들기"] },
  { emoji: "🧁 🍰 🍪", answer: "베이킹", choices: ["요리하기", "베이킹", "카페 가기", "디저트 먹기"] },
  { emoji: "🚴 🌳 ☀️", answer: "자전거 타기", choices: ["산책", "러닝", "자전거 타기", "등산"] },
  { emoji: "📖 ☕ 🌧️", answer: "독서", choices: ["독서", "공부하기", "신문 읽기", "웹툰 보기"] },
  { emoji: "💻 ⌨️ ☕", answer: "코딩", choices: ["게임하기", "코딩", "영상 편집", "블로그 작성"] },
  { emoji: "✈️ 🧳 📸", answer: "여행", choices: ["출장", "여행", "캠핑", "드라이브"] },
  { emoji: "🎤 🎶 🎵", answer: "노래 부르기", choices: ["춤추기", "노래 부르기", "작곡하기", "악기 연주"] },
  { emoji: "🏀 ⛹️ 🏆", answer: "농구하기", choices: ["축구하기", "농구하기", "배구하기", "러닝"] },
  { emoji: "⚽ 🥅 👟", answer: "축구하기", choices: ["축구하기", "농구하기", "배드민턴", "야구"] },
  { emoji: "🏸 🎯 🏃", answer: "배드민턴", choices: ["탁구", "배드민턴", "테니스", "골프"] },
  { emoji: "🎲 👥 😆", answer: "보드게임", choices: ["카드게임", "보드게임", "퍼즐", "퀴즈"] },
  { emoji: "✍️ 📓 ☕", answer: "일기 쓰기", choices: ["독서", "일기 쓰기", "블로그 작성", "그림 그리기"] },
  { emoji: "🐶 🚶 🌳", answer: "반려견 산책", choices: ["캠핑", "조깅", "반려견 산책", "등산"] },
  { emoji: "📱 🎥 ✂️", answer: "영상 편집", choices: ["사진 촬영", "영상 편집", "유튜브 시청", "코딩"] },
  { emoji: "📚 ✏️ ☕", answer: "공부하기", choices: ["독서", "공부하기", "일기 쓰기", "코딩"] },
  { emoji: "🚗 🌃 🎵", answer: "드라이브", choices: ["여행", "드라이브", "캠핑", "산책"] },
  { emoji: "🌱 🪴 ☀️", answer: "식물 키우기", choices: ["텃밭 가꾸기", "식물 키우기", "산책", "캠핑"] },
  { emoji: "📝 🌐 ☕", answer: "블로그 작성", choices: ["일기 쓰기", "코딩", "블로그 작성", "독서"] },
  { emoji: "📺 🍿 🌙", answer: "드라마 정주행", choices: ["영화 시청", "유튜브 보기", "드라마 정주행", "애니 보기"] },
  { emoji: "🎧 🚶 🌳", answer: "음악 들으며 산책", choices: ["러닝", "음악 들으며 산책", "등산", "드라이브"] },
  { emoji: "🎭 👏 🎫", answer: "연극 관람", choices: ["영화 시청", "콘서트 관람", "연극 관람", "뮤지컬"] },
  { emoji: "🎼 🎻 🎹", answer: "클래식 감상", choices: ["클래식 감상", "악기 연주", "노래 부르기", "작곡"] },
  { emoji: "🧶 🪡 👕", answer: "뜨개질", choices: ["뜨개질", "재봉", "그림 그리기", "공예"] },
  { emoji: "🧱 🏠 🎨", answer: "레고 조립", choices: ["퍼즐", "레고 조립", "프라모델", "공예"] },
  { emoji: "📚 🌍 🗣️", answer: "외국어 공부", choices: ["독서", "외국어 공부", "코딩", "일기 쓰기"] },
  { emoji: "🐱 📸 ❤️", answer: "동물 사진 찍기", choices: ["반려견 산책", "사진 촬영", "동물 사진 찍기", "여행"] },
  { emoji: "☕ 🍰 💬", answer: "카페 투어", choices: ["맛집 탐방", "카페 투어", "독서", "드라이브"] }
];

  // 문제 섞기
  rounds.sort(function () {
    return Math.random() - 0.5;
  });

  // 랜덤 10문제
  rounds = rounds.slice(0, 10);

  var currentRound = 0;
  var score = 0;
  var answered = false;
  var streak = 0;

  var timer;
  var timeLeft = 10;

  var roundNumEl = document.getElementById("round-num");
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
  var timerEl = document.getElementById("timer");

  totalRoundsEl.textContent = rounds.length;
  maxScoreEl.textContent = "100+";

  function renderRound() {

    var r = rounds[currentRound];

    roundNumEl.textContent = currentRound + 1;
    emojiComboEl.textContent = r.emoji;

    feedbackEl.textContent =
      "보기를 선택하면 정답·오답 피드백이 표시됩니다";

    feedbackEl.className = "feedback";

    nextBtn.style.display = "none";

    answered = false;

    // 타이머 시작
    timeLeft = 10;

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

          document.querySelectorAll(".choice-btn")
            .forEach(function (b) {
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

    document.querySelectorAll(".choice-btn")
      .forEach(function (b) {
        b.disabled = true;
      });

    if (choice === correct) {

      streak++;

      var gained = 10;

      if (streak >= 3) {
        gained += 5;
      }

      score += gained;

      scoreEl.textContent = score;

      btn.classList.add("correct");
      feedbackEl.classList.add("correct");

      if (streak >= 3) {
        feedbackEl.textContent =
          "🔥 정답! +" + gained + "점 (연속 보너스!)";
      } else {
        feedbackEl.textContent =
          "🎉 정답! +" + gained + "점";
      }

    } else {

      streak = 0;

      btn.classList.add("wrong");
      feedbackEl.classList.add("wrong");

      feedbackEl.textContent =
        "❌ 오답! 정답은 \"" + correct + "\"";

      document.querySelectorAll(".choice-btn")
        .forEach(function (b) {
          if (b.textContent === correct) {
            b.classList.add("correct");
          }
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

  clearInterval(timer);

  gameSection.style.display = "none";
  resultSection.style.display = "block";

  finalScoreEl.textContent = score;

  var grade;
  var comment;

  if (score >= 130) {

    grade = "👑 취미 마스터";
    comment = "취미를 즐기는 데 진심인 사람이네요!";

  } else if (score >= 110) {

    grade = "🔥 취미 고수";
    comment = "다양한 취미를 잘 알고 있어요!";

  } else if (score >= 80) {

    grade = "😊 취미 탐험가";
    comment = "새로운 취미를 찾아다니는 타입!";

  } else if (score >= 50) {

    grade = "🌱 취미 새싹";
    comment = "이제 취미 생활을 시작해볼까요?";

  } else {

    grade = "📚 과제 전사";
    comment = "학기 중엔 과제가 더 친한 친구였군요...";
  }

  gradeEl.innerHTML =
    grade +
    "<br><small>" +
    comment +
    "</small>";
}

  renderRound();

})();
