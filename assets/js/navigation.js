/* ==========================================================================
   NAVIGATION.JS
   - Auto-detects the active page from the URL and applies .active to the
     matching nav link (public navbar, mobile offcanvas, admin sidebar).
   - Adds a scrolled state to the navbar.
   - Bootstrap's own Offcanvas JS handles open/close/escape/backdrop; we
     only need to close the offcanvas automatically when a nav link inside
     it is clicked, since Bootstrap doesn't do that by default.
   ========================================================================== */

(function () {
  "use strict";

  function normalizePath(path) {
    // Strip query string / hash, collapse trailing slash, default empty -> index.html
    let p = path.split("?")[0].split("#")[0];
    p = p.substring(p.lastIndexOf("/") + 1);
    if (p === "" || p === "/") p = "index.html";
    return p.toLowerCase();
  }

  function setActiveNav() {
    const currentPage = normalizePath(window.location.pathname);

    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const linkPage = normalizePath(link.getAttribute("href") || "");
      if (linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  function handleNavbarScroll() {
    const navbar = document.querySelector(".bf-navbar");
    if (!navbar) return;

    function update() {
      if (window.scrollY > 12) {
        navbar.classList.add("bf-scrolled");
      } else {
        navbar.classList.remove("bf-scrolled");
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function closeOffcanvasOnLinkClick() {
    const offcanvasEls = document.querySelectorAll(".offcanvas");
    offcanvasEls.forEach((el) => {
      el.querySelectorAll("[data-nav-link]").forEach((link) => {
        link.addEventListener("click", () => {
          if (window.bootstrap) {
            const instance = window.bootstrap.Offcanvas.getOrCreateInstance(el);
            instance.hide();
          }
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setActiveNav();
    handleNavbarScroll();
    closeOffcanvasOnLinkClick();
  });
})();
