(function () {
  var scrollBtn = document.getElementById("scroll-to-pros");
  var prosSection = document.getElementById("section-pros");
  if (scrollBtn && prosSection) {
    scrollBtn.addEventListener("click", function () {
      prosSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  var grid = document.getElementById("preview-grid");
  if (!grid) return;

  SiteData.fetchContent()
    .then(function (data) {
      var rows = SiteData.getMembersWithHobbies(data);

      grid.innerHTML = "";
      rows.forEach(function (row) {
        var m = row.member;
        var h = row.hobby;
        if (!h) return;

        var card = document.createElement("div");
        card.className = "preview-card";

        var avatar = document.createElement("div");
        avatar.className = "preview-avatar";
        avatar.textContent = m.previewAvatar || h.cardEmoji || "";

        var name = document.createElement("p");
        name.className = "name";
        name.textContent = m.name;

        var hobby = document.createElement("p");
        hobby.className = "hobby";
        hobby.textContent = h.name;

        card.appendChild(avatar);
        card.appendChild(name);
        card.appendChild(hobby);
        grid.appendChild(card);
      });
    })
    .catch(function () {
      grid.innerHTML =
        '<p style="text-align:center;color:var(--text-light);">미리보기를 불러오지 못했습니다.</p>';
    });
})();
