function runTerminalSimulation(commands) {
   const container = document.getElementById("here");
   container.innerHTML = "";

   let cursor = document.createElement("span");
   cursor.className = "cursor";
   container.appendChild(cursor);

   setTimeout(() => typeLineHeader(commands, container, cursor), 2000);
}

async function typeLineHeader(commands, container, cursor) {
   for (const { lineHeader, line } of commands) {
       const lineHeaderElement = document.createElement("span");
       lineHeaderElement.className = "lineHeader";
       lineHeaderElement.textContent = lineHeader;
       container.insertBefore(lineHeaderElement, cursor);

       await typeLine(line, container, cursor);

       container.insertBefore(document.createElement("br"), cursor);
   }

   setTimeout(() => {
       const serverMessage = document.createElement("span");
       serverMessage.textContent = "Server starting ...";
       container.insertBefore(serverMessage, cursor);
       container.insertBefore(document.createElement("br"), cursor);

       setTimeout(() => {
           document.getElementById("splash").style.display = "none";
           document.getElementById("main-content").style.display = "block";

           runAfterTerminalSimulation();
       }, 2000);
   }, 1000);
}

async function typeLine(line, container, cursor) {
   return new Promise(resolve => {
       let charIndex = 0;

       const intervalId = setInterval(() => {
           if (charIndex < line.length) {
               cursor.insertAdjacentText("beforebegin", line[charIndex]);
               charIndex++;
           } else {
               clearInterval(intervalId);
               resolve();
           }
       }, 100);
   });
}

function runAfterTerminalSimulation() {
   setTimeout(() => {
       const items = document.getElementsByClassName("car-item");
       if (items[0]) items[0].click();
   }, 700);

   loadGitHubProfile("dallss", "github-profile");

   const readme_url =
       "https://raw.githubusercontent.com/Dallss/Dallss/refs/heads/main/README.md";
   fetch(readme_url)
       .then(res => res.text())
       .then(md => {
           document.getElementById("markdown").innerHTML = marked.parse(md);
       });

   const slider = document.getElementById("slider");
   const sitems = slider.children;
   let index = 0;
   const total = sitems.length;

   function getSlideHeight() {
       const firstItem = sitems[0];
       if (firstItem) {
           return firstItem.offsetHeight;
       }
       if (window.innerWidth <= 375) return 32;
       if (window.innerWidth <= 480) return 35.2;
       return 44.8;
   }

   setInterval(() => {
       index = (index + 1) % total;
       const slideHeight = getSlideHeight();
       slider.style.transform = `translateY(-${index * slideHeight}px)`;
   }, 3000);
}


// Main Hook
document.addEventListener("DOMContentLoaded", function () {

   console.log("ran terminal");
   const commands = [
      { lineHeader: "randall@Randalls-MacBook ~ % ", line: "cd ./personal-website" },
      { lineHeader: "randall@Randalls-MacBook/randall ~ % ", line: "ls -la" },
      { lineHeader: "randall@Randalls-MacBook/randall~ % ", line: "npm run dev" }
   ];

   if (!localStorage.getItem("terminalSimulationCalled")) {
      runTerminalSimulation(commands);
      localStorage.setItem("terminalSimulationCalled", "false");
   } else {
      document.getElementById("splash").style.display = "none";
      document.getElementById("main-content").style.display = "block";
      setTimeout(() => {
          runAfterTerminalSimulation();
      }, 0);
   }
});