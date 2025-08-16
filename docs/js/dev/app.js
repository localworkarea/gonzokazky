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
    const sectionTwoPricture = document.querySelector(".section-2__picture");
    if (sectionTwoPricture) {
      gsap.to(sectionTwoPricture, {
        opacity: 1,
        scrollTrigger: {
          trigger: ".section-2",
          start: "top bottom",
          end: "top 40%",
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
  createAnimation();
  window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth;
    if (currentWidth !== lastWidth) {
      lastWidth = currentWidth;
      setTimeout(() => {
        createAnimation();
      }, 50);
      ScrollTrigger.refresh();
      smoother?.refresh();
    }
  });
});
