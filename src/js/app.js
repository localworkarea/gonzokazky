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

    const sections = Array.from(document.querySelectorAll('section')).filter((sec) => {
      const root = sec.querySelector('.body-sections');
      if (!root) return false;
      const banner = root.querySelector('.body-sections__banner');
      const txt    = root.querySelector('.cta-sections__txt');
      const btnWr  = root.querySelector('.cta-sections__btn-wr');
      return banner && txt && btnWr;
    });

    sections.forEach((sec) => {
      const root  = sec.querySelector('.body-sections');
      const banner = root.querySelector('.body-sections__banner');
      const txt    = root.querySelector('.cta-sections__txt');
      const btnWr  = root.querySelector('.cta-sections__btn-wr');


      // Таймлайн для секции: последовательное появление
      const tl = gsap.timeline({
        defaults: {
          duration: 0.1, 
          ease: 'none'
        },
        scrollTrigger: {
          trigger: sec,
          start: 'top 60%',
          end: 'top top',
          scrub: 1, 
        }
      });

      tl.to(banner, {opacity: 1,})
        .to(txt,    {opacity: 1,})
        .to(btnWr,  {opacity: 1,});
    });

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

  // === WOLF SETUP & SCROLL ===
  function setupWolf() {
    const wolf = document.querySelector(".wolf");
    const wolfItems = document.querySelectorAll(".wolf__item");
    const sec2 = document.querySelector(".section-2");
    const sections = Array.from(document.querySelectorAll("section"));

    if (!wolf || !sec2 || sections.length < 3 || wolfItems.length === 0) return;

    // индекс второй секции и предпоследней
    const sec2Index = sections.indexOf(sec2);
    const lastIndex = sections.length - 1;
    const untilIndex = Math.max(sec2Index, lastIndex - 1);

    // суммарная высота [section-2 ... предпоследняя]
    const sumHeight = sections
      .slice(sec2Index, untilIndex + 1)
      .reduce((acc, el) => acc + el.getBoundingClientRect().height, 0);

    // верхняя позиция волка = верх section-2
    const sec2Top = sec2.offsetTop;

    // применяем позицию/высоту трека для волка
    gsap.set(wolf, {
      top: sec2Top,
      height: sumHeight,
    });

    // максимально возможный сдвиг, чтобы элементы оставались «в кадре»
    const maxY = () => Math.max(0, wolf.offsetHeight - window.innerHeight);

    // если двигать нечего — выходим
    if (maxY() === 0) {
      gsap.set(wolfItems, { y: 0 });
      ScrollTrigger.getAll()
        .filter(t => t.vars?.id === "wolfItemsScroll")
        .forEach(t => t.kill());
      return;
    }

    // убираем прошлые триггеры
    ScrollTrigger.getAll()
      .filter(t => t.vars?.id === "wolfItemsScroll")
      .forEach(t => t.kill());

    // стартовые значения
    gsap.set(wolfItems, { y: 0 });

    // === единая анимация для всех .wolf__item со «стояночной» позицией и лагом ===

    {
      const REST_VH    = 0.1;  // базовая точка покоя (чуть ниже центра)
      const END_VH     = 0.3;  // финальная точка покоя у конца трека (ниже)
      const END_ZONE   = 0.2;  // доля трека перед концом, где начинаем «опускать» (25%)
      const SMOOTH     = 0.06;  // сглаживание лерпом (0.06…0.18)
      const MAX_LAG    = 30;    // макс. подпрыг, px
      const LAG_FACTOR = 0.08;  // чувствительность к скорости
      const endEase    = gsap.parseEase("power2.out"); // плавный спуск к END_VH
    
      const maxY = () => Math.max(0, wolf.offsetHeight - window.innerHeight);
    
      // вычисляем текущую «точку покоя» по прогрессу триггера
      const restOffsetAt = (progress) => {
        const t = gsap.utils.clamp(0, 1, (progress - (1 - END_ZONE)) / END_ZONE);
        const vh = gsap.utils.interpolate(REST_VH, END_VH, endEase(t));
        return window.innerHeight * vh;
      };
    
      // чистим прежний триггер/тикер
      ScrollTrigger.getAll()
        .filter(t => t.vars?.id === "wolfItemsScroll")
        .forEach(t => t.kill());
      if (wolf._wolfTick) {
        gsap.ticker.remove(wolf._wolfTick);
        wolf._wolfTick = null;
      }
    
      gsap.set(wolfItems, { y: 0 });
      const setY = gsap.quickSetter(wolfItems, "y", "px");
      const clampLag = gsap.utils.clamp(-MAX_LAG, MAX_LAG);
    
      let currentBase = 0;
      let targetLag   = 0;
      let currentY    = 0;
      let targetY     = 0;
    
      // единый тикер с лерпом
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
        end: () => `+=${maxY()}`,
        scrub: 1,
        scroller: smoother.scrollContainer,
        invalidateOnRefresh: true,
        // markers: true,
        onRefresh(self) {
          currentBase = 0;
          targetLag   = 0;
          currentY    = restOffsetAt(0);  // стартовая «точка покоя» в начале трека
          targetY     = currentY;
          setY(currentY);
        },
        onUpdate(self) {
          const progress = self.progress;              // 0..1 по треку волка
          currentBase = progress * maxY();             // базовый спуск
          const rest   = restOffsetAt(progress);       // «точка покоя» с учётом финишного опускания
        
          const v = self.getVelocity();
          targetLag = clampLag(-v * LAG_FACTOR);       // подпрыг при скролле
        
          targetY = currentBase + rest + targetLag;    // цель; тикер сгладит до неё
        },
        onKill() {
          if (wolf._wolfTick) {
            gsap.ticker.remove(wolf._wolfTick);
            wolf._wolfTick = null;
          }
        }
      });
      // плавное исчезновение волка в конце (последние 100px трека)
      ScrollTrigger.create({
        id: "wolfItemsFade",
        trigger: wolf,
        start: () => `bottom-=${200} bottom`, // когда до конца wolf остаётся 100px
        end: "bottom bottom",                 // конец трека
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
