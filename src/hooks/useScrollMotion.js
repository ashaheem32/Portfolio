import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const revealSelector = [
  ".fade-in-section",
  ".heading-reveal",
  ".hero-identity",
  ".hero-name",
  ".hero-introduction > .text-link",
  ".hero-meta",
  ".hero-art",
  ".section-topline",
  ".archive-heading .section-kicker",
  ".archive-count",
  ".archive-project",
  ".archive-actions",
  ".expertise-item",
  ".tool-ribbon > span",
  ".footer-links",
  ".footer-meta",
  ".footer-wordmark",
].join(",");

const easeOut = (progress) => 1 - Math.pow(1 - progress, 4);

export default function useScrollMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 700px)");
    const elements = Array.from(root.querySelectorAll(revealSelector));
    const images = Array.from(root.querySelectorAll(".project-image-wrap img"));
    const seen = new WeakSet();
    let lenis;
    let observer;
    let frame = 0;

    elements.forEach((element) => {
      element.classList.add("scroll-reveal");
      const siblings = element.parentElement;
      if (siblings.matches(".project-archive, .expertise-list, .tool-ribbon")) {
        const index = Array.from(siblings.children).indexOf(element);
        element.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
      }
    });

    const reveal = (element, immediate = false) => {
      seen.add(element);
      element.classList.toggle("is-immediate", immediate);
      element.classList.remove("is-pending");
      element.classList.add("is-visible");
      if (observer) observer.unobserve(element);
    };

    const updateImages = () => {
      frame = 0;
      if (preference.matches) return;
      const viewportHeight = window.innerHeight;
      // Read layout together, then write styles, once per scroll frame.
      const positions = images.map((image) => ({
        image,
        rect: image.parentElement.getBoundingClientRect(),
      }));
      positions.forEach(({ image, rect }) => {
        if (!rect.height || rect.bottom < 0 || rect.top > viewportHeight)
          return;
        const progress = Math.max(
          0,
          Math.min(
            1,
            (viewportHeight - rect.top) / (viewportHeight + rect.height)
          )
        );
        const distance = compact.matches ? 8 : 20;
        image.style.setProperty(
          "--scroll-drift",
          `${(0.5 - progress) * distance}px`
        );
      });
    };

    const requestImageUpdate = () => {
      if (!frame && !preference.matches) {
        frame = window.requestAnimationFrame(updateImages);
      }
    };

    const focusTarget = (target) => {
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
        target.addEventListener(
          "blur",
          () => target.removeAttribute("tabindex"),
          {
            once: true,
          }
        );
      }
      target.focus({ preventScroll: true });
    };

    const onAnchorClick = (event) => {
      if (
        !lenis ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = event.target.closest("a[href^='#']");
      if (!anchor || !root.contains(anchor) || anchor.hasAttribute("download"))
        return;
      const hash = anchor.getAttribute("href");
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      if (window.location.hash !== hash)
        window.history.pushState(null, "", hash);
      lenis.scrollTo(target, {
        duration: 1.8,
        easing: easeOut,
        immediate: anchor.classList.contains("skip-link"),
        onComplete: () => focusTarget(target),
      });
    };

    const onFocus = (event) => {
      let element = event.target.closest(".scroll-reveal");
      while (element && root.contains(element)) {
        if (element.classList.contains("is-pending")) reveal(element, true);
        element = element.parentElement.closest(".scroll-reveal");
      }
    };

    const cancelInertia = (event) => {
      if (
        event.type === "keydown" &&
        ![
          "Tab",
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
          "Escape",
        ].includes(event.key)
      )
        return;
      if (lenis) lenis.scrollTo(window.scrollY, { immediate: true });
    };

    const configure = () => {
      if (observer) observer.disconnect();
      if (lenis) lenis.destroy();
      lenis = undefined;
      window.cancelAnimationFrame(frame);
      frame = 0;

      if (preference.matches) {
        root.dataset.motion = "reduced";
        elements.forEach((element) => reveal(element, true));
        images.forEach((image) => image.style.removeProperty("--scroll-drift"));
        return;
      }

      root.dataset.motion = "enabled";
      lenis = new Lenis({
        autoRaf: true,
        duration: 1.65,
        easing: easeOut,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        syncTouch: false,
      });

      if (window.IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) reveal(entry.target);
            });
          },
          { threshold: 0, rootMargin: "0px 0px 6% 0px" }
        );

        elements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (seen.has(element) || (rect.height > 0 && rect.bottom <= 0)) {
            reveal(element, true);
          } else {
            element.classList.remove("is-visible", "is-immediate");
            element.classList.add("is-pending");
            observer.observe(element);
          }
        });
      }
      requestImageUpdate();
    };

    configure();
    preference.addEventListener("change", configure);
    root.addEventListener("click", onAnchorClick);
    root.addEventListener("focusin", onFocus);
    window.addEventListener("scroll", requestImageUpdate, { passive: true });
    window.addEventListener("resize", requestImageUpdate, { passive: true });
    window.addEventListener("keydown", cancelInertia);
    window.addEventListener("touchstart", cancelInertia, { passive: true });
    window.addEventListener("popstate", cancelInertia);

    return () => {
      if (observer) observer.disconnect();
      if (lenis) lenis.destroy();
      window.cancelAnimationFrame(frame);
      preference.removeEventListener("change", configure);
      root.removeEventListener("click", onAnchorClick);
      root.removeEventListener("focusin", onFocus);
      window.removeEventListener("scroll", requestImageUpdate);
      window.removeEventListener("resize", requestImageUpdate);
      window.removeEventListener("keydown", cancelInertia);
      window.removeEventListener("touchstart", cancelInertia);
      window.removeEventListener("popstate", cancelInertia);
      elements.forEach((element) =>
        element.classList.remove(
          "scroll-reveal",
          "is-pending",
          "is-visible",
          "is-immediate"
        )
      );
      images.forEach((image) => image.style.removeProperty("--scroll-drift"));
      delete root.dataset.motion;
    };
  }, [rootRef]);
}
