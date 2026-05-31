(function () {
  var form = document.getElementById("hobby-form");
  if (!form) return;

  var resultBox = document.getElementById("result-box");
  var resultEmoji = document.getElementById("result-emoji");
  var resultHobby = document.getElementById("result-hobby");
  var resultFrom = document.getElementById("result-from");
  var resultGuide = document.getElementById("result-guide");
  var resultTip = document.getElementById("result-tip");

  SiteData.fetch()
    .then(function (data) {
      var formData = data.form;
      var hobbies = formData.hobbies;
      var weights = formData.weights;
      var options = formData.options;
      var stressW = weights.stress;

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var stress = parseInt(document.getElementById("stress").value, 10);
        var timeVal = document.querySelector("input[name='time']:checked");
        var moodVal = document.getElementById("mood").value;
        var placeVal = document.querySelector("input[name='place']:checked");
        var socialVal = document.querySelector("input[name='social']:checked");

        if (!timeVal || !placeVal || !socialVal) {
          alert("모든 항목을 선택해주세요!");
          return;
        }

        var scores = hobbies.map(function () { return 0; });

        var sw =
          stress <= stressW.lowMax
            ? stressW.low
            : stress <= stressW.midMax
              ? stressW.mid
              : stressW.high;
        sw.forEach(function (w, i) { scores[i] += w; });

        var timeIndex = options.time.indexOf(timeVal.value);
        weights.time[timeIndex].forEach(function (w, i) { scores[i] += w; });

        var moodIndex = options.mood.indexOf(moodVal);
        weights.mood[moodIndex].forEach(function (w, i) { scores[i] += w; });

        var placeIndex = options.place.indexOf(placeVal.value);
        weights.place[placeIndex].forEach(function (w, i) { scores[i] += w; });

        var socialIndex = options.social.indexOf(socialVal.value);
        weights.social[socialIndex].forEach(function (w, i) { scores[i] += w; });

        var best = scores.indexOf(Math.max.apply(null, scores));
        var h = hobbies[best];

        resultEmoji.textContent = h.emoji;
        resultHobby.textContent = h.name;
        resultFrom.textContent = "추천인 : " + h.recommender;
        resultGuide.textContent = h.guide;
        resultTip.textContent = h.tip;

        resultBox.style.display = "block";
        resultBox.scrollIntoView({ behavior: "smooth" });
      });
    })
    .catch(function () {
      alert("데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    });
})();
