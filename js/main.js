/* ==========================================================================
   Shared logic for the landing page + every project page.

   - Landing page (index.html): renders the header + project grid from
     js/data.js.
   - Project pages (projects/*.html): everything is plain HTML you write by
     hand, EXCEPT the photo gallery lightbox and the sticky section-jump nav,
     which this file wires up automatically based on markup structure (no
     data file needed — it just looks for .gallery-item / .section-nav on
     the page).
   ========================================================================== */

// ---------------------------------------------------------------
// Theme: light/dark toggle (the initial theme is set by a tiny inline
// script in each page's <head> so there's no flash of the wrong theme —
// this just wires up the button and persists the choice).
// ---------------------------------------------------------------
function initTheme() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable, ignore */ }
  });
}

// ---------------------------------------------------------------
// Landing page: header + project card grid
// ---------------------------------------------------------------
function renderLanding() {
  if (typeof SITE === "undefined" || typeof PROJECTS === "undefined") return;

  document.querySelectorAll("[data-site-name]").forEach(el => el.textContent = SITE.name);
  document.querySelectorAll("[data-site-tagline]").forEach(el => el.textContent = SITE.tagline);
  document.querySelectorAll("[data-site-intro]").forEach(el => el.textContent = SITE.intro);
  document.querySelectorAll("[data-site-email]").forEach(el => { el.textContent = SITE.email; el.href = "mailto:" + SITE.email; });
  document.querySelectorAll("[data-site-github]").forEach(el => el.href = SITE.github);
  document.querySelectorAll("[data-site-linkedin]").forEach(el => el.href = SITE.linkedin);
  document.querySelectorAll("[data-site-resume]").forEach(el => el.href = SITE.resumeUrl);

  const grid = document.querySelector("[data-projects-grid]");
  if (!grid) return;

  const cards = PROJECTS.map(p => `
    <a class="card" href="${p.href}">
      <div class="thumb"><img src="${p.heroImage}" alt="${p.title}" loading="lazy"></div>
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.oneLiner}</p>
        <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    </a>
  `).join("");

  grid.innerHTML = cards;
}

// ---------------------------------------------------------------
// Project pages: photo gallery lightbox
// Reads whatever .gallery-item elements exist on the page — no data file
// needed. Each item is expected to look like:
//   <div class="gallery-item"><img src="..." alt="..."><div class="cap">Caption</div></div>
// ---------------------------------------------------------------
function initGalleryLightbox() {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.querySelector("[data-lightbox]");
  if (!items.length || !lightbox) return;

  let index = 0;
  const lbImg = lightbox.querySelector("img");
  const lbCap = lightbox.querySelector(".lb-cap");

  function show(i) {
    index = (i + items.length) % items.length;
    const img = items[index].querySelector("img");
    const cap = items[index].querySelector(".cap");
    lbImg.src = img.src;
    lbImg.alt = img.alt || "";
    lbCap.textContent = cap ? cap.textContent : (img.alt || "");
  }

  function open(i) {
    show(i);
    lightbox.classList.add("open");
    document.addEventListener("keydown", onKey);
  }

  function close() {
    lightbox.classList.remove("open");
    document.removeEventListener("keydown", onKey);
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  }

  items.forEach((item, i) => item.addEventListener("click", () => open(i)));
  const closeBtn = lightbox.querySelector(".lb-close");
  const prevBtn = lightbox.querySelector(".lb-prev");
  const nextBtn = lightbox.querySelector(".lb-next");
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (prevBtn) prevBtn.addEventListener("click", () => show(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => show(index + 1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
}

// ---------------------------------------------------------------
// Project pages: highlight the current section in the sticky section-nav
// (the little "Overview / Problem / Approach / ..." jump bar) as you scroll.
// ---------------------------------------------------------------
function initSectionNav() {
  const nav = document.querySelector(".section-nav");
  const sections = document.querySelectorAll(".project-section[id]");
  if (!nav || !sections.length || !("IntersectionObserver" in window)) return;

  const links = Array.from(nav.querySelectorAll("a"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      links.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

// ---------------------------------------------------------------
// Project pages: click a Progress card to open it enlarged
// (bigger photo + full text). Arrow keys / buttons move between
// cards, Esc or clicking the dark background closes it.
// Works automatically for any .progress-card on the page.
// ---------------------------------------------------------------
function initProgressModal() {
  const cards = Array.from(document.querySelectorAll(".progress-card"));
  if (!cards.length) return;

  const modal = document.createElement("div");
  modal.className = "progress-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="pm-panel">
      <button class="pm-close" aria-label="Close">&times;</button>
      <div class="pm-media"></div>
      <div class="pm-body">
        <div class="timeline-date pm-date"></div>
        <h3 class="pm-title"></h3>
        <div class="pm-text"></div>
        <div class="pm-nav">
          <button class="pm-prev" aria-label="Previous update">&larr; Newer</button>
          <span class="pm-count"></span>
          <button class="pm-next" aria-label="Next update">Older &rarr;</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const media = modal.querySelector(".pm-media");
  const date = modal.querySelector(".pm-date");
  const title = modal.querySelector(".pm-title");
  const text = modal.querySelector(".pm-text");
  const count = modal.querySelector(".pm-count");
  let index = 0;
  let lastFocus = null;

  function show(i) {
    index = (i + cards.length) % cards.length;
    const card = cards[index];
    const img = card.querySelector(".progress-media img");
    media.innerHTML = "";
    if (img) {
      const big = document.createElement("img");
      big.src = img.src;
      big.alt = img.alt || "";
      media.appendChild(big);
      modal.classList.remove("no-media");
    } else {
      modal.classList.add("no-media");
    }
    const d = card.querySelector(".timeline-date");
    const h = card.querySelector("h4");
    const p = card.querySelector(".progress-text p");
    date.textContent = d ? d.textContent : "";
    title.textContent = h ? h.textContent : "";
    text.innerHTML = p ? p.innerHTML : "";
    count.textContent = (index + 1) + " / " + cards.length;
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    modal.querySelector(".pm-close").focus();
  }

  function close() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    if (lastFocus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  }

  cards.forEach((card, i) => {
    card.classList.add("expandable");
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Open update: " + (card.querySelector("h4")?.textContent || ""));
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return; // let links inside the card work normally
      open(i);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
    });
  });

  modal.querySelector(".pm-close").addEventListener("click", close);
  modal.querySelector(".pm-prev").addEventListener("click", () => show(index - 1));
  modal.querySelector(".pm-next").addEventListener("click", () => show(index + 1));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
    if (e.target.closest(".pm-text a")) close(); // jumping to another section closes the modal
  });
}

// ---------------------------------------------------------------
// 3D models (<model-viewer>): an "Expand" button that opens the model
// full-screen, a wider zoom range (closer in and further out), and a
// "Reset view" button. Applies to every <model-viewer> on the page.
// ---------------------------------------------------------------
function initModelViewers() {
  const viewers = document.querySelectorAll("model-viewer");
  if (!viewers.length) return;

  viewers.forEach((mv) => {
    const reset = () => {
      mv.cameraOrbit = mv.getAttribute("camera-orbit") || "auto auto auto";
      mv.cameraTarget = "auto auto auto";
      mv.fieldOfView = "auto";
    };

    // Let users zoom much closer than the default.
    mv.setAttribute("min-field-of-view", "8deg");
    mv.addEventListener("load", () => {
      const d = mv.getDimensions();
      const size = Math.max(d.x, d.y, d.z); // metres
      mv.setAttribute("min-camera-orbit", `auto auto ${(size * 0.6).toFixed(4)}m`);
      mv.setAttribute("max-camera-orbit", `auto auto ${(size * 4).toFixed(4)}m`);
      // Re-apply the starting view now that the zoom limits allow it.
      reset();
      mv.jumpCameraToGoal();
    });

    const controls = document.createElement("div");
    controls.className = "mv-controls";
    controls.innerHTML = `
      <button type="button" class="mv-btn" data-mv-reset aria-label="Reset view">&#8634; Reset</button>
      <button type="button" class="mv-btn" data-mv-expand aria-label="Expand 3D model">&#10530; Expand</button>`;
    mv.appendChild(controls);

    const setExpanded = (on) => {
      mv.classList.toggle("mv-expanded", on);
      document.body.classList.toggle("mv-lock", on);
      const btn = controls.querySelector("[data-mv-expand]");
      btn.innerHTML = on ? "&times; Close" : "&#10530; Expand";
      btn.setAttribute("aria-label", on ? "Close full-screen 3D model" : "Expand 3D model");
      reset();
    };

    controls.querySelector("[data-mv-reset]").addEventListener("click", reset);
    controls.querySelector("[data-mv-expand]").addEventListener("click", () =>
      setExpanded(!mv.classList.contains("mv-expanded")));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mv.classList.contains("mv-expanded")) setExpanded(false);
    });
  });
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderLanding();
  initGalleryLightbox();
  initSectionNav();
  initProgressModal();
  initModelViewers();

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
});
