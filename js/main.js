(function () {
  var header = document.querySelector("header.site");
  var logo = document.querySelector("header.site .brand-logo");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main");

  function updateHeader() {
    if (!header) return;
    var scrolled = window.scrollY > 20;
    header.classList.toggle("is-scrolled", scrolled);
    if (logo && logo.dataset.logoWhite && logo.dataset.logoColour) {
      var next = scrolled ? logo.dataset.logoColour : logo.dataset.logoWhite;
      if (logo.getAttribute("src") !== next) logo.setAttribute("src", next);
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.textContent = open ? "Close" : "Menu";
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      toggle.textContent = "Menu";
    });
  });
})();
