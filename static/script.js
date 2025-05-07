// Functions

function runTerminalSimulation(commands) {
    const container = document.getElementById("here");
    container.innerHTML = ""; // Clear previous content if any

    let cursor = document.createElement("span");
    cursor.className = "cursor";
    container.appendChild(cursor);

    // Start typing the first line after a short delay
    setTimeout(() => typeLineHeader(commands, container, cursor), 2000);
}
async function typeLineHeader(commands, container, cursor) {
    for (const { lineHeader, line } of commands) {
        // Create lineHeader element and add it to the container
        const lineHeaderElement = document.createElement("span");
        lineHeaderElement.className = "lineHeader";
        lineHeaderElement.textContent = lineHeader;
        container.insertBefore(lineHeaderElement, cursor);

        // Start typing the current line after a short delay
        await typeLine(line, container, cursor);

        // Add a break after the line is typed
        container.insertBefore(document.createElement("br"), cursor);
    }

    // After all lines are typed, show the server message
    setTimeout(() => {
        const serverMessage = document.createElement("span");
        serverMessage.textContent = "Server starting ...";
        container.insertBefore(serverMessage, cursor);
        container.insertBefore(document.createElement("br"), cursor);

        // Simulate hiding the splash screen after a short delay
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
                clearInterval(intervalId); // Stop typing when the line is complete
                resolve(); // Resolve the promise when done typing
            }
        }, 100); // Typing speed interval
    });
}
function runAfterTerminalSimulation() {
    const items = document.getElementsByClassName('car-item');
    if (items[0]) {
        items[0].classList.add('expanded');
        currentExpandedItem = items[0];
        console.log('item expanded');
    }

    const slider = document.getElementById('slider');
    const sitems = slider.children;
    let index = 0;
    const total = sitems.length;
    setInterval(() => {
      index = (index + 1) % total;
      slider.style.transform = `translateY(-${index * 2.8}rem)`;
    }, 3000); // change every 3 seconds
}
function loadMoreProjects() {
    const track = document.getElementById('carousel-track');
    if (!track) return;
    // Clone all project items
    const cloneItems = () => {
        const items = Array.from(track.children);
        items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
        });
    };
    cloneItems();
    let scrollAmount = 0;
    let animationId;
    function scrollCarousel() {
        scrollAmount += 1.1;
        if (scrollAmount >= track.scrollWidth / 2) {
        scrollAmount = 0;
        }
        track.style.transform = `translateX(-${scrollAmount}px)`;
        animationId = requestAnimationFrame(scrollCarousel);
    }
    function pauseCarousel() {
        cancelAnimationFrame(animationId);
    }
    function resumeCarousel() {
        animationId = requestAnimationFrame(scrollCarousel);
    }
    const wrapper = document.querySelector('.carousel-wrapper');
    wrapper.addEventListener('mouseenter', pauseCarousel);
    wrapper.addEventListener('mouseleave', resumeCarousel);
    // Start scrolling
    resumeCarousel();
}
function loadFeaturedProjects() {
    const carouselItems = [
        { label: 'RUBIKZ', bg: "url('./assets/rubikz.png')", link: 'https://rubikz-i5pj.vercel.app/' },
        { label: 'Budget-Co', bg: 'url(budget.jpg)', link: 'https://budget-co.up.railway.app/' },
        { label: 'Connect-4', bg: '', link: 'https://dallss.github.io/Minimax-Applications/connect-4' },
        { label: 'Chain-Reaction', bg: 'url(chain.jpg)', link: 'https://dallss.github.io/Minimax-Applications/chain-reaction' }
    ];
      
    const carousel = document.getElementById('carousel');
    let currentExpandedItem = null;
      
    carouselItems.forEach(({ label, bg, link }) => {
        const item = document.createElement('div');
        item.classList.add('car-item');
      
        // Create the anchor element
        const anchor = document.createElement('a');
        anchor.textContent = label;
        anchor.href = link;
        anchor.target = '_blank'; // optional: opens in new tab
        anchor.style.color = 'inherit'; // optional: preserve text color
        anchor.style.textDecoration = 'none';
      
        item.appendChild(anchor);
      
        if (bg) {
          item.style.backgroundImage = bg;
          item.style.backgroundSize = 'cover';
          item.style.backgroundPosition = 'center';
        }
      
        item.addEventListener('click', (e) => {
          // Avoid expanding when clicking the link
          if (e.target.tagName.toLowerCase() === 'a') return;
      
          if (item.classList.contains('expanded')) {
            item.classList.remove('expanded');
            currentExpandedItem = null;
          } else {
            if (currentExpandedItem) {
              currentExpandedItem.classList.remove('expanded');
            }
            item.classList.add('expanded');
            currentExpandedItem = item;
          }
        });
      
        carousel.appendChild(item);
    });
}



document.addEventListener("DOMContentLoaded", function () {
    // Example usage:
    const commands = [
        { lineHeader: "randall@Randalls-MacBook ~ % ", line: "cd ./randall" },
        { lineHeader: "randall@Randalls-MacBook/randall ~ % ", line: "ls -la" },
        { lineHeader: "randall@Randalls-MacBook/randall~ % ", line: "npm start" }
    ];

    if (!localStorage.getItem('terminalSimulationCalled')) {
        // Call the function the first time the page is loaded
        runTerminalSimulation(commands);
    
        // Store a flag in localStorage so it doesn't run again
        localStorage.setItem('terminalSimulationCalled', 'false');
    } else {
        document.getElementById("splash").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        setTimeout(()=>{
            runAfterTerminalSimulation();
        },500)
    }
    
    loadMoreProjects();
    loadFeaturedProjects();
});