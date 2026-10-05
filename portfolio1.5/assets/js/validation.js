/* ==========================================================================
   VALIDATION.JS
   Small, dependency-free validation helpers shared by contact.js and the
   future cpanel auth/forms JS. Frontend validation is a UX convenience
   only — the real backend must always revalidate (see ajax/*.php TODOs).
   ========================================================================== */

window.BFValidate = (function () {
  "use strict";

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function isEmpty(value) {
    return !value || !String(value).trim().length;
  }

  function isValidEmail(value) {
    return EMAIL_RE.test(String(value).trim());
  }

  function withinLength(value, min, max) {
    const len = String(value || "").trim().length;
    return len >= min && len <= max;
  }

  /**
   * Shows/clears a field-level error. Expects the field's wrapper
   * (.bf-form-group) to contain an element with .bf-form-error.
   */
  function setFieldError(inputEl, message) {
    inputEl.classList.add("is-invalid");
    const group = inputEl.closest(".bf-form-group");
    const errorEl = group ? group.querySelector(".bf-form-error") : null;
    if (errorEl) errorEl.textContent = message || "This field is required.";
  }

  function clearFieldError(inputEl) {
    inputEl.classList.remove("is-invalid");
  }

  return {
    isEmpty,
    isValidEmail,
    withinLength,
    setFieldError,
    clearFieldError,
  };
})();
