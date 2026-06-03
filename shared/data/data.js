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

  // members의 hobbyId로 hobbies와 연결한 { member, hobby } 배열
  function getMembersWithHobbies(data) {
    var byId = hobbyMap(data.hobbies);
    return data.members.map(function (m) {
      return {
        member: m,
        hobby: byId[m.hobbyId]
      };
    });
  }

  // form.hobbyIds 순서대로 취미 객체 배열 (가중치 인덱스와 맞춤)
  function getHobbiesByIds(hobbies, ids) {
    var byId = hobbyMap(hobbies);
    return ids.map(function (id) {
      var h = byId[id];
      if (!h) throw new Error("취미 데이터를 찾을 수 없습니다: " + id);
      return h;
    });
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
    // 폼: 취미(hobbyIds 순) + 선택지·가중치 (팀원은 불러오지 않음)
    fetchForm: function () {
      return Promise.all([
        loadJson(PATHS.hobbies),
        loadJson(PATHS.form)
      ]).then(function (parts) {
        var hobbies = parts[0];
        var form = parts[1];
        return {
          hobbies: getHobbiesByIds(hobbies, form.hobbyIds),
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
    getMembersWithHobbies: getMembersWithHobbies
  };
})();
