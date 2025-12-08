let PROJECTS = []; // loaded from JSON

// -------- FETCH THE JSON -------- //
async function loadProjectsJSON() {
    try {
        const res = await fetch("./static/data.json");
        const data = await res.json();
        PROJECTS = data.projects;
        console.log("Loaded Projects:", PROJECTS);

        loadMoreProjects();
        loadFeaturedProjects();
    } catch (err) {
        console.error("Failed to load projects.json:", err);
    }
}

function loadMoreProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid || PROJECTS.length === 0) return;

    const nonFeatured = PROJECTS;

    grid.innerHTML = "";

    nonFeatured.forEach(({ label, bg, link }) => {
        const anchor = document.createElement("a");
        anchor.href = link;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.className = "project-link";

        const project = document.createElement("div");
        project.className = "project";
        project.style.backgroundImage = `url('${bg}')`;
        project.style.borderRadius = "10px";
        project.style.opacity = 0.7;

        const overlay = document.createElement("div");
        overlay.className = "overlay";

        const projectName = document.createElement("span");
        projectName.textContent = label;

        overlay.appendChild(projectName);
        project.appendChild(overlay);
        anchor.appendChild(project);
        grid.appendChild(anchor);
    });
}

function loadFeaturedProjects() {
    const featuredItems = PROJECTS.filter(p => p.featured);
    const carousel = document.getElementById("carousel");
    let currentExpandedItem = null;

    carousel.innerHTML = "";

    featuredItems.forEach(({ label, bg, link }) => {
        const item = document.createElement("div");
        item.classList.add("car-item");

        const bgOverlay = document.createElement("div");
        bgOverlay.classList.add("bg-overlay");
        bgOverlay.style.backgroundImage = `url('${bg}')`;

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
}



// ----------- DOM READY ---------------- //

document.addEventListener("DOMContentLoaded", function () {
    // Load JSON → then load UI
    loadProjectsJSON();
});
