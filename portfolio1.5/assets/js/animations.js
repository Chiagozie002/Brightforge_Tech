/* ==========================================================================
   ANIMATIONS.JS
   Scroll-reveal via IntersectionObserver (no scroll-listener cost).
   Elements opt in with [data-reveal], and may add [data-reveal-delay="n"]
   (n = steps of 80ms) for simple staggering within a row of cards.
   ========================================================================== */

(function () {
  "use strict";

  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delaySteps = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
          setTimeout(() => el.classList.add("is-visible"), delaySteps * 80);
          obs.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  // Auto-stagger direct children of [data-reveal-group] so markup doesn't
  // need a manual data-reveal-delay on every single card.
  function initStaggerGroups() {
    document.querySelectorAll("[data-reveal-group]").forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (!child.hasAttribute("data-reveal")) {
          child.setAttribute("data-reveal", "");
        }
        if (!child.hasAttribute("data-reveal-delay")) {
          child.setAttribute("data-reveal-delay", String(index));
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initStaggerGroups();
    initReveal();
  });

  // Exposed so scripts that inject new [data-reveal] content after
  // DOMContentLoaded (e.g. projects.js rendering cards from "fetched" data)
  // can re-run the observer setup for the newly added elements.
  window.BF = window.BF || {};
  window.BF.refreshReveal = function () {
    initStaggerGroups();
    initReveal();
  };
})();
