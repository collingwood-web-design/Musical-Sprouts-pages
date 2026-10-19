(function () {
  var form = document.getElementById("webform83248000000329004");
  if (!form) return;

  function splash(message) {
    var info = document.getElementById("wf_splash_info");
    var box = document.getElementById("wf_splash");
    if (!info || !box) return;
    info.textContent = message || "Thank you. We’ll be in touch soon.";
    box.hidden = false;
    window.setTimeout(function () {
      box.hidden = true;
    }, 5000);
  }

  function validEmail(value) {
    var at = value.indexOf("@");
    var dot = value.lastIndexOf(".");
    return at > 0 && dot > at + 1 && dot + 2 < value.length;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var honeypot = form.elements.aG9uZXlwb3Q;
    if (honeypot && honeypot.value) return;

    var required = [
      ["First Name", "Parent's first name"],
      ["Last Name", "Parent's last name"],
      ["Email", "Email"]
    ];
    var i;
    for (i = 0; i < required.length; i++) {
      var field = form.elements[required[i][0]];
      if (!field || !String(field.value).trim()) {
        window.alert(required[i][1] + " cannot be empty.");
        if (field) field.focus();
        return;
      }
    }

    var email = String(form.elements.Email.value).trim();
    if (!validEmail(email)) {
      window.alert("Please enter a valid email address.");
      form.elements.Email.focus();
      return;
    }

    var birth = form.elements.CONTACTCF51;
    if (birth && birth.value.trim() && !/^\d{2}\/\d{2}\/\d{4}$/.test(birth.value.trim())) {
      window.alert("Please enter the child’s birth date as DD/MM/YYYY, or leave it blank.");
      birth.focus();
      return;
    }

    var button = form.querySelector(".formsubmit");
    if (button) button.disabled = true;

    window.fetch("https://crm.zohocloud.ca/crm/WebToContactForm", {
      method: "POST",
      body: new FormData(form),
      cache: "no-cache"
    }).then(function (response) {
      var type = response.headers.get("Content-Type") || "";
      return type.indexOf("application/json") !== -1 ? response.json() : response.text();
    }).then(function (data) {
      if (data && typeof data === "object") {
        if (data.invalidCaptcha === "true" || data.actionsubmit === "captcha_error" || data.actionsubmit === "error_msg") {
          window.alert(data.actionvalue || data.message || "Please try again.");
          return;
        }
        if (data.redirectUrl && (data.actionsubmit === "redirect_url" || data.actionsubmit === "thankyou_page")) {
          window.location.assign(data.redirectUrl);
          return;
        }
        form.reset();
        splash(data.actionvalue || "Thank you. We’ll be in touch soon.");
        return;
      }
      form.reset();
      splash("Thank you. We’ll be in touch soon.");
    }).catch(function () {
      window.alert("Something went wrong. Please email contactmusicalsprouts@gmail.com.");
    }).then(function () {
      if (button) button.disabled = false;
    });
  });
})();
