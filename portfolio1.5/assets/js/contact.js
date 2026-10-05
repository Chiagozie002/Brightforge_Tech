/* ==========================================================================
   CONTACT.JS
   Contact form: client-side validation + AJAX submit to ajax/send_message.php
   using Fetch + async/await. Handles loading, disabled-button duplicate
   prevention, success/error/network-failure states, and toast feedback.
   ========================================================================== */

(function () {
  "use strict";

  const form = document.getElementById("bf-contact-form");
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');
  const fields = {
    name: form.querySelector("#contact-name"),
    email: form.querySelector("#contact-email"),
    subject: form.querySelector("#contact-subject"),
    message: form.querySelector("#contact-message"),
  };

  let isSubmitting = false;

  function validate() {
    let valid = true;

    if (BFValidate.isEmpty(fields.name.value) || !BFValidate.withinLength(fields.name.value, 2, 80)) {
      BFValidate.setFieldError(fields.name, "Please enter your name.");
      valid = false;
    } else {
      BFValidate.clearFieldError(fields.name);
    }

    if (!BFValidate.isValidEmail(fields.email.value)) {
      BFValidate.setFieldError(fields.email, "Please enter a valid email address.");
      valid = false;
    } else {
      BFValidate.clearFieldError(fields.email);
    }

    if (BFValidate.isEmpty(fields.subject.value) || !BFValidate.withinLength(fields.subject.value, 3, 120)) {
      BFValidate.setFieldError(fields.subject, "Please enter a subject.");
      valid = false;
    } else {
      BFValidate.clearFieldError(fields.subject);
    }

    if (BFValidate.isEmpty(fields.message.value) || !BFValidate.withinLength(fields.message.value, 10, 2000)) {
      BFValidate.setFieldError(
        fields.message,
        "Message should be between 10 and 2000 characters."
      );
      valid = false;
    } else {
      BFValidate.clearFieldError(fields.message);
    }

    return valid;
  }

  // Clear field errors as the user types/fixes them.
  Object.values(fields).forEach((input) => {
    input.addEventListener("input", () => BFValidate.clearFieldError(input));
  });

  function setLoading(loading) {
    isSubmitting = loading;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle("is-loading", loading);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (isSubmitting) return; // duplicate-submission guard
    if (!validate()) {
      showToast("Please check your information.", "warning");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("ajax/send_message.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name.value.trim(),
          email: fields.email.value.trim(),
          subject: fields.subject.value.trim(),
          message: fields.message.value.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error("invalid-json");
      }

      if (data && data.success) {
        showToast(data.message || "Your message has been sent successfully.", "success");
        form.reset();
      } else {
        showToast((data && data.message) || "Unable to send your message.", "warning");
      }
    } catch (err) {
      // Network failure, non-2xx response, or malformed JSON all land here.
      showToast("Something went wrong. Please try again in a moment.", "warning");
    } finally {
      setLoading(false);
    }
  });
})();
