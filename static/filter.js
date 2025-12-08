// Options with label + color
const OPTIONS = [
   { label: "C++", color: "#4A90E2" },
   { label: "Python", color: "#FFD43B" },
   { label: "Javascript", color: "#F5A623" },
   { label: "Deployed", color: "#50E3C2" },
   { label: "AI", color: "#BD10E0" },
   { label: "Team Project", color: "#7ED321" },
   { label: "Simulator", color: "#F5A623" },
   { label: "Game", color: "#F5A623" },
   { label: "Educational", color: "#F5A623" },

 ];
 
 // Selected items (objects)
 const selected = [];
 
 const input = document.getElementById("filter-input");
 const dropdown = document.getElementById("dropdown");
 const tagContainer = document.getElementById("selected-tags");
 
 function showDropdown() {
   const query = input.value.toLowerCase();
   dropdown.innerHTML = "";
 
   const matches = OPTIONS.filter(opt =>
     opt.label.toLowerCase().includes(query) &&
     !selected.includes(opt)
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
 }
 
 function removeTag(label) {
   const index = selected.findIndex(t => t.label === label);
   if (index !== -1) selected.splice(index, 1);
   renderTags();
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
 