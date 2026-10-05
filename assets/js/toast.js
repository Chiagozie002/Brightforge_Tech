/* ==========================================================================
   TOAST.JS
   Global toast notification API. Usage:

     showToast("Message sent successfully.", "success");
     showToast("Please check your information.", "warning");
     showToast("Your session has expired.", "info");

   Unknown types safely fall back to "info". Never use browser alert().
   ========================================================================== */

(function () {
  "use strict";

  const DURATION = 4500;
  const ICONS = {
    success: "fa-circle-check",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info",
  };

  let region = null;

  function ensureRegion() {
    if (region) return region;
    region = document.getElementById("bf-toast-region");
    if (!region) {
      region = document.createElement("div");
      region.id = "bf-toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    return region;
  }

  function showToast(message, type) {
    const safeType = ICONS[type] ? type : "info";
    const el = document.createElement("div");
    el.className = "bf-toast bf-toast-" + safeType;
    el.setAttribute("role", "alert");

    el.innerHTML =
      '<span class="bf-toast-icon"><i class="fa-solid ' +
      ICONS[safeType] +
      '"></i></span>' +
      '<div class="bf-toast-body"><p class="bf-toast-message"></p></div>' +
      '<button type="button" class="bf-toast-close" aria-label="Dismiss notification">' +
      '<i class="fa-solid fa-xmark"></i></button>' +
      '<div class="bf-toast-progress"></div>';

    // Set message via textContent to avoid any HTML injection from dynamic text.
    el.querySelector(".bf-toast-message").textContent = String(message);

    const progressBar = el.querySelector(".bf-toast-progress");
    const region = ensureRegion();
    region.appendChild(el);

    requestAnimationFrame(() => el.classList.add("is-visible"));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) {
      progressBar.style.transition = "transform " + DURATION + "ms linear";
      requestAnimationFrame(() => {
        progressBar.style.transform = "scaleX(0)";
      });
    }

    let dismissTimer = setTimeout(dismiss, DURATION);

    function dismiss() {
      clearTimeout(dismissTimer);
      el.classList.remove("is-visible");
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 220);
    }

    el.querySelector(".bf-toast-close").addEventListener("click", dismiss);

    // Pause auto-dismiss while hovered/focused (better UX, still simple).
    el.addEventListener("mouseenter", () => clearTimeout(dismissTimer));
    el.addEventListener("mouseleave", () => {
      dismissTimer = setTimeout(dismiss, 1800);
    });
  }

  window.showToast = showToast;
})();
