/* ==========================================================================
   ADMIN.JS
   All cpanel-specific interactivity. Organized into small, independent
   init functions that each check for their own DOM hooks before running,
   so a single file can safely be included on every cpanel page without
   needing per-page script bundles.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Shared button loading-state helper (mirrors contact.js's pattern)
     ------------------------------------------------------------------ */
  function setBtnLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.classList.toggle("is-loading", loading);
  }

  /* ------------------------------------------------------------------
     Password show/hide toggles — any .auth-toggle-visibility button
     paired with the nearest input in its .auth-input-wrap
     ------------------------------------------------------------------ */
  function initPasswordVisibility() {
    document.querySelectorAll(".auth-toggle-visibility").forEach((btn) => {
      btn.addEventListener("click", () => {
        const wrap = btn.closest(".auth-input-wrap");
        const input = wrap ? wrap.querySelector("input") : null;
        if (!input) return;
        const showing = input.type === "text";
        input.type = showing ? "password" : "text";
        btn.querySelector("i").className = showing ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
        btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
      });
    });
  }

  /* ------------------------------------------------------------------
     Auth background particles — sparse, small, slow "twinkling star"
     effect. Generated in JS so the count/position stay easy to tune.
     ------------------------------------------------------------------ */
  function initAuthParticles() {
    const field = document.querySelector(".auth-particles");
    if (!field) return;
    const count = 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "auth-particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.animationDelay = (Math.random() * 4).toFixed(2) + "s";
      p.style.animationDuration = (3.5 + Math.random() * 3).toFixed(2) + "s";
      field.appendChild(p);
    }
  }

  /* ------------------------------------------------------------------
     LOGIN — cpanel/login.html
     ------------------------------------------------------------------ */
  function initLoginForm() {
    const form = document.getElementById("cp-login-form");
    if (!form) return;

    const btn = form.querySelector('[type="submit"]');
    let submitting = false;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (submitting) return;

      const email = form.querySelector("#login-email");
      const password = form.querySelector("#login-password");
      let valid = true;

      if (!BFValidate.isValidEmail(email.value)) {
        BFValidate.setFieldError(email, "Please enter a valid email address.");
        valid = false;
      } else {
        BFValidate.clearFieldError(email);
      }

      if (BFValidate.isEmpty(password.value)) {
        BFValidate.setFieldError(password, "Please enter your password.");
        valid = false;
      } else {
        BFValidate.clearFieldError(password);
      }

      if (!valid) return;

      submitting = true;
      setBtnLoading(btn, true);

      try {
        const res = await fetch("../ajax/admin_login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.value.trim(),
            password: password.value,
            remember: form.querySelector("#login-remember")?.checked || false,
          }),
        });
        if (!res.ok) throw new Error("http-" + res.status);
        const data = await res.json().catch(() => {
          throw new Error("invalid-json");
        });

        if (data && data.success) {
          showToast(data.message || "Logged in successfully.", "success");
          setTimeout(() => (window.location.href = "index.html"), 600);
        } else {
          showToast((data && data.message) || "Invalid email or password.", "warning");
        }
      } catch (err) {
        showToast("Something went wrong. Please try again.", "warning");
      } finally {
        submitting = false;
        setBtnLoading(btn, false);
      }
    });
  }

  /* ------------------------------------------------------------------
     FORGOT PASSWORD — cpanel/forgot-password.html
     ------------------------------------------------------------------ */
  function initForgotPasswordForm() {
    const form = document.getElementById("cp-forgot-form");
    if (!form) return;

    const btn = form.querySelector('[type="submit"]');
    let submitting = false;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (submitting) return;

      const email = form.querySelector("#forgot-email");
      if (!BFValidate.isValidEmail(email.value)) {
        BFValidate.setFieldError(email, "Please enter a valid email address.");
        return;
      }
      BFValidate.clearFieldError(email);

      submitting = true;
      setBtnLoading(btn, true);

      try {
        const res = await fetch("../ajax/forgot_password.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.value.trim() }),
        });
        if (!res.ok) throw new Error("http-" + res.status);
        const data = await res.json().catch(() => {
          throw new Error("invalid-json");
        });

        if (data && data.success) {
          showToast(data.message || "Reset instructions sent.", "success");
          setTimeout(() => (window.location.href = "verify-otp.html"), 700);
        } else {
          showToast((data && data.message) || "We couldn't find that account.", "warning");
        }
      } catch (err) {
        showToast("Something went wrong. Please try again.", "warning");
      } finally {
        submitting = false;
        setBtnLoading(btn, false);
      }
    });
  }

  /* ------------------------------------------------------------------
     OTP VERIFICATION — cpanel/verify-otp.html
     ------------------------------------------------------------------ */
  function initOtpForm() {
    const boxesWrap = document.querySelector(".otp-boxes");
    const form = document.getElementById("cp-otp-form");
    if (!boxesWrap || !form) return;

    const boxes = Array.from(boxesWrap.querySelectorAll(".otp-box"));
    const btn = form.querySelector('[type="submit"]');
    const resendBtn = document.getElementById("cp-otp-resend-btn");
    const countdownEl = document.getElementById("cp-otp-countdown");

    // ---- box navigation ----
    boxes.forEach((box, index) => {
      box.addEventListener("input", () => {
        box.value = box.value.replace(/[^0-9]/g, "").slice(0, 1);
        if (box.value && index < boxes.length - 1) {
          boxes[index + 1].focus();
        }
      });

      box.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !box.value && index > 0) {
          boxes[index - 1].focus();
        }
      });

      box.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData("text").replace(/[^0-9]/g, "");
        if (!pasted) return;
        pasted
          .slice(0, boxes.length)
          .split("")
          .forEach((char, i) => {
            if (boxes[i]) boxes[i].value = char;
          });
        const next = boxes[Math.min(pasted.length, boxes.length - 1)];
        if (next) next.focus();
      });
    });

    if (boxes[0]) boxes[0].focus();

    // ---- resend countdown ----
    let seconds = 60;
    let timer = null;

    function tickCountdown() {
      seconds--;
      if (countdownEl) countdownEl.textContent = seconds + "s";
      if (seconds <= 0) {
        clearInterval(timer);
        if (resendBtn) {
          resendBtn.disabled = false;
          resendBtn.textContent = "Resend code";
        }
      }
    }

    function startCountdown() {
      seconds = 60;
      if (resendBtn) {
        resendBtn.disabled = true;
        resendBtn.textContent = "Resend code";
      }
      if (countdownEl) countdownEl.textContent = seconds + "s";
      clearInterval(timer);
      timer = setInterval(tickCountdown, 1000);
    }

    startCountdown();

    if (resendBtn) {
      resendBtn.addEventListener("click", async () => {
        if (resendBtn.disabled) return;
        resendBtn.disabled = true;
        try {
          const res = await fetch("../ajax/resend_otp.php", { method: "POST" });
          if (!res.ok) throw new Error("http-" + res.status);
          const data = await res.json().catch(() => ({ success: true }));
          showToast((data && data.message) || "A new code has been sent.", "info");
        } catch (err) {
          showToast("Couldn't resend the code. Try again shortly.", "warning");
        } finally {
          startCountdown();
        }
      });
    }

    // ---- submit ----
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const code = boxes.map((b) => b.value).join("");

      if (code.length !== boxes.length) {
        showToast("Please enter the full 6-digit code.", "warning");
        return;
      }

      setBtnLoading(btn, true);
      try {
        const res = await fetch("../ajax/verify_otp.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        if (!res.ok) throw new Error("http-" + res.status);
        const data = await res.json().catch(() => {
          throw new Error("invalid-json");
        });

        if (data && data.success) {
          showToast(data.message || "Code verified.", "success");
          setTimeout(() => (window.location.href = "reset-password.html"), 600);
        } else {
          showToast((data && data.message) || "That code didn't match. Try again.", "warning");
        }
      } catch (err) {
        showToast("Something went wrong. Please try again.", "warning");
      } finally {
        setBtnLoading(btn, false);
      }
    });
  }

  /* ------------------------------------------------------------------
     PASSWORD STRENGTH — shared by reset-password.html and profile.html
     ------------------------------------------------------------------ */
  function evaluateStrength(value) {
    const checks = {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  }

  function initPasswordStrength(inputId, wrapSelector) {
    const input = document.getElementById(inputId);
    const wrap = document.querySelector(wrapSelector);
    if (!input || !wrap) return;

    const segs = wrap.querySelectorAll(".pw-strength-seg");
    const label = wrap.querySelector(".pw-strength-label");
    const reqItems = wrap.querySelectorAll(".pw-requirements li");
    const colors = ["var(--bf-danger)", "var(--bf-warning)", "var(--bf-blue-bright)", "var(--bf-success)"];
    const labels = ["Weak", "Fair", "Good", "Strong"];

    input.addEventListener("input", () => {
      const { checks, score } = evaluateStrength(input.value);

      segs.forEach((seg, i) => {
        seg.style.backgroundColor = i < score ? colors[Math.max(score - 1, 0)] : "transparent";
      });

      if (label) {
        label.textContent = input.value ? labels[Math.max(score - 1, 0)] || "Weak" : "";
      }

      reqItems.forEach((li) => {
        const key = li.getAttribute("data-req");
        const met = checks[key];
        li.classList.toggle("met", !!met);
        const icon = li.querySelector("i");
        if (icon) icon.className = met ? "fa-solid fa-circle-check" : "fa-regular fa-circle";
      });
    });
  }

  /* ------------------------------------------------------------------
     RESET PASSWORD — cpanel/reset-password.html
     ------------------------------------------------------------------ */
  function initResetPasswordForm() {
    const form = document.getElementById("cp-reset-form");
    if (!form) return;

    initPasswordStrength("reset-password", ".pw-strength");

    const btn = form.querySelector('[type="submit"]');
    let submitting = false;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (submitting) return;

      const pw = form.querySelector("#reset-password");
      const confirm = form.querySelector("#reset-confirm");
      let valid = true;

      const { score } = evaluateStrength(pw.value);
      if (score < 3) {
        BFValidate.setFieldError(pw, "Password doesn't meet the requirements below.");
        valid = false;
      } else {
        BFValidate.clearFieldError(pw);
      }

      if (confirm.value !== pw.value || !confirm.value) {
        BFValidate.setFieldError(confirm, "Passwords don't match.");
        valid = false;
      } else {
        BFValidate.clearFieldError(confirm);
      }

      if (!valid) return;

      submitting = true;
      setBtnLoading(btn, true);

      try {
        const res = await fetch("../ajax/reset_password.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pw.value }),
        });
        if (!res.ok) throw new Error("http-" + res.status);
        const data = await res.json().catch(() => {
          throw new Error("invalid-json");
        });

        if (data && data.success) {
          showToast(data.message || "Password reset successfully.", "success");
          setTimeout(() => (window.location.href = "login.html"), 700);
        } else {
          showToast((data && data.message) || "Unable to reset password.", "warning");
        }
      } catch (err) {
        showToast("Something went wrong. Please try again.", "warning");
      } finally {
        submitting = false;
        setBtnLoading(btn, false);
      }
    });
  }

  /* ------------------------------------------------------------------
     SIDEBAR + TOPBAR: profile dropdown, logout
     ------------------------------------------------------------------ */
  function initProfileDropdown() {
    const btn = document.getElementById("cp-profile-btn");
    const dropdown = document.getElementById("cp-profile-dropdown");
    if (!btn || !dropdown) return;

    function close() {
      dropdown.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
    function open() {
      dropdown.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.contains("is-open") ? close() : open();
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && e.target !== btn) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function initLogout() {
    document.querySelectorAll("[data-logout]").forEach((link) => {
      link.addEventListener("click", async function (e) {
        e.preventDefault();
        setBtnLoading(link, true);
        try {
          await fetch("../ajax/logout.php", { method: "POST" });
        } catch (err) {
          /* logout endpoint is a stub — proceed to login regardless */
        } finally {
          showToast("You've been logged out.", "info");
          setTimeout(() => (window.location.href = "login.html"), 400);
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     DASHBOARD — cpanel/index.html demo data
     ------------------------------------------------------------------ */
  function initDashboard() {
    const recentProjects = document.getElementById("cp-recent-projects");
    const recentMessages = document.getElementById("cp-recent-messages");
    if (!recentProjects && !recentMessages) return;

    // DEMO / STATIC DATA — replace with a real fetch() once the backend exists.
    const projects = [
      { name: "Flood Early-Warning Dashboard", status: "published", date: "2 days ago" },
      { name: "Restaurant Ordering UI", status: "published", date: "1 week ago" },
      { name: "SDG Impact Tracker", status: "draft", date: "2 weeks ago" },
    ];
    const messages = [
      { name: "Amaka O.", subject: "Freelance inquiry — landing page", date: "3 hours ago" },
      { name: "David K.", subject: "Quick question about your availability", date: "1 day ago" },
      { name: "Priya S.", subject: "Loved your dashboard project!", date: "4 days ago" },
    ];

    setTimeout(() => {
      if (recentProjects) {
        recentProjects.innerHTML = projects
          .map(
            (p) =>
              '<div class="d-flex align-items-center justify-content-between py-2 border-bottom" style="border-color:var(--bf-border) !important;">' +
              '<div><div style="font-size:14px;font-weight:600;">' +
              p.name +
              '</div><div style="font-size:12.5px;color:var(--bf-text-muted);">' +
              p.date +
              "</div></div>" +
              '<span class="cp-badge cp-badge-' +
              p.status +
              '">' +
              (p.status === "published" ? "Published" : "Draft") +
              "</span></div>"
          )
          .join("");
      }
      if (recentMessages) {
        recentMessages.innerHTML = messages
          .map(
            (m) =>
              '<div class="py-2 border-bottom" style="border-color:var(--bf-border) !important;">' +
              '<div style="font-size:14px;font-weight:600;">' +
              m.name +
              '</div><div style="font-size:13px;color:var(--bf-text-secondary);">' +
              m.subject +
              '</div><div style="font-size:12px;color:var(--bf-text-muted);">' +
              m.date +
              "</div></div>"
          )
          .join("");
      }
    }, 450);
  }

  /* ------------------------------------------------------------------
     PROJECTS TABLE — cpanel/projects.html
     ------------------------------------------------------------------ */
  function initProjectsTable() {
    const tbody = document.getElementById("cp-projects-tbody");
    if (!tbody) return;

    // DEMO / STATIC DATA — replace with fetch('ajax/get_projects.php') later.
    const DATA = [
      { id: 1, name: "Flood Early-Warning Dashboard", category: "Web App", status: "published", image: "../assets/images/projects/project-01.svg" },
      { id: 2, name: "Campus Event Finder", category: "Web App", status: "published", image: "../assets/images/projects/project-02.svg" },
      { id: 3, name: "Restaurant Ordering UI", category: "UI/UX", status: "published", image: "../assets/images/projects/project-03.svg" },
      { id: 4, name: "SDG Impact Tracker", category: "Dashboard", status: "draft", image: "../assets/images/projects/project-04.svg" },
      { id: 5, name: "Personal Finance Tracker", category: "Web App", status: "draft", image: "../assets/images/projects/project-05.svg" },
    ];

    const emptyState = document.getElementById("cp-projects-empty");
    const searchInput = document.getElementById("cp-projects-search");
    let deleteTargetId = null;

    function rowTemplate(p) {
      return (
        '<tr data-id="' +
        p.id +
        '"><td><img class="cp-table-thumb" src="' +
        p.image +
        '" alt=""></td>' +
        "<td>" +
        p.name +
        "</td><td>" +
        p.category +
        '</td><td><span class="cp-badge cp-badge-' +
        p.status +
        '">' +
        (p.status === "published" ? "Published" : "Draft") +
        '</span></td><td><div class="cp-row-actions">' +
        '<button type="button" class="cp-icon-btn" title="Edit"><i class="fa-solid fa-pen"></i></button>' +
        '<button type="button" class="cp-icon-btn cp-icon-danger" data-delete-project="' +
        p.id +
        '" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
        "</div></td></tr>"
      );
    }

    function render(list) {
      if (!list.length) {
        tbody.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        return;
      }
      if (emptyState) emptyState.style.display = "none";
      tbody.innerHTML = list.map(rowTemplate).join("");
      wireDeleteButtons();
    }

    function wireDeleteButtons() {
      tbody.querySelectorAll("[data-delete-project]").forEach((btn) => {
        btn.addEventListener("click", () => {
          deleteTargetId = btn.getAttribute("data-delete-project");
          const modalEl = document.getElementById("cp-delete-modal");
          if (modalEl && window.bootstrap) {
            window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
          }
        });
      });
    }

    // Skeleton rows while "loading"
    tbody.innerHTML = Array.from({ length: 4 })
      .map(
        () =>
          '<tr><td colspan="5"><div class="bf-skeleton" style="height:44px;border-radius:8px;"></div></td></tr>'
      )
      .join("");

    setTimeout(() => render(DATA), 500);

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        const filtered = DATA.filter((p) => p.name.toLowerCase().includes(q));
        render(filtered);
      });
    }

    const confirmBtn = document.getElementById("cp-delete-confirm-btn");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", async () => {
        setBtnLoading(confirmBtn, true);
        try {
          const res = await fetch("../ajax/delete_project.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: deleteTargetId }),
          });
          const data = await res.json().catch(() => ({ success: true }));
          showToast((data && data.message) || "Project deleted.", "success");
        } catch (err) {
          showToast("Couldn't delete the project. Try again.", "warning");
        } finally {
          setBtnLoading(confirmBtn, false);
          const modalEl = document.getElementById("cp-delete-modal");
          if (modalEl && window.bootstrap) {
            window.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
          }
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     ADD PROJECT — cpanel/add-project.html
     ------------------------------------------------------------------ */
  function initAddProjectForm() {
    const form = document.getElementById("cp-add-project-form");
    if (!form) return;

    const imageInput = form.querySelector("#project-image");
    const imagePreview = form.querySelector("#cp-image-preview");
    const dropZone = form.querySelector(".cp-image-drop");
    const descInput = form.querySelector("#project-description");
    const charCount = form.querySelector("#cp-desc-char-count");
    const MAX_DESC = 220;
    const MAX_IMAGE_MB = 4;

    if (dropZone && imageInput) {
      dropZone.addEventListener("click", () => imageInput.click());
      imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) return;

        if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
          showToast("Please choose a PNG, JPG, or WEBP image.", "warning");
          imageInput.value = "";
          return;
        }
        if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
          showToast("Image must be smaller than " + MAX_IMAGE_MB + "MB.", "warning");
          imageInput.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      });
    }

    if (descInput && charCount) {
      descInput.setAttribute("maxlength", String(MAX_DESC));
      const update = () => (charCount.textContent = descInput.value.length + " / " + MAX_DESC);
      descInput.addEventListener("input", update);
      update();
    }

    const btn = form.querySelector('[type="submit"]');
    let submitting = false;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (submitting) return;

      const name = form.querySelector("#project-name");
      const demoUrl = form.querySelector("#project-demo-url");
      const githubUrl = form.querySelector("#project-github-url");
      let valid = true;

      if (BFValidate.isEmpty(name.value) || !BFValidate.withinLength(name.value, 2, 80)) {
        BFValidate.setFieldError(name, "Please enter a project name.");
        valid = false;
      } else {
        BFValidate.clearFieldError(name);
      }

      if (BFValidate.isEmpty(descInput.value) || !BFValidate.withinLength(descInput.value, 10, MAX_DESC)) {
        BFValidate.setFieldError(descInput, "Please add a short description.");
        valid = false;
      } else {
        BFValidate.clearFieldError(descInput);
      }

      const urlRe = /^https?:\/\/.+/i;
      if (demoUrl.value && !urlRe.test(demoUrl.value)) {
        BFValidate.setFieldError(demoUrl, "Enter a full URL starting with https://");
        valid = false;
      } else {
        BFValidate.clearFieldError(demoUrl);
      }
      if (githubUrl.value && !urlRe.test(githubUrl.value)) {
        BFValidate.setFieldError(githubUrl, "Enter a full URL starting with https://");
        valid = false;
      } else {
        BFValidate.clearFieldError(githubUrl);
      }

      if (!valid) return;

      submitting = true;
      setBtnLoading(btn, true);

      try {
        const res = await fetch("../ajax/add_project.php", {
          method: "POST",
          body: new FormData(form),
        });
        if (!res.ok) throw new Error("http-" + res.status);
        const data = await res.json().catch(() => {
          throw new Error("invalid-json");
        });

        if (data && data.success) {
          showToast(data.message || "Project added successfully.", "success");
          setTimeout(() => (window.location.href = "projects.html"), 700);
        } else {
          showToast((data && data.message) || "Unable to add project.", "warning");
        }
      } catch (err) {
        showToast("Something went wrong. Please try again.", "warning");
      } finally {
        submitting = false;
        setBtnLoading(btn, false);
      }
    });
  }

  /* ------------------------------------------------------------------
     PROFILE PHOTO — cpanel/profile.html
     Click the drop zone to pick an image; show a live preview immediately
     (before the form is even submitted) using FileReader.
     ------------------------------------------------------------------ */
  function initProfilePhotoUpload() {
    const form = document.getElementById("cp-profile-photo-form");
    const dropZone = document.getElementById("cp-profile-photo-drop");
    const input = document.getElementById("cp-profile-photo-input");
    const preview = document.getElementById("cp-profile-photo-preview");
    if (!form || !dropZone || !input || !preview) return;

    const MAX_MB = 4;

    dropZone.addEventListener("click", () => input.click());

    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;

      if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
        showToast("Please choose a PNG, JPG, or WEBP image.", "warning");
        input.value = "";
        return;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        showToast("Image must be smaller than " + MAX_MB + "MB.", "warning");
        input.value = "";
        return;
      }

      // Instant client-side preview, before the form is even submitted.
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    const btn = form.querySelector('[type="submit"]');
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!input.files[0]) {
        showToast("Choose a photo first.", "warning");
        return;
      }

      setBtnLoading(btn, true);
      try {
        const res = await fetch("../ajax/update_profile.php", {
          method: "POST",
          body: new FormData(form),
        });
        const data = await res.json().catch(() => ({ success: true, message: "Photo updated successfully." }));
        showToast((data && data.message) || "Photo updated successfully.", "success");
      } catch (err) {
        showToast("Unable to upload photo right now.", "warning");
      } finally {
        setBtnLoading(btn, false);
      }
    });
  }

  /* ------------------------------------------------------------------
     PROFILE — cpanel/profile.html (profile form, password change, CV upload)
     ------------------------------------------------------------------ */
  function initProfileForm() {
    const form = document.getElementById("cp-profile-form");
    if (form) {
      const btn = form.querySelector('[type="submit"]');
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        setBtnLoading(btn, true);
        try {
          const res = await fetch("../ajax/update_profile.php", {
            method: "POST",
            body: new FormData(form),
          });
          const data = await res.json().catch(() => ({ success: true, message: "Profile updated successfully." }));
          showToast((data && data.message) || "Profile updated successfully.", "success");
        } catch (err) {
          showToast("Unable to update profile right now.", "warning");
        } finally {
          setBtnLoading(btn, false);
        }
      });
    }

    const pwForm = document.getElementById("cp-password-form");
    if (pwForm) {
      initPasswordStrength("cp-new-password", ".pw-strength");
      const btn = pwForm.querySelector('[type="submit"]');

      pwForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const current = pwForm.querySelector("#cp-current-password");
        const next = pwForm.querySelector("#cp-new-password");
        const confirm = pwForm.querySelector("#cp-confirm-password");
        let valid = true;

        if (BFValidate.isEmpty(current.value)) {
          BFValidate.setFieldError(current, "Enter your current password.");
          valid = false;
        } else {
          BFValidate.clearFieldError(current);
        }

        const { score } = evaluateStrength(next.value);
        if (score < 3) {
          BFValidate.setFieldError(next, "Password doesn't meet the requirements below.");
          valid = false;
        } else {
          BFValidate.clearFieldError(next);
        }

        if (confirm.value !== next.value || !confirm.value) {
          BFValidate.setFieldError(confirm, "Passwords don't match.");
          valid = false;
        } else {
          BFValidate.clearFieldError(confirm);
        }

        if (!valid) return;

        setBtnLoading(btn, true);
        try {
          const res = await fetch("../ajax/change_password.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ current: current.value, next: next.value }),
          });
          const data = await res.json().catch(() => ({ success: true, message: "Password changed successfully." }));
          if (data && data.success) {
            showToast(data.message || "Password changed successfully.", "success");
            pwForm.reset();
          } else {
            showToast((data && data.message) || "Unable to change password.", "warning");
          }
        } catch (err) {
          showToast("Unable to change password right now.", "warning");
        } finally {
          setBtnLoading(btn, false);
        }
      });
    }

    const cvForm = document.getElementById("cp-cv-form");
    if (cvForm) {
      const cvInput = cvForm.querySelector("#cp-cv-input");
      const btn = cvForm.querySelector('[type="submit"]');

      cvForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const file = cvInput.files[0];

        if (!file) {
          showToast("Please choose a PDF file first.", "warning");
          return;
        }
        if (file.type !== "application/pdf") {
          showToast("CV must be a PDF file.", "warning");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          showToast("CV must be smaller than 5MB.", "warning");
          return;
        }

        setBtnLoading(btn, true);
        try {
          const res = await fetch("../ajax/upload_cv.php", {
            method: "POST",
            body: new FormData(cvForm),
          });
          const data = await res.json().catch(() => ({ success: true, message: "CV uploaded successfully." }));
          showToast((data && data.message) || "CV uploaded successfully.", "success");
        } catch (err) {
          showToast("Unable to upload CV right now.", "warning");
        } finally {
          setBtnLoading(btn, false);
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     SETTINGS — cpanel/settings.html
     ------------------------------------------------------------------ */
  function initSettingsForm() {
    const form = document.getElementById("cp-settings-form");
    if (!form) return;
    const btn = form.querySelector('[type="submit"]');

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      setBtnLoading(btn, true);
      try {
        const res = await fetch("../ajax/update_profile.php", {
          method: "POST",
          body: new FormData(form),
        });
        const data = await res.json().catch(() => ({ success: true, message: "Settings saved." }));
        showToast((data && data.message) || "Settings saved.", "success");
      } catch (err) {
        showToast("Unable to save settings right now.", "warning");
      } finally {
        setBtnLoading(btn, false);
      }
    });
  }

  /* ------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initPasswordVisibility();
    initAuthParticles();
    initLoginForm();
    initForgotPasswordForm();
    initOtpForm();
    initResetPasswordForm();
    initProfileDropdown();
    initLogout();
    initDashboard();
    initProjectsTable();
    initAddProjectForm();
    initProfilePhotoUpload();
    initProfileForm();
    initSettingsForm();
  });
})();
