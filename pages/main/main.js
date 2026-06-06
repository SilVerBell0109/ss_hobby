(function () {
  var scrollBtn = document.getElementById("scroll-to-concept");
  var conceptSection = document.getElementById("section-concept");
  if (scrollBtn && conceptSection) {
    scrollBtn.addEventListener("click", function () {
      conceptSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  var grid = document.getElementById("preview-grid");
  if (!grid) return;

  var modal = document.getElementById("hobby-modal");
  var btnClose = document.getElementById("modal-close");

  function openPreviewModal(row) {
    var m = row.member;
    var d = row.display;

    document.getElementById("modal-emoji").textContent = d.emoji;
    document.getElementById("modal-hobby-name").textContent = d.name;
    document.getElementById("modal-recommender").textContent =
      "추천인 : " + m.name;
    document.getElementById("modal-guide").textContent = d.guide;
    document.getElementById("modal-tip").textContent = d.tip;

    var photosEl = document.getElementById("modal-hobby-photos");
    photosEl.innerHTML = "";
    if (m.hobbyPhotos && m.hobbyPhotos.length) {
      m.hobbyPhotos.forEach(function (src) {
        var img = document.createElement("img");
        img.src = src;
        img.className = "modal-hobby-photo";
        photosEl.appendChild(img);
      });
      photosEl.style.display = "flex";
    } else {
      photosEl.style.display = "none";
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  if (btnClose) btnClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  SiteData.fetchContent()
    .then(function (data) {
      var rows = SiteData.getMembersWithHobbies(data);

      grid.innerHTML = "";
      rows.forEach(function (row) {
        var m = row.member;
        var d = row.display;
        if (!row.hobbies.length) return;

        var card = document.createElement("button");
        card.type = "button";
        card.className = "preview-card";

        var avatar = document.createElement("div");
        avatar.className = "preview-avatar";
        avatar.textContent = m.previewAvatar || d.cardEmoji || "";

        var name = document.createElement("p");
        name.className = "name";
        name.textContent = m.name;

        var hobby = document.createElement("p");
        hobby.className = "hobby";
        hobby.textContent = d.name;

        card.appendChild(avatar);
        card.appendChild(name);
        card.appendChild(hobby);
        card.addEventListener("click", function () {
          openPreviewModal(row);
        });
        grid.appendChild(card);
      });
    })
    .catch(function () {
      grid.innerHTML =
        '<p style="text-align:center;color:var(--text-light);">미리보기를 불러오지 못했습니다.</p>';
    });
})();
