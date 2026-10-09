/* ==========================================================================
   THEME.JS
   Dark/light theme toggle + persistence.

   NOTE: The actual "no flash of wrong theme" fix happens via a tiny inline
   script placed directly in <head>, BEFORE this file loads (see the inline
   <script> at the top of every page's <head>). That inline script reads
   localStorage and sets data-theme on <html> immediately, before first
   paint. This file only wires up the toggle button + keeps it in sync.
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "bf-theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable (private mode etc) — theme just won't persist */
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", theme === "light");
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    });

    // Swap the wordmark logo between its dark/light variants. Because an
    // <img>-loaded SVG doesn't inherit CSS from the host page (no
    // currentColor passthrough), the logo ships as two pre-colored files
    // instead — this just points every logo <img> at the right one,
    // preserving each page's own relative path prefix.
    document.querySelectorAll(".bf-logo-img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (theme === "light") {
        img.setAttribute("src", src.replace("logo-full-dark.png", "logo-full-light.png"));
      } else {
        img.setAttribute("src", src.replace("logo-full-light.png", "logo-full-dark.png"));
      }
    });
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    setStoredTheme(next);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Sync toggle button state with whatever the inline head-script already set.
    applyTheme(currentTheme());

    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", toggleTheme);
    });
  });

  // Expose minimally in case other scripts need to read the active theme.
  window.BF = window.BF || {};
  window.BF.getTheme = currentTheme;
})();
