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
    "Chili Crunch Noodles": "A vibrant bowl of springy noodles, fragrant chili oil, crisp scallions, and a satisfying savory finish.",
    "Lucky Little Dumplings": "Tender steamed dumplings with a juicy filling and a shareable spirit. Best enjoyed with good company.",
    "Wok-Tossed Greens": "Fresh greens flash-fried with garlic for charred edges, bright crunch, and an irresistible savory aroma.",
    "Firecracker Beef Noodles": "Wok-seared beef meets comforting noodles and a lively sweet-heat glaze.",
    "Chili Oil Wontons": "Silky wontons with chili oil, a fragrant sesame note, and a little delicious drama.",
    "Scallion Pancake Bites": "Crispy, flaky golden bites with scallions and a savory dipping sauce."
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