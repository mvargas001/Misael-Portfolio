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
// Init
// ---------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderLanding();
  initGalleryLightbox();
  initSectionNav();

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
});
