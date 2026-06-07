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
