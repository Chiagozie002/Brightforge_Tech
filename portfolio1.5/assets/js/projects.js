/* ==========================================================================
   PROJECTS.JS

   Renders project cards from static demo data and powers category
   filtering. Structured so the single DATA array below is the only thing
   that needs to change once a real backend exists:

     Fetch() -> PHP -> MySQL -> JSON -> renderProjects(json)

   i.e. replace loadProjects()'s body with a fetch() call that resolves to
   the same shape as BF_PROJECTS_DATA, then call renderProjects(data).
   Everything else (filtering, cards, empty state) keeps working unchanged.
   ========================================================================== */

(function () {
  "use strict";

  const grid = document.getElementById("bf-projects-grid");
  if (!grid) return;

  const filterBar = document.getElementById("bf-filter-bar");
  const emptyState = document.getElementById("bf-projects-empty");

  // ---- DEMO / STATIC DATA -------------------------------------------------
  // Replace with a real fetch() to a PHP endpoint once the backend exists.
  const BF_PROJECTS_DATA = [
    {
      id: 1,
      name: "Flood Early-Warning Dashboard",
      description:
        "A community weather-hazard dashboard that turns rainfall and river-level data into plain-language flood alerts for local residents.",
      category: "Web App",
      tech: ["JavaScript", "PHP", "MySQL", "Chart.js"],
      image: "assets/images/projects/project-01.svg",
      demoUrl: "#",
      githubUrl: "#",
      featured: true,
    },
    {
      id: 2,
      name: "Campus Event Finder",
      description:
        "A searchable directory of student events with category filters, RSVP counts, and a clean mobile-first interface.",
      category: "Web App",
      tech: ["JavaScript", "Bootstrap", "PHP"],
      image: "assets/images/projects/project-02.svg",
      demoUrl: "#",
      githubUrl: "#",
      featured: false,
    },
    {
      id: 3,
      name: "Restaurant Ordering UI",
      description:
        "A modern restaurant menu and ordering interface with cart state, live totals, and a lightweight checkout flow.",
      category: "UI/UX",
      tech: ["HTML5", "CSS3", "JavaScript"],
      image: "assets/images/projects/project-03.svg",
      demoUrl: "#",
      githubUrl: "#",
      featured: true,
    },
    {
      id: 4,
      name: "SDG Impact Tracker",
      description:
        "An internal tool for a student SDG-focused organization to log project activity against UN Sustainable Development Goals.",
      category: "Dashboard",
      tech: ["JavaScript", "PHP", "MySQL"],
      image: "assets/images/projects/project-04.svg",
      demoUrl: "#",
      githubUrl: "#",
      featured: false,
    },
    {
      id: 5,
      name: "Personal Finance Tracker",
      description:
        "A budgeting interface with category breakdowns, monthly summaries, and a responsive chart-driven overview.",
      category: "Web App",
      tech: ["JavaScript", "Chart.js", "Bootstrap"],
      image: "assets/images/projects/project-05.svg",
      demoUrl: "#",
      githubUrl: "#",
      featured: false,
    },
    {
      id: 6,
      name: "Landing Page System",
      description:
        "A reusable set of marketing landing-page templates with a shared design system and theme switcher.",
      category: "UI/UX",
      tech: ["HTML5", "CSS3", "JavaScript"],
      image: "assets/images/projects/project-06.svg",
      demoUrl: "#",
      githubUrl: "#",
      featured: false,
    },
  ];

  let activeCategory = "All";

  function categoriesFrom(data) {
    const set = new Set(data.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }

  function cardTemplate(project) {
    return (
      '<div class="col-sm-6 col-lg-4 bf-project-col" data-category="' +
      project.category +
      '">' +
      '<article class="bf-project-card" data-reveal>' +
      '<div class="bf-project-thumb">' +
      '<span class="bf-project-category">' +
      project.category +
      "</span>" +
      '<img src="' +
      project.image +
      '" alt="' +
      project.name +
      ' project screenshot" loading="lazy">' +
      "</div>" +
      '<div class="bf-project-body">' +
      "<h3>" +
      project.name +
      "</h3>" +
      "<p>" +
      project.description +
      "</p>" +
      '<div class="bf-project-tags">' +
      project.tech.map((t) => '<span class="bf-project-tag">' + t + "</span>").join("") +
      "</div>" +
      '<div class="bf-project-links">' +
      '<a href="' +
      project.demoUrl +
      '" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>' +
      '<a href="' +
      project.githubUrl +
      '" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>' +
      "</div>" +
      "</div>" +
      "</article>" +
      "</div>"
    );
  }

  function skeletonTemplate() {
    return (
      '<div class="col-sm-6 col-lg-4 bf-project-skeleton-col">' +
      '<div class="bf-skeleton bf-skeleton-card mb-3"></div>' +
      '<div class="bf-skeleton mb-2" style="height:16px;width:70%"></div>' +
      '<div class="bf-skeleton" style="height:14px;width:45%"></div>' +
      "</div>"
    );
  }

  function renderSkeletons(count) {
    grid.innerHTML = Array.from({ length: count }).map(skeletonTemplate).join("");
  }

  function renderFilters(data) {
    if (!filterBar) return;
    const cats = categoriesFrom(data);
    filterBar.innerHTML = cats
      .map(
        (cat, i) =>
          '<button type="button" class="bf-filter-btn' +
          (i === 0 ? " active" : "") +
          '" data-filter="' +
          cat +
          '">' +
          cat +
          "</button>"
      )
      .join("");

    filterBar.querySelectorAll(".bf-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBar.querySelectorAll(".bf-filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.getAttribute("data-filter");
        applyFilter();
      });
    });
  }

  function applyFilter() {
    const cols = grid.querySelectorAll(".bf-project-col");
    let visibleCount = 0;

    cols.forEach((col) => {
      const match = activeCategory === "All" || col.getAttribute("data-category") === activeCategory;
      col.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  function renderProjects(data) {
    if (!data.length) {
      grid.innerHTML = "";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    grid.innerHTML = data.map(cardTemplate).join("");
    if (window.BF && typeof window.BF.refreshReveal === "function") {
      window.BF.refreshReveal();
    } else if (window.initRevealFallback) {
      window.initRevealFallback();
    }
    applyFilter();
  }

  async function loadProjects() {
    renderSkeletons(6);
    renderFilters(BF_PROJECTS_DATA);

    // Simulated short async load so the skeleton state is visible even on a
    // fast connection — this is the realistic stand-in for a future
    // fetch('ajax/get_projects.php') call. Replace this block with a real
    // fetch() + try/catch (loading / success / error) once the backend exists.
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      renderProjects(BF_PROJECTS_DATA);
    } catch (err) {
      grid.innerHTML =
        '<div class="col-12"><div class="bf-empty-state"><i class="fa-solid fa-triangle-exclamation"></i>' +
        "<h3>Couldn't load projects</h3><p>Please refresh the page to try again.</p></div></div>";
    }
  }

  document.addEventListener("DOMContentLoaded", loadProjects);
})();
