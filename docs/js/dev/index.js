import { u as uniqArray, i as isMobile } from "./app.min.js";
const videoYoutubeButtons = document.querySelectorAll(".video-youtube__button");
videoYoutubeButtons.forEach((button) => {
  button.addEventListener("click", function() {
    const youTubeCode = this.getAttribute("data-youtube");
    let urlVideo = `https://www.youtube.com/embed/${youTubeCode}?rel=0&showinfo=0`;
    const iframe = document.createElement("iframe");
    iframe.setAttribute("allowfullscreen", "");
    {
      urlVideo += "&autoplay=1";
      iframe.setAttribute("allow", "autoplay; encrypted-media");
    }
    iframe.setAttribute("src", urlVideo);
    const body = this.closest(".video-youtube__body");
    body.innerHTML = "";
    body.appendChild(iframe);
    body.classList.add("video-added");
  });
});
class ScrollWatcher {
  constructor(props) {
    let defaultConfig = {
      logging: true
    };
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.hasAttribute("data-fls-watch") ? this.scrollWatcherRun() : null;
  }
  // Оновлюємо конструктор
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  // Запускаємо конструктор
  scrollWatcherRun() {
    document.documentElement.setAttribute("data-fls-watch", "");
    this.scrollWatcherConstructor(document.querySelectorAll("[data-fls-watcher]"));
  }
  // Конструктор спостерігачів
  scrollWatcherConstructor(items) {
    if (items.length) {
      let uniqParams = uniqArray(Array.from(items).map(function(item) {
        if (item.dataset.flsWatcher === "navigator" && !item.dataset.flsWatcherThreshold) {
          let valueOfThreshold;
          if (item.clientHeight > 2) {
            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
            if (valueOfThreshold > 1) {
              valueOfThreshold = 1;
            }
          } else {
            valueOfThreshold = 1;
          }
          item.setAttribute(
            "data-fls-watcher-threshold",
            valueOfThreshold.toFixed(2)
          );
        }
        return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px"}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
      }));
      uniqParams.forEach((uniqParam) => {
        let uniqParamArray = uniqParam.split("|");
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        };
        let groupItems = Array.from(items).filter(function(item) {
          let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
          let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px";
          let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
          if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) {
            return item;
          }
        });
        let configWatcher = this.getScrollWatcherConfig(paramsWatch);
        this.scrollWatcherInit(groupItems, configWatcher);
      });
    }
  }
  // Функція створення налаштувань
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {};
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    } else if (paramsWatch.root !== "null") ;
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
      return;
    }
    if (paramsWatch.threshold === "prx") {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1; i += 5e-3) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(",");
    }
    configWatcher.threshold = paramsWatch.threshold;
    return configWatcher;
  }
  // Функція створення нового спостерігача зі своїми налаштуваннями
  scrollWatcherCreate(configWatcher) {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  // Функція ініціалізації спостерігача зі своїми налаштуваннями
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach((item) => this.observer.observe(item));
  }
  // Функція обробки базових дій точок спрацьовування
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      !targetElement.classList.contains("--watcher-view") ? targetElement.classList.add("--watcher-view") : null;
    } else {
      targetElement.classList.contains("--watcher-view") ? targetElement.classList.remove("--watcher-view") : null;
    }
  }
  // Функція відключення стеження за об'єктом
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
  }
  // Функція обробки спостереження
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute("data-fls-watcher-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry
      }
    }));
  }
}
document.querySelector("[data-fls-watcher]") ? window.addEventListener("load", () => new ScrollWatcher({})) : null;
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  function isTelegramWebView() {
    const ua = navigator.userAgent || "";
    return /Telegram/i.test(ua) || typeof TelegramWebviewProxy !== "undefined";
  }
  let smoother;
  if (isTelegramWebView()) {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0,
      effects: false,
      smoothTouch: 0,
      ignoreMobileResize: true,
      normalizeScroll: false
    });
  } else {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
      ignoreMobileResize: true,
      normalizeScroll: true
    });
  }
  let mm;
  let mm2;
  let lastWidth = window.innerWidth;
  ScrollTrigger.refresh();
  document.querySelector(".logo-main__picture");
  const wolfBody = document.querySelector(".wolf");
  const section5 = document.querySelector(".section-5");
  const wolfSec = document.querySelector(".section-5__wolf");
  const cauldron = document.querySelector(".section-4__images");
  const sec4 = document.querySelector(".section-4");
  function createAnimation() {
    if (wolfBody) {
      ScrollTrigger.create({
        trigger: section5,
        // start: "bottom bottom",
        start: () => `bottom-=${200} bottom`,
        scroller: smoother?.scrollContainer,
        // markers: true,
        onEnter() {
          wolfBody.classList.add("_opacity");
          wolfSec.classList.add("_active");
        },
        onLeaveBack() {
          wolfBody.classList.remove("_opacity");
          wolfSec.classList.remove("_active");
        }
      });
    }
    if (cauldron) {
      ScrollTrigger.create({
        trigger: sec4,
        start: "top 10%",
        scroller: smoother?.scrollContainer,
        onEnter() {
          cauldron.classList.add("_active");
        },
        onLeaveBack() {
          cauldron.classList.remove("_active");
        }
      });
    }
    if (mm) mm.revert();
    mm = gsap.matchMedia();
    mm.add(
      {
        pc: "(min-width: 64.061em)",
        // 1024.98
        mob: "(max-width: 64.06em)",
        tbMin: "(min-width: 51.311em)",
        // 820.98
        tbMax: "(max-width: 51.31em)"
        // 820.98
      },
      (context) => {
        const { pc, mob, tbMax, tbMin } = context.conditions;
        const logoMain = document.querySelector(".logo-main__picture");
        const shadowTop = document.querySelector(".shadow--top");
        if (shadowTop) {
          gsap.to(shadowTop, {
            opacity: 1,
            scrollTrigger: {
              trigger: ".hero",
              start: "10% top",
              end: "bottom top",
              scrub: 1,
              scroller: smoother.scrollContainer,
              invalidateOnRefresh: true
            }
          });
        }
        const snackBlocks = document.querySelectorAll(".snacks-block");
        if (snackBlocks.length) {
          const startValue = pc ? "top 5%" : "top 20%";
          snackBlocks.forEach((item) => {
            const section = item.closest("section") || item;
            ScrollTrigger.create({
              trigger: section,
              start: startValue,
              scroller: smoother?.scrollContainer,
              onEnter() {
                item.classList.add("_active");
              }
            });
          });
        }
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
          if (logoMain) {
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
    gsap.set(wolfItems, { y: 0, opacity: 0 });
    {
      const REST_VH = 0.1;
      const END_VH = 0.3;
      const END_ZONE = 0.2;
      const SMOOTH = 0.06;
      const MAX_LAG = 30;
      const LAG_FACTOR = 0.05;
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
      gsap.set(wolfItems, { y: 0, opacity: 0 });
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
        start: () => `bottom-=${450} bottom`,
        // когда до конца wolf остаётся 100px
        end: "96% bottom",
        scrub: 1,
        scroller: smoother.scrollContainer,
        invalidateOnRefresh: true,
        // markers: true,
        onUpdate(self) {
          const fade = 1 - self.progress;
          gsap.to(wolfItems, { opacity: fade, overwrite: "auto", duration: 0.6 });
        }
      });
      if (mm2) mm2.revert();
      mm2 = gsap.matchMedia();
      mm2.add(
        {
          pc: "(min-width: 51.312em)",
          // 821px и шире
          mob: "(max-width: 51.311em)"
        },
        (context) => {
          const { pc, mob } = context.conditions;
          const common = {
            trigger: wolf,
            end: () => `+=${maxY2()}`,
            scrub: 1,
            scroller: smoother.scrollContainer,
            invalidateOnRefresh: true
          };
          if (pc) {
            ScrollTrigger.create({
              id: "wolfItemsReveal_pc",
              ...common,
              start: "top 20%",
              onEnter() {
                gsap.to(wolfItems, { opacity: 1, duration: 0.6, ease: "power2.out", overwrite: "auto" });
              },
              onLeaveBack() {
                gsap.to(wolfItems, { opacity: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
              },
              onRefresh(self) {
                const inRange = self.start <= self.scroll() && self.scroll() <= self.end;
                gsap.set(wolfItems, { opacity: inRange ? 1 : 0 });
              }
            });
          }
          if (mob) {
            ScrollTrigger.create({
              id: "wolfItemsReveal_mob",
              ...common,
              start: "top 0%",
              onEnter() {
                gsap.to(wolfItems, { opacity: 1, duration: 0.6, ease: "power2.out", overwrite: "auto" });
              },
              onLeaveBack() {
                gsap.to(wolfItems, { opacity: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
              },
              onRefresh(self) {
                const inRange = self.start <= self.scroll() && self.scroll() <= self.end;
                gsap.set(wolfItems, { opacity: inRange ? 1 : 0 });
              }
            });
          }
          return () => {
          };
        }
      );
    }
  }
  createAnimation();
  setupWolf();
  const starsBody = document.querySelector(".stars-section");
  if (starsBody) {
    const starsPosition = [
      { x: 1170.5, y: 456.5 },
      { x: 934.5, y: 553.5 },
      { x: 860.5, y: 597.5 },
      { x: 89.5, y: 535.5 },
      { x: 44.5, y: 448.5 },
      { x: 74.5, y: 400.5 },
      { x: 23.5, y: 347.5 },
      { x: 114.5, y: 279.5 },
      { x: 5.5, y: 247.5 },
      { x: 167.5, y: 94.5 },
      { x: 92.5, y: 56.5 },
      { x: 92.5, y: 133.5 },
      { x: 235.5, y: 47.5 },
      { x: 202.5, y: 126.5 },
      { x: 188.5, y: 105.5 },
      { x: 400.5, y: 91.5 },
      { x: 346.5, y: 18.5 },
      { x: 6.5, y: 412.5 },
      { x: 20.5, y: 677.5 },
      { x: 1288.5, y: 598.5 },
      { x: 1177.5, y: 555.5 },
      { x: 1043.5, y: 517.5 },
      { x: 1224.5, y: 534.5 },
      { x: 1139.5, y: 405.5 },
      { x: 1190.5, y: 389.5 },
      { x: 1303.5, y: 244.5 },
      { x: 1221.5, y: 162.5 },
      { x: 937.5, y: 405.5 },
      { x: 863.5, y: 376.5 },
      { x: 913.5, y: 160.5 },
      { x: 412.5, y: 163.5 },
      { x: 393.5, y: 218.5 },
      { x: 845.5, y: 291.5 },
      { x: 430.5, y: 279.5 },
      { x: 885.5, y: 219.5 },
      { x: 1242.5, y: 459.5 },
      { x: 1142.5, y: 672.5 },
      { x: 641.5, y: 657.5 },
      { x: 491.5, y: 669.5 },
      { x: 153.5, y: 417.5 },
      { x: 21.5, y: 608.5 },
      { x: 330.5, y: 34.5 },
      { x: 282.5, y: 79.5 },
      { x: 449.5, y: 27.5 },
      { x: 667.5, y: 39.5 },
      { x: 597.5, y: 30.5 },
      { x: 873.5, y: 75.5 },
      { x: 1083.5, y: 16.5 },
      { x: 135.5, y: 20.5 },
      { x: 22.5, y: 9.5 },
      { x: 888.5, y: 478.5 },
      { x: 921.5, y: 42.5 },
      { x: 827.5, y: 5.5 },
      { x: 899.5, y: 630.5 },
      { x: 819.5, y: 669.5 },
      { x: 170.5, y: 227.5 },
      { x: 478.5, y: 552.5 },
      { x: 980.5, y: 621.5 },
      { x: 1321.5, y: 696.5 },
      { x: 1054.5, y: 561.5 },
      { x: 865.5, y: 502.5 },
      { x: 1255.5, y: 389.5 },
      { x: 1174.5, y: 161.5 },
      { x: 1212.5, y: 139.5 },
      { x: 1113.5, y: 72.5 },
      { x: 998.5, y: 72.5 },
      { x: 1193.5, y: 58.5 },
      { x: 1239.5, y: 97.5 },
      { x: 1285.5, y: 6.5 },
      { x: 766.5, y: 60.5 },
      { x: 686.5, y: 60.5 },
      { x: 531.5, y: 57.5 },
      { x: 441.5, y: 623.5 },
      { x: 368.5, y: 644.5 },
      { x: 170.5, y: 548.5 },
      { x: 153.5, y: 478.5 },
      { x: 1171.5, y: 593.5 }
    ];
    starsPosition.forEach((star, i) => {
      const el = document.createElement("span");
      el.style.top = `${star.y}px`;
      el.style.left = `${star.x}px`;
      el.style.animationDelay = `${Math.random() * 1.5}s`;
      el.style.animationDuration = `${1 + Math.random() * 0.3}s`;
      starsBody.appendChild(el);
    });
  }
  window.addEventListener("resize", () => {
    if (isMobile.any()) {
      const currentWidth = window.innerWidth;
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;
        setTimeout(() => {
          createAnimation();
          setupWolf();
          ScrollTrigger.refresh();
          smoother?.refresh();
        }, 50);
      }
    } else {
      setTimeout(() => {
        createAnimation();
        setupWolf();
        ScrollTrigger.refresh();
        smoother?.refresh();
      }, 50);
    }
  });
});
