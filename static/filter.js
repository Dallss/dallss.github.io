import { RenderMoreProjects } from "./load-data.js";

let OPTIONS = [];
const selected = [];

const input = document.getElementById("filter-input");
const dropdown = document.getElementById("dropdown");
const tagContainer = document.getElementById("selected-tags");
const filterActive = !!(input && dropdown && tagContainer);

async function loadTagColors() {
   try {
      const res = await fetch("./static/data.json");
      const data = await res.json();
      const COLORS = data.tagColors;

      OPTIONS = Object.keys(COLORS).map((label) => ({
         label,
         color: COLORS[label],
      }));
   } catch (err) {
      console.error("Failed to load tag colors:", err);
   }
}

function showDropdown() {
   if (!filterActive) return;

   const query = input.value.toLowerCase();
   dropdown.innerHTML = "";

   const matches = OPTIONS.filter(
      (opt) =>
         opt.label.toLowerCase().includes(query) &&
         !selected.find((s) => s.label === opt.label),
   );

   if (matches.length === 0) {
      dropdown.style.display = "none";
      return;
   }

   dropdown.style.display = "block";

   matches.forEach((opt) => {
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
   if (!filterActive) return;
   selected.push(opt);
   renderTags();
   input.value = "";
   dropdown.style.display = "none";

   const labels = selected.map((t) => t.label.toLowerCase());
   RenderMoreProjects(labels);
}

function removeTag(label) {
   if (!filterActive) return;
   const index = selected.findIndex((t) => t.label === label);
   if (index !== -1) selected.splice(index, 1);
   renderTags();

   const labels = selected.map((t) => t.label.toLowerCase());
   RenderMoreProjects(labels);
}

function renderTags() {
   if (!filterActive) return;
   tagContainer.innerHTML = "";
   selected.forEach((tag) => {
      const el = document.createElement("div");
      el.className = "tag";
      el.style.backgroundColor = tag.color;
      el.innerHTML = `
            <button type="button" class="remove-tag" onclick="removeTag('${tag.label.replace(/'/g, "\\'")}')">✕</button>
            ${tag.label}
        `;
      tagContainer.appendChild(el);
   });
}

document.addEventListener("click", (e) => {
   if (!filterActive) return;
   const searchBox = document.querySelector(".search-box");
   if (searchBox && !searchBox.contains(e.target)) {
      dropdown.style.display = "none";
   }
});

document.addEventListener("DOMContentLoaded", loadTagColors);

window.showDropdown = showDropdown;
window.addTag = addTag;
window.removeTag = removeTag;
