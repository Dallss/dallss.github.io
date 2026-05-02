let PROJECTS = []; // loaded from JSON
let COLORS = [];

/** PNG/JPEG backgrounds: prefer sibling WebP (from `npm run optimize-images`). */
function backdropImageValue(bgUrl) {
    if (!bgUrl || !/\.(png|jpe?g)$/i.test(bgUrl)) {
        return `url('${bgUrl}')`;
    }
    const webpUrl = bgUrl.replace(/\.(png|jpe?g)$/i, ".webp");
    const mime = /\.jpe?g$/i.test(bgUrl) ? "image/jpeg" : "image/png";
    return `image-set(url('${webpUrl}') type('image/webp'), url('${bgUrl}') type('${mime}'))`;
}

function preloadRaster(href) {
    if (!href) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    document.head.appendChild(link);
}

function prefetchRasterWebp(bgUrl) {
    if (!bgUrl || !/\.(png|jpe?g)$/i.test(bgUrl)) return;
    preloadRaster(bgUrl.replace(/\.(png|jpe?g)$/i, ".webp"));
}

const lazyBgObserver =
    typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
              (entries, obs) => {
                  for (const e of entries) {
                      if (!e.isIntersecting) continue;
                      const el = e.target;
                      const v = el.dataset.lazyBg;
                      if (v) el.style.backgroundImage = v;
                      delete el.dataset.lazyBg;
                      obs.unobserve(el);
                  }
              },
              { root: null, rootMargin: "180px", threshold: 0.01 },
          )
        : null;

// -------- FETCH THE JSON -------- //
async function loadProjectsJSON() {
    try {
        const res = await fetch("./static/data.json");
        const data = await res.json();
        PROJECTS = data.projects;
        console.log("Loaded Projects:", PROJECTS);

        COLORS = data.tagColors;

        RenderMoreProjects();
        RenderFeaturedProjects();
    } catch (err) {
        console.error("Failed to load projects.json:", err);
    }
}

function RenderMoreProjects( filters = [] ) {

    console.log("render");
    const grid = document.getElementById("projects-grid");
    if (!grid || PROJECTS.length === 0) return;

    // Remove only existing project links
    const existingProjects = grid.querySelectorAll(".project-link");
    existingProjects.forEach((el) => {
        const tile = el.querySelector(".project");
        if (tile && lazyBgObserver) lazyBgObserver.unobserve(tile);
        el.remove();
    });

    const nonFeatured = PROJECTS;

    nonFeatured.forEach(({ label, description = "", bg, link, tags = [] }) => {

        if (filters.length > 0) {
            const matches = filters.every((filter) => tags.includes(filter));
            if (!matches) return;
        }
        

        const anchor = document.createElement("a");
        anchor.href = link;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.className = "project-link";

        const media = document.createElement("div");
        media.className = "project-card-media";

        const project = document.createElement("div");
        project.className = "project";
        const backdrop = backdropImageValue(bg);
        if (lazyBgObserver) {
            project.dataset.lazyBg = backdrop;
        } else {
            project.style.backgroundImage = backdrop;
        }

        const overlay = document.createElement("div");
        overlay.className = "overlay";
        project.appendChild(overlay);
        media.appendChild(project);

        const textWrap = document.createElement("div");
        textWrap.className = "project-card-text";

        if (tags.length > 0) {
            const tagsRow = document.createElement("div");
            tagsRow.className = "project-card-tags";
            tags.forEach((tag) => {
                const dot = document.createElement("span");
                dot.className = "tag-icon";
                dot.title = tag;
                dot.style.backgroundColor = COLORS[tag];
                tagsRow.appendChild(dot);
            });
            textWrap.appendChild(tagsRow);
        }

        const titleEl = document.createElement("h3");
        titleEl.className = "project-card-title";
        titleEl.textContent = label;
        textWrap.appendChild(titleEl);

        const descTrimmed = typeof description === "string" ? description.trim() : "";
        if (descTrimmed) {
            const descEl = document.createElement("p");
            descEl.className = "project-card-desc";
            descEl.textContent = descTrimmed;
            textWrap.appendChild(descEl);
        }

        anchor.appendChild(media);
        anchor.appendChild(textWrap);
        grid.appendChild(anchor);

        if (lazyBgObserver) lazyBgObserver.observe(project);
    });
}


function RenderFeaturedProjects() {
    const featuredItems = PROJECTS.filter(p => p.featured);
    const carousel = document.getElementById("carousel");
    let currentExpandedItem = null;

    carousel.innerHTML = "";

    featuredItems.forEach(({ label, bg, link, tags}) => {
        const item = document.createElement("div");
        item.classList.add("car-item");

        const bgOverlay = document.createElement("div");
        bgOverlay.classList.add("bg-overlay");
        bgOverlay.style.backgroundImage = backdropImageValue(bg);

        const anchor = document.createElement("a");
        anchor.textContent = label;
        anchor.href = link;
        anchor.target = "_blank";
        anchor.style.color = "inherit";
        anchor.style.textDecoration = "none";

        item.appendChild(bgOverlay);
        item.appendChild(anchor);

        const handleInteraction = (e) => {
            if (e.target.tagName.toLowerCase() === "a") return;
            e.preventDefault();

            if (item.classList.contains("expanded")) {
                item.classList.remove("expanded");
                bgOverlay.style.opacity = "";
                currentExpandedItem = null;
            } else {
                if (currentExpandedItem) {
                    currentExpandedItem.classList.remove("expanded");
                    currentExpandedItem.querySelector(".bg-overlay").style.opacity = "";
                }
                item.classList.add("expanded");
                bgOverlay.style.opacity = "0.3";
                currentExpandedItem = item;
            }
        };

        item.addEventListener("click", handleInteraction);
        item.addEventListener("touchstart", handleInteraction, { passive: false });

        carousel.appendChild(item);
    });

    featuredItems.forEach(({ bg }) => prefetchRasterWebp(bg));
}



// ----------- DOM READY ---------------- //

document.addEventListener("DOMContentLoaded", function () {
    // Load JSON → then load UI
    loadProjectsJSON();
});

// Expose module functions globally for HTML inline handlers
window.loadProjectsJSON = loadProjectsJSON;
window.RenderMoreProjects = RenderMoreProjects;
window.RenderFeaturedProjects = RenderFeaturedProjects;

export { 
    loadProjectsJSON, 
    RenderMoreProjects, 
    RenderFeaturedProjects 
};