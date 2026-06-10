/**
 * 오버레이 모달 열기/닫기(닫기 버튼, 배경 클릭, ESC)를 한 곳에서 처리한다.
 * @param {HTMLElement|null} overlayEl
 * @param {{ closeBtn?: HTMLElement|string, onClose?: () => void }} [options]
 */
export function bindModal(overlayEl, options) {
  options = options || {};

  if (!overlayEl) {
    return {
      open: function () {},
      close: function () {},
      isOpen: function () { return false; }
    };
  }

  var closeBtn =
    options.closeBtn != null
      ? typeof options.closeBtn === "string"
        ? document.querySelector(options.closeBtn)
        : options.closeBtn
      : overlayEl.querySelector(".modal-close");

  function isOpen() {
    return overlayEl.style.display === "flex";
  }

  function open(beforeOpen) {
    if (typeof beforeOpen === "function") beforeOpen();
    overlayEl.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!isOpen()) return;
    overlayEl.style.display = "none";
    document.body.style.overflow = "";
    if (typeof options.onClose === "function") options.onClose();
  }

  if (closeBtn) closeBtn.addEventListener("click", close);
  overlayEl.addEventListener("click", function (e) {
    if (e.target === overlayEl) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  return { open: open, close: close, isOpen: isOpen };
}
