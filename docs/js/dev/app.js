(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-fls-btn]").forEach((btn) => {
    const starsLayer = document.createElement("div");
    starsLayer.classList.add("btn-stars");
    btn.appendChild(starsLayer);
    const REF_W = 290;
    const REF_H = 70;
    const starsData = [
      { x: 10, y: 15, size: 12, opacity: 1 },
      { x: 40, y: 60, size: 16, opacity: 1 },
      { x: 80, y: 20, size: 20, opacity: 1 },
      { x: 120, y: 50, size: 14, opacity: 1 },
      { x: 160, y: 10, size: 18, opacity: 1 },
      { x: 200, y: 40, size: 15, opacity: 1 },
      { x: 240, y: 25, size: 13, opacity: 1 },
      { x: 260, y: 60, size: 17, opacity: 1 },
      { x: 280, y: 15, size: 11, opacity: 1 },
      { x: 150, y: 30, size: 19, opacity: 1 },
      { x: 60, y: 45, size: 13, opacity: 1 }
    ];
    const btnRect = btn.getBoundingClientRect();
    const scaleX = btnRect.width / REF_W;
    const scaleY = btnRect.height / REF_H;
    starsData.forEach((star, i) => {
      const img = document.createElement("img");
      img.src = "assets/img/icons/star.svg";
      img.classList.add("btn-star");
      img.setAttribute("aria-hidden", "true");
      img.setAttribute("alt", "star");
      img.style.width = `${star.size * scaleX}px`;
      img.style.height = `${star.size * scaleY}px`;
      img.style.left = `${star.x * scaleX}px`;
      img.style.top = `${star.y * scaleY}px`;
      img.style.opacity = star.opacity;
      img.style.animationDelay = `${Math.random() * 1.5}s`;
      img.style.animationDuration = `${1 + Math.random() * 0.3}s`;
      starsLayer.appendChild(img);
    });
  });
});
const isMobile = { Android: function() {
  return navigator.userAgent.match(/Android/i);
}, BlackBerry: function() {
  return navigator.userAgent.match(/BlackBerry/i);
}, iOS: function() {
  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}, Opera: function() {
  return navigator.userAgent.match(/Opera Mini/i);
}, Windows: function() {
  return navigator.userAgent.match(/IEMobile/i);
}, any: function() {
  return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
} };
function addLoadedAttr() {
  if (!document.documentElement.hasAttribute("data-fls-preloader-loading")) {
    window.addEventListener("load", function() {
      setTimeout(function() {
        document.documentElement.setAttribute("data-fls-loaded", "");
      }, 0);
    });
  }
}
addLoadedAttr();
export {
  isMobile as i
};
