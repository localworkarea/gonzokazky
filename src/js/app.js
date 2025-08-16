import { addTouchAttr, addLoadedAttr, isMobile, FLS } from "@js/common/functions.js"

// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ScrollSmoother } from "gsap/ScrollSmoother";

addLoadedAttr();

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  const smoother =
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
      smoothTouch: 0.1,
      ignoreMobileResize: true,
      normalizeScroll: true,
    });

  let mm; 
  let lastWidth = window.innerWidth;

  ScrollTrigger.refresh();


  const logoMain = document.querySelector(".logo-main__picture");

  function createAnimation() {
  //  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const shadowTop = document.querySelector(".shadow--top");
    if (shadowTop) {
      gsap.to(shadowTop, {
        opacity: 1,
        scrollTrigger: {
          trigger: ".hero",
          start: "10% top",
          end: "bottom top",
          scrub: 1,
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
          scrub: 1,
        }
      });
    }



    // Чистим предыдущие matchMedia-анимации корректно
    if (mm) mm.revert();
    mm = gsap.matchMedia();
    mm.add(
      {
        pc: "(min-width: 64.061em)", // 1024.98
        mob: "(max-width: 64.061em)",
        // mob: "(max-width: 51.311em)",
      },
      (context) => {
        const { pc, mob } = context.conditions;
        
        const logoMain = document.querySelector(".logo-main__picture");
        
        // == for PC ======================
        if (pc) {
          
          if (logoMain) {
            
            gsap.fromTo(logoMain,
              {
                top: "100px",
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
                  scroller: smoother.scrollContainer,
                  // markers: true
                }
              }
            );

          }

        }

        // == for MOBILE ======================
        if (mob) {
           gsap.to(logoMain, {
              width: "133px",
              scrollTrigger: {
                trigger: ".hero",
                start: "10% top",
                end: "bottom 70%",
                scrub: 1,
              }
            });
        }

        // Можно вернуть функцию очистки, если нужно что-то вручную снять
        return () => {
          // cleanup if needed
        };
      }
    );
  }

  createAnimation();

  window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth;
    if (currentWidth !== lastWidth) {
      lastWidth = currentWidth;

      // легкий debounce
      setTimeout(() => {
        createAnimation();           
      }, 50);
      ScrollTrigger.refresh();
      smoother?.refresh();
    }
  });
});
