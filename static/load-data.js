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
        COLORS = data.tagColors;

        RenderMoreProjects();
        RenderFeaturedProjects();
    } catch (err) {
        console.error("Failed to load projects.json:", err);
    }
}

function RenderMoreProjects(filters = []) {
    const grid = document.getElementById("projects-grid");
    if (!grid || PROJECTS.length === 0) return;

    const existingProjects = grid.querySelectorAll(".project-link");
    existingProjects.forEach((el) => {
        const tile = el.querySelector(".project");
        if (tile && lazyBgObserver) lazyBgObserver.unobserve(tile);
        el.remove();
    });

    const normalized = filters.map((f) => String(f).toLowerCase());

    PROJECTS.forEach(({ label, description = "", bg, link, tags = [] }) => {
        if (normalized.length > 0) {
            const tagLower = tags.map((t) => String(t).toLowerCase());
            const matches = normalized.every((filter) => tagLower.includes(filter));
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

function formatKicker(tags) {
    if (!tags || tags.length === 0) return "Project";
    const t = tags[0];
    return t.length ? t.charAt(0).toUpperCase() + t.slice(1) : "Project";
}

function RenderFeaturedProjects() {
    const container = document.getElementById("featured-works");
    if (!container) return;

    const featuredItems = PROJECTS.filter((p) => p.featured);
    container.innerHTML = "";

    if (featuredItems.length === 0) return;

    featuredItems.forEach(({ label, description = "", bg, link, tags = [] }) => {
        prefetchRasterWebp(bg);

        const article = document.createElement("article");
        article.className = "featured-card";

        const anchor = document.createElement("a");
        anchor.className = "featured-card-link";
        anchor.href = link;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";

        const media = document.createElement("div");
        media.className = "featured-card-media";

        const cover = document.createElement("div");
        cover.className = "featured-card-cover";
        const backdrop = backdropImageValue(bg);
        if (lazyBgObserver) {
            cover.dataset.lazyBg = backdrop;
            lazyBgObserver.observe(cover);
        } else {
            cover.style.backgroundImage = backdrop;
        }

        media.appendChild(cover);

        const body = document.createElement("div");
        body.className = "featured-card-body";

        const kicker = document.createElement("p");
        kicker.className = "featured-card-kicker";
        kicker.textContent = `${formatKicker(tags)} ·`;

        const title = document.createElement("h3");
        title.className = "featured-card-title";
        title.append(document.createTextNode(`${label} `));
        const arrow = document.createElement("span");
        arrow.className = "arrow";
        arrow.textContent = "↘";
        title.append(arrow);

        body.appendChild(kicker);
        body.appendChild(title);

        const descTrimmed = typeof description === "string" ? description.trim() : "";
        if (descTrimmed) {
            const desc = document.createElement("p");
            desc.className = "featured-card-desc";
            desc.textContent = descTrimmed;
            body.appendChild(desc);
        }

        if (tags.length > 0) {
            const row = document.createElement("div");
            row.className = "featured-card-tags";
            tags.slice(0, 6).forEach((tag) => {
                const dot = document.createElement("span");
                dot.className = "tag-dot";
                dot.title = tag;
                dot.style.backgroundColor = COLORS[tag] || "#888";
                row.appendChild(dot);
            });
            body.appendChild(row);
        }

        anchor.appendChild(media);
        anchor.appendChild(body);
        article.appendChild(anchor);
        container.appendChild(article);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadProjectsJSON();
});

window.loadProjectsJSON = loadProjectsJSON;
window.RenderMoreProjects = RenderMoreProjects;
window.RenderFeaturedProjects = RenderFeaturedProjects;

export { loadProjectsJSON, RenderMoreProjects, RenderFeaturedProjects };
