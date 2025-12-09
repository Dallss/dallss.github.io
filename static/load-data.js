let PROJECTS = []; // loaded from JSON
let COLORS = [];
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
    existingProjects.forEach(el => el.remove());

    const nonFeatured = PROJECTS;

    nonFeatured.forEach(({ label, bg, link, tags }) => {

        if(filters.length > 0){
            const matches = filters.every(filter => tags.includes(filter));
            if (!matches) return;
        }
        

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

        // Render tags
        const tagsContainer = document.createElement("div");
        tagsContainer.className = "tags-container";
        overlay.appendChild(tagsContainer);

        tags.forEach((tag) => {
            const tagdiv = document.createElement("div");
            tagdiv.className = "tag-icon";
            tagdiv.title = tag;
            tagdiv.style.backgroundColor = COLORS[tag];
            tagsContainer.appendChild(tagdiv);
        });
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

// Expose module functions globally for HTML inline handlers
window.loadProjectsJSON = loadProjectsJSON;
window.RenderMoreProjects = RenderMoreProjects;
window.RenderFeaturedProjects = RenderFeaturedProjects;

export { 
    loadProjectsJSON, 
    RenderMoreProjects, 
    RenderFeaturedProjects 
};