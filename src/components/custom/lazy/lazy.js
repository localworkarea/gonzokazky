import "./lazy.scss"

	// Учитывает уже загруженные элементы, добавляет data-lazy-id чтобы учитывать уже кешированные элементы, 
	// 
	const lazyElements = document.querySelectorAll("[data-lazy]");
	let lazyIdCounter = 0;

	const observerMap = new Map();

	lazyElements.forEach(originalEl => {
	  assignLazyIdIfMissing(originalEl);

	  const el = originalEl.tagName === "SOURCE" ? originalEl.parentElement : originalEl;
	  const marginValue = originalEl.getAttribute("data-lazy") || "200";
	  const rootMargin = `${marginValue}px`;
	  const lazyId = originalEl.getAttribute("data-lazy-id");

	  if (shouldSkipLazyLoad(el, lazyId)) {
	    loadLazyElement(el, lazyId);
	    return;
	  }

	  if (!observerMap.has(rootMargin)) {
	    const observer = new IntersectionObserver((entries, obs) => {
	      entries.forEach(entry => {
	        if (entry.isIntersecting) {
	          const targetEl = entry.target;
	          const targetId = targetEl.getAttribute("data-lazy-id");
	          loadLazyElement(targetEl, targetId);
	          obs.unobserve(targetEl);
	        }
	      });
	    }, {
	      rootMargin,
	      threshold: 0,
	    });

	    observerMap.set(rootMargin, observer);
	  }

	  observerMap.get(rootMargin).observe(el);
	});

	// --- Helpers ---

	function assignLazyIdIfMissing(el) {
	  if (!el.hasAttribute("data-lazy-id")) {
	    el.setAttribute("data-lazy-id", `lazy-${lazyIdCounter++}`);
	  }
	}

	function maybeLoadImmediately(el) {
	  const lazyId = el.getAttribute("data-lazy-id");
	  if (shouldSkipLazyLoad(el, lazyId)) {
	    loadLazyElement(el, lazyId);
	  }
	}

	function shouldSkipLazyLoad(el, lazyId) {
	  if (lazyId && sessionStorage.getItem(`lazy-${lazyId}`)) {
	    return true;
	  }

	  if (el.tagName === "IMG" && el.complete && el.getAttribute("data-src")) {
	    return true;
	  }

	  return false;
	}

	function loadLazyElement(el, lazyId = null) {
	  if (!el) return;

	  if (lazyId) {
	    sessionStorage.setItem(`lazy-${lazyId}`, "1");
	  }

	  if (el.hasAttribute("data-src")) {
	    el.setAttribute("src", el.getAttribute("data-src"));
	    el.removeAttribute("data-src");
	    el.removeAttribute("data-lazy");
	    return;
	  }

	  const sources = el.querySelectorAll("source[data-src]");
	  if (sources.length > 0) {
	    sources.forEach(source => {
	      source.setAttribute("src", source.getAttribute("data-src"));
	      source.removeAttribute("data-src");
	      source.removeAttribute("data-lazy");
	    });

	    el.load?.();
	    el.play?.().catch(() => {});
	  }

	  if (el.hasAttribute("data-lazy")) {
	    el.removeAttribute("data-lazy");
	  }
	}
