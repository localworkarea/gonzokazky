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
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1,
    effects: true,
    smoothTouch: 0.1,
    ignoreMobileResize: true,
    normalizeScroll: true
  });
  let mm;
  let lastWidth = window.innerWidth;
  ScrollTrigger.refresh();
  document.querySelector(".logo-main__picture");
  function createAnimation() {
    const shadowTop = document.querySelector(".shadow--top");
    if (shadowTop) {
      gsap.to(shadowTop, {
        opacity: 1,
        scrollTrigger: {
          trigger: ".hero",
          start: "10% top",
          end: "bottom top",
          scrub: 1
        }
      });
    }
    if (mm) mm.revert();
    mm = gsap.matchMedia();
    mm.add(
      {
        pc: "(min-width: 64.061em)",
        // 1024.98
        mob: "(max-width: 64.061em)"
        // mob: "(max-width: 51.311em)",
      },
      (context) => {
        const { pc, mob } = context.conditions;
        const logoMain = document.querySelector(".logo-main__picture");
        if (pc) {
          if (logoMain) {
            gsap.fromTo(
              logoMain,
              {
                top: "100px"
              },
              {
                top: "55px",
                left: "50%",
                transform: "translate(-50%, 0)",
                width: "139px",
                ease: "none",
                scrollTrigger: {
                  trigger: ".hero",
                  start: "10% top",
                  end: "bottom 70%",
                  scrub: 1,
                  scroller: smoother.scrollContainer
                  // markers: true
                }
              }
            );
          }
        }
        if (mob) {
          gsap.to(logoMain, {
            width: "133px",
            scrollTrigger: {
              trigger: ".hero",
              start: "10% top",
              end: "bottom 70%",
              scrub: 1
            }
          });
        }
        return () => {
        };
      }
    );
  }
  function setupWolf() {
    const wolf = document.querySelector(".wolf");
    const wolfItems = document.querySelectorAll(".wolf__item");
    const sec2 = document.querySelector(".section-2");
    const sections = Array.from(document.querySelectorAll("section"));
    if (!wolf || !sec2 || sections.length < 3 || wolfItems.length === 0) return;
    const sec2Index = sections.indexOf(sec2);
    const lastIndex = sections.length - 1;
    const untilIndex = Math.max(sec2Index, lastIndex - 1);
    const sumHeight = sections.slice(sec2Index, untilIndex + 1).reduce((acc, el) => acc + el.getBoundingClientRect().height, 0);
    const sec2Top = sec2.offsetTop;
    gsap.set(wolf, {
      top: sec2Top,
      height: sumHeight
    });
    const maxY = () => Math.max(0, wolf.offsetHeight - window.innerHeight);
    if (maxY() === 0) {
      gsap.set(wolfItems, { y: 0 });
      ScrollTrigger.getAll().filter((t) => t.vars?.id === "wolfItemsScroll").forEach((t) => t.kill());
      return;
    }
    ScrollTrigger.getAll().filter((t) => t.vars?.id === "wolfItemsScroll").forEach((t) => t.kill());
    gsap.set(wolfItems, { y: 0 });
    {
      const REST_VH = 0.1;
      const END_VH = 0.3;
      const END_ZONE = 0.25;
      const SMOOTH = 0.06;
      const MAX_LAG = 30;
      const LAG_FACTOR = 0.08;
      const endEase = gsap.parseEase("power2.out");
      const maxY2 = () => Math.max(0, wolf.offsetHeight - window.innerHeight);
      const restOffsetAt = (progress) => {
        const t = gsap.utils.clamp(0, 1, (progress - (1 - END_ZONE)) / END_ZONE);
        const vh = gsap.utils.interpolate(REST_VH, END_VH, endEase(t));
        return window.innerHeight * vh;
      };
      ScrollTrigger.getAll().filter((t) => t.vars?.id === "wolfItemsScroll").forEach((t) => t.kill());
      if (wolf._wolfTick) {
        gsap.ticker.remove(wolf._wolfTick);
        wolf._wolfTick = null;
      }
      gsap.set(wolfItems, { y: 0 });
      const setY = gsap.quickSetter(wolfItems, "y", "px");
      const clampLag = gsap.utils.clamp(-MAX_LAG, MAX_LAG);
      let currentBase = 0;
      let targetLag = 0;
      let currentY = 0;
      let targetY = 0;
      const tick = () => {
        currentY += (targetY - currentY) * SMOOTH;
        setY(currentY);
      };
      wolf._wolfTick = tick;
      gsap.ticker.add(tick);
      ScrollTrigger.create({
        id: "wolfItemsScroll",
        trigger: wolf,
        start: "top 20%",
        end: () => `+=${maxY2()}`,
        scrub: 1,
        scroller: smoother.scrollContainer,
        invalidateOnRefresh: true,
        // markers: true,
        onRefresh(self) {
          currentBase = 0;
          targetLag = 0;
          currentY = restOffsetAt(0);
          targetY = currentY;
          setY(currentY);
        },
        onUpdate(self) {
          const progress = self.progress;
          currentBase = progress * maxY2();
          const rest = restOffsetAt(progress);
          const v = self.getVelocity();
          targetLag = clampLag(-v * LAG_FACTOR);
          targetY = currentBase + rest + targetLag;
        },
        onKill() {
          if (wolf._wolfTick) {
            gsap.ticker.remove(wolf._wolfTick);
            wolf._wolfTick = null;
          }
        }
      });
      ScrollTrigger.create({
        id: "wolfItemsFade",
        trigger: wolf,
        start: () => `bottom-=${200} bottom`,
        // когда до конца wolf остаётся 100px
        end: "bottom bottom",
        // конец трека
        scrub: 1,
        scroller: smoother.scrollContainer,
        invalidateOnRefresh: true,
        // markers: true,
        onUpdate(self) {
          const fade = 1 - self.progress;
          gsap.to(wolfItems, { opacity: fade, overwrite: "auto", duration: 0.1 });
        },
        onRefresh(self) {
          gsap.set(wolfItems, { opacity: 1 });
        }
      });
    }
  }
  createAnimation();
  setupWolf();
  window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth;
    if (currentWidth !== lastWidth) {
      lastWidth = currentWidth;
      setTimeout(() => {
        createAnimation();
        setupWolf();
      }, 50);
      ScrollTrigger.refresh();
      smoother?.refresh();
    }
  });
});
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
