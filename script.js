/* ===============================
   Core Behavior (no regressions)
   =============================== */

// Theme
(function theme() {
  const key = "theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const set = (mode) => {
    root.classList.toggle("dark", mode === "dark");
    try { localStorage.setItem(key, mode); } catch { }
    if (btn) btn.setAttribute("aria-pressed", String(mode === "dark"));
  };
  const saved = (() => { try { return localStorage.getItem(key); } catch { return null; } })();
  const system = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  set(saved || system);
  btn && btn.addEventListener("click", () => set(root.classList.contains("dark") ? "light" : "dark"));
})();

// Mobile Nav
(function mobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const list = document.getElementById("nav-list");
  if (!toggle || !list) return;
  const set = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    list.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => set(!list.classList.contains("open")));
  document.addEventListener("click", (e) => {
    if (!list.classList.contains("open")) return;
    if (!e.target.closest("#nav-list") && !e.target.closest("#nav-toggle")) set(false);
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && set(false));
})();

// Smooth Scroll + Scrollspy
(function navScroll() {
  const headerOffset = 68;
  const links = [...document.querySelectorAll('.nav-list a')];

  function scrollToHash(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        history.pushState(null, "", href);
        scrollToHash(href);
      }
    });
  });

  if (location.hash) setTimeout(() => scrollToHash(location.hash), 40);

  const byId = (id) => links.find(a => a.getAttribute("href") === "#" + id);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = byId(entry.target.id);
      if (!link) return;
      link.classList.toggle("is-active", entry.isIntersecting);
    });
  }, { rootMargin: "-60% 0px -38% 0px", threshold: 0.01 });

  ["about", "projects", "achievements", "contact"].forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

// Progress Bar
(function progressBar() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  const onScroll = () => {
    const max = document.body.scrollHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, (window.scrollY || 0) / (max || 1)));
    bar.style.width = (p * 100).toFixed(2) + "%";
  };
  addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();
})();

// Stats Counter
(function statsCounter() {
  const nums = document.querySelectorAll(".stat");
  if (!nums.length) return;
  const animate = (el) => {
    const target = Number(el.dataset.count || 0);
    const start = performance.now(), dur = 900;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const obs = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  nums.forEach(n => obs.observe(n));
})();

// Scroll-to-top FAB
(function toTopFab() {
  const fab = document.getElementById("to-top");
  if (!fab) return;
  const toggle = () => fab.classList.toggle("show", window.scrollY > 500);
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  fab.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

// Reveal on scroll
(function fadeInOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".section, .project-card").forEach(el => observer.observe(el));
})();

/* ===============================
   Data
   =============================== */

const PROJECTS = [
  {
    title: "Smart Irrigation IoT",
    period: "2024",
    cover: "https://picsum.photos/seed/irrigation/800/450",
    desc: "Closed-loop irrigation using soil sensors, forecast ingestion, and a React dashboard. Reduced water usage in tests.",
    tags: ["ESP32", "React", "Firebase"],
    links: [{ label: "Case Study", href: "#" }, { label: "Code", href: "https://github.com/yourusername/smart-irrigation" }],
    gallery: [
      "https://picsum.photos/seed/irrigation-1/1200/675",
      "https://picsum.photos/seed/irrigation-2/1200/675"
    ]
  },
  {
    title: "Autonomous Line-Following Robot",
    period: "2023",
    cover: "https://picsum.photos/seed/robot/800/450",
    desc: "OpenCV-based lane detection + PID on Raspberry Pi for reliable line following with sharp turns.",
    tags: ["Python", "OpenCV", "Raspberry Pi"],
    links: [{ label: "Case Study", href: "#" }]
  },
  {
    title: "Portfolio Website",
    period: "2025",
    cover: "https://picsum.photos/seed/portfolio/800/450",
    desc: "This site: accessible, SEO-ready, themeable, and fast. Vanilla HTML/CSS/JS.",
    tags: ["Accessibility", "SEO", "Performance"],
    links: [{ label: "Repo", href: "https://github.com/yourusername/portfolio" }],
    gallery: [
      "https://picsum.photos/seed/portfolio-1/1200/675",
      "https://picsum.photos/seed/portfolio-2/1200/675"
    ]
  }
];

const ACHIEVEMENTS = [
  { date: "2025", title: "Portfolio v2 Launched", detail: "Rebuilt with accessibility, performance and polish." },
  { date: "2024", title: "Smart Irrigation Pilot", detail: "Successful water reduction in test plots." },
  { date: "2023", title: "WRO Global #19", detail: "Represented Singapore (RoboMission Junior)." },
  { date: "2023", title: "FLL Robot Performance Award", detail: "Second Runner Up." },
  { date: "2021–2023", title: "Edusave Scholarship", detail: "Academic excellence." }
];

/* ===============================
   Project Rendering + Filters + Lightbox + Schema
   =============================== */

(function projectsModule() {
  const grid = document.getElementById("project-grid");
  const filterBox = document.getElementById("project-filters");
  if (!grid || !filterBox) return;

  // Build tag universe
  const allTags = new Set();
  PROJECTS.forEach(p => (p.tags || []).forEach(t => allTags.add(t)));
  const state = { filter: "All" };

  function renderFilterButtons() {
    filterBox.innerHTML =
      `<button class="btn btn-ghost ${state.filter === "All" ? "active" : ""}" data-tag="All">All</button>` +
      [...allTags].sort().map(tag =>
        `<button class="btn btn-ghost ${state.filter === tag ? "active" : ""}" data-tag="${tag}">${tag}</button>`
      ).join("");
    filterBox.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        state.filter = btn.dataset.tag;
        renderProjectsList();
        renderFilterButtons();
      });
    });
  }

  function projectCard(p, index) {
    const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join("");
    const links = (p.links || []).map(l => `<a class="btn btn-ghost" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join("");
    const galleryLinks = (p.gallery || []).map((src, i) =>
      `<a href="${src}" class="glightbox" data-gallery="proj-${index}" aria-label="${p.title} image ${i + 1}" style="display:none">img</a>`
    ).join("");

    return `
      <article class="card project-card" role="listitem">
        <a href="${(p.gallery && p.gallery[0]) ? p.gallery[0] : p.cover}" class="glightbox" data-gallery="proj-${index}">
          <img class="project-cover" src="${p.cover}" alt="${p.title} cover" loading="lazy" decoding="async">
        </a>
        ${galleryLinks}
        <div class="project-meta"><span>${p.period}</span></div>
        <h3>${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-tags">${tags}</div>
        <div class="project-actions">${links}</div>
      </article>
    `;
  }

  function renderProjectsList() {
    grid.innerHTML = "";
    const list = PROJECTS.filter(p => state.filter === "All" || (p.tags || []).includes(state.filter));
    list.forEach((p, i) => {
      grid.insertAdjacentHTML("beforeend", projectCard(p, i));
    });

    // reveal animation for new cards
    requestAnimationFrame(() => {
      grid.querySelectorAll(".project-card").forEach(el => el.classList.add("visible"));
    });

    // Re-init lightbox (idempotent)
    if (window.GLightbox) {
      GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true, zoomable: false });
    }
  }

  // Inject Project JSON-LD Schema
  (function injectProjectSchemas() {
    const items = PROJECTS.map(p => ({
      "@type": "CreativeWork",
      "name": p.title,
      "description": p.desc,
      "datePublished": p.period,
      "url": "https://your-domain.com/#projects",
      "image": p.cover
    }));
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": items
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(schema);
    document.head.appendChild(s);
  })();

  renderFilterButtons();
  renderProjectsList();
})();

/* ===============================
   Achievements Timeline
   =============================== */

(function renderTimeline() {
  const root = document.getElementById("achievements-timeline");
  if (!root) return;
  root.innerHTML = "";
  ACHIEVEMENTS.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<time>${item.date}</time><div><strong>${item.title}</strong><div>${item.detail}</div></div>`;
    root.appendChild(li);
  });
})();

/* ===============================
   Contact Form
   =============================== */

(function contactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !/\S+@\S+\.\S+/.test(email) || message.length < 4) {
      status.textContent = "Please enter a valid name, email, and message.";
      status.style.color = "tomato";
      return;
    }

    const btn = form.querySelector("button");
    btn.disabled = true;
    status.textContent = "Sending…";
    btn.classList.add("is-loading");

    // Hook to Formspree or your API here:
    await new Promise(r => setTimeout(r, 1100));

    btn.disabled = false;
    btn.classList.remove("is-loading");
    status.textContent = "Thanks! I’ll get back to you soon.";
    status.style.color = "seagreen";
    form.reset();

    setTimeout(() => (status.textContent = ""), 2500);
  });
})();

/* ===============================
   Utilities: Year, Copy Email, Projects PDF
   =============================== */

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Copy email button
(function copyEmail() {
  const btn = document.getElementById("copy-email");
  if (!btn) return;
  const email = "nicholascheok816@gmail.com";
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      const prev = btn.textContent;
      btn.textContent = "Copied!";
      btn.style.borderColor = "seagreen";
      btn.style.color = "seagreen";
      setTimeout(() => { btn.textContent = prev; btn.style.borderColor = ""; btn.style.color = ""; }, 1400);
    } catch {
      location.href = `mailto:${email}`;
    }
  });
})();

// Print-friendly PDF of projects
(function projectsPDF() {
  const btn = document.getElementById("download-projects");
  if (!btn) return;
  btn.addEventListener("click", () => {
    // Simple approach: print current page; print CSS hides nav/filters and formats projects.
    window.print();
  });
})();
