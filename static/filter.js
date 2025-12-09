import { RenderMoreProjects } from './load-data.js';
let OPTIONS = []; // dynamically filled from JSON
const selected = [];

const input = document.getElementById("filter-input");
const dropdown = document.getElementById("dropdown");
const tagContainer = document.getElementById("selected-tags");

// Load colors from JSON
async function loadTagColors() {
    try {
        const res = await fetch("./static/data.json");
        const data = await res.json();
        const COLORS = data.tagColors; // { "C++": "#4A90E2", ... }

        // Create OPTIONS array dynamically
        OPTIONS = Object.keys(COLORS).map(label => ({
            label,
            color: COLORS[label]
        }));
    } catch (err) {
        console.error("Failed to load tag colors:", err);
    }
}

// ---------------- TAG DROPDOWN ----------------
function showDropdown() {
    const query = input.value.toLowerCase();
    dropdown.innerHTML = "";

    const matches = OPTIONS.filter(opt =>
        opt.label.toLowerCase().includes(query) &&
        !selected.find(s => s.label === opt.label)
    );

    if (matches.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    dropdown.style.display = "block";

    matches.forEach(opt => {
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.innerHTML = `
            <span class="color-box" style="background:${opt.color}"></span>
            <span>${opt.label}</span>
        `;
        item.onclick = () => addTag(opt);
        dropdown.appendChild(item);
    });
}

function addTag(opt) {
  selected.push(opt);
  renderTags();
  input.value = "";
  dropdown.style.display = "none";

  // Pass current selected labels to RenderMoreProjects
  const labels = selected.map(t => t.label.toLowerCase());
  RenderMoreProjects(labels);
}

function removeTag(label) {
  const index = selected.findIndex(t => t.label === label);
  if (index !== -1) selected.splice(index, 1);
  renderTags();

  // Pass updated labels to RenderMoreProjects
  const labels = selected.map(t => t.label.toLowerCase());
  RenderMoreProjects(labels);
}


function renderTags() {
    tagContainer.innerHTML = "";
    selected.forEach(tag => {
        const el = document.createElement("div");
        el.className = "tag";
        el.style.backgroundColor = tag.color;
        el.innerHTML = `
            <button class="remove-tag" onclick="removeTag('${tag.label}')">✕</button>
            ${tag.label}
        `;
        tagContainer.appendChild(el);
    });


}

// Close dropdown on outside click
document.addEventListener("click", (e) => {
    if (!document.querySelector(".search-box").contains(e.target)) {
        dropdown.style.display = "none";
    }
});

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", loadTagColors);


// Expose to global scope for inline HTML calls
window.showDropdown = showDropdown;
window.addTag = addTag;
window.removeTag = removeTag;