/* ==========================================================================
   MAIN.JS
   Small page-wide glue that doesn't deserve its own file: footer year,
   and a graceful guard around the "Download CV" action for when no CV
   asset has been uploaded yet.
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // Footer year
    document.querySelectorAll("[data-current-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });

    // CV download guard — until cpanel CV upload exists, the asset path
    // below will 404. Rather than let the user hit a broken download,
    // check for it and fall back to a toast.
    document.querySelectorAll("[data-cv-download]").forEach((link) => {
      link.addEventListener("click", async function (e) {
        const href = link.getAttribute("href");
        try {
          const res = await fetch(href, { method: "HEAD" });
          if (!res.ok) throw new Error("missing");
        } catch (err) {
          e.preventDefault();
          if (window.showToast) {
            showToast("CV isn't available for download just yet — check back soon.", "info");
          }
        }
      });
    });
  });
})();
