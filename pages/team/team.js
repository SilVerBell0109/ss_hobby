import { SiteData } from "/shared/data/data.js";
import { bindModal } from "/shared/modal.js";
import { fillMemberHobbyModal } from "/pages/hobbies/hobby-ui.js";

var grid = document.getElementById("team-grid");
if (grid) {
  var modalOverlay = document.getElementById("hobby-modal");
  var memberModal = bindModal(modalOverlay);

  SiteData.fetchContent()
    .then(function (data) {
      var rows = SiteData.getMembersWithHobbies(data);

      grid.innerHTML = "";
      rows.forEach(function (row) {
        var m = row.member;
        var d = row.display;
        if (!row.hobbies.length) return;

        var card = document.createElement("div");
        card.className = "member-card";

        var photo = document.createElement("div");
        photo.className = "member-photo";
        if (m.photo) {
          var img = document.createElement("img");
          img.src = m.photo;
          img.alt = m.name;
          img.onerror = function () {
            photo.removeChild(img);
            photo.textContent = m.previewAvatar || "📷";
          };
          photo.appendChild(img);
        } else {
          photo.textContent = m.previewAvatar || "📷";
        }

        var name = document.createElement("h3");
        name.className = "member-name";
        name.textContent = m.name;

        var info = document.createElement("p");
        info.className = "member-info";
        info.textContent = m.studentId + " · " + m.major;

        var role = document.createElement("p");
        role.className = "member-detail";
        role.innerHTML = '<span class="label">맡은 역할</span><br>' + m.role;

        var tasks = document.createElement("p");
        tasks.className = "member-detail";
        tasks.innerHTML = '<span class="label">수행 업무</span><br>' + m.tasks;

        var body = document.createElement("div");
        body.className = "member-body";
        body.appendChild(role);
        body.appendChild(tasks);

        var hobbyEl = document.createElement("div");
        hobbyEl.className = "member-hobby";
        hobbyEl.dataset.memberId = m.id;
        hobbyEl.textContent =
          (d.cardEmoji || "") + " 추천 취미 : " + d.name;

        card.appendChild(photo);
        card.appendChild(name);
        card.appendChild(info);
        card.appendChild(body);
        card.appendChild(hobbyEl);
        grid.appendChild(card);

        hobbyEl.addEventListener("click", function () {
          memberModal.open(function () {
            fillMemberHobbyModal(modalOverlay, row);
          });
        });
      });
    })
    .catch(function () {
      grid.innerHTML =
        '<p style="text-align:center;color:var(--text-light);">팀원 정보를 불러오지 못했습니다.</p>';
    });
}