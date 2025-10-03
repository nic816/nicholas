// ============ Theme ============
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

  if (btn) btn.addEventListener("click", () => set(root.classList.contains("dark") ? "light" : "dark"));
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
      if (!localStorage.getItem(key)) set(e.matches ? "dark" : "light");
    });
  }
})();

// ============ Mobile Nav ============
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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
})();

// ============ Smooth Scroll & Active Links ============
(function navScroll() {
  const headerOffset = 68;
  const links = [...document.querySelectorAll('.nav-list a')];

  function scrollToHash(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  document.querySelectorAll('.nav-list a, .to-top, .btn.btn-primary[href^="#"]').forEach(a => {
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

// ============ Progress Bar ============
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

// ============ Stats Counter ============
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

// ============ Scroll-to-top FAB ============
(function toTopFab() {
  const fab = document.getElementById("to-top");
  if (!fab) return;
  const toggle = () => fab.classList.toggle("show", window.scrollY > 600);
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  fab.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

// ============ Projects (with cover images + case studies) ============
const PROJECTS = [
  {
    title: "Smart Irrigation IoT",
    period: "2024",
    cover: "https://picsum.photos/seed/irrigation/800/450",
    desc: "Closed-loop irrigation using soil sensors, forecast ingestion, and a React dashboard. Reduced water usage in tests.",
    tags: ["ESP32", "React", "Firebase"],
    links: [
      { label: "Case Study", href: "project-smart-irrigation.html" },
      { label: "Code", href: "https://github.com/yourusername/smart-irrigation" }
    ]
  },
  {
    title: "Autonomous Line-Following Robot",
    period: "2023",
    cover: "https://picsum.photos/seed/robot/800/450",
    desc: "OpenCV-based lane detection + PID on Raspberry Pi for reliable line following with sharp turns.",
    tags: ["Python", "OpenCV", "Raspberry Pi"],
    links: [
      { label: "Case Study", href: "project-robotics.html" }
    ]
  },
  {
    title: "World Robot Olympiad — RoboMission Junior",
    period: "2023",
    cover: "https://picsum.photos/seed/wro/800/450",
    desc: "Represented Singapore in Panama; autonomous robots for mission boards. Ranked #19 globally.",
    tags: ["Robotics", "Arduino", "Strategy"],
    links: [
      { label: "Event", href: "https://www.wro-association.org/" }
    ]
  },
  {
    title: "First Lego League — Robot Performance",
    period: "2023",
    cover: "https://picsum.photos/seed/fll/800/450",
    desc: "LEGO robots engineered for reliable mission completion. Achieved 2nd Runner Up in performance.",
    tags: ["LEGO Spike Prime", "Engineering"],
    links: [
      { label: "Case Study", href: "project-fll.html" }
    ]
  },
  {
    title: "Portfolio Website",
    period: "2025",
    cover: "https://picsum.photos/seed/portfolio/800/450",
    desc: "This site: accessible, SEO-ready, themeable, and fast. Vanilla HTML/CSS/JS.",
    tags: ["Accessibility", "SEO", "Performance"],
    links: [
      { label: "Repo", href: "https://github.com/yourusername/portfolio" }
    ]
  }
];

(function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  PROJECTS.forEach(p => {
    const el = document.createElement("article");
    el.className = "card project-card";
    el.setAttribute("role", "listitem");

    const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join("");
    const links = p.links.map(l => `<a class="btn btn-ghost" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join("");

    el.innerHTML = `
      <img class="project-cover" src="${p.cover}" alt="${p.title} cover" loading="lazy" decoding="async">
      <div class="project-meta">${p.period}</div>
      <h3>${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      <div class="project-tags">${tags}</div>
      <div class="project-actions">${links}</div>
    `;
    grid.appendChild(el);
  });
})();

// ============ Achievements (collapsible cards) ============
const ACHIEVEMENTS = {
  "Academics": [
    "Edusave Scholarship (2021–2023)",
    "Admiralty Secondary School (2021–2024)"
  ],
  "Leadership": [
    "President — ADSS Robotics Club (2023–2024)",
    "Led EXCO of 11; organized Start Right Day & Open Houses"
  ],
  "Competitions": [
    "World Robot Olympiad 2023 — International Finals: Rank #19",
    "First Lego League 2023 — 2nd Runner Up (Robot Performance Award)"
  ],
  "Skills": [
    "3D Printing & maintenance",
    "Programming: Python, TypeScript, C/C++",
    "Languages: English, Mandarin"
  ]
};

(function renderAchievements() {
  const root = document.getElementById("achievements-grid");
  if (!root) return;

  Object.entries(ACHIEVEMENTS).forEach(([cat, items]) => {
    const card = document.createElement("section");
    card.className = "card ach-card";
    card.dataset.collapsible = "true";
    const list = items.map(i => `<li>${i}</li>`).join("");
    card.innerHTML = `
      <h3>${cat}</h3>
      <ul>${list}</ul>
      <button class="btn btn-ghost ach-toggle" type="button" aria-expanded="false">Show more</button>
    `;
    root.appendChild(card);
  });

  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".ach-toggle");
    if (!btn) return;
    const card = btn.closest(".ach-card");
    const open = card.classList.toggle("open");
    btn.textContent = open ? "Show less" : "Show more";
    btn.setAttribute("aria-expanded", String(open));
  });
})();

// ============ Contact Form (validate + spinner) ============
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

    // Replace with your endpoint (Formspree, API, etc.)
    await new Promise(r => setTimeout(r, 1100));

    btn.disabled = false;
    btn.classList.remove("is-loading");
    status.textContent = "Thanks! I’ll get back to you soon.";
    status.style.color = "seagreen";
    form.reset();

    setTimeout(() => status.textContent = "", 2500);
  });
})();

// ============ Footer year ============
document.getElementById("year").textContent = new Date().getFullYear();
