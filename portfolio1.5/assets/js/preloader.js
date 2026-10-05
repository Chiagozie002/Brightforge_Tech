/* ==========================================================================
   PRELOADER.JS
   Drives the BrightForge preloader progress bar using real page-readiness
   signals rather than a fake fixed timer. Progress reflects:
     - document readyState changes
     - window "load" (all assets fetched)
   with a safety-net timeout so a slow/failed resource can never trap the
   user behind the preloader indefinitely.
   ========================================================================== */

(function () {
  "use strict";

  const preloader = document.getElementById("bf-preloader");
  if (!preloader) return;

  const bar = preloader.querySelector(".bf-preloader-bar");
  const status = preloader.querySelector(".bf-preloader-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let progress = 0;
  let finished = false;

  function setProgress(value, label) {
    progress = Math.max(progress, value);
    if (bar) bar.style.width = progress + "%";
    if (status && label) status.textContent = label;
  }

  function finish() {
    if (finished) return;
    finished = true;
    setProgress(100, "Loading complete");

    const reveal = () => {
      preloader.classList.add("bf-hidden");
      document.body.classList.remove("bf-no-scroll");
      // Let the main content's own entrance/reveal logic take over.
      window.dispatchEvent(new CustomEvent("bf:preloaded"));
    };

    if (reducedMotion) {
      reveal();
    } else {
      setTimeout(reveal, 280);
    }
  }

  document.body.classList.add("bf-no-scroll");
  setProgress(15, "Loading...");

  if (document.readyState === "interactive" || document.readyState === "complete") {
    setProgress(60, "Loading...");
  } else {
    document.addEventListener("readystatechange", function () {
      if (document.readyState === "interactive") {
        setProgress(60, "Loading...");
      }
    });
  }

  window.addEventListener("load", function () {
    setProgress(90, "Finishing up...");
    finish();
  });

  // Safety net: never trap the user behind the preloader for more than 4s,
  // even if an asset hangs.
  setTimeout(finish, 4000);
})();
