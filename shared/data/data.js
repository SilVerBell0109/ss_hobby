(function () {
  // 경로별로 한 번 불러온 JSON을 메모리에 보관 (새로고침 시 초기화)
  var cache = {};

  var PATHS = {
    hobbies: "/shared/data/hobbies.json",
    members: "/shared/data/members.json",
    form: "/shared/data/form.json",
    game: "/shared/data/game.json"
  };

  // JSON 파일 fetch 후 파싱, 같은 경로는 캐시에서 반환
  function loadJson(path) {
    if (cache[path]) return Promise.resolve(cache[path]);
    return fetch(path)
      .then(function (res) {
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        return res.json();
      })
      .then(function (data) {
        cache[path] = data;
        return data;
      });
  }

  // 취미 배열 → { id: 취미객체 } 맵 (hobbyId로 조회할 때 사용)
  function hobbyMap(hobbies) {
    var map = {};
    (hobbies || []).forEach(function (h) {
      map[h.id] = h;
    });
    return map;
  }

  // id 순서대로 취미 객체 배열
  function getHobbiesByIds(hobbies, ids) {
    var byId = hobbyMap(hobbies);
    return ids.map(function (id) {
      var h = byId[id];
      if (!h) throw new Error("취미 데이터를 찾을 수 없습니다: " + id);
      return h;
    });
  }

  // 여러 취미를 화면 표시용으로 합침
  function buildHobbyDisplay(hobbies, overrides) {
    overrides = overrides || {};
    return {
      name: overrides.name || hobbies.map(function (h) { return h.name; }).join(" · "),
      emoji: overrides.emoji || hobbies.map(function (h) { return h.emoji; }).join(""),
      cardEmoji: overrides.cardEmoji || (hobbies[0] && hobbies[0].cardEmoji) || "",
      guide: overrides.guide || "",
      tip: overrides.tip || ""
    };
  }

  // members의 hobbyIds로 hobbies와 연결 + 표시용 display
  function getMembersWithHobbies(data) {
    return data.members.map(function (m) {
      var ids = m.hobbyIds || [];
      var hobbies = getHobbiesByIds(data.hobbies, ids);
      var display = buildHobbyDisplay(hobbies, {
        guide: m.teamGuide,
        tip: m.teamTip
      });
      return {
        member: m,
        hobbies: hobbies,
        display: display
      };
    });
  }

  function memberMap(members) {
    var map = {};
    (members || []).forEach(function (m) {
      map[m.id] = m;
    });
    return map;
  }

  // form.recommendations → 취미 묶음 + 멤버 추천인·가이드
  function buildFormRecommendations(hobbies, members, form) {
    var byMemberId = memberMap(members);
    return (form.recommendations || []).map(function (rec) {
      var hobbyList = getHobbiesByIds(hobbies, rec.hobbyIds);
      var member = byMemberId[rec.memberId];
      var display = buildHobbyDisplay(hobbyList, {
        guide: member && member.teamGuide,
        tip: member && member.teamTip
      });
      return {
        memberId: rec.memberId,
        hobbyIds: rec.hobbyIds,
        hobbies: hobbyList,
        display: display,
        recommender: member && member.name
      };
    });
  }

  // 2차 추천: tags·semester 있는 단일 취미 풀
  function buildSecondaryPool(hobbies, form) {
    var cfg = form.secondary || {};
    var minScore = cfg.minSemesterScore != null ? cfg.minSemesterScore : 4;
    return hobbies.filter(function (h) {
      if (!h.tags || !h.semester) return false;
      return h.semester.score >= minScore;
    });
  }

  function stressIndex(stress, lowMax, midMax) {
    if (stress <= lowMax) return 0;
    if (stress <= midMax) return 1;
    return 2;
  }

  // 태그 기반 점수 (2차 추천)
  function scoreHobbyByTags(hobby, stress, timeVal, moodVal, placeVal, socialVal, stressCfg) {
    if (!hobby.tags) return -Infinity;

    var tags = hobby.tags;
    var si = stressIndex(stress, stressCfg.lowMax, stressCfg.midMax);
    var score = (tags.stress && tags.stress[si]) || 0;

    if (tags.time.indexOf(timeVal) >= 0) score += 3;
    if (tags.mood.indexOf(moodVal) >= 0) score += 3;

    if (tags.place.indexOf(placeVal) >= 0) {
      score += 3;
    } else if (placeVal === "상관없음") {
      score += 2;
    } else if (placeVal === "실내" && tags.place.indexOf("실내") < 0) {
      return -Infinity;
    } else if (placeVal === "실외" && tags.place.indexOf("실외") < 0) {
      return -Infinity;
    }

    if (tags.social.indexOf(socialVal) >= 0) {
      score += 3;
    } else if (socialVal === "둘다") {
      score += 2;
    }

    return score;
  }

  function pickSecondaryHobbies(pool, inputs, cfg, excludeIds) {
    var count = cfg.count || 3;
    var exclude = {};
    (excludeIds || []).forEach(function (id) {
      exclude[id] = true;
    });

    var scored = pool
      .filter(function (h) {
        return !exclude[h.id];
      })
      .map(function (h) {
        return {
          hobby: h,
          score: scoreHobbyByTags(
            h,
            inputs.stress,
            inputs.time,
            inputs.mood,
            inputs.place,
            inputs.social,
            inputs.stressCfg
          )
        };
      })
      .filter(function (row) {
        return row.score > -Infinity;
      })
      .sort(function (a, b) {
        return b.score - a.score;
      });

    var picked = [];
    var i = 0;
    while (picked.length < count && i < scored.length) {
      var score = scored[i].score;
      var tied = scored.filter(function (row) {
        return row.score === score;
      });
      tied.sort(function () {
        return Math.random() - 0.5;
      });
      tied.forEach(function (row) {
        if (picked.length >= count) return;
        if (picked.some(function (p) { return p.id === row.hobby.id; })) return;
        picked.push(row.hobby);
      });
      i += tied.length;
    }
    return picked;
  }

  window.SiteData = {
    // 메인·팀: 취미 + 팀원
    fetchContent: function () {
      return Promise.all([
        loadJson(PATHS.hobbies),
        loadJson(PATHS.members)
      ]).then(function (parts) {
        return { hobbies: parts[0], members: parts[1] };
      });
    },
    // 폼: 추천 묶음 + 선택지·가중치
    fetchForm: function () {
      return Promise.all([
        loadJson(PATHS.hobbies),
        loadJson(PATHS.members),
        loadJson(PATHS.form)
      ]).then(function (parts) {
        var form = parts[2];
        return {
          recommendations: buildFormRecommendations(parts[0], parts[1], form),
          secondaryPool: buildSecondaryPool(parts[0], form),
          secondary: form.secondary || {},
          options: form.options,
          weights: form.weights
        };
      });
    },
    // 게임: 라운드·점수 설정
    fetchGame: function () {
      return loadJson(PATHS.game);
    },
    hobbyMap: hobbyMap,
    getHobbiesByIds: getHobbiesByIds,
    buildHobbyDisplay: buildHobbyDisplay,
    getMembersWithHobbies: getMembersWithHobbies,
    pickSecondaryHobbies: pickSecondaryHobbies
  };
})();
