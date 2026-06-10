export function getSemesterScore(hobby) {
  if (!hobby || !hobby.semester || hobby.semester.score == null) return null;
  return hobby.semester.score;
}

export function semesterBadgeClass(score, minSemesterScore) {
  if (score >= minSemesterScore) return "hobby-badge--semester";
  return "hobby-badge--semester-low";
}

export function createHobbyBadgesEl(hobby, teamByHobbyId, minSemesterScore) {
  var score = getSemesterScore(hobby);
  var teamNames = (teamByHobbyId && teamByHobbyId[hobby.id]) || [];
  if (score == null && !teamNames.length) return null;

  var wrap = document.createElement("div");
  wrap.className = "hobby-card-badges";

  if (score != null) {
    var sem = document.createElement("span");
    sem.className = "hobby-badge " + semesterBadgeClass(score, minSemesterScore);
    sem.textContent = "★" + score;
    wrap.appendChild(sem);
  }

  if (teamNames.length) {
    var team = document.createElement("span");
    team.className = "hobby-badge hobby-badge--team";
    team.textContent = "팀";
    wrap.appendChild(team);
  }

  return wrap;
}

export function fillHobbyModalMeta(container, hobby, teamByHobbyId, minSemesterScore) {
  if (!container) return;

  container.innerHTML = "";
  var score = getSemesterScore(hobby);
  var teamNames = (teamByHobbyId && teamByHobbyId[hobby.id]) || [];

  if (score != null) {
    var scoreEl = document.createElement("span");
    scoreEl.className = "hobby-badge " + semesterBadgeClass(score, minSemesterScore);
    scoreEl.textContent = " 학기 추천 점수 · " + "★" + score;
    container.appendChild(scoreEl);
  }

  if (teamNames.length) {
    var teamEl = document.createElement("span");
    teamEl.className = "hobby-badge hobby-badge--team";
    teamEl.textContent = "팀 추천 · " + teamNames.join(", ");
    container.appendChild(teamEl);
  }

  container.style.display = container.childElementCount ? "flex" : "none";
}

export function getHobbyModalEls(overlay) {
  if (!overlay) return {};

  return {
    emoji: overlay.querySelector(".modal-emoji"),
    name: overlay.querySelector(".modal-hobby-name"),
    meta: overlay.querySelector(".modal-hobby-meta"),
    recommender: overlay.querySelector(".modal-recommender"),
    guide: overlay.querySelector("[id$='-guide']"),
    tip: overlay.querySelector("[id$='-tip']"),
    photos: overlay.querySelector(".modal-hobby-photos")
  };
}

function fillHobbyPhotos(container, photos) {
  if (!container) return;

  container.innerHTML = "";
  if (photos && photos.length) {
    photos.forEach(function (src) {
      var img = document.createElement("img");
      img.src = src;
      img.className = "modal-hobby-photo";
      container.appendChild(img);
    });
    container.style.display = "flex";
  } else {
    container.style.display = "none";
  }
}

export function fillHobbyDetailModal(overlay, hobby, teamByHobbyId, minSemesterScore) {
  var els = getHobbyModalEls(overlay);

  if (els.emoji) els.emoji.textContent = hobby.emoji || hobby.cardEmoji || "";
  if (els.name) els.name.textContent = hobby.name || "";
  fillHobbyModalMeta(els.meta, hobby, teamByHobbyId, minSemesterScore);
  if (els.guide) els.guide.textContent = hobby.guide || "";
  if (els.tip) els.tip.textContent = hobby.tip || "";
  if (els.recommender) els.recommender.style.display = "none";
  if (els.photos) els.photos.style.display = "none";
}

export function fillMemberHobbyModal(overlay, row) {
  var m = row.member;
  var d = row.display;
  var els = getHobbyModalEls(overlay);

  if (els.emoji) els.emoji.textContent = d.emoji;
  if (els.name) els.name.textContent = d.name;
  if (els.recommender) {
    els.recommender.textContent = "추천인 : " + m.name;
    els.recommender.style.display = "";
  }
  if (els.meta) els.meta.style.display = "none";
  if (els.guide) els.guide.textContent = d.guide;
  if (els.tip) els.tip.textContent = d.tip;
  fillHobbyPhotos(els.photos, m.hobbyPhotos);
}
