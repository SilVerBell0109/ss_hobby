(function () {
  var grid = document.getElementById("team-grid");
  if (!grid) return;

  var modal = document.getElementById("hobby-modal");
  var btnClose = document.getElementById("modal-close");

  SiteData.fetchContent()
    .then(function (data) {
      var rows = SiteData.getMembersWithHobbies(data);
      var byHobbyId = SiteData.hobbyMap(data.hobbies);

      grid.innerHTML = "";
      rows.forEach(function (row) {
        var m = row.member;
        var h = row.hobby;
        if (!h) return;

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
        role.innerHTML = '<span class="label">맡은 역할 :</span> ' + m.role;

        var tasks = document.createElement("p");
        tasks.className = "member-detail";
        tasks.innerHTML = '<span class="label">수행 업무 :</span> ' + m.tasks;

        var hobbyEl = document.createElement("div");
        hobbyEl.className = "member-hobby";
        hobbyEl.dataset.hobbyId = m.hobbyId;
        hobbyEl.textContent =
          (h.cardEmoji || "") + " 추천 취미 : " + h.name;

        card.appendChild(photo);
        card.appendChild(name);
        card.appendChild(info);
        card.appendChild(role);
        card.appendChild(tasks);
        card.appendChild(hobbyEl);
        grid.appendChild(card);

        hobbyEl.addEventListener("click", function () {
          var hobby = byHobbyId[hobbyEl.dataset.hobbyId];
          if (!hobby) return;
          document.getElementById("modal-emoji").textContent = hobby.emoji;
          document.getElementById("modal-hobby-name").textContent = hobby.name;
          document.getElementById("modal-recommender").textContent =
            "추천인 : " + m.name;
          document.getElementById("modal-guide").textContent = hobby.guide;
          document.getElementById("modal-tip").textContent = hobby.tip;
          modal.style.display = "flex";
          document.body.style.overflow = "hidden";
        });
      });

      function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "";
      }

      btnClose.addEventListener("click", closeModal);
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeModal();
      });
    })
    .catch(function () {
      grid.innerHTML =
        '<p style="text-align:center;color:var(--text-light);">팀원 정보를 불러오지 못했습니다.</p>';
    });
})();
