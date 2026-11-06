(() => {
  "use strict";
  const toggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const dialogBackdrop = document.getElementById("detailDialog");
  const closeButton = document.getElementById("closeDialog");
  const doneButton = document.getElementById("dialogDone");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogText = document.getElementById("dialogText");
  let lastTrigger = null;
  const details = {
    "Spicy Scallion Noodles": "A steaming bowl of noodles in a chili-spiced broth with fresh scallions and fragrant herbs.",
    "Lucky Little Dumplings": "Tender steamed dumplings with a juicy filling and a shareable spirit. Best enjoyed with good company.",
    "Garlic Wok Green Beans": "Fresh green beans tossed in a hot wok for their signature snappy texture and richly savory flavor.",
    "Beef Noodle Soup": "Tender beef, noodles, bok choy and aromatic broth: a hearty bowl built for comfort.",
    "Street-Style Wonton Soup": "Delicate wontons in warm savory broth, finished with bright, fresh green onions.",
    "Crispy Scallion Pancakes": "Flaky, pan-fried layers with golden edges and fragrant green onions."
  };
  function closeMobileMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    mobileNav.hidden = true;
  }
  toggle.addEventListener("click", () => {
    const next = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(next));
    toggle.setAttribute("aria-label", next ? "Close navigation" : "Open navigation");
    mobileNav.hidden = !next;
  });
  mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMobileMenu));
  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      document.querySelectorAll(".filter").forEach(other => {
        const isActive = other === button;
        other.classList.toggle("active", isActive);
        other.setAttribute("aria-pressed", String(isActive));
      });
      document.querySelectorAll(".dish").forEach(dish => {
        dish.classList.toggle("is-hidden", category !== "all" && dish.dataset.category !== category);
      });
    });
  });
  function closeDialog() {
    dialogBackdrop.hidden = true;
    document.body.classList.remove("dialog-open");
    if (lastTrigger) lastTrigger.focus();
  }
  document.querySelectorAll("[data-dish]").forEach(button => {
    button.addEventListener("click", () => {
      lastTrigger = button;
      const name = button.dataset.dish;
      dialogTitle.textContent = name;
      dialogText.textContent = details[name] || "A tasty concept from our imaginary kitchen.";
      dialogBackdrop.hidden = false;
      document.body.classList.add("dialog-open");
      closeButton.focus();
    });
  });
  closeButton.addEventListener("click", closeDialog);
  doneButton.addEventListener("click", closeDialog);
  dialogBackdrop.addEventListener("click", event => { if (event.target === dialogBackdrop) closeDialog(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !dialogBackdrop.hidden) closeDialog();
    if (event.key === "Escape" && !mobileNav.hidden) closeMobileMenu();
    if (event.key === "Tab" && !dialogBackdrop.hidden) {
      const first = closeButton;
      const last = doneButton;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      if (!img.getAttribute("src").includes("food-placeholder.svg")) {
        img.src = "./food-placeholder.svg";
        img.alt = "Illustrated bowl of noodles — concept image";
      }
    });
  });
})();