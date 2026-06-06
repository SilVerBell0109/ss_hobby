(function () {
  var stressRange = document.getElementById("stress");
  var stressVal = document.getElementById("stress-val");
  if (stressRange && stressVal) {
    function syncStressValue() {
      stressVal.textContent = stressRange.value;
    }
    syncStressValue();
    stressRange.addEventListener("input", syncStressValue);
  }

  var form = document.getElementById("hobby-form");
  if (!form) return;

  var resultBox = document.getElementById("result-box");
  var resultEmoji = document.getElementById("result-emoji");
  var resultHobby = document.getElementById("result-hobby");
  var resultFrom = document.getElementById("result-from");
  var resultGuide = document.getElementById("result-guide");
  var resultTip = document.getElementById("result-tip");
  var secondaryBox = document.getElementById("secondary-box");
  var secondaryTitle = document.getElementById("secondary-title");
  var secondaryList = document.getElementById("secondary-list");

  var secondaryModal = document.getElementById("secondary-modal");
  var secondaryModalClose = document.getElementById("secondary-modal-close");
  var secondaryModalEmoji = document.getElementById("secondary-modal-emoji");
  var secondaryModalName = document.getElementById("secondary-modal-name");
  var secondaryModalGuide = document.getElementById("secondary-modal-guide");
  var secondaryModalTip = document.getElementById("secondary-modal-tip");

  var OUTDOOR_HOBBY_IDS = ["travel", "neighborhood-walk"];

  function openSecondaryModal(hobby) {
    if (!secondaryModal) return;
    secondaryModalEmoji.textContent = hobby.emoji || "";
    secondaryModalName.textContent = hobby.name || "";
    secondaryModalGuide.textContent = hobby.guide || "";
    secondaryModalTip.textContent = hobby.tip || "";
    secondaryModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeSecondaryModal() {
    if (!secondaryModal) return;
    secondaryModal.style.display = "none";
    document.body.style.overflow = "";
  }

  if (secondaryModalClose) {
    secondaryModalClose.addEventListener("click", closeSecondaryModal);
  }
  if (secondaryModal) {
    secondaryModal.addEventListener("click", function (e) {
      if (e.target === secondaryModal) closeSecondaryModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSecondaryModal();
  });

  function renderSecondaryList(hobbies) {
    if (!secondaryList || !secondaryBox) return;

    secondaryList.innerHTML = "";
    if (!hobbies.length) {
      secondaryBox.style.display = "none";
      return;
    }

    hobbies.forEach(function (h) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preview-card secondary-preview-card";

      var avatar = document.createElement("div");
      avatar.className = "preview-avatar";
      avatar.textContent = h.emoji || h.cardEmoji || "🎯";

      var name = document.createElement("p");
      name.className = "name";
      name.textContent = h.name || "";

      btn.appendChild(avatar);
      btn.appendChild(name);
      btn.addEventListener("click", function () {
        openSecondaryModal(h);
      });
      secondaryList.appendChild(btn);
    });

    secondaryBox.style.display = "block";
  }

  SiteData.fetchForm()
    .then(function (formData) {
      var recommendations = formData.recommendations;
      var secondaryPool = formData.secondaryPool;
      var secondaryCfg = formData.secondary;
      var weights = formData.weights;
      var options = formData.options;
      var stressW = weights.stress;

      if (secondaryTitle && secondaryCfg.title) {
        secondaryTitle.textContent = secondaryCfg.title;
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var stress = parseInt(document.getElementById("stress").value, 10);
        var timeVal = document.getElementById("time-hidden").value;
        var moodVal = document.getElementById("mood-hidden").value;
        var placeVal = document.getElementById("place-hidden").value;
        var socialVal = document.getElementById("social-hidden").value;

        if (!timeVal || !moodVal || !placeVal || !socialVal) {
          alert("모든 항목을 선택해주세요!");
          return;
        }

        var scores = recommendations.map(function () { return 0; });

        var sw =
          stress <= stressW.lowMax
            ? stressW.low
            : stress <= stressW.midMax
              ? stressW.mid
              : stressW.high;
        sw.forEach(function (w, i) { scores[i] += w; });

        var timeIndex = options.time.indexOf(timeVal);
        weights.time[timeIndex].forEach(function (w, i) { scores[i] += w; });

        var moodIndex = options.mood.indexOf(moodVal);
        weights.mood[moodIndex].forEach(function (w, i) { scores[i] += w; });

        var placeIndex = options.place.indexOf(placeVal);
        weights.place[placeIndex].forEach(function (w, i) { scores[i] += w; });

        var socialIndex = options.social.indexOf(socialVal);
        weights.social[socialIndex].forEach(function (w, i) { scores[i] += w; });

        if (placeVal === "실내") {
          recommendations.forEach(function (rec, i) {
            var hasOutdoor = rec.hobbyIds.some(function (id) {
              return OUTDOOR_HOBBY_IDS.indexOf(id) >= 0;
            });
            if (hasOutdoor) {
              scores[i] = -Infinity;
            }
          });
        }

        var maxScore = Math.max.apply(null, scores);
        var candidates = scores.reduce(function (arr, s, i) {
          if (s === maxScore) arr.push(i);
          return arr;
        }, []);
        var best = candidates[Math.floor(Math.random() * candidates.length)];
        var rec = recommendations[best];
        var d = rec.display;

        resultEmoji.textContent = d.emoji;
        resultHobby.textContent = d.name;
        resultFrom.textContent = "추천인 : " + rec.recommender;
        resultGuide.textContent = d.guide;
        resultTip.textContent = d.tip;

        var excludeIds = [];
        if (secondaryCfg.excludePrimaryIds !== false) {
          excludeIds = rec.hobbyIds.slice();
        }

        var secondary = SiteData.pickSecondaryHobbies(
          secondaryPool,
          {
            stress: stress,
            time: timeVal,
            mood: moodVal,
            place: placeVal,
            social: socialVal,
            stressCfg: stressW
          },
          secondaryCfg,
          excludeIds
        );
        renderSecondaryList(secondary);

        resultBox.style.display = "block";
        resultBox.scrollIntoView({ behavior: "smooth" });
      });
    })
    .catch(function () {
      alert("데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    });
})();
