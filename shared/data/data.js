(function () {
  var cache = null;

  function fetchSiteData() {
    if (cache) return Promise.resolve(cache);
    return fetch("/shared/data/data.json")
      .then(function (res) {
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        return res.json();
      })
      .then(function (data) {
        cache = data;
        return data;
      });
  }

  function hobbyMap(hobbies) {
    var map = {};
    (hobbies || []).forEach(function (h) {
      map[h.id] = h;
    });
    return map;
  }

  function getMembersWithHobbies(data) {
    var byId = hobbyMap(data.hobbies);
    return data.members.map(function (m) {
      return {
        member: m,
        hobby: byId[m.hobbyId]
      };
    });
  }

  window.SiteData = {
    fetch: fetchSiteData,
    hobbyMap: hobbyMap,
    getMembersWithHobbies: getMembersWithHobbies
  };
})();
