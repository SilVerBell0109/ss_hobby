(function () {
  var hobbies = [
    {
      name: "카페 독서",
      recommender: "팀원 1",
      emoji: "☕📖",
      guide: "근처 조용한 카페에서 책 한 권을 펴보세요. 아메리카노 한 잔과 30분이면 충분합니다.",
      tip: "과제 마감 전날에는 쉬운 소설로 부담을 낮추고, 주말 오전 시간을 고정 루틴으로 만들면 오래 지속됩니다."
    },
    {
      name: "홈 스트레칭",
      recommender: "팀원 2",
      emoji: "🧘💪",
      guide: "유튜브에서 '10분 스트레칭'을 검색하고, 자기 전 매트 하나만 깔면 시작됩니다.",
      tip: "시험 기간에도 자기 전 10분은 지킬 수 있어요. 몸이 풀리면 수면의 질도 올라갑니다."
    },
    {
      name: "그림 일기",
      recommender: "팀원 3",
      emoji: "✏️📔",
      guide: "A5 노트와 0.3mm 펜 하나면 됩니다. 오늘 있었던 일 하나를 작은 그림으로 남겨보세요.",
      tip: "잘 그릴 필요 없어요. 5분 낙서도 나중에 보면 학기의 기억이 됩니다."
    },
    {
      name: "플레이리스트 큐레이팅",
      recommender: "팀원 4",
      emoji: "🎵🎧",
      guide: "공부할 때·잠들기 전·기분 전환용, 테마를 정하고 좋아하는 노래를 모아보세요.",
      tip: "플레이리스트를 완성하는 것 자체가 성취감이 됩니다. 시험 끝나면 그 리스트로 파티를!"
    },
    {
      name: "동네 산책",
      recommender: "팀원 5",
      emoji: "👟🌳",
      guide: "수업 끝나고 한 정류장 먼저 내려서 집까지 걸어보세요. 이어폰 끼고 10~15분이면 충분합니다.",
      tip: "같은 길도 계절마다 다릅니다. 스마트폰을 주머니에 넣고 주변을 보는 습관을 들여보세요."
    }
  ];

  // 각 질문 응답별 취미 가중치 [카페독서, 홈스트레칭, 그림일기, 플레이리스트, 동네산책]
  var stressW = {
    low:  [2, 0, 1, 1, 2],
    mid:  [1, 1, 2, 2, 1],
    high: [0, 3, 2, 2, 1]
  };
  var timeW = [
    [0, 2, 1, 3, 1],  // 10분
    [2, 1, 2, 1, 2],  // 30분
    [3, 1, 3, 1, 1],  // 1시간
    [2, 2, 2, 1, 3]   // 그 이상
  ];
  var moodW = [
    [1, 2, 1, 1, 3],  // 활기참
    [3, 1, 2, 2, 1],  // 평온함
    [1, 3, 1, 2, 1],  // 지침
    [1, 2, 3, 3, 1]   // 우울함
  ];
  var placeW = [
    [2, 2, 2, 2, 0],  // 실내
    [0, 0, 0, 0, 3],  // 실외
    [1, 1, 1, 1, 1]   // 상관없음
  ];
  var socialW = [
    [2, 2, 2, 2, 1],  // 혼자
    [1, 0, 0, 0, 2],  // 같이
    [2, 1, 1, 1, 2]   // 둘다
  ];

  var form         = document.getElementById("hobby-form");
  var resultBox    = document.getElementById("result-box");
  var resultEmoji  = document.getElementById("result-emoji");
  var resultHobby  = document.getElementById("result-hobby");
  var resultFrom   = document.getElementById("result-from");
  var resultGuide  = document.getElementById("result-guide");
  var resultTip    = document.getElementById("result-tip");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var stress   = parseInt(document.getElementById("stress").value);
    var timeVal  = document.querySelector("input[name='time']:checked");
    var moodVal  = document.getElementById("mood").value;
    var placeVal = document.querySelector("input[name='place']:checked");
    var socialVal = document.querySelector("input[name='social']:checked");

    if (!timeVal || !placeVal || !socialVal) {
      alert("모든 항목을 선택해주세요!");
      return;
    }

    var scores = [0, 0, 0, 0, 0];

    var sw = stress <= 3 ? stressW.low : stress <= 6 ? stressW.mid : stressW.high;
    sw.forEach(function (w, i) { scores[i] += w; });

    var timeIndex = ["10분", "30분", "1시간", "그 이상"].indexOf(timeVal.value);
    timeW[timeIndex].forEach(function (w, i) { scores[i] += w; });

    var moodIndex = ["활기참", "평온함", "지침", "우울함"].indexOf(moodVal);
    moodW[moodIndex].forEach(function (w, i) { scores[i] += w; });

    var placeIndex = ["실내", "실외", "상관없음"].indexOf(placeVal.value);
    placeW[placeIndex].forEach(function (w, i) { scores[i] += w; });

    var socialIndex = ["혼자", "같이", "둘다"].indexOf(socialVal.value);
    socialW[socialIndex].forEach(function (w, i) { scores[i] += w; });

    var best = scores.indexOf(Math.max.apply(null, scores));
    var h = hobbies[best];

    resultEmoji.textContent = h.emoji;
    resultHobby.textContent = h.name;
    resultFrom.textContent  = "추천인 : " + h.recommender;
    resultGuide.textContent = h.guide;
    resultTip.textContent   = h.tip;

    resultBox.style.display = "block";
    resultBox.scrollIntoView({ behavior: "smooth" });
  });
})();
